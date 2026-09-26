import express from 'express';
import path from 'path';
import zlib from 'zlib';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { generateIntelligentFallbackAnalysis } from './server/fallbackAnalyzer';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Increase payload limit to support multi-page resume PDF & high-res image (JPG/PNG) uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Model candidate list: gemini-3.1-flash-lite has active separate quota, followed by gemini-3.8-flash
const CANDIDATE_MODELS = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];

// Supported Gemini multimodal inlineData MIME types
const GEMINI_INLINE_MIME_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
]);

function normalizeMimeType(mimeType?: string, fileName?: string): string {
  const lowerMime = (mimeType || '').toLowerCase().trim();
  const lowerName = (fileName || '').toLowerCase().trim();
  const ext = lowerName.includes('.') ? lowerName.split('.').pop() || '' : '';

  if (lowerMime === 'image/jpg' || ext === 'jpg' || ext === 'jpeg' || ext === 'jfif') {
    return 'image/jpeg';
  }
  if (lowerMime === 'image/png' || ext === 'png') {
    return 'image/png';
  }
  if (lowerMime === 'image/webp' || ext === 'webp') {
    return 'image/webp';
  }
  if (lowerMime === 'image/heic' || ext === 'heic') {
    return 'image/heic';
  }
  if (lowerMime === 'image/heif' || ext === 'heif') {
    return 'image/heif';
  }
  if (lowerMime === 'application/pdf' || ext === 'pdf') {
    return 'application/pdf';
  }
  return lowerMime || 'application/octet-stream';
}

function decodeXmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

/**
 * Extracts readable text from DOCX, ODT, DOC, RTF, TXT, HTML, or generic document buffers
 * so non-PDF/non-image documents can be analyzed seamlessly.
 */
function extractTextFromDocumentBuffer(base64Data: string, mimeType: string, fileName?: string): string {
  try {
    const buf = Buffer.from(base64Data, 'base64');
    const lowerName = (fileName || '').toLowerCase();
    const ext = lowerName.includes('.') ? lowerName.split('.').pop() || '' : '';

    // 1. Check if it's a ZIP container (DOCX / ODT start with PK\x03\x04)
    if (buf.length > 4 && buf[0] === 0x50 && buf[1] === 0x4b && buf[2] === 0x03 && buf[3] === 0x04) {
      const extractedSegments: string[] = [];
      let offset = 0;
      while (offset + 30 <= buf.length) {
        if (buf.readUInt32LE(offset) !== 0x04034b50) {
          offset++;
          continue;
        }
        const compressionMethod = buf.readUInt16LE(offset + 8);
        const compressedSize = buf.readUInt32LE(offset + 18);
        const fileNameLen = buf.readUInt16LE(offset + 26);
        const extraFieldLen = buf.readUInt16LE(offset + 28);
        const entryName = buf.subarray(offset + 30, offset + 30 + fileNameLen).toString('utf-8');
        const dataStart = offset + 30 + fileNameLen + extraFieldLen;

        // Find end of compressed data
        let dataEnd = compressedSize > 0 ? dataStart + compressedSize : dataStart;
        if (compressedSize === 0) {
          // Search for next PK signature
          let nextPk = dataStart;
          while (nextPk + 4 <= buf.length) {
            if (buf[nextPk] === 0x50 && buf[nextPk + 1] === 0x4b && (buf[nextPk + 2] === 0x03 || buf[nextPk + 2] === 0x01 || buf[nextPk + 2] === 0x07)) {
              break;
            }
            nextPk++;
          }
          dataEnd = nextPk;
        }

        if (
          entryName === 'word/document.xml' ||
          entryName === 'content.xml' ||
          entryName.startsWith('word/header') ||
          entryName.startsWith('word/footer')
        ) {
          try {
            const rawSlice = buf.subarray(dataStart, Math.min(dataEnd, buf.length));
            const xmlBuffer =
              compressionMethod === 8
                ? zlib.inflateRawSync(rawSlice)
                : compressionMethod === 0
                  ? rawSlice
                  : null;

            if (xmlBuffer) {
              const xmlStr = xmlBuffer.toString('utf-8');
              const cleaned = decodeXmlEntities(
                xmlStr
                  .replace(/<\/w:p>/g, '\n')
                  .replace(/<\/text:p>/g, '\n')
                  .replace(/<\/w:tr>/g, '\n')
                  .replace(/<w:tab\/>/g, ' ')
                  .replace(/<w:br[^>]*\/>/g, '\n')
                  .replace(/<[^>]+>/g, ' ')
              )
                .replace(/[ \t]+/g, ' ')
                .replace(/\n\s*\n/g, '\n')
                .trim();

              if (cleaned) {
                extractedSegments.push(cleaned);
              }
            }
          } catch {
            // Ignore individual XML entry decompression errors
          }
        }

        offset = Math.max(dataStart + 1, dataEnd);
      }

      if (extractedSegments.length > 0) {
        return extractedSegments.join('\n\n');
      }
    }

    // 2. Plain text, Markdown, CSV, JSON, HTML, RTF
    if (
      mimeType.startsWith('text/') ||
      ['txt', 'md', 'markdown', 'csv', 'json', 'xml', 'html', 'htm', 'rtf'].includes(ext)
    ) {
      let text = buf.toString('utf-8');
      if (ext === 'rtf' || mimeType.includes('rtf')) {
        text = text
          .replace(/\\par[d]?/g, '\n')
          .replace(/\{\\[^{}]+\}/g, ' ')
          .replace(/\\[a-z]+\d*\s?/gi, ' ')
          .replace(/[{}]/g, ' ');
      } else if (ext === 'html' || ext === 'htm' || mimeType === 'text/html') {
        text = text
          .replace(/<script[\s\S]*?<\/script>/gi, ' ')
          .replace(/<style[\s\S]*?<\/style>/gi, ' ')
          .replace(/<[^>]+>/g, ' ');
      }
      return text.replace(/\s+/g, ' ').trim();
    }

    // 3. Legacy .doc or unknown binary documents: extract printable ASCII & UTF-16 text runs
    const asciiMatches = buf.toString('latin1').match(/[A-Za-z0-9 ,.;:@/\-_()+#&'\n\r]{6,}/g) || [];
    const filtered = asciiMatches
      .map((s) => s.trim())
      .filter((s) => s.length >= 6 && /[A-Za-z]{3,}/.test(s) && !/^(MSWordDoc|Word\.Document|Normal\.dotm|Times New Roman|Calibri|Arial)/i.test(s));

    return filtered.join(' ').slice(0, 25000);
  } catch {
    return '';
  }
}

// Lazy-safe Gemini initialization
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Resilient multi-model execution helper
async function generateWithModelFallback(ai: GoogleGenAI, options: {
  contents: any;
  config?: any;
}) {
  let lastError: any = null;
  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: options.contents,
        config: options.config,
      });
      return { response, model };
    } catch (err: any) {
      console.warn(`Model ${model} encountered an issue:`, err?.message || err);
      lastError = err;
      const isQuotaOrRateLimit =
        err?.status === 'RESOURCE_EXHAUSTED' ||
        err?.message?.includes('429') ||
        err?.message?.includes('Quota exceeded') ||
        err?.message?.includes('RESOURCE_EXHAUSTED');
      
      if (!isQuotaOrRateLimit) {
        throw err;
      }
    }
  }
  throw lastError;
}

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Analyze Resume Endpoint (supports PDF, JPG, JPEG, PNG, WEBP, HEIC, DOCX, DOC, TXT, RTF, etc.)
app.post('/api/analyze', async (req, res) => {
  const {
    resumeText,
    pdfBase64,
    pdfMimeType,
    pdfFileName,
    attachments,
    targetRole,
    additionalSkills,
  } = req.body;

  if (!targetRole) {
    return res.status(400).json({ error: 'Target career or job role is required.' });
  }

  // Normalize attachments list from either `attachments` array or single `pdfBase64`
  const normalizedAttachments: Array<{
    name: string;
    mimeType: string;
    base64: string;
    extractedText?: string;
  }> = [];

  if (Array.isArray(attachments) && attachments.length > 0) {
    for (const att of attachments) {
      if (att && att.base64) {
        normalizedAttachments.push({
          name: att.name || 'resume-file',
          mimeType: normalizeMimeType(att.mimeType, att.name),
          base64: att.base64,
          extractedText: att.extractedText,
        });
      }
    }
  } else if (pdfBase64) {
    normalizedAttachments.push({
      name: pdfFileName || 'resume-document',
      mimeType: normalizeMimeType(pdfMimeType, pdfFileName),
      base64: pdfBase64,
    });
  }

  if (!resumeText && normalizedAttachments.length === 0) {
    return res.status(400).json({
      error: 'Please provide resume text or upload a resume file (PDF, JPG, JPEG, PNG, DOCX, TXT, etc.).',
    });
  }

  // Build combined extracted text for any non-inline documents (e.g. DOCX, DOC, TXT, RTF)
  const extractedTextSegments: string[] = [];
  if (resumeText && typeof resumeText === 'string' && resumeText.trim()) {
    extractedTextSegments.push(resumeText.trim());
  }

  const inlineParts: Array<{ inlineData: { mimeType: string; data: string } }> = [];

  for (const att of normalizedAttachments) {
    if (att.extractedText && att.extractedText.trim()) {
      extractedTextSegments.push(`--- Content from ${att.name} ---\n${att.extractedText.trim()}`);
    }

    if (GEMINI_INLINE_MIME_TYPES.has(att.mimeType)) {
      inlineParts.push({
        inlineData: {
          mimeType: att.mimeType,
          data: att.base64,
        },
      });
    } else {
      // Extract text on the server from DOCX, DOC, RTF, ODT, TXT, or other document formats
      const serverExtracted = extractTextFromDocumentBuffer(att.base64, att.mimeType, att.name);
      if (serverExtracted) {
        extractedTextSegments.push(`--- Extracted Content from ${att.name} ---\n${serverExtracted}`);
      }
    }
  }

  const combinedTextForAnalysis = extractedTextSegments.join('\n\n').trim();

  try {
    const ai = getGenAI();

    const systemPrompt = `You are an expert college career advisor and senior technical recruiter specializing in helping college students, freshers, and early-career job seekers.
Your task is to analyze the student's resume (provided as an uploaded document, image/photo/screenshot of a resume, or text) against their selected target career role: "${targetRole}".
${additionalSkills && additionalSkills.length > 0 ? `The student also mentioned having these additional current skills: ${additionalSkills.join(', ')}.` : ''}

You must provide a thorough, constructive, and beginner-friendly evaluation. Keep your explanations positive, encouraging, and clear (no corporate jargon or overly harsh critique).

Respond strictly with a JSON object matching this exact TypeScript structure:
{
  "matchScore": number (0 to 100 representing how well the current resume & skills match entry-level/fresher requirements for the role),
  "scoreLevel": string (one of: "Ready to Apply", "Strong Foundation", "Good Potential", "Early Stage"),
  "scoreSummary": string (2-3 sentences explaining what this score means for a fresher in this career path),
  "summary": string (a 2-4 sentence student-friendly summary of the candidate's current background, projects, and readiness),
  "strengths": string[] (3 to 5 clear existing strengths from their resume, e.g. good relevant projects, foundational knowledge, coursework, clear layout),
  "weaknesses": string[] (3 to 5 missing or weak skills/areas that need improvement for ${targetRole}),
  "suggestions": string[] (4 to 6 actionable, practical suggestions for polishing their resume),
  "skillGap": {
    "have": string[] (list of 5-10 key technical/soft skills the student already has based on the resume and provided skills),
    "develop": string[] (list of 4-8 high-priority skills the student should develop next specifically for ${targetRole}),
    "roleSkills": string[] (list of 6-10 essential skills commonly expected for a fresher/junior ${targetRole})
  },
  "roadmap": {
    "learnFirst": [
      {
        "title": string (foundation skill / topic to master first),
        "description": string (beginner-friendly explanation of why and how to learn it),
        "estimatedTime": string (e.g. "2-3 weeks"),
        "keyTopics": string[] (3-4 bullet concepts)
      }
    ],
    "learnNext": [
      {
        "title": string (intermediate tool / topic to tackle after basics),
        "description": string (beginner-friendly explanation of practical application),
        "estimatedTime": string (e.g. "3-4 weeks"),
        "keyTopics": string[] (3-4 bullet concepts)
      }
    ],
    "projects": [
      {
        "title": string (practical project idea freshers can realistically build for their portfolio),
        "description": string (what the project does and how it proves competence to recruiters),
        "techStack": string[] (e.g. ["React", "Tailwind", "REST API"]),
        "difficulty": string ("Beginner" | "Intermediate" | "Advanced"),
        "resumeTip": string (one key bullet point formula to put on their resume once finished)
      }
    ]
  },
  "wordingImprovements": [
    {
      "section": string (e.g. "Project: Campus App" or "Experience" or "Summary"),
      "original": string (an exact weak or vague line found in their resume, or a typical vague fresher bullet like 'Worked on a website using HTML'),
      "improved": string (an impactful, recruiter-friendly rewrite using Strong Action Verb + Context + Tool + Measurable Outcome/Metric),
      "reason": string (short explanation of why this revision makes an impact)
    }
  ],
  "extractedProfileName": string (student's name if detected, otherwise "Student")
}

Important Guidelines:
- The roadmap must have 2-3 "learnFirst" items, 2-3 "learnNext" items, and 2-3 "projects".
- Provide 3 to 5 "wordingImprovements" focusing on weak, passive, or metric-less bullet points from the student's resume.
- Keep tone empathetic, actionable, and student-focused.
- Output pure JSON only.`;

    const contents: any[] = [...inlineParts];

    contents.push({
      text: `Target Career Role: ${targetRole}
Additional Student Skills: ${additionalSkills?.join(', ') || 'None'}
Uploaded Files: ${normalizedAttachments.map((a) => `${a.name} (${a.mimeType})`).join(', ') || 'None'}
${combinedTextForAnalysis ? `\nCandidate Resume Text / Extracted Document Text:\n${combinedTextForAnalysis}\n` : ''}
Please carefully read all attached resume document(s), image(s), and text, and provide the complete analysis JSON according to instructions.`,
    });

    const { response } = await generateWithModelFallback(ai, {
      contents,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      const cleanJson = responseText.replace(/```json\n?|\n?```/g, '').trim();
      parsedData = JSON.parse(cleanJson);
    }

    return res.json(parsedData);
  } catch (err: any) {
    console.error('AI analysis encountered error, applying intelligent fallback:', err?.message || err);

    const fileNamesSummary = normalizedAttachments.map((a) => a.name).join(', ');
    const fallbackData = generateIntelligentFallbackAnalysis({
      resumeText:
        combinedTextForAnalysis ||
        `Applicant resume (${fileNamesSummary || 'uploaded document'}) applying for ${targetRole} with skills: ${(additionalSkills || []).join(', ')}`,
      targetRole,
      additionalSkills,
    });

    return res.json(fallbackData);
  }
});

// Improve specific bullet point endpoint
app.post('/api/improve-bullet', async (req, res) => {
  const { text, targetRole } = req.body;
  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: 'Text to improve is required.' });
  }

  try {
    const ai = getGenAI();

    const prompt = `You are a professional resume coach for college students and freshers.
The student wants to improve the following bullet point or section from their resume for a "${targetRole || 'Software Engineering'}" role:
"${text}"

Provide an improved version that follows the standard XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]" or "Action Verb + Technical Context + Tool + Measurable Impact/Result".
Even for academic or course projects, suggest realistic ways freshers can quantify or articulate impact.

Respond with pure JSON:
{
  "section": "Resume Bullet Point",
  "original": "${text.replace(/"/g, '\\"')}",
  "improved": "string (the polished, high-impact bullet point)",
  "reason": "string (why this revision catches recruiter attention)",
  "alternativeOptions": ["string (optional alternative style 1)", "string (optional alternative style 2)"]
}`;

    const { response } = await generateWithModelFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '{}';
    const cleanJson = responseText.replace(/```json\n?|\n?```/g, '').trim();
    const result = JSON.parse(cleanJson);
    return res.json(result);
  } catch (err: any) {
    console.error('Bullet polish error, generating heuristic rewrite:', err?.message || err);
    const trimmed = text.trim();
    const cleanOriginal = trimmed.replace(/^[-*•]\s*/, '');
    
    return res.json({
      section: 'Resume Bullet Point',
      original: cleanOriginal,
      improved: `Spearheaded implementation of ${cleanOriginal.toLowerCase().replace(/^(helped|worked on|created|built|did)\s*/i, '')}, applying modern engineering standards and decreasing processing overhead by 25%.`,
      reason: 'Replaces passive phrasing with high-impact action verbs and quantifies outcome to highlight technical ownership.',
      alternativeOptions: [
        `Engineered robust solution for ${cleanOriginal.toLowerCase().replace(/^(helped|worked on|created|built|did)\s*/i, '')}, streamlining project execution across team workflows.`,
        `Developed and benchmarked ${cleanOriginal.toLowerCase().replace(/^(helped|worked on|created|built|did)\s*/i, '')}, ensuring test coverage and clean repository documentation.`
      ]
    });
  }
});

// AI Chat for College Students Endpoint
app.post('/api/chat', async (req, res) => {
  const { messages, context } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required.' });
  }

  try {
    const ai = getGenAI();

    const systemInstruction = `You are "Coach AI", a supportive, knowledgeable, and practical career coach for college students, freshers, and career starters.
${
  context
    ? `Current Student Context:
- Target Role: ${context.targetRole || 'Not specified'}
- Skill Match Score: ${context.matchScore ? `${context.matchScore}%` : 'Not analyzed yet'}
- Background Summary: ${context.resumeSummary || 'Not provided'}
- Skills they have: ${context.skillsHave ? context.skillsHave.join(', ') : 'None listed'}
- Skills to develop: ${context.skillsMissing ? context.skillsMissing.join(', ') : 'None listed'}`
    : ''
}

Rules for Coach AI:
1. Speak in a friendly, encouraging, student-centric tone.
2. Provide concrete, actionable advice (recommend specific beginner-friendly tools, project concepts, free learning strategies, portfolio tips).
3. If they ask "What skills am I missing for this career?", refer to their target role and explain in simple terms why each skill matters.
4. If they ask "What project should I build?", give them a creative, achievable, and impressive project idea that solves a real problem.
5. If they ask "How can I improve my summary?", give them a clear formula with a tailored example they can adapt.
6. Keep answers concise, clear, and structured with clean bullet points. Avoid walls of text.`;

    const geminiContents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const { response } = await generateWithModelFallback(ai, {
      contents: geminiContents,
      config: {
        systemInstruction,
      },
    });

    const reply = response.text || 'I am here to help you improve your resume and skills! What would you like advice on?';
    return res.json({ reply });
  } catch (err: any) {
    console.error('Chat endpoint error, returning coach guidance:', err?.message || err);
    
    const lastUserMsg = [...messages].reverse().find((m: any) => m.role === 'user')?.content?.toLowerCase() || '';
    let reply = `Great question! When aiming for **${context?.targetRole || 'your target career'}**, recruiters look for practical proof of competence:`;

    if (lastUserMsg.includes('project')) {
      reply = `Here is a strong project recommendation for **${context?.targetRole || 'Software Engineering'}**:
- **Build a Full-Stack Portal or Dashboard**: Create a solution with authentication, live filtering, and database persistence (e.g. a campus club organizer or real-time tracker).
- **Recruiter Tip**: Deploy it on a free hosting platform (Vercel/Render) and include live demo & GitHub repository links directly on your resume.`;
    } else if (lastUserMsg.includes('skill') || lastUserMsg.includes('missing')) {
      const missing = context?.skillsMissing?.slice(0, 3)?.join(', ') || 'modern frameworks, automated testing, and cloud deployment';
      reply = `For **${context?.targetRole || 'your chosen role'}**, prioritize strengthening:
- **Core Priority**: ${missing}.
- **How to Practice**: Build small feature demos rather than just watching tutorials.
- **Resume Impact**: List these under a dedicated "Technical Skills" section grouped by category (Languages, Frameworks, Developer Tools).`;
    } else if (lastUserMsg.includes('summary') || lastUserMsg.includes('experience')) {
      reply = `Here is an impactful 3-line Summary formula for college students:
- **Line 1 (Identity)**: *"Computer Science student passionate about [Target Role] with strong fundamentals in [2-3 Top Skills]."*
- **Line 2 (Proof)**: *"Developed [Signature Project Name], implementing [Key Tech] and optimizing performance for [Result/Users]."*
- **Line 3 (Goal)**: *"Seeking an entry-level [Role] role to contribute clean code and learn from experienced engineering teams."*`;
    } else {
      reply = `For early career candidates pursuing **${context?.targetRole || 'tech roles'}**, remember:
- Focus on quantifiable project bullets (use action verbs and state results).
- Ensure your GitHub has clear README files for your top 2 projects.
- Master the fundamentals of data structures, clean code, and Git.`;
    }

    return res.json({ reply });
  }
});

// Vite middleware & Static Serving setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  function listen(port: number) {
    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`Resume & Skill Coach AI server running on http://localhost:${port}`);
    });
    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is in use, trying port ${port + 1}...`);
        listen(port + 1);
      } else {
        console.error('Server error:', err);
      }
    });
  }

  listen(PORT);
}

startServer();

import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Briefcase,
  Tag,
  X,
  Plus,
  Sparkles,
  FileCheck,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  FileSpreadsheet,
  FileCode
} from 'lucide-react';
import { CAREER_PRESETS, SAMPLE_RESUMES } from '../data/careerPresets';
import { UploadedDocument } from '../types';

interface ResumeInputSectionProps {
  onAnalyze: (payload: {
    resumeText: string;
    pdfBase64?: string;
    pdfMimeType?: string;
    pdfFileName?: string;
    attachments?: UploadedDocument[];
    targetRole: string;
    additionalSkills: string[];
  }) => void;
  isLoading: boolean;
}

const SUPPORTED_BADGES = ['PDF', 'JPG', 'JPEG', 'PNG', 'WEBP', 'DOCX', 'DOC', 'TXT', 'RTF'];

function getFileMetadata(file: File): {
  mimeType: string;
  category: UploadedDocument['category'];
  formatLabel: string;
  needsCanvasConversion: boolean;
} {
  const lowerName = file.name.toLowerCase();
  const ext = lowerName.includes('.') ? lowerName.split('.').pop() || '' : '';
  const rawType = (file.type || '').toLowerCase();

  // 1. PDF
  if (rawType === 'application/pdf' || ext === 'pdf') {
    return {
      mimeType: 'application/pdf',
      category: 'pdf',
      formatLabel: 'PDF Document',
      needsCanvasConversion: false,
    };
  }

  // 2. Images (JPG, JPEG, PNG, WEBP, HEIC, HEIF, GIF, BMP, SVG, TIFF, AVIF, JFIF)
  const imageExts = ['jpg', 'jpeg', 'jfif', 'png', 'webp', 'gif', 'bmp', 'heic', 'heif', 'svg', 'tif', 'tiff', 'avif'];
  if (rawType.startsWith('image/') || imageExts.includes(ext)) {
    if (ext === 'jpg' || ext === 'jpeg' || ext === 'jfif' || rawType === 'image/jpeg' || rawType === 'image/jpg') {
      return {
        mimeType: 'image/jpeg',
        category: 'image',
        formatLabel: ext === 'jpeg' ? 'JPEG Image' : 'JPG Image',
        needsCanvasConversion: false,
      };
    }
    if (ext === 'png' || rawType === 'image/png') {
      return {
        mimeType: 'image/png',
        category: 'image',
        formatLabel: 'PNG Image',
        needsCanvasConversion: false,
      };
    }
    if (ext === 'webp' || rawType === 'image/webp') {
      return {
        mimeType: 'image/webp',
        category: 'image',
        formatLabel: 'WEBP Image',
        needsCanvasConversion: false,
      };
    }
    if (ext === 'heic' || rawType === 'image/heic') {
      return {
        mimeType: 'image/heic',
        category: 'image',
        formatLabel: 'HEIC Image',
        needsCanvasConversion: false,
      };
    }
    if (ext === 'heif' || rawType === 'image/heif') {
      return {
        mimeType: 'image/heif',
        category: 'image',
        formatLabel: 'HEIF Image',
        needsCanvasConversion: false,
      };
    }
    // Other image formats (GIF, BMP, SVG, AVIF, TIFF) -> convert via canvas to PNG when possible
    return {
      mimeType: 'image/png',
      category: 'image',
      formatLabel: `${(ext || 'IMG').toUpperCase()} Image`,
      needsCanvasConversion: true,
    };
  }

  // 3. Word / Office documents (DOCX, DOC, ODT, RTF)
  if (
    ext === 'docx' ||
    rawType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return {
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      category: 'word',
      formatLabel: 'DOCX Document',
      needsCanvasConversion: false,
    };
  }
  if (ext === 'doc' || rawType === 'application/msword') {
    return {
      mimeType: 'application/msword',
      category: 'word',
      formatLabel: 'DOC Document',
      needsCanvasConversion: false,
    };
  }
  if (ext === 'rtf' || rawType === 'application/rtf' || rawType === 'text/rtf') {
    return {
      mimeType: 'application/rtf',
      category: 'word',
      formatLabel: 'RTF Document',
      needsCanvasConversion: false,
    };
  }
  if (ext === 'odt' || rawType.includes('opendocument')) {
    return {
      mimeType: 'application/vnd.oasis.opendocument.text',
      category: 'word',
      formatLabel: 'ODT Document',
      needsCanvasConversion: false,
    };
  }

  // 4. Plain text / Markdown / CSV / HTML / JSON
  const textExts = ['txt', 'md', 'markdown', 'csv', 'html', 'htm', 'json', 'xml'];
  if (rawType.startsWith('text/') || textExts.includes(ext)) {
    const mimeMap: Record<string, string> = {
      txt: 'text/plain',
      md: 'text/markdown',
      markdown: 'text/markdown',
      csv: 'text/csv',
      html: 'text/html',
      htm: 'text/html',
      json: 'text/plain',
      xml: 'text/plain',
    };
    return {
      mimeType: mimeMap[ext] || 'text/plain',
      category: 'text',
      formatLabel: `${(ext || 'TXT').toUpperCase()} Document`,
      needsCanvasConversion: false,
    };
  }

  // 5. Fallback for any other document uploaded by the user
  return {
    mimeType: rawType || 'application/octet-stream',
    category: 'other',
    formatLabel: ext ? `${ext.toUpperCase()} File` : 'Document File',
    needsCanvasConversion: false,
  };
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
    reader.readAsDataURL(file);
  });
}

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string) || '');
    reader.onerror = () => reject(new Error(`Failed to read text from ${file.name}`));
    reader.readAsText(file);
  });
}

function convertImageDataUrlToPng(dataUrl: string): Promise<{ base64: string; mimeType: string; previewUrl: string }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width || 1200;
        canvas.height = img.naturalHeight || img.height || 1600;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          const pngDataUrl = canvas.toDataURL('image/png');
          const base64 = pngDataUrl.split(',')[1] || '';
          resolve({ base64, mimeType: 'image/png', previewUrl: pngDataUrl });
          return;
        }
      } catch {
        // Fallback if canvas conversion fails
      }
      resolve({
        base64: dataUrl.split(',')[1] || '',
        mimeType: 'image/png',
        previewUrl: dataUrl,
      });
    };
    img.onerror = () => {
      resolve({
        base64: dataUrl.split(',')[1] || '',
        mimeType: 'image/png',
        previewUrl: dataUrl,
      });
    };
    img.src = dataUrl;
  });
}

export const ResumeInputSection: React.FC<ResumeInputSectionProps> = ({
  onAnalyze,
  isLoading,
}) => {
  const [inputMode, setInputMode] = useState<'upload' | 'paste' | 'samples'>('upload');
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('Frontend Developer');
  const [customRole, setCustomRole] = useState('');
  const [isCustomRole, setIsCustomRole] = useState(false);
  const [skills, setSkills] = useState<string[]>(['JavaScript', 'HTML/CSS', 'Git']);
  const [newSkillInput, setNewSkillInput] = useState('');

  // Multi-format file upload state
  const [uploadedFiles, setUploadedFiles] = useState<UploadedDocument[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Process one or multiple selected files of any document/image format
  const handleFilesSelected = async (fileList: FileList | File[]) => {
    setFileError(null);
    const filesArray = Array.from(fileList);
    if (filesArray.length === 0) return;

    const newDocs: UploadedDocument[] = [];

    for (const file of filesArray) {
      if (file.size > 20 * 1024 * 1024) {
        setFileError(`"${file.name}" exceeds the 20MB file size limit. Please upload a smaller file.`);
        continue;
      }

      try {
        const meta = getFileMetadata(file);
        const dataUrl = await readFileAsDataURL(file);
        let base64Data = dataUrl.split(',')[1] || '';
        let finalMimeType = meta.mimeType;
        let previewUrl = meta.category === 'image' ? dataUrl : undefined;
        let extractedText: string | undefined;

        if (meta.category === 'image' && meta.needsCanvasConversion) {
          const converted = await convertImageDataUrlToPng(dataUrl);
          base64Data = converted.base64;
          finalMimeType = converted.mimeType;
          previewUrl = converted.previewUrl;
        }

        if (meta.category === 'text') {
          extractedText = await readFileAsText(file);
        }

        newDocs.push({
          id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name: file.name,
          size: formatFileSize(file.size),
          base64: base64Data,
          mimeType: finalMimeType,
          category: meta.category,
          formatLabel: meta.formatLabel,
          previewUrl,
          extractedText,
        });
      } catch (err: any) {
        setFileError(err?.message || `Could not read file "${file.name}". Please try again.`);
      }
    }

    if (newDocs.length > 0) {
      setUploadedFiles((prev) => [...prev, ...newDocs]);
    }

    // Reset the input value so selecting the same file again works
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  const removeUploadedFile = (idToRemove: string) => {
    setUploadedFiles((prev) => prev.filter((doc) => doc.id !== idToRemove));
  };

  const clearAllFiles = () => {
    setUploadedFiles([]);
    setFileError(null);
  };

  const addSkill = () => {
    const trimmed = newSkillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSelectSample = (sample: typeof SAMPLE_RESUMES[0]) => {
    setResumeText(sample.text);
    setTargetRole(sample.targetRole);
    setIsCustomRole(false);
    setSkills(sample.skills);
    setUploadedFiles([]);
    setFileError(null);
    setInputMode('paste');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFileError(null);

    const effectiveRole = isCustomRole ? customRole.trim() : targetRole;
    if (!effectiveRole) {
      setFileError('Please choose or enter a target career role in Step 1.');
      return;
    }

    if (inputMode === 'upload' && uploadedFiles.length === 0 && !resumeText.trim()) {
      setFileError('Please upload your resume document or image (PDF, JPG, JPEG, PNG, DOCX, TXT, etc.), or switch to "Paste Text".');
      return;
    }

    if (inputMode === 'paste' && !resumeText.trim() && uploadedFiles.length === 0) {
      setFileError('Please paste your resume text or switch to "Upload File / Image" to upload a document.');
      return;
    }

    // Combine any client-extracted text from text documents with manually pasted text
    const extractedFromFiles = uploadedFiles
      .map((f) => f.extractedText)
      .filter(Boolean)
      .join('\n\n');

    const combinedResumeText = [resumeText.trim(), extractedFromFiles].filter(Boolean).join('\n\n');
    const primaryFile = uploadedFiles[0];

    onAnalyze({
      resumeText: combinedResumeText,
      pdfBase64: primaryFile?.base64,
      pdfMimeType: primaryFile?.mimeType,
      pdfFileName: primaryFile?.name,
      attachments: uploadedFiles,
      targetRole: effectiveRole,
      additionalSkills: skills,
    });
  };

  const activeRole = isCustomRole ? customRole : targetRole;
  const currentPreset = CAREER_PRESETS.find((p) => p.title === targetRole);

  const renderFileIcon = (doc: UploadedDocument) => {
    if (doc.category === 'image' && doc.previewUrl) {
      return (
        <img
          src={doc.previewUrl}
          alt={doc.name}
          className="w-11 h-11 rounded-lg object-cover border border-indigo-200 bg-white shrink-0"
        />
      );
    }
    if (doc.category === 'image') {
      return (
        <div className="w-11 h-11 rounded-lg bg-violet-600 text-white flex items-center justify-center shrink-0">
          <ImageIcon className="w-5 h-5" />
        </div>
      );
    }
    if (doc.category === 'word') {
      return (
        <div className="w-11 h-11 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
          <FileSpreadsheet className="w-5 h-5" />
        </div>
      );
    }
    if (doc.category === 'text') {
      return (
        <div className="w-11 h-11 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
          <FileCode className="w-5 h-5" />
        </div>
      );
    }
    return (
      <div className="w-11 h-11 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
        <FileCheck className="w-5 h-5" />
      </div>
    );
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-7 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <span>Start Your Skill & Resume Analysis</span>
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Designed for college students, fresh graduates, and career switchers to get actionable, beginner-friendly feedback.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* STEP 1: Target Role Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              1. Select Target Career or Job Role
            </span>
            <span className="text-xs text-slate-500 font-normal">What role are you targeting?</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {CAREER_PRESETS.map((preset) => {
              const isSelected = !isCustomRole && targetRole === preset.title;
              return (
                <button
                  type="button"
                  key={preset.title}
                  id={`role-btn-${preset.title.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => {
                    setIsCustomRole(false);
                    setTargetRole(preset.title);
                  }}
                  className={`px-3 py-2 rounded-xl text-left text-xs font-medium border transition-all ${
                    isSelected
                      ? 'bg-indigo-50/80 border-indigo-600 text-indigo-900 ring-2 ring-indigo-500/20 font-semibold'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{preset.title}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 ml-1" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom role toggle */}
          <div className="pt-1 flex items-center gap-3">
            <button
              type="button"
              id="custom-role-toggle-btn"
              onClick={() => setIsCustomRole(!isCustomRole)}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>{isCustomRole ? 'Choose from standard roles' : '+ Enter custom job role instead'}</span>
            </button>
            {isCustomRole && (
              <input
                type="text"
                id="custom-role-input"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                placeholder="e.g. Embedded Systems Engineer, Game Developer..."
                className="flex-1 text-xs border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            )}
          </div>
        </div>

        {/* STEP 2: Resume Input Method */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              2. Provide Your Resume
            </label>

            {/* Sub-tabs */}
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button
                type="button"
                id="input-mode-upload"
                onClick={() => setInputMode('upload')}
                className={`text-xs px-3 py-1 rounded-md font-medium transition-all ${
                  inputMode === 'upload'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Upload File / Image
              </button>
              <button
                type="button"
                id="input-mode-paste"
                onClick={() => setInputMode('paste')}
                className={`text-xs px-3 py-1 rounded-md font-medium transition-all ${
                  inputMode === 'paste'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Paste Text
              </button>
              <button
                type="button"
                id="input-mode-samples"
                onClick={() => setInputMode('samples')}
                className={`text-xs px-3 py-1 rounded-md font-medium transition-all ${
                  inputMode === 'samples'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Try Sample
              </button>
            </div>
          </div>

          {/* Mode 1: All-Format File & Image Upload */}
          {inputMode === 'upload' && (
            <div className="space-y-3">
              <input
                type="file"
                ref={fileInputRef}
                multiple
                onChange={(e) => e.target.files && handleFilesSelected(e.target.files)}
                accept="image/*,application/pdf,.pdf,.jpg,.jpeg,.jfif,.png,.webp,.gif,.bmp,.heic,.heif,.svg,.tif,.tiff,.avif,.doc,.docx,.rtf,.odt,.txt,.md,.csv,.html,.htm,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/*"
                className="hidden"
                id="resume-pdf-file-input"
              />

              {uploadedFiles.length === 0 ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-colors ${
                    isDragging
                      ? 'border-indigo-500 bg-indigo-50/50'
                      : 'border-slate-200 hover:border-indigo-400 bg-slate-50/60 hover:bg-indigo-50/20'
                  }`}
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-800">
                    Click to upload your Resume or drag and drop
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Upload PDF, photos/screenshots (JPG, JPEG, PNG, WEBP), Word docs (DOCX, DOC), or text files up to 20MB.
                  </p>
                  <div className="flex items-center justify-center flex-wrap gap-1.5 mt-3.5">
                    {SUPPORTED_BADGES.map((badge) => (
                      <span
                        key={badge}
                        className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-white text-slate-600 border border-slate-200 rounded-md shadow-2xs"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="space-y-2">
                    {uploadedFiles.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3.5 bg-indigo-50/60 border border-indigo-200 rounded-xl"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {renderFileIcon(doc)}
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate max-w-[180px] sm:max-w-xs md:max-w-md">
                              {doc.name}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                              <span>{doc.size}</span>
                              <span>•</span>
                              <span className="font-medium text-indigo-700">{doc.formatLabel} Ready</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => removeUploadedFile(doc.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Remove file"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action bar to add another page/image or replace */}
                  <div className="flex items-center justify-between pt-1 px-1">
                    <button
                      type="button"
                      id="add-more-files-btn"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add another page or file (JPG, PNG, PDF, DOCX...)</span>
                    </button>

                    {uploadedFiles.length > 1 && (
                      <button
                        type="button"
                        onClick={clearAllFiles}
                        className="text-xs font-medium text-slate-500 hover:text-rose-600"
                      >
                        Clear all ({uploadedFiles.length})
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mode 2: Paste Text */}
          {inputMode === 'paste' && (
            <div className="space-y-1.5">
              <textarea
                id="resume-text-area"
                rows={7}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste the full text of your resume here... (Include Education, Projects, Skills, and Experience)"
                className="w-full text-xs sm:text-sm font-mono border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:font-sans placeholder:text-slate-400 bg-slate-50/40"
              />
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span>Tip: Include coursework, tools, and project bullet points for accurate gap analysis.</span>
                <span>{resumeText.trim().split(/\s+/).filter(Boolean).length} words</span>
              </div>
            </div>
          )}

          {/* Mode 3: Try Samples */}
          {inputMode === 'samples' && (
            <div className="grid sm:grid-cols-2 gap-3">
              {SAMPLE_RESUMES.map((sample, idx) => (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-xl p-4 bg-slate-50/70 hover:bg-indigo-50/40 hover:border-indigo-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-md">
                      {sample.targetRole}
                    </span>
                    <h4 className="font-semibold text-slate-900 text-sm mt-2">{sample.name}</h4>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                      Contains typical coursework, 3 student projects, and club experience.
                    </p>
                  </div>
                  <button
                    type="button"
                    id={`load-sample-btn-${idx}`}
                    onClick={() => handleSelectSample(sample)}
                    className="mt-3 w-full py-1.5 px-3 bg-white hover:bg-indigo-600 hover:text-white border border-slate-200 hover:border-indigo-600 rounded-lg text-xs font-semibold text-slate-700 transition-colors"
                  >
                    Load This Resume Sample
                  </button>
                </div>
              ))}
            </div>
          )}

          {fileError && (
            <div className="flex items-center gap-2 text-xs text-rose-600 mt-2 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{fileError}</span>
            </div>
          )}
        </div>

        {/* STEP 3: Optional Current Skills */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="block text-sm font-semibold text-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-indigo-600" />
              3. Current Skills (Optional)
            </span>
            <span className="text-xs text-slate-500 font-normal">Add skills you know or are currently learning</span>
          </label>

          <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200 min-h-[44px]">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white text-slate-800 border border-slate-200 shadow-xs"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="text-slate-400 hover:text-rose-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            <div className="inline-flex items-center gap-1">
              <input
                type="text"
                id="skill-tag-input"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="+ Add skill (e.g. Python, SQL)..."
                className="text-xs bg-transparent border-none focus:outline-none px-2 py-1 text-slate-800 placeholder:text-slate-400 min-w-[150px]"
              />
              {newSkillInput && (
                <button
                  type="button"
                  id="add-skill-tag-btn"
                  onClick={addSkill}
                  className="p-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  <Plus className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Role skill suggestions */}
          {currentPreset && (
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-xs text-slate-500">Quick add for {currentPreset.title}:</span>
              {currentPreset.popularSkills.slice(0, 5).map((s) => {
                if (skills.includes(s)) return null;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSkills([...skills, s])}
                    className="text-[11px] font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-md border border-indigo-200/50"
                  >
                    + {s}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Submit Action */}
        <div className="pt-2">
          <button
            type="submit"
            id="analyze-submit-btn"
            disabled={isLoading}
            className={`w-full py-3.5 px-6 rounded-xl text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-all ${
              isLoading
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-indigo-200 hover:shadow-indigo-300'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Coach AI is analyzing your resume & skills...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Analyze Alignment for {activeRole || 'Selected Career'}</span>
              </>
            )}
          </button>
          <p className="text-center text-xs text-slate-500 mt-2">
            No sign-up required. Instant feedback on strengths, skill gaps, roadmap, and wording improvements.
          </p>
        </div>
      </form>
    </div>
  );
};

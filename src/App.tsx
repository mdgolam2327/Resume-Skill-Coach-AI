import React, { useState } from 'react';
import { 
  BarChart3, 
  Layers, 
  Compass, 
  FileEdit, 
  MessageSquare, 
  ArrowLeft, 
  AlertCircle, 
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { Header } from './components/Header';
import { ResumeInputSection } from './components/ResumeInputSection';
import { ScoreCard } from './components/ScoreCard';
import { SummaryStrengthsCard } from './components/SummaryStrengthsCard';
import { SkillGapSection } from './components/SkillGapSection';
import { RoadmapSection } from './components/RoadmapSection';
import { ImproveResumeSection } from './components/ImproveResumeSection';
import { ChatCoachSection } from './components/ChatCoachSection';
import { AnalysisResult, UploadedDocument } from './types';

export default function App() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [targetRole, setTargetRole] = useState<string>('Frontend Developer');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'skillgap' | 'roadmap' | 'improve' | 'chat'>('overview');

  const handleAnalyze = async (payload: {
    resumeText: string;
    pdfBase64?: string;
    pdfMimeType?: string;
    pdfFileName?: string;
    attachments?: UploadedDocument[];
    targetRole: string;
    additionalSkills: string[];
  }) => {
    setIsLoading(true);
    setErrorMessage(null);
    setTargetRole(payload.targetRole);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText: payload.resumeText,
          pdfBase64: payload.pdfBase64,
          pdfMimeType: payload.pdfMimeType,
          pdfFileName: payload.pdfFileName,
          attachments: payload.attachments?.map((att) => ({
            name: att.name,
            mimeType: att.mimeType,
            base64: att.base64,
            category: att.category,
            extractedText: att.extractedText,
          })),
          targetRole: payload.targetRole,
          additionalSkills: payload.additionalSkills,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to analyze resume. Please try again.');
      }

      const data: AnalysisResult = await response.json();
      setAnalysisResult(data);
      setActiveTab('overview');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(err.message || 'An unexpected error occurred while analyzing your resume.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setErrorMessage(null);
    setActiveTab('overview');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Header onReset={handleReset} hasResult={!!analysisResult} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl flex items-start gap-3 shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-sm">Analysis Request Failed</h4>
              <p className="text-xs text-rose-700 mt-0.5">{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-500 hover:text-rose-800 text-xs font-semibold px-2 py-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* VIEW 1: Input / Upload Stage */}
        {!analysisResult ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Quick Hero Banner */}
            <div className="text-center space-y-2 py-3 sm:py-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                Empowering College Students & Freshers
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                See How Your Resume Matches Your Dream Tech Career
              </h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
                Get an instant skill-match score, actionable skill gap roadmap, high-impact resume phrasing rewrites, and AI career coaching.
              </p>
            </div>

            <ResumeInputSection onAnalyze={handleAnalyze} isLoading={isLoading} />
          </div>
        ) : (
          /* VIEW 2: Analysis Results Dashboard */
          <div className="space-y-6">
            {/* Top Back / Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
              <button
                id="back-to-input-btn"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-indigo-600 self-start py-1 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Upload Another Resume</span>
              </button>

              <div className="flex items-center gap-2 text-xs text-slate-500 self-start sm:self-auto">
                <span>Target Role:</span>
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 font-bold text-indigo-900 border border-indigo-200/60">
                  {targetRole}
                </span>
              </div>
            </div>

            {/* Scorecard Component */}
            <ScoreCard result={analysisResult} targetRole={targetRole} />

            {/* Navigation Tabs for Mobile & Desktop */}
            <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-xs overflow-x-auto no-scrollbar gap-1">
              <button
                id="tab-overview"
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Overview & Strengths</span>
              </button>

              <button
                id="tab-skillgap"
                type="button"
                onClick={() => setActiveTab('skillgap')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'skillgap'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Skill Gap Breakdown</span>
              </button>

              <button
                id="tab-roadmap"
                type="button"
                onClick={() => setActiveTab('roadmap')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'roadmap'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Learning Roadmap</span>
              </button>

              <button
                id="tab-improve"
                type="button"
                onClick={() => setActiveTab('improve')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'improve'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <FileEdit className="w-4 h-4" />
                <span>Improve My Resume</span>
              </button>

              <button
                id="tab-chat"
                type="button"
                onClick={() => setActiveTab('chat')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'chat'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Ask Coach AI</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="transition-all">
              {activeTab === 'overview' && (
                <div className="space-y-6 animate-fade-in">
                  <SummaryStrengthsCard result={analysisResult} />
                </div>
              )}

              {activeTab === 'skillgap' && (
                <div className="animate-fade-in">
                  <SkillGapSection skillGap={analysisResult.skillGap} targetRole={targetRole} />
                </div>
              )}

              {activeTab === 'roadmap' && (
                <div className="animate-fade-in">
                  <RoadmapSection roadmap={analysisResult.roadmap} targetRole={targetRole} />
                </div>
              )}

              {activeTab === 'improve' && (
                <div className="animate-fade-in">
                  <ImproveResumeSection
                    improvements={analysisResult.wordingImprovements}
                    targetRole={targetRole}
                  />
                </div>
              )}

              {activeTab === 'chat' && (
                <div className="animate-fade-in">
                  <ChatCoachSection targetRole={targetRole} result={analysisResult} />
                </div>
              )}
            </div>

          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/70 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Resume & Skill Coach AI • Practical Guidance for College Students & Freshers</span>
          <span>Powered by MD GOLAM SUBHANI</span>
        </div>
      </footer>
    </div>
  );
}

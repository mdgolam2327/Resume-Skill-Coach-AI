import React, { useState } from 'react';
import { 
  FileEdit, 
  Copy, 
  Check, 
  Sparkles, 
  ArrowRight, 
  AlertCircle, 
  Send,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { WordingImprovement } from '../types';

interface ImproveResumeSectionProps {
  improvements: WordingImprovement[];
  targetRole: string;
}

export const ImproveResumeSection: React.FC<ImproveResumeSectionProps> = ({
  improvements: initialImprovements,
  targetRole,
}) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedCustom, setCopiedCustom] = useState(false);

  // Custom bullet rewrite state
  const [customInput, setCustomInput] = useState('');
  const [isPolishing, setIsPolishing] = useState(false);
  const [customResult, setCustomResult] = useState<{
    original: string;
    improved: string;
    reason: string;
    alternativeOptions?: string[];
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const copyToClipboard = (text: string, idx?: number) => {
    navigator.clipboard.writeText(text);
    if (idx !== undefined) {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } else {
      setCopiedCustom(true);
      setTimeout(() => setCopiedCustom(false), 2000);
    }
  };

  const handleCustomPolish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    setIsPolishing(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/improve-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: customInput.trim(), targetRole }),
      });

      if (!res.ok) {
        throw new Error('Failed to improve wording. Please try again.');
      }

      const data = await res.json();
      setCustomResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error communicating with coach.');
    } finally {
      setIsPolishing(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FileEdit className="w-4 h-4" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            "Improve My Resume" Wording Polisher
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Transform passive, generic student bullet points into high-impact, recruiter-friendly accomplishments
        </p>
      </div>

      {/* 1. Pre-analyzed Weak Bullets from Candidate's Resume */}
      <div className="space-y-4">
        <h4 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          Weak Phrases Identified in Your Resume
        </h4>

        {initialImprovements && initialImprovements.length > 0 ? (
          <div className="space-y-4">
            {initialImprovements.map((item, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-white hover:border-indigo-300 transition-all shadow-xs"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-700">
                    {item.section || 'Resume Section'}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(item.improved, idx)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-md transition-colors"
                  >
                    {copiedIdx === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Improved Wording</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-3 mt-3">
                  {/* Original */}
                  <div className="bg-rose-50/50 border border-rose-200/70 rounded-lg p-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block mb-1">
                      Before (Weak / Passive)
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 italic">
                      "{item.original}"
                    </p>
                  </div>

                  {/* Improved */}
                  <div className="bg-emerald-50/50 border border-emerald-200/70 rounded-lg p-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                      After (High Impact & Recruiter-Ready)
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-emerald-950">
                      "{item.improved}"
                    </p>
                  </div>
                </div>

                {item.reason && (
                  <div className="mt-2.5 flex items-start gap-1.5 text-xs text-slate-600 bg-white p-2 rounded-md border border-slate-100">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-700">Why this works: </strong>
                      {item.reason}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500">
            No specific weak bullet points flagged. You can polish any custom bullet below!
          </p>
        )}
      </div>

      {/* 2. Interactive Live Bullet Polisher */}
      <div className="pt-4 border-t border-slate-200">
        <div className="bg-gradient-to-br from-indigo-50/70 via-slate-50 to-purple-50/40 border border-indigo-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h4 className="font-bold text-sm sm:text-base text-slate-900">
              Polish Any Line From Your Resume
            </h4>
          </div>
          <p className="text-xs text-slate-600 mb-3">
            Paste any bullet point or summary phrase you feel is too weak. Coach AI will rewrite it with active verbs and measurable outcomes.
          </p>

          <form onSubmit={handleCustomPolish} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                id="custom-bullet-input"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="e.g. 'Helped create website for class project using JavaScript' or 'Answered student questions in lab'"
                className="flex-1 text-xs sm:text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <button
                type="submit"
                id="custom-bullet-submit-btn"
                disabled={isPolishing || !customInput.trim()}
                className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white flex items-center gap-1.5 shrink-0 transition-all ${
                  isPolishing || !customInput.trim()
                    ? 'bg-indigo-300 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-sm'
                }`}
              >
                {isPolishing ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>Rewrite Line</span>
              </button>
            </div>
          </form>

          {errorMsg && (
            <p className="text-xs text-rose-600 mt-2">{errorMsg}</p>
          )}

          {/* Custom Polish Result */}
          {customResult && (
            <div className="mt-4 bg-white border border-emerald-200 rounded-xl p-4 shadow-xs space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Recommended Rewrite
                </span>
                <button
                  type="button"
                  id="copy-custom-bullet-btn"
                  onClick={() => copyToClipboard(customResult.improved)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md"
                >
                  {copiedCustom ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy to Clipboard</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-sm font-semibold text-slate-900 bg-emerald-50/40 p-3 rounded-lg border border-emerald-100/60">
                "{customResult.improved}"
              </p>

              <p className="text-xs text-slate-600">
                <strong className="text-slate-800">Recruiter impact: </strong>
                {customResult.reason}
              </p>

              {customResult.alternativeOptions && customResult.alternativeOptions.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Alternative Variations:
                  </span>
                  <div className="space-y-1">
                    {customResult.alternativeOptions.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className="text-xs text-slate-700 bg-slate-50 p-2 rounded flex items-center justify-between gap-2"
                      >
                        <span>"{opt}"</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(opt)}
                          className="text-[11px] text-indigo-600 hover:underline shrink-0"
                        >
                          Copy
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

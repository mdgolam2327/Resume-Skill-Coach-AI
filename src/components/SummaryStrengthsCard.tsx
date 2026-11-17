import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  UserCheck, 
  Star, 
  ArrowUpRight 
} from 'lucide-react';
import { AnalysisResult } from '../types';

interface SummaryStrengthsCardProps {
  result: AnalysisResult;
}

export const SummaryStrengthsCard: React.FC<SummaryStrengthsCardProps> = ({ result }) => {
  return (
    <div className="space-y-6">
      {/* 1. Resume Summary Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Resume Profile Summary
            </h3>
            <p className="text-xs text-slate-500">
              Candidate overview from a campus recruiter's perspective
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-100 font-normal">
          {result.summary || 'Summary unavailable.'}
        </p>
      </div>

      {/* 2. Grid of Strengths and Areas for Improvement */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Existing Strengths */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-100/80 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Existing Strengths
                </h3>
                <p className="text-xs text-slate-500">
                  Assets and qualities working well on your resume
                </p>
              </div>
            </div>

            <ul className="space-y-2.5">
              {result.strengths && result.strengths.length > 0 ? (
                result.strengths.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200/60">
                      <Star className="w-3 h-3 fill-emerald-500" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs text-slate-500">No specific strengths found.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Missing or Weak Areas */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-100/80 text-amber-700 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Areas That Could Be Improved
                </h3>
                <p className="text-xs text-slate-500">
                  Gaps or weaknesses that may hold your resume back
                </p>
              </div>
            </div>

            <ul className="space-y-2.5">
              {result.weaknesses && result.weaknesses.length > 0 ? (
                result.weaknesses.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5 border border-amber-200/60">
                      <span className="text-[10px] font-bold">!</span>
                    </div>
                    <span>{item}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs text-slate-500">No critical weaknesses identified.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Suggestions for Improving the Resume */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-indigo-100/80 text-indigo-700 flex items-center justify-center">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Practical Suggestions for Polishing Your Resume
            </h3>
            <p className="text-xs text-slate-500">
              Step-by-step recommendations tailored for student and fresher resumes
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {result.suggestions && result.suggestions.length > 0 ? (
            result.suggestions.map((suggestion, idx) => (
              <div
                key={idx}
                className="bg-indigo-50/40 border border-indigo-100/80 rounded-xl p-3.5 flex items-start gap-2.5"
              >
                <span className="w-5 h-5 rounded-md bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-snug">
                  {suggestion}
                </p>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500">No suggestions available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

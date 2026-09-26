import React from 'react';
import { Target, CheckCircle2, TrendingUp, Sparkles, BookOpen, Layers } from 'lucide-react';
import { AnalysisResult } from '../types';

interface ScoreCardProps {
  result: AnalysisResult;
  targetRole: string;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ result, targetRole }) => {
  const score = Math.max(0, Math.min(100, result.matchScore || 50));

  // Determine badge color and description
  let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let ringColor = '#10b981'; // emerald-500
  let levelTitle = result.scoreLevel || 'Strong Foundation';

  if (score < 45) {
    badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
    ringColor = '#f59e0b'; // amber-500
  } else if (score < 70) {
    badgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
    ringColor = '#3b82f6'; // blue-500
  }

  // Calculate SVG circle progress
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
      <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
        
        {/* Left: Score Gauge and Status */}
        <div className="flex items-center gap-5 w-full md:w-auto">
          <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-slate-100"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke={ringColor}
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-slate-900 leading-none">
                {score}%
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1">
                Match
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeColor}`}>
                {levelTitle}
              </span>
              <span className="text-xs text-slate-400">• Fresher Alignment</span>
              {result.isRateLimitedFallback && (
                <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200">
                  Career Engine Mode
                </span>
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1.5 flex items-center gap-1.5">
              <span>{targetRole}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md">
              {result.scoreSummary || 'Good alignment with key concepts. Closing the identified skill gaps will make your resume interview-ready.'}
            </p>
          </div>
        </div>

        {/* Right: Quick Breakdown Pills */}
        <div className="grid grid-cols-3 gap-3 w-full md:w-auto shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
          <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-emerald-700 font-bold text-base sm:text-lg">
              <CheckCircle2 className="w-4 h-4" />
              <span>{result.skillGap?.have?.length || 0}</span>
            </div>
            <p className="text-[11px] font-medium text-emerald-800 mt-0.5">Skills Matched</p>
          </div>

          <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-amber-700 font-bold text-base sm:text-lg">
              <TrendingUp className="w-4 h-4" />
              <span>{result.skillGap?.develop?.length || 0}</span>
            </div>
            <p className="text-[11px] font-medium text-amber-800 mt-0.5">Skills to Build</p>
          </div>

          <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-indigo-700 font-bold text-base sm:text-lg">
              <Sparkles className="w-4 h-4" />
              <span>{result.roadmap?.projects?.length || 0}</span>
            </div>
            <p className="text-[11px] font-medium text-indigo-800 mt-0.5">Portfolio Ideas</p>
          </div>
        </div>

      </div>

      {/* Student encouraging note */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-start gap-2.5 text-xs text-slate-600 bg-slate-50/80 p-3 rounded-xl">
        <Target className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-800">Fresher Tip: </span>
          <span>
            Junior and campus recruiters do not expect 100% mastery of every library. They look for solid fundamentals, eagerness to learn, and 2-3 genuine projects proving you can build.
          </span>
        </div>
      </div>
    </div>
  );
};

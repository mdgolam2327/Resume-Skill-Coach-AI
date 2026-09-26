import React, { useState } from 'react';
import { 
  Compass, 
  Clock, 
  BookOpen, 
  Code, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  FolderGit2
} from 'lucide-react';
import { LearningRoadmap } from '../types';

interface RoadmapSectionProps {
  roadmap: LearningRoadmap;
  targetRole: string;
}

export const RoadmapSection: React.FC<RoadmapSectionProps> = ({ roadmap, targetRole }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'first' | 'next' | 'projects'>('all');

  const learnFirst = roadmap?.learnFirst || [];
  const learnNext = roadmap?.learnNext || [];
  const projects = roadmap?.projects || [];

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Beginner-Friendly Learning Roadmap
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            A step-by-step path to becoming a qualified fresher {targetRole} without getting overwhelmed
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'all'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Steps
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('first')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'first'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Learn First
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('next')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'next'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Learn Next
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'projects'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3. Project Ideas
          </button>
        </div>
      </div>

      {/* PHASE 1: What to Learn First */}
      {(activeTab === 'all' || activeTab === 'first') && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-xs">
              Phase 1
            </span>
            <h4 className="font-bold text-sm sm:text-base text-slate-800">
              What to Learn First (Core Foundations)
            </h4>
            <span className="text-xs text-slate-400">Master these before moving on</span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {learnFirst.map((step, idx) => (
              <div
                key={idx}
                className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between hover:bg-emerald-50/20 hover:border-emerald-200 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    {step.estimatedTime && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {step.estimatedTime}
                      </span>
                    )}
                  </div>
                  <h5 className="font-bold text-slate-900 text-sm">{step.title}</h5>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {step.keyTopics && step.keyTopics.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200/60">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      Key Topics:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {step.keyTopics.map((topic, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[11px] px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PHASE 2: What to Learn Next */}
      {(activeTab === 'all' || activeTab === 'next') && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold text-xs">
              Phase 2
            </span>
            <h4 className="font-bold text-sm sm:text-base text-slate-800">
              What to Learn Next (Intermediate Concepts & Tooling)
            </h4>
            <span className="text-xs text-slate-400">Takes you from student to hireable</span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {learnNext.map((step, idx) => (
              <div
                key={idx}
                className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between hover:bg-blue-50/20 hover:border-blue-200 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    {step.estimatedTime && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {step.estimatedTime}
                      </span>
                    )}
                  </div>
                  <h5 className="font-bold text-slate-900 text-sm">{step.title}</h5>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {step.keyTopics && step.keyTopics.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200/60">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      Key Topics:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {step.keyTopics.map((topic, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[11px] px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PHASE 3: Suggested Project Ideas */}
      {(activeTab === 'all' || activeTab === 'projects') && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-bold text-xs">
              Phase 3
            </span>
            <h4 className="font-bold text-sm sm:text-base text-slate-800">
              Suggested Project Ideas for Building Experience
            </h4>
            <span className="text-xs text-slate-400">Practical portfolio pieces freshers can showcase</span>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {projects.map((project, idx) => {
              const diffColors = {
                Beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                Intermediate: 'bg-blue-50 text-blue-700 border-blue-200',
                Advanced: 'bg-purple-50 text-purple-700 border-purple-200',
              }[project.difficulty] || 'bg-slate-50 text-slate-700 border-slate-200';

              return (
                <div
                  key={idx}
                  className="bg-indigo-50/20 border border-indigo-100 rounded-xl p-4 flex flex-col justify-between hover:border-indigo-300 transition-all shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-semibold text-indigo-700 flex items-center gap-1">
                        <FolderGit2 className="w-3.5 h-3.5" />
                        Project #{idx + 1}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${diffColors}`}>
                        {project.difficulty}
                      </span>
                    </div>

                    <h5 className="font-bold text-slate-900 text-sm sm:text-base">
                      {project.title}
                    </h5>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Tech stack */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {project.techStack?.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-100/70 text-indigo-800"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Resume bullet tip */}
                  <div className="mt-4 pt-3 border-t border-indigo-100/80 bg-white/80 p-2.5 rounded-lg">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      How to frame this on your resume:
                    </span>
                    <p className="text-xs text-slate-700 italic">
                      "{project.resumeTip}"
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

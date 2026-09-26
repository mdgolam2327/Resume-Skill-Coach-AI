import React, { useState } from 'react';
import { CheckCircle2, TrendingUp, Briefcase, Filter, Search } from 'lucide-react';
import { SkillGapData } from '../types';

interface SkillGapSectionProps {
  skillGap: SkillGapData;
  targetRole: string;
}

export const SkillGapSection: React.FC<SkillGapSectionProps> = ({ skillGap, targetRole }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filterList = (list: string[] = []) => {
    if (!searchTerm.trim()) return list;
    return list.filter((item) => item.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  const haveList = filterList(skillGap?.have);
  const developList = filterList(skillGap?.develop);
  const roleSkillsList = filterList(skillGap?.roleSkills);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Skill Gap Breakdown</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Compare what you currently know with what employers look for in a fresher {targetRole}
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-56">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="skill-gap-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter skills..."
            className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* 3 Core Cards */}
      <div className="grid md:grid-cols-3 gap-5">
        
        {/* Card 1: Skills I Already Have */}
        <div className="bg-emerald-50/40 border border-emerald-200/80 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm sm:text-base text-emerald-950">
                  Skills I Already Have
                </h4>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {haveList.length}
              </span>
            </div>
            <p className="text-xs text-emerald-800/80 mb-4">
              Verified from your resume coursework, tools, and experiences.
            </p>

            <div className="flex flex-wrap gap-1.5">
              {haveList.length > 0 ? (
                haveList.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white text-emerald-900 border border-emerald-200 shadow-xs"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{skill}</span>
                  </span>
                ))
              ) : (
                <p className="text-xs text-emerald-700 italic">
                  {searchTerm ? 'No matching skills found' : 'No confirmed skills detected.'}
                </p>
              )}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-emerald-200/60 text-[11px] text-emerald-800">
            Keep these highlighted prominently in your Technical Skills section!
          </div>
        </div>

        {/* Card 2: Skills I Should Develop */}
        <div className="bg-amber-50/40 border border-amber-200/80 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm sm:text-base text-amber-950">
                  Skills I Should Develop
                </h4>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {developList.length}
              </span>
            </div>
            <p className="text-xs text-amber-800/80 mb-4">
              Key missing competencies that will boost your callback rate for this role.
            </p>

            <div className="flex flex-wrap gap-1.5">
              {developList.length > 0 ? (
                developList.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white text-amber-900 border border-amber-200 shadow-xs"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>{skill}</span>
                  </span>
                ))
              ) : (
                <p className="text-xs text-amber-700 italic">
                  {searchTerm ? 'No matching skills found' : 'No major skill gaps identified.'}
                </p>
              )}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-amber-200/60 text-[11px] text-amber-800">
            Target these in your upcoming projects and online tutorials below!
          </div>
        </div>

        {/* Card 3: Skills Useful for Career Role */}
        <div className="bg-indigo-50/40 border border-indigo-200/80 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm sm:text-base text-indigo-950">
                  Essential for {targetRole}
                </h4>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                {roleSkillsList.length}
              </span>
            </div>
            <p className="text-xs text-indigo-800/80 mb-4">
              Standard core tech stack and skills industry managers expect freshers to recognize.
            </p>

            <div className="flex flex-wrap gap-1.5">
              {roleSkillsList.length > 0 ? (
                roleSkillsList.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white text-indigo-900 border border-indigo-200 shadow-xs"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <span>{skill}</span>
                  </span>
                ))
              ) : (
                <p className="text-xs text-indigo-700 italic">
                  {searchTerm ? 'No matching skills found' : 'Role competencies.'}
                </p>
              )}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-indigo-200/60 text-[11px] text-indigo-800">
            Benchmark your resume against this full industry skillset.
          </div>
        </div>

      </div>
    </div>
  );
};

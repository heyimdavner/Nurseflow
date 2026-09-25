import React, { useState } from 'react';
import { 
  Stethoscope, 
  Search, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Award, 
  Plus, 
  Filter, 
  Layers, 
  AlertCircle,
  HelpCircle,
  Clock,
  UserCheck
} from 'lucide-react';
import { useNurseFlow } from '../../context/NurseFlowContext';
import { ClinicalProcedure } from '../../types';

export const ClinicalSkillsTab: React.FC = () => {
  const { 
    procedures, 
    user, 
    toggleLecturerDemo, 
    toggleReturnDemo, 
    addCustomProcedure 
  } = useNurseFlow();

  const [selectedSemester, setSelectedSemester] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingProcedure, setIsAddingProcedure] = useState(false);

  // New procedure form state
  const [newProcName, setNewProcName] = useState('');
  const [newProcCategory, setNewProcCategory] = useState('Fundamental Nursing');
  const [newProcSemester, setNewProcSemester] = useState<number>(1);

  // Filter & Search
  const filteredProcedures = procedures.filter(proc => {
    const matchesSem = selectedSemester === 'all' || proc.semester === selectedSemester;
    const matchesSearch = searchQuery === '' || 
      proc.procedureName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proc.moduleCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSem && matchesSearch;
  });

  const getCompletedDemosCount = (p: ClinicalProcedure) => {
    let count = 0;
    if (p.returnDemo1Date) count++;
    if (p.returnDemo2Date) count++;
    if (p.returnDemo3Date) count++;
    return count;
  };

  // Calculate master statistics
  const totalProcedures = procedures.length;
  const demonstratedCount = procedures.filter(p => p.demonstratedByLecturer).length;
  const fullyMasteredCount = procedures.filter(p => getCompletedDemosCount(p) === 3).length;
  const activeInTrainingCount = procedures.filter(p => p.demonstratedByLecturer && getCompletedDemosCount(p) < 3).length;

  const handleCreateProcedure = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProcName.trim()) return;

    addCustomProcedure({
      procedureName: newProcName.trim(),
      moduleCode: newProcCategory,
      semester: newProcSemester,
      demonstratedByLecturer: false,
      practiced: false
    });

    setNewProcName('');
    setIsAddingProcedure(false);
  };

  return (
    <div id="clinical-skills-tab-container" className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. HEADER & CLINICAL MASTERY GAUGES */}
      <div 
        id="clinical-skills-header-card"
        className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-xl"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-white/10 text-cyan-400">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">Clinical Skills &amp; OSCA Log</h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1 italic">
              Curriculum return demonstration checklist with lecturer demonstration lock &amp; priority smart sorting.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-center backdrop-blur-sm">
              <span className="text-base font-black text-cyan-300 font-mono">{fullyMasteredCount} / {totalProcedures}</span>
              <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">Fully Mastered (3/3)</p>
            </div>

            <div className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-center backdrop-blur-sm">
              <span className="text-base font-black text-amber-300 font-mono">{activeInTrainingCount}</span>
              <p className="text-[10px] uppercase tracking-wider text-amber-400 font-medium">In Active Practice</p>
            </div>

            <div className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-center backdrop-blur-sm">
              <span className="text-base font-black text-teal-300 font-mono">{demonstratedCount}</span>
              <p className="text-[10px] uppercase tracking-wider text-teal-400 font-medium">Lecturer Verified</p>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-6 pt-5 border-t border-white/10">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="procedure-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search procedures (e.g. Catheter, Injection, Dressing)..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>

          {/* Semester Filter Pills */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 overflow-x-auto backdrop-blur-sm">
            <button
              onClick={() => setSelectedSemester('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedSemester === 'all'
                  ? 'bg-white/15 text-cyan-300 border border-white/10 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              All Semesters
            </button>
            {[1, 2, 3, 4, 5, 6].map((sem) => (
              <button
                key={sem}
                onClick={() => setSelectedSemester(sem)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  selectedSemester === sem
                    ? 'bg-white/15 text-cyan-300 border border-white/10 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Sem {sem}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. PROCEDURE CHECK-OFF CARDS GRID (PRIORITY SMART SORTED) */}
      <div className="space-y-3">
        {filteredProcedures.length === 0 ? (
          <div className="p-12 rounded-2xl bg-white/5 border border-white/10 text-center text-xs text-zinc-400 backdrop-blur-sm">
            No procedures matching your filter or search query.
          </div>
        ) : (
          filteredProcedures.map((proc) => {
            const isDemonstrated = proc.demonstratedByLecturer;
            const completedDemos = getCompletedDemosCount(proc);
            const isMastered = completedDemos === 3;
            const isInActiveTraining = isDemonstrated && !isMastered;

            return (
              <div
                key={proc.id}
                id={`procedure-card-${proc.id}`}
                className={`rounded-2xl p-4 sm:p-5 border transition-all backdrop-blur-sm ${
                  isMastered
                    ? 'bg-emerald-500/10 border-emerald-500/30 shadow-sm'
                    : isInActiveTraining
                      ? 'bg-cyan-500/10 border-cyan-500/30 shadow-md'
                      : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Left: Procedure Name & Category */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-cyan-300 border border-white/10">
                        Sem {proc.semester}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/5 text-zinc-300 border border-white/5">
                        {proc.moduleCode}
                      </span>

                      {/* Dynamic Mastery Badge */}
                      {isMastered && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm animate-in zoom-in-95">
                          <Sparkles className="w-3 h-3 text-emerald-400" />
                          <span>3/3 Mastered</span>
                        </span>
                      )}

                      {isInActiveTraining && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                          <span>Active Ward Practice ({completedDemos}/3)</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                      {proc.procedureName}
                    </h3>
                  </div>

                  {/* Right: Lecturer Lock + 3 Return Demonstration Slots */}
                  <div className="flex flex-wrap items-center gap-3">
                    
                    {/* Mandatory Lecturer Demonstration Lock */}
                    <button
                      onClick={() => toggleLecturerDemo(proc.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        isDemonstrated
                          ? 'bg-teal-500/20 border-teal-500/40 text-teal-300 shadow-sm'
                          : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {isDemonstrated ? (
                        <Unlock className="w-4 h-4 text-teal-400" />
                      ) : (
                        <Lock className="w-4 h-4 text-amber-400" />
                      )}
                      <span>
                        {isDemonstrated ? 'Lecturer Demonstrated' : 'Demonstration Required'}
                      </span>
                    </button>

                    {/* 3 Return Demonstration Slots */}
                    <div className="flex items-center gap-1.5 bg-black/20 p-1.5 rounded-xl border border-white/10 backdrop-blur-sm">
                      {[1, 2, 3].map((demoNum) => {
                        const isCompleted = demoNum === 1 ? !!proc.returnDemo1Date : demoNum === 2 ? !!proc.returnDemo2Date : !!proc.returnDemo3Date;

                        const isClickable = isDemonstrated;

                        return (
                          <button
                            key={demoNum}
                            disabled={!isClickable}
                            onClick={() => toggleReturnDemo(proc.id, demoNum as 1|2|3)}
                            title={
                              !isClickable
                                ? 'Lecturer demonstration required before logging return demos'
                                : `Return Demo ${demoNum} (${isCompleted ? 'Completed' : 'Click to complete'})`
                            }
                            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              !isClickable
                                ? 'opacity-30 cursor-not-allowed bg-white/5 text-zinc-600 border border-transparent'
                                : isCompleted
                                  ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 shadow-sm'
                                  : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-cyan-500/50'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            ) : !isClickable ? (
                              <Lock className="w-3 h-3 text-zinc-600" />
                            ) : (
                              <Circle className="w-3.5 h-3.5 text-zinc-500" />
                            )}
                            <span className="font-mono text-[11px]">Demo {demoNum}</span>
                          </button>
                        );
                      })}
                    </div>

                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

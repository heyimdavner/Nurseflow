import React, { useState } from 'react';
import { 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  Circle, 
  ArrowRightLeft, 
  Copy, 
  Calendar, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronRight, 
  Sparkles, 
  Layers, 
  Award,
  Clock,
  Bookmark,
  GraduationCap
} from 'lucide-react';
import { useNurseFlow } from '../../context/NurseFlowContext';
import { Module } from '../../types';

export const StudyTab: React.FC = () => {
  const { 
    modules, 
    user, 
    toggleUnitStudied, 
    toggleUnitWritten, 
    swapModuleSemester, 
    repeatStudyModule,
    syllabusCompletionProgress,
    exams,
    addExam,
    deleteExam,
    mapModuleToExam
  } = useNurseFlow();

  // Multi-level accordion collapsed state
  const [expandedSemesters, setExpandedSemesters] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false
  });

  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  // Swap modal / selector state
  const [swappingModuleId, setSwappingModuleId] = useState<string | null>(null);
  const [targetSemesterForSwap, setTargetSemesterForSwap] = useState<number>(1);

  // New Exam mapping modal
  const [isAddingExam, setIsAddingExam] = useState(false);
  const [examName, setExamName] = useState('');
  const [examDate, setExamDate] = useState(() => new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0]);
  const [selectedExamModuleCodes, setSelectedExamModuleCodes] = useState<string[]>([]);

  const toggleSemester = (sem: number) => {
    setExpandedSemesters(prev => ({ ...prev, [sem]: !prev[sem] }));
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const handleExecuteSwap = (moduleId: string) => {
    swapModuleSemester(moduleId, targetSemesterForSwap);
    setSwappingModuleId(null);
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examName.trim()) return;

    addExam({
      id: `exam-${Date.now()}`,
      name: examName.trim(),
      date: examDate,
      moduleCodes: selectedExamModuleCodes
    });

    // Map module records
    selectedExamModuleCodes.forEach(code => {
      const mod = modules.find(m => m.code === code);
      if (mod) mapModuleToExam(mod.id, examName.trim());
    });

    setExamName('');
    setSelectedExamModuleCodes([]);
    setIsAddingExam(false);
  };

  return (
    <div id="study-tab-container" className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. MASTER SYLLABUS COMPLETION PROGRESS BAR */}
      <div 
        id="master-syllabus-progress-card"
        className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-white/10 text-cyan-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">Dedicated Study &amp; Master Syllabus</h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1 italic">
              Curriculum syllabus units tracking across all 6 semesters with dual-progress metrics.
            </p>
          </div>

          {/* Quick Dual Progress Metric Badges */}
          <div className="flex items-center gap-3">
            <div className="text-right px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm">
              <span className="text-lg font-black text-cyan-300 font-mono">
                {syllabusCompletionProgress.percentStudied}%
              </span>
              <p className="text-[10px] uppercase tracking-wider text-cyan-400 font-medium">Studied</p>
            </div>

            <div className="text-right px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm">
              <span className="text-lg font-black text-emerald-300 font-mono">
                {syllabusCompletionProgress.percentWritten}%
              </span>
              <p className="text-[10px] uppercase tracking-wider text-emerald-400 font-medium">Notes Written</p>
            </div>
          </div>
        </div>

        {/* Master Progress Bars */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-cyan-300 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Revision &amp; Studied Units ({syllabusCompletionProgress.studiedUnits} / {syllabusCompletionProgress.totalUnits} Units)</span>
              </span>
              <span className="font-mono text-cyan-400">{syllabusCompletionProgress.percentStudied}%</span>
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-cyan-400 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                style={{ width: `${syllabusCompletionProgress.percentStudied}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-emerald-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Lecture Notes Taken ({syllabusCompletionProgress.writtenUnits} / {syllabusCompletionProgress.totalUnits} Units)</span>
              </span>
              <span className="font-mono text-emerald-400">{syllabusCompletionProgress.percentWritten}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-emerald-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                style={{ width: `${syllabusCompletionProgress.percentWritten}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. SEMESTER EXAMS SCHEDULER WIDGET */}
      <div 
        id="exams-scheduler-widget"
        className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-sm shadow-xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Upcoming Semester Exams Mapping</h3>
              <p className="text-xs text-zinc-400">Map active modules to specific examination dates.</p>
            </div>
          </div>

          <button
            onClick={() => setIsAddingExam(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-amber-300 text-xs font-bold transition-all self-start sm:self-auto backdrop-blur-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Map New Exam</span>
          </button>
        </div>

        {/* Create Exam Dialog */}
        {isAddingExam && (
          <form onSubmit={handleCreateExam} className="p-4 rounded-xl bg-zinc-900/90 border border-white/20 backdrop-blur-xl mb-3 space-y-3 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                placeholder="Exam Name (e.g. Semester 1 Final Board Examination)..."
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none"
              />
              <input
                type="date"
                required
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-zinc-200 text-xs focus:outline-none"
              />
            </div>

            <div>
              <span className="text-[11px] font-semibold text-zinc-400 block mb-1.5">Select Included Modules:</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto p-2 bg-white/5 rounded-lg border border-white/10">
                {modules.map(m => {
                  const isChecked = selectedExamModuleCodes.includes(m.code);
                  return (
                    <label key={m.id} className="flex items-center gap-1.5 text-[11px] text-zinc-300 cursor-pointer hover:text-white">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedExamModuleCodes([...selectedExamModuleCodes, m.code]);
                          } else {
                            setSelectedExamModuleCodes(selectedExamModuleCodes.filter(c => c !== m.code));
                          }
                        }}
                        className="rounded bg-zinc-800 border-zinc-700 text-amber-500"
                      />
                      <span className="truncate">{m.code}: {m.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsAddingExam(false)}
                className="px-3 py-1 text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white border border-white/20 text-xs font-bold transition-colors"
              >
                Save Exam Schedule
              </button>
            </div>
          </form>
        )}

        {/* Existing Exams List */}
        <div className="flex flex-wrap gap-2 pt-1">
          {exams.map(exam => (
            <div 
              key={exam.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-amber-200 backdrop-blur-sm"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold">{exam.name}</span>
              <span className="text-[10px] font-mono text-amber-400/80">({exam.date})</span>
              <span className="text-[10px] text-zinc-400">[{exam.moduleCodes.length} Modules]</span>
              <button
                onClick={() => deleteExam(exam.id)}
                className="text-zinc-400 hover:text-rose-400 ml-1"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. MULTI-LEVEL COLLAPSIBLE ACCORDION (SEMESTER -> MODULES -> UNITS) */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5, 6].map((sem) => {
          const semModules = modules.filter(m => m.semester === sem);
          const isSemExpanded = !!expandedSemesters[sem];

          let semTotalUnits = 0;
          let semStudiedUnits = 0;
          let semWrittenUnits = 0;

          semModules.forEach(m => {
            m.units.forEach(u => {
              semTotalUnits++;
              if (u.studied) semStudiedUnits++;
              if (u.written) semWrittenUnits++;
            });
          });

          const semProgressPct = semTotalUnits > 0 ? Math.round((semStudiedUnits / semTotalUnits) * 100) : 0;

          return (
            <div
              key={sem}
              id={`study-semester-${sem}-accordion`}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-lg overflow-hidden transition-all"
            >
              {/* LEVEL 1: SEMESTER ACCORDION HEADER */}
              <div
                onClick={() => toggleSemester(sem)}
                className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white/10 text-zinc-300 border border-white/5">
                    {isSemExpanded ? <ChevronDown className="w-5 h-5 text-cyan-400" /> : <ChevronRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white tracking-tight">Semester {sem} Curriculum</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-cyan-300 border border-white/10">
                        {semModules.length} Modules
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {semStudiedUnits}/{semTotalUnits} Units Studied &bull; {semWrittenUnits}/{semTotalUnits} Notes Taken
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="hidden sm:block text-right">
                    <span className="text-xs font-mono font-bold text-cyan-300">{semProgressPct}%</span>
                    <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden mt-1 border border-white/5">
                      <div 
                        className="h-full bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                        style={{ width: `${semProgressPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* LEVEL 2: MODULES ACCORDION */}
              {isSemExpanded && (
                <div className="border-t border-white/10 bg-black/20 p-3 sm:p-4 space-y-3 backdrop-blur-sm">
                  {semModules.length === 0 ? (
                    <div className="p-6 text-center text-xs text-zinc-400">
                      No modules currently mapped to Semester {sem}.
                    </div>
                  ) : (
                    semModules.map((module) => {
                      const isModExpanded = !!expandedModules[module.id];
                      const modTotalUnits = module.units.length;
                      const modStudiedUnits = module.units.filter(u => u.studied).length;
                      const modWrittenUnits = module.units.filter(u => u.written).length;
                      const isExamMapped = !!module.mappedExam;

                      return (
                        <div
                          key={module.id}
                          id={`study-module-${module.id}`}
                          className={`rounded-xl border transition-all overflow-hidden ${
                            isExamMapped
                              ? 'bg-white/10 border-amber-500/40 shadow-sm'
                              : 'bg-white/5 border-white/10'
                          }`}
                        >
                          {/* Module Header */}
                          <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div 
                              onClick={() => toggleModule(module.id)}
                              className="flex items-center gap-2.5 cursor-pointer flex-1 overflow-hidden"
                            >
                              <div className="p-1 rounded bg-white/10 text-zinc-400 border border-white/5">
                                {isModExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                              </div>
                              <div className="overflow-hidden">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs font-bold text-cyan-300">
                                    {module.code}
                                  </span>
                                  {module.isRepeated && (
                                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] border border-amber-500/30">
                                      Repeat Track
                                    </span>
                                  )}
                                  {isExamMapped && (
                                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] border border-amber-500/30 flex items-center gap-1 font-semibold">
                                      <Bookmark className="w-2.5 h-2.5 text-amber-400" />
                                      <span>Exam: {module.mappedExam}</span>
                                    </span>
                                  )}
                                </div>
                                <h4 className="text-sm font-bold text-white truncate mt-0.5">
                                  {module.name}
                                </h4>
                              </div>
                            </div>

                            {/* Controls: Studied Count + Semester Swap + Repeat Study */}
                            <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                              <span className="text-xs font-mono text-zinc-400 mr-1">
                                {modStudiedUnits}/{modTotalUnits} Studied
                              </span>

                              {/* Swap Semester Button */}
                              {swappingModuleId === module.id ? (
                                <div className="flex items-center gap-1 bg-white/10 p-1 rounded-lg border border-white/10">
                                  <select
                                    value={targetSemesterForSwap}
                                    onChange={(e) => setTargetSemesterForSwap(Number(e.target.value))}
                                    className="bg-zinc-900 text-white text-xs px-2 py-1 rounded border border-white/20 focus:outline-none"
                                  >
                                    {[1, 2, 3, 4, 5, 6].map(s => (
                                      <option key={s} value={s}>Sem {s}</option>
                                    ))}
                                  </select>
                                  <button
                                    onClick={() => handleExecuteSwap(module.id)}
                                    className="px-2 py-1 bg-cyan-500 text-zinc-950 text-xs font-bold rounded"
                                  >
                                    Move
                                  </button>
                                  <button
                                    onClick={() => setSwappingModuleId(null)}
                                    className="px-1.5 py-1 text-zinc-400 text-xs hover:text-white"
                                  >
                                    X
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setSwappingModuleId(module.id);
                                    setTargetSemesterForSwap(module.semester);
                                  }}
                                  title="Swap Module Semester"
                                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-300 text-[11px] font-semibold border border-white/10 transition-colors"
                                >
                                  <ArrowRightLeft className="w-3 h-3 text-cyan-400" />
                                  <span>Swap Sem</span>
                                </button>
                              )}

                              {/* Repeat Study Button */}
                              <button
                                onClick={() => repeatStudyModule(module.id)}
                                title="Duplicate Module for Repeat Study Track"
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-amber-300 text-[11px] font-semibold border border-white/10 transition-colors"
                              >
                                <Copy className="w-3 h-3" />
                                <span>Repeat Study</span>
                              </button>
                            </div>
                          </div>

                          {/* LEVEL 3: TOPIC UNITS & DUAL ICON PROGRESS */}
                          {isModExpanded && (
                            <div className="p-3 bg-black/30 border-t border-white/10 space-y-2">
                              {module.units.map((unit) => (
                                <div
                                  key={unit.id}
                                  id={`study-unit-${unit.id}`}
                                  className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-3 hover:border-white/20 transition-all"
                                >
                                  {/* Unit Title & Curriculum Hours */}
                                  <div className="flex-1 overflow-hidden">
                                    <p className="text-xs font-semibold text-zinc-200 truncate">
                                      {unit.title}
                                    </p>
                                    {unit.syllabusHours && (
                                      <span className="text-[10px] font-mono text-zinc-400">
                                        {unit.syllabusHours} Syllabus Hours
                                      </span>
                                    )}
                                  </div>

                                  {/* Dual Icons: Page (Written Progress) & Book (Studied Progress) with Tooltips */}
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    
                                    {/* Page Icon: Written Progress Tooltip & State */}
                                    <div 
                                      className="relative group"
                                      title="Written Progress (Notes Taken in Academic Hub)"
                                    >
                                      <div className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 ${
                                        unit.written
                                          ? 'bg-teal-500/20 border-teal-500/40 text-teal-300'
                                          : 'bg-white/5 border-white/10 text-zinc-500'
                                      }`}>
                                        <FileText className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-bold hidden sm:inline">Notes</span>
                                      </div>
                                    </div>

                                    {/* Book Icon: Studied Progress Interactive Toggle with Tooltip */}
                                    <button
                                      onClick={() => toggleUnitStudied(module.id, unit.id)}
                                      title="Studied Progress (Click to toggle revision completed)"
                                      className={`p-1.5 px-2 rounded-lg border text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                                        unit.studied
                                          ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.3)]'
                                          : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                                      }`}
                                    >
                                      <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                                      <span className="text-[10px]">{unit.studied ? 'Studied' : 'Pending'}</span>
                                      {unit.studied ? (
                                        <CheckCircle2 className="w-3 h-3 text-cyan-400 ml-0.5" />
                                      ) : (
                                        <Circle className="w-3 h-3 text-zinc-500 ml-0.5" />
                                      )}
                                    </button>

                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

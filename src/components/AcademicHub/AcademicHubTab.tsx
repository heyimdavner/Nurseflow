import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Clock, 
  Bell, 
  Calendar, 
  ChevronDown, 
  ChevronRight, 
  Link as LinkIcon, 
  Sparkles, 
  Layers, 
  Save, 
  Check, 
  X
} from 'lucide-react';
import { useNurseFlow } from '../../context/NurseFlowContext';
import { Assignment } from '../../types';

export const AcademicHubTab: React.FC = () => {
  const { 
    modules, 
    user, 
    toggleUnitWritten, 
    updateUnitClassroomUrl,
    assignments, 
    addAssignment, 
    updateAssignment, 
    deleteAssignment,
    toggleAssignmentChecklist 
  } = useNurseFlow();

  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    'm-sem1-01': true,
    'm-sem1-02': true
  });

  // Editing unit URL state
  const [editingUrlUnitId, setEditingUrlUnitId] = useState<string | null>(null);
  const [tempUrlValue, setTempUrlValue] = useState<string>('');

  // New assignment modal state
  const [isAddingAssignment, setIsAddingAssignment] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState(() => new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]);
  const [newRemindAt, setNewRemindAt] = useState(() => new Date(Date.now() + 86400000 * 6).toISOString().slice(0, 16));
  const [newChecklistText, setNewChecklistText] = useState('');
  const [newChecklistItems, setNewChecklistItems] = useState<Array<{ id: string; text: string; completed: boolean }>>([]);

  const filteredModules = modules.filter(m => m.semester === selectedSemester);

  const toggleModuleAccordion = (moduleId: string) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const handleStartEditUrl = (unitId: string, currentUrl?: string) => {
    setEditingUrlUnitId(unitId);
    setTempUrlValue(currentUrl || '');
  };

  const handleSaveUnitUrl = (moduleId: string, unitId: string) => {
    updateUnitClassroomUrl(moduleId, unitId, tempUrlValue.trim());
    setEditingUrlUnitId(null);
  };

  const handleAddChecklistSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newChecklistText.trim()) {
      setNewChecklistItems(prev => [
        ...prev,
        { id: `c-${Date.now()}`, text: newChecklistText.trim(), completed: false }
      ]);
      setNewChecklistText('');
    }
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addAssignment({
      title: newTitle.trim(),
      dueDate: newDueDate,
      remindAt: newRemindAt,
      completed: false,
      checklist: newChecklistItems
    });

    setNewTitle('');
    setNewChecklistItems([]);
    setIsAddingAssignment(false);
  };

  return (
    <div id="academic-hub-container" className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header & Semester Selector */}
      <div 
        id="academic-hub-header"
        className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-white/10 text-cyan-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">Academic Hub &amp; Coursework</h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1 italic">
              Unit-level resource links, lecture note-taking tracker, and coursework reminder alarms.
            </p>
          </div>

          {/* Semester Pills */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 self-start sm:self-auto overflow-x-auto max-w-full backdrop-blur-sm">
            {[1, 2, 3, 4, 5, 6].map((sem) => (
              <button
                key={sem}
                id={`academic-sem-btn-${sem}`}
                onClick={() => setSelectedSemester(sem)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
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

      {/* Main 2-Column Layout: Modules & Units (Left) vs Assignments (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: Modules with Unit-level Breakdown (8 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Semester {selectedSemester} Modules ({filteredModules.length})</span>
            </h3>
            <span className="text-xs text-zinc-400 italic">
              Expand units to link Google Classrooms
            </span>
          </div>

          {filteredModules.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center text-xs text-zinc-400 backdrop-blur-sm">
              No modules registered for Semester {selectedSemester}.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredModules.map((module) => {
                const isExpanded = !!expandedModules[module.id];
                const completedWrittenUnits = module.units.filter(u => u.written).length;
                const progressPct = module.units.length > 0 ? Math.round((completedWrittenUnits / module.units.length) * 100) : 0;

                return (
                  <div
                    key={module.id}
                    id={`module-card-${module.id}`}
                    className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-lg overflow-hidden transition-all"
                  >
                    {/* Module Accordion Header */}
                    <div
                      onClick={() => toggleModuleAccordion(module.id)}
                      className="p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-1.5 rounded-lg bg-white/10 text-zinc-300 border border-white/5">
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </div>
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-white/10 text-cyan-300 font-mono text-xs font-bold border border-white/10">
                              {module.code}
                            </span>
                            {module.isRepeated && (
                              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] border border-amber-500/30 font-semibold">
                                Repeat Study
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-white truncate mt-1">
                            {module.name}
                          </h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0 text-right">
                        <div>
                          <p className="text-xs font-mono font-bold text-cyan-400">
                            {completedWrittenUnits}/{module.units.length} Notes
                          </p>
                          <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden mt-1 border border-white/5">
                            <div 
                              className="h-full bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Nested Topic Units */}
                    {isExpanded && (
                      <div className="border-t border-white/10 bg-black/20 p-3 sm:p-4 space-y-2.5 backdrop-blur-sm">
                        {module.units.map((unit) => (
                          <div
                            key={unit.id}
                            id={`unit-item-${unit.id}`}
                            className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:border-white/20 transition-all"
                          >
                            {/* Unit Name & Written Checkbox */}
                            <div className="flex items-start sm:items-center gap-2.5 flex-1 overflow-hidden">
                              {/* Note-Taking 'Written' Toggle */}
                              <button
                                onClick={() => toggleUnitWritten(module.id, unit.id)}
                                title={unit.written ? 'Notes completed (Click to toggle)' : 'Notes incomplete (Click to mark completed)'}
                                className={`p-1.5 rounded-lg border transition-all flex-shrink-0 ${
                                  unit.written
                                    ? 'bg-teal-500/20 border-teal-500/40 text-teal-300'
                                    : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                                }`}
                              >
                                <FileText className="w-4 h-4" />
                              </button>

                              <div className="overflow-hidden">
                                <p className={`text-xs font-semibold truncate ${unit.written ? 'text-zinc-200' : 'text-zinc-300'}`}>
                                  {unit.title}
                                </p>
                                {unit.syllabusHours && (
                                  <span className="text-[10px] font-mono text-zinc-400">
                                    {unit.syllabusHours} Curriculum Hours
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Google Classroom / URL Section */}
                            <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                              {editingUrlUnitId === unit.id ? (
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="url"
                                    value={tempUrlValue}
                                    onChange={(e) => setTempUrlValue(e.target.value)}
                                    placeholder="Paste Google Classroom / Drive URL..."
                                    className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-cyan-500 text-xs text-white focus:outline-none w-48"
                                  />
                                  <button
                                    onClick={() => handleSaveUnitUrl(module.id, unit.id)}
                                    className="p-1 rounded-lg bg-cyan-500 text-zinc-950 hover:bg-cyan-400 transition-colors font-bold"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setEditingUrlUnitId(null)}
                                    className="p-1 rounded-lg bg-white/10 text-zinc-400 hover:text-white transition-colors"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5">
                                  {unit.classroomUrl ? (
                                    <a
                                      href={unit.classroomUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-cyan-300 text-[11px] font-semibold transition-colors"
                                    >
                                      <span>Classroom</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  ) : (
                                    <button
                                      onClick={() => handleStartEditUrl(unit.id, unit.classroomUrl)}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white text-[11px] transition-colors"
                                    >
                                      <LinkIcon className="w-3 h-3" />
                                      <span>Link URL</span>
                                    </button>
                                  )}

                                  {unit.classroomUrl && (
                                    <button
                                      onClick={() => handleStartEditUrl(unit.id, unit.classroomUrl)}
                                      className="p-1 text-zinc-400 hover:text-zinc-200 text-xs"
                                      title="Edit Classroom Link"
                                    >
                                      Edit
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT: Assignments Reminder List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-400" />
              <span>Assignments &amp; Reminders</span>
            </h3>
            
            <button
              id="add-assignment-btn"
              onClick={() => setIsAddingAssignment(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-teal-300 text-xs font-bold transition-all backdrop-blur-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Task</span>
            </button>
          </div>

          {/* New Assignment Modal / Card */}
          {isAddingAssignment && (
            <div 
              id="new-assignment-form-card"
              className="p-4 rounded-2xl bg-zinc-900/90 border border-white/20 shadow-2xl space-y-3 backdrop-blur-xl animate-in fade-in"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-bold text-teal-300">Create Coursework Assignment</span>
                <button 
                  onClick={() => setIsAddingAssignment(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Assignment Title (e.g. Pharmacology Case Study)..."
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
              />

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-zinc-200 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-teal-400 mb-1 flex items-center gap-1">
                    <Bell className="w-3 h-3" />
                    <span>When to remind</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={newRemindAt}
                    onChange={(e) => setNewRemindAt(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-white/5 border border-teal-500/40 text-zinc-200 text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Subtask micro-checklist builder */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-semibold text-zinc-400">Micro-Checklist Subtasks:</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={newChecklistText}
                    onChange={(e) => setNewChecklistText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddChecklistSubtask(e);
                    }}
                    placeholder="+ Add subtask step..."
                    className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddChecklistSubtask}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-300 text-xs"
                  >
                    Add
                  </button>
                </div>

                {newChecklistItems.length > 0 && (
                  <div className="space-y-1 pt-1">
                    {newChecklistItems.map((item, idx) => (
                      <div key={item.id} className="flex items-center justify-between text-xs text-zinc-300 px-2 py-1 rounded bg-white/5 border border-white/5">
                        <span>{idx + 1}. {item.text}</span>
                        <button
                          type="button"
                          onClick={() => setNewChecklistItems(newChecklistItems.filter(i => i.id !== item.id))}
                          className="text-rose-400 hover:text-rose-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddingAssignment(false)}
                  className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateAssignment}
                  className="px-4 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white border border-white/20 text-xs font-bold transition-colors backdrop-blur-sm"
                >
                  Save Assignment
                </button>
              </div>
            </div>
          )}

          {/* Assignments List */}
          {assignments.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center text-xs text-zinc-400 backdrop-blur-sm">
              No pending assignments. Click "+ New Task" to schedule coursework reminders.
            </div>
          ) : (
            <div className="space-y-3">
              {assignments.map((assignment) => {
                const totalChecklist = assignment.checklist.length;
                const completedChecklist = assignment.checklist.filter(c => c.completed).length;

                return (
                  <div
                    key={assignment.id}
                    id={`assignment-card-${assignment.id}`}
                    className={`p-4 rounded-2xl border transition-all space-y-3 backdrop-blur-sm ${
                      assignment.completed
                        ? 'bg-white/[0.02] border-white/5 opacity-60'
                        : 'bg-white/5 border-white/10 shadow-lg'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5 overflow-hidden">
                        <button
                          onClick={() => updateAssignment(assignment.id, { completed: !assignment.completed })}
                          className={`mt-0.5 flex-shrink-0 ${
                            assignment.completed ? 'text-teal-400' : 'text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          {assignment.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                        </button>
                        <div>
                          <h4 className={`text-sm font-bold leading-tight ${assignment.completed ? 'line-through text-zinc-400' : 'text-white'}`}>
                            {assignment.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-zinc-400 font-mono">
                            <span className="flex items-center gap-1 text-amber-300">
                              <Calendar className="w-3 h-3" />
                              <span>Due: {assignment.dueDate}</span>
                            </span>
                            {assignment.remindAt && (
                              <span className="flex items-center gap-1 text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                                <Bell className="w-3 h-3" />
                                <span>Alarm: {assignment.remindAt.replace('T', ' ')}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteAssignment(assignment.id)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-white/10 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Micro-checklist subtasks */}
                    {assignment.checklist.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-white/5">
                        <div className="flex justify-between text-[11px] text-zinc-400">
                          <span>Subtasks:</span>
                          <span className="font-mono">{completedChecklist}/{totalChecklist} done</span>
                        </div>
                        {assignment.checklist.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => toggleAssignmentChecklist(assignment.id, item.id)}
                            className="flex items-center gap-2 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer text-xs text-zinc-300 transition-colors border border-white/5"
                          >
                            <input
                              type="checkbox"
                              checked={item.completed}
                              readOnly
                              className="rounded bg-zinc-800 border-zinc-700 text-teal-400 focus:ring-0 cursor-pointer"
                            />
                            <span className={item.completed ? 'line-through text-zinc-500' : ''}>
                              {item.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

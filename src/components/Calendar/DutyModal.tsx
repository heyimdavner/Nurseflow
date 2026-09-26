import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trash2, 
  Save, 
  Clock, 
  Building2, 
  CheckCircle2, 
  Calendar as CalendarIcon,
  Tag,
  FileText,
  AlertCircle
} from 'lucide-react';
import { Duty, DutyStatus, DutyType } from '../../types';
import { CLINICAL_WARDS_28 } from '../../data/seedData';
import { useNurseFlow } from '../../context/NurseFlowContext';

interface DutyModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string; // YYYY-MM-DD
  existingDuty?: Duty;
}

export const DutyModal: React.FC<DutyModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  existingDuty
}) => {
  const { 
    shifts, 
    user, 
    addDuty, 
    updateDuty, 
    deleteDuty, 
    lastSelectedWard 
  } = useNurseFlow();

  const [type, setType] = useState<DutyType>(existingDuty?.type || 'Clinical Shift');
  const [shiftCode, setShiftCode] = useState<string>(existingDuty?.shiftCode || 'C1');
  const [status, setStatus] = useState<DutyStatus>(existingDuty?.status || 'Present');
  
  // Last Ward Sticky Helper: default to last selected ward if new duty
  const [specificWard, setSpecificWard] = useState<string>(
    existingDuty?.specificWard || lastSelectedWard.specificWard || '3B'
  );
  const [wardCategory, setWardCategory] = useState<string>(
    existingDuty?.wardCategory || lastSelectedWard.wardCategory || user.customWards[0] || 'Medical'
  );

  const [customHours, setCustomHours] = useState<string>(
    existingDuty?.customHours !== undefined ? String(existingDuty.customHours) : ''
  );
  const [customStartTime, setCustomStartTime] = useState<string>(existingDuty?.customStartTime || '');
  const [customEndTime, setCustomEndTime] = useState<string>(existingDuty?.customEndTime || '');
  
  const [isCustomHoursEnabled, setIsCustomHoursEnabled] = useState<boolean>(
    existingDuty?.customHours !== undefined
  );
  const [notes, setNotes] = useState<string>(existingDuty?.notes || '');
  const [lectureTopic, setLectureTopic] = useState<string>(existingDuty?.lectureTopic || '');

  // Bulk add mode
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [bulkDatesText, setBulkDatesText] = useState('');
  
  // Bulk Auto-Generator states
  const [bulkGenStartDate, setBulkGenStartDate] = useState<string>(selectedDate);
  const [bulkGenEndDate, setBulkGenEndDate] = useState<string>(selectedDate);
  // 0=Sun, 1=Mon, ..., 6=Sat. Default to Mon-Fri
  const [bulkGenDays, setBulkGenDays] = useState<number[]>([1, 2, 3, 4, 5]);

  // Reset form when opened with different date or existingDuty
  useEffect(() => {
    if (existingDuty) {
      setType(existingDuty.type);
      setShiftCode(existingDuty.shiftCode);
      setStatus(existingDuty.status);
      setSpecificWard(existingDuty.specificWard || lastSelectedWard.specificWard || '3B');
      setWardCategory(existingDuty.wardCategory || lastSelectedWard.wardCategory || user.customWards[0] || 'Medical');
      setCustomHours(existingDuty.customHours !== undefined ? String(existingDuty.customHours) : '');
      setCustomStartTime(existingDuty.customStartTime || '');
      setCustomEndTime(existingDuty.customEndTime || '');
      setIsCustomHoursEnabled(existingDuty.customHours !== undefined);
      setNotes(existingDuty.notes || '');
      setLectureTopic(existingDuty.lectureTopic || '');
    } else {
      setType('Clinical Shift');
      setShiftCode('C1');
      setStatus('Present');
      setSpecificWard(lastSelectedWard.specificWard || '3B');
      setWardCategory(lastSelectedWard.wardCategory || user.customWards[0] || 'Medical');
      setCustomHours('');
      setCustomStartTime('');
      setCustomEndTime('');
      setIsCustomHoursEnabled(false);
      setNotes('');
      setLectureTopic('');
      setIsBulkMode(false);
      setBulkDatesText('');
      setBulkGenStartDate(selectedDate);
      setBulkGenEndDate(selectedDate);
    }
  }, [existingDuty, selectedDate, isOpen, lastSelectedWard, user.customWards]);

  const toggleBulkGenDay = (dayIndex: number) => {
    setBulkGenDays(prev => 
      prev.includes(dayIndex) ? prev.filter(d => d !== dayIndex) : [...prev, dayIndex]
    );
  };

  const handleGenerateDates = () => {
    if (!bulkGenStartDate || !bulkGenEndDate) return;
    
    const start = new Date(bulkGenStartDate);
    const end = new Date(bulkGenEndDate);
    
    if (end < start) return; // Invalid range
    
    const dates: string[] = [];
    const current = new Date(start);
    
    while (current <= end) {
      if (bulkGenDays.includes(current.getDay())) {
        const y = current.getFullYear();
        const m = (current.getMonth() + 1).toString().padStart(2, '0');
        const d = current.getDate().toString().padStart(2, '0');
        dates.push(`${y}-${m}-${d}`);
      }
      current.setDate(current.getDate() + 1);
    }
    
    setBulkDatesText(prev => {
      const existing = prev.trim();
      const newDates = dates.join('\n');
      return existing ? existing + '\n' + newDates : newDates;
    });
  };

  if (!isOpen) return null;

  const currentShift = shifts.find(s => s.code.toUpperCase() === shiftCode.toUpperCase());

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    const createDutyPayload = (targetDate: string): Omit<Duty, 'id' | 'userId'> => ({
      date: targetDate,
      type,
      shiftCode: type === 'Academic Lecture' ? 'LEC' : shiftCode,
      status,
      notes: notes.trim(),
      ...(type === 'Clinical Shift' ? {
        specificWard,
        wardCategory,
        customHours: isCustomHoursEnabled && customHours !== '' ? Number(customHours) : undefined,
        customStartTime: isCustomHoursEnabled ? customStartTime : undefined,
        customEndTime: isCustomHoursEnabled ? customEndTime : undefined
      } : {
        lectureTopic: lectureTopic.trim()
      })
    });

    if (existingDuty && !isBulkMode) {
      updateDuty(existingDuty.id, createDutyPayload(selectedDate));
    } else {
      if (isBulkMode && bulkDatesText.trim()) {
        // Extract valid YYYY-MM-DD dates from the textarea
        const extractedDates = bulkDatesText
          .split(/[\s,]+/)
          .filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d));
        
        extractedDates.forEach(dateStr => {
          addDuty(createDutyPayload(dateStr));
        });
      } else {
        addDuty(createDutyPayload(selectedDate));
      }
    }
    onClose();
  };

  const handleDelete = () => {
    if (existingDuty) {
      deleteDuty(existingDuty.id);
      onClose();
    }
  };

  return (
    <div 
      id="duty-modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div 
        id="duty-modal-sheet"
        className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-150 my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div className="w-full">
              <div className="flex items-center justify-between w-full">
                <h3 className="text-lg font-bold text-white">
                  {existingDuty ? 'Edit Scheduled Duty' : 'Log / Schedule Duty'}
                </h3>
                {!existingDuty && (
                  <label className="flex items-center gap-1.5 text-[10px] text-cyan-300 cursor-pointer bg-cyan-950/40 px-2 py-1 rounded border border-cyan-800/60 hover:bg-cyan-900/40 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={isBulkMode} 
                      onChange={(e) => setIsBulkMode(e.target.checked)} 
                      className="rounded bg-slate-900 border-cyan-800 text-cyan-500 focus:ring-0 w-3 h-3" 
                    />
                    <span className="uppercase tracking-wider font-bold">Bulk Add Mode</span>
                  </label>
                )}
              </div>
              {!isBulkMode ? (
                <p className="text-xs font-mono text-cyan-400 mt-0.5">
                  Date: {selectedDate}
                </p>
              ) : (
                <div className="mt-2.5 space-y-2">
                  
                  {/* Auto-Generator Toolkit */}
                  <div className="bg-slate-900/60 border border-slate-700/50 rounded-lg p-2 flex flex-col gap-2">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3" /> Auto-Generate
                      </span>
                      <div className="flex gap-1">
                        {['S','M','T','W','T','F','S'].map((day, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => toggleBulkGenDay(idx)}
                            className={`w-5 h-5 rounded-md text-[10px] font-bold flex items-center justify-center transition-colors ${
                              bulkGenDays.includes(idx)
                                ? 'bg-cyan-500 text-slate-950'
                                : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <div className="flex flex-1 w-full gap-2 items-center">
                        <input 
                          type="date" 
                          value={bulkGenStartDate}
                          onChange={e => setBulkGenStartDate(e.target.value)}
                          className="flex-1 min-w-0 bg-slate-950 border border-slate-700 p-1.5 rounded-lg text-cyan-300 text-[11px] focus:outline-none"
                        />
                        <span className="text-slate-500 text-xs">-</span>
                        <input 
                          type="date" 
                          value={bulkGenEndDate}
                          onChange={e => setBulkGenEndDate(e.target.value)}
                          className="flex-1 min-w-0 bg-slate-950 border border-slate-700 p-1.5 rounded-lg text-cyan-300 text-[11px] focus:outline-none"
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={handleGenerateDates}
                        className="w-full sm:w-auto px-3 py-1.5 bg-cyan-900/50 hover:bg-cyan-800/60 border border-cyan-800 text-cyan-300 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                      >
                        Generate Dates
                      </button>
                    </div>
                  </div>

                  {/* Date Textarea */}
                  <textarea 
                    value={bulkDatesText}
                    onChange={(e) => setBulkDatesText(e.target.value)}
                    placeholder="Enter dates (YYYY-MM-DD) separated by spaces or newlines"
                    className="w-full bg-slate-950 border border-slate-700/80 p-2.5 rounded-xl text-cyan-300 font-mono text-xs focus:ring-2 focus:ring-cyan-500/50 focus:outline-none h-24 placeholder:text-slate-600 resize-none shadow-inner"
                  />
                  <p className="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-amber-500" />
                    Any invalid dates will be safely ignored during save.
                  </p>
                </div>
              )}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="mt-5 space-y-4">
          
          {/* Duty Type Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Duty Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('Clinical Shift')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                  type === 'Clinical Shift'
                    ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 shadow-sm'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                Clinical Ward Shift
              </button>
              <button
                type="button"
                onClick={() => setType('Academic Lecture')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                  type === 'Academic Lecture'
                    ? 'bg-teal-500/20 border-teal-500/60 text-teal-300 shadow-sm'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                Academic Lecture
              </button>
            </div>
          </div>

          {/* Shift Code & Hours (Only for Clinical Shifts) */}
          {type === 'Clinical Shift' && (
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  Shift Code &amp; Standard Library
                </label>
                {currentShift && (
                  <span className="text-xs text-cyan-300 font-mono font-semibold">
                    {currentShift.startTime} - {currentShift.endTime} ({currentShift.hours}h)
                  </span>
                )}
              </div>

              <select
                id="duty-shift-code-select"
                value={shiftCode}
                onChange={(e) => setShiftCode(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              >
                {shifts.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.code} - {s.name} ({s.hours} Hours) [{s.startTime} - {s.endTime}]
                  </option>
                ))}
              </select>

              {/* Custom Hours Toggle */}
              <div className="flex flex-col gap-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isCustomHoursEnabled}
                      onChange={(e) => setIsCustomHoursEnabled(e.target.checked)}
                      className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
                    />
                    <span>Override with custom hours</span>
                  </label>
                  {isCustomHoursEnabled && (
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {customHours || '0'} hrs
                    </span>
                  )}
                </div>

                {isCustomHoursEnabled && (
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Start Time</label>
                      <input
                        type="time"
                        value={customStartTime}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomStartTime(val);
                          if (val && customEndTime) {
                            const [sH, sM] = val.split(':').map(Number);
                            const [eH, eM] = customEndTime.split(':').map(Number);
                            let h = eH - sH + (eM - sM) / 60;
                            if (h < 0) h += 24;
                            setCustomHours(String(Math.round(h * 10) / 10));
                          }
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">End Time</label>
                      <input
                        type="time"
                        value={customEndTime}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomEndTime(val);
                          if (customStartTime && val) {
                            const [sH, sM] = customStartTime.split(':').map(Number);
                            const [eH, eM] = val.split(':').map(Number);
                            let h = eH - sH + (eM - sM) / 60;
                            if (h < 0) h += 24;
                            setCustomHours(String(Math.round(h * 10) / 10));
                          }
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Duty Status Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Duty Attendance Status
            </label>
            <select
              id="duty-status-select"
              value={status}
              onChange={(e) => setStatus(e.target.value as DutyStatus)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            >
              <option value="Present">Present (1.0 day / 100% hours)</option>
              <option value="Half Day">Half Day (0.5 day credit / 50% hours)</option>
              <option value="Absent">Absent (0.0 day / Penalizes &lt;80% rate)</option>
              <option value="Special Holiday">Special Holiday (Sh) (1.0 day weight / 0h)</option>
              <option value="Medical">Medical Leave (1.0 day weight / 0h)</option>
              <option value="Day Off">Day Off (DO) (Neutral / 0h)</option>
              <option value="Public Holiday">Public Holiday (Neutral / 0h)</option>
              <option value="Pending">Pending (Imported Roster / Unconfirmed)</option>
            </select>
          </div>

          {/* Specific Ward & Category (Only for Clinical Shifts) */}
          {type === 'Clinical Shift' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>Specific Ward (28 List)</span>
                  <span className="text-[10px] text-cyan-400">Sticky default</span>
                </label>
                <select
                  id="duty-specific-ward-select"
                  value={specificWard}
                  onChange={(e) => setSpecificWard(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-cyan-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                >
                  {(user.specificWards || CLINICAL_WARDS_28).map(w => (
                    <option key={w} value={w}>Ward {w}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-cyan-400" />
                  <span>Ward Category</span>
                </label>
                <select
                  id="duty-ward-category-select"
                  value={wardCategory}
                  onChange={(e) => setWardCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                >
                  {user.customWards.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Lecture Topic / Course Subject
              </label>
              <input
                type="text"
                value={lectureTopic}
                onChange={(e) => setLectureTopic(e.target.value)}
                placeholder="e.g., Medical Asepsis, Pharmacology Calculations"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
          )}



          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            {existingDuty ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 text-xs font-bold transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Duty</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20"
              >
                <Save className="w-4 h-4" />
                <span>Save Duty</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

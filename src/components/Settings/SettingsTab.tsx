import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Hash, 
  Calendar, 
  Tag, 
  Plus, 
  Trash2, 
  Clock, 
  RotateCcw, 
  Moon, 
  Sun, 
  Sparkles, 
  Download, 
  Upload, 
  ShieldCheck, 
  Check, 
  X,
  AlertTriangle
} from 'lucide-react';
import { useNurseFlow } from '../../context/NurseFlowContext';
import { useAuth } from '../../context/AuthContext';
import { ShiftDefinition } from '../../types';
import { InstanceClonerSection } from './InstanceClonerSection';

export const SettingsTab: React.FC = () => {
  const { signOut } = useAuth();
  const { 
    user, 
    updateUserProfile, 
    shifts, 
    addCustomShift, 
    deleteCustomShift, 
    resetShiftsToDefault,
    resetToSeedData,
    duties,
    modules,
    procedures,
    assignments,
    exportDataJSON,
    importDataJSON
  } = useNurseFlow();

  // Profile edit state
  const [name, setName] = useState(user.name);
  const [lsn, setLsn] = useState(user.lsn);
  const [startDate, setStartDate] = useState(user.programStartDate);
  const [endDate, setEndDate] = useState(user.programEndDate);
  const [sem2Target, setSem2Target] = useState(String(user.sem2ClinicalHoursTarget || 105));
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  // Custom ward tag state
  const [newTag, setNewTag] = useState('');
  
  // Specific Wards state
  const [newSpecificWard, setNewSpecificWard] = useState('');

  // Custom shift form state
  const [isAddingShift, setIsAddingShift] = useState(false);
  const [newShiftCode, setNewShiftCode] = useState('');
  const [newShiftName, setNewShiftName] = useState('');
  const [newShiftHours, setNewShiftHours] = useState('6.0');
  const [newShiftStartTime, setNewShiftStartTime] = useState('07:00');
  const [newShiftEndTime, setNewShiftEndTime] = useState('13:00');

  // Backup & Restore
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: name.trim(),
      lsn: lsn.trim(),
      programStartDate: startDate,
      programEndDate: endDate,
      sem2ClinicalHoursTarget: Number(sem2Target) || 105
    });
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 3000);
  };

  const handleAddWardTag = () => {
    const clean = newTag.trim();
    if (clean) {
      const newTags = clean.split(',').map(t => t.trim()).filter(t => t && !user.customWards.includes(t));
      if (newTags.length > 0) {
        updateUserProfile({
          customWards: [...user.customWards, ...newTags]
        });
        setNewTag('');
      }
    }
  };

  const handleRemoveWardTag = (tagToRemove: string) => {
    updateUserProfile({
      customWards: user.customWards.filter(t => t !== tagToRemove)
    });
  };

  const handleAddSpecificWard = () => {
    const clean = newSpecificWard.trim();
    const wards = user.specificWards || [];
    if (clean) {
      const newWards = clean.split(',').map(w => w.trim()).filter(w => w && !wards.includes(w));
      if (newWards.length > 0) {
        updateUserProfile({
          specificWards: [...wards, ...newWards]
        });
        setNewSpecificWard('');
      }
    }
  };

  const handleRemoveSpecificWard = (wardToRemove: string) => {
    updateUserProfile({
      specificWards: (user.specificWards || []).filter(w => w !== wardToRemove)
    });
  };

  const handleCreateCustomShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShiftCode.trim() || !newShiftName.trim()) return;

    addCustomShift({
      code: newShiftCode.trim().toUpperCase(),
      name: newShiftName.trim(),
      hours: Number(newShiftHours) || 6.0,
      startTime: newShiftStartTime,
      endTime: newShiftEndTime,
      isCustom: true
    });

    setNewShiftCode('');
    setNewShiftName('');
    setIsAddingShift(false);
  };

  const handleExportBackup = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nurseflow-backup-${user.lsn}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          const success = importDataJSON(event.target?.result as string);
          if (success) {
            setImportStatus(`Success! Found profile for ${parsed.user?.name || 'Unknown'} with ${parsed.duties?.length || 0} duties. Reloading...`);
            // setTimeout(() => window.location.reload(), 2000); // Removed to prevent interrupting Firebase uploads
          } else {
            setImportStatus('Failed to restore some backup data.');
          }
        } catch {
          setImportStatus('Failed to parse backup JSON file.');
        }
      };
      reader.readAsText(e.target.files[0]);
    }
  };

  return (
    <div id="settings-tab-container" className="space-y-6 animate-in fade-in duration-200">
      
      {/* Settings Header */}
      <div 
        id="settings-header-card"
        className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-xl"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/10 text-cyan-400">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Application Settings &amp; Configuration</h2>
            <p className="text-xs text-zinc-400 mt-0.5 italic">
              Customize student credentials, clinical shift libraries, ward tags, and appearance.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. STUDENT PROFILE & PROGRAM TIMELINE */}
        <div 
          id="student-profile-settings"
          className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" />
              <span>Student Profile &amp; Dates</span>
            </h3>
            {profileSavedToast && (
              <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/40 font-semibold animate-in fade-in">
                <Check className="w-3 h-3" /> Saved
              </span>
            )}
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                  Student Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                  Local Student Number (LSN)
                </label>
                <input
                  type="text"
                  value={lsn}
                  onChange={(e) => setLsn(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-cyan-300 font-mono font-bold text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                  Program Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-200 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                  Program End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-200 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">
                Semester 2 Clinical Target Benchmark (Hours)
              </label>
              <input
                type="number"
                step="1"
                value={sem2Target}
                onChange={(e) => setSem2Target(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-200 font-mono text-xs focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold transition-colors shadow backdrop-blur-sm"
            >
              Save Profile Changes
            </button>
          </form>
        </div>

        {/* 2. CUSTOM WARD CATEGORIES TAGS MANAGER */}
        <div 
          id="ward-categories-settings"
          className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <Tag className="w-4 h-4 text-teal-400" />
              <span>Ward Categories Tags ({user.customWards.length})</span>
            </h3>
          </div>

          <p className="text-xs text-zinc-400 mb-3">
            These tags populate the Ward Category dropdown when logging clinical shifts on your calendar.
          </p>

          <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-black/20 border border-white/10 min-h-[70px] mb-3 backdrop-blur-sm">
            {user.customWards.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-white/10 border border-white/15 text-cyan-200"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveWardTag(tag)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddWardTag(); }}
              placeholder="+ Add new category (e.g. Oncology, Dialysis)..."
              className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none"
            />
            <button
              onClick={handleAddWardTag}
              disabled={!newTag.trim()}
              className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold disabled:opacity-30 transition-colors"
            >
              Add Tag
            </button>
          </div>
          
          <hr className="border-white/10 my-6" />

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <Tag className="w-4 h-4 text-purple-400" />
              <span>Specific Wards ({(user.specificWards || []).length})</span>
            </h3>
          </div>

          <p className="text-xs text-zinc-400 mb-3">
            These populate the Specific Ward dropdown on your calendar.
          </p>

          <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-black/20 border border-white/10 min-h-[70px] max-h-[150px] overflow-y-auto mb-3 backdrop-blur-sm">
            {(user.specificWards || []).map(ward => (
              <span
                key={ward}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-white/10 border border-white/15 text-purple-200"
              >
                <span>{ward}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSpecificWard(ward)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newSpecificWard}
              onChange={(e) => setNewSpecificWard(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddSpecificWard(); }}
              placeholder="+ Add new ward (paste comma separated list)..."
              className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none"
            />
            <button
              onClick={handleAddSpecificWard}
              disabled={!newSpecificWard.trim()}
              className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold disabled:opacity-30 transition-colors"
            >
              Add Ward
            </button>
          </div>
        </div>

        {/* 3. CUSTOM SHIFT DEFINITIONS LIBRARY */}
        <div 
          id="custom-shifts-settings"
          className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-lg"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Standard &amp; Custom Shift Configuration Library</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Manage standard codes (C1, J, N, CC, etc.) and register custom hospital rotation shifts.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={resetShiftsToDefault}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-300 text-xs font-semibold border border-white/10 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Standard Defaults</span>
              </button>

              <button
                onClick={() => setIsAddingShift(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs font-bold transition-all shadow"
              >
                <Plus className="w-3.5 h-3.5 text-cyan-400" />
                <span>Add Custom Shift</span>
              </button>
            </div>
          </div>

          {/* Add Shift Form */}
          {isAddingShift && (
            <form onSubmit={handleCreateCustomShift} className="p-4 rounded-xl bg-zinc-900/90 border border-white/20 mb-4 space-y-3 shadow-xl backdrop-blur-xl">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Code</label>
                  <input
                    type="text"
                    required
                    value={newShiftCode}
                    onChange={(e) => setNewShiftCode(e.target.value)}
                    placeholder="e.g. C2"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-cyan-300 font-mono text-xs uppercase"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Shift Name</label>
                  <input
                    type="text"
                    required
                    value={newShiftName}
                    onChange={(e) => setNewShiftName(e.target.value)}
                    placeholder="e.g. Early Afternoon Continuous"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={newShiftStartTime}
                    onChange={(e) => {
                      setNewShiftStartTime(e.target.value);
                      if (e.target.value && newShiftEndTime) {
                        const [sH, sM] = e.target.value.split(':').map(Number);
                        const [eH, eM] = newShiftEndTime.split(':').map(Number);
                        let h = eH - sH + (eM - sM) / 60;
                        if (h < 0) h += 24;
                        setNewShiftHours(String(Math.round(h * 10) / 10));
                      }
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={newShiftEndTime}
                    onChange={(e) => {
                      setNewShiftEndTime(e.target.value);
                      if (newShiftStartTime && e.target.value) {
                        const [sH, sM] = newShiftStartTime.split(':').map(Number);
                        const [eH, eM] = e.target.value.split(':').map(Number);
                        let h = eH - sH + (eM - sM) / 60;
                        if (h < 0) h += 24;
                        setNewShiftHours(String(Math.round(h * 10) / 10));
                      }
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Hours</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newShiftHours}
                    onChange={(e) => setNewShiftHours(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-cyan-300 font-mono text-xs font-bold"
                  />
                </div>
                <div className="flex items-end gap-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingShift(false)}
                    className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white border border-white/20 text-xs font-bold rounded-lg transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Shift Table Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {shifts.map((shift) => (
              <div 
                key={shift.code}
                className={`p-3 rounded-xl border flex flex-col justify-between backdrop-blur-sm ${
                  shift.isCustom 
                    ? 'bg-cyan-500/10 border-cyan-500/30' 
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-white/10 text-cyan-300 font-mono text-xs font-bold border border-white/10">
                      {shift.code}
                    </span>
                    <span className="text-xs font-mono font-bold text-white">
                      {shift.hours}h
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-zinc-200 mt-2 truncate">
                    {shift.name}
                  </h4>
                  <p className="text-[10px] font-mono text-zinc-400 mt-0.5">
                    {shift.startTime} - {shift.endTime}
                  </p>
                </div>

                {shift.isCustom && (
                  <div className="pt-2 mt-2 border-t border-white/10 flex justify-end">
                    <button
                      onClick={() => deleteCustomShift(shift.code)}
                      className="text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove Custom</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 4. THEME & DISPLAY PREFERENCES */}
        <div 
          id="theme-display-settings"
          className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-lg"
        >
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Theme &amp; Visual Style</span>
          </h3>

          <div className="space-y-4">
            {/* Dark Mode Default */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10">
              <div>
                <p className="text-xs font-bold text-white">Default Medical Dark Mode</p>
                <p className="text-[11px] text-zinc-400">Eye-safe zinc-950 background with ambient frosted glow</p>
              </div>
              <button
                onClick={() => updateUserProfile({ isDarkMode: !user.isDarkMode })}
                className={`p-2 rounded-xl border transition-colors ${
                  user.isDarkMode ? 'bg-white/15 text-cyan-300 border-white/20' : 'bg-white/5 text-zinc-400 border-white/10'
                }`}
              >
                {user.isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>
            </div>

            {/* Frosted Glass Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10">
              <div>
                <p className="text-xs font-bold text-white">Frosted Glass UI Blur</p>
                <p className="text-[11px] text-zinc-400">Enables high-contrast backdrop blurs across all panels</p>
              </div>
              <button
                onClick={() => updateUserProfile({ frostedGlass: !user.frostedGlass })}
                className={`px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${
                  user.frostedGlass ? 'bg-teal-500/20 text-teal-300 border-teal-500/40' : 'bg-white/5 text-zinc-400 border-white/10'
                }`}
              >
                {user.frostedGlass ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>

        {/* 5. DATA BACKUP, RESTORE & RESET */}
        <div 
          id="backup-restore-settings"
          className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-lg"
        >
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 mb-4 flex items-center gap-2">
            <Download className="w-4 h-4 text-teal-400" />
            <span>Data Management &amp; Persistence</span>
          </h3>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleExportBackup}
                className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-white/10 hover:bg-white/20 text-cyan-300 text-xs font-bold border border-white/10 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export JSON</span>
              </button>

              <label className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-white/10 hover:bg-white/20 text-teal-300 text-xs font-bold border border-white/10 transition-colors cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>Import JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>
            </div>

            {importStatus && (
              <p className="text-xs text-center text-teal-400 font-semibold p-2 bg-teal-500/20 rounded-lg border border-teal-500/40">
                {importStatus}
              </p>
            )}

            <button
              onClick={() => {
                if (window.confirm('Reset all NurseFlow data and start with a completely clean slate?')) {
                  resetToSeedData();
                }
              }}
              className="w-full flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30 transition-colors"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Reset Database to Clean Slate</span>
            </button>
            <button
              onClick={async () => {
                await signOut();
              }}
              className="w-full flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold border border-zinc-700 transition-colors mt-3"
            >
              <span>Sign Out of NurseFlow Cloud</span>
            </button>

          </div>
        </div>

        {/* 6. CLONE ENTIRE WEBPAGE INSTANCE & RESOURCES */}
        <InstanceClonerSection />

      </div>

    </div>
  );
};

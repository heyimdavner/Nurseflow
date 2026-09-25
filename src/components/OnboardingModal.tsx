import React, { useState } from 'react';
import { 
  HeartPulse, 
  Sparkles, 
  Calendar, 
  User, 
  Hash, 
  Tag, 
  Plus, 
  X, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useNurseFlow } from '../context/NurseFlowContext';

export const OnboardingModal: React.FC = () => {
  const { user, updateUserProfile, setActiveTab, importDataJSON } = useNurseFlow();

  const [name, setName] = useState(user.name === 'New Student' ? '' : user.name);
  const [lsn, setLsn] = useState(user.lsn === '00000' ? '' : user.lsn);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  
  // Default start date = 2024-01-01
  const [startDate, setStartDate] = useState(user.programStartDate || '2024-01-01');
  
  // Compute default 3 years after start date
  const computeEndDate = (start: string) => {
    try {
      const d = new Date(start);
      if (isNaN(d.getTime())) return '2027-01-01';
      d.setFullYear(d.getFullYear() + 3);
      return d.toISOString().split('T')[0];
    } catch {
      return '2027-01-01';
    }
  };

  const [endDate, setEndDate] = useState(user.programEndDate || computeEndDate(startDate));

  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    setEndDate(computeEndDate(val));
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
            setTimeout(() => {
              window.location.reload();
            }, 2000);
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

  const handleCompleteSetup = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: name.trim() || 'Nursing Candidate',
      lsn: lsn.trim() || '40292',
      programStartDate: startDate,
      programEndDate: endDate,
      customWards: ['Medical', 'Surgical', 'Pediatrics', 'Geriatrics', 'ICU', 'ETU', 'Gynae/Obstetrics'],
      isOnboarded: true
    });
    setActiveTab('dashboard');
  };

  const handleDismiss = () => {
    updateUserProfile({ isOnboarded: true });
    setActiveTab('dashboard');
  };

  if (user.isOnboarded) {
    return null;
  }

  return (
    <div 
      id="onboarding-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div 
        id="onboarding-modal-card"
        className="w-full max-w-2xl bg-zinc-900/95 border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-zinc-100 my-8 animate-in fade-in zoom-in-95 duration-200 relative"
      >
        {/* Modal Header */}
        <div className="flex items-center gap-4 border-b border-white/10 pb-6 pr-12">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 p-0.5 shadow-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
            <HeartPulse className="w-7 h-7 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">Welcome to NurseFlow</h2>
              <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-white/10 text-cyan-300 border border-white/10 rounded-full">
                Setup
              </span>
            </div>
            <p className="text-sm text-zinc-400 mt-1">
              Configure your 3-year nursing academic profile, clinical requirements, and ward rotation tags.
            </p>
          </div>
        </div>

        {/* Onboarding Form Container */}
        <div className="mt-6 space-y-6">
          
          {/* Student Info Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                Student Name
              </label>
              <input
                id="onboarding-name-input"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Jane Doe, Candidate"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-cyan-400" />
                Local Student Number (LSN)
              </label>
              <input
                id="onboarding-lsn-input"
                type="text"
                required
                value={lsn}
                onChange={(e) => setLsn(e.target.value)}
                placeholder="e.g., 40292"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-cyan-300 font-mono font-semibold placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 text-sm"
              />
            </div>
          </div>

          {/* Program Timeline */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-400">
              <Calendar className="w-4 h-4" />
              <span>3-Year Nursing Program Timeline</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Program Start Date
                </label>
                <input
                  id="onboarding-start-date"
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-cyan-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center justify-between">
                  <span>Program End Date</span>
                  <span className="text-[10px] text-cyan-400 font-normal">Auto 3-yr span</span>
                </label>
                <input
                  id="onboarding-end-date"
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-cyan-400 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Ward Categories are managed later in Settings */}

          {/* Compliance Notice */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-cyan-200 backdrop-blur-sm">
            <ShieldCheck className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-white">Mandatory Setup:</strong> You must create a new profile or import an existing backup to proceed. Minimum 80.0% clinical attendance is required by the nursing curriculum board.
            </p>
          </div>
          
          {importStatus && (
            <div className="p-3 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-semibold text-center">
              {importStatus}
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col items-center gap-4 border-t border-white/10 mt-2">
            
            <div className="w-full p-4 rounded-2xl bg-white/5 border border-white/10">
              <label className="block text-xs font-semibold uppercase tracking-wider text-teal-300 mb-2">
                Already have a backup?
              </label>
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="w-full text-sm text-zinc-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-teal-500/20 file:text-teal-300 hover:file:bg-teal-500/30 cursor-pointer"
              />
            </div>

            <div className="w-full text-center text-xs text-zinc-500 font-medium my-1">OR CREATE NEW PROFILE</div>

            <button
              id="onboarding-complete-btn"
              type="button"
              onClick={handleCompleteSetup}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/15 font-bold text-sm tracking-wide shadow-xl backdrop-blur-sm transition-all cursor-pointer"
            >
              <span>Save &amp; Open Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

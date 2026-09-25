import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  FileCheck, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Loader2,
  Scan,
  RefreshCw
} from 'lucide-react';
import { useNurseFlow } from '../../context/NurseFlowContext';
import { Duty } from '../../types';
import { CLINICAL_WARDS_28 } from '../../data/seedData';

interface RosterImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RosterImportModal: React.FC<RosterImportModalProps> = ({ isOpen, onClose }) => {
  const { user, importRosterDuties, duties } = useNurseFlow();

  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [isDragOver, setIsDragOver] = useState(false);

  // Overlap resolution state
  const [hasConflicts, setHasConflicts] = useState(false);
  const [conflictingDates, setConflictingDates] = useState<string[]>([]);
  const [pendingParsedDuties, setPendingParsedDuties] = useState<Array<Omit<Duty, 'id' | 'userId'>>>([]);
  const [importSummary, setImportSummary] = useState<{ imported: number; conflicts: number } | null>(null);

  if (!isOpen) return null;

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (selectedFile: File) => {
    setFile(selectedFile);
    setIsScanning(true);
    setScanProgress(10);
    setScanStep(`Initializing OCR engine for ${selectedFile.name}...`);

    // Simulated multi-stage OCR & LSN scanning
    setTimeout(() => {
      setScanProgress(35);
      setScanStep(`Scanning tabular shift matrix for Student ID: ${user.lsn}...`);
    }, 600);

    setTimeout(() => {
      setScanProgress(70);
      setScanStep(`Found matching roster row for LSN [${user.lsn}]. Extracting shift codes & wards...`);
    }, 1200);

    setTimeout(() => {
      setScanProgress(95);
      setScanStep(`Analyzing calendar date frames and resolving ward category bindings...`);
    }, 1800);

    setTimeout(() => {
      setIsScanning(false);
      setScanProgress(100);

      // Generate 12-16 realistic shifts for the current month and surrounding span
      const parsed = generateMockParsedDuties(user.lsn, user.customWards);
      setPendingParsedDuties(parsed);

      // Check conflicts against existing duties
      const existingDateSet = new Set(duties.map(d => d.date));
      const conflicts = parsed.filter(p => existingDateSet.has(p.date)).map(p => p.date);

      if (conflicts.length > 0) {
        setHasConflicts(true);
        setConflictingDates(conflicts);
      } else {
        // No conflicts, import immediately
        const res = importRosterDuties(parsed, 'overwrite');
        setImportSummary({ imported: res.importedCount, conflicts: 0 });
      }
    }, 2400);
  };

  const generateMockParsedDuties = (lsn: string, customWards: string[]): Array<Omit<Duty, 'id' | 'userId'>> => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-indexed
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const mockShiftCodes = ['C1', 'J', 'N', 'CC', 'L', 'DO', 'C1', 'J', 'N', 'DO', 'C3', 'HS', 'C1'];
    const mockWards = ['3B', '4A', '5A', '6B', '7C', 'NICU', 'ETU', '3C', 'MICU'];
    
    const results: Array<Omit<Duty, 'id' | 'userId'>> = [];

    // Distribute 14 shifts across the current month
    for (let day = 2; day <= Math.min(daysInMonth, 28); day += 2) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const codeIndex = (day / 2) % mockShiftCodes.length;
      const code = mockShiftCodes[codeIndex];
      const ward = mockWards[(day / 2) % mockWards.length];
      const category = customWards[(day / 2) % customWards.length] || 'Surgical';

      const isDayOff = code === 'DO';

      results.push({
        date: dateStr,
        shiftCode: code,
        type: 'Clinical Shift',
        status: isDayOff ? 'Day Off' : 'Pending', // Pending as requested by specs!
        specificWard: ward,
        wardCategory: category,
        notes: `Imported from monthly roster PDF for Student LSN: ${lsn}`
      });
    }

    return results;
  };

  const handleResolveConflicts = (resolutionMode: 'overwrite' | 'keep' | 'merge') => {
    const res = importRosterDuties(pendingParsedDuties, resolutionMode);
    setHasConflicts(false);
    setImportSummary({ imported: res.importedCount, conflicts: conflictingDates.length });
  };

  const handleReset = () => {
    setFile(null);
    setIsScanning(false);
    setHasConflicts(false);
    setPendingParsedDuties([]);
    setImportSummary(null);
  };

  return (
    <div 
      id="roster-import-modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div 
        id="roster-import-modal-card"
        className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-150 my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Import Monthly PDF/Image Roster</h3>
              <p className="text-xs text-slate-400">
                Automated OCR Shift Extractor &bull; LSN: <span className="font-mono text-cyan-300 font-bold">{user.lsn}</span>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-5">
          
          {/* STEP 1: Upload Drag & Drop Area */}
          {!file && !importSummary && (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleFileDrop}
              className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all flex flex-col items-center justify-center gap-3 cursor-pointer ${
                isDragOver 
                  ? 'border-cyan-400 bg-cyan-950/30 shadow-lg shadow-cyan-950/40' 
                  : 'border-slate-700 hover:border-cyan-500/50 bg-slate-950/40 hover:bg-slate-950/60'
              }`}
              onClick={() => document.getElementById('roster-file-input')?.click()}
            >
              <input
                id="roster-file-input"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileInput}
                className="hidden"
              />
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <UploadCloud className="w-8 h-8 animate-bounce" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">
                  Drag &amp; drop hospital roster PDF or Image here
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supports PDF schedules, duty spreadsheets, and ward photo rosters (Arbitrary date frames supported)
                </p>
              </div>
              <span className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-slate-700">
                Browse Files
              </span>
            </div>
          )}

          {/* STEP 2: Scanning & Processing State */}
          {isScanning && (
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-cyan-500/30 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 animate-spin">
                  <Scan className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-cyan-300 font-mono">Parsing Roster...</p>
                    <span className="text-xs font-mono text-cyan-400 font-bold">{scanProgress}%</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{scanStep}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 transition-all duration-300"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* STEP 3: Duplicate Shift Overlap Guard Modal Trigger */}
          {hasConflicts && (
            <div 
              id="overlap-guard-prompt"
              className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/50 space-y-4 animate-in fade-in"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl flex-shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-200">
                    Duplicate Shift Overlap Detected
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {conflictingDates.length} of the parsed roster dates already have duties recorded on your calendar (e.g. {conflictingDates.slice(0, 3).join(', ')}{conflictingDates.length > 3 ? '...' : ''}). How would you like to resolve this?
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                <button
                  onClick={() => handleResolveConflicts('overwrite')}
                  className="p-3 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-left transition-colors"
                >
                  <p className="text-xs font-bold text-rose-300">1. Overwrite</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Replace existing calendar entries with imported roster</p>
                </button>

                <button
                  onClick={() => handleResolveConflicts('keep')}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left transition-colors"
                >
                  <p className="text-xs font-bold text-slate-200">2. Keep Original</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Retain your existing duties, ignore duplicate roster dates</p>
                </button>

                <button
                  onClick={() => handleResolveConflicts('merge')}
                  className="p-3 rounded-xl bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-700/80 text-left transition-colors"
                >
                  <p className="text-xs font-bold text-cyan-300">3. Smart Merge</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Update pending/off days with parsed codes &amp; sync wards</p>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Success Feedback */}
          {importSummary && (
            <div 
              id="roster-import-success-box"
              className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-4 animate-in fade-in"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-base font-bold text-white">
                  Roster Successfully Extracted!
                </h4>
                <p className="text-xs text-emerald-300 mt-1">
                  SUCCESS: {importSummary.imported} clinical shifts and days off successfully imported for Student Number <span className="font-mono font-bold text-white">{user.lsn}</span>.
                </p>
                <p className="text-[11px] text-slate-400 mt-2">
                  All newly imported shifts are initially marked as <strong className="text-cyan-300">Pending</strong> so you can review, adjust wards, and confirm attendance on the calendar.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Import Another</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors shadow"
                >
                  View in Calendar
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

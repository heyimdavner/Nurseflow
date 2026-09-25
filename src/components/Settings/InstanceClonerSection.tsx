import React, { useState, useMemo } from 'react';
import { 
  FolderArchive, 
  Download, 
  CheckCircle2, 
  FileCode, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Layers, 
  Sparkles, 
  Terminal, 
  HardDrive, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { 
  cloneAndDownloadInstance, 
  getAvailableInstanceFiles, 
  ClonedFileItem 
} from '../../utils/instanceCloner';
import { useNurseFlow } from '../../context/NurseFlowContext';

export const InstanceClonerSection: React.FC = () => {
  const { 
    user, 
    duties, 
    modules, 
    procedures, 
    shifts, 
    assignments 
  } = useNurseFlow();

  const [includeLiveState, setIncludeLiveState] = useState(true);
  const [isCloning, setIsCloning] = useState(false);
  const [cloneProgress, setCloneProgress] = useState(0);
  const [cloneStatusText, setCloneStatusText] = useState('');
  const [showManifest, setShowManifest] = useState(false);
  const [manifestSearch, setManifestSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [copiedCli, setCopiedCli] = useState(false);
  const [completedResult, setCompletedResult] = useState<{
    fileName: string;
    fileCount: number;
    totalSizeBytes: number;
  } | null>(null);

  // Compile active instance state snapshot
  const activeInstanceState = useMemo(() => ({
    user,
    duties,
    modules,
    procedures,
    shifts,
    assignments,
    clonedAt: new Date().toISOString(),
    version: '2.5.0-instance-clone',
  }), [user, duties, modules, procedures, shifts, assignments]);

  // Detected files manifest
  const detectedFiles = useMemo(() => {
    return getAvailableInstanceFiles(includeLiveState ? activeInstanceState : undefined);
  }, [includeLiveState, activeInstanceState]);

  const filteredFiles = useMemo(() => {
    return detectedFiles.filter((file: ClonedFileItem) => {
      const matchesSearch = file.path.toLowerCase().includes(manifestSearch.toLowerCase()) ||
        file.type.toLowerCase().includes(manifestSearch.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || file.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [detectedFiles, manifestSearch, categoryFilter]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    detectedFiles.forEach((f: ClonedFileItem) => set.add(f.category));
    return ['All', ...Array.from(set)];
  }, [detectedFiles]);

  const totalRawSize = useMemo(() => {
    return detectedFiles.reduce((acc: number, f: ClonedFileItem) => acc + f.size, 0);
  }, [detectedFiles]);

  const handleStartClone = async () => {
    try {
      setIsCloning(true);
      setCompletedResult(null);
      setCloneProgress(5);
      setCloneStatusText('Scanning all webpage files & component trees...');

      const result = await cloneAndDownloadInstance({
        includeLiveState,
        liveState: includeLiveState ? activeInstanceState : undefined,
        onProgress: (percent, status) => {
          setCloneProgress(percent);
          setCloneStatusText(status);
        },
      });

      setCompletedResult(result);
    } catch (err) {
      console.error('Failed to clone instance:', err);
      setCloneStatusText('Failed to generate archive. Please try again.');
    } finally {
      setIsCloning(false);
    }
  };

  const handleCopyCli = () => {
    const text = 'npm install && npm run dev';
    navigator.clipboard.writeText(text);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2500);
  };

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div 
      id="instance-cloner-section"
      className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-zinc-900/60 to-teal-950/30 border border-cyan-500/30 p-5 sm:p-7 backdrop-blur-md shadow-2xl relative overflow-hidden"
    >
      {/* Decorative ambient top glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-inner">
            <FolderArchive className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                Clone Entire Instance &amp; Webpage Resources
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                Full Export
              </span>
            </div>
            <p className="text-xs text-zinc-300 mt-0.5">
              Pack and download ALL webpage source files, components, configs, styling, assets, and active state directly onto your client computer.
            </p>
          </div>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-black/40 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-mono text-zinc-300">
          <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
          <span>{detectedFiles.length} files</span>
          <span className="text-zinc-500">|</span>
          <span>~{formatBytes(totalRawSize)} raw</span>
        </div>
      </div>

      {/* Main Content & Options */}
      <div className="space-y-5 relative z-10">
        
        {/* Features & Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Option 1: Live State Toggle */}
          <label className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeLiveState}
              onChange={(e) => setIncludeLiveState(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-cyan-500 bg-black/40 border-white/20 focus:ring-cyan-400 focus:ring-offset-0"
            />
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">Include Live Instance State</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-300 font-mono">
                  instance-data.json
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                Embeds your live student profile ({user.name || 'Current Student'}), logged duties ({duties.length}), syllabus modules ({modules.length}), and clinical skills records into the clone.
              </p>
            </div>
          </label>

          {/* Option 2: Local Run Ready */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
            <div className="mt-0.5 p-1 rounded bg-teal-500/20 text-teal-400">
              <Terminal className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-bold text-white">Plug-and-Play Offline Setup</span>
              <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                Includes <code className="text-cyan-300 font-mono">package.json</code>, <code className="text-cyan-300 font-mono">vite.config.ts</code>, <code className="text-cyan-300 font-mono">README.md</code>, and all dependencies. Unzip and run <code className="text-teal-300 font-mono">npm install && npm run dev</code> anywhere.
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar (during cloning) */}
        {isCloning && (
          <div className="p-4 rounded-xl bg-cyan-950/60 border border-cyan-500/40 space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-xs">
              <span className="text-cyan-200 font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                {cloneStatusText || 'Packaging instance files...'}
              </span>
              <span className="text-cyan-300 font-mono font-bold">{cloneProgress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-black/50 overflow-hidden border border-cyan-500/20">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 transition-all duration-200 rounded-full"
                style={{ width: `${cloneProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Download Success Card */}
        {completedResult && !isCloning && (
          <div className="p-4 rounded-xl bg-teal-950/60 border border-teal-500/40 text-teal-100 space-y-3 animate-in fade-in">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-bold text-teal-200">
                  Instance Successfully Cloned &amp; Downloaded!
                </h4>
                <p className="text-xs text-teal-300/90 mt-0.5">
                  Packaged <strong className="text-white font-mono">{completedResult.fileCount} files</strong> into <span className="font-mono text-white underline">{completedResult.fileName}</span> ({formatBytes(completedResult.totalSizeBytes)} compressed). Check your browser downloads folder.
                </p>
              </div>
            </div>

            {/* Quick terminal helper */}
            <div className="p-2.5 rounded-lg bg-black/50 border border-teal-500/30 flex items-center justify-between gap-2 font-mono text-xs">
              <div className="flex items-center gap-2 overflow-x-auto text-zinc-300 py-0.5">
                <span className="text-teal-400 font-bold">$</span>
                <span>npm install &amp;&amp; npm run dev</span>
              </div>
              <button
                type="button"
                onClick={handleCopyCli}
                className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 text-xs font-sans font-medium transition-colors"
              >
                {copiedCli ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-teal-300" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Command</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-white/10">
          
          {/* Manifest Inspector Button */}
          <button
            type="button"
            onClick={() => setShowManifest(!showManifest)}
            className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-xs font-semibold transition-colors"
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>{showManifest ? 'Hide Files Manifest' : `Inspect Manifest (${detectedFiles.length} files)`}</span>
            {showManifest ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* Download Action Button */}
          <button
            type="button"
            disabled={isCloning}
            onClick={handleStartClone}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 hover:from-cyan-400 to-teal-500 hover:to-teal-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
          >
            {isCloning ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Cloning Instance ({cloneProgress}%)...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Clone &amp; Download Entire Instance (.ZIP)</span>
              </>
            )}
          </button>
        </div>

        {/* Collapsible Files & Resources Manifest Inspector */}
        {showManifest && (
          <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/10 space-y-3 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-white/10">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Instance File &amp; Resource Catalog</span>
                </h4>
                <p className="text-[11px] text-zinc-400">
                  Every file listed below will be bundled into the root of the exported zip archive.
                </p>
              </div>

              {/* Search Filter */}
              <div className="relative min-w-[200px]">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Filter files..."
                  value={manifestSearch}
                  onChange={(e) => setManifestSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors shrink-0 ${
                    categoryFilter === cat
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-white/5 text-zinc-400 hover:text-white border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Scrollable File List */}
            <div className="max-h-60 overflow-y-auto space-y-1 pr-1 font-mono text-xs">
              {filteredFiles.length === 0 ? (
                <p className="text-xs text-zinc-500 text-center py-4 italic">
                  No files match "{manifestSearch}"
                </p>
              ) : (
                filteredFiles.map((file) => (
                  <div
                    key={file.path}
                    className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span className="truncate text-zinc-200">{file.path}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-sans font-semibold bg-white/10 text-zinc-300">
                        {file.type}
                      </span>
                      <span className="text-[11px] text-zinc-400">
                        {formatBytes(file.size)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
              <span>Showing {filteredFiles.length} of {detectedFiles.length} files</span>
              <span>All files are bundled with full UTF-8 source fidelity</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

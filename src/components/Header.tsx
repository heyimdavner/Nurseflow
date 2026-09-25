import React, { useState } from 'react';
import { 
  HeartPulse, 
  UserCheck, 
  LogOut, 
  Sparkles, 
  Moon, 
  Sun, 
  ShieldAlert, 
  Award,
  Layers
} from 'lucide-react';
import { useNurseFlow } from '../context/NurseFlowContext';

export const Header: React.FC = () => {
  const { 
    user, 
    updateUserProfile, 
    overallAttendanceRate, 
    isAttendanceBelowThreshold,
    totalClinicalHoursLogged,
    handleMockLogin,
    handleMockLogout,
    setActiveTab
  } = useNurseFlow();

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const toggleTheme = () => {
    updateUserProfile({ theme: user.theme === 'dark' ? 'light' : 'dark' });
  };

  const toggleGlass = () => {
    updateUserProfile({ frostedGlass: !user.frostedGlass });
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-200 backdrop-blur-md bg-zinc-900/60 border-b border-white/10 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div 
            id="brand-logo-container"
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white">Nurse<span className="text-cyan-400">Flow</span></span>
              </div>
              <p className="text-xs text-zinc-400 italic hidden sm:block">Monitoring academic & clinical tracking</p>
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex items-center gap-2">
            {/* Attendance Dial Badge */}
            <div 
              id="header-attendance-badge"
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium backdrop-blur-sm ${
                isAttendanceBelowThreshold
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-teal-500/15 border-teal-500/30 text-teal-300'
              }`}
            >
              {isAttendanceBelowThreshold ? (
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
              ) : (
                <Award className="w-3.5 h-3.5 text-teal-400" />
              )}
              <span>Att: <strong className="font-bold">{overallAttendanceRate}%</strong></span>
            </div>

            {/* Total Clinical Hours Badge */}
            <div 
              id="header-hours-badge"
              className="flex items-center gap-2 px-2 sm:px-3.5 py-1.5 rounded-full bg-zinc-800/80 border border-white/5 text-[10px] sm:text-xs text-zinc-300 backdrop-blur-sm"
            >
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
              <span><span className="hidden sm:inline">Hours: </span><strong className="text-cyan-300 font-mono">{totalClinicalHoursLogged}h</strong></span>
            </div>
          </div>

          {/* Controls & Mock OAuth User Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggler */}
            <button
              id="header-theme-toggle"
              onClick={toggleTheme}
              title="Toggle Dark / Light Theme"
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-400 transition-colors backdrop-blur-sm"
            >
              {user.theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-cyan-400" />
              )}
            </button>

            {/* Mock Google OAuth Authentication Profile */}
            <div className="relative">
              <button
                id="header-user-profile-btn"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-left transition-all hover:border-white/15 backdrop-blur-sm"
              >
                <div className="relative">
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1594824813579-994f83733075?w=150&auto=format&fit=crop&q=80'}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-cyan-400/50"
                  />
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full ring-1 ring-zinc-950" />
                </div>
                
                <div className="hidden sm:block">
                  <p className="text-xs font-semibold text-zinc-200 leading-tight flex items-center gap-1">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-zinc-500 font-mono">LSN: {user.lsn}</p>
                </div>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div 
                  id="header-profile-dropdown"
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-zinc-900/90 border border-white/10 p-3 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 duration-100"
                >
                  <div className="p-2 border-b border-white/5 flex items-center gap-3">
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-cyan-500/40"
                    />
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-white truncate">{user.name}</p>
                      <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-white/10 text-cyan-300 font-mono text-[10px] border border-white/10 font-semibold">
                          LSN: {user.lsn}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] border border-emerald-500/30">
                          Google Verified
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="py-2 space-y-1">
                    <button
                      onClick={() => {
                        setActiveTab('settings');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:text-cyan-300 hover:bg-white/5 rounded-lg transition-colors flex items-center justify-between"
                    >
                      <span>Settings & Custom Wards</span>
                      <span className="text-[10px] text-zinc-500">Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        handleMockLogin();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:text-teal-300 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-teal-400" />
                      <span>Re-authenticate Google</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-white/5">
                    <button
                      onClick={() => {
                        handleMockLogout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out (Session Clear)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};

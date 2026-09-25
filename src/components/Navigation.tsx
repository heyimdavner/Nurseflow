import React from 'react';
import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  BookOpen, 
  GraduationCap, 
  ClipboardCheck, 
  Settings 
} from 'lucide-react';
import { useNurseFlow } from '../context/NurseFlowContext';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, user, isAttendanceBelowThreshold } = useNurseFlow();

  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard, badge: isAttendanceBelowThreshold ? 'Alert' : null },
    { id: 'calendar' as const, label: 'Calendar & Scheduler', icon: CalendarIcon },
    { id: 'academics' as const, label: 'Academic Hub', icon: GraduationCap },
    { id: 'study' as const, label: 'Master Study Tab', icon: BookOpen },
    { id: 'skills' as const, label: 'Clinical Skills Log', icon: ClipboardCheck },
    { id: 'settings' as const, label: 'Settings', icon: Settings }
  ];

  return (
    <>
      {/* Desktop Main Navigation Bar */}
      <nav 
        id="main-desktop-navigation" 
        className="hidden md:block w-full transition-all duration-200 backdrop-blur-md bg-zinc-900/50 border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 lg:space-x-2 py-2.5 overflow-x-auto no-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 whitespace-nowrap relative ${
                    isActive
                      ? 'bg-white/10 text-cyan-400 border border-white/10 shadow-sm shadow-cyan-500/20 backdrop-blur-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-full animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <nav 
        id="mobile-bottom-navigation" 
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 transition-all duration-200 backdrop-blur-xl bg-zinc-950/85 border-t border-white/10 shadow-2xl"
      >
        <div className="grid grid-cols-6 h-16 max-w-lg mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-btn-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center gap-1 transition-colors relative ${
                  isActive ? 'text-cyan-400' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <div className={`p-1 rounded-lg ${isActive ? 'bg-white/10 text-cyan-300 border border-white/10' : ''}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-medium tracking-tight truncate max-w-[54px]">
                  {item.id === 'academics' ? 'Hub' : item.id === 'study' ? 'Study' : item.id === 'skills' ? 'Skills' : item.label.split(' ')[0]}
                </span>
                {isActive && (
                  <span className="absolute top-0 w-8 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

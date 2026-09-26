import React from 'react';
import { NurseFlowProvider, useNurseFlow } from './context/NurseFlowContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { OnboardingModal } from './components/OnboardingModal';
import { DashboardTab } from './components/Dashboard/DashboardTab';
import { CalendarTab } from './components/Calendar/CalendarTab';
import { AcademicHubTab } from './components/AcademicHub/AcademicHubTab';
import { StudyTab } from './components/StudyTab/StudyTab';
import { ClinicalSkillsTab } from './components/ClinicalSkills/ClinicalSkillsTab';
import { SettingsTab } from './components/Settings/SettingsTab';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthScreen } from './components/Auth/AuthScreen';
import { Activity } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, user } = useNurseFlow();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />;
      case 'calendar':
        return <CalendarTab />;
      case 'academics':
        return <AcademicHubTab />;
      case 'study':
        return <StudyTab />;
      case 'skills':
        return <ClinicalSkillsTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <div className={`min-h-screen relative overflow-x-hidden ${user.theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-zinc-950 text-slate-100'} transition-colors duration-200 selection:bg-cyan-500 selection:text-zinc-950 font-sans antialiased`}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <OnboardingModal />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <Navigation />
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 pb-20">
          {renderActiveTab()}
        </main>
        <footer className="border-t border-white/5 bg-zinc-950/40 backdrop-blur-md py-4 text-center text-xs text-zinc-400">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="font-mono text-cyan-400/80">NurseFlow &bull; Clinical OSCA &amp; Attendance Compliance System</span>
            <span className="text-zinc-500">Student LSN: <strong className="text-zinc-300 font-mono">{user.lsn}</strong></span>
          </div>
        </footer>
      </div>
    </div>
  );
};

const Root: React.FC = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center text-black animate-pulse">
          <Activity className="w-7 h-7" />
        </div>
        <p className="text-teal-500 font-mono text-sm animate-pulse">Connecting to Cloud...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <NurseFlowProvider>
      <MainLayout />
    </NurseFlowProvider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Root />
    </AuthProvider>
  );
}

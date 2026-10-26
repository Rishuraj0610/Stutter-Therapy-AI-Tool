import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { MLSpeechModelPage } from './pages/MLSpeechModelPage';
import { DoctorDirectoryPage } from './pages/DoctorDirectoryPage';
import { SpeechPracticePage } from './pages/SpeechPracticePage';
import { AICounsellingPage } from './pages/AICounsellingPage';
import { ExercisesPage } from './pages/ExercisesPage';
import { DailyPlanPage } from './pages/DailyPlanPage';
import { ProgressPage } from './pages/ProgressPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AboutPage } from './pages/AboutPage';
import { AuthPages } from './pages/AuthPages';
import { PediatricGamifiedPage } from './pages/PediatricGamifiedPage';
import { ForensicAudioAnalysisPage } from './pages/ForensicAudioAnalysisPage';
import { BiofeedbackWearablePage } from './pages/BiofeedbackWearablePage';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { ChevronsRight, AlertTriangle, Clock } from 'lucide-react';

const ClinicianInactivityBanner: React.FC = () => {
  const { inactivityWarning, remainingInactivitySeconds, dismissInactivityWarning, logout } = useAuth();
  if (!inactivityWarning) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="max-w-md w-full p-6 rounded-3xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 shadow-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Clinician Inactivity Timeout Warning
            </h3>
            <p className="text-xs text-slate-500">
              HIPAA & DPDP Act 2023 session security requirement.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          You have been inactive for nearly 30 minutes. To protect sensitive patient health records and disfluency spectrograms, your session will automatically terminate in{' '}
          <strong className="text-amber-600 dark:text-amber-400 font-mono text-sm">{remainingInactivitySeconds}s</strong>.
        </p>

        <div className="flex gap-2 justify-end pt-2">
          <button
            onClick={logout}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Log Out Now
          </button>
          <button
            onClick={dismissInactivityWarning}
            className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md transition-colors"
          >
            Keep Working
          </button>
        </div>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { currentPage, isAuthenticated, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fluency_sidebar_open');
      if (saved !== null) return saved === 'true';
      return window.innerWidth >= 1024;
    }
    return true;
  });

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('fluency_sidebar_open', String(next));
      } catch (e) {}
      return next;
    });
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage />;
      case 'auth':
      case 'login':
        return <AuthPages initialMode="login" />;
      case 'register':
        return <AuthPages initialMode="register" />;
      case 'forgot':
        return <AuthPages initialMode="forgot" />;
      case 'reset':
        return <AuthPages initialMode="reset" />;
      case 'verify':
        return <AuthPages initialMode="verify" />;
      case 'dashboard':
        return <DashboardPage />;
      case 'ml_speech':
        return <MLSpeechModelPage />;
      case 'doctors':
        return <DoctorDirectoryPage />;
      case 'speech_practice':
        return <SpeechPracticePage />;
      case 'ai_counselling':
        return <AICounsellingPage />;
      case 'exercises':
        return <ExercisesPage />;
      case 'daily_plan':
        return <DailyPlanPage />;
      case 'progress':
        return <ProgressPage />;
      case 'profile':
        return <ProfilePage />;
      case 'admin':
        return <AdminDashboardPage />;
      case 'pediatric':
        return <PediatricGamifiedPage />;
      case 'forensic_audio':
        return <ForensicAudioAnalysisPage />;
      case 'biofeedback_wearable':
        return <BiofeedbackWearablePage />;
      case 'about':
        return <AboutPage />;
      default:
        return isAuthenticated ? <DashboardPage /> : <LandingPage />;
    }
  };

  const showSidebar = isAuthenticated && currentPage !== 'landing' && currentPage !== 'login' && currentPage !== 'register';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      <Navbar
        onToggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Clinician Inactivity Warning Modal (HIPAA / DPDP Act 30-min auto logout) */}
      <ClinicianInactivityBanner />

      <div className="flex flex-1 w-full relative">
        {/* Floating Desktop Unhide Sidebar Tab */}
        {showSidebar && !isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex fixed left-0 top-24 z-30 items-center gap-1.5 px-3 py-2 rounded-r-xl border border-l-0 border-slate-200/80 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 text-slate-700 dark:text-slate-200 shadow-md hover:bg-teal-50 dark:hover:bg-slate-800 hover:text-teal-700 dark:hover:text-teal-400 transition-all text-xs font-bold group backdrop-blur-xs"
            title="Unhide Sidebar Navigation"
          >
            <ChevronsRight className="w-4 h-4 text-teal-600 dark:text-teal-400 group-hover:translate-x-0.5 transition-transform" />
            <span>Unhide Menu</span>
          </button>
        )}

        {showSidebar && (
          <>
            {/* Mobile backdrop */}
            {isSidebarOpen && (
              <div
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              onToggle={toggleSidebar}
            />
          </>
        )}

        <main className={`flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto ${showSidebar ? 'pb-24 lg:pb-8' : 'w-full'}`}>
          {renderCurrentPage()}
        </main>
      </div>

      {showSidebar && <MobileBottomNav />}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

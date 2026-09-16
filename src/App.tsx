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
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { ChevronsRight } from 'lucide-react';

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
      case 'login':
        return <AuthPages initialMode="login" />;
      case 'register':
        return <AuthPages initialMode="register" />;
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

      <div className="flex flex-1 w-full relative">
        {/* Floating Desktop Unhide Sidebar Tab */}
        {showSidebar && !isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex fixed left-0 top-20 z-30 items-center gap-1.5 px-3 py-2 rounded-r-xl border border-l-0 border-slate-200/80 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 text-slate-700 dark:text-slate-200 shadow-md hover:bg-teal-50 dark:hover:bg-slate-800 hover:text-teal-700 dark:hover:text-teal-400 transition-all text-xs font-bold group backdrop-blur-xs"
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

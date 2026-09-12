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
import { ThemeSelectorModal } from './components/common/ThemeSelectorModal';
import { MobileBottomNav } from './components/layout/MobileBottomNav';

const AppContent: React.FC = () => {
  const { currentPage, isAuthenticated, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

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
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex flex-1 w-full relative">
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
              onOpenThemeModal={() => setIsThemeModalOpen(true)}
            />
          </>
        )}

        <main className={`flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto ${showSidebar ? 'pb-24 lg:pb-8' : 'w-full'}`}>
          {renderCurrentPage()}
        </main>
      </div>

      {showSidebar && <MobileBottomNav />}

      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
      />
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

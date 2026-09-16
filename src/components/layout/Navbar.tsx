import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Bell,
  UserCheck,
  Stethoscope,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Search,
  Wind,
  HeartPulse,
  ChevronDown,
  Flame,
  Sidebar
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, isAuthenticated, logout, switchDemoRole, setCurrentPage, currentPage, streakDays } = useAuth();
  const [showNotif, setShowNotif] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    { id: 1, title: 'Morning Speaking Practice', text: '5-minute Gentle Onset session ready.', time: 'Today' },
    { id: 2, title: 'Telehealth Confirmed', text: 'Session with Dr. Marcus Vance on Tuesday, 10:30 AM.', time: 'Yesterday' }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes('doctor') || q.includes('therapist') || q.includes('consult')) {
      setCurrentPage('doctors');
    } else if (q.includes('counsel') || q.includes('anxiety') || q.includes('chat')) {
      setCurrentPage('ai_counselling');
    } else if (q.includes('exercise') || q.includes('technique') || q.includes('onset')) {
      setCurrentPage('exercises');
    } else if (q.includes('progress') || q.includes('score') || q.includes('analytics')) {
      setCurrentPage('progress');
    } else {
      setCurrentPage('speech_practice');
    }
    setSearchQuery('');
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/95 sm:px-6">
      {/* Left: Sidebar Toggle & Brand Identity */}
      <div className="flex items-center gap-3">
        {isAuthenticated && (
          <button
            onClick={onToggleSidebar}
            className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-all border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900 shadow-2xs"
            aria-label={isSidebarOpen ? "Hide sidebar navigation" : "Unhide sidebar navigation"}
            title={isSidebarOpen ? "Hide sidebar menu" : "Unhide sidebar menu"}
          >
            {isSidebarOpen ? (
              <Sidebar className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            ) : (
              <Menu className="h-4 w-4 text-teal-700 dark:text-teal-400" />
            )}
            <span className="hidden sm:inline text-xs font-bold text-slate-700 dark:text-slate-300">
              {isSidebarOpen ? "Hide Menu" : "Unhide Menu"}
            </span>
          </button>
        )}

        <button
          onClick={() => setCurrentPage(isAuthenticated ? (user?.role === 'therapist' ? 'admin' : 'dashboard') : 'landing')}
          className="flex items-center gap-2.5 text-left group"
        >
          <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold text-sm shadow-xs group-hover:bg-teal-800 transition-colors">
            <HeartPulse className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-base font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                FluencyAI
              </span>
              <span className="rounded-md bg-teal-50 px-1.5 py-0.2 text-[10px] font-semibold text-teal-700 border border-teal-200/60 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800">
                Clinical
              </span>
            </div>
            <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">
              Speech Therapy & Care
            </span>
          </div>
        </button>
      </div>

      {/* Center: Search & Quick Navigation (Desktop) */}
      {isAuthenticated && (
        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center max-w-sm w-full mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exercises, techniques, therapists..."
              className="w-full rounded-full border border-slate-200 bg-slate-50/80 pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600 transition-all dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200"
            />
          </div>
        </form>
      )}

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Calm Reset shortcut */}
        {isAuthenticated && (
          <button
            onClick={() => setCurrentPage('ai_counselling')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-teal-200 bg-teal-50/60 text-teal-800 dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-300 text-xs font-semibold hover:bg-teal-100/70 transition-colors"
            title="Quick breathing and anxiety reset"
          >
            <Wind className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Calm Reset</span>
          </button>
        )}

        {/* Demo Role Switcher */}
        {isAuthenticated && (
          <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-full text-xs font-medium border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => switchDemoRole('patient')}
              className={`px-2.5 py-1 rounded-full transition-all text-xs ${
                user?.role === 'patient'
                  ? 'bg-white dark:bg-slate-700 text-teal-800 dark:text-teal-200 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Patient
            </button>
            <button
              onClick={() => switchDemoRole('therapist')}
              className={`px-2.5 py-1 rounded-full transition-all text-xs ${
                user?.role === 'therapist'
                  ? 'bg-white dark:bg-slate-700 text-teal-800 dark:text-teal-200 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Clinician
            </button>
          </div>
        )}

        {/* Real-Time Streak Badge */}
        {isAuthenticated && (
          <button
            onClick={() => setCurrentPage('daily_plan')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50/90 dark:bg-amber-950/50 border border-amber-200/80 dark:border-amber-800/80 text-amber-800 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors shadow-2xs"
            title="Real-Time Speech Streak • Click to view Daily Plan"
          >
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-600 animate-pulse" />
            <span>{streakDays}d Streak</span>
          </button>
        )}

        {/* Notifications */}
        {isAuthenticated && (
          <div className="relative">
            <button
              onClick={() => setShowNotif(!showNotif)}
              className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              title="Notifications"
              aria-label="View notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-teal-600" />
            </button>

            {showNotif && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-800 dark:bg-slate-900 z-50">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Patient Updates
                  </h4>
                  <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                    2 New
                  </span>
                </div>
                <div className="mt-2.5 space-y-2">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800/60 hover:bg-teal-50/60 transition-colors cursor-pointer border border-slate-100 dark:border-slate-700/60"
                      onClick={() => setShowNotif(false)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{n.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* User Account Capsule */}
        {isAuthenticated ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 rounded-lg py-1 px-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullName}`}
                alt={user?.fullName}
                className="h-8 w-8 rounded-full border border-slate-200 object-cover bg-slate-100 dark:border-slate-700"
              />
              <div className="hidden sm:block text-left text-xs">
                <span className="block font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                  {user?.fullName}
                </span>
                <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                  {user?.role === 'therapist' ? 'Clinician' : 'Patient'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-800 dark:bg-slate-900 z-50">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{user?.fullName}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                  <span className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-teal-50 px-2 py-0.5 text-[10px] font-medium text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                    <ShieldCheck className="w-3 h-3" />
                    {user?.role === 'therapist' ? 'Licensed Specialist' : 'Verified Patient'}
                  </span>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setCurrentPage('profile');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded-md transition-colors"
                  >
                    My Profile & Settings
                  </button>
                  {user?.role === 'therapist' && (
                    <button
                      onClick={() => {
                        setCurrentPage('admin');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-slate-800 rounded-md transition-colors"
                    >
                      Therapist Clinical Dashboard
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setCurrentPage('about');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded-md transition-colors"
                  >
                    Clinical Therapy Protocols
                  </button>
                </div>
                <div className="border-t border-slate-100 pt-1 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 rounded-md transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage('login')}
              className="text-xs font-semibold px-3 py-1.5 text-slate-700 hover:text-teal-700 dark:text-slate-300 dark:hover:text-teal-400"
            >
              Sign In
            </button>
            <button
              onClick={() => setCurrentPage('register')}
              className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white shadow-xs transition-colors"
            >
              Get Started
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

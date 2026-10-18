import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  Mic,
  MessageSquareHeart,
  Dumbbell,
  CalendarCheck,
  TrendingUp,
  Stethoscope,
  BookOpen,
  User,
  ShieldCheck,
  LogOut,
  HeartPulse,
  Flame,
  Gamepad2,
  FileAudio,
  Activity,
  ChevronsLeft
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onToggle?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose, onToggle }) => {
  const { currentPage, setCurrentPage, role, user, logout, streakDays } = useAuth();

  const patientNavItems = [
    { id: 'dashboard', label: 'Home / Dashboard', icon: Home },
    { id: 'speech_practice', label: 'Speech Practice', icon: Mic },
    { id: 'pediatric', label: 'Pediatric Playground', icon: Gamepad2 },
    { id: 'forensic_audio', label: 'Forensic Audio ML', icon: FileAudio },
    { id: 'biofeedback_wearable', label: 'Wearable Biofeedback', icon: Activity },
    { id: 'ai_counselling', label: 'AI Counsellor', icon: MessageSquareHeart },
    { id: 'exercises', label: 'Exercise Library', icon: Dumbbell },
    { id: 'daily_plan', label: 'Daily Plan', icon: CalendarCheck },
    { id: 'progress', label: 'Progress & Trends', icon: TrendingUp },
    { id: 'doctors', label: 'Find a Speech Therapist', icon: Stethoscope },
    { id: 'about', label: 'Clinical Protocols', icon: BookOpen },
    { id: 'profile', label: 'Profile & Settings', icon: User }
  ];

  const therapistNavItems = [
    { id: 'admin', label: 'Doctor Caseload', icon: ShieldCheck },
    { id: 'doctors', label: 'Therapist Directory', icon: Stethoscope },
    { id: 'speech_practice', label: 'Speech Diagnostic Lab', icon: Mic },
    { id: 'forensic_audio', label: 'Forensic Audio Lab', icon: FileAudio },
    { id: 'biofeedback_wearable', label: 'Patient Biofeedback', icon: Activity },
    { id: 'pediatric', label: 'Pediatric Mode', icon: Gamepad2 },
    { id: 'exercises', label: 'Exercise Library', icon: Dumbbell },
    { id: 'about', label: 'Clinical Protocols', icon: BookOpen },
    { id: 'profile', label: 'Clinician Settings', icon: User }
  ];

  const items = role === 'therapist' ? therapistNavItems : patientNavItems;

  const handleNav = (id: string) => {
    setCurrentPage(id);
    if (onClose) onClose();
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 transition-all duration-300 ease-in-out lg:static shrink-0 ${
        isOpen
          ? 'w-64 translate-x-0 opacity-100 shadow-lg lg:shadow-none'
          : '-translate-x-full lg:translate-x-0 lg:w-0 lg:p-0 lg:overflow-hidden lg:border-none opacity-0 pointer-events-none'
      }`}
    >
      <div className={`flex h-full flex-col justify-between p-4 w-64 ${!isOpen ? 'hidden lg:hidden' : ''}`}>
        {/* Top Branding & Navigation */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <div
              onClick={() => handleNav('dashboard')}
              className="flex items-center gap-2.5 cursor-pointer group flex-1 min-w-0"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-700 text-white font-bold shadow-xs group-hover:bg-teal-800 transition-colors shrink-0">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div className="truncate">
                <span className="font-display font-bold text-base text-slate-900 dark:text-white leading-none block">
                  FluencyAI
                </span>
                <span className="text-[11px] text-teal-700 dark:text-teal-400 font-medium truncate block">
                  Speech Therapy Portal
                </span>
              </div>
            </div>

            {/* Collapse/Hide Sidebar Button */}
            <button
              onClick={onToggle || onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-500 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors shrink-0"
              title="Hide sidebar menu"
              aria-label="Hide sidebar menu"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-0.5">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-teal-50 text-teal-800 font-semibold border-l-2 border-teal-700 dark:bg-teal-950/60 dark:text-teal-200 dark:border-teal-500'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-100'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-teal-700 dark:text-teal-400' : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                  {item.id === 'daily_plan' && (
                    <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-300">
                      <Flame className="w-2.5 h-2.5 fill-amber-500 text-amber-600" />
                      {streakDays}d
                    </span>
                  )}
                </button>
              );
            })}

            {/* Quick Hide Button at bottom of navigation */}
            <button
              onClick={onToggle || onClose}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/80 transition-colors mt-2 border border-slate-200/60 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/20"
              title="Hide sidebar menu"
            >
              <span className="flex items-center gap-2">
                <ChevronsLeft className="w-4 h-4 text-slate-400" />
                <span>Hide Sidebar</span>
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400">Collapse</span>
            </button>
          </nav>
        </div>

        {/* Bottom Actions & User Profile */}
        <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          {/* User Account Tile */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div
              onClick={() => handleNav('profile')}
              className="flex items-center gap-2.5 overflow-hidden cursor-pointer flex-1"
            >
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullName}`}
                alt={user?.fullName}
                className="h-7 w-7 rounded-full bg-slate-200 object-cover shrink-0 border border-slate-200 dark:border-slate-700"
              />
              <div className="truncate text-left">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-tight">
                  {user?.fullName || 'Alex Johnson'}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {user?.role === 'therapist' ? 'Clinician' : 'Active Patient'}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

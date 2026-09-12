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
  Palette,
  LogOut,
  HeartPulse
} from 'lucide-react';

interface SidebarProps {
  onOpenThemeModal?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenThemeModal, isOpen = false, onClose }) => {
  const { currentPage, setCurrentPage, role, user, logout } = useAuth();

  const patientNavItems = [
    { id: 'dashboard', label: 'Home / Dashboard', icon: Home },
    { id: 'speech_practice', label: 'Speech Practice', icon: Mic },
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
      className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 transition-transform duration-200 lg:static lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex h-full flex-col justify-between p-4">
        {/* Top Branding & Navigation */}
        <div className="space-y-6">
          <div
            onClick={() => handleNav('dashboard')}
            className="flex items-center gap-3 px-2 cursor-pointer group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-700 text-white font-bold shadow-xs group-hover:bg-teal-800 transition-colors">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-bold text-base text-slate-900 dark:text-white leading-none block">
                FluencyAI
              </span>
              <span className="text-[11px] text-teal-700 dark:text-teal-400 font-medium">
                Speech Therapy Portal
              </span>
            </div>
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
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions & User Profile */}
        <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          {onOpenThemeModal && (
            <button
              onClick={onOpenThemeModal}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            >
              <Palette className="w-4 h-4 text-slate-400" />
              <span>Accessibility & Theme</span>
            </button>
          )}

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

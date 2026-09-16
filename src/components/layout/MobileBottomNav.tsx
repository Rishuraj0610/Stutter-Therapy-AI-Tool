import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Home, CalendarCheck, Mic, MessageSquareHeart, User } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentPage, setCurrentPage } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'daily_plan', label: 'Daily Plan', icon: CalendarCheck },
    { id: 'speech_practice', label: 'Practice', icon: Mic },
    { id: 'ai_counselling', label: 'Counsellor', icon: MessageSquareHeart },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      aria-label="Mobile Navigation"
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 dark:bg-slate-900/95 dark:border-slate-800 lg:hidden px-2 py-1.5 flex items-center justify-around shadow-sm"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors text-[11px] font-medium ${
              isActive
                ? 'text-teal-700 dark:text-teal-400 font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Icon
              className={`w-5 h-5 mb-0.5 ${
                isActive ? 'text-teal-700 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'
              }`}
            />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

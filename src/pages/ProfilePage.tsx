import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Palette, Type, ShieldCheck, Stethoscope, Sun, Moon, LogOut, Check } from 'lucide-react';
import { ThemeSelectorModal } from '../components/common/ThemeSelectorModal';

export const ProfilePage: React.FC = () => {
  const { user, role, switchDemoRole, logout, theme, toggleTheme, appTheme, fontSize, setFontSize } = useAuth();
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-16">
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
        Account & Accessibility Settings
      </h1>

      {/* User Information Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={user?.fullName}
            className="h-16 w-16 rounded-2xl object-cover border-2 border-teal-500/20"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-slate-900 dark:text-white">
                {user?.fullName || 'Alex Johnson'}
              </h2>
              <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[10px] font-bold text-teal-700 capitalize dark:bg-teal-950 dark:text-teal-300">
                {role} Account
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
            {user?.credentials && (
              <p className="text-xs text-teal-600 font-semibold mt-0.5">{user.credentials}</p>
            )}
          </div>
        </div>

        <button
          onClick={logout}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      {/* Theme & Design Improvement Preferences */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Palette className="w-5 h-5 text-teal-600" />
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Theme & Design Customization
              </h3>
              <p className="text-xs text-slate-500">
                Active theme: <strong className="capitalize text-teal-600">{appTheme}</strong> • Dark mode: <strong className="capitalize text-teal-600">{theme}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsThemeModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors shadow-xs"
          >
            Customize Themes
          </button>
        </div>
      </div>

      {/* Role Switching for Demonstration */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Switch Platform Perspectives
            </h3>
            <p className="text-xs text-slate-500">
              Quickly test the platform as an active Speech Patient or a Licensed Doctor / Therapist
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <button
            onClick={() => switchDemoRole('patient')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              role === 'patient'
                ? 'border-teal-600 bg-teal-50/60 dark:bg-teal-950/40 dark:border-teal-500 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900 dark:text-white">Patient Perspective</span>
              {role === 'patient' && <Check className="w-4 h-4 text-teal-600" />}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Access the ML speech spectrogram lab, daily exercises, doctor booking, and AI counsellor.
            </p>
          </button>

          <button
            onClick={() => switchDemoRole('therapist')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              role === 'therapist'
                ? 'border-teal-600 bg-teal-50/60 dark:bg-teal-950/40 dark:border-teal-500 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900 dark:text-white">Speech Doctor Perspective</span>
              {role === 'therapist' && <Check className="w-4 h-4 text-teal-600" />}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Clinician view: review incoming patient recordings, manage appointment schedules, and prescribe drills.
            </p>
          </button>
        </div>
      </div>

      <ThemeSelectorModal isOpen={isThemeModalOpen} onClose={() => setIsThemeModalOpen(false)} />
    </div>
  );
};

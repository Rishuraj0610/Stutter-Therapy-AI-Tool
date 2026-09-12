import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { AppTheme, FontSize } from '../../types';
import { X, Check, Sun, Moon, Palette, Type, Sparkles } from 'lucide-react';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({ isOpen, onClose }) => {
  const { theme, toggleTheme, appTheme, setAppTheme, fontSize, setFontSize } = useAuth();

  if (!isOpen) return null;

  const themes: { id: AppTheme; name: string; desc: string; color: string; bgClass: string; borderClass: string }[] = [
    {
      id: 'teal',
      name: 'Clinical Teal (Default)',
      desc: 'Calming speech pathology standard tone designed to reduce vocal anxiety.',
      color: '#0d9488',
      bgClass: 'bg-teal-500',
      borderClass: 'border-teal-500'
    },
    {
      id: 'indigo',
      name: 'Deep Neuro Indigo',
      desc: 'Cognitive focus palette tuned for intense articulation and biofeedback drills.',
      color: '#4f46e5',
      bgClass: 'bg-indigo-600',
      borderClass: 'border-indigo-600'
    },
    {
      id: 'warm',
      name: 'Warm Terracotta',
      desc: 'Gentle, warm earth hues easing diaphragm tension and breathing mindfulness.',
      color: '#ea580c',
      bgClass: 'bg-orange-500',
      borderClass: 'border-orange-500'
    },
    {
      id: 'contrast',
      name: 'High Precision Blue',
      desc: 'High-contrast medical view optimized for acoustic graph readability and outdoors.',
      color: '#0284c7',
      bgClass: 'bg-sky-600',
      borderClass: 'border-sky-600'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Appearance & Themes
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Customize clinical color palette and typography scale
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Color Themes */}
        <div className="mt-5 space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Clinical Color Palette
          </label>
          <div className="grid grid-cols-1 gap-2.5">
            {themes.map((t) => {
              const isSelected = appTheme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setAppTheme(t.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50/60 dark:bg-teal-950/40 dark:border-teal-500 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-4 h-4 rounded-full ${t.bgClass} ring-2 ring-white dark:ring-slate-900 shadow-xs`}
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {t.name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                        {t.desc}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="p-1 rounded-full bg-teal-600 text-white">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mode & Font Scale */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3">
          {/* Day / Night Mode */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
              Light / Dark Mode
            </label>
            <button
              onClick={toggleTheme}
              className="flex items-center justify-between w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-indigo-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </span>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">Toggle</span>
            </button>
          </div>

          {/* Font Accessibility Scaling */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
              Font Scale
            </label>
            <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 p-0.5">
              <button
                onClick={() => setFontSize('normal')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  fontSize === 'normal'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Standard
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  fontSize === 'large'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Large +
              </button>
            </div>
          </div>
        </div>

        {/* Live Preview Sample */}
        <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Live Theme Preview
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            "Gentle onset breathing: soften initial consonant attack."
          </p>
        </div>

        {/* Footer Done */}
        <div className="mt-5">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};

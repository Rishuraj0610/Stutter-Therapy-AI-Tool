import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Heart, Sparkles, Stethoscope, Cpu, BookOpen } from 'lucide-react';
import { DisclaimerNotice } from '../components/common/DisclaimerNotice';

export const AboutPage: React.FC = () => {
  const { setCurrentPage } = useAuth();

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-16">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          About FluencyAI Clinical Platform
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Bridging neural acoustic machine learning and board-certified speech pathology.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
        <h2 className="font-bold text-lg text-slate-900 dark:text-white">
          Our Clinical Methodology
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          FluencyAI integrates evidence-based behavioral speech modification strategies—specifically the Camperdown Program for prolonged speech, gentle phonatory onset, and continuous voicing—with modern deep-learning acoustic extraction.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900">
            <Cpu className="w-5 h-5 text-teal-600 mb-2" />
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">Neural Speech Modeling</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Extracts high-resolution spectrogram vectors to identify blocks, prolongations, and pitch instability in real time.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900">
            <Stethoscope className="w-5 h-5 text-indigo-600 mb-2" />
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">Real Doctor Telehealth</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Connect directly with certified Speech-Language Pathologists who review your machine learning reports and calibrate daily therapy.
            </p>
          </div>
        </div>
      </div>

      <DisclaimerNotice />
    </div>
  );
};

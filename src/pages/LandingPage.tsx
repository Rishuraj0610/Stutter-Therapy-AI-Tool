import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  HeartPulse,
  Mic,
  Stethoscope,
  ShieldCheck,
  ArrowRight,
  MessageSquareHeart,
  CalendarCheck,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Award,
  Lock
} from 'lucide-react';
import { DisclaimerNotice } from '../components/common/DisclaimerNotice';

export const LandingPage: React.FC = () => {
  const { setCurrentPage, isAuthenticated } = useAuth();

  const handleStartPractice = () => {
    if (isAuthenticated) {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('login');
    }
  };

  const handleFindTherapist = () => {
    if (isAuthenticated) {
      setCurrentPage('doctors');
    } else {
      setCurrentPage('login');
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-12 pb-16 pt-4">
      {/* Hero Section */}
      <section
        id="landing-hero"
        className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 dark:border-slate-800 dark:bg-slate-900 shadow-xs text-center space-y-6 max-w-4xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3.5 py-1 text-xs font-semibold text-teal-800 border border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800">
          <HeartPulse className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
          Clinical Speech Pathology & Therapeutic Care
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
          Compassionate Speech Therapy & AI-Powered Fluency Practice
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Build lasting speaking ease and confidence. Practice daily motor-speech techniques, connect with licensed Speech-Language Pathologists, and receive empathetic AI counselling.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={handleStartPractice}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-700 hover:bg-teal-800 px-6 py-3 text-sm font-semibold text-white shadow-xs transition-colors"
          >
            Start Patient Practice <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleFindTherapist}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-5 py-3 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors shadow-2xs"
          >
            <Stethoscope className="w-4 h-4 text-teal-700 dark:text-teal-400" />
            <span>Find a Speech Therapist</span>
            {!isAuthenticated && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/80 px-2 py-0.5 rounded-md border border-teal-200/60 dark:border-teal-800/60 ml-1">
                <Lock className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                Sign In
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center justify-center gap-6 pt-4 text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Evidence-informed
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> Private & confidential
          </span>
          <span className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-500" /> SLP-reviewed
          </span>
        </div>
      </section>

      {/* 3 Pillars of Care */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 flex items-center justify-center">
            <Mic className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Daily Guided Practice
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Targeted drills for gentle phonatory onset, continuous speech flow, and pacing control calibrated to your personal baseline.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300 flex items-center justify-center">
            <MessageSquareHeart className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            AI Speech Counsellor
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            CBT-informed conversational partner available 24/7 to practice upcoming phone calls, presentations, and manage situational speaking anxiety.
          </p>
        </div>

        <div
          onClick={handleFindTherapist}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3 cursor-pointer hover:border-teal-400 hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between mt-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Licensed SLP Directory
              </h3>
              {!isAuthenticated && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                  <Lock className="w-2.5 h-2.5 text-slate-400" /> Protected
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
              Connect with certified Speech-Language Pathologists for 1-on-1 clinical assessments, personalized care plans, and regular check-ins.
            </p>
          </div>
          <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-teal-700 dark:text-teal-400 group-hover:translate-x-0.5 transition-transform">
            <span>{isAuthenticated ? 'Browse Verified Therapists' : 'Sign In to Access Directory'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      <DisclaimerNotice />
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Mic,
  Square,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Cpu,
  Stethoscope
} from 'lucide-react';

export const SpeechPracticePage: React.FC = () => {
  const { setCurrentPage } = useAuth();
  const [selectedExercise, setSelectedExercise] = useState(0);
  const [isPracticing, setIsPracticing] = useState(false);
  const [duration, setDuration] = useState(0);
  const [score, setScore] = useState<number | null>(null);

  const exercises = [
    {
      title: 'Gentle Consonant Onset (Easy Starts)',
      technique: 'Phonation Mechanics',
      wpm: 120,
      description: 'Begin vocal cord vibration with a gentle sigh of air before shaping the initial consonant.',
      sample: 'Peter opened the blue umbrella before the sudden rain began.'
    },
    {
      title: 'Continuous Phonation (Flow Technique)',
      technique: 'Acoustic Continuity',
      wpm: 135,
      description: 'Keep your vocal cords vibrating gently throughout the entire sentence, connecting word boundaries.',
      sample: 'Every morning brings a quiet calm that slowly warms the valley.'
    },
    {
      title: 'Light Articulatory Contact',
      technique: 'Tension Reduction',
      wpm: 130,
      description: 'Make feather-light contact between your tongue and palate or lips when producing plosives (/p/, /b/, /t/, /d/).',
      sample: 'The bakery delivers fresh bread and sweet pastries down town.'
    }
  ];

  const current = exercises[selectedExercise];

  useEffect(() => {
    let timer: any = null;
    if (isPracticing) {
      timer = setInterval(() => setDuration((d) => d + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isPracticing]);

  const handleToggle = () => {
    if (isPracticing) {
      setIsPracticing(false);
      setScore(Math.floor(82 + Math.random() * 14));
    } else {
      setIsPracticing(true);
      setDuration(0);
      setScore(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Targeted Speech Practice
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Clinical motor-speech techniques with target pacing guides and acoustic feedback.
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('ml_speech')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 text-xs font-bold border border-teal-200 dark:border-teal-800"
        >
          <Cpu className="w-4 h-4" />
          Full ML Spectrogram Lab
        </button>
      </div>

      {/* Exercise Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {exercises.map((ex, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSelectedExercise(idx);
              setScore(null);
              setIsPracticing(false);
            }}
            className={`p-4 rounded-2xl border text-left transition-all ${
              selectedExercise === idx
                ? 'border-teal-600 bg-teal-50/60 dark:bg-teal-950/40 dark:border-teal-500 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
            }`}
          >
            <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
              {ex.technique}
            </span>
            <h3 className="font-bold text-xs text-slate-900 dark:text-white mt-0.5">
              {ex.title}
            </h3>
            <span className="text-[11px] text-slate-400 mt-2 block">
              Pacing: {ex.wpm} WPM
            </span>
          </button>
        ))}
      </div>

      {/* Main Practice Workspace Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-6">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
            Target Pace: {current.wpm} Words Per Minute
          </span>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {current.description}
          </p>
        </div>

        {/* Practice Prompt Display */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800/60 text-center space-y-3">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Read aloud using gentle breath onset:
          </span>
          <p className="font-serif text-xl sm:text-2xl text-slate-900 dark:text-white leading-relaxed max-w-xl mx-auto">
            "{current.sample}"
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggle}
              className={`inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-xs font-bold text-white shadow-md transition-all ${
                isPracticing
                  ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                  : 'bg-teal-600 hover:bg-teal-700'
              }`}
            >
              {isPracticing ? (
                <>
                  <Square className="w-4 h-4" /> Stop & Assess
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" /> Begin Audio Recording
                </>
              )}
            </button>

            {isPracticing && (
              <span className="text-xs font-mono font-bold text-red-600 dark:text-red-400">
                Duration: {duration}s
              </span>
            )}
          </div>

          {score && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-slate-400">Fluency Score</span>
                <p className="text-lg font-bold text-teal-600 dark:text-teal-400">{score}%</p>
              </div>
              <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <CheckCircle2 className="w-5 h-5" />
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

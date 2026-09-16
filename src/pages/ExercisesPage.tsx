import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Dumbbell, Play, CheckCircle2, Clock, Sparkles, Check } from 'lucide-react';

export const ExercisesPage: React.FC = () => {
  const { setCurrentPage, recordPracticeSessionCompleted } = useAuth();
  const [completedTitles, setCompletedTitles] = useState<string[]>([]);

  const handleMarkComplete = (title: string) => {
    recordPracticeSessionCompleted(title);
    setCompletedTitles((prev) => [...prev, title]);
  };

  const categories = [
    {
      title: 'Diaphragmatic Breathing & Support',
      desc: 'Deep abdominal inhalation ensuring stable pulmonary air pressure prior to speech initiation.',
      time: '5 min',
      difficulty: 'Beginner',
      drills: ['4-4-6 Abdominal Breath Cycles', 'Voiceless Exhalation Pacing', 'Gentle Hissing Continuous Release']
    },
    {
      title: 'Gentle Phonation Onset (Easy Starts)',
      desc: 'Gradual vocal fold adduction avoiding glottal strikes on initial plosives and vowels.',
      time: '8 min',
      difficulty: 'Intermediate',
      drills: ['Vowel Glides (/a/ -> /i/ -> /u/)', 'Unvoiced Consonant Glide (/h/ + /p/)', 'Word Pair Soft Attacks']
    },
    {
      title: 'Continuous Phonation & Linkage',
      desc: 'Sustained voicing across word boundaries mimicking the Camperdown behavioral technique.',
      time: '10 min',
      difficulty: 'Intermediate',
      drills: ['Phrase Voicing Linking', 'Monologue Pacing at 130 WPM', 'Conversational Intonation Control']
    },
    {
      title: 'Block Modification (Cancellation & Pull-Out)',
      desc: 'Post-block pause followed by relaxed repetition, transitioning to in-block voluntary tension reduction.',
      time: '12 min',
      difficulty: 'Advanced',
      drills: ['Voluntary Stuttering Desensitization', 'Slow Motion Pull-Outs', '3-Second Post-Block Cancellation']
    }
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-16">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Clinical Speech Exercise Library
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Evidence-based motor learning drills covering respiratory, phonatory, and articulatory fluency mechanics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                  {cat.difficulty}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                  <Clock className="w-3 h-3" /> {cat.time}
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 dark:text-white mt-3">
                {cat.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {cat.desc}
              </p>

              <div className="mt-4 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Included Drills:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {cat.drills.map((drill, dIdx) => (
                    <li key={dIdx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                      <span>{drill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <button
                onClick={() => setCurrentPage('speech_practice')}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs transition-colors shadow-xs"
              >
                <Play className="w-3.5 h-3.5" />
                Practice Technique
              </button>

              <button
                onClick={() => handleMarkComplete(cat.title)}
                className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                  completedTitles.includes(cat.title)
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
                title="Mark completed in today's daily plan"
              >
                {completedTitles.includes(cat.title) ? (
                  <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                    <Check className="w-3.5 h-3.5 stroke-[3]" /> Recorded
                  </span>
                ) : (
                  'Mark Done'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

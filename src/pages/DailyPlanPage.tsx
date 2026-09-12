import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CalendarCheck, Flame, CheckCircle2, Circle, Clock, ArrowRight, Stethoscope } from 'lucide-react';

export const DailyPlanPage: React.FC = () => {
  const { setCurrentPage, streakDays } = useAuth();

  const schedule = [
    {
      time: 'Morning (8:00 AM)',
      task: '5-Minute Diaphragmatic Breath Alignment',
      type: 'Respiratory',
      done: true
    },
    {
      time: 'Mid-Day (1:00 PM)',
      task: 'Rainbow Passage Speech ML Spectrogram Test',
      type: 'Acoustic ML',
      done: true
    },
    {
      time: 'Afternoon (4:30 PM)',
      task: 'Continuous Phonation Phrase Linking (10 min)',
      type: 'Motor Phonation',
      done: false
    },
    {
      time: 'Evening (7:30 PM)',
      task: 'CBT Speech Anxiety Reflex Journaling with AI Counsellor',
      type: 'Cognitive Behavioral',
      done: false
    }
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Daily Practice Protocol
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Customized 7-day motor rehabilitation schedule prescribed by Dr. Marcus Vance.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 text-xs font-bold self-start sm:self-auto">
          <Flame className="w-4 h-4 fill-orange-500" />
          {streakDays} Day Active Streak
        </div>
      </div>

      {/* Week overview */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
          Weekly Fluency Journey (Day 5 of 7)
        </h3>
        <div className="grid grid-cols-7 gap-2 text-center">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
            <div
              key={day}
              className={`p-3 rounded-2xl border text-xs ${
                i < streakDays
                  ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/60 dark:border-teal-600 font-bold text-teal-700 dark:text-teal-300'
                  : i === streakDays
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-600 font-bold animate-pulse'
                  : 'border-slate-200 dark:border-slate-800 text-slate-400'
              }`}
            >
              <span>{day}</span>
              <div className="mt-1 flex justify-center">
                {i < streakDays ? (
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Task List */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
          Today's Scheduled Tasks
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {schedule.map((item, idx) => (
            <div key={idx} className="py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-xl ${
                    item.done
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                  }`}
                >
                  {item.done ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider">
                    {item.type} • {item.time}
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white mt-0.5">
                    {item.task}
                  </h4>
                </div>
              </div>

              {!item.done ? (
                <button
                  onClick={() => setCurrentPage('speech_practice')}
                  className="px-3 py-1.5 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition-colors"
                >
                  Start Task
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-600">Completed</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  CalendarCheck,
  Sun,
  Sunset,
  Moon,
  Clock,
  CheckCircle2,
  Circle,
  Flame,
  Bell,
  Play,
  Award,
  Sparkles,
  ArrowRight,
  Info,
  Check,
  X,
  RotateCcw
} from 'lucide-react';
import { DailyPracticePlan } from '../types';
import { DisclaimerNotice } from '../components/common/DisclaimerNotice';

const DEFAULT_7_DAY_PLANS: DailyPracticePlan[] = [
  {
    day: 1,
    title: 'Day 1 - Diaphragmatic Breath Anchor',
    completed: true,
    tasks: [
      { id: 'd1-t1', timeOfDay: 'morning', title: '5 mins Diaphragmatic Breathing Anchor', category: 'breathing', durationMinutes: 5, completed: true, exerciseId: 'breath-1', description: 'Anchor nervous system with gentle belly expansion and slow nasal inhalation.' },
      { id: 'd1-t2', timeOfDay: 'afternoon', title: '10 mins Slow Speaking Pace Drill', category: 'slow_speaking', durationMinutes: 10, completed: true, exerciseId: 'slow-1', description: 'Speak at a deliberate 90–100 WPM rate with intentional rhythmic pauses.' },
      { id: 'd1-t3', timeOfDay: 'evening', title: '5 mins Gentle Reading with Easy Onset', category: 'reading', durationMinutes: 5, completed: true, exerciseId: 'read-1', description: 'Soft vocal fold closure with gentle voicing on vowel onsets.' }
    ]
  },
  {
    day: 2,
    title: 'Day 2 - Easy Onset & Phonation Flow',
    completed: true,
    tasks: [
      { id: 'd2-t1', timeOfDay: 'morning', title: '5 mins Easy Vocal Onset (H-Words)', category: 'breathing', durationMinutes: 5, completed: true, exerciseId: 'breath-2', description: 'Use an aspirate /h/ cushion before vowel sounds to minimize vocal fold tension.' },
      { id: 'd2-t2', timeOfDay: 'afternoon', title: '10 mins Rainbow Passage Pacing', category: 'reading', durationMinutes: 10, completed: true, exerciseId: 'read-1', description: 'Read with smooth phrasing across natural breath groups.' },
      { id: 'd2-t3', timeOfDay: 'evening', title: '5 mins Confidence Vocal Affirmations', category: 'confidence', durationMinutes: 5, completed: true, exerciseId: 'read-custom', description: 'Grounding voice affirmations reinforcing natural speech rhythm.' }
    ]
  },
  {
    day: 3,
    title: 'Day 3 - Light Articulatory Contacts',
    completed: true,
    tasks: [
      { id: 'd3-t1', timeOfDay: 'morning', title: '5 mins Lip & Tongue Relaxation Drills', category: 'breathing', durationMinutes: 5, completed: true, exerciseId: 'breath-3', description: 'Releasing jaw and articulatory tension before speech.' },
      { id: 'd3-t2', timeOfDay: 'afternoon', title: '10 mins Difficult Plosive Words (/p/, /b/, /t/)', category: 'difficult_words', durationMinutes: 10, completed: true, exerciseId: 'diff-1', description: 'Feather-light articulatory contact without muscular pressing.' },
      { id: 'd3-t3', timeOfDay: 'evening', title: '5 mins Reading Arthur the Rat', category: 'reading', durationMinutes: 5, completed: true, exerciseId: 'read-2', description: 'Classic fluency passage read with relaxed articulators.' }
    ]
  },
  {
    day: 4,
    title: 'Day 4 - Pausing & Natural Phrasing',
    completed: true,
    tasks: [
      { id: 'd4-t1', timeOfDay: 'morning', title: '5 mins 4-7-8 Breathing Calmer', category: 'breathing', durationMinutes: 5, completed: true, exerciseId: 'breath-2', description: 'Vagus nerve stimulation to lower speech performance anxiety.' },
      { id: 'd4-t2', timeOfDay: 'afternoon', title: '10 mins Pausing at Punctuation Drill', category: 'reading', durationMinutes: 10, completed: true, exerciseId: 'read-1', description: 'Insert deliberate 1-second pauses at commas and sentence boundaries.' },
      { id: 'd4-t3', timeOfDay: 'evening', title: '5 mins Short Conversational Prompts', category: 'conversation', durationMinutes: 5, completed: true, exerciseId: 'conv-1', description: 'Practicing pausing before speaking to formulate thoughts calmly.' }
    ]
  },
  {
    day: 5,
    title: 'Day 5 - Real-Life Situations (Ordering at Cafe)',
    completed: false,
    tasks: [
      { id: 'task-m', timeOfDay: 'morning', title: '5 minutes Diaphragmatic Breathing', category: 'breathing', durationMinutes: 5, completed: true, exerciseId: 'breath-1', description: 'Establish foundational breath support before daily interactions.' },
      { id: 'task-a', timeOfDay: 'afternoon', title: '10 minutes Reading Practice (Pacing & Light Contact)', category: 'reading', durationMinutes: 10, completed: true, exerciseId: 'read-1', description: 'Maintain relaxed jaw and gentle articulatory contact.' },
      { id: 'task-e', timeOfDay: 'evening', title: '5 minutes Conversation Simulation (Ordering at Cafe)', category: 'conversation', durationMinutes: 5, completed: false, exerciseId: 'conv-1', description: 'Simulate a friendly coffee shop order using continuous phonation.' }
    ]
  },
  {
    day: 6,
    title: 'Day 6 - Telephone Call Simulation',
    completed: false,
    tasks: [
      { id: 'd6-t1', timeOfDay: 'morning', title: '5 mins Box Breathing (Calm Nerves)', category: 'breathing', durationMinutes: 5, completed: false, exerciseId: 'breath-3', description: '4x4 square breathing to defuse phone anxiety.' },
      { id: 'd6-t2', timeOfDay: 'afternoon', title: '10 mins Phone Introduction Simulation', category: 'conversation', durationMinutes: 10, completed: false, exerciseId: 'conv-2', description: 'Practice introducing yourself over simulated telephone audio.' },
      { id: 'd6-t3', timeOfDay: 'evening', title: '5 mins Slow Speech Syllable Tapping', category: 'slow_speaking', durationMinutes: 5, completed: false, exerciseId: 'slow-2', description: 'Rhythmic syllable pacing to coordinate speech motor flow.' }
    ]
  },
  {
    day: 7,
    title: 'Day 7 - Mastery Review & Self-Reflection',
    completed: false,
    tasks: [
      { id: 'd7-t1', timeOfDay: 'morning', title: '5 mins Full Breath & Voice Integration', category: 'breathing', durationMinutes: 5, completed: false, exerciseId: 'breath-1', description: 'Synchronize abdominal breathing with easy vocal onset.' },
      { id: 'd7-t2', timeOfDay: 'afternoon', title: '10 mins Arthur the Rat Recording Review', category: 'reading', durationMinutes: 10, completed: false, exerciseId: 'read-2', description: 'Comprehensive reading evaluation comparing baseline WPM.' },
      { id: 'd7-t3', timeOfDay: 'evening', title: '5 mins AI Counsellor Reflection Check-in', category: 'confidence', durationMinutes: 5, completed: false, exerciseId: 'conv-1', description: 'Celebrate weekly gains and solidify long-term motor habits.' }
    ]
  }
];

export const DailyPracticePlanPage: React.FC = () => {
  const { token, setCurrentPage, streakDays, setStreakDays } = useAuth();
  const [plans, setPlans] = useState<DailyPracticePlan[]>(DEFAULT_7_DAY_PLANS);
  const [selectedDayIndex, setSelectedDayIndex] = useState(4); // Day 5 by default
  const [loading, setLoading] = useState(false);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState('08:30');
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const startExercise = (exerciseId: string) => {
    if (exerciseId.startsWith('conv') || exerciseId.startsWith('ai')) {
      setCurrentPage('ai_counselling');
    } else if (exerciseId.startsWith('read')) {
      setCurrentPage('practice');
    } else {
      setCurrentPage('exercises');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  useEffect(() => {
    const fetchPlan = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const res = await fetch('/api/daily-plan', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.plans) && data.plans.length > 0) {
            setPlans(data.plans);
          } else if (Array.isArray(data)) {
            setPlans(data);
          }
          if (typeof data.streakDays === 'number') {
            setStreakDays(data.streakDays);
          }
          if (data.remindersEnabled !== undefined) {
            setRemindersEnabled(data.remindersEnabled);
          }
          if (data.reminderTime) {
            // Normalize to HH:MM format if needed
            const timeStr = data.reminderTime.includes(' ')
              ? (data.reminderTime.startsWith('08') ? '08:30' : '09:00')
              : data.reminderTime;
            setReminderTime(timeStr);
          }
          if (typeof data.currentDay === 'number' && data.currentDay >= 1 && data.currentDay <= 7) {
            setSelectedDayIndex(data.currentDay - 1);
          }
        }
      } catch (err) {
        console.error('Failed to load daily plan', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [token, setStreakDays]);

  const toggleTask = async (taskId: string, currentCompleted: boolean) => {
    const nextCompleted = !currentCompleted;

    // 1. Immediate optimistic update across plans
    setPlans(prevPlans =>
      (Array.isArray(prevPlans) ? prevPlans : DEFAULT_7_DAY_PLANS).map(dayPlan => {
        const hasTask = dayPlan.tasks.some(t => t.id === taskId);
        if (!hasTask) return dayPlan;

        const updatedTasks = dayPlan.tasks.map(t =>
          t.id === taskId ? { ...t, completed: nextCompleted } : t
        );
        const allCompleted = updatedTasks.every(t => t.completed);
        return {
          ...dayPlan,
          tasks: updatedTasks,
          completed: allCompleted
        };
      })
    );

    // 2. Persist to consolidated backend
    try {
      const res = await fetch('/api/daily-plan/toggle-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ taskId, completed: nextCompleted })
      });

      if (res.ok) {
        const data = await res.json();
        if (typeof data.streakDays === 'number') {
          setStreakDays(data.streakDays);
        }
        if (Array.isArray(data.plans)) {
          setPlans(data.plans);
        }
        if (data.allDone) {
          showToast(`🌟 All tasks completed for Day ${safePlans[selectedDayIndex]?.day || 5}! Streak updated!`);
        } else if (nextCompleted) {
          showToast(`✓ Task completed! Keep up the great speech practice.`);
        }
      }
    } catch (e) {
      console.error('Failed to update task state on server', e);
      showToast('Offline state updated locally.');
    }
  };

  const handleSaveReminderSettings = async (enabled: boolean, time: string) => {
    setRemindersEnabled(enabled);
    setReminderTime(time);
    try {
      await fetch('/api/daily-plan/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ remindersEnabled: enabled, reminderTime: time })
      });
      showToast(enabled ? `Reminders scheduled daily for ${time}` : 'Reminders muted');
    } catch (e) {
      console.error('Failed to save reminder preferences', e);
    }
  };

  const safePlans = Array.isArray(plans) && plans.length > 0 ? plans : DEFAULT_7_DAY_PLANS;
  const activeDay = safePlans[selectedDayIndex] || safePlans[0] || DEFAULT_7_DAY_PLANS[0];
  const activeCompletedTasks = activeDay.tasks.filter(t => t.completed).length;
  const activeTotalTasks = activeDay.tasks.length;
  const daysLeftToMaster = Math.max(0, 7 - streakDays);

  return (
    <div className="space-y-8 p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-slate-900 text-white px-5 py-3 shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Sparkles className="h-4 w-4 text-teal-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Streak Explanation Modal */}
      {showStreakModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-amber-100 dark:bg-amber-950/80 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Flame className="h-5 w-5 fill-current" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-slate-950 dark:text-white">
                    How Your Practice Streak is Counted
                  </h3>
                  <p className="text-xs text-slate-500">
                    Transparent, clinical motor-habit tracking
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowStreakModal(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs text-slate-600 dark:text-slate-300">
              <div className="rounded-2xl bg-amber-50/70 p-4 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950 dark:text-amber-200">
                    Current Verified Streak:
                  </span>
                  <span className="font-display font-extrabold text-amber-700 dark:text-amber-400 text-sm">
                    {streakDays} Consecutive Days
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex gap-3 items-start">
                  <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 font-bold text-[10px]">
                    1
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white block">Sequential Curriculum Completion</strong>
                    Every completed curriculum day from Day 1 onward counts towards your structured motor retraining milestone.
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 font-bold text-[10px]">
                    2
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white block">Active Daily Practice</strong>
                    Completing any morning, afternoon, or evening exercise or recording a speech practice session keeps today's practice day active.
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 font-bold text-[10px]">
                    3
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white block">24-Hour Fair Grace Window</strong>
                    If you completed practice yesterday, your active streak is held open throughout today until midnight, giving you full flexibility to practice at your ideal routine time.
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 font-bold text-[10px]">
                    4
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white block">Accurate Recalculation</strong>
                    Toggling task checkboxes updates your streak status deterministically from real practice activity, without phantom jumps or loss of earned progress.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowStreakModal(false)}
                className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 mb-2">
            <CalendarCheck className="h-3.5 w-3.5" />
            7-Day Continuous Fluency Plan
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white">
            Daily Practice Plan & Routine
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            A balanced 15–20 minute daily structure divided across Morning, Afternoon, and Evening reinforcement blocks.
          </p>
        </div>

        {/* Practice Streak Badge & Info Trigger */}
        <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-3 sm:px-4 sm:py-3 dark:border-amber-900/40 dark:bg-amber-950/30">
          <Flame className="h-6 w-6 fill-amber-500 text-amber-500 animate-pulse shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-950 dark:text-amber-200">
                {streakDays}-Day Active Streak
              </span>
              <button
                onClick={() => setShowStreakModal(true)}
                className="text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200 flex items-center gap-0.5 text-[10px] underline underline-offset-2"
                title="Click to learn how the streak is calculated"
              >
                <Info className="h-3 w-3" />
                <span>How it counts</span>
              </button>
            </div>
            <span className="text-[10px] text-amber-700 dark:text-amber-400 block mt-0.5">
              {streakDays >= 7
                ? '🎉 7-Day Fluency Milestone Completed!'
                : `${daysLeftToMaster} more ${daysLeftToMaster === 1 ? 'day' : 'days'} to achieve the 7-Day Master Badge!`}
            </span>
          </div>
        </div>
      </div>

      {/* 7-Day Navigation Tabs */}
      <div className="rounded-3xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {safePlans.map((day, idx) => {
            const isSelected = selectedDayIndex === idx;
            const completedCount = day.tasks.filter(t => t.completed).length;
            const totalCount = day.tasks.length;

            return (
              <button
                key={day.day}
                onClick={() => setSelectedDayIndex(idx)}
                className={`rounded-2xl p-2 sm:p-3 text-center transition-all ${
                  isSelected
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 dark:bg-teal-500 dark:text-slate-950'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <span className="block text-[10px] font-bold uppercase tracking-wider opacity-80">
                  Day {day.day}
                </span>
                <span className="block font-display text-xs sm:text-sm font-extrabold mt-0.5 truncate">
                  {day.title.replace('Day ' + day.day + ' - ', '').split(' ')[0]}
                </span>
                <span
                  className={`mt-1.5 inline-block rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${
                    day.completed
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : isSelected
                      ? 'bg-white/20 text-white dark:bg-slate-900/40 dark:text-slate-950'
                      : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                  }`}
                >
                  {completedCount}/{totalCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Day Overview Banner & Tasks */}
      {activeDay && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-teal-100 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 p-6 dark:border-teal-900/40 dark:from-teal-950/40 dark:to-emerald-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  Focus for Day {activeDay.day}
                </span>
                {activeDay.completed && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                    <Check className="h-3 w-3" />
                    Day Mastered
                  </span>
                )}
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-950 dark:text-white mt-1">
                {activeDay.title}
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl">
                Goal: Complete all 3 gentle sessions (~15-20 minutes total) to maintain progressive fluency motor habits.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-slate-800 shadow-xs dark:bg-slate-800 dark:text-white">
                {activeCompletedTasks} of {activeTotalTasks} Completed
              </span>
            </div>
          </div>

          {/* Three Daily Time Slots (Morning, Afternoon, Evening) */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Morning Slot */}
            {activeDay.tasks.filter(t => t.timeOfDay === 'morning').map(task => (
              <div
                key={task.id}
                className={`flex flex-col justify-between rounded-3xl border p-6 transition-all ${
                  task.completed
                    ? 'border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/20'
                    : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                      <Sun className="h-4 w-4" />
                      Morning Anchor
                    </span>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={task.completed}
                      aria-label={`Toggle task ${task.title}`}
                      onClick={() => toggleTask(task.id, task.completed)}
                      className="p-1 rounded-lg text-teal-600 hover:text-teal-700 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-slate-800 transition-colors"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="h-6 w-6 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                      ) : (
                        <Circle className="h-6 w-6 text-slate-300 hover:text-teal-600" />
                      )}
                    </button>
                  </div>

                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-1 mb-2">
                    <Clock className="h-3.5 w-3.5 text-teal-600" />
                    <span>{task.durationMinutes} minutes</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {task.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <button
                    onClick={() => toggleTask(task.id, task.completed)}
                    className={`w-full py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
                      task.completed
                        ? 'border-emerald-200 bg-emerald-100/50 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {task.completed ? '✓ Completed (Click to undo)' : 'Mark as Completed'}
                  </button>

                  <button
                    onClick={() => startExercise(task.exerciseId)}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 hover:bg-teal-600 hover:text-white py-2.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-teal-600 dark:hover:text-white transition-colors"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    Launch Activity
                  </button>
                </div>
              </div>
            ))}

            {/* Afternoon Slot */}
            {activeDay.tasks.filter(t => t.timeOfDay === 'afternoon').map(task => (
              <div
                key={task.id}
                className={`flex flex-col justify-between rounded-3xl border p-6 transition-all ${
                  task.completed
                    ? 'border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/20'
                    : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400">
                      <Sunset className="h-4 w-4" />
                      Afternoon Practice
                    </span>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={task.completed}
                      aria-label={`Toggle task ${task.title}`}
                      onClick={() => toggleTask(task.id, task.completed)}
                      className="p-1 rounded-lg text-teal-600 hover:text-teal-700 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-slate-800 transition-colors"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="h-6 w-6 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                      ) : (
                        <Circle className="h-6 w-6 text-slate-300 hover:text-teal-600" />
                      )}
                    </button>
                  </div>

                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-1 mb-2">
                    <Clock className="h-3.5 w-3.5 text-teal-600" />
                    <span>{task.durationMinutes} minutes</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {task.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <button
                    onClick={() => toggleTask(task.id, task.completed)}
                    className={`w-full py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
                      task.completed
                        ? 'border-emerald-200 bg-emerald-100/50 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {task.completed ? '✓ Completed (Click to undo)' : 'Mark as Completed'}
                  </button>

                  <button
                    onClick={() => startExercise(task.exerciseId)}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 hover:bg-teal-600 hover:text-white py-2.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-teal-600 dark:hover:text-white transition-colors"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    Launch Activity
                  </button>
                </div>
              </div>
            ))}

            {/* Evening Slot */}
            {activeDay.tasks.filter(t => t.timeOfDay === 'evening').map(task => (
              <div
                key={task.id}
                className={`flex flex-col justify-between rounded-3xl border p-6 transition-all ${
                  task.completed
                    ? 'border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/20'
                    : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      <Moon className="h-4 w-4" />
                      Evening Simulation & Wind-down
                    </span>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={task.completed}
                      aria-label={`Toggle task ${task.title}`}
                      onClick={() => toggleTask(task.id, task.completed)}
                      className="p-1 rounded-lg text-teal-600 hover:text-teal-700 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-slate-800 transition-colors"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="h-6 w-6 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                      ) : (
                        <Circle className="h-6 w-6 text-slate-300 hover:text-teal-600" />
                      )}
                    </button>
                  </div>

                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-1 mb-2">
                    <Clock className="h-3.5 w-3.5 text-teal-600" />
                    <span>{task.durationMinutes} minutes</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {task.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <button
                    onClick={() => toggleTask(task.id, task.completed)}
                    className={`w-full py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
                      task.completed
                        ? 'border-emerald-200 bg-emerald-100/50 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {task.completed ? '✓ Completed (Click to undo)' : 'Mark as Completed'}
                  </button>

                  <button
                    onClick={() => startExercise(task.exerciseId)}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 hover:bg-teal-600 hover:text-white py-2.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-teal-600 dark:hover:text-white transition-colors"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    Launch Activity
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reminder Notification Settings Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400 flex items-center justify-center">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                Daily Practice Reminders
              </h3>
              <p className="text-xs text-slate-500">
                Receive prompt notifications to support steady cognitive motor practice.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => handleSaveReminderSettings(remindersEnabled, e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <button
              onClick={() => handleSaveReminderSettings(!remindersEnabled, reminderTime)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                remindersEnabled
                  ? 'bg-teal-600 text-white shadow-xs hover:bg-teal-700'
                  : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-300'
              }`}
            >
              {remindersEnabled ? 'Enabled ✓' : 'Muted'}
            </button>
          </div>
        </div>
      </div>

      <DisclaimerNotice compact />
    </div>
  );
};

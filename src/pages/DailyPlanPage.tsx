import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  CalendarCheck,
  Flame,
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  Play,
  RotateCcw,
  Plus,
  Sparkles,
  Sun,
  Sunset,
  Moon,
  Check,
  Award,
  ChevronRight,
  Info
} from 'lucide-react';
import { DailyTask } from '../types';

export const DailyPlanPage: React.FC = () => {
  const {
    streakDays,
    dailyTasks,
    toggleDailyTask,
    completeDailyTask,
    addDailyTask,
    resetDailyPlan,
    currentTime,
    setCurrentPage
  } = useAuth();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Motor Speech');
  const [newTaskDuration, setNewTaskDuration] = useState(5);
  const [newTaskTimeOfDay, setNewTaskTimeOfDay] = useState<'morning' | 'afternoon' | 'evening'>('afternoon');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [justCompletedId, setJustCompletedId] = useState<string | null>(null);

  // Time calculations
  const hours = currentTime.getHours();
  const currentPeriod: 'morning' | 'afternoon' | 'evening' =
    hours < 12 ? 'morning' : hours < 17 ? 'afternoon' : 'evening';

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Calculate completion stats
  const completedCount = dailyTasks.filter((t) => t.completed).length;
  const totalCount = dailyTasks.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isAllCompleted = totalCount > 0 && completedCount === totalCount;

  // Real-time 7-day week calendar generation
  const todayDayIndex = currentTime.getDay(); // 0 = Sunday, 1 = Monday...
  const daysOfWeek = [
    { label: 'Mon', index: 1 },
    { label: 'Tue', index: 2 },
    { label: 'Wed', index: 3 },
    { label: 'Thu', index: 4 },
    { label: 'Fri', index: 5 },
    { label: 'Sat', index: 6 },
    { label: 'Sun', index: 0 }
  ];

  const handleToggle = (taskId: string) => {
    const target = dailyTasks.find((t) => t.id === taskId);
    if (target && !target.completed) {
      setJustCompletedId(taskId);
      setTimeout(() => setJustCompletedId(null), 1800);
    }
    toggleDailyTask(taskId);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addDailyTask({
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      durationMinutes: Number(newTaskDuration) || 5,
      timeOfDay: newTaskTimeOfDay,
      description: newTaskDescription.trim() || 'Targeted patient practice routine.'
    });

    setNewTaskTitle('');
    setNewTaskDescription('');
    setShowAddModal(false);
  };

  const navigateToPractice = (task: DailyTask) => {
    if (task.targetRoute) {
      setCurrentPage(task.targetRoute);
    } else {
      setCurrentPage('speech_practice');
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-16">
      {/* 1. Real-time Live Clinic Header */}
      <section
        id="daily-plan-header"
        className="rounded-2xl border border-stone-200/80 bg-white p-6 sm:p-8 dark:border-stone-800 dark:bg-stone-900/90 shadow-xs"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 text-xs font-semibold border border-stone-200 dark:border-stone-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Live Protocol Active • {formattedTime}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
              Daily Speech Protocol
            </h1>

            <p className="text-sm text-stone-600 dark:text-stone-400">
              {formattedDate} • Prescribed by Dr. Marcus Vance, CCC-SLP
            </p>
          </div>

          {/* Live Streak & Quick Stats Widget */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900 dark:bg-amber-950/40 dark:border-amber-800/80 dark:text-amber-200">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5 fill-amber-500 text-amber-600" />
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Current Streak
                </div>
                <div className="text-lg font-bold text-amber-950 dark:text-amber-100">
                  {streakDays} Days Consistent
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Progress Bar */}
        <div className="mt-6 pt-6 border-t border-stone-100 dark:border-stone-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-stone-700 dark:text-stone-300">
              Today's Rehabilitation Adherence
            </span>
            <span className="text-teal-700 dark:text-teal-400 font-bold">
              {completedCount} of {totalCount} drills completed ({completionPercentage}%)
            </span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
            <div
              className="h-full bg-teal-600 dark:bg-teal-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          {isAllCompleted && (
            <div className="pt-2 flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200/70 dark:border-emerald-900/60">
              <Award className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Excellent work!</strong> You have completed all scheduled motor-speech drills for today. Your practice streak is securely updated.
              </span>
            </div>
          )}
        </div>
      </section>

      {/* 2. Real-Time 7-Day Week Calendar */}
      <section
        id="weekly-calendar-overview"
        className="rounded-2xl border border-stone-200/80 bg-white p-6 dark:border-stone-800 dark:bg-stone-900/90 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Weekly Practice Rhythm
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Consistent daily 5-minute sessions reinforce motor-speech pathways.
            </p>
          </div>
          <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
            Current Day: {formattedDate.split(',')[0]}
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-3 text-center">
          {daysOfWeek.map((day) => {
            const isToday = day.index === todayDayIndex;
            const isPast = day.index < todayDayIndex && day.index !== 0;
            const isCompleted = isToday ? completedCount > 0 : isPast;

            return (
              <div
                key={day.label}
                className={`p-3 rounded-xl border transition-all ${
                  isToday
                    ? 'border-teal-600 bg-teal-50/70 dark:bg-teal-950/40 dark:border-teal-500 ring-2 ring-teal-600/20'
                    : isCompleted
                    ? 'border-stone-200 bg-stone-50/70 dark:border-stone-800 dark:bg-stone-800/40'
                    : 'border-stone-200/60 bg-white dark:border-stone-800 dark:bg-stone-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold ${
                      isToday
                        ? 'text-teal-800 dark:text-teal-300'
                        : 'text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    {day.label}
                  </span>
                  {isToday && (
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-teal-600 text-white">
                      Today
                    </span>
                  )}
                </div>

                <div className="mt-2.5 flex justify-center">
                  {isCompleted ? (
                    <div className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-stone-300 dark:border-stone-700" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Real-Time Scheduled Tasks List */}
      <section
        id="scheduled-tasks-container"
        className="rounded-2xl border border-stone-200/80 bg-white p-6 dark:border-stone-800 dark:bg-stone-900/90 shadow-xs space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4 dark:border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Today's Prescribed Protocol
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                {dailyTasks.length} Active Targets
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Click checkboxes to record completions in real time. Drills synchronize across your dashboard and streak.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Drill
            </button>

            <button
              onClick={resetDailyPlan}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-500 hover:text-stone-700 text-xs font-semibold dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800 transition-colors"
              title="Reset today's checkmarks"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>

        {/* Tasks Stack */}
        <div className="space-y-3">
          {dailyTasks.map((task) => {
            const isPeriodCurrent = task.timeOfDay === currentPeriod;

            return (
              <div
                key={task.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all ${
                  task.completed
                    ? 'border-stone-200/80 bg-stone-50/50 dark:border-stone-800 dark:bg-stone-800/30 opacity-90'
                    : isPeriodCurrent
                    ? 'border-teal-300 bg-teal-50/30 dark:border-teal-800 dark:bg-teal-950/20 shadow-xs'
                    : 'border-stone-200/80 bg-white dark:border-stone-800 dark:bg-stone-900 hover:border-stone-300'
                }`}
              >
                {/* Left: Checkbox & Task Meta */}
                <div className="flex items-start gap-3.5">
                  <button
                    onClick={() => handleToggle(task.id)}
                    className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                      task.completed
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'border-2 border-stone-300 dark:border-stone-600 hover:border-teal-500 bg-white dark:bg-stone-800'
                    }`}
                    aria-label={`Mark ${task.title} as ${task.completed ? 'uncompleted' : 'completed'}`}
                  >
                    {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/80 px-2 py-0.5 rounded border border-teal-200/60 dark:border-teal-800">
                        {task.category}
                      </span>

                      <span className="inline-flex items-center gap-1 text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                        <Clock className="w-3 h-3 text-stone-400" />
                        {task.durationMinutes} min
                      </span>

                      {isPeriodCurrent && !task.completed && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.2 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300/60">
                          Recommended Now
                        </span>
                      )}

                      {task.completed && task.completedAt && (
                        <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                          Completed at {task.completedAt}
                        </span>
                      )}
                    </div>

                    <h3
                      className={`text-sm font-bold transition-all ${
                        task.completed
                          ? 'text-stone-500 dark:text-stone-400 line-through'
                          : 'text-stone-900 dark:text-stone-100'
                      }`}
                    >
                      {task.title}
                    </h3>

                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed max-w-xl">
                      {task.description}
                    </p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="mt-3 sm:mt-0 flex items-center gap-2 self-end sm:self-center pl-9 sm:pl-0 shrink-0">
                  {!task.completed ? (
                    <button
                      onClick={() => navigateToPractice(task)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      Start Drill
                    </button>
                  ) : (
                    <button
                      onClick={() => handleToggle(task.id)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                    >
                      Undo
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Clinical Evidence & Protocol Notes */}
      <section
        id="clinical-evidence-notes"
        className="rounded-2xl border border-stone-200/80 bg-stone-50/60 p-6 dark:border-stone-800 dark:bg-stone-900/40 text-xs text-stone-600 dark:text-stone-400 space-y-2"
      >
        <div className="flex items-center gap-2 font-bold text-stone-800 dark:text-stone-200">
          <Info className="w-4 h-4 text-teal-600" />
          Clinical Protocol Guidance
        </div>
        <p className="leading-relaxed">
          Daily practice plans follow the <strong>Camperdown Program</strong> and{' '}
          <strong>Van Riper Fluency Shaping</strong> principles. The goal is not "effortful
          fluency", but effortless continuous phonation and reduced vocal fold adduction tension.
          If you experience articulatory fatigue, pause for 2 minutes and execute 4 cycles of
          diaphragmatic breathing before resuming.
        </p>
      </section>

      {/* Add Custom Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-stone-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-xl dark:border-stone-800 dark:bg-stone-900 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 dark:border-stone-800">
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Add Custom Practice Drill
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Drill Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Ordering Food with Easy Onset"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs text-stone-900 dark:text-stone-100"
                  >
                    <option value="Motor Speech">Motor Speech</option>
                    <option value="Respiratory">Respiratory</option>
                    <option value="Acoustic ML">Acoustic ML</option>
                    <option value="Real-Life Simulation">Real-Life Simulation</option>
                    <option value="Cognitive Behavioral">Cognitive Behavioral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={newTaskDuration}
                    onChange={(e) => setNewTaskDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Time of Day
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['morning', 'afternoon', 'evening'] as const).map((period) => (
                    <button
                      key={period}
                      type="button"
                      onClick={() => setNewTaskTimeOfDay(period)}
                      className={`py-1.5 rounded-lg border text-xs font-semibold capitalize transition-colors ${
                        newTaskTimeOfDay === period
                          ? 'border-teal-600 bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                          : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Clinical Focus / Description
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g., Focus on soft vocal starts when saying plosives."
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold"
                >
                  Save to Today's Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

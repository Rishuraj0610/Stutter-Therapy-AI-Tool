import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Mic,
  MessageSquareHeart,
  Stethoscope,
  TrendingUp,
  Dumbbell,
  CalendarCheck,
  ArrowRight,
  Flame,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Check,
  Play,
  HeartHandshake,
  Calendar,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, setCurrentPage, streakDays, dailyTasks, toggleDailyTask, currentTime } = useAuth();

  const quickServices = [
    {
      id: 'speech_practice',
      title: 'Practice Speaking',
      description: 'Interactive voice-guided exercises for gentle onset, breath support, and rhythm.',
      icon: Mic,
      tag: 'Daily Core',
      color: 'teal'
    },
    {
      id: 'ai_counselling',
      title: 'Talk to AI Counsellor',
      description: 'CBT-informed conversational guidance for speaking anxiety, phone calls, and confidence.',
      icon: MessageSquareHeart,
      tag: 'Compassionate Care',
      color: 'sky'
    },
    {
      id: 'doctors',
      title: 'Consult a Speech Therapist',
      description: 'Connect with certified Speech-Language Pathologists (CCC-SLP) for personalized care.',
      icon: Stethoscope,
      tag: 'Licensed SLPs',
      color: 'emerald'
    },
    {
      id: 'exercises',
      title: 'Exercise Library',
      description: 'Explore motor-speech drills, syllable pacing, and diaphragmatic breath workouts.',
      icon: Dumbbell,
      tag: 'Clinical Drills',
      color: 'indigo'
    },
    {
      id: 'progress',
      title: 'Speech Progress & Trends',
      description: 'Track acoustic stability, pacing control, and your weekly fluency milestones.',
      icon: TrendingUp,
      tag: 'Analytics',
      color: 'teal'
    }
  ];

  const todaysRecommendedExercises = [
    {
      title: 'Diaphragmatic Breath Mastery',
      duration: '2 min',
      focus: 'Vocal tract ease',
      description: '4-second inhale, 2-second hold, steady exhale to release tension before speaking.'
    },
    {
      title: 'Gentle Phonatory Onset',
      duration: '3 min',
      focus: 'Soft glottal attack',
      description: 'Gradual vocal cord closure on initial vowels and plosive sounds (/b/, /p/, /t/).'
    },
    {
      title: 'Continuous Speech Flow',
      duration: '5 min',
      focus: 'Rhythmic coordination',
      description: 'Read natural passages maintaining continuous vocal fold vibration between words.'
    }
  ];

  const libraryHighlights = [
    {
      title: 'Diaphragmatic Breathing',
      time: '2 min',
      level: 'Beginner',
      purpose: 'Reduces vocal tension and stabilizes breath rhythm.'
    },
    {
      title: 'Gentle Onset Practice',
      time: '3 min',
      level: 'Beginner',
      purpose: 'Eases into speech sounds without harsh vocal cord contact.'
    },
    {
      title: 'Pacing & Rate Control',
      time: '5 min',
      level: 'Intermediate',
      purpose: 'Targeted syllable rhythm using Camperdown protocol pacing.'
    },
    {
      title: 'Reading Aloud & Phonation',
      time: '4 min',
      level: 'All levels',
      purpose: 'Builds muscle memory across realistic sentence structures.'
    },
    {
      title: 'Real-World Conversation',
      time: '5 min',
      level: 'Advanced',
      purpose: 'Practice ordering, phone conversations, and introductions.'
    }
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      {/* 1. Warm Patient Greeting Hero */}
      <section
        id="dashboard-hero"
        aria-label="Welcome Overview"
        className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-xs"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-md bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800 dark:bg-teal-950/70 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800">
              <Sparkles className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
              Evidence-Informed Speech Care
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Welcome back, {user?.fullName || 'Alex'} 👋
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Ready for today's speaking practice? Your speech fluency baseline is steady at{' '}
              <strong className="text-teal-700 dark:text-teal-400 font-semibold">84.5%</strong>. Taking just 5 minutes today helps maintain your muscle memory and vocal comfort.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setCurrentPage('speech_practice')}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold shadow-xs transition-colors"
              >
                <Play className="w-4 h-4 fill-white" />
                Start Today's Practice
              </button>

              <button
                onClick={() => setCurrentPage('daily_plan')}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              >
                <Calendar className="w-4 h-4 text-slate-500" />
                View My Plan
              </button>
            </div>
          </div>

          {/* Quick Streak Card */}
          <div className="flex items-center gap-4 p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800/60 dark:border-slate-700 self-start lg:self-center">
            <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Flame className="w-6 h-6 fill-amber-500 text-amber-600" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                Weekly Practice Streak
              </span>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {streakDays || 5} Days Consistent
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium mt-0.5">
                On track for weekly goal
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Today's Guided Practice Section */}
      <section
        id="todays-practice"
        aria-label="Today's Practice"
        className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Today's Practice Plan
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-50 text-teal-700 border border-teal-200/60 dark:bg-teal-950/60 dark:text-teal-300">
                {dailyTasks.filter((t) => t.completed).length} / {dailyTasks.length} Completed
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Live scheduled motor-speech drills. Check off completed exercises or start a live session directly.
            </p>
          </div>

          <button
            onClick={() => setCurrentPage('daily_plan')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 dark:text-teal-400 hover:text-teal-800 transition-colors"
          >
            Open Full Daily Plan <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {dailyTasks.map((task) => (
            <div
              key={task.id}
              className={`flex flex-col justify-between p-4 rounded-xl border transition-all ${
                task.completed
                  ? 'border-emerald-200/80 bg-emerald-50/40 dark:border-emerald-900/60 dark:bg-emerald-950/20'
                  : 'border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-teal-300 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800/90'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                    {task.timeOfDay}
                  </span>
                  <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {task.durationMinutes}m
                  </span>
                </div>

                <h3
                  className={`font-bold text-xs transition-colors ${
                    task.completed
                      ? 'text-stone-500 dark:text-stone-400 line-through'
                      : 'text-slate-900 dark:text-slate-100'
                  }`}
                >
                  {task.title}
                </h3>

                <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {task.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                <button
                  onClick={() => toggleDailyTask(task.id)}
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md transition-colors ${
                    task.completed
                      ? 'text-emerald-700 bg-emerald-100/80 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'text-slate-600 hover:text-teal-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                  }`}
                >
                  {task.completed ? (
                    <>
                      <Check className="w-3 h-3 stroke-[3]" /> Done
                    </>
                  ) : (
                    <>Mark Done</>
                  )}
                </button>

                <button
                  onClick={() => setCurrentPage(task.targetRoute || 'speech_practice')}
                  className="p-1 rounded-md bg-teal-50 text-teal-700 hover:bg-teal-700 hover:text-white dark:bg-teal-950 dark:text-teal-300 dark:hover:bg-teal-700 transition-colors"
                  title="Launch drill"
                >
                  <Play className="w-3 h-3 fill-current" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Healthcare Services Quick Navigation */}
      <section id="healthcare-services" aria-label="Healthcare Services" className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Healthcare Services & Support
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select a service to begin practicing, consult with a clinician, or review your milestones.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickServices.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                onClick={() => setCurrentPage(service.id)}
                className="cursor-pointer rounded-xl border border-slate-200 bg-white p-5 hover:border-teal-400 hover:shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      {service.tag}
                    </span>
                  </div>

                  <h3 className="mt-4 font-bold text-sm text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                    {service.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-teal-700 dark:text-teal-400 group-hover:translate-x-0.5 transition-transform">
                  <span>Open Service</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. AI Counsellor Warm Entry Point & Speech Clinician in 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supportive AI Counsellor Entry */}
        <section
          id="counsellor-entry"
          aria-label="AI Speech Counsellor"
          className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                  <MessageSquareHeart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Need Someone to Talk To?
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Empathetic AI Speech Companion
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                Always Available
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Your AI speech counsellor is here to help you prepare for upcoming speaking situations, manage situational anxiety, and practice reframing tension before meetings or phone calls.
            </p>

            {/* Situation tags */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-[11px] px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700">
                Upcoming Phone Call
              </span>
              <span className="text-[11px] px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700">
                Pre-Meeting Nervousness
              </span>
              <span className="text-[11px] px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700">
                Gentle Start Reframing
              </span>
            </div>
          </div>

          <button
            onClick={() => setCurrentPage('ai_counselling')}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <MessageSquareHeart className="w-4 h-4" />
            Talk to AI Counsellor
          </button>
        </section>

        {/* Your Speech Therapist */}
        <section
          id="assigned-therapist"
          aria-label="Speech Clinician"
          className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Your Speech Clinician
              </h3>
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Telehealth Active
              </span>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=80"
                alt="Dr. Marcus Vance"
                className="h-12 w-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
              />
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Dr. Marcus Vance, Ph.D., CCC-SLP
                </h4>
                <p className="text-xs text-teal-700 dark:text-teal-400 font-medium">
                  Board-Certified Specialist in Fluency (BCS-F)
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Next Appointment: <strong className="text-slate-700 dark:text-slate-300">Tuesday, 10:30 AM</strong>
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-teal-50/50 border border-teal-100 dark:bg-teal-950/30 dark:border-teal-900/40 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong className="text-teal-800 dark:text-teal-300 block mb-1">Clinician Note:</strong>
              "Alex, your initial plosive consonants smoothed out nicely during our last evaluation. Keep up the morning gentle onset drills."
            </div>
          </div>

          <div className="flex items-center gap-2.5 pt-1">
            <button
              onClick={() => setCurrentPage('doctors')}
              className="flex-1 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold transition-colors"
            >
              Manage Appointment
            </button>
            <button
              onClick={() => setCurrentPage('doctors')}
              className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 text-xs font-medium transition-colors"
            >
              View Profile
            </button>
          </div>
        </section>
      </div>

      {/* 5. Patient-Friendly Progress Overview */}
      <section
        id="speech-progress"
        aria-label="Speech Progress Overview"
        className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Speech Fluency & Consistency
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Clear, patient-friendly progress tracked during your guided speech sessions.
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('progress')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 dark:text-teal-400 hover:text-teal-800 transition-colors"
          >
            View Detailed Progress <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800/50 dark:border-slate-700/80">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Speech Fluency Score
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">84.5%</span>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                +3.2% this week
              </span>
            </div>
            <div className="mt-3 w-full bg-slate-200 rounded-full h-1.5 dark:bg-slate-700">
              <div className="bg-teal-700 h-1.5 rounded-full" style={{ width: '84.5%' }} />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800/50 dark:border-slate-700/80">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Weekly Practice Goal
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">5 / 7 Days</span>
              <span className="text-xs font-semibold text-teal-700 dark:text-teal-400">
                71% Completed
              </span>
            </div>
            <div className="mt-3 w-full bg-slate-200 rounded-full h-1.5 dark:bg-slate-700">
              <div className="bg-teal-700 h-1.5 rounded-full" style={{ width: '71%' }} />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800/50 dark:border-slate-700/80">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Speaking Rate Control
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">138 WPM</span>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Optimal Target
              </span>
            </div>
            <div className="mt-3 w-full bg-slate-200 rounded-full h-1.5 dark:bg-slate-700">
              <div className="bg-teal-700 h-1.5 rounded-full" style={{ width: '88%' }} />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Exercise Library Highlights */}
      <section
        id="exercise-library-highlights"
        aria-label="Recommended Exercises"
        className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Recommended for You
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Targeted exercises based on your recent fluency sessions and clinician recommendations.
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('exercises')}
            className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:text-teal-800 transition-colors"
          >
            Explore All Exercises
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {libraryHighlights.map((drill, idx) => (
            <div
              key={idx}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 px-2 rounded-lg transition-colors"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {drill.title}
                  </h3>
                  <span className="text-[11px] font-semibold px-2 py-0.2 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    {drill.level}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {drill.purpose}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-slate-500 font-mono">
                  {drill.time}
                </span>
                <button
                  onClick={() => setCurrentPage('exercises')}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-teal-50 hover:border-teal-300 hover:text-teal-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-teal-950 transition-colors"
                >
                  Start Drill
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Healthcare Trust, Privacy & Safety Banner */}
      <section
        id="privacy-trust"
        aria-label="Clinical Trust & Privacy"
        className="rounded-2xl border border-slate-200/80 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-teal-100/70 text-teal-800 dark:bg-teal-950 dark:text-teal-300 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                Confidential & Secure
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Your speech audio is processed locally or in encrypted healthcare pipelines. We never sell or share patient voice recordings.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-teal-100/70 text-teal-800 dark:bg-teal-950 dark:text-teal-300 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                Evidence-Based Science
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Exercises are grounded in established stuttering modification (Van Riper) and fluency shaping protocols (Camperdown Program).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-teal-100/70 text-teal-800 dark:bg-teal-950 dark:text-teal-300 shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                SLP Supervised
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Designed to complement your real-world speech therapy, allowing you to share objective progress notes with your clinician.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

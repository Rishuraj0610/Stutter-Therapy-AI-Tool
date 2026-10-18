import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Activity,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Flame,
  CheckCircle2,
  Clock,
  Sliders,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  TrendingUp,
  Award,
  Zap,
  Target,
  Plus,
  Trash2,
  Check,
  Headphones,
  Compass,
  ArrowUpRight
} from 'lucide-react';

type ToolTab = 'metronome' | 'choral' | 'ladder' | 'desensitization' | 'fear_words' | 'classic_drills';

export const ExercisesPage: React.FC = () => {
  const { setCurrentPage, recordPracticeSessionCompleted } = useAuth();
  const [activeTab, setActiveTab] = useState<ToolTab>('metronome');

  // ================= METRONOME & SYLLABLE-TIMED SPEECH (STS) =================
  const [metronomeBpm, setMetronomeBpm] = useState<number>(80);
  const [isMetronomePlaying, setIsMetronomePlaying] = useState<boolean>(false);
  const [metronomeBeat, setMetronomeBeat] = useState<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const metronomeTimerRef = useRef<any>(null);
  const [stsSyllableIndex, setStsSyllableIndex] = useState<number>(0);

  const stsPassageSyllables = [
    'One', 'step', 'at', 'a', 'time', 'brings', 'stea', 'dy', 'ca', 'dence.',
    'Clear', 'air', 'flows', 'gently', 'through', 'the', 'lungs.',
    'Eve', 'ry', 'sy', 'lla', 'ble', 'has', 'its', 'own', 'space', 'to', 'breathe.'
  ];

  const playClickSound = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // AudioContext not available
    }
  };

  useEffect(() => {
    if (isMetronomePlaying) {
      const intervalMs = (60 / metronomeBpm) * 1000;
      metronomeTimerRef.current = setInterval(() => {
        playClickSound();
        setMetronomeBeat((b) => (b + 1) % 4);
        setStsSyllableIndex((prev) => (prev + 1) % stsPassageSyllables.length);
      }, intervalMs);
    } else {
      if (metronomeTimerRef.current) clearInterval(metronomeTimerRef.current);
      setMetronomeBeat(0);
    }
    return () => {
      if (metronomeTimerRef.current) clearInterval(metronomeTimerRef.current);
    };
  }, [isMetronomePlaying, metronomeBpm]);

  // ================= CHORAL / SHADOW-SPEAKING MODE =================
  const [isChoralPlaying, setIsChoralPlaying] = useState<boolean>(false);
  const [choralSpeed, setChoralSpeed] = useState<number>(0.9);
  const [choralActiveWordIdx, setChoralActiveWordIdx] = useState<number>(0);
  const choralPassage = `When the sunlight strikes raindrops in the air, they act as a prism and form a rainbow. The division of white light creates a luminous arc with calm and effortless airflow.`;
  const choralWords = choralPassage.split(/\s+/);
  const choralUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const startChoralSpeaking = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(choralPassage);
    utterance.rate = choralSpeed;
    utterance.pitch = 1.0;

    let wordIdx = 0;
    utterance.onboundary = (e) => {
      if (e.name === 'word') {
        setChoralActiveWordIdx(wordIdx % choralWords.length);
        wordIdx++;
      }
    };

    utterance.onend = () => {
      setIsChoralPlaying(false);
      setChoralActiveWordIdx(0);
      recordPracticeSessionCompleted('Choral Shadow Speaking');
    };

    utterance.onerror = () => {
      setIsChoralPlaying(false);
    };

    choralUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsChoralPlaying(true);
  };

  const stopChoralSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsChoralPlaying(false);
    setChoralActiveWordIdx(0);
  };

  // ================= SPEAKING SITUATION LADDER (AVOIDANCE HIERARCHY) =================
  interface LadderStep {
    id: string;
    level: number;
    scenario: string;
    description: string;
    samplePrompt: string;
    preConfidence: number;
    postConfidence: number;
    completed: boolean;
  }

  const [ladderSteps, setLadderSteps] = useState<LadderStep[]>([
    {
      id: 'step-1',
      level: 1,
      scenario: 'Ordering Coffee at a Cafe',
      description: 'Order your favorite drink with specific milk and size modifications without pointing.',
      samplePrompt: '"Hi, could I please get a medium oat milk latte with one pump of vanilla syrup?"',
      preConfidence: 6,
      postConfidence: 8,
      completed: true
    },
    {
      id: 'step-2',
      level: 2,
      scenario: 'Calling a Local Pharmacy',
      description: 'Call a local clinic or pharmacy to ask their store opening hours.',
      samplePrompt: '"Hello, I was calling to check if your prescription counter is open until 7 PM today?"',
      preConfidence: 5,
      postConfidence: 7,
      completed: true
    },
    {
      id: 'step-3',
      level: 3,
      scenario: 'Introducing Yourself at Dinner',
      description: 'State your full name, what you do, and ask a question to a new acquaintance.',
      samplePrompt: '"Hi, my name is Alex. I work in software design. How long have you lived in the city?"',
      preConfidence: 4,
      postConfidence: 6,
      completed: false
    },
    {
      id: 'step-4',
      level: 4,
      scenario: 'Asking a Question in a Team Meeting',
      description: 'Unmute on a video conference or raise your hand in class to ask a clarifying question.',
      samplePrompt: '"Excuse me, could you clarify the delivery timeline for phase two of the project?"',
      preConfidence: 3,
      postConfidence: 0,
      completed: false
    },
    {
      id: 'step-5',
      level: 5,
      scenario: 'Job or College Viva Interview',
      description: 'Answer "Tell me about a challenging project you solved recently" with slow, easy onset.',
      samplePrompt: '"One project where I led motor coordination required synchronizing audio timing across distributed nodes..."',
      preConfidence: 2,
      postConfidence: 0,
      completed: false
    },
    {
      id: 'step-6',
      level: 6,
      scenario: 'Keynote Presentation / Public Speech',
      description: 'Deliver a 3-minute technical overview to an audience of 20+ listeners with voluntary disclosure.',
      samplePrompt: '"Good morning everyone. Before we dive into the data, I occasionally stutter, so thank you in advance for your patience..."',
      preConfidence: 2,
      postConfidence: 0,
      completed: false
    }
  ]);

  const [activeLadderStep, setActiveLadderStep] = useState<LadderStep>(ladderSteps[2]);

  const handleUpdateLadderConfidence = (stepId: string, type: 'pre' | 'post', val: number) => {
    setLadderSteps((prev) =>
      prev.map((s) => (s.id === stepId ? { ...s, [type === 'pre' ? 'preConfidence' : 'postConfidence']: val } : s))
    );
    if (activeLadderStep.id === stepId) {
      setActiveLadderStep((prev) => ({
        ...prev,
        [type === 'pre' ? 'preConfidence' : 'postConfidence']: val
      }));
    }
  };

  const handleToggleLadderComplete = (stepId: string) => {
    setLadderSteps((prev) =>
      prev.map((s) => (s.id === stepId ? { ...s, completed: !s.completed } : s))
    );
    recordPracticeSessionCompleted(`Situation Ladder: ${activeLadderStep.scenario}`);
  };

  // ================= VOLUNTARY STUTTERING & DESENSITIZATION =================
  const [desensitizationCount, setDesensitizationCount] = useState<number>(14);
  const [selectedVoluntaryType, setSelectedVoluntaryType] = useState<'bouncing' | 'slide' | 'freezing'>('bouncing');

  const voluntaryDrills = {
    bouncing: {
      name: 'Voluntary Bouncing (Easy Repetitions)',
      aim: 'Deliberately repeat the initial sound 2-3 times without tension (e.g. "b-b-book", "t-t-table").',
      why: 'Eliminates fear by proving that repeating sounds is harmless and under your voluntary motor control.',
      practicePhrase: 'B-b-breakfast was p-p-prepared with c-c-care.'
    },
    slide: {
      name: 'Slide Prolongation',
      aim: 'Smoothly slide into the vowel with prolonged voicing (e.g. "ssss-un", "ffff-light").',
      why: 'Teaches vocal folds to stay open and vibrating smoothly without clenching in a tight block.',
      practicePhrase: 'Sssss-ummer sunlight fffff-ills the rrrr-oom.'
    },
    freezing: {
      name: 'Deliberate Freezing & Melting',
      aim: 'Hold a tight block posture for 3 seconds voluntarily, then consciously soften facial tension.',
      why: 'Demystifies the physical sensation of a block and develops conscious tension release mastery.',
      practicePhrase: 'T---tension melts into an easy start.'
    }
  };

  // ================= FEAR-WORD & TRIGGER-SOUND TRACKER =================
  const [fearWords, setFearWords] = useState<string[]>([
    'Alexander',
    'Presentation',
    'Pharmacy',
    'Schedule',
    'Algorithm'
  ]);
  const [newFearWord, setNewFearWord] = useState<string>('');
  const [generatedFearDrill, setGeneratedFearDrill] = useState<string | null>(null);

  const handleAddFearWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFearWord.trim()) return;
    setFearWords((prev) => [...prev, newFearWord.trim()]);
    setNewFearWord('');
  };

  const handleRemoveFearWord = (word: string) => {
    setFearWords((prev) => prev.filter((w) => w !== word));
  };

  const generateDrillForFearWords = () => {
    if (fearWords.length === 0) return;
    const wordsList = fearWords.slice(0, 4).join(', ');
    const drill = `Take a slow, grounding abdominal breath. Begin each target word with an Easy Start:

1. [Gentle Bilabial Phonation]: "Yesterday, my colleague **${fearWords[0] || 'Peter'}** arranged a relaxed discussion."
2. [Continuous Airflow Linking]: "We carefully reviewed the **${fearWords[1] || 'schedule'}** before attending the **${fearWords[2] || 'presentation'}**."
3. [Light Articulatory Contact]: "Every syllable in **${fearWords[3] || 'algorithm'}** flows with steady diaphragmatic breath support."

*Clinical Focus: Release 10% of your air before starting sound on each target word.*`;
    setGeneratedFearDrill(drill);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-16">
      {/* Header Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
              <Zap className="w-3.5 h-3.5 text-teal-600" />
              Advanced Fluency Laboratory • Evidence-Based Motor Conditioning
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Clinical Fluency Tools & Drills
            </h1>
            <p className="max-w-2xl text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Specialized neuromuscular interventions including syllable-timed pacing, choral shadowing, voluntary stuttering desensitization, trigger word tracking, and avoidance hierarchies.
            </p>
          </div>

          <button
            onClick={() => setCurrentPage('speech_practice')}
            className="inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-5 py-3 text-xs font-bold text-white shadow-xs hover:bg-teal-700 transition-all self-start sm:self-auto shrink-0"
          >
            <Play className="w-4 h-4" />
            Launch Speech Prompter
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('metronome')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
            activeTab === 'metronome'
              ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Pacing Metronome & STS</span>
        </button>

        <button
          onClick={() => setActiveTab('choral')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
            activeTab === 'choral'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span>Choral & Shadow Speaking</span>
        </button>

        <button
          onClick={() => setActiveTab('ladder')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
            activeTab === 'ladder'
              ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Speaking Situation Ladder</span>
        </button>

        <button
          onClick={() => setActiveTab('desensitization')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
            activeTab === 'desensitization'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Voluntary Stuttering</span>
        </button>

        <button
          onClick={() => setActiveTab('fear_words')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
            activeTab === 'fear_words'
              ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Fear Words & Triggers</span>
        </button>
      </div>

      {/* ================= TAB 1: METRONOME & SYLLABLE-TIMED SPEECH ================= */}
      {activeTab === 'metronome' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Syllable-Timed Speech (STS) Pacer
                </h3>
                <p className="text-xs text-slate-500">
                  Read synchronously with each rhythmic pulse. Syllable-timed speech establishes a steady neural oscillator in the motor cortex.
                </p>
              </div>

              <button
                onClick={() => setIsMetronomePlaying(!isMetronomePlaying)}
                className={`px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-xs transition-all ${
                  isMetronomePlaying
                    ? 'bg-rose-600 text-white hover:bg-rose-700'
                    : 'bg-teal-600 text-white hover:bg-teal-700'
                }`}
              >
                {isMetronomePlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isMetronomePlaying ? 'Stop Metronome' : 'Start Pulse'}</span>
              </button>
            </div>

            {/* Visual Beat Indicator */}
            <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-4">
              <div className="relative flex items-center justify-center w-28 h-28">
                <div
                  className={`absolute inset-0 rounded-full transition-all duration-100 ${
                    isMetronomePlaying && metronomeBeat === 0
                      ? 'bg-teal-500/40 scale-125'
                      : isMetronomePlaying
                      ? 'bg-teal-500/20 scale-110'
                      : 'bg-slate-200 dark:bg-slate-700 scale-100'
                  }`}
                />
                <div
                  className={`w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-lg font-mono font-bold text-lg text-white transition-all ${
                    isMetronomePlaying
                      ? metronomeBeat === 0
                        ? 'bg-teal-500 scale-105'
                        : 'bg-teal-600 scale-100'
                      : 'bg-slate-400 dark:bg-slate-600'
                  }`}
                >
                  <span>{metronomeBpm}</span>
                  <span className="text-[10px] uppercase font-sans tracking-widest text-teal-100">BPM</span>
                </div>
              </div>

              {/* 4 Beat Dots */}
              <div className="flex items-center gap-3">
                {[0, 1, 2, 3].map((b) => (
                  <div
                    key={b}
                    className={`w-3.5 h-3.5 rounded-full transition-all ${
                      isMetronomePlaying && metronomeBeat === b
                        ? 'bg-teal-500 scale-125 shadow-xs'
                        : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Syllable-timed reading prompter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Rhythm Syllable Prompter:
                </span>
                <span className="text-slate-400">Match 1 syllable per click</span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-800/80 shadow-2xs leading-loose flex flex-wrap gap-2 text-base font-medium">
                {stsPassageSyllables.map((syl, i) => {
                  const isCurrent = isMetronomePlaying && i === stsSyllableIndex;
                  return (
                    <span
                      key={i}
                      className={`px-2 py-0.5 rounded-lg transition-all ${
                        isCurrent
                          ? 'bg-teal-600 text-white font-bold scale-110 shadow-xs'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {syl}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Controls & Clinical Source */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-4">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-teal-600" />
                Tempo Pacing Controls
              </h4>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500">Pacing Speed:</span>
                  <span className="text-teal-600 font-bold font-mono">{metronomeBpm} Beats / Min</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="140"
                  step="5"
                  value={metronomeBpm}
                  onChange={(e) => setMetronomeBpm(Number(e.target.value))}
                  className="w-full accent-teal-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>50 (Slow Training)</span>
                  <span>80 (Clinical STS)</span>
                  <span>140 (Conversational)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-bold uppercase text-slate-400">Tempo Presets:</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setMetronomeBpm(60)}
                    className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-slate-700"
                  >
                    60 BPM
                  </button>
                  <button
                    onClick={() => setMetronomeBpm(80)}
                    className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-xs font-bold text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800"
                  >
                    80 BPM
                  </button>
                  <button
                    onClick={() => setMetronomeBpm(110)}
                    className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-slate-700"
                  >
                    110 BPM
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-teal-200/80 bg-teal-50/50 p-5 dark:border-teal-900 dark:bg-teal-950/30 space-y-2 text-xs">
              <span className="font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                Clinical Background: Syllable-Timed Speech
              </span>
              <p className="text-teal-800 dark:text-teal-300/90 leading-relaxed">
                Documented in SLP literature (Packman et al., 2007; The Westmead Program), speaking one syllable to each beat of a rhythmic stimulus provides an external timing pacing cue that bypasses basal ganglia timing deficits.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: CHORAL & SHADOW SPEAKING ================= */}
      {activeTab === 'choral' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Choral & Shadow-Speaking Studio
                </h3>
                <p className="text-xs text-slate-500">
                  Read in exact unison with the audio guide. The "Choral Effect" immediately stabilizes vocal cord vibratory timing.
                </p>
              </div>

              <button
                onClick={isChoralPlaying ? stopChoralSpeaking : startChoralSpeaking}
                className={`px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-xs transition-all ${
                  isChoralPlaying
                    ? 'bg-rose-600 text-white hover:bg-rose-700'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {isChoralPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isChoralPlaying ? 'Pause Shadowing' : 'Speak Together'}</span>
              </button>
            </div>

            {/* Choral Prompter */}
            <div className="p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/80 space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                Shadowing Script (Read in Unison):
              </span>
              <p className="text-lg font-serif leading-loose text-slate-800 dark:text-slate-200">
                {choralWords.map((word, idx) => {
                  const isActive = isChoralPlaying && idx === choralActiveWordIdx;
                  return (
                    <span
                      key={idx}
                      className={`inline-block mr-2 px-1.5 py-0.5 rounded-lg transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white font-bold scale-110 shadow-xs'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {word}
                    </span>
                  );
                })}
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500">
              <Headphones className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Headphones recommended to clearly hear the model speech cadence while phonating.</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-4">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Audio Speed & Voice Controls
              </h4>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500">Model Voice Rate:</span>
                  <span className="text-indigo-600 font-bold font-mono">{choralSpeed}x</span>
                </div>
                <input
                  type="range"
                  min="0.7"
                  max="1.2"
                  step="0.05"
                  value={choralSpeed}
                  onChange={(e) => setChoralSpeed(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>0.7x (Very Slow)</span>
                  <span>0.9x (Recommended)</span>
                  <span>1.2x (Fast)</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-indigo-200/80 bg-indigo-50/50 p-5 dark:border-indigo-900 dark:bg-indigo-950/30 space-y-2 text-xs">
              <span className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                The Choral Speech Phenomenon
              </span>
              <p className="text-indigo-800 dark:text-indigo-300/90 leading-relaxed">
                When a person who stutters reads in unison with another speaker, stuttering frequency decreases by 80–95% (Ingham et al., 2012). This occurs because hearing another voice modifies the auditory feedback loop in the left superior temporal gyrus.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: SPEAKING SITUATION LADDER ================= */}
      {activeTab === 'ladder' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-6">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Speaking Situation Ladder (Avoidance Hierarchy)
              </h3>
              <p className="text-xs text-slate-500">
                Graded exposure: master everyday speaking challenges step-by-step from least stressful to most challenging.
              </p>
            </div>

            <div className="space-y-3">
              {ladderSteps.map((step) => {
                const isSelected = activeLadderStep.id === step.id;
                return (
                  <div
                    key={step.id}
                    onClick={() => setActiveLadderStep(step)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center text-xs shrink-0 ${
                          step.completed
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {step.completed ? <Check className="w-4 h-4" /> : `L${step.level}`}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {step.scenario}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-1">{step.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] uppercase text-slate-400 font-bold block">Confidence</span>
                        <span className="font-mono font-bold text-xs text-amber-600">
                          {step.preConfidence}/10 → {step.postConfidence ? `${step.postConfidence}/10` : '—'}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Ladder Step Practice Card */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold uppercase text-amber-600">
                  Level {activeLadderStep.level} Challenge
                </span>
                <button
                  onClick={() => handleToggleLadderComplete(activeLadderStep.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    activeLadderStep.completed
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-100 hover:text-emerald-800'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{activeLadderStep.completed ? 'Mastered' : 'Mark Done'}</span>
                </button>
              </div>

              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                {activeLadderStep.scenario}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {activeLadderStep.description}
              </p>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Rehearsal Prompt:</span>
                <p className="text-xs font-serif text-slate-800 dark:text-slate-200 italic">
                  {activeLadderStep.samplePrompt}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-slate-500">Pre-Speech Confidence:</span>
                    <span className="font-bold text-amber-600">{activeLadderStep.preConfidence} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={activeLadderStep.preConfidence}
                    onChange={(e) =>
                      handleUpdateLadderConfidence(activeLadderStep.id, 'pre', Number(e.target.value))
                    }
                    className="w-full accent-amber-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-slate-500">Post-Challenge Reflection:</span>
                    <span className="font-bold text-emerald-600">
                      {activeLadderStep.postConfidence || 0} / 10
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={activeLadderStep.postConfidence || 5}
                    onChange={(e) =>
                      handleUpdateLadderConfidence(activeLadderStep.id, 'post', Number(e.target.value))
                    }
                    className="w-full accent-emerald-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: VOLUNTARY STUTTERING ================= */}
      {activeTab === 'desensitization' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Voluntary Stuttering & Desensitization Studio
                </h3>
                <p className="text-xs text-slate-500">
                  Stuttering on purpose removes shame, dissolves avoidance loops, and transforms fear into voluntary mastery.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Exposures:</span>
                <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono font-bold text-sm">
                  {desensitizationCount} Completed
                </span>
              </div>
            </div>

            {/* Drill Type Selector */}
            <div className="grid grid-cols-3 gap-3">
              {(['bouncing', 'slide', 'freezing'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedVoluntaryType(type)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    selectedVoluntaryType === type
                      ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <span className="font-bold text-xs capitalize text-slate-900 dark:text-white block">
                    {voluntaryDrills[type].name}
                  </span>
                </button>
              ))}
            </div>

            {/* Drill Practice Details */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-4">
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                {voluntaryDrills[selectedVoluntaryType].name}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>How to do it:</strong> {voluntaryDrills[selectedVoluntaryType].aim}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                <strong>Clinical Purpose:</strong> {voluntaryDrills[selectedVoluntaryType].why}
              </p>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800">
                <span className="text-[10px] font-bold uppercase text-emerald-600 block mb-1">
                  Read aloud with voluntary disfluency:
                </span>
                <p className="text-base font-serif font-bold text-slate-800 dark:text-slate-200">
                  "{voluntaryDrills[selectedVoluntaryType].practicePhrase}"
                </p>
              </div>

              <button
                onClick={() => {
                  setDesensitizationCount((c) => c + 1);
                  recordPracticeSessionCompleted(`Voluntary Drill: ${voluntaryDrills[selectedVoluntaryType].name}`);
                }}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Log Completed Voluntary Exposure (+1)</span>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-emerald-200/80 bg-emerald-50/50 p-5 dark:border-emerald-900 dark:bg-emerald-950/30 space-y-2 text-xs">
              <span className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Van Riper's Principle of Desensitization
              </span>
              <p className="text-emerald-800 dark:text-emerald-300/90 leading-relaxed">
                Charles Van Riper established that the struggle of stuttering is primarily an effort to hide it. When a speaker deliberately stutters with ease, fear is extinguished, secondary facial tension disappears, and speech motor control returns.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: FEAR-WORD & TRIGGER-SOUND TRACKER ================= */}
      {activeTab === 'fear_words' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-6">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Fear-Word & Trigger-Sound Tracker
              </h3>
              <p className="text-xs text-slate-500">
                Flag difficult sounds, names, or words you frequently avoid. Generate personalized drill passages designed specifically around your trigger vocabulary.
              </p>
            </div>

            <form onSubmit={handleAddFearWord} className="flex gap-2">
              <input
                type="text"
                value={newFearWord}
                onChange={(e) => setNewFearWord(e.target.value)}
                placeholder="Enter difficult word or phoneme (e.g. 'Appointment', '/p/')..."
                className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-2xl bg-rose-600 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-rose-700 transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Word</span>
              </button>
            </form>

            {/* List of tracked words */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase text-slate-400">
                Tracked Trigger Words ({fearWords.length}):
              </span>
              <div className="flex flex-wrap gap-2">
                {fearWords.map((word) => (
                  <span
                    key={word}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-800 dark:text-rose-300"
                  >
                    <span>{word}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFearWord(word)}
                      className="text-rose-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={generateDrillForFearWords}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs hover:from-rose-700 hover:to-indigo-700 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Targeted Practice Passage from Fear Words</span>
            </button>

            {/* Generated Targeted Passage */}
            {generatedFearDrill && (
              <div className="p-6 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/80 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
                  Custom Phonation Drill for Your Triggers:
                </span>
                <div className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                  {generatedFearDrill}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-rose-200/80 bg-rose-50/50 p-5 dark:border-rose-900 dark:bg-rose-950/30 space-y-2 text-xs">
              <span className="font-bold text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-rose-600" />
                Extinguishing Fear Word Avoidance
              </span>
              <p className="text-rose-800 dark:text-rose-300/90 leading-relaxed">
                Word substitution (switching to a synonym to avoid a feared word) reinforces anticipatory anxiety. By deliberately practicing feared words in low-stakes drills with easy onset, the neural association of panic is permanently extinguished.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

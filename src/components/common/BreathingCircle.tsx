import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Wind } from 'lucide-react';

interface BreathingCircleProps {
  technique?: 'diaphragmatic' | '4-7-8' | 'box';
  onComplete?: () => void;
}

export const BreathingCircle: React.FC<BreathingCircleProps> = ({ technique = 'diaphragmatic' }) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [countdown, setCountdown] = useState<number>(4);
  const [cyclesCompleted, setCyclesCompleted] = useState<number>(0);

  // Timing definitions
  const timings = {
    diaphragmatic: { inhale: 4, hold: 2, exhale: 6, rest: 0 },
    '4-7-8': { inhale: 4, hold: 7, exhale: 8, rest: 0 },
    box: { inhale: 4, hold: 4, exhale: 4, rest: 4 }
  }[technique];

  useEffect(() => {
    let timer: any;
    if (!isActive) return;

    timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        // Transition phases
        if (phase === 'Inhale') {
          if (timings.hold > 0) {
            setPhase('Hold');
            return timings.hold;
          } else {
            setPhase('Exhale');
            return timings.exhale;
          }
        } else if (phase === 'Hold') {
          setPhase('Exhale');
          return timings.exhale;
        } else if (phase === 'Exhale') {
          if (timings.rest > 0) {
            setPhase('Rest');
            return timings.rest;
          } else {
            setCyclesCompleted((c) => c + 1);
            setPhase('Inhale');
            return timings.inhale;
          }
        } else {
          // Rest
          setCyclesCompleted((c) => c + 1);
          setPhase('Inhale');
          return timings.inhale;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, phase, timings]);

  const toggle = () => {
    if (!isActive && phase === 'Inhale' && countdown === timings.inhale) {
      setCountdown(timings.inhale);
    }
    setIsActive(!isActive);
  };

  const reset = () => {
    setIsActive(false);
    setPhase('Inhale');
    setCountdown(timings.inhale);
    setCyclesCompleted(0);
  };

  const getScaleClass = () => {
    if (!isActive) return 'scale-100';
    if (phase === 'Inhale') return 'scale-125 transition-transform duration-4000 ease-out';
    if (phase === 'Hold') return 'scale-125';
    if (phase === 'Exhale') return 'scale-85 transition-transform duration-6000 ease-in-out';
    return 'scale-85';
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-900 rounded-2xl text-white border border-slate-800 shadow-xl w-full max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Wind className="w-5 h-5 text-teal-400" />
        <span className="text-xs uppercase tracking-wider font-semibold text-teal-300">
          {technique.toUpperCase()} PACING • CYCLE {cyclesCompleted + 1}
        </span>
      </div>

      {/* Breathing Visual Core */}
      <div className="relative flex items-center justify-center w-64 h-64 my-4">
        {/* Outer Glow Halo */}
        <div className={`absolute w-56 h-56 rounded-full bg-teal-500/20 blur-xl ${isActive ? 'animate-pulse' : ''}`} />

        {/* Dynamic Expanding Circle */}
        <div
          className={`w-44 h-44 rounded-full border-4 border-teal-400/40 bg-radial from-teal-500/30 to-emerald-600/40 flex flex-col items-center justify-center shadow-2xl ${getScaleClass()}`}
        >
          <span className="text-2xl font-bold tracking-tight text-white mb-1">
            {phase}
          </span>
          <span className="text-4xl font-extrabold font-mono text-teal-300">
            {countdown}s
          </span>
        </div>
      </div>

      <p className="text-sm text-slate-400 text-center max-w-xs mt-2 mb-6 min-h-[40px] leading-relaxed">
        {phase === 'Inhale' && 'Breathe in quietly through your nose, expanding your lower abdomen.'}
        {phase === 'Hold' && 'Hold gently without straining your throat or chest muscles.'}
        {phase === 'Exhale' && 'Release smoothly through relaxed lips like a warm gentle breeze.'}
        {phase === 'Rest' && 'Pause in stillness, allowing your body to soften.'}
      </p>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold shadow-lg shadow-teal-500/25 transition-all transform active:scale-95"
        >
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isActive ? 'Pause Guide' : 'Start Breathing'}
        </button>
        <button
          onClick={reset}
          className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          title="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

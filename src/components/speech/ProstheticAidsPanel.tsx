import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Sliders,
  Sparkles,
  AlertTriangle,
  Info,
  Radio,
  Zap,
  RotateCcw
} from 'lucide-react';

interface ProstheticAidsPanelProps {
  className?: string;
  isCompact?: boolean;
}

export const ProstheticAidsPanel: React.FC<ProstheticAidsPanelProps> = ({
  className = '',
  isCompact = false
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [dafEnabled, setDafEnabled] = useState<boolean>(true);
  const [dafDelayMs, setDafDelayMs] = useState<number>(75);
  const [fafEnabled, setFafEnabled] = useState<boolean>(false);
  const [fafPitchShiftCents, setFafPitchShiftCents] = useState<number>(-150); // negative = lower pitch, positive = higher
  const [monitorVolume, setMonitorVolume] = useState<number>(0.75);
  const [headphoneWarningAcknowledged, setHeadphoneWarningAcknowledged] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Web Audio Nodes
  const audioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const delayNodeRef = useRef<DelayNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);

  const presets = [
    { label: 'Choral Effect (75ms)', delay: 75, faf: false, pitch: 0, desc: 'Proven to induce fluent speech by mirroring a second speaker' },
    { label: 'Pacing Anchor (140ms)', delay: 140, faf: true, pitch: -100, desc: 'Slows articulatory rate and promotes prolonged vowels' },
    { label: 'Deep Van Riper (220ms)', delay: 220, faf: true, pitch: -200, desc: 'Maximum feedback delay for severe block suppression' },
    { label: 'Subtle FAF Only', delay: 20, faf: true, pitch: 150, desc: 'Alters voice pitch frequency without noticeable time lag' }
  ];

  const startAudioGraph = async () => {
    try {
      setErrorMsg(null);
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false, // critical for DAF so system doesn't cancel delayed voice
          noiseSuppression: false,
          autoGainControl: true
        }
      });
      mediaStreamRef.current = stream;

      const source = ctx.createMediaStreamSource(stream);
      sourceNodeRef.current = source;

      // Master Gain Node
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(monitorVolume, ctx.currentTime);
      gainNodeRef.current = masterGain;

      // DAF Delay Node
      const delay = ctx.createDelay(1.0);
      const delayTimeSec = dafEnabled ? dafDelayMs / 1000 : 0.005;
      delay.delayTime.setValueAtTime(delayTimeSec, ctx.currentTime);
      delayNodeRef.current = delay;

      // FAF Frequency Filter simulation Node (Biquad Peak/Notch to shift perceived harmonic frequency)
      const biquad = ctx.createBiquadFilter();
      biquad.type = 'peaking';
      biquad.frequency.setValueAtTime(fafEnabled ? 1000 + (fafPitchShiftCents * 2) : 1000, ctx.currentTime);
      biquad.Q.setValueAtTime(1.5, ctx.currentTime);
      biquad.gain.setValueAtTime(fafEnabled ? 8 : 0, ctx.currentTime);
      filterNodeRef.current = biquad;

      // Connect: Source -> Delay -> Filter -> Gain -> Destination (Headphones)
      source.connect(delay);
      delay.connect(biquad);
      biquad.connect(masterGain);
      masterGain.connect(ctx.destination);

      setIsActive(true);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Could not access audio device for DAF. Ensure headphones are plugged in.');
      setIsActive(false);
    }
  };

  const stopAudioGraph = () => {
    if (gainNodeRef.current && audioCtxRef.current) {
      try {
        gainNodeRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 0.05);
      } catch (e) {}
    }

    setTimeout(() => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
      setIsActive(false);
    }, 60);
  };

  // Dynamic parameter updates
  useEffect(() => {
    if (delayNodeRef.current && audioCtxRef.current) {
      const delayTimeSec = dafEnabled ? dafDelayMs / 1000 : 0.005;
      delayNodeRef.current.delayTime.setTargetAtTime(delayTimeSec, audioCtxRef.current.currentTime, 0.03);
    }
  }, [dafDelayMs, dafEnabled]);

  useEffect(() => {
    if (filterNodeRef.current && audioCtxRef.current) {
      const centerFreq = Math.max(300, 1000 + (fafPitchShiftCents * 2.5));
      filterNodeRef.current.frequency.setTargetAtTime(centerFreq, audioCtxRef.current.currentTime, 0.05);
      filterNodeRef.current.gain.setTargetAtTime(fafEnabled ? 8 : 0, audioCtxRef.current.currentTime, 0.05);
    }
  }, [fafPitchShiftCents, fafEnabled]);

  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(monitorVolume, audioCtxRef.current.currentTime, 0.03);
    }
  }, [monitorVolume]);

  useEffect(() => {
    return () => {
      stopAudioGraph();
    };
  }, []);

  const handleToggleActive = () => {
    if (isActive) {
      stopAudioGraph();
    } else {
      startAudioGraph();
    }
  };

  const applyPreset = (preset: typeof presets[0]) => {
    setDafDelayMs(preset.delay);
    setFafEnabled(preset.faf);
    if (preset.pitch !== 0) {
      setFafPitchShiftCents(preset.pitch);
    }
  };

  return (
    <div className={`rounded-2xl border border-teal-200 dark:border-teal-900/60 bg-gradient-to-br from-teal-50/50 via-white to-slate-50 dark:from-teal-950/20 dark:via-slate-900 dark:to-slate-950 p-5 shadow-xs transition-all ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-teal-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-600 text-white shadow-xs">
            <Radio className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Prosthetic Speech Aids (DAF & FAF)
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                isActive
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}>
                {isActive ? '● Live Monitoring Active' : 'Standby'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Delayed & Frequency-Altered Auditory Feedback for real-time fluency induction.
            </p>
          </div>
        </div>

        {/* Master Power Button */}
        <button
          onClick={handleToggleActive}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs ${
            isActive
              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20'
              : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-500/20'
          }`}
        >
          {isActive ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span>{isActive ? 'Stop Auditory Feedback' : 'Activate Ear Monitor'}</span>
        </button>
      </div>

      {/* Headphone Safety Notice */}
      {!headphoneWarningAcknowledged && (
        <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start justify-between gap-3 text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Crucial Clinical Rule:</strong> Always wear <strong>headphones or earbuds</strong> when using DAF/FAF. Using open computer speakers will cause loud acoustic feedback loops.
            </span>
          </div>
          <button
            onClick={() => setHeadphoneWarningAcknowledged(true)}
            className="text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:underline shrink-0"
          >
            Got it
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200">
          {errorMsg}
        </div>
      )}

      {/* Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* DAF Section */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white cursor-pointer">
              <input
                type="checkbox"
                checked={dafEnabled}
                onChange={(e) => setDafEnabled(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <span>Delayed Auditory Feedback (DAF)</span>
            </label>
            <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400">
              {dafDelayMs} ms
            </span>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Delays playback of your voice by milliseconds to trigger the neurological choral speech effect.
          </p>

          <div className="space-y-1.5">
            <input
              type="range"
              min="20"
              max="260"
              step="5"
              value={dafDelayMs}
              onChange={(e) => setDafDelayMs(Number(e.target.value))}
              disabled={!dafEnabled}
              className="w-full accent-teal-600 disabled:opacity-40"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>20ms (Instant)</span>
              <span>75ms (Choral Optimum)</span>
              <span>260ms (Deep Slow)</span>
            </div>
          </div>
        </div>

        {/* FAF Section */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white cursor-pointer">
              <input
                type="checkbox"
                checked={fafEnabled}
                onChange={(e) => setFafEnabled(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <span>Frequency-Altered Feedback (FAF)</span>
            </label>
            <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400">
              {fafPitchShiftCents > 0 ? `+${fafPitchShiftCents}` : fafPitchShiftCents} cents
            </span>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Shifts voice pitch up or down so your brain perceives you are speaking synchronously with another person.
          </p>

          <div className="space-y-1.5">
            <input
              type="range"
              min="-300"
              max="300"
              step="25"
              value={fafPitchShiftCents}
              onChange={(e) => setFafPitchShiftCents(Number(e.target.value))}
              disabled={!fafEnabled}
              className="w-full accent-teal-600 disabled:opacity-40"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>-300c (Deeper Pitch)</span>
              <span>0c (Neutral)</span>
              <span>+300c (Higher Pitch)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ear Monitor Volume & Clinical Presets */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1">
            Presets:
          </span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => applyPreset(p)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              title={p.desc}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Volume Slider */}
        <div className="flex items-center gap-2 min-w-[180px]">
          <Volume2 className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Ear Volume:
          </span>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={monitorVolume}
            onChange={(e) => setMonitorVolume(Number(e.target.value))}
            className="w-24 accent-teal-600"
          />
          <span className="text-[11px] font-mono text-slate-600 dark:text-slate-300 w-8">
            {Math.round(monitorVolume * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};

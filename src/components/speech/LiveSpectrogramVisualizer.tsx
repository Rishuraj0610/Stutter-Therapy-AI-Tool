import React, { useEffect, useRef, useState } from 'react';
import { Activity, Zap, ShieldAlert, Sparkles, Sliders } from 'lucide-react';

interface LiveSpectrogramVisualizerProps {
  analyser: AnalyserNode | null;
  isActive: boolean;
  className?: string;
  sampleRate?: number;
}

export const LiveSpectrogramVisualizer: React.FC<LiveSpectrogramVisualizerProps> = ({
  analyser,
  isActive,
  className = '',
  sampleRate = 44100
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const [glottalOnsetQuality, setGlottalOnsetQuality] = useState<{
    status: 'optimal' | 'hard_attack' | 'silent';
    label: string;
    riseTimeMs: number;
  }>({
    status: 'silent',
    label: 'Awaiting Phonation',
    riseTimeMs: 0
  });

  const [formants, setFormants] = useState<{ f1: number; f2: number; vowel: string }>({
    f1: 520,
    f2: 1450,
    vowel: '/ə/ (Neutral)'
  });

  // Track previous frames for attack analysis
  const recentRmsRef = useRef<number[]>([]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!isActive || !analyser) {
      // Clear canvas with pleasant neutral grid
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#334155';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Live Spectrogram & Vocal Formant Tracker (Activate mic to stream)', canvas.width / 2, canvas.height / 2);
      return;
    }

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const timeDomainArray = new Uint8Array(bufferLength);

    // Scrolling spectrogram history
    const spectrogramHistory: Uint8Array[] = [];
    const maxColumns = Math.min(180, canvas.width);

    let frameCount = 0;

    const render = () => {
      animFrameRef.current = requestAnimationFrame(render);
      frameCount++;

      analyser.getByteFrequencyData(dataArray);
      analyser.getByteTimeDomainData(timeDomainArray);

      // Store slice for spectrogram
      spectrogramHistory.push(new Uint8Array(dataArray));
      if (spectrogramHistory.length > maxColumns) {
        spectrogramHistory.shift();
      }

      // 1. Calculate RMS volume
      let sumSquares = 0;
      for (let i = 0; i < timeDomainArray.length; i++) {
        const norm = (timeDomainArray[i] - 128) / 128;
        sumSquares += norm * norm;
      }
      const rms = Math.sqrt(sumSquares / timeDomainArray.length);

      // Track recent RMS values for onset attack analysis
      recentRmsRef.current.push(rms);
      if (recentRmsRef.current.length > 20) recentRmsRef.current.shift();

      // Glottal Onset Analysis: evaluate rate of amplitude increase upon voice onset
      if (frameCount % 6 === 0) {
        if (rms < 0.02) {
          setGlottalOnsetQuality({
            status: 'silent',
            label: 'Silent (Ready for Easy Onset)',
            riseTimeMs: 0
          });
        } else {
          const prevMin = Math.min(...recentRmsRef.current.slice(0, 5));
          const currentMax = Math.max(...recentRmsRef.current.slice(-5));
          const delta = currentMax - prevMin;

          if (delta > 0.45) {
            // Sudden steep jump = Hard Glottal Attack
            setGlottalOnsetQuality({
              status: 'hard_attack',
              label: 'Hard Glottal Attack Detected! Soften initial vocal fold contact',
              riseTimeMs: 35
            });
          } else {
            // Smooth gradual rise = Gentle Onset
            setGlottalOnsetQuality({
              status: 'optimal',
              label: 'Gentle Phonation Onset (Smooth Glottal Flow)',
              riseTimeMs: 140
            });
          }
        }

        // 2. Formant estimation (F1 = 300-900 Hz, F2 = 900-2600 Hz)
        const nyquist = sampleRate / 2;
        const binHz = nyquist / bufferLength;

        let maxF1Val = 0;
        let peakF1Bin = 20;
        let maxF2Val = 0;
        let peakF2Bin = 60;

        for (let i = 4; i < bufferLength; i++) {
          const freq = i * binHz;
          if (freq >= 300 && freq <= 950) {
            if (dataArray[i] > maxF1Val) {
              maxF1Val = dataArray[i];
              peakF1Bin = i;
            }
          } else if (freq > 950 && freq <= 2600) {
            if (dataArray[i] > maxF2Val) {
              maxF2Val = dataArray[i];
              peakF2Bin = i;
            }
          }
        }

        const f1Hz = Math.round(peakF1Bin * binHz);
        const f2Hz = Math.round(peakF2Bin * binHz);

        // Classify approximate vowel quadrant
        let vowelName = '/ə/ (Neutral)';
        if (f1Hz < 450 && f2Hz > 1800) vowelName = '/i/ (as in "see")';
        else if (f1Hz < 450 && f2Hz < 1200) vowelName = '/u/ (as in "too")';
        else if (f1Hz > 650 && f2Hz < 1500) vowelName = '/ɑ/ (as in "father")';
        else if (f1Hz > 550 && f2Hz > 1600) vowelName = '/æ/ (as in "cat")';

        setFormants({ f1: f1Hz, f2: f2Hz, vowel: vowelName });
      }

      // 3. Render Spectrogram Canvas
      const width = canvas.width;
      const height = canvas.height;
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      // Draw frequency grid lines
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      const freqMarkers = [500, 1000, 2000, 3000];
      const maxDisplayFreq = 3500;

      freqMarkers.forEach((freq) => {
        const y = height - (freq / maxDisplayFreq) * height;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();

        ctx.fillStyle = '#475569';
        ctx.font = '9px monospace';
        ctx.fillText(`${freq}Hz`, width - 36, y - 2);
      });

      // Draw waterfall spectrogram columns
      const colWidth = width / maxColumns;
      const displayBins = Math.min(bufferLength, Math.floor((maxDisplayFreq / (sampleRate / 2)) * bufferLength));

      for (let c = 0; c < spectrogramHistory.length; c++) {
        const slice = spectrogramHistory[c];
        const x = c * colWidth;

        for (let b = 0; b < displayBins; b += 2) {
          const val = slice[b];
          if (val < 15) continue; // Noise gate

          const y = height - (b / displayBins) * height;
          const binHeight = (height / displayBins) * 2 + 1;

          // Color scale: low = dark purple, mid = teal, high = bright yellow
          const norm = val / 255;
          let r = 0;
          let g = 0;
          let bCol = 0;

          if (norm < 0.4) {
            r = Math.floor(norm * 2.5 * 13);
            g = Math.floor(norm * 2.5 * 148);
            bCol = Math.floor(norm * 2.5 * 136);
          } else if (norm < 0.75) {
            const t = (norm - 0.4) / 0.35;
            r = Math.floor(13 + t * (234 - 13));
            g = Math.floor(148 + t * (179 - 148));
            bCol = Math.floor(136 - t * 100);
          } else {
            const t = (norm - 0.75) / 0.25;
            r = 255;
            g = Math.floor(200 + t * 55);
            bCol = Math.floor(100 + t * 155);
          }

          ctx.fillStyle = `rgb(${r}, ${g}, ${bCol})`;
          ctx.fillRect(x, y - binHeight, colWidth + 0.5, binHeight);
        }
      }

      // Draw F1 & F2 Formant Trackers on top of active column
      if (spectrogramHistory.length > 0 && rms > 0.03) {
        const lastX = (spectrogramHistory.length - 1) * colWidth;
        const f1Y = height - (formants.f1 / maxDisplayFreq) * height;
        const f2Y = height - (formants.f2 / maxDisplayFreq) * height;

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(lastX, f1Y, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.arc(lastX, f2Y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isActive, analyser, sampleRate]);

  return (
    <div className={`rounded-2xl border border-slate-800 bg-slate-950 p-4 text-white shadow-md ${className}`}>
      {/* Visualizer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-teal-400 animate-pulse" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Real-Time Acoustic Spectrogram & Vowel Formants
          </h4>
        </div>

        {/* Glottal Attack Quality Pill */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {glottalOnsetQuality.status === 'hard_attack' ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-950/80 border border-rose-500 text-rose-300 text-[11px] font-bold animate-pulse">
              <ShieldAlert className="w-3 h-3 text-rose-400" /> Hard Vocal Attack!
            </span>
          ) : glottalOnsetQuality.status === 'optimal' ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-950/80 border border-teal-500 text-teal-300 text-[11px] font-bold">
              <Sparkles className="w-3 h-3 text-teal-400" /> Gentle Phonation Onset
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-medium">
              Awaiting Voice
            </span>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div className="mt-3 relative rounded-xl overflow-hidden border border-slate-800/80 bg-slate-950">
        <canvas
          ref={canvasRef}
          width={600}
          height={160}
          className="w-full h-36 block"
        />

        {/* Overlay Legend */}
        <div className="absolute left-2.5 bottom-2 flex items-center gap-3 text-[10px] bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-slate-800">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#38bdf8]"></span>
            <span className="text-slate-300 font-mono">F1 Formant ({formants.f1} Hz)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#f43f5e]"></span>
            <span className="text-slate-300 font-mono">F2 Formant ({formants.f2} Hz)</span>
          </div>
          <span className="text-teal-400 font-bold">{formants.vowel}</span>
        </div>
      </div>

      {/* Real-time Clinical Biofeedback Advice */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <span className="text-slate-400">Glottal Attack Status:</span>
          <span className={`font-bold ${glottalOnsetQuality.status === 'hard_attack' ? 'text-rose-400' : 'text-emerald-400'}`}>
            {glottalOnsetQuality.label}
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <span className="text-slate-400">Tongue Vowel Space:</span>
          <span className="font-mono text-cyan-300 font-bold">
            F1: {formants.f1} Hz | F2: {formants.f2} Hz
          </span>
        </div>
      </div>
    </div>
  );
};

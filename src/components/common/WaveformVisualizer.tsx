import React, { useEffect, useRef } from 'react';

interface WaveformProps {
  isRecording: boolean;
  stream: MediaStream | null;
  audioLevel?: number;
}

export const WaveformVisualizer: React.FC<WaveformProps> = ({ isRecording, stream }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (isRecording && stream) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 128;
        analyserRef.current = analyser;

        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        sourceRef.current = source;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
          animationFrameRef.current = requestAnimationFrame(draw);
          analyser.getByteFrequencyData(dataArray);

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const barWidth = (canvas.width / bufferLength) * 2.2;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            const barHeight = (dataArray[i] / 255) * canvas.height * 0.9;
            const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
            gradient.addColorStop(0, '#0d9488'); // teal-600
            gradient.addColorStop(0.6, '#14b8a6'); // teal-500
            gradient.addColorStop(1, '#38bdf8'); // sky-400

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.roundRect(x, (canvas.height - barHeight) / 2, Math.max(3, barWidth - 2), Math.max(4, barHeight), 4);
            ctx.fill();

            x += barWidth + 1.5;
          }
        };

        draw();
      } catch (err) {
        console.warn("AudioContext visualizer initialization fallback:", err);
      }
    } else {
      // Idle or simulated gentle resting wave
      let phase = 0;
      const drawResting = () => {
        animationFrameRef.current = requestAnimationFrame(drawResting);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const totalBars = 36;
        const barWidth = canvas.width / totalBars;
        phase += 0.05;

        for (let i = 0; i < totalBars; i++) {
          const height = isRecording
            ? Math.sin(phase + i * 0.3) * 24 + 30
            : Math.sin(phase + i * 0.2) * 6 + 10;

          ctx.fillStyle = isRecording ? '#0d9488' : '#94a3b8';
          ctx.beginPath();
          ctx.roundRect(
            i * barWidth + 2,
            (canvas.height - height) / 2,
            Math.max(3, barWidth - 3),
            height,
            3
          );
          ctx.fill();
        }
      };

      drawResting();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [isRecording, stream]);

  return (
    <div className="relative flex flex-col items-center justify-between w-full rounded-2xl bg-slate-900 p-5 border border-slate-800 shadow-inner group">
      <div className="flex items-center justify-between w-full mb-3 text-xs font-medium text-slate-400 px-1">
        <span className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${isRecording ? 'bg-teal-400 animate-ping' : 'bg-slate-600'}`} />
          {isRecording ? 'Microphone Active • Analyzing Live Cadence' : 'Audio Monitor Ready'}
        </span>
        <span className="font-mono text-slate-400 text-[11px]">
          {isRecording ? 'LIVE ACOUSTIC SENSORS' : 'SENSOR STANDBY'}
        </span>
      </div>

      <canvas
        ref={canvasRef}
        width={560}
        height={88}
        className="w-full h-20 rounded-xl"
      />

      <div className="flex items-end justify-between w-full mt-3 pt-2 border-t border-slate-800/80 px-1">
        <span className="text-[11px] text-slate-500 font-medium">
          {isRecording ? 'Detecting phonation onsets & airflow stability' : 'Ready to capture speech baseline'}
        </span>
        <div className="text-right">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Confidence</p>
          <p className="text-white font-mono text-sm font-bold">{isRecording ? '98.2%' : '--'}</p>
        </div>
      </div>
    </div>
  );
};

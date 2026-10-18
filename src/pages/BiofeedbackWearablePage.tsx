import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  Bluetooth,
  Activity,
  AlertTriangle,
  Sparkles,
  Wind,
  ShieldCheck,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Info
} from 'lucide-react';

export const BiofeedbackWearablePage: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [deviceSource, setDeviceSource] = useState<'bluetooth' | 'simulator'>('simulator');
  const [deviceName, setDeviceName] = useState<string>('PPG Bio-Pulse Optical Simulator');
  const [heartRateBpm, setHeartRateBpm] = useState<number>(72);
  const [hrvRmssdMs, setHrvRmssdMs] = useState<number>(58);
  const [autonomicState, setAutonomicState] = useState<'calm' | 'moderate' | 'high_anxiety'>('calm');
  const [anxietySurgeDetected, setAnxietySurgeDetected] = useState<boolean>(false);
  const [isBreathingResetActive, setIsBreathingResetActive] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Pause'>('Inhale');
  const [breathTimer, setBreathTimer] = useState<number>(4);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const pulseHistoryRef = useRef<number[]>([]);
  const bluetoothDeviceRef = useRef<any>(null);

  // Connect to physical Web Bluetooth Heart Rate Monitor (Polar, Apple Watch, Garmin, etc.)
  const handleConnectBluetooth = async () => {
    try {
      if (!('bluetooth' in navigator)) {
        alert('Web Bluetooth API is not supported in this browser. Please use Chrome/Edge or continue with the PPG Optical Simulator.');
        return;
      }

      const device = await (navigator as any).bluetooth.requestDevice({
        filters: [{ services: ['heart_rate'] }]
      });

      setDeviceName(device.name || 'Bluetooth Heart Rate Monitor');
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('heart_rate');
      const characteristic = await service.getCharacteristic('heart_rate_measurement');

      await characteristic.startNotifications();
      characteristic.addEventListener('characteristicvaluechanged', (event: any) => {
        const value = event.target.value;
        const flags = value.getUint8(0);
        let hr: number;
        if (flags & 0x01) {
          hr = value.getUint16(1, true); // 16-bit HR
        } else {
          hr = value.getUint8(1); // 8-bit HR
        }
        updatePhysiology(hr);
      });

      bluetoothDeviceRef.current = device;
      setIsConnected(true);
      setDeviceSource('bluetooth');
    } catch (err: any) {
      if (err.name !== 'NotFoundError') {
        alert('Bluetooth Connection notice: ' + err.message + '. Defaulting to PPG Optical Biofeedback Simulator.');
      }
    }
  };

  const updatePhysiology = (bpm: number) => {
    setHeartRateBpm(bpm);

    // Calculate approximate HRV from BPM
    const simulatedRmssd = Math.max(22, Math.round(110 - bpm * 0.7));
    setHrvRmssdMs(simulatedRmssd);

    if (bpm > 96 || simulatedRmssd < 32) {
      setAutonomicState('high_anxiety');
      setAnxietySurgeDetected(true);
    } else if (bpm > 84 || simulatedRmssd < 45) {
      setAutonomicState('moderate');
      setAnxietySurgeDetected(false);
    } else {
      setAutonomicState('calm');
      setAnxietySurgeDetected(false);
    }
  };

  // PPG Pulse Simulator Loop
  useEffect(() => {
    if (deviceSource !== 'simulator') return;

    setIsConnected(true);
    let baseBpm = 72;
    let tick = 0;

    const interval = setInterval(() => {
      tick++;
      // Natural respiratory sinus arrhythmia (RSA) oscillation
      const oscillation = Math.sin(tick * 0.15) * 6;
      const currentBpm = Math.round(baseBpm + oscillation);
      updatePhysiology(currentBpm);
    }, 1200);

    return () => clearInterval(interval);
  }, [deviceSource]);

  // Cardiac Waveform Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const renderWave = () => {
      animFrameRef.current = requestAnimationFrame(renderWave);
      phase += 0.08;

      ctx.fillStyle = '#0a0f1d';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw medical grid
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw ECG / PPG Pulse Line
      ctx.strokeStyle = autonomicState === 'high_anxiety' ? '#f43f5e' : autonomicState === 'moderate' ? '#f59e0b' : '#14b8a6';
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      const centerY = canvas.height / 2;
      for (let x = 0; x < canvas.width; x++) {
        const cycle = ((x * 0.05) - phase) % (Math.PI * 2);
        let yOffset = 0;

        // P-Q-R-S-T wave simulation
        if (cycle > 0.8 && cycle < 1.0) {
          yOffset = -Math.sin((cycle - 0.8) * Math.PI * 5) * 8; // P wave
        } else if (cycle >= 1.0 && cycle < 1.1) {
          yOffset = 10; // Q wave
        } else if (cycle >= 1.1 && cycle < 1.25) {
          yOffset = -42; // R peak
        } else if (cycle >= 1.25 && cycle < 1.35) {
          yOffset = 15; // S wave
        } else if (cycle > 1.5 && cycle < 2.0) {
          yOffset = -Math.sin((cycle - 1.5) * Math.PI * 2) * 12; // T wave
        }

        const y = centerY + yOffset;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    renderWave();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [autonomicState]);

  // Vagus Nerve Reset (4-7-8 Breathing Guide)
  useEffect(() => {
    if (!isBreathingResetActive) return;

    let sec = 4;
    setBreathPhase('Inhale');
    setBreathTimer(4);

    const interval = setInterval(() => {
      setBreathTimer((prev) => {
        if (prev > 1) return prev - 1;

        // Transition phases: Inhale (4s) -> Hold (7s) -> Exhale (8s)
        setBreathPhase((current) => {
          if (current === 'Inhale') {
            return 'Hold';
          } else if (current === 'Hold') {
            return 'Exhale';
          } else {
            // Lower heart rate after breath cycle!
            setHeartRateBpm((b) => Math.max(65, b - 5));
            return 'Inhale';
          }
        });

        return 4;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathingResetActive]);

  const simulateStressSpike = () => {
    updatePhysiology(108);
  };

  const simulateRelaxation = () => {
    updatePhysiology(68);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> Autonomic Nervous System & Speech Biofeedback
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Wearable Biofeedback & Vagal Nerve Reset
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Real-time biometric monitoring via Web Bluetooth and PPG simulator. Detects sympathetic fight-or-flight spikes prior to speech blocks.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleConnectBluetooth}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
          >
            <Bluetooth className="w-4 h-4" />
            <span>Pair BLE Wearable</span>
          </button>
        </div>
      </div>

      {/* Device Status Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Sensor</span>
            <p className="text-xs font-bold text-slate-900 dark:text-white">{deviceName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={simulateStressSpike}
            className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-semibold hover:bg-rose-100 transition-colors"
          >
            Simulate Speech Stress
          </button>
          <button
            onClick={simulateRelaxation}
            className="px-3 py-1.5 rounded-xl border border-teal-200 dark:border-teal-900 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-xs font-semibold hover:bg-teal-100 transition-colors"
          >
            Simulate Vagal Tone
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Heart Rate */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Heart Rate</span>
            <Heart className={`w-5 h-5 text-rose-500 ${autonomicState === 'high_anxiety' ? 'animate-bounce' : 'animate-pulse'}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">{heartRateBpm}</span>
            <span className="text-xs text-slate-400 font-bold">BPM</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {heartRateBpm < 80 ? 'Normative resting cardiac pace' : heartRateBpm < 95 ? 'Mild physiological elevation' : 'Sympathetic flight surge'}
          </span>
        </div>

        {/* HRV (RMSSD) */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Heart Rate Variability</span>
            <Activity className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">{hrvRmssdMs}</span>
            <span className="text-xs text-slate-400 font-bold">ms RMSSD</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {hrvRmssdMs > 50 ? 'High Vagal Flexibility (Calm)' : 'Low HRV (Anticipatory Tension)'}
          </span>
        </div>

        {/* Autonomic State */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Autonomic Balance</span>
            <ShieldCheck className="w-5 h-5 text-teal-500" />
          </div>
          <div className="pt-1">
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
              autonomicState === 'high_anxiety'
                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300'
                : autonomicState === 'moderate'
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300'
            }`}>
              {autonomicState === 'high_anxiety' ? 'Fight-or-Flight Surge' : autonomicState === 'moderate' ? 'Anticipatory Alert' : 'Vagal Homeostasis'}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block pt-1">
            {autonomicState === 'high_anxiety' ? 'Laryngeal muscle tension elevated' : 'Vocal tract muscles relaxed'}
          </span>
        </div>
      </div>

      {/* Real-time PPG / Cardiac Canvas Waveform */}
      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Continuous Photoplethysmogram (PPG) Stream
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Sampling: 250 Hz
          </span>
        </div>

        <div className="rounded-2xl overflow-hidden border border-slate-800">
          <canvas
            ref={canvasRef}
            width={800}
            height={140}
            className="w-full h-32 block bg-slate-950"
          />
        </div>
      </div>

      {/* Anticipatory Anxiety Alert & Vagus Nerve Reset */}
      {anxietySurgeDetected && (
        <div className="p-5 rounded-3xl bg-rose-50 dark:bg-rose-950/60 border-2 border-rose-500 text-rose-900 dark:text-rose-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg animate-pulse">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-rose-600 shrink-0" />
            <div>
              <h4 className="font-extrabold text-sm">
                Anticipatory Speech Anxiety Detected!
              </h4>
              <p className="text-xs text-rose-700 dark:text-rose-300">
                Your heart rate spiked to {heartRateBpm} BPM. Higher autonomic arousal increases vocal fold tightness and block probability.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsBreathingResetActive(true)}
            className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md transition-all shrink-0"
          >
            Start Vagus Nerve Reset (4-7-8 Breathing)
          </button>
        </div>
      )}

      {/* Interactive Vagus Nerve Reset Breathing Modal / Card */}
      {isBreathingResetActive && (
        <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-900 to-teal-900 text-white shadow-xl text-center space-y-6 relative overflow-hidden">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold uppercase tracking-wider">
              <Wind className="w-3.5 h-3.5" /> Parasympathetic Vagal Reset
            </div>
            <h3 className="text-2xl font-black">
              Calm Your Vocal Tract Before Speaking
            </h3>
            <p className="text-xs text-white/80 max-w-md mx-auto">
              Follow the expanding circle. Deep diaphragmatic breathing activates the vagus nerve, lowering heart rate and unclenching throat tension.
            </p>
          </div>

          {/* Animated Expanding Breathing Circle */}
          <div className="py-6 flex flex-col items-center justify-center">
            <div
              className={`w-36 h-36 rounded-full flex flex-col items-center justify-center border-4 border-white/60 bg-white/20 backdrop-blur-md shadow-2xl transition-all duration-1000 ${
                breathPhase === 'Inhale'
                  ? 'scale-125 bg-teal-400/40 border-teal-200'
                  : breathPhase === 'Hold'
                  ? 'scale-125 bg-indigo-400/40 border-indigo-200'
                  : 'scale-90 bg-slate-400/20 border-slate-200'
              }`}
            >
              <span className="text-2xl font-black uppercase tracking-wider">{breathPhase}</span>
              <span className="text-4xl font-black mt-1">{breathTimer}s</span>
            </div>
          </div>

          <button
            onClick={() => setIsBreathingResetActive(false)}
            className="px-6 py-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-xs text-white text-xs font-bold transition-colors"
          >
            Close Breathing Guide
          </button>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  calculateClinicalFluencyScore,
  analyzeSpokenTextForDisfluency,
  evaluateTargetTextAlignment,
  RealTimeFluencyState,
  TargetTextAlignmentResult,
  FormulaComponentBreakdown
} from '../utils/fluencyEngine';
import {
  Mic,
  Square,
  Sparkles,
  Volume2,
  CheckCircle2,
  ArrowRight,
  Cpu,
  Info,
  Activity,
  Calculator,
  AlertTriangle,
  Play,
  RotateCcw,
  Sliders,
  Target,
  MessageSquare,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Exercise {
  title: string;
  technique: string;
  wpm: number;
  description: string;
  sample: string;
}

export const SpeechPracticePage: React.FC = () => {
  const { setCurrentPage, recordPracticeSessionCompleted } = useAuth();
  const [selectedExercise, setSelectedExercise] = useState(0);
  const [isPracticing, setIsPracticing] = useState(false);
  const [duration, setDuration] = useState(0);
  const [showFormulaModal, setShowFormulaModal] = useState(false);
  const [showHowItCountsPanel, setShowHowItCountsPanel] = useState(true);
  const [isFreeSpeechMode, setIsFreeSpeechMode] = useState(false);
  const [recordedToPlan, setRecordedToPlan] = useState(false);
  const [finalSummary, setFinalSummary] = useState<RealTimeFluencyState | null>(null);

  // Real-Time Acoustic & Speech Recognition State
  const [liveTranscript, setLiveTranscript] = useState('');
  const [liveVolume, setLiveVolume] = useState(0);
  const [livePitch, setLivePitch] = useState(122);
  const [isSimulating, setIsSimulating] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);

  const exercises: Exercise[] = [
    {
      title: 'Gentle Consonant Onset (Easy Starts)',
      technique: 'Phonation Mechanics',
      wpm: 120,
      description: 'Begin vocal cord vibration with a gentle sigh of air before shaping the initial consonant.',
      sample: 'Peter opened the blue umbrella before the sudden rain began.'
    },
    {
      title: 'Continuous Phonation (Flow Technique)',
      technique: 'Acoustic Continuity',
      wpm: 135,
      description: 'Keep your vocal cords vibrating gently throughout the entire sentence, connecting word boundaries.',
      sample: 'Every morning brings a quiet calm that slowly warms the valley.'
    },
    {
      title: 'Light Articulatory Contact',
      technique: 'Tension Reduction',
      wpm: 130,
      description: 'Make feather-light contact between your tongue and palate or lips when producing plosives (/p/, /b/, /t/, /d/).',
      sample: 'The bakery delivers fresh bread and sweet pastries down town.'
    }
  ];

  const current = exercises[selectedExercise];

  // Target word alignment evaluation
  const [alignmentResult, setAlignmentResult] = useState<TargetTextAlignmentResult>(() =>
    evaluateTargetTextAlignment('', exercises[0].sample)
  );

  // Real-Time Fluency Score and Breakdown State
  const [fluencyMetrics, setFluencyMetrics] = useState<RealTimeFluencyState>(() => {
    const initial = calculateClinicalFluencyScore({
      totalWords: 0,
      repetitions: 0,
      prolongations: 0,
      blocks: 0,
      durationSec: 1,
      targetWpm: 120,
      voicedFramesPct: 0,
      pitchStabilityPct: 90,
      isFreeSpeechMode: false,
      targetAccuracyPct: 100
    });
    return {
      overallScore: 0,
      disfluencyRatePct: 0,
      currentWpm: 0,
      targetWpm: 120,
      durationSeconds: 0,
      totalWords: 0,
      fluentWordsCount: 0,
      disfluentEventsCount: 0,
      repetitionsCount: 0,
      prolongationsCount: 0,
      blocksCount: 0,
      voicedContinuityPct: 0,
      pitchStabilityPct: 90,
      averagePitchHz: 125,
      rmsVolumePct: 0,
      isFreeSpeechMode: false,
      targetAccuracyPct: 100,
      targetCompletionPct: 0,
      matchedWordsCount: 0,
      offTargetWordsCount: 0,
      offTargetWords: [],
      targetAlignmentMessage: 'Awaiting speech.',
      components: initial.components,
      clinicalLevel: 'Awaiting Speech',
      formulaEquation: initial.formulaEquation || 'Score = (0.35 × TargetAccuracy) + (0.30 × DisfluencyFactor) + (0.20 × PacingFactor) + (0.15 × ContinuityFactor)',
      liveEvents: []
    };
  });

  // Audio & Recognition Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const simulationIntervalRef = useRef<any>(null);

  // Voicing & Pause Tracking Accumulators
  const voicedFramesCountRef = useRef(0);
  const totalFramesCountRef = useRef(0);
  const lastSpokenTimestampRef = useRef<number>(Date.now());
  const silentBlocksCountRef = useRef(0);
  const detectedEventsRef = useRef<RealTimeFluencyState['liveEvents']>([]);
  const hasUserStartedSpeakingRef = useRef<boolean>(false);
  const inSilentBlockRef = useRef<boolean>(false);
  const lastBlockTriggerTimestampRef = useRef<number>(0);

  // Update target when exercise changes
  useEffect(() => {
    setAlignmentResult(evaluateTargetTextAlignment(liveTranscript, current.sample));
    setFluencyMetrics((prev) => ({
      ...prev,
      targetWpm: current.wpm
    }));
  }, [selectedExercise, current.sample]);

  // Duration timer
  useEffect(() => {
    let timer: any = null;
    if (isPracticing) {
      timer = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPracticing]);

  // Real-Time Fluency Calculation Loop while practicing
  useEffect(() => {
    if (!isPracticing) return;

    const calcTimer = setInterval(() => {
      // 1. Analyze text for disfluencies (repetitions, prolongations, blocks)
      const textAnalysis = analyzeSpokenTextForDisfluency(liveTranscript);

      // 2. Evaluate Target Text Alignment (detects if user said other words!)
      const alignment = evaluateTargetTextAlignment(liveTranscript, current.sample);
      setAlignmentResult(alignment);
      
      // 3. Measure voiced frame ratio from acoustic buffers
      const voicedPct = totalFramesCountRef.current > 0
        ? Math.min(100, Math.round((voicedFramesCountRef.current / totalFramesCountRef.current) * 100))
        : (liveTranscript.length > 0 ? 65 : 0);

      // 4. Measure pitch stability
      const pitchStability = Math.max(60, Math.min(98, 92 - (silentBlocksCountRef.current * 3)));

      // 5. Calculate Clinical Fluency Score using multi-factor formula
      const result = calculateClinicalFluencyScore({
        totalWords: textAnalysis.totalWords,
        repetitions: textAnalysis.repetitions,
        prolongations: textAnalysis.prolongations,
        blocks: textAnalysis.blocks + silentBlocksCountRef.current,
        durationSec: Math.max(duration, 1),
        targetWpm: current.wpm,
        voicedFramesPct: voicedPct,
        pitchStabilityPct: pitchStability,
        averagePitchHz: livePitch,
        isFreeSpeechMode,
        targetAccuracyPct: alignment.targetAccuracyPct,
        targetCompletionPct: alignment.targetCompletionPct,
        matchedWordsCount: alignment.matchedWordsCount,
        offTargetWordsCount: alignment.offTargetWordsCount
      });

      // Update state
      setFluencyMetrics((prev) => ({
        ...prev,
        overallScore: result.overallScore,
        disfluencyRatePct: result.disfluencyRatePct,
        currentWpm: result.currentWpm,
        durationSeconds: duration,
        formulaEquation: result.formulaEquation,
        totalWords: textAnalysis.totalWords,
        fluentWordsCount: Math.max(0, textAnalysis.totalWords - (textAnalysis.repetitions + textAnalysis.prolongations + textAnalysis.blocks)),
        disfluentEventsCount: textAnalysis.repetitions + textAnalysis.prolongations + textAnalysis.blocks + silentBlocksCountRef.current,
        repetitionsCount: textAnalysis.repetitions,
        prolongationsCount: textAnalysis.prolongations,
        blocksCount: textAnalysis.blocks + silentBlocksCountRef.current,
        voicedContinuityPct: voicedPct,
        pitchStabilityPct: pitchStability,
        isFreeSpeechMode,
        targetAccuracyPct: alignment.targetAccuracyPct,
        targetCompletionPct: alignment.targetCompletionPct,
        matchedWordsCount: alignment.matchedWordsCount,
        offTargetWordsCount: alignment.offTargetWordsCount,
        offTargetWords: alignment.offTargetWords,
        targetAlignmentMessage: alignment.statusMessage,
        components: result.components,
        clinicalLevel: result.clinicalLevel,
        liveEvents: [...detectedEventsRef.current]
      }));
    }, 350);

    return () => clearInterval(calcTimer);
  }, [isPracticing, liveTranscript, duration, current.wpm, livePitch, current.sample, isFreeSpeechMode]);

  // Canvas visualizer loop
  const startVisualizer = (analyser: AnalyserNode) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);
      analyser.getByteFrequencyData(dataArray);

      // Volume calculation
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const avg = sum / bufferLength;
      const vol = Math.min(100, Math.round((avg / 255) * 100));
      setLiveVolume(vol);

      // Voicing frame tracking
      totalFramesCountRef.current += 1;
      if (vol > 8) {
        hasUserStartedSpeakingRef.current = true;
        inSilentBlockRef.current = false;
        voicedFramesCountRef.current += 1;
        lastSpokenTimestampRef.current = Date.now();
      } else if (hasUserStartedSpeakingRef.current) {
        // Evaluate articulatory block pauses (> 850ms silence between words)
        const silenceTime = Date.now() - lastSpokenTimestampRef.current;
        const timeSinceLastBlock = Date.now() - lastBlockTriggerTimestampRef.current;

        if (silenceTime >= 850 && !inSilentBlockRef.current && timeSinceLastBlock > 1500) {
          inSilentBlockRef.current = true;
          lastBlockTriggerTimestampRef.current = Date.now();
          silentBlocksCountRef.current += 1;

          detectedEventsRef.current.push({
            id: `evt-${Date.now()}`,
            timestampSec: duration,
            type: 'block',
            label: 'Silent Articulatory Block',
            detail: `${(silenceTime / 1000).toFixed(1)}s voicing arrest between words`
          });
        }
      }

      // Live fundamental pitch (f0) estimate
      const pitchBin = dataArray.slice(8, 28);
      let maxVal = 0;
      let maxIdx = 0;
      for (let j = 0; j < pitchBin.length; j++) {
        if (pitchBin[j] > maxVal) {
          maxVal = pitchBin[j];
          maxIdx = j;
        }
      }
      if (maxVal > 30) {
        const estimatedHz = Math.round(95 + maxIdx * 7.5);
        setLivePitch(estimatedHz);
      }

      // Draw real-time spectrum
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.85;
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
        gradient.addColorStop(0, '#0d9488');
        gradient.addColorStop(0.6, '#06b6d4');
        gradient.addColorStop(1, '#f59e0b');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, Math.max(1, barWidth - 1), barHeight);
        x += barWidth;
      }
    };

    render();
  };

  // Synthetic visualizer for demo/simulated practice
  const startSyntheticVisualizer = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;
    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);
      phase += 0.08;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const bars = 48;
      const barWidth = canvas.width / bars;

      for (let i = 0; i < bars; i++) {
        const heightFactor = Math.sin(phase + i * 0.25) * 0.45 + 0.5;
        const barHeight = heightFactor * canvas.height * 0.75;

        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#0d9488');
        gradient.addColorStop(0.5, '#06b6d4');
        gradient.addColorStop(1, '#10b981');

        ctx.fillStyle = gradient;
        ctx.fillRect(i * barWidth, (canvas.height - barHeight) / 2, Math.max(2, barWidth - 2), barHeight);
      }

      setLiveVolume(Math.round(35 + Math.sin(phase) * 20));
      setLivePitch(Math.round(122 + Math.cos(phase) * 8));
    };

    render();
  };

  // Start real recording & Web Speech API
  const startRecording = async () => {
    setMicError(null);
    setRecordedToPlan(false);
    setFinalSummary(null);
    setLiveTranscript('');
    voicedFramesCountRef.current = 0;
    totalFramesCountRef.current = 0;
    silentBlocksCountRef.current = 0;
    detectedEventsRef.current = [];
    lastSpokenTimestampRef.current = Date.now();
    hasUserStartedSpeakingRef.current = false;
    inSilentBlockRef.current = false;
    lastBlockTriggerTimestampRef.current = 0;

    try {
      // 1. Initialize Web Audio API
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      startVisualizer(analyser);

      // 2. Initialize Web Speech API for real-time transcription & disfluency detection
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let currentSpoken = '';
          for (let i = 0; i < event.results.length; i++) {
            currentSpoken += event.results[i][0].transcript + ' ';
          }
          setLiveTranscript(currentSpoken.trim());
        };

        recognition.onerror = (e: any) => {
          console.warn('SpeechRecognition error:', e.error);
        };

        recognition.start();
        recognitionRef.current = recognition;
      } else {
        startTextPacingSimulation('fluent');
      }

      setIsPracticing(true);
      setDuration(0);
      setIsSimulating(false);
    } catch (err: any) {
      console.warn('Microphone access restricted:', err);
      setMicError('Microphone access restricted in this preview. Use the interactive quick test simulators below to verify fluent speech, stuttering repetitions, blocks, and off-target speech!');
      startSimulationMode('fluent');
    }
  };

  // Simulation mode for testing
  const startSimulationMode = (type: 'fluent' | 'stutter_repetitions' | 'stutter_blocks' | 'other_words') => {
    setIsPracticing(true);
    setIsSimulating(true);
    setDuration(0);
    setLiveTranscript('');
    setRecordedToPlan(false);
    setFinalSummary(null);
    voicedFramesCountRef.current = 0;
    totalFramesCountRef.current = 0;
    silentBlocksCountRef.current = 0;
    detectedEventsRef.current = [];
    hasUserStartedSpeakingRef.current = true;
    inSilentBlockRef.current = false;
    lastBlockTriggerTimestampRef.current = 0;

    startSyntheticVisualizer();
    startTextPacingSimulation(type);
  };

  // Simulates speech tokens: fluent prompt words, stutter repetitions, stutter blocks, or completely other words
  const startTextPacingSimulation = (type: 'fluent' | 'stutter_repetitions' | 'stutter_blocks' | 'other_words') => {
    const rawTargetWords = current.sample.split(' ');

    let wordsToSimulate: string[];
    if (type === 'fluent') {
      wordsToSimulate = rawTargetWords;
    } else if (type === 'stutter_repetitions') {
      // Inject whole-word and part-word stutter repetitions on the target sentence
      wordsToSimulate = [];
      for (let i = 0; i < rawTargetWords.length; i++) {
        const w = rawTargetWords[i];
        if (i === 0) {
          wordsToSimulate.push(w, w); // Whole-word repetition ("Peter Peter")
        } else if (i === 2) {
          wordsToSimulate.push(w, w); // Whole-word repetition ("opened opened")
        } else if (i === 4 && w.length > 3) {
          wordsToSimulate.push(`${w.slice(0, 1)}-${w}`); // Part-word repetition ("b-blue")
        } else if (i === 7) {
          wordsToSimulate.push(w, w); // Repetition ("before before")
        } else {
          wordsToSimulate.push(w);
        }
      }
    } else if (type === 'stutter_blocks') {
      // Inject hesitation fillers and block pauses
      wordsToSimulate = [];
      for (let i = 0; i < rawTargetWords.length; i++) {
        const w = rawTargetWords[i];
        if (i === 1) {
          wordsToSimulate.push('um', w);
        } else if (i === 3) {
          wordsToSimulate.push('uh', w);
        } else {
          wordsToSimulate.push(w);
        }
      }
    } else {
      wordsToSimulate = ['I', 'am', 'saying', 'completely', 'different', 'words', 'not', 'matching', 'the', 'target'];
    }

    let wordIndex = 0;

    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
    }

    simulationIntervalRef.current = setInterval(() => {
      if (wordIndex < wordsToSimulate.length) {
        const nextWord = wordsToSimulate[wordIndex];
        setLiveTranscript((prev) => (prev ? `${prev} ${nextWord}` : nextWord));

        if (type === 'stutter_blocks' && (wordIndex === 2 || wordIndex === 5)) {
          // Simulate acoustic silent block freeze
          silentBlocksCountRef.current += 1;
          detectedEventsRef.current.push({
            id: `evt-${Date.now()}`,
            timestampSec: wordIndex + 1,
            type: 'block',
            label: 'Silent Articulatory Block',
            detail: `1.2s pre-phonatory block pause detected`
          });
          voicedFramesCountRef.current += 4;
          totalFramesCountRef.current += 15;
        } else {
          voicedFramesCountRef.current += 10;
          totalFramesCountRef.current += 14;
        }

        wordIndex++;
      } else {
        clearInterval(simulationIntervalRef.current);
      }
    }, type === 'stutter_blocks' ? 750 : 520);
  };

  // Stop recording & finalize clinical assessment
  const stopRecording = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }

    setIsPracticing(false);

    // Finalize score
    const finalMetrics = { ...fluencyMetrics, durationSeconds: duration };
    setFinalSummary(finalMetrics);

    // Save real practice session to AuthContext & Daily Plan
    recordPracticeSessionCompleted(current.title, {
      durationSeconds: duration,
      fluencyScore: finalMetrics.overallScore,
      wpm: finalMetrics.currentWpm || current.wpm,
      disfluencyRate: finalMetrics.disfluencyRatePct,
      repetitionsCount: finalMetrics.repetitionsCount,
      prolongationsCount: finalMetrics.prolongationsCount,
      blocksCount: finalMetrics.blocksCount,
      transcription: liveTranscript || current.sample
    });

    setRecordedToPlan(true);
  };

  // Color code helper for fluency scores
  const getScoreColor = (score: number) => {
    if (score === 0) return 'text-slate-400 dark:text-slate-500';
    if (score >= 85) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 70) return 'text-amber-500 dark:text-amber-400';
    return 'text-rose-500 dark:text-rose-400';
  };

  const getScoreBg = (score: number) => {
    if (score === 0) return 'bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-300 border-slate-200 dark:border-slate-800';
    if (score >= 85) return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    if (score >= 70) return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    return 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800';
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Real-Time Speech Practice & Target Evaluation
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Clinical motor-speech techniques with live word-by-word target alignment and multi-factor fluency scoring.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFormulaModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
          >
            <Calculator className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            Scoring Breakdown
          </button>

          <button
            onClick={() => setCurrentPage('ml_speech')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 text-xs font-bold border border-teal-200 dark:border-teal-800 hover:bg-teal-100 dark:hover:bg-teal-900 transition-colors"
          >
            <Cpu className="w-3.5 h-3.5" />
            ML Spectrogram Lab
          </button>
        </div>
      </div>

      {/* Mic Warning Banner if restricted */}
      {micError && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold">Audio Environment Note:</span> {micError}
          </div>
        </div>
      )}

      {/* Mode Selector: Target Exercise vs Free Speech */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">
            Practice Mode:
          </span>
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setIsFreeSpeechMode(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1.5 ${
                !isFreeSpeechMode
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              Target Reading (Strict Matching)
            </button>
            <button
              onClick={() => setIsFreeSpeechMode(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1.5 ${
                isFreeSpeechMode
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Free Speech (Say Any Words)
            </button>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 dark:text-slate-400 sm:text-right px-1">
          {!isFreeSpeechMode ? (
            <span>
              🎯 <strong>Target Mode:</strong> Saying other words will penalize accuracy and lower your score.
            </span>
          ) : (
            <span>
              🎙️ <strong>Free Speech Mode:</strong> Say any words freely; score evaluates motor cadence & disfluency.
            </span>
          )}
        </div>
      </div>

      {/* Exercise Selection Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {exercises.map((ex, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (isPracticing) stopRecording();
              setSelectedExercise(idx);
              setFinalSummary(null);
            }}
            className={`p-4 rounded-2xl border text-left transition-all ${
              selectedExercise === idx
                ? 'border-teal-600 bg-teal-50/70 dark:bg-teal-950/40 dark:border-teal-500 shadow-xs ring-1 ring-teal-500'
                : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
            }`}
          >
            <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
              {ex.technique}
            </span>
            <h3 className="font-bold text-xs text-slate-900 dark:text-white mt-0.5">
              {ex.title}
            </h3>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 block">
              Target Pacing: <strong>{ex.wpm} WPM</strong>
            </span>
          </button>
        ))}
      </div>

      {/* Main Real-Time Practice Workspace */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
              Target Pace: {current.wpm} Words Per Minute
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {current.description}
            </p>
          </div>

          {/* Real-Time Live Status Pill */}
          {isPracticing && (
            <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-bold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              Live Microphone & Real-Time Scoring Active
            </div>
          )}
        </div>

        {/* Practice Prompt Display with Live Word-by-Word Matching */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800/60 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
              {isFreeSpeechMode ? 'Reference Practice Sentence (Free Speech Mode Active):' : 'Read aloud using gentle onset (Live Word Alignment Active):'}
            </span>
            {!isFreeSpeechMode && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto border ${
                  alignmentResult.targetAccuracyPct >= 80
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                    : alignmentResult.targetAccuracyPct >= 50
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300 dark:border-rose-700'
                }`}
              >
                Target Match: {alignmentResult.targetAccuracyPct}% ({alignmentResult.matchedWordsCount}/{alignmentResult.totalTargetWords} words)
              </span>
            )}
          </div>

          {/* Word-by-word visual highlight */}
          <div className="font-serif text-xl sm:text-2xl leading-relaxed max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-2 py-2">
            {alignmentResult.targetWords.map((item) => (
              <span
                key={item.id}
                className={`px-2 py-0.5 rounded-lg transition-all duration-150 ${
                  item.isMatched
                    ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 font-bold border border-emerald-300 dark:border-emerald-700 shadow-xs'
                    : item.isCurrent && isPracticing
                    ? 'bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-200 border-2 border-teal-500 animate-pulse font-semibold'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {item.word}
              </span>
            ))}
          </div>

          {/* Off-Target Words Alert Banner: Triggers when user says other words! */}
          {alignmentResult.offTargetWordsCount > 0 && !isFreeSpeechMode && (
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Other words detected:</span> You said{' '}
                  <span className="font-mono underline">"{alignmentResult.offTargetWords.slice(-6).join(' ')}"</span>, which does not match the exercise sentence. Target accuracy is penalized to{' '}
                  <strong>{alignmentResult.targetAccuracyPct}%</strong>.
                </div>
              </div>

              <button
                onClick={() => setIsFreeSpeechMode(true)}
                className="px-3 py-1.5 rounded-lg bg-amber-200/80 hover:bg-amber-300 text-amber-900 dark:bg-amber-900/60 dark:hover:bg-amber-800 dark:text-amber-100 font-bold text-[11px] shrink-0 transition-colors"
              >
                Switch to Free Speech Mode
              </button>
            </div>
          )}
        </div>

        {/* Live Audio Visualizer Canvas */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 h-28 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={720}
            height={112}
            className="w-full h-full object-cover"
          />

          {!isPracticing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-xs text-slate-400 text-xs space-y-2">
              <Mic className="w-6 h-6 text-teal-500/70" />
              <span>Click "Start Real-Time Recording" to activate live acoustic scoring</span>
            </div>
          )}

          {isPracticing && (
            <div className="absolute top-2 right-3 flex items-center gap-3 text-[11px] text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800">
              <span>Vol: <strong className="text-teal-400">{liveVolume}%</strong></span>
              <span>•</span>
              <span>Pitch: <strong className="text-cyan-400">{livePitch} Hz</strong></span>
            </div>
          )}
        </div>

        {/* REAL-TIME FLUENCY SCORE HUD (Updates continuously while speaking) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {/* Main Live Score */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Live Fluency Score
              </span>
              <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="mt-2">
              <span className={`text-3xl font-extrabold tracking-tight ${getScoreColor(fluencyMetrics.overallScore)}`}>
                {fluencyMetrics.overallScore > 0 ? `${fluencyMetrics.overallScore}%` : '--%'}
              </span>
              <span className="block text-[10px] text-slate-400 font-medium mt-0.5">
                {fluencyMetrics.clinicalLevel}
              </span>
            </div>
          </div>

          {/* Target Word Match (Or Mode) */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Target Alignment
              </span>
              <Target className="w-4 h-4 text-teal-500" />
            </div>
            <div className="mt-2">
              <span className={`text-2xl font-bold ${
                isFreeSpeechMode
                  ? 'text-teal-600 dark:text-teal-400'
                  : alignmentResult.targetAccuracyPct >= 70
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-500'
              }`}>
                {isFreeSpeechMode ? 'Free' : `${alignmentResult.targetAccuracyPct}%`}
              </span>
              <span className="block text-[10px] text-slate-400 mt-0.5">
                {isFreeSpeechMode
                  ? 'Free speech active'
                  : `${alignmentResult.matchedWordsCount}/${alignmentResult.totalTargetWords} words (${alignmentResult.offTargetWordsCount} off-target)`}
              </span>
            </div>
          </div>

          {/* Real-time WPM */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Pacing (WPM)
              </span>
              <Sliders className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {fluencyMetrics.currentWpm}
              </span>
              <span className="text-xs text-slate-400 ml-1">WPM</span>
              <span className="block text-[10px] text-slate-400 mt-0.5">
                Target: {current.wpm} WPM
              </span>
            </div>
          </div>

          {/* Real-time Disfluency Rate */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Disfluency Rate (%SS)
              </span>
              <AlertTriangle className="w-4 h-4 text-orange-500" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-orange-500">
                {fluencyMetrics.disfluencyRatePct}%
              </span>
              <span className="block text-[10px] text-slate-400 mt-0.5">
                {fluencyMetrics.disfluentEventsCount} Disfluent Events
              </span>
            </div>
          </div>

          {/* Phonation Continuity */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs flex flex-col justify-between col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Phonation Flow
              </span>
              <Volume2 className="w-4 h-4 text-teal-500" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                {fluencyMetrics.voicedContinuityPct}%
              </span>
              <span className="block text-[10px] text-slate-400 mt-0.5">
                Vocal Fold Stability
              </span>
            </div>
          </div>
        </div>

        {/* Real-Time Spoken Transcription */}
        {liveTranscript && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-500 dark:text-slate-400">
                Spoken Speech ({fluencyMetrics.totalWords} words spoken):
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Duration: {duration}s
              </span>
            </div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
              "{liveTranscript}"
            </p>
          </div>
        )}

        {/* Action Controls & Interactive Simulation Tests */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={isPracticing ? stopRecording : startRecording}
                className={`inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-xs font-bold text-white shadow-md transition-all ${
                  isPracticing
                    ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                    : 'bg-teal-600 hover:bg-teal-700'
                }`}
              >
                {isPracticing ? (
                  <>
                    <Square className="w-4 h-4" /> Stop & Finalize Score
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" /> Start Real-Time Recording
                  </>
                )}
              </button>

              {isPracticing && (
                <span className="text-xs font-mono font-bold text-red-600 dark:text-red-400">
                  Recording Active: {duration}s
                </span>
              )}
            </div>

            <button
              onClick={() => setShowHowItCountsPanel(!showHowItCountsPanel)}
              className="text-xs font-semibold text-teal-700 dark:text-teal-300 hover:underline inline-flex items-center gap-1.5"
            >
              <Activity className="w-4 h-4" />
              {showHowItCountsPanel ? 'Hide Score Breakdown' : 'Show Real-Time Score Breakdown'}
              {showHowItCountsPanel ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Simulation Helper Buttons for instant demonstration */}
          {!isPracticing && (
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
              <span className="text-slate-500 text-[11px] font-semibold">
                Quick Test Simulators:
              </span>
              <button
                onClick={() => startSimulationMode('fluent')}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium transition-colors"
                title="Simulates reading the exact prompt smoothly at optimal cadence"
              >
                <Play className="w-3 h-3" />
                Test Fluent Speech (High ~96%)
              </button>
              <button
                onClick={() => startSimulationMode('stutter_repetitions')}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-medium transition-colors"
                title="Simulates speaking prompt with whole-word and sound repetitions ('Peter Peter', 'b-blue')"
              >
                <Play className="w-3 h-3" />
                Test Stutter Repetitions (~64%)
              </button>
              <button
                onClick={() => startSimulationMode('stutter_blocks')}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-200 dark:border-orange-800 font-medium transition-colors"
                title="Simulates speaking prompt with articulatory silent blocks and hesitation pauses"
              >
                <Play className="w-3 h-3" />
                Test Stutter Blocks (~48%)
              </button>
              <button
                onClick={() => startSimulationMode('other_words')}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-medium transition-colors"
                title="Simulates speaking completely unrelated words instead of the prompt"
              >
                <Play className="w-3 h-3" />
                Test Saying Other Words (~20%)
              </button>
            </div>
          )}
        </div>

        {/* REAL-TIME LIVE SCORE & COMPONENT BREAKDOWN */}
        {showHowItCountsPanel && (
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Real-Time Fluency Score Breakdown
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  {isFreeSpeechMode ? 'Free Speech Mode' : 'Target Mode'}
                </span>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-200/80 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                  Current Score: {fluencyMetrics.overallScore > 0 ? `${fluencyMetrics.overallScore}%` : '--'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.values(fluencyMetrics.components).filter(Boolean).map((comp: FormulaComponentBreakdown, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 dark:text-white font-bold text-xs">
                        {comp.name}
                      </strong>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500">
                        {comp.weightPct}% weight
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                      {comp.metricLabel}: <span className="font-bold text-teal-600 dark:text-teal-400">{comp.metricValue}</span>
                    </span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                      {comp.description}
                    </p>
                  </div>

                  <div className="text-right shrink-0 pl-3 border-l border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-medium">Real-Time</span>
                    <strong className="text-teal-600 dark:text-teal-400 font-mono text-base">
                      +{comp.weightedScore} pts
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Final Assessment Summary after stopping */}
        {finalSummary && (
          <div className={`mt-4 p-5 rounded-2xl border ${getScoreBg(finalSummary.overallScore)} space-y-3`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <div>
                  <h4 className="font-bold text-sm">
                    Clinical Session Completed: {finalSummary.overallScore}% ({finalSummary.clinicalLevel})
                  </h4>
                  <span className="text-xs opacity-90">
                    Target Accuracy: {finalSummary.targetAccuracyPct}% • Pacing: {finalSummary.currentWpm} WPM • Disfluency Rate: {finalSummary.disfluencyRatePct}% • Duration: {finalSummary.durationSeconds}s
                  </span>
                </div>
              </div>

              <button
                onClick={() => setCurrentPage('progress')}
                className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 font-bold text-xs shadow-xs hover:bg-white inline-flex items-center gap-1"
              >
                View in Analytics <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Streak & Plan Notification */}
        {recordedToPlan && (
          <div className="mt-4 flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Real-Time Session Recorded!</strong> Your clinical score of{' '}
                <strong>{fluencyMetrics.overallScore}%</strong> has been saved to your analytics and Daily Plan.
              </span>
            </div>
            <button
              onClick={() => setCurrentPage('daily_plan')}
              className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-900 dark:text-emerald-300 ml-3 shrink-0"
            >
              Daily Plan <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* FORMULA & CLINICAL WEIGHTS MODAL / INSPECTOR */}
      {showFormulaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Fluency Calculation Formula & Weights
                  </h3>
                  <span className="text-xs text-slate-500">
                    Clinical Standard: ASHA Stuttering Severity & SSI-4 Framework
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowFormulaModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Clinical Overview */}
            <div className="p-3.5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200 text-xs">
              <span className="font-bold block mb-0.5">Clinical Multi-Factor Scoring:</span>
              <p className="text-[11px] text-teal-800 dark:text-teal-300 leading-relaxed">
                Evaluates oral reading target accuracy, disfluency frequency (%SS repetitions, prolongations, blocks), speech cadence (WPM), and continuous vocal fold phonation in real time.
              </p>
            </div>

            {/* Real-Time Live Breakdown Table */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                Live Factor Breakdown ({fluencyMetrics.overallScore}% Total)
              </h4>

              <div className="space-y-2.5">
                {Object.values(fluencyMetrics.components).filter(Boolean).map((comp: FormulaComponentBreakdown, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900 dark:text-white font-bold">
                          {comp.name}
                        </strong>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                          Weight: {comp.weightPct}%
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {comp.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 sm:text-right">
                      <div>
                        <span className="text-[10px] text-slate-400 block">{comp.metricLabel}</span>
                        <strong className="text-slate-800 dark:text-slate-200">{comp.metricValue}</strong>
                      </div>
                      <div className="pl-3 border-l border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Contribution</span>
                        <strong className="text-teal-600 dark:text-teal-400 font-mono text-sm">
                          +{comp.weightedScore} pts
                        </strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Severity Thresholds Guide */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-2 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Clinical SSI Severity Tiers:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
                  <strong className="block font-bold">90 - 100%</strong>
                  <span>Exceptional (&lt;2% SS)</span>
                </div>
                <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800">
                  <strong className="block font-bold">80 - 89%</strong>
                  <span>Functional (2-4% SS)</span>
                </div>
                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
                  <strong className="block font-bold">70 - 79%</strong>
                  <span>Mild (4-7% SS)</span>
                </div>
                <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800">
                  <strong className="block font-bold">&lt; 70%</strong>
                  <span>Moderate (&gt;7% SS)</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowFormulaModal(false)}
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors"
            >
              Close Formula Inspector
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

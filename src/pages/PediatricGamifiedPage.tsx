import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Star,
  Award,
  Volume2,
  Mic,
  MicOff,
  Smile,
  Heart,
  ChevronRight,
  RotateCcw,
  BookOpen,
  Gamepad2,
  ThumbsUp,
  VolumeX,
  Play
} from 'lucide-react';

export const PediatricGamifiedPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'game' | 'storybook'>('game');
  const [isPlayingGame, setIsPlayingGame] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [starsCollected, setStarsCollected] = useState<number>(0);
  const [smoothStreak, setSmoothStreak] = useState<number>(0);
  const [feedbackPrompt, setFeedbackPrompt] = useState<string>('Press Start and hum or speak gently to make the glider soar!');
  const [praiseCount, setPraiseCount] = useState<number>(3);

  // Audio stream & analysis
  const audioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Game canvas state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const planeYRef = useRef<number>(140);
  const planeVelocityRef = useRef<number>(0);
  const starsRef = useRef<Array<{ x: number; y: number; collected: boolean; radius: number }>>([]);
  const cloudsRef = useRef<Array<{ x: number; y: number; size: number }>>([]);

  // Storybook state
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number>(0);
  const stories = [
    {
      title: "Barnaby Bear's Gentle Morning",
      character: "🐻",
      text: "Barnaby Bear woke up with the gentle morning sun. [breath] He breathed in the cool pine breeze, and said, 'Good morning, sweet forest!' with a soft, easy hum.",
      targetWords: ['Barnaby', 'breathed', 'breeze', 'morning', 'sweet'],
      rewardStar: 3
    },
    {
      title: "Pip the Penguin's Peaceful Slide",
      character: "🐧",
      text: "Pip the Penguin slid down the snowy ice hill. [breath] He let the frosty wind carry him smoothly. 'Wheeee!' Pip whispered softly, sliding all the way to the blue sea.",
      targetWords: ['Pip', 'Penguin', 'peaceful', 'whispered', 'softly'],
      rewardStar: 4
    },
    {
      title: "Daisy the Dragon's Warm Breath",
      character: "🐉",
      text: "Daisy the Dragon learned to breathe gentle warm air like a candle flame. [breath] Instead of a loud roar, she gently hummed, warming the little birds in the tall trees.",
      targetWords: ['Daisy', 'Dragon', 'breathe', 'gentle', 'hummed'],
      rewardStar: 5
    }
  ];

  const startGameAudio = async () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: false,
          autoGainControl: true
        }
      });
      mediaStreamRef.current = stream;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      analyserRef.current = analyser;

      setIsPlayingGame(true);
      setFeedbackPrompt('Fly high with soft, gentle phonation!');

      // Populate game world
      starsRef.current = [
        { x: 300, y: 100, collected: false, radius: 12 },
        { x: 450, y: 150, collected: false, radius: 12 },
        { x: 600, y: 90, collected: false, radius: 12 },
        { x: 750, y: 180, collected: false, radius: 12 },
        { x: 900, y: 120, collected: false, radius: 12 }
      ];

      cloudsRef.current = [
        { x: 100, y: 40, size: 50 },
        { x: 400, y: 70, size: 65 },
        { x: 700, y: 50, size: 55 }
      ];
    } catch (err: any) {
      alert('Microphone access is needed for the Sky Glider game: ' + err.message);
    }
  };

  const stopGameAudio = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    setIsPlayingGame(false);
  };

  useEffect(() => {
    if (!isPlayingGame || !canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const buffer = new Uint8Array(analyserRef.current.frequencyBinCount);

    let localScore = score;
    let localStars = starsCollected;
    let localStreak = smoothStreak;

    const gameLoop = () => {
      animFrameRef.current = requestAnimationFrame(gameLoop);
      if (!analyserRef.current) return;

      analyserRef.current.getByteTimeDomainData(buffer);

      // Measure RMS volume
      let sum = 0;
      for (let i = 0; i < buffer.length; i++) {
        const v = (buffer[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / buffer.length);

      // Physics: Voice volume gives lift
      const plane = { x: 80, y: planeYRef.current };

      if (rms > 0.04) {
        // Voice is active!
        if (rms < 0.35) {
          // Gentle voice = smooth lift!
          planeVelocityRef.current = -3.2;
          localScore += 2;
          localStreak += 1;
          setFeedbackPrompt('✨ Beautiful gentle phonation! Keep gliding smoothly!');
        } else {
          // Too loud / hard attack = slight wobble
          planeVelocityRef.current = -1.0;
          setFeedbackPrompt('💨 Little bit too loud! Soften your voice like a whisper!');
        }
      } else {
        // Gravity pulls down gently
        planeVelocityRef.current = 2.4;
        localStreak = 0;
      }

      // Update plane position
      planeYRef.current = Math.max(30, Math.min(canvas.height - 40, planeYRef.current + planeVelocityRef.current));

      // Clear Canvas with gentle sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGrad.addColorStop(0, '#38bdf8');
      skyGrad.addColorStop(1, '#bae6fd');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Move and draw Clouds
      cloudsRef.current.forEach((cloud) => {
        cloud.x -= 0.8;
        if (cloud.x < -100) cloud.x = canvas.width + 50;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
        ctx.arc(cloud.x + 35, cloud.y - 10, cloud.size * 0.8, 0, Math.PI * 2);
        ctx.arc(cloud.x + 70, cloud.y, cloud.size * 0.9, 0, Math.PI * 2);
        ctx.fill();
      });

      // Move and draw Stars
      starsRef.current.forEach((star) => {
        star.x -= 2.2;
        if (star.x < -30) {
          star.x = canvas.width + Math.random() * 200;
          star.y = 50 + Math.random() * (canvas.height - 120);
          star.collected = false;
        }

        if (!star.collected) {
          // Check collision with plane
          const dx = star.x - plane.x;
          const dy = star.y - planeYRef.current;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 32) {
            star.collected = true;
            localStars += 1;
            localScore += 50;
            setStarsCollected(localStars);
            try {
              confetti({
                particleCount: 20,
                spread: 45,
                origin: { x: 0.25, y: 0.5 }
              });
            } catch (e) {}
          }

          // Draw Glowing Star
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw Friendly Cartoon Plane / Glider
      const pY = planeYRef.current;
      ctx.save();
      ctx.translate(plane.x, pY);

      // Fuselage
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.ellipse(0, 0, 24, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Wing
      ctx.fillStyle = '#fb7185';
      ctx.beginPath();
      ctx.moveTo(-6, -4);
      ctx.lineTo(8, -18);
      ctx.lineTo(16, -4);
      ctx.closePath();
      ctx.fill();

      // Window & Smile
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(10, -2, 5, 0, Math.PI * 2);
      ctx.fill();

      // Jet stream trails if voice active
      if (rms > 0.04) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(-26, 0, 4 + rms * 15, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      setScore(localScore);
      setSmoothStreak(localStreak);
    };

    gameLoop();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlayingGame]);

  useEffect(() => {
    return () => {
      stopGameAudio();
    };
  }, []);

  const handleParentPraise = (praiseText: string) => {
    setPraiseCount((prev) => prev + 1);
    setScore((prev) => prev + 25);
    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { x: 0.5, y: 0.6 }
      });
    } catch (e) {}
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 rounded-3xl p-6 text-white shadow-lg">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Pediatric Fluency Playground
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Fluency Hero: Kids Speech Adventure
          </h1>
          <p className="text-xs sm:text-sm text-white/90 max-w-xl">
            Gamified speech motor training based on the Lidcombe positive-reinforcement model.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 bg-black/20 p-1 rounded-2xl self-start sm:self-auto backdrop-blur-xs">
          <button
            onClick={() => setActiveTab('game')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'game' ? 'bg-white text-indigo-700 shadow-md' : 'text-white/80 hover:text-white'
            }`}
          >
            <Gamepad2 className="w-4 h-4" /> Sky Glider Game
          </button>
          <button
            onClick={() => {
              if (isPlayingGame) stopGameAudio();
              setActiveTab('storybook');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'storybook' ? 'bg-white text-indigo-700 shadow-md' : 'text-white/80 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Storybook Mode
          </button>
        </div>
      </div>

      {activeTab === 'game' ? (
        /* GAME MODE */
        <div className="space-y-4">
          {/* Game Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-xs">
              <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600">
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Stars</span>
                <p className="text-lg font-extrabold text-slate-900 dark:text-white">{starsCollected}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-xs">
              <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Score</span>
                <p className="text-lg font-extrabold text-slate-900 dark:text-white">{score}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-xs">
              <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
                <Smile className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Smooth Streak</span>
                <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{smoothStreak} pts</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-xs">
              <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600">
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Praise Badges</span>
                <p className="text-lg font-extrabold text-rose-600 dark:text-rose-400">{praiseCount}</p>
              </div>
            </div>
          </div>

          {/* Canvas Viewport */}
          <div className="relative rounded-3xl overflow-hidden border-4 border-amber-300 dark:border-amber-600/60 shadow-xl bg-sky-200">
            <canvas
              ref={canvasRef}
              width={800}
              height={320}
              className="w-full h-72 sm:h-80 block"
            />

            {/* In-Game Overlay Controls */}
            {!isPlayingGame && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center shadow-lg animate-bounce">
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </div>
                <h2 className="text-xl font-black">Ready to Pilot the Sky Glider?</h2>
                <p className="text-xs max-w-md text-slate-200">
                  Speak or hum gently into your microphone. Soft, smooth voice makes your plane fly up to collect stars!
                </p>
                <button
                  onClick={startGameAudio}
                  className="px-6 py-2.5 rounded-2xl bg-teal-500 hover:bg-teal-600 font-extrabold text-white shadow-lg transition-transform hover:scale-105"
                >
                  Start Flying Now
                </button>
              </div>
            )}

            {isPlayingGame && (
              <div className="absolute top-3 right-3">
                <button
                  onClick={stopGameAudio}
                  className="px-3.5 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-xs text-white text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <VolumeX className="w-3.5 h-3.5" /> Stop Flight
                </button>
              </div>
            )}

            {/* Coach Speech Bubble at bottom */}
            <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border border-amber-200 dark:border-slate-700 flex items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="text-2xl">🦸</div>
                <div>
                  <span className="text-[10px] font-bold text-amber-600 uppercase">Fluency Coach:</span>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{feedbackPrompt}</p>
                </div>
              </div>
              {isPlayingGame && (
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  <Mic className="w-3.5 h-3.5 animate-pulse" /> Listening
                </div>
              )}
            </div>
          </div>

          {/* Lidcombe Praise Station for Parents & Clinicians */}
          <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-rose-900 dark:text-rose-200 uppercase tracking-wider flex items-center gap-1.5">
                <ThumbsUp className="w-4 h-4 text-rose-600" /> Parent & Therapist Praise Station (Lidcombe Reinforcement)
              </span>
              <span className="text-[11px] text-rose-700 dark:text-rose-300">
                Click to reward your child when they speak smoothly!
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                '🌟 "That was so smooth!"',
                '🦋 "I loved that gentle onset!"',
                '🐻 "Super soft easy start!"',
                '🎉 "Way to keep the words flowing!"'
              ].map((praise, idx) => (
                <button
                  key={idx}
                  onClick={() => handleParentPraise(praise)}
                  className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-transform active:scale-95 shadow-xs"
                >
                  {praise}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* STORYBOOK MODE */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {stories.map((st, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStoryIndex(idx)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  currentStoryIndex === idx
                    ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 ring-2 ring-indigo-500'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="text-3xl mb-1">{st.character}</div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{st.title}</h3>
                <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1 block">
                  Reward: +{st.rewardStar} Stars
                </span>
              </button>
            ))}
          </div>

          {/* Story Reading Canvas */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6 text-center">
            <div className="text-6xl animate-pulse">
              {stories[currentStoryIndex].character}
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {stories[currentStoryIndex].title}
            </h2>

            <div className="font-serif text-lg sm:text-xl leading-loose max-w-2xl mx-auto p-4 rounded-2xl bg-amber-50/60 dark:bg-slate-800/60 border border-amber-200 dark:border-slate-700 text-slate-800 dark:text-slate-100">
              {stories[currentStoryIndex].text.split(/(\[breath\])/).map((segment, idx) => {
                if (segment === '[breath]') {
                  return (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 mx-2 px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 text-xs font-bold font-sans align-middle"
                    >
                      💨 Soft Breath
                    </span>
                  );
                }
                return <span key={idx}>{segment}</span>;
              })}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="text-xs font-bold text-slate-400 uppercase mr-2">Target Easy Words:</span>
              {stories[currentStoryIndex].targetWords.map((word, wIdx) => (
                <span
                  key={wIdx}
                  className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs"
                >
                  ★ {word}
                </span>
              ))}
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={() => {
                  setStarsCollected((prev) => prev + stories[currentStoryIndex].rewardStar);
                  setScore((prev) => prev + 100);
                  try {
                    confetti({
                      particleCount: 50,
                      spread: 80,
                      origin: { x: 0.5, y: 0.6 }
                    });
                  } catch (e) {}
                }}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-transform hover:scale-105 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Finished Reading! Claim Stars
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { useAuth } from '../context/AuthContext';
import { ChatMessage } from '../types';
import {
  MessageSquareHeart,
  Send,
  Sparkles,
  Bot,
  User,
  Coffee,
  PhoneCall,
  Presentation,
  Volume2,
  VolumeX,
  Copy,
  Check,
  RotateCcw,
  Mic,
  MicOff,
  Wind,
  ShieldCheck,
  GraduationCap,
  Theater,
  HelpCircle,
  Sparkle
} from 'lucide-react';
import { DisclaimerNotice } from '../components/common/DisclaimerNotice';

type ChatMode = 'general' | 'roleplay' | 'technique' | 'anxiety';

interface PromptChip {
  label: string;
  query: string;
  icon: React.ComponentType<{ className?: string }>;
  mode: ChatMode;
}

export const AICounsellingPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      content: `Hello **${user?.fullName || 'Alex'}**! I am your **FluencyAI Clinical Companion**, powered directly by **Gemini AI**.

Here to support you with:
- 🎯 **Technique Mastery:** Physical mechanics for **Gentle Onset**, **Light Contact**, **Continuous Phonation**, and **Pull-Outs**.
- 🎭 **Interactive Roleplay:** Simulated practice ordering coffee, answering phone calls, or job interviews.
- 🫁 **Speech Anxiety & CBT:** Calming anticipatory blocks and fear of negative evaluation.

Choose a mode or prompt below, or ask any question to get started!`,
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<ChatMode>('general');
  const [showBreathingGuide, setShowBreathingGuide] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [breathingSeconds, setBreathingSeconds] = useState(4);
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Check Web Speech API support
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = true;
      recog.lang = 'en-US';

      recog.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((res: any) => res[0].transcript)
          .join('');
        setInput(transcript);
      };

      recog.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recog;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Breathing Visualizer Loop
  useEffect(() => {
    if (!showBreathingGuide) return;

    const interval = setInterval(() => {
      setBreathingSeconds((prev) => {
        if (prev <= 1) {
          setBreathingPhase((phase) => {
            switch (phase) {
              case 'inhale':
                return 'hold';
              case 'hold':
                return 'exhale';
              case 'exhale':
                return 'pause';
              case 'pause':
                return 'inhale';
            }
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showBreathingGuide]);

  const toggleMic = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Cannot start recognition:', err);
        setIsListening(false);
      }
    }
  };

  const handleSpeak = (messageId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Strip markdown formatting for cleaner audio speech
    const cleanText = text
      .replace(/[*#_`~]/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/<[^>]*>/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.92; // slightly slower, calming pace
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(messageId);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear this conversation?')) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setMessages([
        {
          id: `msg-welcome-${Date.now()}`,
          sender: 'assistant',
          content: `New conversation started in **${activeMode.toUpperCase()}** mode. How can I support your speech journey today?`,
          timestamp: 'Just now'
        }
      ]);
    }
  };

  const handleSend = async (overrideText?: string, overrideMode?: ChatMode) => {
    const textToSend = (overrideText || input).trim();
    if (!textToSend || isLoading) return;

    const mode = overrideMode || activeMode;

    const userMessage: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update messages with user query immediately
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Send conversation history to backend Gemini 3.8 Flash
      const historyPayload = updatedMessages.slice(-8).map((m) => ({
        sender: m.sender,
        content: m.content
      }));

      const res = await fetch('/api/ai/counsel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload,
          mode
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const replyContent = data.reply || 'Take a calm breath. Focus on your airflow and speak at your own pace.';

      const assistantMessage: ChatMessage = {
        id: `msg-assistant-${Date.now()}`,
        sender: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Error fetching counsel:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'assistant',
          content:
            "I'm here with you. Take a soft, gentle breath, relax your articulators, and try again. When speaking, allow your vocal cords to start effortlessly with an **Easy Onset**.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Curated prompts tailored by mode
  const scenarioPrompts: Record<ChatMode, PromptChip[]> = {
    general: [
      {
        label: 'Why do I block more on my own name?',
        query: 'Why do I experience more severe speech blocks when stating my own name, and how can I ease through it?',
        icon: HelpCircle,
        mode: 'general'
      },
      {
        label: 'Explain stuttering to colleagues',
        query: 'How can I comfortably disclose or explain my stutter to new coworkers or team members without feeling awkward?',
        icon: Sparkle,
        mode: 'general'
      },
      {
        label: 'Diaphragmatic breathing for speech',
        query: 'How does diaphragmatic abdominal breathing physically prevent vocal cord clamping during speech?',
        icon: Wind,
        mode: 'general'
      }
    ],
    roleplay: [
      {
        label: 'Order coffee at busy counter',
        query: "Let's roleplay! You are a barista at a busy cafe counter, and I am ordering a hot latte. Please initiate the dialogue.",
        icon: Coffee,
        mode: 'roleplay'
      },
      {
        label: 'Answer unexpected phone call',
        query: "Let's simulate an unexpected phone call from a client or delivery driver. Ring me and let's practice opening greetings.",
        icon: PhoneCall,
        mode: 'roleplay'
      },
      {
        label: 'Job interview: "Tell me about yourself"',
        query: "Let's roleplay a job interview. You are the hiring manager asking: 'Can you introduce yourself and your background?' Coach me as we converse.",
        icon: Presentation,
        mode: 'roleplay'
      }
    ],
    technique: [
      {
        label: 'Gentle Onset on Plosives (/p/, /t/, /k/)',
        query: 'How do I perform a Gentle Phonatory Onset (Easy Start) on voiceless plosives like P, T, and K without blocking?',
        icon: GraduationCap,
        mode: 'technique'
      },
      {
        label: 'Van Riper Pull-Out vs Cancellation',
        query: 'Explain the exact physical mechanics of a Van Riper Pull-Out versus a Cancellation, with word examples.',
        icon: ShieldCheck,
        mode: 'technique'
      },
      {
        label: 'Continuous Phonation technique',
        query: 'How does Continuous Phonation work across multi-word sentences, and what practice exercises can I do today?',
        icon: Sparkles,
        mode: 'technique'
      }
    ],
    anxiety: [
      {
        label: 'Anticipatory panic before meeting',
        query: "I have an important team presentation in 15 minutes and my chest feels tight with anticipatory block fear. Help me calm down and reframe.",
        icon: Wind,
        mode: 'anxiety'
      },
      {
        label: 'When someone tries to finish my words',
        query: "How should I mentally and verbally handle listeners who try to finish my sentences or look uncomfortable when I stutter?",
        icon: HelpCircle,
        mode: 'anxiety'
      },
      {
        label: 'De-catastrophizing fear of stuttering',
        query: "Help me challenge the belief that stuttering makes people think I am incompetent or anxious. Give me cognitive reframing prompts.",
        icon: ShieldCheck,
        mode: 'anxiety'
      }
    ]
  };

  const modeDescriptions: Record<ChatMode, { title: string; desc: string; icon: React.ComponentType<{ className?: string }> }> = {
    general: {
      title: 'Fluency & Mindset Companion',
      desc: 'Evidence-based Speech Pathology guidance, confidence building, and personalized answers.',
      icon: MessageSquareHeart
    },
    roleplay: {
      title: 'Conversational Roleplay Lab',
      desc: 'Simulate high-stakes speaking scenarios (cafes, phone calls, interviews) with live in-character coaching.',
      icon: Theater
    },
    technique: {
      title: 'Motor Technique Coaching',
      desc: 'Step-by-step physical mechanics: Gentle Onset, Light Articulatory Contacts, Pull-outs, and Pausing.',
      icon: GraduationCap
    },
    anxiety: {
      title: 'Speech Anxiety & CBT Reframing',
      desc: 'Immediate physiological desensitization, de-catastrophizing panic, and pre-speech calm resets.',
      icon: Wind
    }
  };

  const activeModeInfo = modeDescriptions[activeMode];
  const ActiveModeIcon = activeModeInfo.icon;

  return (
    <div className="mx-auto max-w-4xl space-y-5 pb-16">
      {/* Top Header Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400 border border-teal-100 dark:border-teal-900/50">
              <ActiveModeIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {activeModeInfo.title}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Gemini AI
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {activeModeInfo.desc}
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={() => setShowBreathingGuide((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                showBreathingGuide
                  ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
              title="Toggle diaphragmatic calming visualizer"
            >
              <Wind className="w-3.5 h-3.5 text-teal-500" />
              <span>{showBreathingGuide ? 'Hide Breathing' : 'Calm Breathing'}</span>
            </button>

            <button
              onClick={handleClearChat}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              title="Clear chat and start fresh"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-2">
          {(
            [
              { key: 'general', label: 'Fluency & Mindset', icon: MessageSquareHeart },
              { key: 'roleplay', label: 'Speaking Roleplay', icon: Theater },
              { key: 'technique', label: 'Technique Coach', icon: GraduationCap },
              { key: 'anxiety', label: 'Anxiety Reset', icon: Wind }
            ] as const
          ).map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeMode === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveMode(tab.key);
                }}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-xs font-semibold'
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/70 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                <TabIcon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Diaphragmatic Breathing Guide (Expandable) */}
      {showBreathingGuide && (
        <div className="rounded-3xl border border-teal-200 bg-gradient-to-b from-teal-50/70 to-emerald-50/40 p-6 text-center dark:border-teal-900/60 dark:from-teal-950/30 dark:to-slate-900 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="max-w-md mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
              <Wind className="w-4 h-4 text-teal-600 animate-spin" />
              4-4-4 Box Relaxation Protocol
            </div>

            {/* Visual breathing orb */}
            <div className="relative mx-auto my-4 w-32 h-32 flex items-center justify-center">
              <div
                className={`absolute inset-0 rounded-full border-2 border-teal-500/40 bg-teal-400/20 dark:bg-teal-500/10 transition-all duration-1000 ${
                  breathingPhase === 'inhale'
                    ? 'scale-125 opacity-100 bg-teal-400/30'
                    : breathingPhase === 'hold'
                    ? 'scale-120 opacity-90'
                    : breathingPhase === 'exhale'
                    ? 'scale-85 opacity-70'
                    : 'scale-90 opacity-60'
                }`}
              />
              <div className="relative z-10 text-center">
                <span className="text-3xl font-extrabold text-teal-900 dark:text-teal-100 font-display">
                  {breathingSeconds}s
                </span>
                <p className="text-xs font-semibold capitalize text-teal-700 dark:text-teal-300 tracking-wide mt-0.5">
                  {breathingPhase === 'inhale' && 'Inhale deeply'}
                  {breathingPhase === 'hold' && 'Hold gently'}
                  {breathingPhase === 'exhale' && 'Smooth exhale'}
                  {breathingPhase === 'pause' && 'Relaxed pause'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs mx-auto leading-relaxed">
              Drop tension from your jaw and throat. Let your belly expand naturally before beginning speech.
            </p>
          </div>
        </div>
      )}

      <DisclaimerNotice compact />

      {/* Mode-Specific Quick Scenario Prompts */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <span>Suggested prompts for {activeModeInfo.title}:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {scenarioPrompts[activeMode].map((p, idx) => {
            const Icon = p.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSend(p.query, p.mode)}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:border-teal-500 hover:text-teal-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-teal-600 dark:hover:text-teal-400 transition-all shadow-2xs text-left"
              >
                <Icon className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm flex flex-col min-h-[480px]">
        {/* Scrollable messages log */}
        <div className="flex-1 p-4 sm:p-6 space-y-5 overflow-y-auto max-h-[560px]">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            const isAssistant = m.sender === 'assistant';

            return (
              <div
                key={m.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar Icon */}
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 text-xs font-bold shadow-2xs ${
                    isUser
                      ? 'bg-teal-600 text-white'
                      : 'bg-indigo-600 text-white'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-xl sm:max-w-2xl rounded-2xl p-4 sm:p-5 text-slate-800 dark:text-slate-100 text-xs sm:text-sm leading-relaxed transition-colors ${
                    isUser
                      ? 'bg-teal-600 text-white rounded-tr-xs'
                      : 'bg-slate-50 border border-slate-200/80 dark:bg-slate-800/80 dark:border-slate-700/60 rounded-tl-xs'
                  }`}
                >
                  {/* Sender title & timestamp */}
                  <div
                    className={`flex items-center justify-between gap-3 mb-2 text-2xs font-semibold ${
                      isUser ? 'text-teal-100' : 'text-slate-400 dark:text-slate-400'
                    }`}
                  >
                    <span>{isUser ? user?.fullName || 'You' : 'FluencyAI SLP Companion'}</span>
                    <span>{m.timestamp}</span>
                  </div>

                  {/* Body Content with React Markdown */}
                  <div className={`prose prose-xs sm:prose-sm max-w-none break-words ${isUser ? 'prose-invert text-white' : 'dark:prose-invert'}`}>
                    <Markdown>{m.content}</Markdown>
                  </div>

                  {/* Assistant Message Actions (TTS & Copy) */}
                  {isAssistant && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <button
                        onClick={() => handleSpeak(m.id, m.content)}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-2xs hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
                        title={speakingMessageId === m.id ? 'Stop audio' : 'Listen to clinical response'}
                      >
                        {speakingMessageId === m.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                            <span className="text-rose-600 font-semibold">Stop Audio</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                            <span>Read Aloud</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleCopy(m.id, m.content)}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-2xs hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
                        title="Copy text"
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-teal-600" />
                            <span className="text-teal-600 font-semibold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 dark:bg-slate-800/80 dark:border-slate-700 rounded-tl-xs flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex gap-1 items-center">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
                <span>Gemini AI is analyzing speech mechanics...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Input Area */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 rounded-b-3xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-end gap-2"
          >
            {/* Speech-To-Text Microphone Practice */}
            {speechSupported && (
              <button
                type="button"
                onClick={toggleMic}
                className={`p-3 rounded-2xl border transition-all ${
                  isListening
                    ? 'border-rose-500 bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-300 animate-pulse'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
                title={isListening ? 'Stop listening' : 'Practice speaking aloud with microphone speech-to-text'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}

            {/* Input textarea/field */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  activeMode === 'roleplay'
                    ? 'Type your dialogue line or scenario response...'
                    : activeMode === 'technique'
                    ? 'Ask about vocal onset, pull-outs, light contacts...'
                    : activeMode === 'anxiety'
                    ? 'Share what is making you feel anxious or blocked...'
                    : 'Ask about fluency techniques, stuttering advice, or speech practice...'
                }
                disabled={isLoading}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 shadow-2xs"
              />
              {isListening && (
                <div className="absolute right-3 top-3 flex items-center gap-1.5 text-2xs text-rose-500 font-semibold animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Listening to your voice...
                </div>
              )}
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="rounded-2xl bg-teal-600 p-3 text-white hover:bg-teal-700 disabled:opacity-40 transition-colors shadow-xs shrink-0 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
              title="Send to Gemini AI"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-2.5 flex items-center justify-between text-2xs text-slate-400 dark:text-slate-500 px-1">
            <span>Gemini AI Speech Reasoning • Clinical Speech Pathology Companion</span>
            <span>Press Enter to send</span>
          </div>
        </div>
      </div>
    </div>
  );
};

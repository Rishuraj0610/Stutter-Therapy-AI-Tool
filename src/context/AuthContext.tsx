import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AppTheme, FontSize, DailyTask, PracticeSession } from '../types';

export interface NewDailyTaskInput {
  title: string;
  category: string;
  durationMinutes: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  description: string;
  targetRoute?: string;
}

interface AuthContextType {
  user: User | null;
  role: UserRole;
  token: string | null;
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
  appTheme: AppTheme;
  fontSize: FontSize;
  currentPage: string;
  streakDays: number;
  lastPracticeDate: string;
  dailyTasks: DailyTask[];
  currentTime: Date;
  practiceSessions: PracticeSession[];
  toggleTheme: () => void;
  setAppTheme: (theme: AppTheme) => void;
  setFontSize: (size: FontSize) => void;
  setCurrentPage: (page: string) => void;
  setStreakDays: (days: number) => void;
  toggleDailyTask: (taskId: string) => void;
  completeDailyTask: (taskId: string) => void;
  addDailyTask: (task: NewDailyTaskInput) => void;
  resetDailyPlan: () => void;
  recordPracticeSessionCompleted: (exerciseTitle?: string, sessionMetrics?: Partial<PracticeSession>) => void;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  register: (email: string, fullName: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  switchDemoRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INITIAL_DAILY_TASKS: DailyTask[] = [
  {
    id: 'dt-1',
    timeOfDay: 'morning',
    title: '5-Minute Diaphragmatic Breath Anchor',
    category: 'Respiratory Mechanics',
    durationMinutes: 5,
    completed: true,
    completedAt: '08:15 AM',
    exerciseId: 'breath-1',
    targetRoute: 'speech_practice',
    description: 'Anchor nervous system with gentle diaphragmatic expansion and slow nasal inhalation.'
  },
  {
    id: 'dt-2',
    timeOfDay: 'afternoon',
    title: 'Rainbow Passage Acoustic ML Spectrogram',
    category: 'Acoustic ML',
    durationMinutes: 7,
    completed: false,
    exerciseId: 'ml-rainbow',
    targetRoute: 'ml_speech',
    description: 'Record standard phonation passage with real-time formant and pitch tracking.'
  },
  {
    id: 'dt-3',
    timeOfDay: 'afternoon',
    title: 'Continuous Phonation & Easy Onset Drill',
    category: 'Motor Speech',
    durationMinutes: 10,
    completed: false,
    exerciseId: 'speech-flow',
    targetRoute: 'speech_practice',
    description: 'Maintain soft vocal fold vibration across word boundaries without hard glottal attacks.'
  },
  {
    id: 'dt-4',
    timeOfDay: 'evening',
    title: 'Speech Anxiety & Self-Talk Check-in',
    category: 'Cognitive Behavioral',
    durationMinutes: 5,
    completed: false,
    exerciseId: 'cbt-1',
    targetRoute: 'ai_counselling',
    description: 'Reflective chat with AI Speech Counsellor targeting anticipatory speaking tension.'
  }
];

const DEMO_PATIENT: User = {
  id: 'usr-patient-1',
  email: 'alex.patient@fluencyai.org',
  fullName: 'Alex Johnson',
  role: 'patient',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  preferredTheme: 'teal',
  fontSize: 'normal',
  baselineDisfluencyRate: 8.4,
  streakDays: 5
};

const DEMO_THERAPIST: User = {
  id: 'usr-dr-marcus',
  email: 'marcus.vance@speechclinic.org',
  fullName: 'Dr. Marcus Vance, CCC-SLP',
  role: 'therapist',
  avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
  credentials: 'Ph.D., CCC-SLP, BCS-F',
  specialization: 'Fluency Disorders & Neurogenic Stuttering',
  clinicName: 'Stuttering & Neuro-Fluency Institute',
  preferredTheme: 'teal',
  fontSize: 'normal'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('fluency_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* noop */ }
    }
    return DEMO_PATIENT;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('fluency_token') || 'demo-jwt-token-patient';
  });

  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const [appTheme, setAppThemeState] = useState<AppTheme>(() => {
    return (localStorage.getItem('fluency_app_theme') as AppTheme) || 'teal';
  });

  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    return (localStorage.getItem('fluency_font_size') as FontSize) || 'normal';
  });

  const [currentPage, setCurrentPage] = useState<string>('dashboard');

  // Real-time Streak and Practice tracking
  const [streakDays, setStreakDaysState] = useState<number>(() => {
    const saved = localStorage.getItem('fluency_streak_v2');
    if (saved) {
      const num = parseInt(saved, 10);
      if (!isNaN(num)) return num;
    }
    return 5;
  });

  const [lastPracticeDate, setLastPracticeDate] = useState<string>(() => {
    return localStorage.getItem('fluency_last_practice_date_v2') || '';
  });

  // Real-time Daily Tasks
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>(() => {
    const saved = localStorage.getItem('fluency_daily_tasks_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { /* noop */ }
    }
    return INITIAL_DAILY_TASKS;
  });

  // Real-time clock updated every second
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Practice Sessions history with real clinical metrics
  const [practiceSessions, setPracticeSessions] = useState<PracticeSession[]>(() => {
    const saved = localStorage.getItem('fluency_practice_sessions_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      {
        id: 'sess-1',
        userId: 'usr-patient-1',
        exerciseId: 'grand-1',
        exerciseTitle: 'Grandfather Passage - ML Speech Lab',
        recordedAt: 'Today, 2:15 PM',
        durationSeconds: 42,
        fluencyScore: 86.4,
        wpm: 142,
        disfluencyRate: 4.2,
        repetitionsCount: 2,
        prolongationsCount: 1,
        blocksCount: 1,
        transcription: 'You wish to know all about my grandfather...'
      },
      {
        id: 'sess-2',
        userId: 'usr-patient-1',
        exerciseId: 'gentle-1',
        exerciseTitle: 'Gentle Onset - Easy Starts',
        recordedAt: 'Yesterday, 6:30 PM',
        durationSeconds: 35,
        fluencyScore: 84.0,
        wpm: 135,
        disfluencyRate: 4.9,
        repetitionsCount: 2,
        prolongationsCount: 2,
        blocksCount: 0,
        transcription: 'Peter opened the blue umbrella before the sudden rain began.'
      },
      {
        id: 'sess-3',
        userId: 'usr-patient-1',
        exerciseId: 'flow-1',
        exerciseTitle: 'Continuous Phonation Drills',
        recordedAt: 'Sep 1, 9:10 AM',
        durationSeconds: 50,
        fluencyScore: 81.2,
        wpm: 128,
        disfluencyRate: 5.8,
        repetitionsCount: 3,
        prolongationsCount: 2,
        blocksCount: 1,
        transcription: 'Every morning brings a quiet calm that slowly warms the valley.'
      },
      {
        id: 'sess-4',
        userId: 'usr-patient-1',
        exerciseId: 'diaph-1',
        exerciseTitle: 'Diaphragmatic Breath Cycles',
        recordedAt: 'Aug 30, 4:45 PM',
        durationSeconds: 60,
        fluencyScore: 89.1,
        wpm: 122,
        disfluencyRate: 3.4,
        repetitionsCount: 1,
        prolongationsCount: 1,
        blocksCount: 0,
        transcription: 'Breathe in slowly through the nose, feel the belly expand.'
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('fluency_practice_sessions_v2', JSON.stringify(practiceSessions));
    } catch (e) {}
  }, [practiceSessions]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Save daily tasks whenever updated
  useEffect(() => {
    localStorage.setItem('fluency_daily_tasks_v2', JSON.stringify(dailyTasks));
  }, [dailyTasks]);

  // Save streak whenever updated
  useEffect(() => {
    localStorage.setItem('fluency_streak_v2', streakDays.toString());
  }, [streakDays]);

  useEffect(() => {
    if (lastPracticeDate) {
      localStorage.setItem('fluency_last_practice_date_v2', lastPracticeDate);
    }
  }, [lastPracticeDate]);

  const setStreakDays = (days: number) => {
    setStreakDaysState(days);
  };

  const getTodayDateString = () => new Date().toISOString().split('T')[0];

  // Helper to advance streak if user practiced today
  const creditStreakForToday = () => {
    const today = getTodayDateString();
    if (lastPracticeDate !== today) {
      setStreakDaysState((prev) => prev + 1);
      setLastPracticeDate(today);
    }
  };

  // Toggle or complete a task in real time
  const toggleDailyTask = (taskId: string) => {
    setDailyTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const willBeDone = !t.completed;
          if (willBeDone) {
            creditStreakForToday();
          }
          return {
            ...t,
            completed: willBeDone,
            completedAt: willBeDone
              ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : undefined
          };
        }
        return t;
      })
    );
  };

  const completeDailyTask = (taskId: string) => {
    creditStreakForToday();
    setDailyTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              completed: true,
              completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          : t
      )
    );
  };

  const addDailyTask = (input: NewDailyTaskInput) => {
    const newTask: DailyTask = {
      id: `dt-${Date.now()}`,
      timeOfDay: input.timeOfDay,
      title: input.title,
      category: input.category,
      durationMinutes: input.durationMinutes,
      completed: false,
      exerciseId: `custom-${Date.now()}`,
      targetRoute: input.targetRoute || 'speech_practice',
      description: input.description
    };
    setDailyTasks((prev) => [...prev, newTask]);
  };

  const resetDailyPlan = () => {
    setDailyTasks(
      INITIAL_DAILY_TASKS.map((t) => ({
        ...t,
        completed: false,
        completedAt: undefined
      }))
    );
  };

  // Automatically credit practice session
  const recordPracticeSessionCompleted = (
    exerciseTitle?: string,
    sessionMetrics?: Partial<PracticeSession>
  ) => {
    creditStreakForToday();

    // Create persistent recorded practice session
    const now = new Date();
    const timeFormatted = `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const newSession: PracticeSession = {
      id: `sess-${Date.now()}`,
      userId: user?.id || 'usr-patient-1',
      exerciseId: `ex-${Date.now()}`,
      exerciseTitle: exerciseTitle || 'Clinical Speech Drill',
      recordedAt: timeFormatted,
      durationSeconds: sessionMetrics?.durationSeconds || 30,
      fluencyScore: sessionMetrics?.fluencyScore !== undefined ? Math.round(sessionMetrics.fluencyScore * 10) / 10 : 85.0,
      wpm: sessionMetrics?.wpm !== undefined ? Math.round(sessionMetrics.wpm) : 130,
      disfluencyRate: sessionMetrics?.disfluencyRate !== undefined ? Math.round(sessionMetrics.disfluencyRate * 10) / 10 : 3.8,
      repetitionsCount: sessionMetrics?.repetitionsCount ?? 0,
      prolongationsCount: sessionMetrics?.prolongationsCount ?? 0,
      blocksCount: sessionMetrics?.blocksCount ?? 0,
      transcription: sessionMetrics?.transcription
    };

    setPracticeSessions((prev) => [newSession, ...prev]);

    setDailyTasks((prev) => {
      // Find matching uncompleted task or first uncompleted task
      let matchedIndex = -1;
      if (exerciseTitle) {
        matchedIndex = prev.findIndex(
          (t) => !t.completed && (t.title.toLowerCase().includes(exerciseTitle.toLowerCase()) || exerciseTitle.toLowerCase().includes(t.title.toLowerCase()))
        );
      }
      if (matchedIndex === -1) {
        matchedIndex = prev.findIndex((t) => !t.completed);
      }

      if (matchedIndex !== -1) {
        return prev.map((t, idx) =>
          idx === matchedIndex
            ? {
                ...t,
                completed: true,
                completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            : t
        );
      }
      return prev;
    });
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('fluency_dark_theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', appTheme);
    localStorage.setItem('fluency_app_theme', appTheme);
  }, [appTheme]);

  useEffect(() => {
    if (fontSize === 'large') {
      document.documentElement.classList.add('text-lg-mode');
    } else {
      document.documentElement.classList.remove('text-lg-mode');
    }
    localStorage.setItem('fluency_font_size', fontSize);
  }, [fontSize]);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      const root = document.documentElement;
      if (next === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      try {
        localStorage.setItem('fluency_dark_theme', next);
      } catch (e) {}
      return next;
    });
  };

  const setAppTheme = (t: AppTheme) => {
    setAppThemeState(t);
  };

  const setFontSize = (s: FontSize) => {
    setFontSizeState(s);
  };

  const login = async (email: string, role: UserRole = 'patient'): Promise<boolean> => {
    const selectedUser = role === 'therapist' ? { ...DEMO_THERAPIST, email } : { ...DEMO_PATIENT, email };
    setUser(selectedUser);
    const mockToken = role === 'therapist' ? 'demo-jwt-token-therapist' : 'demo-jwt-token-patient';
    setToken(mockToken);
    localStorage.setItem('fluency_user', JSON.stringify(selectedUser));
    localStorage.setItem('fluency_token', mockToken);
    setCurrentPage(role === 'therapist' ? 'admin' : 'dashboard');
    return true;
  };

  const register = async (email: string, fullName: string, role: UserRole): Promise<boolean> => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      email,
      fullName,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName}`,
      preferredTheme: appTheme,
      fontSize: fontSize,
      streakDays: 1
    };
    setUser(newUser);
    const mockToken = role === 'therapist' ? 'demo-jwt-token-therapist' : 'demo-jwt-token-patient';
    setToken(mockToken);
    localStorage.setItem('fluency_user', JSON.stringify(newUser));
    localStorage.setItem('fluency_token', mockToken);
    setCurrentPage(role === 'therapist' ? 'admin' : 'dashboard');
    return true;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('fluency_user');
    localStorage.removeItem('fluency_token');
    setCurrentPage('landing');
  };

  const switchDemoRole = (targetRole: UserRole) => {
    if (targetRole === 'therapist') {
      setUser(DEMO_THERAPIST);
      setToken('demo-jwt-token-therapist');
      localStorage.setItem('fluency_user', JSON.stringify(DEMO_THERAPIST));
      localStorage.setItem('fluency_token', 'demo-jwt-token-therapist');
      setCurrentPage('admin');
    } else {
      setUser(DEMO_PATIENT);
      setToken('demo-jwt-token-patient');
      localStorage.setItem('fluency_user', JSON.stringify(DEMO_PATIENT));
      localStorage.setItem('fluency_token', 'demo-jwt-token-patient');
      setCurrentPage('dashboard');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'patient',
        token,
        isAuthenticated: !!user,
        theme,
        appTheme,
        fontSize,
        currentPage,
        streakDays,
        lastPracticeDate,
        dailyTasks,
        currentTime,
        practiceSessions,
        toggleTheme,
        setAppTheme,
        setFontSize,
        setCurrentPage,
        setStreakDays,
        toggleDailyTask,
        completeDailyTask,
        addDailyTask,
        resetDailyPlan,
        recordPracticeSessionCompleted,
        login,
        register,
        logout,
        switchDemoRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

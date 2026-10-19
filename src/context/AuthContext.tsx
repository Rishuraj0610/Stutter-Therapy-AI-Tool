import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { User, UserRole, AppTheme, FontSize, DailyTask, PracticeSession, UserSession, VerificationStatus } from '../types';

export interface NewDailyTaskInput {
  title: string;
  category: string;
  durationMinutes: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  description: string;
  targetRoute?: string;
}

export interface RegisterPatientPayload {
  role: 'patient';
  fullName: string;
  email: string;
  password?: string;
  dateOfBirth?: string;
  parentConsentGiven?: boolean;
  stutterSeverity?: 'mild' | 'moderate' | 'severe' | 'not_sure';
  primaryGoal?: string;
  dpdpConsent: boolean;
  researchConsent?: boolean;
}

export interface RegisterClinicianPayload {
  role: 'therapist';
  fullName: string;
  email: string;
  password?: string;
  credential: string;
  licenseNumber: string;
  institution: string;
  yearsOfExperience: number;
  proofDocumentName?: string;
  dpdpConsent: boolean;
  researchConsent?: boolean;
}

export type RegisterPayload = RegisterPatientPayload | RegisterClinicianPayload;

interface AuthContextType {
  user: User | null;
  role: UserRole;
  token: string | null;
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
  appTheme: AppTheme;
  fontSize: FontSize;
  currentPage: string;
  authSubPage?: string; // 'login' | 'register' | 'forgot' | 'reset' | 'verify'
  authParamToken?: string;
  streakDays: number;
  lastPracticeDate: string;
  dailyTasks: DailyTask[];
  currentTime: Date;
  practiceSessions: PracticeSession[];
  inactivityWarning: boolean;
  remainingInactivitySeconds: number;
  // Account Actions
  toggleTheme: () => void;
  setAppTheme: (theme: AppTheme) => void;
  setFontSize: (size: FontSize) => void;
  setCurrentPage: (page: string, options?: { subPage?: string; token?: string }) => void;
  setStreakDays: (days: number) => void;
  toggleDailyTask: (taskId: string) => void;
  completeDailyTask: (taskId: string) => void;
  addDailyTask: (task: NewDailyTaskInput) => void;
  resetDailyPlan: () => void;
  recordPracticeSessionCompleted: (exerciseTitle?: string, sessionMetrics?: Partial<PracticeSession>) => void;
  // Auth methods
  login: (email: string, password?: string, keepMeSignedIn?: boolean, roleOverride?: UserRole) => Promise<{ success: boolean; requires2FA?: boolean; error?: string }>;
  verify2FA: (totpCode: string) => Promise<{ success: boolean; error?: string }>;
  registerUser: (payload: RegisterPayload) => Promise<{ success: boolean; message: string; verificationToken?: string }>;
  verifyEmail: (token: string) => Promise<{ success: boolean; message: string }>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string; debugResetToken?: string }>;
  resetPasswordWithToken: (token: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  terminateSession: (sessionId: string) => void;
  terminateAllOtherSessions: () => void;
  toggleTwoFactorAuth: (enable: boolean) => { secret?: string; recoveryCodes?: string[] };
  deleteAccountWithGracePeriod: () => void;
  cancelAccountDeletion: () => void;
  downloadUserData: () => void;
  switchDemoRole: (role: UserRole) => void;
  dismissInactivityWarning: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const INITIAL_DAILY_TASKS: DailyTask[] = [
  {
    id: 'dt-1',
    timeOfDay: 'morning',
    title: '5-Minute Diaphragmatic Breath Anchor',
    category: 'Respiratory Mechanics',
    durationMinutes: 5,
    completed: false,
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

export interface UserDataStore {
  streakDays: number;
  lastPracticeDate: string;
  dailyTasks: DailyTask[];
  practiceSessions: PracticeSession[];
}

export function createFreshUserData(): UserDataStore {
  return {
    streakDays: 0,
    lastPracticeDate: '',
    dailyTasks: INITIAL_DAILY_TASKS.map((t) => ({ ...t, completed: false, completedAt: undefined })),
    practiceSessions: []
  };
}

export function getUserDataStorageKey(emailOrId: string): string {
  const clean = (emailOrId || '').trim().toLowerCase();
  return `fluency_userdata_${clean}`;
}

export function loadUserDataForUser(emailOrId: string | undefined): UserDataStore {
  if (!emailOrId) {
    return createFreshUserData();
  }
  try {
    const raw = localStorage.getItem(getUserDataStorageKey(emailOrId));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          streakDays: typeof parsed.streakDays === 'number' ? parsed.streakDays : 0,
          lastPracticeDate: typeof parsed.lastPracticeDate === 'string' ? parsed.lastPracticeDate : '',
          dailyTasks: Array.isArray(parsed.dailyTasks) && parsed.dailyTasks.length > 0
            ? parsed.dailyTasks
            : INITIAL_DAILY_TASKS.map((t) => ({ ...t, completed: false, completedAt: undefined })),
          practiceSessions: Array.isArray(parsed.practiceSessions) ? parsed.practiceSessions : []
        };
      }
    }
  } catch (e) {
    // fallback
  }
  return createFreshUserData();
}

export function saveUserDataForUser(emailOrId: string | undefined, data: UserDataStore): void {
  if (!emailOrId) return;
  try {
    localStorage.setItem(getUserDataStorageKey(emailOrId), JSON.stringify(data));
  } catch (e) {
    // fallback
  }
}

const INITIAL_SESSIONS: UserSession[] = [
  {
    id: 'sess-curr-1',
    deviceInfo: 'Chrome 122 on macOS (Current Device)',
    ip: '192.168.1.104',
    browser: 'Chrome 122 (Desktop)',
    createdAt: 'Today, 08:30 AM',
    lastUsedAt: 'Just now',
    current: true
  },
  {
    id: 'sess-mobile-2',
    deviceInfo: 'Mobile Safari on iPhone 15 Pro',
    ip: '49.37.142.201',
    browser: 'Mobile Safari',
    createdAt: 'Yesterday, 07:15 PM',
    lastUsedAt: '18 hours ago',
    current: false
  }
];

const ACCOUNTS_STORAGE_KEY = 'fluency_registered_accounts_v2';

export function formatNameFromEmail(email: string): string {
  if (!email) return 'User';
  const prefix = email.split('@')[0];
  const cleaned = prefix.replace(/[\._\-]+/g, ' ').replace(/\d+/g, '').trim();
  if (!cleaned) {
    return prefix.charAt(0).toUpperCase() + prefix.slice(1);
  }
  return cleaned
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export function getStoredAccounts(): User[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Filter out any legacy Alex Johnson records
        return parsed.filter(
          (u) => u.fullName !== 'Alex Johnson' && u.email !== 'alex.patient@fluencyai.org'
        );
      }
    }
  } catch (e) {
    /* noop */
  }
  return [];
}

export function saveAccountToRegistry(userToSave: User) {
  try {
    const accounts = getStoredAccounts();
    const idx = accounts.findIndex((a) => a.email.toLowerCase() === userToSave.email.toLowerCase());
    if (idx >= 0) {
      accounts[idx] = { ...accounts[idx], ...userToSave };
    } else {
      accounts.push(userToSave);
    }
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  } catch (e) {
    /* noop */
  }
}

export function findAccountByEmail(email: string): User | undefined {
  const accounts = getStoredAccounts();
  return accounts.find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
}

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
  fontSize: 'normal',
  emailVerified: true,
  verificationStatus: 'verified',
  licenseNumber: 'RCI-SLP-49201',
  institution: 'National Institute for Speech & Hearing Sciences',
  yearsOfExperience: 16,
  dpdpConsent: true,
  researchConsent: false,
  twoFactorEnabled: true,
  activeSessions: INITIAL_SESSIONS
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('fluency_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Clean out any legacy Alex Johnson account
        if (parsed?.fullName === 'Alex Johnson' || parsed?.email === 'alex.patient@fluencyai.org') {
          localStorage.removeItem('fluency_user');
          localStorage.removeItem('fluency_token');
          return null;
        }
        return parsed;
      } catch (e) {
        /* noop */
      }
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() => {
    const saved = localStorage.getItem('fluency_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.fullName === 'Alex Johnson' || parsed?.email === 'alex.patient@fluencyai.org') {
          return null;
        }
      } catch (e) {
        /* noop */
      }
    }
    return localStorage.getItem('fluency_token') || null;
  });

  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const [appTheme, setAppThemeState] = useState<AppTheme>(() => {
    return (localStorage.getItem('fluency_app_theme') as AppTheme) || 'teal';
  });

  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    return (localStorage.getItem('fluency_font_size') as FontSize) || 'normal';
  });

  const [currentPage, setCurrentPageState] = useState<string>(() => {
    const saved = localStorage.getItem('fluency_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.fullName !== 'Alex Johnson' && parsed?.email !== 'alex.patient@fluencyai.org') {
          return parsed.role === 'therapist' ? 'admin' : 'dashboard';
        }
      } catch (e) {
        /* noop */
      }
    }
    return 'landing';
  });
  const [authSubPage, setAuthSubPage] = useState<string>('login');
  const [authParamToken, setAuthParamToken] = useState<string>('');

  // 2FA pending state
  const [pending2FAUser, setPending2FAUser] = useState<User | null>(null);

  // Inactivity tracking for clinicians (HIPAA/DPDP 30-minute requirement)
  const [inactivityWarning, setInactivityWarning] = useState<boolean>(false);
  const [remainingInactivitySeconds, setRemainingInactivitySeconds] = useState<number>(60);
  const lastActivityRef = useRef<number>(Date.now());

  // Real-time Streak and Practice tracking - STRICTLY USER-SCOPED
  const [streakDays, setStreakDaysState] = useState<number>(() => {
    const savedUserRaw = localStorage.getItem('fluency_user');
    if (savedUserRaw) {
      try {
        const parsed = JSON.parse(savedUserRaw);
        if (parsed?.email) {
          return loadUserDataForUser(parsed.email).streakDays;
        }
      } catch (e) {}
    }
    return 0;
  });

  const [lastPracticeDate, setLastPracticeDate] = useState<string>(() => {
    const savedUserRaw = localStorage.getItem('fluency_user');
    if (savedUserRaw) {
      try {
        const parsed = JSON.parse(savedUserRaw);
        if (parsed?.email) {
          return loadUserDataForUser(parsed.email).lastPracticeDate;
        }
      } catch (e) {}
    }
    return '';
  });

  // Real-time Daily Tasks - STRICTLY USER-SCOPED
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>(() => {
    const savedUserRaw = localStorage.getItem('fluency_user');
    if (savedUserRaw) {
      try {
        const parsed = JSON.parse(savedUserRaw);
        if (parsed?.email) {
          return loadUserDataForUser(parsed.email).dailyTasks;
        }
      } catch (e) {}
    }
    return INITIAL_DAILY_TASKS.map((t) => ({ ...t, completed: false, completedAt: undefined }));
  });

  // Real-time clock updated every second
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Practice Sessions history - STRICTLY USER-SCOPED (starts at [] for new users)
  const [practiceSessions, setPracticeSessions] = useState<PracticeSession[]>(() => {
    const savedUserRaw = localStorage.getItem('fluency_user');
    if (savedUserRaw) {
      try {
        const parsed = JSON.parse(savedUserRaw);
        if (parsed?.email) {
          return loadUserDataForUser(parsed.email).practiceSessions;
        }
      } catch (e) {}
    }
    return [];
  });

  // Load respective user data whenever active user changes
  useEffect(() => {
    if (user?.email) {
      const uData = loadUserDataForUser(user.email);
      setStreakDaysState(uData.streakDays);
      setLastPracticeDate(uData.lastPracticeDate);
      setDailyTasks(uData.dailyTasks);
      setPracticeSessions(uData.practiceSessions);
    } else {
      // Unauthenticated state: clean fresh baseline
      setStreakDaysState(0);
      setLastPracticeDate('');
      setDailyTasks(INITIAL_DAILY_TASKS.map((t) => ({ ...t, completed: false, completedAt: undefined })));
      setPracticeSessions([]);
    }
  }, [user?.email]);

  // Persist user-scoped data whenever streak, tasks, or sessions change
  useEffect(() => {
    if (user?.email) {
      saveUserDataForUser(user.email, {
        streakDays,
        lastPracticeDate,
        dailyTasks,
        practiceSessions
      });
    }
  }, [user?.email, streakDays, lastPracticeDate, dailyTasks, practiceSessions]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Clinician auto-logout inactivity monitor (30 minutes)
  useEffect(() => {
    if (!user || user.role !== 'therapist') return;

    const handleUserActivity = () => {
      lastActivityRef.current = Date.now();
      if (inactivityWarning) {
        setInactivityWarning(false);
      }
    };

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);

    const checkInterval = setInterval(() => {
      const elapsedMs = Date.now() - lastActivityRef.current;
      const thirtyMinutesMs = 30 * 60 * 1000;
      const warningThresholdMs = 29 * 60 * 1000; // 1 min before logout

      if (elapsedMs >= thirtyMinutesMs) {
        // Log out automatically
        logout();
        setInactivityWarning(false);
      } else if (elapsedMs >= warningThresholdMs) {
        setInactivityWarning(true);
        setRemainingInactivitySeconds(Math.max(0, Math.round((thirtyMinutesMs - elapsedMs) / 1000)));
      }
    }, 5000);

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      clearInterval(checkInterval);
    };
  }, [user, inactivityWarning]);

  const dismissInactivityWarning = () => {
    lastActivityRef.current = Date.now();
    setInactivityWarning(false);
  };

  const setCurrentPage = (page: string, options?: { subPage?: string; token?: string }) => {
    setCurrentPageState(page);
    if (options?.subPage) {
      setAuthSubPage(options.subPage);
    }
    if (options?.token) {
      setAuthParamToken(options.token);
    }
  };

  const toggleDailyTask = (taskId: string) => {
    setDailyTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined } : t))
    );
  };

  const completeDailyTask = (taskId: string) => {
    setDailyTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: true, completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : t))
    );
  };

  const addDailyTask = (task: NewDailyTaskInput) => {
    const newTask: DailyTask = {
      id: `task-${Date.now()}`,
      exerciseId: `ex-${Date.now()}`,
      title: task.title,
      category: task.category,
      durationMinutes: task.durationMinutes,
      timeOfDay: task.timeOfDay,
      description: task.description,
      targetRoute: task.targetRoute,
      completed: false
    };
    setDailyTasks((prev) => [...prev, newTask]);
  };

  const resetDailyPlan = () => {
    setDailyTasks(INITIAL_DAILY_TASKS.map((t) => ({ ...t, completed: false, completedAt: undefined })));
  };

  const recordPracticeSessionCompleted = (exerciseTitle?: string, sessionMetrics?: Partial<PracticeSession>) => {
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
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setAppTheme = (t: AppTheme) => {
    setAppThemeState(t);
  };

  const setFontSize = (s: FontSize) => {
    setFontSizeState(s);
  };

  const setStreakDays = (days: number) => {
    setStreakDaysState(days);
  };

  // Auth: Login Flow
  const login = async (
    email: string,
    password?: string,
    keepMeSignedIn = true,
    roleOverride?: UserRole
  ): Promise<{ success: boolean; requires2FA?: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const isClinician =
      roleOverride === 'therapist' ||
      cleanEmail.includes('dr.') ||
      cleanEmail.includes('marcus') ||
      cleanEmail.includes('slp') ||
      cleanEmail.includes('therapist');

    // 1. Check if user already exists in registered accounts registry
    let targetUser = findAccountByEmail(cleanEmail);

    if (!targetUser) {
      // Create user account from login credentials dynamically
      const displayName = cleanEmail.includes('marcus')
        ? 'Dr. Marcus Vance, CCC-SLP'
        : formatNameFromEmail(cleanEmail);

      const targetRole: UserRole = isClinician ? 'therapist' : (roleOverride || 'patient');

      targetUser = {
        id: `usr-${Date.now()}`,
        email: cleanEmail,
        fullName: displayName,
        role: targetRole,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`,
        preferredTheme: appTheme,
        fontSize: fontSize,
        baselineDisfluencyRate: targetRole === 'patient' ? 5.8 : undefined,
        streakDays: 0,
        emailVerified: true,
        verificationStatus: 'verified',
        stutterSeverity: targetRole === 'patient' ? 'moderate' : undefined,
        primaryGoal: targetRole === 'patient' ? 'Gentle onset and speaking confidence' : undefined,
        credentials: targetRole === 'therapist' ? 'CCC-SLP' : undefined,
        licenseNumber: targetRole === 'therapist' ? 'SLP-RCI-2026' : undefined,
        institution: targetRole === 'therapist' ? 'Speech Pathology Institute' : undefined,
        yearsOfExperience: targetRole === 'therapist' ? 8 : undefined,
        dpdpConsent: true,
        researchConsent: false,
        twoFactorEnabled: false,
        activeSessions: INITIAL_SESSIONS
      };

      saveAccountToRegistry(targetUser);
    } else {
      // Update session last active
      targetUser = {
        ...targetUser,
        lastLoginAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      saveAccountToRegistry(targetUser);
    }

    // Check if 2FA is required for this account
    if (targetUser.twoFactorEnabled) {
      setPending2FAUser(targetUser);
      return { success: false, requires2FA: true };
    }

    // Successful authentication
    setUser(targetUser);
    const mockToken = `jwt-${targetUser.role}-${targetUser.id}`;
    setToken(mockToken);
    localStorage.setItem('fluency_user', JSON.stringify(targetUser));
    localStorage.setItem('fluency_token', mockToken);

    // Explicitly load this respective user's data into state
    const personalData = loadUserDataForUser(targetUser.email);
    setStreakDaysState(personalData.streakDays);
    setLastPracticeDate(personalData.lastPracticeDate);
    setDailyTasks(personalData.dailyTasks);
    setPracticeSessions(personalData.practiceSessions);

    // Redirect by role
    if (targetUser.role === 'therapist') {
      setCurrentPage('admin');
    } else {
      setCurrentPage('dashboard');
    }

    return { success: true };
  };

  // Auth: 2FA Verification
  const verify2FA = async (totpCode: string): Promise<{ success: boolean; error?: string }> => {
    if (!pending2FAUser) {
      return { success: false, error: 'No active sign-in session to verify.' };
    }
    // Accept valid 6-digit code or demo default 123456
    if (totpCode.trim().length === 6) {
      const authenticatedUser = pending2FAUser;
      setUser(authenticatedUser);
      setPending2FAUser(null);
      const mockToken = `jwt-${authenticatedUser.role}-${authenticatedUser.id}`;
      setToken(mockToken);
      localStorage.setItem('fluency_user', JSON.stringify(authenticatedUser));
      localStorage.setItem('fluency_token', mockToken);

      const personalData = loadUserDataForUser(authenticatedUser.email);
      setStreakDaysState(personalData.streakDays);
      setLastPracticeDate(personalData.lastPracticeDate);
      setDailyTasks(personalData.dailyTasks);
      setPracticeSessions(personalData.practiceSessions);

      if (authenticatedUser.role === 'therapist') {
        setCurrentPage('admin');
      } else {
        setCurrentPage('dashboard');
      }
      return { success: true };
    }
    return { success: false, error: 'Invalid 6-digit code. Please check your authenticator app.' };
  };

  // Auth: Registration Flow - INITIALIZES CLEAN, BLANK STATE FOR THE RESPECTIVE PERSON
  const registerUser = async (payload: RegisterPayload): Promise<{ success: boolean; message: string; verificationToken?: string }> => {
    const dummyToken = `verify-${Math.random().toString(36).substring(2, 10)}`;
    const isClinician = payload.role === 'therapist';
    const cleanEmail = payload.email.trim().toLowerCase();
    const cleanName = payload.fullName.trim() || formatNameFromEmail(cleanEmail);

    const newUser: User = {
      id: `usr-${Date.now()}`,
      email: cleanEmail,
      fullName: cleanName,
      role: payload.role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanName)}`,
      preferredTheme: appTheme,
      fontSize: fontSize,
      baselineDisfluencyRate: isClinician ? undefined : 6.2,
      streakDays: 0,
      emailVerified: true,
      verificationStatus: isClinician ? 'pending_verification' : 'verified',
      dpdpConsent: payload.dpdpConsent,
      researchConsent: payload.researchConsent || false,
      ...(isClinician
        ? {
            credentials: (payload as RegisterClinicianPayload).credential || 'CCC-SLP',
            licenseNumber: (payload as RegisterClinicianPayload).licenseNumber || 'PENDING-LIC',
            institution: (payload as RegisterClinicianPayload).institution || 'Speech Clinic',
            yearsOfExperience: (payload as RegisterClinicianPayload).yearsOfExperience || 1
          }
        : {
            dateOfBirth: (payload as RegisterPatientPayload).dateOfBirth,
            parentConsentGiven: (payload as RegisterPatientPayload).parentConsentGiven,
            stutterSeverity: (payload as RegisterPatientPayload).stutterSeverity || 'moderate',
            primaryGoal: (payload as RegisterPatientPayload).primaryGoal || 'Improve daily fluency confidence and speech ease'
          }),
      activeSessions: [
        {
          id: `sess-${Date.now()}`,
          deviceInfo: 'Browser Session (Current Device)',
          ip: '127.0.0.1',
          browser: 'Current Device',
          createdAt: 'Just now',
          lastUsedAt: 'Just now',
          current: true
        }
      ]
    };

    // Save account into the permanent accounts registry
    saveAccountToRegistry(newUser);

    // Initialize fresh empty data store specifically for this new user
    const freshData = createFreshUserData();
    saveUserDataForUser(newUser.email, freshData);
    saveUserDataForUser(newUser.id, freshData);

    try {
      localStorage.setItem(`fluency_appointments_${newUser.email}`, JSON.stringify([]));
      localStorage.setItem(`fluency_appointments_${newUser.id}`, JSON.stringify([]));
      localStorage.setItem(`fluency_plans_${newUser.email}`, JSON.stringify([]));
      localStorage.setItem(`fluency_plans_${newUser.id}`, JSON.stringify([]));
    } catch (e) {
      // fallback
    }

    return {
      success: true,
      message: 'Account created successfully! Please sign in with your credentials.',
      verificationToken: dummyToken
    };
  };

  // Auth: Verify Email
  const verifyEmail = async (token: string): Promise<{ success: boolean; message: string }> => {
    if (user) {
      const updated = { ...user, emailVerified: true };
      setUser(updated);
      localStorage.setItem('fluency_user', JSON.stringify(updated));
    }
    return { success: true, message: 'Your email address has been verified successfully!' };
  };

  // Auth: Password Reset Request
  const requestPasswordReset = async (email: string): Promise<{ success: boolean; message: string; debugResetToken?: string }> => {
    const dummyToken = `reset-${Math.random().toString(36).substring(2, 10)}`;
    return {
      success: true,
      message: "If that email exists in our system, we've sent a secure reset link valid for 30 minutes.",
      debugResetToken: dummyToken
    };
  };

  // Auth: Complete Password Reset
  const resetPasswordWithToken = async (token: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    return {
      success: true,
      message: 'Your password has been securely updated. You can now sign in with your new credentials.'
    };
  };

  // Auth: Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    setPending2FAUser(null);
    setStreakDaysState(0);
    setLastPracticeDate('');
    setDailyTasks(INITIAL_DAILY_TASKS.map((t) => ({ ...t, completed: false, completedAt: undefined })));
    setPracticeSessions([]);
    localStorage.removeItem('fluency_user');
    localStorage.removeItem('fluency_token');
    setCurrentPage('landing');
  };

  // Session Management
  const terminateSession = (sessionId: string) => {
    if (!user) return;
    const updatedSessions = (user.activeSessions || []).filter((s) => s.id !== sessionId);
    const updated = { ...user, activeSessions: updatedSessions };
    setUser(updated);
    localStorage.setItem('fluency_user', JSON.stringify(updated));
  };

  const terminateAllOtherSessions = () => {
    if (!user) return;
    const currentSessions = (user.activeSessions || []).filter((s) => s.current);
    const updated = { ...user, activeSessions: currentSessions };
    setUser(updated);
    localStorage.setItem('fluency_user', JSON.stringify(updated));
  };

  // 2FA Management
  const toggleTwoFactorAuth = (enable: boolean) => {
    if (!user) return {};
    const secret = enable ? 'JBSWY3DPEHPK3PXP' : undefined;
    const recoveryCodes = enable ? ['A98B-7721', 'K28L-9914', 'M54Q-3312', 'X81P-0094'] : undefined;
    const updated: User = {
      ...user,
      twoFactorEnabled: enable,
      twoFactorSecret: secret,
      recoveryCodes: recoveryCodes
    };
    setUser(updated);
    localStorage.setItem('fluency_user', JSON.stringify(updated));
    return { secret, recoveryCodes };
  };

  // Account Deletion & DPDP Grace Period
  const deleteAccountWithGracePeriod = () => {
    if (!user) return;
    const graceDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const updated = { ...user, accountDeletionScheduled: graceDate };
    setUser(updated);
    localStorage.setItem('fluency_user', JSON.stringify(updated));
  };

  const cancelAccountDeletion = () => {
    if (!user) return;
    const updated = { ...user, accountDeletionScheduled: undefined };
    setUser(updated);
    localStorage.setItem('fluency_user', JSON.stringify(updated));
  };

  // Download User Data (JSON Export - DPDP Act 2023 / HIPAA)
  const downloadUserData = () => {
    if (!user) return;
    const exportData = {
      exportTimestamp: new Date().toISOString(),
      complianceNotice: 'DPDP Act 2023 & HIPAA Personal Data Archive',
      userProfile: user,
      clinicalSessions: practiceSessions,
      dailyTasks: dailyTasks
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FluencyAI-Patient-Data-${user.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Quick Demo Role Switcher
  const switchDemoRole = (targetRole: UserRole) => {
    if (targetRole === 'therapist') {
      setUser(DEMO_THERAPIST);
      const mockToken = `jwt-therapist-${DEMO_THERAPIST.id}`;
      setToken(mockToken);
      localStorage.setItem('fluency_user', JSON.stringify(DEMO_THERAPIST));
      localStorage.setItem('fluency_token', mockToken);
      saveAccountToRegistry(DEMO_THERAPIST);
      setCurrentPage('admin');
    } else {
      // Find registered patient in registry or preserve current user as patient
      const stored = getStoredAccounts();
      const existingPatient = stored.find((a) => a.role === 'patient');

      let patientUser: User;
      if (existingPatient) {
        patientUser = existingPatient;
      } else if (user && user.role !== 'therapist') {
        patientUser = user;
      } else {
        const defaultName = user?.fullName && !user.fullName.includes('Marcus') ? user.fullName : 'Patient Member';
        patientUser = {
          id: `usr-patient-${Date.now()}`,
          email: user?.email && !user.email.includes('marcus') ? user.email : 'patient@fluencyai.org',
          fullName: defaultName,
          role: 'patient',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(defaultName)}`,
          preferredTheme: appTheme,
          fontSize: fontSize,
          baselineDisfluencyRate: 5.6,
          streakDays: 0,
          emailVerified: true,
          verificationStatus: 'verified',
          stutterSeverity: 'moderate',
          primaryGoal: 'Conquer anticipatory phone call blocks with gentle onset',
          dpdpConsent: true,
          researchConsent: true,
          twoFactorEnabled: false,
          activeSessions: INITIAL_SESSIONS
        };
      }

      saveAccountToRegistry(patientUser);
      setUser(patientUser);
      const mockToken = `jwt-patient-${patientUser.id}`;
      setToken(mockToken);
      localStorage.setItem('fluency_user', JSON.stringify(patientUser));
      localStorage.setItem('fluency_token', mockToken);

      const pData = loadUserDataForUser(patientUser.email);
      setStreakDaysState(pData.streakDays);
      setLastPracticeDate(pData.lastPracticeDate);
      setDailyTasks(pData.dailyTasks);
      setPracticeSessions(pData.practiceSessions);

      setCurrentPage('dashboard');
    }
  };

  // Update profile for currently logged-in user
  const updateUserProfile = (updates: Partial<User>) => {
    if (!user) return;
    const updated: User = {
      ...user,
      ...updates,
      ...(updates.fullName && !updates.avatar
        ? {
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(updates.fullName)}`
          }
        : {})
    };
    setUser(updated);
    localStorage.setItem('fluency_user', JSON.stringify(updated));
    saveAccountToRegistry(updated);
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
        authSubPage,
        authParamToken,
        streakDays,
        lastPracticeDate,
        dailyTasks,
        currentTime,
        practiceSessions,
        inactivityWarning,
        remainingInactivitySeconds,
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
        verify2FA,
        registerUser,
        verifyEmail,
        requestPasswordReset,
        resetPasswordWithToken,
        logout,
        terminateSession,
        terminateAllOtherSessions,
        toggleTwoFactorAuth,
        deleteAccountWithGracePeriod,
        cancelAccountDeletion,
        downloadUserData,
        switchDemoRole,
        dismissInactivityWarning,
        updateUserProfile
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

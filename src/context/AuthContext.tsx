import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AppTheme, FontSize } from '../types';

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
  toggleTheme: () => void;
  setAppTheme: (theme: AppTheme) => void;
  setFontSize: (size: FontSize) => void;
  setCurrentPage: (page: string) => void;
  setStreakDays: (days: number) => void;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  register: (email: string, fullName: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  switchDemoRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('fluency_dark_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [appTheme, setAppThemeState] = useState<AppTheme>(() => {
    return (localStorage.getItem('fluency_app_theme') as AppTheme) || 'teal';
  });

  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    return (localStorage.getItem('fluency_font_size') as FontSize) || 'normal';
  });

  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [streakDays, setStreakDays] = useState<number>(5);

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
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
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
        toggleTheme,
        setAppTheme,
        setFontSize,
        setCurrentPage,
        setStreakDays,
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

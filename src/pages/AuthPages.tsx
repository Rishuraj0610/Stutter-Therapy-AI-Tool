import React, { useState, useEffect } from 'react';
import { useAuth, RegisterPatientPayload, RegisterClinicianPayload } from '../context/AuthContext';
import { UserRole } from '../types';
import {
  ShieldCheck,
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  FileText,
  KeyRound,
  Stethoscope,
  Clock,
  Sparkles,
  HelpCircle,
  RotateCcw,
  Check,
  Activity,
  Waves,
  Zap,
  BadgeCheck
} from 'lucide-react';

interface AuthPagesProps {
  initialMode?: 'login' | 'register' | 'forgot' | 'reset' | 'verify';
}

export const AuthPages: React.FC<AuthPagesProps> = ({ initialMode = 'login' }) => {
  const {
    login,
    verify2FA,
    registerUser,
    verifyEmail,
    requestPasswordReset,
    resetPasswordWithToken,
    setCurrentPage,
    authSubPage,
    authParamToken,
    user
  } = useAuth();

  // Mode state: 'login' | 'register' | 'forgot' | 'reset' | 'verify' | '2fa' | 'verify_pending'
  const [mode, setMode] = useState<string>(authSubPage || initialMode);

  // Common Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [keepMeSignedIn, setKeepMeSignedIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Blur validation state
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  // 2FA TOTP code
  const [totpCode, setTotpCode] = useState('');

  // Password reset token
  const [resetToken, setResetToken] = useState(authParamToken || 'demo-reset-token');

  // Registration specifics
  const [role, setRole] = useState<UserRole>('patient');
  // Patient fields
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [parentConsent, setParentConsent] = useState(false);
  const [stutterSeverity, setStutterSeverity] = useState<'mild' | 'moderate' | 'severe' | 'not_sure'>('mild');
  const [primaryGoal, setPrimaryGoal] = useState('');
  // Clinician fields
  const [credential, setCredential] = useState('CCC-SLP');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [institution, setInstitution] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState(5);
  const [proofDocumentName, setProofDocumentName] = useState('license_verification.pdf');
  // Compliance checkboxes
  const [dpdpConsent, setDpdpConsent] = useState(true);
  const [researchConsent, setResearchConsent] = useState(false);

  // Resend email countdown
  const [resendCooldown, setResendCooldown] = useState(0);

  // Compute if age < 18
  const isMinor = () => {
    if (!dateOfBirth) return false;
    const birthYear = new Date(dateOfBirth).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear < 18;
  };

  useEffect(() => {
    if (authSubPage) {
      setMode(authSubPage);
    }
  }, [authSubPage]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Password strength evaluation
  const evaluatePasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 10) score += 1;
    if (pass.length >= 14) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;
    return score; // 0 to 4
  };

  const passwordScore = evaluatePasswordStrength(password);

  const getPasswordStrengthLabel = (score: number) => {
    switch (score) {
      case 0:
      case 1:
        return { label: 'Weak (minimum 10 characters recommended)', color: 'text-red-500', bar: 'bg-red-500 w-1/4' };
      case 2:
        return { label: 'Fair (length & entropy improving)', color: 'text-amber-500', bar: 'bg-amber-500 w-2/4' };
      case 3:
        return { label: 'Good (resistant to brute force)', color: 'text-emerald-500', bar: 'bg-emerald-500 w-3/4' };
      case 4:
      default:
        return { label: 'Strong (high clinical entropy)', color: 'text-teal-600', bar: 'bg-teal-600 w-full' };
    }
  };

  // Keyboard navigation & CapsLock detection
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.getModifierState && e.getModifierState('CapsLock')) {
      setCapsLockActive(true);
    } else {
      setCapsLockActive(false);
    }
  };

  // Blur validation
  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field: string) => {
    const errors = { ...fieldErrors };

    if (field === 'email') {
      if (!email.trim()) {
        errors.email = 'Email address is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Please enter a valid clinical email address.';
      } else {
        delete errors.email;
      }
    }

    if (field === 'password' && mode !== 'forgot') {
      if (!password) {
        errors.password = 'Password is required.';
      } else if (mode === 'register' && password.length < 10) {
        errors.password = 'Password must be at least 10 characters long.';
      } else {
        delete errors.password;
      }
    }

    if (field === 'confirmPassword' && mode === 'register') {
      if (confirmPassword !== password) {
        errors.confirmPassword = 'Passwords do not match.';
      } else {
        delete errors.confirmPassword;
      }
    }

    if (field === 'fullName' && mode === 'register') {
      if (!fullName.trim()) {
        errors.fullName = 'Full name is required.';
      } else {
        delete errors.fullName;
      }
    }

    if (field === 'licenseNumber' && mode === 'register' && role === 'therapist') {
      if (!licenseNumber.trim()) {
        errors.licenseNumber = 'Professional license or RCI number is required.';
      } else {
        delete errors.licenseNumber;
      }
    }

    setFieldErrors(errors);
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    if (!email.trim()) {
      setGeneralError('Please enter your email address to sign in.');
      return;
    }
    setIsLoading(true);

    try {
      const res = await login(email.trim(), password, keepMeSignedIn, role);
      if (res.requires2FA) {
        setMode('2fa');
      } else if (!res.success) {
        setGeneralError('Email or password is incorrect.');
      }
    } catch {
      setGeneralError('Email or password is incorrect.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle 2FA Submit
  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setIsLoading(true);

    const res = await verify2FA(totpCode);
    if (!res.success) {
      setGeneralError(res.error || 'Invalid authentication code.');
    }
    setIsLoading(false);
  };

  // Handle Registration Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    // Validate all fields
    if (password.length < 10) {
      setGeneralError('Password must be at least 10 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setGeneralError('Passwords do not match.');
      return;
    }
    if (!dpdpConsent) {
      setGeneralError('Consent to process speech data under DPDP Act 2023 is required.');
      return;
    }
    if (role === 'patient' && isMinor() && !parentConsent) {
      setGeneralError('Parent or guardian consent is required for users under 18.');
      return;
    }
    if (role === 'therapist' && !licenseNumber.trim()) {
      setGeneralError('A valid professional license number is required for clinician registration.');
      return;
    }

    setIsLoading(true);

    try {
      if (role === 'patient') {
        const payload: RegisterPatientPayload = {
          role: 'patient',
          fullName: fullName.trim(),
          email: email.trim(),
          password,
          dateOfBirth,
          parentConsentGiven: parentConsent,
          stutterSeverity,
          primaryGoal,
          dpdpConsent,
          researchConsent
        };
        const res = await registerUser(payload);
        if (res.success) {
          // Direct divert to login page after creating account
          setMode('login');
          setEmail(payload.email);
          setPassword('');
          setConfirmPassword('');
          setSuccessMessage('Account created successfully! Verification email recorded. Please sign in below.');
        }
      } else {
        const payload: RegisterClinicianPayload = {
          role: 'therapist',
          fullName: fullName.trim(),
          email: email.trim(),
          password,
          credential,
          licenseNumber: licenseNumber.trim(),
          institution: institution.trim() || 'Speech Clinic',
          yearsOfExperience,
          proofDocumentName,
          dpdpConsent,
          researchConsent
        };
        const res = await registerUser(payload);
        if (res.success) {
          // Direct divert to login page after creating account
          setMode('login');
          setEmail(payload.email);
          setPassword('');
          setConfirmPassword('');
          setSuccessMessage('Clinician account created successfully! Please sign in below to access your dashboard.');
        }
      }
    } catch {
      setGeneralError('Unable to complete registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Forgot Password Submit
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneralError(null);

    const res = await requestPasswordReset(email);
    setSuccessMessage(res.message);
    setIsLoading(false);
  };

  // Handle Reset Password Submit
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 10) {
      setGeneralError('Password must be at least 10 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setGeneralError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    const res = await resetPasswordWithToken(resetToken, password);
    setSuccessMessage(res.message);
    setIsLoading(false);
  };

  // Handle Email Verification Action
  const handleVerifyEmail = async () => {
    setIsLoading(true);
    const res = await verifyEmail('sample-token');
    setSuccessMessage(res.message);
    setIsLoading(false);
    setTimeout(() => {
      if (user?.role === 'therapist') {
        setCurrentPage('admin');
      } else {
        setCurrentPage('dashboard');
      }
    }, 1500);
  };

  const handleResendVerification = () => {
    if (resendCooldown > 0) return;
    setResendCooldown(60);
    setSuccessMessage('A fresh verification link has been sent to your inbox.');
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 pt-4 pb-20 px-3 sm:px-6">
      {/* Clinician Verification in Progress notice if logged in as pending clinician */}
      {user && user.verificationStatus === 'pending_verification' && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex items-start gap-3 backdrop-blur-xs shadow-xs">
          <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <div className="text-xs">
            <h4 className="font-bold text-sm">SLP Clinical Verification in Progress</h4>
            <p className="mt-1 text-slate-600 dark:text-slate-300">
              Your speech pathology license ({user.licenseNumber || 'CCC-SLP'}) is currently undergoing administrative review.
              To protect patient confidentiality, access to patient caseload data is locked until your credentials are confirmed.
            </p>
          </div>
        </div>
      )}

      {/* 2nd child div: Main Elevated Split Auth Card (Target of CSS Selector 1) */}
      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl shadow-slate-900/10 overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all">
        {/* Left Column: Clinical Hero & Live Acoustic DSP Showcase */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-teal-950/95 to-slate-900 text-white p-7 sm:p-9 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-teal-500/20">
          {/* Ambient Lighting Orbs */}
          <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

          {/* Top Branding */}
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 border border-white/15 backdrop-blur-md text-teal-200 shadow-xs">
              <Waves className="w-3.5 h-3.5 text-teal-300 animate-pulse" />
              <span>FluencyAI Speech Suite</span>
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Evidence-Based Speech Biofeedback
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Real-time vocal formant tracking, gentle phonation onsets, and continuous voicing telemetry for people who stutter and certified SLPs.
              </p>
            </div>
          </div>

          {/* Center Visual: Live Acoustic Waveform & Formant Monitor Card */}
          <div className="relative z-10 my-6 p-4 rounded-2xl bg-slate-900/85 border border-teal-500/30 backdrop-blur-md shadow-inner space-y-3">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-mono text-teal-400 font-bold flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-teal-400" />
                ACOUSTIC BIOFEEDBACK
              </span>
              <span className="px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 font-mono text-[10px] font-semibold border border-teal-500/30">
                CAMPERDOWN 4.0
              </span>
            </div>

            {/* Simulated Live Pitch & Formant Waveform SVG */}
            <div className="relative py-1">
              <svg viewBox="0 0 320 54" className="w-full h-12 stroke-current text-teal-400 fill-none" preserveAspectRatio="none">
                <path
                  d="M0,27 C30,8 50,44 80,27 C110,12 130,42 160,27 C190,14 210,40 240,27 C270,16 290,38 320,27"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="opacity-95"
                />
                <path
                  d="M0,27 C30,38 50,14 80,27 C110,39 130,16 160,27 C190,37 210,18 240,27 C270,36 290,20 320,27"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  className="text-teal-200/50"
                />
              </svg>
              <div className="absolute right-2 top-0 flex items-center gap-1 text-[10px] text-teal-300 font-mono bg-slate-950/70 px-1.5 py-0.5 rounded border border-teal-500/20">
                <Zap className="w-3 h-3 text-teal-400" />
                <span>128 Hz (Smooth Onset)</span>
              </div>
            </div>

            {/* Real-time Telemetry Pills */}
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800 text-center">
              <div className="p-1.5 rounded-lg bg-white/5">
                <span className="block text-[9px] uppercase tracking-wider text-slate-400">Voicing Ratio</span>
                <span className="font-mono text-xs font-bold text-teal-300">94.2%</span>
              </div>
              <div className="p-1.5 rounded-lg bg-white/5">
                <span className="block text-[9px] uppercase tracking-wider text-slate-400">Syllables/Min</span>
                <span className="font-mono text-xs font-bold text-teal-300">138 SPM</span>
              </div>
              <div className="p-1.5 rounded-lg bg-white/5">
                <span className="block text-[9px] uppercase tracking-wider text-slate-400">Vocal Strain</span>
                <span className="font-mono text-xs font-bold text-emerald-400">Low (12%)</span>
              </div>
            </div>
          </div>

          {/* Bottom Value Props & Security Guarantees */}
          <div className="relative z-10 space-y-2.5 pt-2">
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <BadgeCheck className="w-4 h-4 text-teal-400 shrink-0" />
              <span>In-browser signal processing with zero persistent audio recording</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <BadgeCheck className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Calibrated for Camperdown & Van Riper stuttering protocols</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <BadgeCheck className="w-4 h-4 text-teal-400 shrink-0" />
              <span>End-to-end encrypted session telemetry with SLP supervision</span>
            </div>
          </div>
        </div>

        {/* Right Column: High-Utility Sleek Interactive Form */}
        <div className="lg:col-span-7 p-6 sm:p-9 flex flex-col justify-center space-y-5 bg-white dark:bg-slate-900">
          {/* Mode Title & Context */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {mode === 'login' && 'Sign in to FluencyAI'}
                {mode === 'register' && 'Create Your Fluency Account'}
                {mode === 'forgot' && 'Reset Your Password'}
                {mode === 'reset' && 'Set a New Password'}
                {mode === '2fa' && 'Two-Factor Authentication'}
                {mode === 'verify_pending' && 'Check Your Email'}
              </h2>
              <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {mode === 'login' && 'Welcome back. Access your acoustic biofeedback, daily tasks, and speech sessions.'}
              {mode === 'register' && 'Personalized evidence-based speech practice with clinical privacy controls.'}
              {mode === 'forgot' && 'Enter your registered email to receive a secure password reset link.'}
              {mode === 'reset' && 'Create a strong, entropy-based password to secure your speech records.'}
              {mode === '2fa' && 'Enter the 6-digit verification code from your authenticator app.'}
              {mode === 'verify_pending' && 'We have sent a secure single-use verification link to your email.'}
            </p>
          </div>

          {/* Modern Segmented Tab Switch for Sign In vs Create Account */}
          {(mode === 'login' || mode === 'register') && (
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setGeneralError(null);
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  mode === 'login'
                    ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setGeneralError(null);
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  mode === 'register'
                    ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* General Error Banner */}
          {generalError && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2.5 animate-fadeIn"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="font-medium">{generalError}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div
              role="status"
              className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2.5 animate-fadeIn"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span className="font-medium">{successMessage}</span>
            </div>
          )}

          {/* CapsLock Warning */}
          {capsLockActive && (
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[11px] font-semibold flex items-center gap-2 border border-amber-200 dark:border-amber-800">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Caps Lock is ON.</span>
            </div>
          )}

          {/* 1. SIGN IN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="login-email" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => handleBlur('email')}
                    className={`w-full pl-10 pr-3.5 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 transition-all ${
                      touched.email && fieldErrors.email
                        ? 'border-red-400 focus:ring-red-300'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-teal-500 focus:border-teal-500'
                    }`}
                  />
                </div>
                {touched.email && fieldErrors.email && (
                  <p className="text-[11px] text-red-500 mt-1">{fieldErrors.email}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="login-password" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setGeneralError(null);
                    }}
                    className="text-[11px] font-semibold text-teal-700 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={() => handleBlur('password')}
                    className={`w-full pl-10 pr-10 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 transition-all ${
                      touched.password && fieldErrors.password
                        ? 'border-red-400 focus:ring-red-300'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-teal-500 focus:border-teal-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {touched.password && fieldErrors.password && (
                  <p className="text-[11px] text-red-500 mt-1">{fieldErrors.password}</p>
                )}
              </div>

              {/* Keep Signed In & Role Switcher */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={keepMeSignedIn}
                    onChange={(e) => setKeepMeSignedIn(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                  />
                  <span>Keep me signed in</span>
                </label>

                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Target Portal:{' '}
                  <button
                    type="button"
                    onClick={() => setRole(role === 'patient' ? 'therapist' : 'patient')}
                    className="text-teal-700 dark:text-teal-400 font-bold capitalize hover:underline inline-flex items-center gap-1"
                  >
                    {role === 'patient' ? 'Patient Portal' : 'Clinician Portal'}
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-600 hover:to-teal-700 disabled:opacity-60 text-white font-bold text-xs shadow-lg shadow-teal-900/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? 'Verifying Credentials...' : 'Sign In to Portal'}
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Quick Clinical Testing Preset Card */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 text-center">
                  Quick Access Demo Credentials
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('marcus.vance@speechclinic.org');
                    setPassword('slpSpecialist2026!');
                    setRole('therapist');
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-teal-50/80 dark:bg-slate-800/60 dark:hover:bg-teal-950/40 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 font-medium text-left flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-xs">
                      SLP
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">Dr. Marcus Vance, CCC-SLP</div>
                      <div className="text-[10px] text-slate-500">Clinician Portal • Full caseload access</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400 px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-800/60 group-hover:bg-teal-600 group-hover:text-white transition-all">
                    Load
                  </span>
                </button>
              </div>
            </form>
          )}

          {/* 2. REGISTRATION FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4" noValidate>
              {/* Role Selector: Tactile Side-by-Side Cards */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Your Account Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('patient')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      role === 'patient'
                        ? 'border-teal-600 bg-teal-50/70 dark:bg-teal-950/40 text-teal-950 dark:text-teal-100 shadow-sm ring-1 ring-teal-600'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <User className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        <span className="font-bold text-xs">Patient</span>
                      </div>
                      {role === 'patient' && <Check className="w-4 h-4 text-teal-600 dark:text-teal-400" />}
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      Person who stutters or parent/guardian
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('therapist')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      role === 'therapist'
                        ? 'border-teal-600 bg-teal-50/70 dark:bg-teal-950/40 text-teal-950 dark:text-teal-100 shadow-sm ring-1 ring-teal-600'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <Stethoscope className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        <span className="font-bold text-xs">Speech Clinician</span>
                      </div>
                      {role === 'therapist' && <Check className="w-4 h-4 text-teal-600 dark:text-teal-400" />}
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      SLP, BCS-F, RCI certified therapist
                    </p>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="reg-name" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Legal Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="reg-name"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder={role === 'therapist' ? 'e.g. Dr. Marcus Vance, CCC-SLP' : 'e.g. Sarah Miller'}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onBlur={() => handleBlur('fullName')}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                {touched.fullName && fieldErrors.fullName && (
                  <p className="text-[11px] text-red-500 mt-1">{fieldErrors.fullName}</p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="reg-email" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="reg-email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => handleBlur('email')}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                {touched.email && fieldErrors.email && (
                  <p className="text-[11px] text-red-500 mt-1">{fieldErrors.email}</p>
                )}
              </div>

              {/* Password & Live Entropy Meter */}
              <div>
                <label htmlFor="reg-password" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Password (min. 10 characters)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={() => handleBlur('password')}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-300 ${getPasswordStrengthLabel(passwordScore).bar}`} />
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className={getPasswordStrengthLabel(passwordScore).color}>
                        {getPasswordStrengthLabel(passwordScore).label}
                      </span>
                      <span className="text-slate-400">Argon2id compliant</span>
                    </div>
                  </div>
                )}
                {touched.password && fieldErrors.password && (
                  <p className="text-[11px] text-red-500 mt-1">{fieldErrors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="reg-confirm" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="reg-confirm"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={() => handleBlur('confirmPassword')}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {touched.confirmPassword && fieldErrors.confirmPassword && (
                  <p className="text-[11px] text-red-500 mt-1">{fieldErrors.confirmPassword}</p>
                )}
              </div>

              {/* Patient Specific Fields */}
              {role === 'patient' && (
                <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/60 space-y-3">
                  <h4 className="text-xs font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    Patient Profile & Speaking Background
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Self-Reported Severity
                      </label>
                      <select
                        value={stutterSeverity}
                        onChange={(e) => setStutterSeverity(e.target.value as any)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                      >
                        <option value="mild">Mild (occasional prolongations)</option>
                        <option value="moderate">Moderate (regular blocks/repetitions)</option>
                        <option value="severe">Severe (frequent tension & avoidances)</option>
                        <option value="not_sure">Not Sure / Exploring</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Main Speaking Goal (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Conquer phone anxiety, presentation pacing, gentle onsets"
                      value={primaryGoal}
                      onChange={(e) => setPrimaryGoal(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    />
                  </div>

                  {isMinor() && (
                    <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs space-y-1">
                      <p className="font-bold">Minor Notice (&lt; 18 years):</p>
                      <label className="flex items-center gap-2 cursor-pointer font-medium text-[11px]">
                        <input
                          type="checkbox"
                          checked={parentConsent}
                          onChange={(e) => setParentConsent(e.target.checked)}
                          className="rounded text-amber-600 focus:ring-amber-500"
                        />
                        <span>I confirm parent / legal guardian consent for speech biofeedback</span>
                      </label>
                    </div>
                  )}
                </div>
              )}

              {/* Clinician Specific Fields */}
              {role === 'therapist' && (
                <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 space-y-3">
                  <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5" />
                    Clinical SLP Credentials & Licensure
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Professional Credential
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. CCC-SLP, BCS-F, RCI-SLP"
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        License / Registration No.
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. SLP-948102-CA"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Clinical Institution / Clinic
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Speech Care Institute"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={yearsOfExperience}
                        onChange={(e) => setYearsOfExperience(parseInt(e.target.value, 10) || 1)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Proof of Clinical Licensure (PDF / Document)
                    </label>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl border border-dashed border-slate-300 bg-white text-xs dark:bg-slate-800 dark:border-slate-700">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <span className="text-slate-600 dark:text-slate-300 font-mono text-[11px] flex-1">
                        {proofDocumentName}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold text-[10px]">
                        Attached
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Compliance Checkboxes (DPDP Act 2023 & HIPAA) */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <label className="flex items-start gap-2.5 cursor-pointer text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    required
                    checked={dpdpConsent}
                    onChange={(e) => setDpdpConsent(e.target.checked)}
                    className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                  />
                  <span className="leading-snug text-[11px]">
                    <strong>Required:</strong> I agree to the{' '}
                    <span className="text-teal-700 dark:text-teal-400 underline font-semibold">Terms of Service</span>,{' '}
                    <span className="text-teal-700 dark:text-teal-400 underline font-semibold">Privacy Policy</span>, and grant
                    explicit consent for acoustic processing of my voice under the <strong>DPDP Act 2023</strong>.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={researchConsent}
                    onChange={(e) => setResearchConsent(e.target.checked)}
                    className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                  />
                  <span className="leading-snug text-[11px]">
                    Optional: Allow anonymized speech acoustic metrics to advance academic fluency research.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-600 hover:to-teal-700 disabled:opacity-60 text-white font-bold text-xs shadow-lg shadow-teal-900/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? 'Registering Account...' : 'Create Clinical Account'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* 3. 2FA CODE MODAL */}
          {mode === '2fa' && (
            <form onSubmit={handle2FASubmit} className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center space-y-2">
                <KeyRound className="w-8 h-8 text-teal-600 mx-auto" />
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  A 6-digit TOTP code was requested by your account security policy.
                </p>
              </div>

              <div>
                <label htmlFor="totp-code" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 text-center">
                  Enter 6-Digit Authenticator Code
                </label>
                <input
                  id="totp-code"
                  type="text"
                  maxLength={6}
                  autoFocus
                  placeholder="123456"
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full tracking-widest text-center text-lg font-mono py-3 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
                />
                <p className="text-[10px] text-slate-400 text-center mt-1">
                  Demo code: <code className="text-teal-600 font-bold">123456</code>
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading || totpCode.length < 6}
                className="w-full py-3.5 rounded-2xl bg-teal-700 hover:bg-teal-800 disabled:opacity-60 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? 'Verifying Code...' : 'Confirm & Authenticate'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs text-slate-500 hover:text-teal-700"
                >
                  Back to standard sign in
                </button>
              </div>
            </form>
          )}

          {/* 4. VERIFICATION PENDING */}
          {mode === 'verify_pending' && (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-950 flex items-center justify-center mx-auto text-teal-600">
                <Mail className="w-6 h-6 animate-bounce" />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                We sent a verification email to <strong>{email || 'your registered address'}</strong>. Click the link in the message to activate full account capabilities.
              </p>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-500 border border-slate-200 dark:border-slate-700">
                Token expires in 24 hours. Single-use cryptographic verification.
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleVerifyEmail}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-teal-700 text-white text-xs font-bold hover:bg-teal-800 transition-colors shadow-2xs"
                >
                  Verify Instantly & Proceed
                </button>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors"
                >
                  Go to Sign In
                </button>
                <button
                  type="button"
                  disabled={resendCooldown > 0}
                  onClick={handleResendVerification}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 disabled:opacity-50"
                >
                  {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Resend'}
                </button>
              </div>
            </div>
          )}

          {/* 5. FORGOT PASSWORD */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label htmlFor="forgot-email" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Your Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Protection against user enumeration: a notification is sent if the account exists.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-teal-700 hover:bg-teal-800 disabled:opacity-60 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? 'Sending Link...' : 'Send Secure Reset Link'}
              </button>

              <div className="flex justify-between items-center text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setMode('reset')}
                  className="text-teal-700 dark:text-teal-400 font-medium hover:underline text-[11px]"
                >
                  Have a reset token? Enter here
                </button>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-slate-500 hover:text-teal-700"
                >
                  Back to sign in
                </button>
              </div>
            </form>
          )}

          {/* 6. RESET PASSWORD FORM */}
          {mode === 'reset' && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Reset Token
                </label>
                <input
                  type="text"
                  required
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  New Password (min. 10 chars)
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-teal-700 hover:bg-teal-800 disabled:opacity-60 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? 'Updating Password...' : 'Save New Password & Sign In'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs text-slate-500 hover:text-teal-700"
                >
                  Back to sign in
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

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
  Check
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
          setMode('verify_pending');
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
          setMode('verify_pending');
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
    <div className="mx-auto max-w-xl space-y-6 pt-4 pb-20 px-4 sm:px-0">
      {/* Clinician Verification in Progress notice if logged in as pending clinician */}
      {user && user.verificationStatus === 'pending_verification' && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-xs">
            <h4 className="font-bold text-sm">SLP Clinical Verification in Progress</h4>
            <p className="mt-1">
              Your speech pathology license ({user.licenseNumber || 'CCC-SLP'}) is currently undergoing administrative review.
              To protect patient confidentiality, access to patient caseload data is locked until your credentials are confirmed.
            </p>
          </div>
        </div>
      )}

      {/* Main Single Centered Auth Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-xl space-y-6 transition-all">
        {/* Top Header & Logo */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400 flex items-center justify-center mx-auto shadow-2xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {mode === 'login' && 'Sign in to FluencyAI'}
            {mode === 'register' && 'Create Your Fluency Account'}
            {mode === 'forgot' && 'Reset Your Password'}
            {mode === 'reset' && 'Set a New Password'}
            {mode === '2fa' && 'Two-Factor Authentication'}
            {mode === 'verify_pending' && 'Check Your Email'}
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {mode === 'login' && 'Welcome back. Access your acoustic biofeedback, daily tasks, and speech sessions.'}
            {mode === 'register' && 'Personalized evidence-based speech practice with clinical privacy controls.'}
            {mode === 'forgot' && 'Enter your registered email to receive a secure password reset link.'}
            {mode === 'reset' && 'Create a strong, entropy-based password to secure your speech records.'}
            {mode === '2fa' && 'Enter the 6-digit verification code from your authenticator app.'}
            {mode === 'verify_pending' && 'We have sent a secure single-use verification link to your email.'}
          </p>
        </div>

        {/* Tab Toggle for Sign In vs Create Account */}
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
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
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
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
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
            className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{generalError}</span>
          </div>
        )}

        {/* Success Banner */}
        {successMessage && (
          <div
            role="status"
            className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* CapsLock Warning */}
        {capsLockActive && (
          <div className="p-2 rounded-lg bg-amber-50 text-amber-700 text-[11px] font-semibold flex items-center gap-1.5 border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            Caps Lock is ON.
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
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
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
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 ${
                    touched.email && fieldErrors.email
                      ? 'border-red-400 focus:ring-red-300'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-teal-500'
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
                  className="text-[11px] font-medium text-teal-700 hover:text-teal-800 dark:text-teal-400"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
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
                  className={`w-full pl-9 pr-10 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 ${
                    touched.password && fieldErrors.password
                      ? 'border-red-400 focus:ring-red-300'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-teal-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {touched.password && fieldErrors.password && (
                <p className="text-[11px] text-red-500 mt-1">{fieldErrors.password}</p>
              )}
            </div>

            {/* Role Helper for quick sign-in test */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={keepMeSignedIn}
                  onChange={(e) => setKeepMeSignedIn(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span>Keep me signed in</span>
              </label>

              <span className="text-[11px] text-slate-400">
                Role: <button type="button" onClick={() => setRole(role === 'patient' ? 'therapist' : 'patient')} className="text-teal-700 dark:text-teal-400 font-bold capitalize hover:underline">{role}</button>
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 disabled:opacity-60 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? 'Verifying Credentials...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Demo Pre-fills */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[10px] text-slate-400 text-center mb-1.5">Quick Clinical Testing Presets:</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('alex.patient@fluencyai.org');
                    setPassword('clinicalSample2026!');
                    setRole('patient');
                  }}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-teal-50 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 font-medium"
                >
                  Alex (Patient)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('marcus.vance@speechclinic.org');
                    setPassword('slpSpecialist2026!');
                    setRole('therapist');
                  }}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-teal-50 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 font-medium"
                >
                  Dr. Vance (SLP)
                </button>
              </div>
            </div>
          </form>
        )}

        {/* 2. REGISTRATION FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4" noValidate>
            {/* Step 1: Role Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                I am registering as:
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setRole('patient')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    role === 'patient'
                      ? 'border-teal-600 bg-teal-50/70 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">Patient</span>
                    {role === 'patient' && <Check className="w-4 h-4 text-teal-600" />}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">Person who stutters or parent</p>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('therapist')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    role === 'therapist'
                      ? 'border-teal-600 bg-teal-50/70 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">Speech Clinician</span>
                    {role === 'therapist' && <Check className="w-4 h-4 text-teal-600" />}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">SLP, BCS-F, RCI certified</p>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="reg-name" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Legal Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  id="reg-name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder={role === 'therapist' ? 'Dr. Marcus Vance, CCC-SLP' : 'Alex Johnson'}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onBlur={() => handleBlur('fullName')}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="reg-email" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  id="reg-email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Password with Live Entropy Meter */}
            <div>
              <label htmlFor="reg-password" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Password (min. 10 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
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
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
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
                    <span className="text-slate-400">k-anonymity verified</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="reg-confirm" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  id="reg-confirm"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => handleBlur('confirmPassword')}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Patient Specific Fields */}
            {role === 'patient' && (
              <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900 space-y-3">
                <h4 className="text-xs font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  Patient Profile & Stuttering History
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
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Self-Reported Severity
                    </label>
                    <select
                      value={stutterSeverity}
                      onChange={(e) => setStutterSeverity(e.target.value as any)}
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-slate-200"
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
                    placeholder="e.g. Conquer anticipatory phone anxiety, job interview prep"
                    value={primaryGoal}
                    onChange={(e) => setPrimaryGoal(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  />
                </div>

                {isMinor() && (
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-amber-900 text-xs space-y-1">
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
              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900 space-y-3">
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
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      License / RCI Registration No.
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SLP-948102-CA"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-slate-200"
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
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-slate-200"
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
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Proof of Clinical Licensure (PDF / Document)
                  </label>
                  <div className="flex items-center gap-2 p-2 rounded-xl border border-dashed border-slate-300 bg-white text-xs dark:bg-slate-800 dark:border-slate-700">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span className="text-slate-600 dark:text-slate-300 font-mono text-[11px] flex-1">
                      {proofDocumentName}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold text-[10px]">
                      Attached
                    </span>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-amber-50 text-amber-800 text-[11px] border border-amber-200 flex items-start gap-1.5">
                  <Clock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>
                    Clinician accounts require license verification before patient caseloads can be viewed.
                  </span>
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
                  className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="leading-snug text-[11px]">
                  <strong>Required:</strong> I agree to the{' '}
                  <span className="text-teal-700 dark:text-teal-400 underline">Terms of Service</span>,{' '}
                  <span className="text-teal-700 dark:text-teal-400 underline">Privacy Policy</span>, and grant
                  explicit consent for acoustic processing of my voice under the <strong>DPDP Act 2023</strong>.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={researchConsent}
                  onChange={(e) => setResearchConsent(e.target.checked)}
                  className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="leading-snug text-[11px]">
                  Optional: Allow anonymized speech acoustic metrics to advance academic fluency research.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 disabled:opacity-60 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
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
                className="w-full tracking-widest text-center text-lg font-mono py-2.5 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
              />
              <p className="text-[10px] text-slate-400 text-center mt-1">
                Demo code: <code className="text-teal-600 font-bold">123456</code>
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || totpCode.length < 6}
              className="w-full py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 disabled:opacity-60 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? 'Verifying Code...' : 'Confirm & Authenticate'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-slate-500 hover:text-teal-700"
              >
                Back to standard login
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
                Simulate Clicking Email Link
              </button>
              <button
                type="button"
                disabled={resendCooldown > 0}
                onClick={handleResendVerification}
                className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 disabled:opacity-50"
              >
                {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Resend Email'}
              </button>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-slate-500 hover:text-teal-700"
              >
                Return to sign in
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
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  id="forgot-email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Protection against user enumeration: a notification is sent if the account exists.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 disabled:opacity-60 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? 'Sending Link...' : 'Send Secure Reset Link'}
            </button>

            <div className="flex justify-between items-center text-xs pt-1">
              <button
                type="button"
                onClick={() => setMode('reset')}
                className="text-teal-700 dark:text-teal-400 font-medium hover:underline text-[11px]"
              >
                Have a reset token? Enter it here
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
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200"
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
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200"
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
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 disabled:opacity-60 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
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

      {/* Compliance & Security Guarantee Card */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
          <span>
            <strong>DPDP Act 2023 & HIPAA Scoped:</strong> Speech recordings are processed in-browser. Zero audio retention without explicit clinician-sharing consent.
          </span>
        </div>
        <span className="font-mono text-[10px] text-teal-700 dark:text-teal-400 shrink-0">
          Argon2id • TOTP • SameSite Cookies
        </span>
      </div>
    </div>
  );
};

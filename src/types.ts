export type UserRole = 'patient' | 'therapist' | 'admin';
export type AppTheme = 'teal' | 'indigo' | 'warm';
export type FontSize = 'normal' | 'large';

export type VerificationStatus = 'verified' | 'pending_verification' | 'rejected';

export interface UserSession {
  id: string;
  deviceInfo: string;
  ip: string;
  browser: string;
  createdAt: string;
  lastUsedAt: string;
  current: boolean;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatar?: string;
  preferredTheme?: AppTheme;
  fontSize?: FontSize;
  assignedTherapistId?: string;
  baselineDisfluencyRate?: number;
  streakDays?: number;
  bio?: string;
  specialization?: string;
  clinicName?: string;
  credentials?: string;
  // Enhanced Auth, Security & Clinical Compliance Fields
  emailVerified: boolean;
  verificationStatus: VerificationStatus;
  licenseNumber?: string;
  institution?: string;
  yearsOfExperience?: number;
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  totpCode?: string;
  recoveryCodes?: string[];
  lastLoginAt?: string;
  lastLoginIp?: string;
  dateOfBirth?: string;
  parentConsentGiven?: boolean;
  stutterSeverity?: 'mild' | 'moderate' | 'severe' | 'not_sure';
  primaryGoal?: string;
  researchConsent?: boolean;
  dpdpConsent?: boolean;
  activeSessions?: UserSession[];
  accountDeletionScheduled?: string; // 7-day grace period timestamp
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  credentials: string;
  specialties: string[];
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  hourlyRate: number;
  bio: string;
  avatar: string;
  availableDays: string[];
  timeSlots: string[];
  location: string;
  acceptsInsurance: boolean;
  virtualAvailable: boolean;
  inPersonAvailable: boolean;
  licenseNumber?: string;
  telepracticeSecurity?: string;
  clinicalApproach?: string[];
  languages?: string[];
  insuranceAccepted?: string[];
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorAvatar: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  date: string;
  timeSlot: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  sessionType: 'virtual' | 'in-person';
  reason: string;
  attachedSessionId?: string;
  clinicalNotes?: string;
  meetLink?: string;
  createdAt: string;
}

export interface AudioFeatures {
  f0FundamentalPitchHz: number;
  pitchStabilityPct: number;
  jitterPct: number;
  shimmerPct: number;
  speakingRateSyllablesPerSec: number;
  prolongationCount: number;
  repetitionCount: number;
  blockCount: number;
  vocalStrainIndex: number;
}

export interface DisfluencyEvent {
  timestampMs: number;
  type: 'repetition' | 'prolongation' | 'block' | 'interjection';
  durationMs: number;
  confidencePct: number;
  phonemeOrWord: string;
}

export interface MLModelOutput {
  inferenceId: string;
  overallFluencyScore: number;
  disfluencyFrequencyPct: number;
  speechRateWpm: number;
  features: AudioFeatures;
  detectedEvents: DisfluencyEvent[];
  transcription: string;
  clinicalImpression: string;
  suggestedTechniques: string[];
  confidenceLevel: number;
  inferenceDurationMs: number;
  modelArchitecture: string;
}

export interface Exercise {
  id: string;
  title: string;
  category: 'diaphragmatic' | 'gentle_onset' | 'continuous_phonation' | 'cancellation' | 'pull_out' | 'pacing';
  targetPacingWpm: number;
  durationMinutes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  sampleText: string;
  promptAudioUrl?: string;
}

export interface PracticeSession {
  id: string;
  userId: string;
  exerciseId: string;
  exerciseTitle: string;
  recordedAt: string;
  durationSeconds: number;
  fluencyScore: number;
  wpm: number;
  disfluencyRate: number;
  repetitionsCount: number;
  prolongationsCount: number;
  blocksCount: number;
  transcription?: string;
  mlResult?: MLModelOutput;
  aiNotes?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'therapist';
  content: string;
  timestamp: string;
  sentiment?: 'positive' | 'anxious' | 'neutral' | 'discouraged' | 'encouraged';
  suggestedAction?: string;
}

export interface TherapyExercise {
  id: string;
  title: string;
  description: string;
  category: 'breathing' | 'slow_speaking' | 'reading' | 'conversation' | 'confidence' | 'difficult_words' | 'daily_challenges' | string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  durationMinutes: number;
  instructions: string[];
  tips: string[];
  targetWpm?: number;
  targetPaceWpm?: number;
  sampleText?: string;
  passageText?: string;
  promptScenarios?: string[];
  targetWords?: string[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlockedAt?: string;
  category: string;
}

export interface DailyTask {
  id: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  title: string;
  category: string;
  durationMinutes: number;
  completed: boolean;
  exerciseId: string;
  description: string;
  completedAt?: string;
  targetRoute?: string;
}

export interface DailyPracticePlan {
  day: number;
  title: string;
  completed: boolean;
  tasks: DailyTask[];
}


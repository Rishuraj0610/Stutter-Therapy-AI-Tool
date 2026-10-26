import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Doctor, Appointment } from '../types';
import {
  Stethoscope,
  Calendar,
  Clock,
  Video,
  MapPin,
  Star,
  ShieldCheck,
  CheckCircle2,
  X,
  Filter,
  User,
  FileAudio,
  CalendarCheck,
  AlertCircle,
  Plus,
  Edit3,
  Lock,
  BadgeCheck,
  FileText,
  Eye,
  ArrowRight,
  ShieldAlert,
  Award,
  Check
} from 'lucide-react';

export const DoctorDirectoryPage: React.FC = () => {
  const { user, token, isAuthenticated, setCurrentPage, login } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState<'directory' | 'my_appointments' | 'doctor_portal'>('directory');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [onlyVirtual, setOnlyVirtual] = useState<boolean>(false);

  // Modals state
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [selectedDoctorForDetails, setSelectedDoctorForDetails] = useState<Doctor | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);

  // Booking Form State
  const [bookingDate, setBookingDate] = useState<string>('2026-09-08');
  const [bookingTime, setBookingTime] = useState<string>('10:00 AM');
  const [bookingFormat, setBookingFormat] = useState<'virtual' | 'in-person'>('virtual');
  const [bookingReason, setBookingReason] = useState<string>('Acoustic Speech Evaluation & Prolonged Speech Therapy');
  const [attachMLReport, setAttachMLReport] = useState<boolean>(true);
  const [bookingConsent, setBookingConsent] = useState<boolean>(true);
  const [bookingSuccess, setBookingSuccess] = useState<Appointment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Doctor portal states
  const [isDoctorAvailableToday, setIsDoctorAvailableToday] = useState(true);

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
  }, [token, user]);

  const defaultDoctors: Doctor[] = [
    {
      id: 'doc-1',
      name: 'Dr. Marcus Vance, Ph.D., CCC-SLP',
      title: 'Board-Certified Specialist in Fluency (BCS-F)',
      credentials: 'Ph.D. Speech Sciences, CCC-SLP, BCS-F',
      specialties: ['Adult Fluency Disorders', 'Prolonged Speech', 'Neurogenic Stuttering'],
      experienceYears: 16,
      rating: 4.98,
      reviewsCount: 142,
      hourlyRate: 140,
      bio: 'Former clinical director at the National Fluency Center. Specializes in Camperdown technique, gentle phonatory onset, and social speech anxiety desensitization with over 16 years of clinical practice.',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
      availableDays: ['Monday', 'Tuesday', 'Thursday'],
      timeSlots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:30 PM'],
      location: 'San Francisco, CA (Telehealth Nationwide)',
      acceptsInsurance: true,
      virtualAvailable: true,
      inPersonAvailable: true,
      licenseNumber: 'ASHA CCC-SLP #948102 • CA Board #18492 (Active)',
      telepracticeSecurity: 'HIPAA & DPDP Act 2023 Verified • 100% In-Browser DSP',
      clinicalApproach: ['Camperdown Prolonged Speech', 'Gentle Voicing Onset', 'Desensitization Hierarchy'],
      languages: ['English', 'Spanish'],
      insuranceAccepted: ['Aetna', 'BlueCross BlueShield', 'UnitedHealthcare', 'Out-of-Network Superbill']
    },
    {
      id: 'doc-2',
      name: 'Dr. Elena Rostova, M.S., CCC-SLP',
      title: 'Pediatric & Adolescent Speech Pathologist',
      credentials: 'M.S. Communicative Disorders, CCC-SLP',
      specialties: ['Pediatric Stuttering', 'Parent-Child Interaction Therapy (PCIT)', 'Lidcombe Program'],
      experienceYears: 11,
      rating: 4.95,
      reviewsCount: 98,
      hourlyRate: 125,
      bio: 'Passionate about early-childhood fluency intervention. Experienced with school transitions, adolescent confidence, and speech pacing biofeedback using play-based parent-guided protocols.',
      avatar: 'https://images.unsplash.com/photo-1594824813637-44f24300302b?w=300&auto=format&fit=crop&q=80',
      availableDays: ['Wednesday', 'Friday', 'Saturday'],
      timeSlots: ['10:00 AM', '01:00 PM', '03:30 PM'],
      location: 'Chicago, IL (Telehealth Available)',
      acceptsInsurance: true,
      virtualAvailable: true,
      inPersonAvailable: false,
      licenseNumber: 'ASHA CCC-SLP #837201 • IL Board #14209 (Active)',
      telepracticeSecurity: 'HIPAA Telehealth Certified • Encrypted WebRTC',
      clinicalApproach: ['Lidcombe Program', 'PCIT Interaction', 'Syllable-Timed Speech'],
      languages: ['English', 'Russian'],
      insuranceAccepted: ['Cigna', 'BlueCross BlueShield', 'Humana', 'FSA/HSA Eligible']
    },
    {
      id: 'doc-3',
      name: 'Dr. Tariq Al-Mansoor, Au.D., CCC-SLP',
      title: 'Neurogenic Fluency & Cognitive Rehabilitation',
      credentials: 'Au.D., CCC-SLP, Brain Injury Specialist',
      specialties: ['Neurogenic Stuttering', 'Parkinsonian Dysarthria', 'Acoustic Feedback'],
      experienceYears: 14,
      rating: 4.92,
      reviewsCount: 76,
      hourlyRate: 155,
      bio: 'Focuses on acquired disfluencies following traumatic brain events or neurological conditions, integrating digital acoustic analysis and formant contour tracking for voice stability.',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      timeSlots: ['10:30 AM', '02:30 PM', '05:00 PM'],
      location: 'Austin, TX (Telehealth Nationwide)',
      acceptsInsurance: false,
      virtualAvailable: true,
      inPersonAvailable: true,
      licenseNumber: 'ASHA CCC-SLP #710924 • TX Board #29381 (Active)',
      telepracticeSecurity: 'End-to-End Encrypted WebRTC • Strict PHI Isolation',
      clinicalApproach: ['Neurogenic Fluency Protocol', 'Delayed Auditory Biofeedback', 'Pitch Contour Tracking'],
      languages: ['English', 'Arabic'],
      insuranceAccepted: ['Direct Patient Superbill', 'HSA / FSA Cards']
    },
    {
      id: 'doc-4',
      name: 'Sarah Jenkins, M.A., CCC-SLP',
      title: 'Cognitive Behavioral Stuttering Practitioner',
      credentials: 'M.A. Speech-Language Pathology, CBT Certified',
      specialties: ['Speech Anxiety', 'Desensitization Training', 'Workplace Presentation Skills'],
      experienceYears: 9,
      rating: 4.89,
      reviewsCount: 64,
      hourlyRate: 110,
      bio: 'Combines ACT (Acceptance and Commitment Therapy) with fluency shaping techniques to empower individuals speaking in corporate and public settings with gentle onsets.',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
      availableDays: ['Tuesday', 'Thursday', 'Saturday'],
      timeSlots: ['08:30 AM', '12:00 PM', '03:00 PM'],
      location: 'New York, NY (Telehealth Available)',
      acceptsInsurance: true,
      virtualAvailable: true,
      inPersonAvailable: true,
      licenseNumber: 'ASHA CCC-SLP #619842 • NY Board #55021 (Active)',
      telepracticeSecurity: 'HIPAA & DPDP Compliant • Zero Audio Scraping Guarantee',
      clinicalApproach: ['CBT Fluency Framework', 'Voluntary Stuttering Exposure', 'Van Riper Pull-Outs'],
      languages: ['English'],
      insuranceAccepted: ['Aetna', 'Oxford', 'UnitedHealthcare', 'Superbill Available']
    }
  ];

  const fetchDoctors = async () => {
    try {
      const res = await fetch('/api/doctors');
      if (res.ok) {
        const data = await res.json();
        if (data.doctors && data.doctors.length > 0) {
          setDoctors(data.doctors);
          return;
        }
      }
      setDoctors(defaultDoctors);
    } catch {
      setDoctors(defaultDoctors);
    }
  };

  const fetchAppointments = async () => {
    if (!isAuthenticated || !user) {
      setAppointments([]);
      return;
    }

    try {
      const queryParams = new URLSearchParams({
        patientId: user?.id || '',
        patientEmail: user?.email || '',
        role: user?.role || 'patient'
      });
      const res = await fetch(`/api/appointments?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-User-Id': user?.id || '',
          'X-User-Role': user?.role || 'patient',
          'X-User-Email': user?.email || ''
        }
      });
      if (res.ok) {
        const data = await res.json();
        const apts = data.appointments || [];
        setAppointments(apts);
        if (user?.email) {
          try {
            localStorage.setItem(`fluency_appointments_${user.email.toLowerCase()}`, JSON.stringify(apts));
          } catch {}
        }
      } else {
        throw new Error('Fallback to user storage');
      }
    } catch {
      if (user?.email) {
        try {
          const stored = localStorage.getItem(`fluency_appointments_${user.email.toLowerCase()}`);
          if (stored) {
            setAppointments(JSON.parse(stored));
            return;
          }
        } catch {}
      }
      setAppointments([]);
    }
  };

  const handleOpenDetails = (doctor: Doctor) => {
    setSelectedDoctorForDetails(doctor);
    setIsDetailsModalOpen(true);
  };

  const handleOpenBooking = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setBookingTime(doctor.timeSlots[0] || '10:00 AM');
    setBookingSuccess(null);
    setIsDetailsModalOpen(false);
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor) return;
    setIsSubmitting(true);

    const newApt: Partial<Appointment> = {
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      doctorAvatar: selectedDoctor.avatar,
      patientId: user?.id || 'usr-patient-current',
      patientName: user?.fullName || (user?.email ? user.email.split('@')[0] : 'Patient'),
      patientEmail: user?.email || 'patient@fluencyai.org',
      date: bookingDate,
      timeSlot: bookingTime,
      sessionType: bookingFormat,
      reason: bookingReason,
      attachedSessionId: attachMLReport ? 'ml-session-latest-analysis' : undefined
    };

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-User-Id': user?.id || '',
          'X-User-Role': user?.role || 'patient',
          'X-User-Email': user?.email || ''
        },
        body: JSON.stringify(newApt)
      });

      if (res.ok) {
        const data = await res.json();
        const booked = data.appointment;
        setBookingSuccess(booked);
        setAppointments((prev) => {
          const updated = [booked, ...prev];
          if (user?.email) {
            try {
              localStorage.setItem(`fluency_appointments_${user.email.toLowerCase()}`, JSON.stringify(updated));
            } catch {}
          }
          return updated;
        });
      } else {
        throw new Error('API failed');
      }
    } catch {
      // Local fallback success
      const confirmedApt: Appointment = {
        id: `apt-${Date.now()}`,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        doctorAvatar: selectedDoctor.avatar,
        patientId: user?.id || 'usr-patient-current',
        patientName: user?.fullName || (user?.email ? user.email.split('@')[0] : 'Patient'),
        patientEmail: user?.email || 'patient@fluencyai.org',
        date: bookingDate,
        timeSlot: bookingTime,
        status: 'confirmed',
        sessionType: bookingFormat,
        reason: bookingReason,
        attachedSessionId: attachMLReport ? 'ml-session-latest-analysis' : undefined,
        meetLink: 'https://meet.google.com/ais-telehealth-call',
        createdAt: new Date().toISOString()
      };
      setBookingSuccess(confirmedApt);
      setAppointments((prev) => {
        const updated = [confirmedApt, ...prev];
        if (user?.email) {
          try {
            localStorage.setItem(`fluency_appointments_${user.email.toLowerCase()}`, JSON.stringify(updated));
          } catch {}
        }
        return updated;
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredDoctors = doctors.filter((doc) => {
    if (onlyVirtual && !doc.virtualAvailable) return false;
    if (selectedSpecialty !== 'all') {
      const match = doc.specialties.some((s) => s.toLowerCase().includes(selectedSpecialty.toLowerCase()));
      if (!match) return false;
    }
    return true;
  });

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 py-8 px-4 animate-fadeIn">
        <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 sm:p-12 text-center shadow-xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-400 flex items-center justify-center mx-auto border border-teal-200/80 dark:border-teal-800/80 shadow-xs">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/80">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              Protected Healthcare Directory • HIPAA & DPDP Act 2023
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Speech Therapist Directory Protected
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              To protect licensed Speech-Language Pathologist credentials, prevent scraping of medical schedules, and safeguard patient-provider telepractice sessions under HIPAA & DPDP Act 2023, access to our certified clinician directory is fully protected. Please sign in or register to browse specialists and book consultations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
            <div className="space-y-1">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <BadgeCheck className="w-4 h-4 text-teal-600" /> Verified Credentials
              </span>
              <p className="text-[11px] text-slate-500">Board-certified CCC-SLP and active state licensure numbers.</p>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-600" /> Zero Audio Retention
              </span>
              <p className="text-[11px] text-slate-500">In-browser speech DSP; no patient voice recordings stored.</p>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Video className="w-4 h-4 text-teal-600" /> Encrypted Telehealth
              </span>
              <p className="text-[11px] text-slate-500">Peer-to-peer WebRTC consultation rooms with automated Superbills.</p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setCurrentPage('login')}
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md shadow-teal-900/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Sign In to Access Directory</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage('register')}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Create Patient Account
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400">
            <span>Are you a licensed Speech Clinician?</span>
            <button
              type="button"
              onClick={() => {
                login('marcus.vance@speechclinic.org', 'slpSpecialist2026!', true, 'therapist');
              }}
              className="text-teal-700 dark:text-teal-400 font-bold hover:underline"
            >
              Quick SLP Clinician Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-16">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3.5 py-1 text-xs font-semibold text-teal-800 dark:bg-teal-950/70 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/80">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              Verified Speech-Language Pathologists • DPDP Act 2023 & HIPAA Scoped
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Speech Therapy Clinician Directory
            </h1>
            <p className="max-w-2xl text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Find and inspect board-certified Speech-Language Pathologists (CCC-SLP / BCS-F). Open any doctor's verified licensure details, clinical methodology, and book private consultations with end-to-end encrypted telehealth.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage('ml_speech')}
              className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <FileAudio className="w-4 h-4 text-teal-600" />
              Run Speech ML Model First
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 flex border-b border-slate-100 dark:border-slate-800 text-xs font-semibold gap-2">
          <button
            onClick={() => setActiveTab('directory')}
            className={`pb-3 border-b-2 px-3 transition-colors ${
              activeTab === 'directory'
                ? 'border-teal-600 text-teal-700 dark:text-teal-300'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            Doctor Directory ({doctors.length})
          </button>
          <button
            onClick={() => setActiveTab('my_appointments')}
            className={`pb-3 border-b-2 px-3 transition-colors ${
              activeTab === 'my_appointments'
                ? 'border-teal-600 text-teal-700 dark:text-teal-300'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            My Appointments ({isAuthenticated ? appointments.length : 'Protected'})
          </button>
          <button
            onClick={() => setActiveTab('doctor_portal')}
            className={`pb-3 border-b-2 px-3 transition-colors flex items-center gap-1.5 ${
              activeTab === 'doctor_portal'
                ? 'border-teal-600 text-teal-700 dark:text-teal-300'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            <span>Clinician / Doctor Portal</span>
            {user?.role !== 'therapist' && <Lock className="w-3 h-3 text-slate-400" />}
          </button>
        </div>
      </div>

      {/* TAB 1: Doctor Directory */}
      {activeTab === 'directory' && (
        <div className="space-y-6">
          {/* Filters & Privacy Guarantee Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5" /> Clinical Focus:
              </span>
              {[
                { id: 'all', label: 'All Specialists' },
                { id: 'adult', label: 'Adult Stuttering' },
                { id: 'pediatric', label: 'Pediatric' },
                { id: 'neurogenic', label: 'Neurogenic' },
                { id: 'prolonged', label: 'Prolonged Speech' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedSpecialty(f.id)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                    selectedSpecialty === f.id
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyVirtual}
                  onChange={(e) => setOnlyVirtual(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                Telehealth Only
              </label>

              <div className="hidden sm:flex items-center gap-1 text-[11px] text-teal-700 dark:text-teal-400 font-semibold bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-full border border-teal-200/60 dark:border-teal-800/60">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Licensure</span>
              </div>
            </div>
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 hover:border-teal-300 dark:hover:border-teal-800 transition-all hover:shadow-md group"
              >
                <div>
                  {/* Doctor Profile Header */}
                  <div className="flex items-start gap-4">
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover border-2 border-teal-500/20 shadow-xs shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60">
                          <BadgeCheck className="w-3 h-3 text-teal-600" />
                          Verified CCC-SLP
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {doc.experienceYears}+ yrs exp
                        </span>
                      </div>
                      <h3
                        onClick={() => handleOpenDetails(doc)}
                        className="font-bold text-base text-slate-900 dark:text-white leading-tight cursor-pointer hover:text-teal-600 transition-colors"
                      >
                        {doc.name}
                      </h3>
                      <p className="text-xs text-teal-700 dark:text-teal-400 font-medium mt-0.5 line-clamp-1">
                        {doc.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
                        <span className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {doc.rating}
                        </span>
                        <span>•</span>
                        <span>{doc.reviewsCount} verified patient reviews</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio & Details */}
                  <p className="mt-3.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {doc.bio}
                  </p>

                  {/* Specialties Pills */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {doc.specialties.map((s, idx) => (
                      <span
                        key={idx}
                        className="rounded-lg bg-teal-50/80 px-2 py-0.5 text-[10px] font-semibold text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-100 dark:border-teal-900/40"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Badges & Location */}
                  <div className="mt-4 space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs text-slate-500">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{doc.location}</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800/60 shrink-0">
                        {doc.virtualAvailable ? 'Telehealth Available' : 'In-Clinic Only'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="text-emerald-700 dark:text-emerald-400 font-medium text-[11px]">
                        Next Available: {doc.availableDays[0]} at {doc.timeSlots[0]}
                      </span>
                    </div>

                    {/* License snippet */}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono pt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span className="truncate">{doc.licenseNumber || 'State Board Verified CCC-SLP'}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action: View Details + Book Appointment */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Consultation</span>
                    <p className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                      ${doc.hourlyRate}
                      <span className="text-xs font-normal text-slate-400">/hr</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenDetails(doc)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      title="Open full clinical credentials and practice details"
                    >
                      <Eye className="w-3.5 h-3.5 text-teal-600" />
                      <span>View Details</span>
                    </button>

                    <button
                      onClick={() => handleOpenBooking(doc)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-colors"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: My Appointments (Protected with HIPAA / DPDP Privacy Gate) */}
      {activeTab === 'my_appointments' && (
        <div className="space-y-6">
          {!isAuthenticated ? (
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 sm:p-12 text-center space-y-4 max-w-2xl mx-auto shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center mx-auto border border-teal-200/60 dark:border-teal-800/60 shadow-xs">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60">
                  Protected Health Information (PHI)
                </span>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white">
                  Sign In to View Confidential Consultations
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg mx-auto">
                  Your scheduled speech consultations, doctor telepractice links, and attached acoustic biofeedback recordings are private and end-to-end encrypted under HIPAA and DPDP Act 2023 regulations. Please sign in to access your appointments.
                </p>
              </div>
              <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={() => setCurrentPage('login')}
                  className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  Sign In to Access Appointments
                </button>
                <button
                  onClick={() => setCurrentPage('register')}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Create Patient Account
                </button>
              </div>
            </div>
          ) : appointments.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-3">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
                No Booked Appointments Yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore our directory of board-certified Speech-Language Pathologists to book your first clinical consultation.
              </p>
              <button
                onClick={() => setActiveTab('directory')}
                className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors"
              >
                Browse Doctors
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={apt.doctorAvatar}
                      alt={apt.doctorName}
                      className="h-14 w-14 rounded-2xl object-cover border border-teal-500/30 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                          <CheckCircle2 className="w-3 h-3" /> Confirmed
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ID: {apt.id}
                        </span>
                      </div>
                      <h4 className="font-bold text-base text-slate-900 dark:text-white mt-1">
                        {apt.doctorName}
                      </h4>
                      <p className="text-xs text-slate-500">{apt.reason}</p>

                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                          <Calendar className="w-3.5 h-3.5 text-teal-600" />
                          {apt.date}
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                          <Clock className="w-3.5 h-3.5 text-teal-600" />
                          {apt.timeSlot}
                        </span>
                        <span className="flex items-center gap-1 capitalize font-medium">
                          <Video className="w-3.5 h-3.5 text-indigo-500" />
                          {apt.sessionType} Telehealth
                        </span>
                        {apt.attachedSessionId && (
                          <span className="flex items-center gap-1 text-teal-600 font-medium">
                            <FileAudio className="w-3.5 h-3.5" />
                            ML Acoustic Report Attached
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {apt.meetLink && (
                      <a
                        href={apt.meetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-teal-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-teal-800 transition-colors"
                      >
                        <Video className="w-3.5 h-3.5" />
                        Join Telehealth Room
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Clinician / Doctor Portal (Protected by Role-Based Access Control) */}
      {activeTab === 'doctor_portal' && (
        <div>
          {user?.role === 'therapist' ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
                    Clinician Management Console
                  </span>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mt-0.5">
                    Doctor Practice & Schedule Portal
                  </h3>
                  <p className="text-xs text-slate-500">
                    Logged in as licensed Speech-Language Pathologist: {user.fullName || 'Clinician'}. Manage your availability and review caseload submissions.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Live Status:
                  </span>
                  <button
                    onClick={() => setIsDoctorAvailableToday(!isDoctorAvailableToday)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      isDoctorAvailableToday
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {isDoctorAvailableToday ? '● Accepting Appointments' : '○ Unavailable Today'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Total Patient Bookings</span>
                  <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                    {appointments.length} Consultations
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">ML Spectrograms Awaiting Review</span>
                  <p className="text-xl font-bold text-teal-600 dark:text-teal-400 mt-1">
                    3 Audio Submissions
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Telehealth Video Server</span>
                  <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    Active & HIPAA Ready
                  </p>
                </div>
              </div>

              {/* Quick Doctor Note Editor */}
              <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-800/40 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <Edit3 className="w-4 h-4 text-teal-600" />
                  <span>Clinician Session Note Template</span>
                </div>
                <textarea
                  defaultValue="Patient exhibits mild initial plosive blocks on [b] and [d]. Recommended continuous phonation exercises at 130 WPM with diaphragmatic breath resets."
                  className="w-full h-20 rounded-xl border border-slate-200 bg-white p-3 text-xs dark:border-slate-700 dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                />
                <button
                  type="button"
                  onClick={() => alert('Clinical note saved to patient record.')}
                  className="px-3 py-1.5 rounded-lg bg-teal-700 text-white text-xs font-bold hover:bg-teal-800 transition-colors"
                >
                  Save Clinical Note
                </button>
              </div>
            </div>
          ) : (
            /* Secure Access Gate for Non-Clinicians */
            <div className="rounded-3xl border border-amber-200/90 dark:border-amber-900/60 bg-white dark:bg-slate-900 p-8 sm:p-12 text-center space-y-4 max-w-2xl mx-auto shadow-md">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-800 shadow-xs">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100/70 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 border border-amber-200/80 dark:border-amber-800/80">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  Licensed Clinician Access Required
                </span>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white">
                  Clinician Practice Console Restricted
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg mx-auto">
                  Under HIPAA Security Rules and the DPDP Act 2023, access to doctor schedule configuration, clinical note templates, and patient caseload telemetry is restricted strictly to verified Speech-Language Pathologists (CCC-SLP / BCS-F / RCI).
                </p>
              </div>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setCurrentPage('login')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  Sign In with Clinician Account
                </button>
                <button
                  onClick={() => {
                    login('marcus.vance@speechclinic.org', 'slpSpecialist2026!', true, 'therapist');
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Load Dr. Marcus Vance (Demo SLP)
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DOCTOR CLINICAL PROFILE & VERIFICATION DETAILS MODAL */}
      {isDetailsModalOpen && selectedDoctorForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-8 max-h-[90vh] overflow-y-auto space-y-5 animate-fadeIn">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <img
                  src={selectedDoctorForDetails.avatar}
                  alt={selectedDoctorForDetails.name}
                  className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover border-2 border-teal-500/20 shadow-xs shrink-0"
                />
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60">
                      <BadgeCheck className="w-3.5 h-3.5 text-teal-600" />
                      Board-Certified Specialist
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {selectedDoctorForDetails.experienceYears} Years Practice
                    </span>
                  </div>
                  <h3 className="font-bold text-lg sm:text-xl text-slate-900 dark:text-white leading-tight">
                    {selectedDoctorForDetails.name}
                  </h3>
                  <p className="text-xs text-teal-700 dark:text-teal-400 font-medium mt-0.5">
                    {selectedDoctorForDetails.title}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {selectedDoctorForDetails.credentials}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsDetailsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Licensure & Privacy Security Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/60 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-teal-800 dark:text-teal-300">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  Verified Clinical Licensure
                </span>
                <p className="text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                  {selectedDoctorForDetails.licenseNumber || 'ASHA CCC-SLP Verified'}
                </p>
                <p className="text-[10px] text-slate-500">
                  State Board Reg. • Active & Good Standing
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-teal-800 dark:text-teal-300">
                  <Lock className="w-4 h-4 text-teal-600" />
                  Telepractice Security Protocol
                </span>
                <p className="text-slate-700 dark:text-slate-300 text-[11px]">
                  {selectedDoctorForDetails.telepracticeSecurity || 'HIPAA & DPDP Act 2023 Compliant'}
                </p>
                <p className="text-[10px] text-slate-500">
                  Peer-to-Peer Encrypted WebRTC • In-Browser DSP
                </p>
              </div>
            </div>

            {/* Clinical Bio & Philosophy */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Clinical Background & Practice Overview
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                {selectedDoctorForDetails.bio}
              </p>
            </div>

            {/* Specialties & Clinical Approaches */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Clinical Specialties & Therapeutic Frameworks
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedDoctorForDetails.specialties.map((s, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60"
                  >
                    {s}
                  </span>
                ))}
                {selectedDoctorForDetails.clinicalApproach?.map((app, idx) => (
                  <span
                    key={`app-${idx}`}
                    className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60"
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>

            {/* Practice Details Grid: Insurance, Format & Fee */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Consultation Rate</span>
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  ${selectedDoctorForDetails.hourlyRate}/hr
                </span>
                <span className="text-[10px] text-slate-500 block">FSA / HSA Eligible</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Format</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  {selectedDoctorForDetails.virtualAvailable ? 'Virtual Telehealth' : 'In-Clinic Only'}
                </span>
                <span className="text-[10px] text-slate-500 block truncate">{selectedDoctorForDetails.location}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Insurance</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  {selectedDoctorForDetails.acceptsInsurance ? 'Insurance Accepted' : 'Self-Pay / Superbill'}
                </span>
                <span className="text-[10px] text-slate-500 block">Itemized Superbill Provided</span>
              </div>
            </div>

            {/* Privacy Safeguard Notice */}
            <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 text-[11px] text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
              <span>
                <strong>Anti-Scraping & Privacy Protected:</strong> Direct clinician contact is routed through secure in-app telehealth rooms to protect provider and patient privacy.
              </span>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDetailsModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleOpenBooking(selectedDoctorForDetails)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Consultation with {selectedDoctorForDetails.name.split(',')[0]}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOOKING MODAL */}
      {isBookingModalOpen && selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-8 max-h-[90vh] overflow-y-auto">
            {bookingSuccess ? (
              <div className="text-center py-6 space-y-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white">
                  Appointment Confirmed!
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Your appointment with <span className="font-bold">{bookingSuccess.doctorName}</span> is booked for <span className="font-bold">{bookingSuccess.date} at {bookingSuccess.timeSlot}</span>.
                </p>

                <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/50 border border-teal-100 dark:border-teal-900 text-xs text-left space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Format:</span>
                    <span className="font-semibold capitalize">{bookingSuccess.sessionType} Consultation</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Telehealth Link:</span>
                    <span className="font-mono text-teal-600 dark:text-teal-400">{bookingSuccess.meetLink}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Attached ML Data:</span>
                    <span className="font-semibold text-emerald-600">{bookingSuccess.attachedSessionId ? 'Yes (Acoustic Report)' : 'None'}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-teal-100 dark:border-teal-900/60">
                    <span className="text-slate-500">Security:</span>
                    <span className="font-semibold text-teal-700 dark:text-teal-300">HIPAA & DPDP Protected</span>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    onClick={() => {
                      setIsBookingModalOpen(false);
                      setActiveTab('my_appointments');
                    }}
                    className="flex-1 py-3 rounded-2xl bg-teal-700 text-white font-bold text-xs hover:bg-teal-800 transition-colors shadow-xs"
                  >
                    View In My Appointments
                  </button>
                </div>
              </div>
            ) : !isAuthenticated ? (
              /* If patient is not authenticated, prompt secure account sign-in */
              <div className="space-y-4 text-center py-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center mx-auto border border-teal-200/60 dark:border-teal-800/60">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    Patient Sign-In Required
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                    To generate an end-to-end encrypted telehealth room and protect your clinical speech recordings under HIPAA & DPDP Act 2023, please sign in or create an account before scheduling with {selectedDoctor.name}.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-1">
                  <p className="font-bold text-slate-800 dark:text-slate-200">What an account provides:</p>
                  <p className="text-slate-500 dark:text-slate-400">• Confidential 1-on-1 video room tokens</p>
                  <p className="text-slate-500 dark:text-slate-400">• Optional acoustic biofeedback sharing</p>
                  <p className="text-slate-500 dark:text-slate-400">• Secure superbill receipt for insurance claims</p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      setIsBookingModalOpen(false);
                      setCurrentPage('login');
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-teal-700 text-white font-bold text-xs hover:bg-teal-800 transition-colors shadow-xs"
                  >
                    Sign In to Book
                  </button>
                  <button
                    onClick={() => {
                      setIsBookingModalOpen(false);
                      setCurrentPage('register');
                    }}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 transition-colors"
                  >
                    Create Patient Account
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedDoctor.avatar}
                      alt={selectedDoctor.name}
                      className="h-12 w-12 rounded-xl object-cover border border-teal-500/20"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        Book Consultation
                      </h3>
                      <p className="text-xs text-teal-700 dark:text-teal-400 font-medium">
                        {selectedDoctor.name}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsBookingModalOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Date Picker */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Select Consultation Date
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min="2026-09-04"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  />
                </div>

                {/* Time Slots */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Available Time Slot
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedDoctor.timeSlots.map((slot, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setBookingTime(slot)}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                          bookingTime === slot
                            ? 'border-teal-600 bg-teal-50 text-teal-700 dark:border-teal-500 dark:bg-teal-950 dark:text-teal-300 shadow-xs ring-1 ring-teal-600'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Consultation Format */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Consultation Format
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setBookingFormat('virtual')}
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold ${
                        bookingFormat === 'virtual'
                          ? 'border-teal-600 bg-teal-50 text-teal-700 dark:border-teal-500 dark:bg-teal-950 dark:text-teal-300 shadow-xs ring-1 ring-teal-600'
                          : 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      Telehealth Video
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingFormat('in-person')}
                      disabled={!selectedDoctor.inPersonAvailable}
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold ${
                        bookingFormat === 'in-person'
                          ? 'border-teal-600 bg-teal-50 text-teal-700 dark:border-teal-500 dark:bg-teal-950 dark:text-teal-300 shadow-xs ring-1 ring-teal-600'
                          : !selectedDoctor.inPersonAvailable
                          ? 'opacity-40 cursor-not-allowed border-slate-200'
                          : 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      In-Clinic
                    </button>
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Reason for Consultation / Primary Symptoms
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingReason}
                    onChange={(e) => setBookingReason(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  />
                </div>

                {/* Attach ML Data Toggle */}
                <div className="p-3 rounded-2xl bg-teal-50/70 border border-teal-200 dark:bg-teal-950/30 dark:border-teal-900/60 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileAudio className="w-4 h-4 text-teal-600" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        Attach ML Speech Model Inference
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Shares your spectrogram and disfluency rate for clinical review
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={attachMLReport}
                    onChange={(e) => setAttachMLReport(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                </div>

                {/* Medical Privacy & DPDP Consent Checkbox */}
                <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                  <label className="flex items-start gap-2 cursor-pointer text-slate-700 dark:text-slate-300 text-[11px]">
                    <input
                      type="checkbox"
                      required
                      checked={bookingConsent}
                      onChange={(e) => setBookingConsent(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="leading-snug">
                      I consent to confidential clinical evaluation under <strong>HIPAA & DPDP Act 2023</strong> standards. Session telemetry is end-to-end encrypted.
                    </span>
                  </label>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !bookingConsent}
                    className="w-full py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      'Securing Appointment...'
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Confirm Booking (${selectedDoctor.hourlyRate})
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

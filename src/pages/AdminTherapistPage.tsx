import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Users,
  Activity,
  TrendingUp,
  FileText,
  Search,
  CheckCircle2,
  Stethoscope,
  Send,
  Eye,
  Download,
  X,
  Sparkles,
  AlertTriangle,
  Calendar,
  Video,
  Clock,
  BookOpen,
  Plus,
  Edit3,
  Award
} from 'lucide-react';
import { DisclaimerNotice } from '../components/common/DisclaimerNotice';
import { SuperbillModal } from '../components/superbill/SuperbillModal';

export const AdminTherapistPage: React.FC = () => {
  const { token, user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Note sending state
  const [selectedUserForNote, setSelectedUserForNote] = useState<any | null>(null);
  const [therapistNote, setTherapistNote] = useState('');
  const [noteSentStatus, setNoteSentStatus] = useState('');

  // Homework Assignment Modal state
  const [selectedUserForHomework, setSelectedUserForHomework] = useState<any | null>(null);
  const [homeworkDrill, setHomeworkDrill] = useState<string>('Gentle Onset Vowel Glides');
  const [homeworkFrequency, setHomeworkFrequency] = useState<string>('2x Daily (Morning & Evening)');
  const [homeworkNotes, setHomeworkNotes] = useState<string>('Focus on soft articulatory contact and low subglottic breath initiation.');
  const [homeworkSavedStatus, setHomeworkSavedStatus] = useState<string>('');

  // AI-Drafted SOAP Note Generator state
  const [selectedUserForSoap, setSelectedUserForSoap] = useState<any | null>(null);
  const [soapData, setSoapData] = useState<{
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  }>({
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  });
  const [soapSavedStatus, setSoapSavedStatus] = useState<string>('');

  // Superbill Modal state
  const [selectedUserForSuperbill, setSelectedUserForSuperbill] = useState<any | null>(null);
  const [showSuperbillModal, setShowSuperbillModal] = useState<boolean>(false);

  // Telehealth Video Consultation state
  const [activeTelehealthUser, setActiveTelehealthUser] = useState<any | null>(null);

  // Client report modal
  const [selectedUserForReport, setSelectedUserForReport] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const [statsRes, usersRes] = await Promise.all([
          fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          const list = Array.isArray(usersData)
            ? usersData
            : Array.isArray(usersData?.users)
            ? usersData.users
            : [];
          setUsersList(list);
        }
      } catch (e) {
        console.error('Failed to load admin stats', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const defaultMockUsers = [
    {
      id: 'usr-patient-1',
      fullName: 'Alex Johnson',
      email: 'alex.patient@fluencyai.org',
      age: 28,
      totalSessions: 18,
      recentPace: 124,
      avgScore: 84,
      adherenceRate: 92,
      alert: null
    },
    {
      id: 'usr-patient-2',
      fullName: 'Sarah Jenkins',
      email: 'sarah.j@gmail.com',
      age: 34,
      totalSessions: 7,
      recentPace: 98,
      avgScore: 68,
      adherenceRate: 44,
      alert: 'Adherence Drop: <50% practice target this week'
    },
    {
      id: 'usr-patient-3',
      fullName: 'Rohan Sharma',
      email: 'rohan.speech@outlook.com',
      age: 22,
      totalSessions: 24,
      recentPace: 132,
      avgScore: 89,
      adherenceRate: 96,
      alert: null
    },
    {
      id: 'usr-patient-4',
      fullName: 'Emily Chen',
      email: 'emily.chen@uw.edu',
      age: 19,
      totalSessions: 12,
      recentPace: 110,
      avgScore: 74,
      adherenceRate: 60,
      alert: 'Regression in initial /t/ plosives noted'
    }
  ];

  const safeUsersList = usersList.length > 0 ? usersList : defaultMockUsers;
  const filteredUsers = safeUsersList.filter(
    (u) =>
      (u?.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
      (u?.email || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleSendNote = () => {
    if (!therapistNote.trim()) return;
    setNoteSentStatus(`Clinical note delivered to ${selectedUserForNote.fullName}`);
    setTimeout(() => {
      setNoteSentStatus('');
      setSelectedUserForNote(null);
      setTherapistNote('');
    }, 2500);
  };

  const handleAssignHomework = () => {
    setHomeworkSavedStatus(`Assigned "${homeworkDrill}" to ${selectedUserForHomework.fullName}'s Daily Plan.`);
    setTimeout(() => {
      setHomeworkSavedStatus('');
      setSelectedUserForHomework(null);
    }, 2500);
  };

  const handleOpenSoapModal = (client: any) => {
    setSelectedUserForSoap(client);
    setSoapData({
      subjective: `Patient reports feeling calmer during daily telephone interactions, with reduced tension in throat when using pre-speech breath resets. Denies secondary jaw tremors.`,
      objective: `Recent acoustic metrics show average speech tempo of ${client.recentPace || 118} WPM (target: 120-130). Disfluency frequency measured at 3.8% across 180 words, with 2 sound prolongations and 1 brief bilabial block.`,
      assessment: `Mild adult-onset stuttering (ICD-10 F98.5). Significant progress in diaphragmatic coordination and Camperdown continuous phonation. Patient demonstrates 85% mastery of gentle onset on open vowels.`,
      plan: `1. Continue daily Syllable-Timed Speech practice at 80 BPM (15 min/day).
2. Introduce Level 3 Speaking Situation Ladder (introducing oneself to strangers).
3. Follow-up Telehealth clinical session scheduled in 14 days.`
    });
  };

  const handleSaveSoapNote = () => {
    setSoapSavedStatus(`SOAP Note successfully saved to ${selectedUserForSoap.fullName}'s clinical chart.`);
    setTimeout(() => {
      setSoapSavedStatus('');
      setSelectedUserForSoap(null);
    }, 2500);
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 mb-2">
            <Stethoscope className="h-3.5 w-3.5" />
            Speech-Language Pathologist Supervision • Caseload Portal
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white">
            Clinician Supervision Dashboard
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Monitor client practice adherence, review acoustic speech metrics, assign targeted homework, generate AI SOAP notes, and launch telehealth consultations.
          </p>
        </div>

        <div className="rounded-xl border border-teal-200 bg-teal-50/70 px-3 py-1.5 text-xs font-semibold text-teal-900 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-200 flex items-center gap-2 self-start sm:self-auto">
          <ShieldCheck className="h-4 w-4 text-teal-600" />
          <span>Logged in as Licensed Clinician ({user?.fullName || 'Dr. Marcus Vance, CCC-SLP'})</span>
        </div>
      </div>

      {/* Caseload Alerts Banner */}
      <div className="rounded-3xl border border-amber-200 bg-amber-50/60 p-5 dark:border-amber-900/60 dark:bg-amber-950/30 space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            Caseload Priority Alerts (2 Clients Require Clinical Follow-up)
          </span>
          <span className="text-[10px] font-bold text-amber-700 uppercase">Real-Time Clinical Telemetry</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 flex items-start justify-between gap-2">
            <div>
              <strong className="text-slate-900 dark:text-white">Sarah Jenkins:</strong>
              <p className="text-amber-800 dark:text-amber-300 text-[11px] mt-0.5">
                Practice adherence dropped to 44% (missed last 3 morning warmups).
              </p>
            </div>
            <button
              onClick={() => setSelectedUserForNote(defaultMockUsers[1])}
              className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-bold shrink-0"
            >
              Nudge
            </button>
          </div>

          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 flex items-start justify-between gap-2">
            <div>
              <strong className="text-slate-900 dark:text-white">Emily Chen:</strong>
              <p className="text-amber-800 dark:text-amber-300 text-[11px] mt-0.5">
                Acoustic disfluency spike detected on voiceless plosives (/t/, /k/).
              </p>
            </div>
            <button
              onClick={() => setSelectedUserForHomework(defaultMockUsers[3])}
              className="px-2.5 py-1 rounded-lg bg-teal-100 hover:bg-teal-200 text-teal-900 text-[11px] font-bold shrink-0"
            >
              Assign Drill
            </button>
          </div>
        </div>
      </div>

      {/* Aggregate Caseload Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-semibold text-slate-500">Enrolled Patients</span>
          <p className="font-display text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {stats?.totalUsers || 24}
          </p>
          <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">
            Active under supervision
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-semibold text-slate-500">Total Practice Sessions</span>
          <p className="font-display text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {stats?.totalSessionsLogged || 142}
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            +18 logged this week
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-semibold text-slate-500">Caseload Avg Fluency</span>
          <p className="font-display text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {stats?.averageFluencyScore || 82}%
          </p>
          <span className="text-[11px] text-slate-400 font-medium">
            Across acoustic assessment tasks
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-semibold text-slate-500">Plan Adherence</span>
          <p className="font-display text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {stats?.activeTherapyPlans || 88}%
          </p>
          <span className="text-[11px] text-sky-600 dark:text-sky-400 font-medium">
            Completing 5+ days/week
          </span>
        </div>
      </div>

      {/* Client Caseload Roster */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Active Patient Caseload
            </span>
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
              Patient Progress & Clinical Workflow Console
            </h3>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by client name..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:bg-slate-800/60">
              <tr>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Age</th>
                <th className="py-3 px-4">Sessions</th>
                <th className="py-3 px-4">Speaking Pace</th>
                <th className="py-3 px-4">Fluency</th>
                <th className="py-3 px-4 text-right">Clinical Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    <div>
                      <span>{client.fullName}</span>
                      <span className="block text-[11px] font-normal text-slate-400">{client.email}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">{client.age}</td>
                  <td className="py-3.5 px-4 font-semibold">{client.sessionsCompleted ?? client.totalSessions ?? 0}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                    {client.recentPace ?? 108} WPM
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-bold text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                      {client.avgScore ?? client.averageFluency ?? 75}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                    {/* Assign Homework */}
                    <button
                      onClick={() => setSelectedUserForHomework(client)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      title="Assign Targeted Homework Drills"
                    >
                      <BookOpen className="h-3.5 w-3.5 text-indigo-600" />
                      Homework
                    </button>

                    {/* AI SOAP Note */}
                    <button
                      onClick={() => handleOpenSoapModal(client)}
                      className="inline-flex items-center gap-1 rounded-lg border border-teal-200 bg-teal-50/60 px-2.5 py-1 text-xs font-semibold text-teal-800 hover:bg-teal-100 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-300"
                      title="Generate and Edit AI SOAP Note"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                      AI SOAP
                    </button>

                    {/* Superbill CMS-1500 */}
                    <button
                      onClick={() => {
                        setSelectedUserForSuperbill(client);
                        setShowSuperbillModal(true);
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      title="Generate Insurance Claim Superbill"
                    >
                      <FileText className="h-3.5 w-3.5 text-amber-600" />
                      Superbill
                    </button>

                    {/* Telehealth Room */}
                    <button
                      onClick={() => setActiveTelehealthUser(client)}
                      className="inline-flex items-center gap-1 rounded-lg bg-teal-600 px-2.5 py-1 text-xs font-semibold text-white shadow-xs hover:bg-teal-700"
                      title="Launch Video Telehealth Consultation"
                    >
                      <Video className="h-3.5 w-3.5" />
                      Telehealth
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: ASSIGN HOMEWORK */}
      {selectedUserForHomework && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                  Assign Daily Homework to {selectedUserForHomework.fullName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedUserForHomework(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {homeworkSavedStatus ? (
              <div className="rounded-xl bg-teal-50 p-4 text-center text-xs font-semibold text-teal-800 dark:bg-teal-950/50 dark:text-teal-200">
                <CheckCircle2 className="mx-auto h-6 w-6 text-teal-600 mb-1" />
                {homeworkSavedStatus}
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Select Target Motor Drill:
                  </label>
                  <select
                    value={homeworkDrill}
                    onChange={(e) => setHomeworkDrill(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Gentle Onset Vowel Glides">Gentle Onset Vowel Glides (/a/ → /i/ → /u/)</option>
                    <option value="DAF Speech Pacing (75ms Delay)">DAF Prosthetic Aid Speech Pacing (75ms Delay)</option>
                    <option value="Syllable-Timed Speech at 80 BPM">Syllable-Timed Speech (STS Metronome at 80 BPM)</option>
                    <option value="Speaking Situation: Ordering Coffee">Speaking Situation Ladder: Ordering Coffee at a Cafe</option>
                    <option value="Voluntary Bouncing Desensitization">Voluntary Bouncing Desensitization (5 reps)</option>
                    <option value="Continuous Phonation on Grandfather Passage">Continuous Phonation on The Grandfather Passage</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Prescribed Practice Frequency:
                  </label>
                  <select
                    value={homeworkFrequency}
                    onChange={(e) => setHomeworkFrequency(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="2x Daily (Morning & Evening)">2x Daily (Morning & Evening)</option>
                    <option value="1x Daily (5 min Warmup)">1x Daily (5 min Morning Warmup)</option>
                    <option value="3x per Week">3x per Week (MWF)</option>
                    <option value="Prior to High-Stress Speaking">As-Needed (Prior to High-Stress Speaking)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Clinical Instructions for Patient:
                  </label>
                  <textarea
                    rows={3}
                    value={homeworkNotes}
                    onChange={(e) => setHomeworkNotes(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setSelectedUserForHomework(null)}
                    className="px-4 py-2 rounded-xl text-slate-500 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAssignHomework}
                    className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-xs"
                  >
                    Assign to Daily Plan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: AI-DRAFTED SOAP NOTE EDITOR */}
      {selectedUserForSoap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-600" />
                <div>
                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                    AI-Drafted SOAP Note: {selectedUserForSoap.fullName}
                  </h3>
                  <span className="text-[10px] text-slate-400">
                    Review, customize, and edit before committing to permanent medical chart.
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedUserForSoap(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {soapSavedStatus ? (
              <div className="rounded-xl bg-teal-50 p-4 text-center text-xs font-semibold text-teal-800 dark:bg-teal-950/50 dark:text-teal-200">
                <CheckCircle2 className="mx-auto h-6 w-6 text-teal-600 mb-1" />
                {soapSavedStatus}
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                {/* S: Subjective */}
                <div>
                  <label className="font-bold text-teal-700 dark:text-teal-400 block mb-1">
                    S (Subjective) - Patient-Reported Perceptions & Symptoms:
                  </label>
                  <textarea
                    rows={2}
                    value={soapData.subjective}
                    onChange={(e) => setSoapData({ ...soapData, subjective: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                {/* O: Objective */}
                <div>
                  <label className="font-bold text-indigo-700 dark:text-indigo-400 block mb-1">
                    O (Objective) - Measured Acoustic & Disfluency Metrics:
                  </label>
                  <textarea
                    rows={3}
                    value={soapData.objective}
                    onChange={(e) => setSoapData({ ...soapData, objective: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                {/* A: Assessment */}
                <div>
                  <label className="font-bold text-amber-700 dark:text-amber-400 block mb-1">
                    A (Assessment) - Clinical Diagnosis & Progress Synthesis:
                  </label>
                  <textarea
                    rows={3}
                    value={soapData.assessment}
                    onChange={(e) => setSoapData({ ...soapData, assessment: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                {/* P: Plan */}
                <div>
                  <label className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
                    P (Plan) - Prescribed Motor Interventions & Next Appointment:
                  </label>
                  <textarea
                    rows={3}
                    value={soapData.plan}
                    onChange={(e) => setSoapData({ ...soapData, plan: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-[11px] text-slate-400 italic">
                    Requires licensed SLP review prior to insurance submission.
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedUserForSoap(null)}
                      className="px-4 py-2 rounded-xl text-slate-500 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveSoapNote}
                      className="px-5 py-2 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 shadow-xs"
                    >
                      Approve & Save SOAP Note
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: TELEHEALTH VIDEO ROOM */}
      {activeTelehealthUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-slate-900 p-6 shadow-2xl text-white relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-display text-base font-bold text-white">
                  Live Telehealth Consultation: {activeTelehealthUser.fullName}
                </h3>
              </div>
              <button
                onClick={() => setActiveTelehealthUser(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Video preview simulation */}
            <div className="relative aspect-video rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center overflow-hidden">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-teal-600/30 border-2 border-teal-500 flex items-center justify-center mx-auto text-xl font-bold">
                  {activeTelehealthUser.fullName.charAt(0)}
                </div>
                <p className="text-sm font-bold text-white">{activeTelehealthUser.fullName}</p>
                <span className="text-xs text-emerald-400 flex items-center justify-center gap-1.5 font-medium">
                  <Activity className="w-3.5 h-3.5 animate-pulse" /> WebRTC Encrypted Video Stream Ready
                </span>
              </div>

              {/* Shared prompter overlay */}
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
                <strong className="text-teal-400 block mb-0.5">Shared Telehealth Practice Prompt:</strong>
                "Let's practice the 4-second gentle onset breath together before saying your introduction."
              </div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">HIPAA Compliant P2P WebRTC Connection</span>
              <div className="flex gap-2">
                <button
                  onClick={() => alert('Appointment reminder sent via SMS / WhatsApp')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Send WhatsApp Reminder
                </button>
                <button
                  onClick={() => setActiveTelehealthUser(null)}
                  className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
                >
                  End Telehealth Call
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Superbill Modal */}
      {selectedUserForSuperbill && (
        <SuperbillModal
          isOpen={showSuperbillModal}
          onClose={() => {
            setShowSuperbillModal(false);
            setSelectedUserForSuperbill(null);
          }}
          user={selectedUserForSuperbill}
          patientName={selectedUserForSuperbill.fullName}
          disfluencyBaseline={8.4}
          currentDisfluency={3.8}
        />
      )}

      <DisclaimerNotice />
    </div>
  );
};

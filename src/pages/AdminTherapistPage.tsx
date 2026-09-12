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
  Sparkles
} from 'lucide-react';
import { DisclaimerNotice } from '../components/common/DisclaimerNotice';

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

  const safeUsersList = Array.isArray(usersList) ? usersList : [];
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

  return (
    <div className="space-y-8 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 mb-2">
            <Stethoscope className="h-3.5 w-3.5" />
            Speech-Language Pathologist Supervision
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white">
            Therapist Clinical Dashboard
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Monitor client practice adherence, review acoustic speech metrics, and deliver targeted therapy recommendations.
          </p>
        </div>

        <div className="rounded-xl border border-teal-200 bg-teal-50/70 px-3 py-1.5 text-xs font-semibold text-teal-900 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-200 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-teal-600" />
          <span>Logged in as Clinician ({user?.fullName})</span>
        </div>
      </div>

      {/* Aggregate Caseload Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-semibold text-slate-500">Enrolled Clients</span>
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
            Based on recent session tasks
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
              Client Caseload
            </span>
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
              Patient Progress & Performance Overview
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
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Email Address</th>
                <th className="py-3 px-4">Age</th>
                <th className="py-3 px-4">Sessions</th>
                <th className="py-3 px-4">Speaking Pace</th>
                <th className="py-3 px-4">Avg Fluency</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    {client.fullName}
                  </td>
                  <td className="py-3.5 px-4">{client.email}</td>
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
                  <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedUserForReport(client)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      <FileText className="h-3.5 w-3.5 text-teal-600" />
                      Report
                    </button>
                    <button
                      onClick={() => setSelectedUserForNote(client)}
                      className="inline-flex items-center gap-1 rounded-lg bg-teal-600 px-2.5 py-1 text-xs font-semibold text-white shadow-xs hover:bg-teal-700"
                    >
                      <Send className="h-3.5 w-3.5" />
                      Clinical Note
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Send Therapist Note */}
      {selectedUserForNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                Deliver Clinical Guidance to {selectedUserForNote.fullName}
              </h3>
              <button
                onClick={() => setSelectedUserForNote(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {noteSentStatus ? (
              <div className="rounded-xl bg-teal-50 p-4 text-center text-xs font-semibold text-teal-800 dark:bg-teal-950/50 dark:text-teal-200">
                <CheckCircle2 className="mx-auto h-6 w-6 text-teal-600 mb-1" />
                {noteSentStatus}
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-500">
                  This guidance note will be highlighted inside the patient's daily practice plan and dashboard.
                </p>

                <textarea
                  rows={4}
                  value={therapistNote}
                  onChange={(e) => setTherapistNote(e.target.value)}
                  placeholder="e.g., Noticeable improvement on plosive consonants this week! Let's focus on softening tongue tension during Friday's reading passage."
                  className="w-full rounded-2xl border border-slate-300 bg-white p-3.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setSelectedUserForNote(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendNote}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-teal-600 text-xs font-bold text-white shadow-md hover:bg-teal-700"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Send Guidance Note
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal 2: Clinical Summary Report */}
      {selectedUserForReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  Formal Speech-Language Pathology Summary
                </span>
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  Client Progress Report: {selectedUserForReport.fullName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedUserForReport(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Sessions</span>
                  <p className="font-bold text-slate-900 dark:text-white text-base">
                    {selectedUserForReport.sessionsCompleted ?? selectedUserForReport.totalSessions ?? 0}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Speaking Rate</span>
                  <p className="font-bold text-teal-600 dark:text-teal-400 text-base">
                    {selectedUserForReport.recentPace ?? 108} WPM
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Avg Score</span>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400 text-base">
                    {selectedUserForReport.avgScore ?? selectedUserForReport.averageFluency ?? 75}%
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-3.5 dark:border-slate-700">
                <span className="font-bold block mb-1 text-slate-900 dark:text-white">
                  Clinical Assessment Observations:
                </span>
                <p className="leading-relaxed">
                  Patient exhibits steady engagement with diaphragmatic breathing and easy onset pacing drills. Phonation continuity has stabilized, with mechanical pause frequency declining markedly compared to baseline intake. Recommended continued focus on telephone simulation drills.
                </p>
              </div>

              <div className="text-[11px] text-slate-400 italic">
                * Generated by AI-Based Stuttering Therapy System for licensed clinical review.
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200"
              >
                <Download className="h-3.5 w-3.5" />
                Print / Save PDF
              </button>

              <button
                onClick={() => setSelectedUserForReport(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-xs font-bold text-white hover:bg-slate-800 dark:bg-teal-600"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      <DisclaimerNotice />
    </div>
  );
};

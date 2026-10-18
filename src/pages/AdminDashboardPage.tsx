import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, Users, Calendar, Activity, CheckCircle, FileText, Video, Bell } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { user, setCurrentPage } = useAuth();

  // If clinician verification is pending, restrict patient caseload access completely
  if (user && user.verificationStatus === 'pending_verification') {
    return (
      <div className="mx-auto max-w-2xl space-y-6 pt-12 pb-20 text-center">
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 shadow-xl space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center mx-auto">
            <Stethoscope className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            SLP Clinical Verification in Progress
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-md mx-auto">
            Your professional speech pathology license credentials ({user.licenseNumber || 'License on file'}) have been submitted and are currently awaiting administrative review.
          </p>
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-xs border border-amber-200 dark:border-amber-800 max-w-md mx-auto text-left">
            <strong>Patient Privacy Shield (HIPAA & DPDP Act 2023):</strong>
            <p className="mt-1 text-[11px] text-amber-800 dark:text-amber-300">
              To protect vulnerable individuals and speech recordings, access to patient charts, disfluency spectrograms, and booking requests is locked until credential verification is finalized.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => setCurrentPage('profile')}
              className="px-4 py-2 rounded-xl bg-teal-700 text-white font-bold text-xs hover:bg-teal-800"
            >
              Review My Profile & Licensure Document
            </button>
          </div>
        </div>
      </div>
    );
  }

  const patients = [
    { name: 'Alex Johnson', lastSeen: 'Today, 2:15 PM', baseline: 8.4, currentRate: 4.2, status: 'Improving', trend: '+12%' },
    { name: 'Sophia Chen', lastSeen: 'Yesterday', baseline: 11.2, currentRate: 7.1, status: 'Consistent', trend: '+8%' },
    { name: 'Jordan Miller', lastSeen: '3 days ago', baseline: 6.8, currentRate: 5.5, status: 'Needs Follow-up', trend: '+3%' }
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
            Clinician & Doctor Command Center
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
            Doctor Marcus Vance's Practice
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Certified Speech-Language Pathology Portal • Review patient spectrograms and telehealth consults.
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('doctors')}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 shadow-xs self-start sm:self-auto"
        >
          <Calendar className="w-4 h-4" />
          View Public Doctor Listing
        </button>
      </div>

      {/* 3 Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold">Active Roster Patients</span>
          <p className="mt-2 text-3xl font-bold text-teal-600 dark:text-teal-400">28</p>
          <span className="text-xs text-emerald-600 font-medium">+3 new this month</span>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold">Scheduled Telehealth Appointments</span>
          <p className="mt-2 text-3xl font-bold text-indigo-600 dark:text-indigo-400">6 Today</p>
          <span className="text-xs text-slate-500 font-medium">Next: 10:00 AM Virtual</span>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold">Acoustic Audio Submissions</span>
          <p className="mt-2 text-3xl font-bold text-orange-500">14</p>
          <span className="text-xs text-orange-600 font-medium">4 ML reports ready for review</span>
        </div>
      </div>

      {/* Patient Caseload Table */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
          Active Patient Caseload & Spectrogram Submissions
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider">
                <th className="pb-3 font-semibold">Patient</th>
                <th className="pb-3 font-semibold">Last Recorded Session</th>
                <th className="pb-3 font-semibold">Baseline Disfluency</th>
                <th className="pb-3 font-semibold">Current Rate</th>
                <th className="pb-3 font-semibold">Clinical Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {patients.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 font-bold text-slate-900 dark:text-white">
                    {p.name}
                  </td>
                  <td className="py-3 text-slate-500">{p.lastSeen}</td>
                  <td className="py-3 text-slate-500">{p.baseline}%</td>
                  <td className="py-3 font-bold text-teal-600">{p.currentRate}%</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-semibold text-[10px]">
                      {p.status} ({p.trend})
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => setCurrentPage('ml_speech')}
                      className="text-teal-600 dark:text-teal-400 font-bold hover:underline"
                    >
                      Inspect Spectrogram
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

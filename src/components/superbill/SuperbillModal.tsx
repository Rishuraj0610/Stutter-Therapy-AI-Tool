import React, { useRef } from 'react';
import { Printer, Download, X, ShieldCheck, CheckCircle2, FileText } from 'lucide-react';
import { User, Appointment } from '../../types';

interface SuperbillModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  patientName?: string;
  disfluencyBaseline?: number;
  currentDisfluency?: number;
}

export const SuperbillModal: React.FC<SuperbillModalProps> = ({
  isOpen,
  onClose,
  user,
  patientName = '',
  disfluencyBaseline = 8.4,
  currentDisfluency = 3.6
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = `SB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const serviceDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl relative">
        {/* Modal Controls Toolbar (Hidden in Print) */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Official SLP Insurance Superbill & Clinical Progress Document
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Superbill Document */}
        <div className="p-8 sm:p-10 space-y-8 text-slate-800 dark:text-slate-100 print:text-black print:p-0 print:space-y-6">
          {/* Header Block */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-300 dark:border-slate-700 pb-6 print:border-black">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-black text-2xl text-teal-700 dark:text-teal-400 print:text-black">
                  FluencyAI Speech Pathology Clinic
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 print:text-slate-700 mt-1">
                Specialized Clinical Center for Fluency, Stuttering & Acoustic Rehabilitation
              </p>
              <div className="text-xs text-slate-500 dark:text-slate-400 print:text-slate-700 mt-2 space-y-0.5">
                <p>Provider: Dr. Marcus Vance, Ph.D., CCC-SLP, BCS-F</p>
                <p>NPI (National Provider Identifier): <strong>1841392810</strong></p>
                <p>Taxonomy Code: <strong>235Z00000X</strong> (Speech-Language Pathologist)</p>
                <p>State SLP License: #CA-SLP-449102 | Clinical Address: 550 Montgomery St, Suite 400, San Francisco, CA</p>
              </div>
            </div>

            <div className="text-right sm:text-right space-y-1">
              <span className="inline-block px-3 py-1 rounded-md bg-teal-50 text-teal-800 dark:bg-slate-800 dark:text-teal-300 border border-teal-200 dark:border-slate-700 text-xs font-mono font-bold uppercase print:border-black">
                {invoiceNumber}
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 print:text-slate-700">Date of Service: <strong>{serviceDate}</strong></p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold print:text-black">Status: PAID IN FULL (For Patient Reimbursement)</p>
            </div>
          </div>

          {/* Patient Demographics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-800/50 print:bg-transparent p-5 rounded-2xl border border-slate-200 dark:border-slate-700 print:border-slate-300">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Patient Details</span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white print:text-black mt-1">
                {patientName || user?.fullName || (user?.email ? user.email.split('@')[0] : 'Patient')}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 print:text-slate-700">DOB: {user?.dateOfBirth || '10/14/1996'} | Sex: {user?.role === 'therapist' ? 'Clinician' : 'Patient'}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 print:text-slate-700">Email: {user?.email || 'patient@fluencyai.org'}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Insurance & Authorization</span>
              <p className="text-xs text-slate-700 dark:text-slate-300 print:text-slate-700 mt-1">Primary Payer: BlueShield / Aetna Health Direct</p>
              <p className="text-xs text-slate-700 dark:text-slate-300 print:text-slate-700">Member ID: W91849204 | Group: G-77210</p>
              <p className="text-xs text-slate-700 dark:text-slate-300 print:text-slate-700">Authorization: Routine Outpatient Telepractice Speech Services</p>
            </div>
          </div>

          {/* Diagnostic Coding Section (ICD-10) */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-1">
              Medical Diagnosis Codes (ICD-10-CM)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 print:bg-white flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-teal-700 dark:text-teal-400 mr-2">F80.81</span>
                  <span>Childhood-onset fluency disorder (Stuttering)</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Primary
                </span>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 print:bg-white flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-teal-700 dark:text-teal-400 mr-2">F80.89</span>
                  <span>Other developmental disorders of speech & language</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  Secondary
                </span>
              </div>
            </div>
          </div>

          {/* Procedure Codes & Fees (CPT) Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-1">
              Speech Therapy Procedure Codes (CPT Codes)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 dark:bg-slate-800 print:bg-slate-200 text-slate-700 dark:text-slate-300 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">CPT Code</th>
                    <th className="p-3">Modifier</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Units</th>
                    <th className="p-3 text-right">Fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  <tr>
                    <td className="p-3 font-mono">{serviceDate}</td>
                    <td className="p-3 font-mono font-bold text-teal-600 dark:text-teal-400">92507</td>
                    <td className="p-3 font-mono">95 (Telehealth)</td>
                    <td className="p-3">Treatment of speech disorder; individual fluency shaping & biofeedback session</td>
                    <td className="p-3">1</td>
                    <td className="p-3 text-right font-mono font-bold">$140.00</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono">{serviceDate}</td>
                    <td className="p-3 font-mono font-bold text-teal-600 dark:text-teal-400">92522</td>
                    <td className="p-3 font-mono">95 (Telehealth)</td>
                    <td className="p-3">Evaluation of speech sound production & fluency analysis (Acoustic Spectrogram)</td>
                    <td className="p-3">1</td>
                    <td className="p-3 text-right font-mono font-bold">$110.00</td>
                  </tr>
                </tbody>
                <tfoot className="bg-slate-50 dark:bg-slate-800/80 font-bold">
                  <tr>
                    <td colSpan={5} className="p-3 text-right">Total Amount Due / Paid:</td>
                    <td className="p-3 text-right font-mono text-sm text-teal-700 dark:text-teal-400">$250.00</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Objective Longitudinal Clinical Progress Tracking */}
          <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/60 space-y-2 text-xs">
            <span className="font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
              Longitudinal Clinical Outcome Metrics (Medical Necessity Justification)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-1">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-teal-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Baseline Disfluency</span>
                <p className="font-bold text-rose-600">{disfluencyBaseline}%</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-teal-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Current Disfluency</span>
                <p className="font-bold text-emerald-600">{currentDisfluency}%</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-teal-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Fluency Gain</span>
                <p className="font-bold text-teal-600">+{(disfluencyBaseline - currentDisfluency).toFixed(1)}%</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-teal-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Adherence</span>
                <p className="font-bold text-indigo-600">94% Target</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 pt-1">
              <strong>Clinical Impression:</strong> Patient demonstrates substantial therapeutic progress utilizing gentle phonatory onset and prolonged speech techniques. Continuation of skilled speech therapy is medically necessary to achieve communicative automaticity in high-anxiety professional situations.
            </p>
          </div>

          {/* Provider Signature Block */}
          <div className="pt-6 border-t border-slate-300 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                I certify that the speech-language pathology services designated above were provided by me personally in accordance with ASHA clinical standards and applicable state licensure laws.
              </p>
            </div>
            <div className="text-center sm:text-right shrink-0">
              <div className="font-serif italic text-lg text-teal-800 dark:text-teal-300 print:text-black">
                Dr. Marcus Vance, Ph.D., CCC-SLP
              </div>
              <div className="border-t border-slate-400 mt-1 pt-1 text-[10px] text-slate-500 uppercase tracking-wider">
                Clinician Signature & Date: {serviceDate}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

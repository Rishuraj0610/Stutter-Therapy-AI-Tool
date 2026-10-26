import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Type,
  ShieldCheck,
  Stethoscope,
  LogOut,
  Check,
  Smartphone,
  Laptop,
  KeyRound,
  Download,
  Trash2,
  AlertTriangle,
  Lock,
  Clock,
  FileText,
  ShieldAlert,
  Edit3,
  Save,
  X,
  Calendar,
  Target,
  Activity,
  Award,
  Building,
  CheckCircle2,
  Sun,
  Moon
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const {
    user,
    role,
    switchDemoRole,
    logout,
    fontSize,
    setFontSize,
    theme,
    toggleTheme,
    terminateSession,
    terminateAllOtherSessions,
    toggleTwoFactorAuth,
    deleteAccountWithGracePeriod,
    cancelAccountDeletion,
    downloadUserData,
    updateUserProfile
  } = useAuth();

  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFullName, setEditFullName] = useState(user?.fullName || '');
  const [editDob, setEditDob] = useState(user?.dateOfBirth || '');
  const [editSeverity, setEditSeverity] = useState(user?.stutterSeverity || 'moderate');
  const [editGoal, setEditGoal] = useState(user?.primaryGoal || '');
  const [editCredential, setEditCredential] = useState(user?.credentials || 'CCC-SLP');
  const [editLicense, setEditLicense] = useState(user?.licenseNumber || '');
  const [editInstitution, setEditInstitution] = useState(user?.institution || '');
  const [editYears, setEditYears] = useState(user?.yearsOfExperience || 5);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Sync state when user changes
  React.useEffect(() => {
    if (user) {
      setEditFullName(user.fullName || '');
      setEditDob(user.dateOfBirth || '');
      setEditSeverity(user.stutterSeverity || 'moderate');
      setEditGoal(user.primaryGoal || '');
      setEditCredential(user.credentials || 'CCC-SLP');
      setEditLicense(user.licenseNumber || '');
      setEditInstitution(user.institution || '');
      setEditYears(user.yearsOfExperience || 5);
    }
  }, [user]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'patient') {
      updateUserProfile({
        fullName: editFullName.trim(),
        dateOfBirth: editDob,
        stutterSeverity: editSeverity as any,
        primaryGoal: editGoal.trim()
      });
    } else {
      updateUserProfile({
        fullName: editFullName.trim(),
        credentials: editCredential.trim(),
        licenseNumber: editLicense.trim(),
        institution: editInstitution.trim(),
        yearsOfExperience: Number(editYears) || 1
      });
    }
    setProfileSaveSuccess(true);
    setTimeout(() => {
      setProfileSaveSuccess(false);
      setIsEditingProfile(false);
    }, 1200);
  };

  // Change password modal state
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  // 2FA modal state
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [totpSecret, setTotpSecret] = useState<string | undefined>(user?.twoFactorSecret);
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | undefined>(user?.recoveryCodes);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length >= 10) {
      setPasswordChangeSuccess(true);
      setTimeout(() => {
        setShowPasswordChange(false);
        setPasswordChangeSuccess(false);
        setCurrentPass('');
        setNewPass('');
      }, 1500);
    }
  };

  const handleToggle2FA = () => {
    if (user?.twoFactorEnabled) {
      toggleTwoFactorAuth(false);
      setShow2FASetup(false);
    } else {
      const res = toggleTwoFactorAuth(true);
      setTotpSecret(res.secret);
      setRecoveryCodes(res.recoveryCodes);
      setShow2FASetup(true);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-20 px-4 sm:px-0">
      {/* Account Deletion Grace Period Banner */}
      {user?.accountDeletionScheduled && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-900 dark:text-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            <div className="text-xs">
              <p className="font-bold">Account Deletion Scheduled</p>
              <p className="text-[11px] text-red-700 dark:text-red-300">
                In compliance with DPDP Act 2023, your account and speech metrics are in a 7-day grace period. Scheduled for permanent erasure on{' '}
                {new Date(user.accountDeletionScheduled).toLocaleDateString()}.
              </p>
            </div>
          </div>
          <button
            onClick={cancelAccountDeletion}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors shrink-0"
          >
            Cancel Erasure Request
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
            Identity & Clinical Security
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-0.5">
            Account, Security & Privacy
          </h1>
          <p className="text-xs text-slate-500">
            DPDP Act 2023 compliance, active device session control, and two-factor authentication.
          </p>
        </div>

        <button
          onClick={downloadUserData}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-2xs self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-teal-600" />
          Download My Data (JSON)
        </button>
      </div>

      {/* User Information Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.fullName || user?.email || 'User')}`}
            alt={user?.fullName || 'User Avatar'}
            className="h-16 w-16 rounded-2xl object-cover border-2 border-teal-500/20 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-slate-900 dark:text-white">
                {user?.fullName || (user?.email ? user.email.split('@')[0] : 'My Profile')}
              </h2>
              <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[10px] font-bold text-teal-700 capitalize dark:bg-teal-950 dark:text-teal-300">
                {role === 'therapist' ? 'Clinician' : 'Patient'} Account
              </span>
              {user?.emailVerified ? (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Verified Email
                </span>
              ) : (
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                  Unverified
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
            {user?.credentials && (
              <p className="text-xs text-teal-600 font-semibold mt-0.5">
                {user.credentials} {user.licenseNumber ? `• License: ${user.licenseNumber}` : ''}
              </p>
            )}
            {user?.institution && (
              <p className="text-[11px] text-slate-400 mt-0.5">{user.institution}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-teal-600" />
            {isEditingProfile ? 'Close Editor' : 'Edit Profile'}
          </button>
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Comprehensive Personal & Clinical Profile Details */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-teal-600" />
              Registered Profile & Clinical Metadata
            </h3>
            <p className="text-xs text-slate-500">
              Details associated with your active login identity and speech pathology records.
            </p>
          </div>

          {profileSaveSuccess && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold animate-pulse">
              <CheckCircle2 className="w-3.5 h-3.5" /> Changes Saved!
            </span>
          )}
        </div>

        {isEditingProfile ? (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  required
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Registered Email (Fixed)
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-100 dark:bg-slate-800/50 dark:border-slate-700 text-slate-500 cursor-not-allowed"
                />
              </div>

              {role === 'patient' ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={editDob}
                      onChange={(e) => setEditDob(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Stuttering Severity
                    </label>
                    <select
                      value={editSeverity}
                      onChange={(e) => setEditSeverity(e.target.value as any)}
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    >
                      <option value="mild">Mild (occasional prolongations / hesitations)</option>
                      <option value="moderate">Moderate (frequent blocks & tension)</option>
                      <option value="severe">Severe (high frequency anticipatory blocks)</option>
                      <option value="not_sure">Not Sure / Pending Clinical Evaluation</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Primary Speaking & Fluency Goal
                    </label>
                    <textarea
                      rows={2}
                      value={editGoal}
                      onChange={(e) => setEditGoal(e.target.value)}
                      placeholder="e.g. Master gentle onset during work meetings and feel calm on phone calls"
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Professional Credential
                    </label>
                    <input
                      type="text"
                      value={editCredential}
                      onChange={(e) => setEditCredential(e.target.value)}
                      placeholder="e.g. CCC-SLP, BCS-F, RCI"
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      License Registration Number
                    </label>
                    <input
                      type="text"
                      value={editLicense}
                      onChange={(e) => setEditLicense(e.target.value)}
                      placeholder="e.g. SLP-94820-CA"
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Clinical Institution / Hospital
                    </label>
                    <input
                      type="text"
                      value={editInstitution}
                      onChange={(e) => setEditInstitution(e.target.value)}
                      placeholder="e.g. Speech & Fluency Clinic"
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Years of Clinical Experience
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={50}
                      value={editYears}
                      onChange={(e) => setEditYears(Number(e.target.value))}
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition-colors shadow-2xs"
              >
                <Save className="w-3.5 h-3.5" />
                Save Profile Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Field: Full Name */}
            <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Full Legal Name</p>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-1">
                {user?.fullName || (user?.email ? user.email.split('@')[0] : 'Member')}
              </p>
            </div>

            {/* Field: Email */}
            <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Registered Email</p>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-1 truncate">
                {user?.email}
              </p>
            </div>

            {/* Field: Account Role */}
            <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Account Type</p>
              <p className="text-xs font-bold text-teal-700 dark:text-teal-400 mt-1 capitalize">
                {role === 'therapist' ? 'Speech-Language Pathologist' : 'Patient (PWS)'}
              </p>
            </div>

            {role === 'patient' ? (
              <>
                {/* Field: Date of Birth */}
                <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Date of Birth</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-1">
                    {user?.dateOfBirth ? user.dateOfBirth : '1998-05-15 (Adult)'}
                  </p>
                </div>

                {/* Field: Stutter Severity */}
                <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Self-Reported Severity</p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800">
                    {user?.stutterSeverity || 'Moderate'}
                  </span>
                </div>

                {/* Field: Baseline Disfluency */}
                <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Acoustic Baseline (%SS)</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-1">
                    {user?.baselineDisfluencyRate ? `${user.baselineDisfluencyRate}% SS` : '5.8% SS'}
                  </p>
                </div>

                {/* Field: Primary Speaking Goal */}
                <div className="sm:col-span-2 lg:col-span-3 p-3.5 rounded-2xl bg-teal-50/40 dark:bg-teal-950/20 border border-teal-200/60 dark:border-teal-900/50">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" />
                    Primary Speech Therapy Goal
                  </p>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                    {user?.primaryGoal || 'Improve daily fluency confidence and speech ease'}
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Field: Credential */}
                <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Credentials</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-1">
                    {user?.credentials || 'CCC-SLP'}
                  </p>
                </div>

                {/* Field: License Number */}
                <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">License Number</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-1 font-mono">
                    {user?.licenseNumber || 'SLP-RCI-2026'}
                  </p>
                </div>

                {/* Field: Clinical Institution */}
                <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Institution / Practice</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-1">
                    {user?.institution || 'Speech Pathology Clinic'}
                  </p>
                </div>

                {/* Field: Experience */}
                <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Clinical Experience</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-1">
                    {user?.yearsOfExperience || 8} years active practice
                  </p>
                </div>
              </>
            )}

            {/* Field: Privacy & DPDP Consent */}
            <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">DPDP Act 2023 Consent</p>
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-1 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Explicit Processing Granted
              </p>
            </div>

            {/* Field: Research Consent */}
            <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Anonymized Research</p>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-1">
                {user?.researchConsent ? 'Allowed (Anonymized Speech Models)' : 'Declined (Private Records Only)'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Security Credentials Card: Password & 2FA */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-teal-600" />
            Security & Authentication Controls
          </h3>
          <p className="text-xs text-slate-500">
            Keep your speech health records protected with multi-factor authentication and token rotation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Two-Factor Authentication Box */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-2xs border border-slate-200/60 dark:border-slate-700">
                  <KeyRound className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Two-Factor Authentication (2FA)</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {user?.twoFactorEnabled ? 'Active (TOTP Authenticator)' : 'Strongly recommended for SLPs'}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleToggle2FA}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                user?.twoFactorEnabled
                  ? 'bg-white dark:bg-slate-800 text-red-600 border-red-200 dark:border-red-900 hover:bg-red-50'
                  : 'bg-teal-700 hover:bg-teal-800 text-white border-transparent shadow-xs'
              }`}
            >
              {user?.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA (TOTP)'}
            </button>
          </div>

          {/* Password Management Box */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-2xs border border-slate-200/60 dark:border-slate-700">
                <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Password & Credentials</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Last changed 14 days ago • Argon2id protected
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 transition-colors"
            >
              Change Password
            </button>
          </div>
        </div>

        {/* Change Password Inline Form */}
        {showPasswordChange && (
          <form onSubmit={handlePasswordChangeSubmit} className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900 space-y-3">
            <h4 className="text-xs font-bold text-teal-900 dark:text-teal-200">Update Account Password</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  New Password (min 10 chars)
                </label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700"
                />
              </div>
            </div>

            {passwordChangeSuccess && (
              <p className="text-xs font-bold text-emerald-600">Password successfully updated!</p>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPasswordChange(false)}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-teal-700 text-white font-bold text-xs hover:bg-teal-800"
              >
                Save New Password
              </button>
            </div>
          </form>
        )}

        {/* 2FA Setup Instructions / Recovery Codes */}
        {show2FASetup && user?.twoFactorEnabled && (
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 space-y-3">
            <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              Two-Factor Authenticator Setup Active
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Scan with Google Authenticator, 1Password, or Authy, or use the manual secret key:
            </p>
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900/60 font-mono text-xs text-indigo-700 dark:text-indigo-300 text-center font-bold tracking-wider">
              {totpSecret || 'JBSWY3DPEHPK3PXP'}
            </div>

            <div>
              <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Emergency Backup Recovery Codes:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(recoveryCodes || ['A98B-7721', 'K28L-9914', 'M54Q-3312', 'X81P-0094']).map((c, i) => (
                  <div key={i} className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-center font-mono text-[11px] border border-slate-200 dark:border-slate-700">
                    {c}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Sessions Panel (Token Family & Reuse Detection) */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Laptop className="w-4 h-4 text-teal-600" />
              Active Sessions & Device Security
            </h3>
            <p className="text-xs text-slate-500">
              Hashed refresh token session tracking with reuse detection. Log out unneeded hardware.
            </p>
          </div>

          <button
            onClick={terminateAllOtherSessions}
            className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline self-start sm:self-auto"
          >
            Log out all other devices
          </button>
        </div>

        <div className="space-y-2.5 pt-1">
          {(user?.activeSessions || []).map((sess) => (
            <div
              key={sess.id}
              className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600">
                  {sess.deviceInfo.toLowerCase().includes('iphone') || sess.deviceInfo.toLowerCase().includes('mobile') ? (
                    <Smartphone className="w-4 h-4" />
                  ) : (
                    <Laptop className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{sess.deviceInfo}</p>
                    {sess.current && (
                      <span className="px-1.5 py-0.2 rounded-md bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 text-[10px] font-bold border border-teal-200/60 dark:border-teal-800">
                        This Device
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    IP: {sess.ip} • Last active: {sess.lastUsedAt}
                  </p>
                </div>
              </div>

              {!sess.current && (
                <button
                  onClick={() => terminateSession(sess.id)}
                  className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                >
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Accessibility & Typography Settings */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Accessibility & Display Settings
          </h3>
          <p className="text-xs text-slate-500">
            Control text scale and color theme for comfortable reading and speech practice.
          </p>
        </div>

        {/* Display Theme */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-2xs border border-slate-200/60 dark:border-slate-700">
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-indigo-500" />
              ) : (
                <Sun className="w-5 h-5 text-amber-500" />
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">App Color Theme</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {theme === 'light' ? 'Clinical Light Theme (Active Default)' : 'Dark High-Contrast Theme'}
              </p>
            </div>
          </div>

          <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-0.5 text-xs font-semibold">
            <button
              onClick={() => theme !== 'light' && toggleTheme()}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                theme === 'light'
                  ? 'bg-teal-700 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Light
            </button>
            <button
              onClick={() => theme !== 'dark' && toggleTheme()}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                theme === 'dark'
                  ? 'bg-teal-700 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Dark
            </button>
          </div>
        </div>

        {/* Text Size */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-2xs border border-slate-200/60 dark:border-slate-700">
              <Type className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Text Size</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {fontSize === 'large' ? 'Large accessibility scale' : 'Standard clinical scale'}
              </p>
            </div>
          </div>

          <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-0.5 text-xs font-semibold">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                fontSize === 'normal'
                  ? 'bg-teal-700 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Standard
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                fontSize === 'large'
                  ? 'bg-teal-700 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Large +
            </button>
          </div>
        </div>
      </div>

      {/* Role Switching for Demonstration */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Switch Platform Perspectives
            </h3>
            <p className="text-xs text-slate-500">
              Quickly test the platform as an active Speech Patient or a Licensed Doctor / Therapist
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <button
            onClick={() => switchDemoRole('patient')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              role === 'patient'
                ? 'border-teal-600 bg-teal-50/60 dark:bg-teal-950/40 dark:border-teal-500 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900 dark:text-white">Patient Perspective</span>
              {role === 'patient' && <Check className="w-4 h-4 text-teal-600" />}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Access the ML speech spectrogram lab, daily exercises, doctor booking, and AI counsellor.
            </p>
          </button>

          <button
            onClick={() => switchDemoRole('therapist')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              role === 'therapist'
                ? 'border-teal-600 bg-teal-50/60 dark:bg-teal-950/40 dark:border-teal-500 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900 dark:text-white">Speech Doctor Perspective</span>
              {role === 'therapist' && <Check className="w-4 h-4 text-teal-600" />}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Clinician view: review incoming patient recordings, manage appointment schedules, and prescribe drills.
            </p>
          </button>
        </div>
      </div>

      {/* Account Deletion & DPDP Act Data Rights */}
      <div className="rounded-3xl border border-red-200 dark:border-red-950/60 bg-red-50/20 dark:bg-red-950/10 p-6 shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-sm text-red-900 dark:text-red-300 flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-red-600" />
            Delete Account & Speech Data (DPDP Act 2023)
          </h3>
          <p className="text-xs text-slate-500">
            Request permanent erasure of all account records, speech biofeedback history, and telehealth consultations. Includes a mandatory 7-day grace period.
          </p>
        </div>

        {!user?.accountDeletionScheduled ? (
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors shadow-2xs"
          >
            Request Account Deletion
          </button>
        ) : (
          <p className="text-xs font-bold text-red-600">
            Deletion scheduled. Active grace period until {new Date(user.accountDeletionScheduled).toLocaleDateString()}.
          </p>
        )}

        {showDeleteModal && (
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900 space-y-3">
            <h4 className="text-xs font-bold text-red-700 dark:text-red-400">
              Confirm Account Erasure Request
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Upon confirmation, all audio spectrogram records, disfluency counts, and session logs will be permanently deleted after 7 days.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
              >
                Nevermind
              </button>
              <button
                onClick={() => {
                  deleteAccountWithGracePeriod();
                  setShowDeleteModal(false);
                }}
                className="px-4 py-1.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700"
              >
                Confirm 7-Day Erasure
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

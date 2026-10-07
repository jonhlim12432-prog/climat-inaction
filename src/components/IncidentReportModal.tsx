import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Camera,
  MapPin,
  AlertTriangle,
  Upload,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  EyeOff,
  Sparkles,
  LogIn,
  UserPlus,
  FileCheck2,
  Loader2,
  Trash2,
} from 'lucide-react';
import { Incident, IncidentCategory, IncidentSeverity, UserProfile } from '../types';
import { compressImage } from '../utils/imageCompressor';

interface IncidentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (incidentData: Partial<Incident>) => Promise<void>;
  initialCategory?: string;
  userProfile?: UserProfile | null;
  onOpenAuthModal?: (mode?: 'login' | 'signup') => void;
  onVerifyKYC?: (kycData: { kycNumber: string; kycIdType: string; kycPhotoUrl?: string }) => Promise<void>;
}

export const IncidentReportModal: React.FC<IncidentReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialCategory,
  userProfile,
  onOpenAuthModal,
  onVerifyKYC,
}) => {
  if (!isOpen) return null;

  const [category, setCategory] = useState<IncidentCategory>(
    (initialCategory as IncidentCategory) || 'flooding'
  );
  const [title, setTitle] = useState('');
  const [barangay, setBarangay] = useState(userProfile?.barangay || 'Sanito');
  const [location, setLocation] = useState('');
  const [severity, setSeverity] = useState<IncidentSeverity>('High');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [photoSelected, setPhotoSelected] = useState<string | null>(null);
  const [isCompressingPhoto, setIsCompressingPhoto] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Inline KYC verification state if user is logged in but unverified
  const [kycIdType, setKycIdType] = useState('Philippine National ID (PhilSys)');
  const [kycNumber, setKycNumber] = useState('');
  const [kycPhotoUrl, setKycPhotoUrl] = useState<string | null>(null);
  const [isSubmittingKYC, setIsSubmittingKYC] = useState(false);
  const [kycError, setKycError] = useState<string | null>(null);
  const [kycSuccessMessage, setKycSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const kycFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userProfile?.barangay) {
      setBarangay(userProfile.barangay);
    }
  }, [userProfile?.barangay]);

  const barangayOptions = [
    'Sanito',
    'Barangay Central',
    'Baluran',
    'Poblacion',
    'Upper Central Ridge',
    'Titay Coastal',
    'Don Andres',
  ];

  const categoryOptions: Array<{ key: IncidentCategory; label: string; icon: string }> = [
    { key: 'flooding', label: 'Flooding & Drainage', icon: '🌊' },
    { key: 'dumping', label: 'Illegal Dumping', icon: '🗑️' },
    { key: 'water_pollution', label: 'Water Pollution', icon: '🛢️' },
    { key: 'deforestation', label: 'Deforestation / Logging', icon: '🪓' },
    { key: 'air_hazard', label: 'Air Hazard / Open Burning', icon: '💨' },
    { key: 'other', label: 'Other Hazard', icon: '⚠️' },
  ];

  // Process uploaded or captured evidence photo with automatic compression
  const handlePhotoUpload = async (file: File) => {
    setIsCompressingPhoto(true);
    setSubmissionError(null);
    try {
      const compressed = await compressImage(file, 800, 800, 0.75);
      setPhotoSelected(compressed);
    } catch (err) {
      console.error('Image compression error:', err);
      setSubmissionError('Failed to process image. Please try a different photo.');
    } finally {
      setIsCompressingPhoto(false);
    }
  };

  const handleSimulatePhoto = () => {
    setPhotoSelected(
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240"><rect width="400" height="240" fill="%23065f46"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="white" font-weight="bold">PHOTO ATTACHED (GEOTAGGED)</text><text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="11" fill="%236ee7b7">ZAMBOANGA SIBUGAY CENRO AUDIT LOG</text></svg>'
    );
  };

  const handleKYCPhotoUpload = async (file: File) => {
    try {
      const compressed = await compressImage(file, 800, 800, 0.8);
      setKycPhotoUrl(compressed);
    } catch (err) {
      console.error('KYC image compression error:', err);
      setKycError('Failed to process ID photo.');
    }
  };

  const handleInlineKYCSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kycNumber.trim()) {
      setKycError('Please enter your government ID number.');
      return;
    }

    setIsSubmittingKYC(true);
    setKycError(null);
    try {
      if (onVerifyKYC) {
        await onVerifyKYC({
          kycNumber: kycNumber.trim(),
          kycIdType,
          kycPhotoUrl: kycPhotoUrl || undefined,
        });
        setKycSuccessMessage('Government ID verified successfully! Incident reporting unlocked.');
      }
    } catch (err: any) {
      setKycError(err.message || 'Failed to verify KYC. Please try again.');
    } finally {
      setIsSubmittingKYC(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) {
      setSubmissionError('Registration & Login required. Please log in before filing reports.');
      return;
    }
    if (!userProfile.isVerified || !userProfile.reportingAuthorized) {
      setSubmissionError('Government ID (KYC) verification required before filing reports.');
      return;
    }
    if (!title.trim() || !location.trim()) {
      setSubmissionError('Please provide an incident title and specific location.');
      return;
    }

    setSubmitting(true);
    setSubmissionError(null);
    try {
      await onSubmit({
        title: title.trim(),
        category,
        type: categoryOptions.find((c) => c.key === category)?.label || 'Environmental Incident',
        location: location.trim(),
        barangay,
        severity,
        description: description.trim() || 'Citizen reported municipal environmental hazard.',
        coordinates: {
          lat: 7.785 + (Math.random() - 0.5) * 0.03,
          lng: 122.585 + (Math.random() - 0.5) * 0.03,
        },
        imageUrl: photoSelected || undefined,
        reportedBy: isAnonymous ? 'Anonymous Citizen (Whistleblower Protected)' : userProfile.name,
      });
      setSubmittedSuccess(true);
      setTimeout(() => {
        setSubmittedSuccess(false);
        onClose();
      }, 1800);
    } catch (err: any) {
      console.error('Incident submission error:', err);
      setSubmissionError(err?.message || 'Failed to transmit report. Please check connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isUserAuthenticated = !!userProfile;
  const isUserKYCVerified = !!(userProfile && userProfile.isVerified && userProfile.reportingAuthorized);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-4 bg-[#15803d] text-white flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider block">
              Direct Municipal Intake
            </span>
            <h2 className="font-extrabold text-base font-display">
              File Environmental Incident Report
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full bg-emerald-800/80 hover:bg-emerald-700 flex items-center justify-center text-white cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* CASE 1: UNREGISTERED / NOT LOGGED IN USER                     */}
        {/* ------------------------------------------------------------- */}
        {!isUserAuthenticated ? (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 mx-auto flex items-center justify-center text-amber-600 shadow-inner">
              <ShieldAlert className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="inline-block bg-amber-100 text-amber-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-amber-200">
                Official Access Gate
              </span>
              <h3 className="text-lg font-black text-slate-900 font-display">
                Citizen Registration & Login Required
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Under Zamboanga Sibugay Municipal Climate Ordinance #2026-04, environmental incident reporting to CENRO is strictly restricted to registered citizens with verified KYC.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2.5">
              <h4 className="font-extrabold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Why is identity verification mandatory?
              </h4>
              <ul className="text-slate-600 space-y-1.5 pl-5 list-disc text-[11.5px] leading-relaxed">
                <li>Eliminates malicious spam, false alarms, and anonymous abuse.</li>
                <li>Ensures rapid CENRO and CDRRMO emergency dispatch to confirmed locations.</li>
                <li>Credits <strong>+50 Eco-Points</strong> directly to your verified citizen account.</li>
              </ul>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAuthModal?.('login');
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In to Existing Citizen Account</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAuthModal?.('signup');
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-slate-600" />
                <span>Create New Citizen Account</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 pt-1 cursor-pointer"
              >
                Cancel and return to dashboard
              </button>
            </div>
          </div>
        ) : !isUserKYCVerified ? (
          /* ------------------------------------------------------------- */
          /* CASE 2: LOGGED IN BUT KYC NOT VERIFIED                        */
          /* ------------------------------------------------------------- */
          <div className="p-6 sm:p-7 space-y-5">
            <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4 flex items-start gap-3.5">
              <div className="p-2 bg-amber-500 text-white rounded-xl shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-xs text-amber-950 uppercase tracking-wider">
                    Government ID (KYC) Required
                  </h3>
                  <span className="bg-amber-200 text-amber-900 text-[9px] font-bold px-2 py-0.5 rounded-full">
                    Action Required
                  </span>
                </div>
                <p className="text-xs text-amber-900/90 leading-relaxed">
                  Signed in as <strong>{userProfile.name}</strong> ({userProfile.email}). Before you can report incidents to CENRO triage, your Government ID must be verified under Municipal Ordinance #2026-04.
                </p>
              </div>
            </div>

            {kycError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium">
                {kycError}
              </div>
            )}

            {kycSuccessMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{kycSuccessMessage}</span>
              </div>
            )}

            <form onSubmit={handleInlineKYCSubmit} className="space-y-4 bg-slate-50 border border-slate-200 rounded-2xl p-4.5">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <FileCheck2 className="w-4 h-4 text-emerald-600" />
                <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                  Instant Citizen KYC Verification
                </h4>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Government ID Type *
                </label>
                <select
                  value={kycIdType}
                  onChange={(e) => setKycIdType(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  <option value="Philippine National ID (PhilSys)">Philippine National ID (PhilSys)</option>
                  <option value="Driver's License (LTO)">Driver's License (LTO)</option>
                  <option value="Professional Regulation Commission (PRC) ID">PRC ID (Professional License)</option>
                  <option value="Voter's Certification (COMELEC)">Voter's Certification (COMELEC)</option>
                  <option value="Philippine Passport">Philippine Passport (DFA)</option>
                  <option value="Civil Service Commission (CSC) ID">Civil Service ID</option>
                  <option value="Barangay Resident Certificate">Barangay Resident Certificate</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Government ID Number *
                </label>
                <input
                  type="text"
                  required
                  value={kycNumber}
                  onChange={(e) => setKycNumber(e.target.value)}
                  placeholder="e.g. PS-8921-4402-9912 or DL-N02-14-098231"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  ID Card Photo Verification (Optional / Recommended)
                </label>
                <input
                  type="file"
                  ref={kycFileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleKYCPhotoUpload(file);
                  }}
                />

                {kycPhotoUrl ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold truncate">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>ID Photo Attached & Compressed</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setKycPhotoUrl(null)}
                      className="text-rose-600 hover:text-rose-800 text-[11px] font-bold ml-2 shrink-0 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => kycFileInputRef.current?.click()}
                    className="w-full py-2 px-3 border border-dashed border-slate-300 hover:border-emerald-500 rounded-xl bg-white text-xs text-slate-600 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    <span>Upload Government ID Snapshot</span>
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmittingKYC}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                {isSubmittingKYC ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Government ID with CENRO...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Submit & Verify KYC (+100 Eco-Points)</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
              >
                Cancel and return to dashboard
              </button>
            </div>
          </div>
        ) : submittedSuccess ? (
          /* ------------------------------------------------------------- */
          /* CASE 3: SUBMISSION SUCCESS SCREEN                             */
          /* ------------------------------------------------------------- */
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 font-display">
              Incident Submitted Successfully!
            </h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Your report has been entered into the CENRO digital triage queue. You earned{' '}
              <span className="font-bold text-emerald-700">+50 Eco-Points</span>.
            </p>
          </div>
        ) : (
          /* ------------------------------------------------------------- */
          /* CASE 4: VERIFIED CITIZEN REPORTING FORM                       */
          /* ------------------------------------------------------------- */
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Verified Reporter Identity Pill */}
            <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-extrabold text-emerald-950 block leading-tight">
                    Verified Citizen Reporter: {userProfile.name}
                  </span>
                  <span className="text-[10px] text-emerald-800 font-medium">
                    ID: {userProfile.kycNumber || 'Verified PhilSys'} • {userProfile.barangay}
                  </span>
                </div>
              </div>
              <span className="bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                KYC Cleared
              </span>
            </div>

            {submissionError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium">
                {submissionError}
              </div>
            )}

            {/* Hidden file inputs for photo attachment */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handlePhotoUpload(file);
              }}
            />
            <input
              type="file"
              ref={cameraInputRef}
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handlePhotoUpload(file);
              }}
            />

            {/* Category selection */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                1. Select Hazard Category *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {categoryOptions.map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setCategory(cat.key)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                      category === cat.key
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-600/20'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-base">{cat.icon}</span>
                    <span className="truncate">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                2. Incident Summary Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Clogged drainage culvert overflowing onto main road"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white font-medium"
              />
            </div>

            {/* Barangay and Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Barangay *
                </label>
                <select
                  value={barangay}
                  onChange={(e) => setBarangay(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white font-medium"
                >
                  {barangayOptions.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Specific Street / Purok *
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Purok 3 near Bridge Outflow"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white font-medium"
                />
              </div>
            </div>

            {/* Severity Level */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Hazard Severity Rating
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['Low', 'Moderate', 'High', 'Critical'] as IncidentSeverity[]).map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverity(sev)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      severity === sev
                        ? sev === 'Critical'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : sev === 'High'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo upload attachment with real file & camera support */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Photographic Telemetry Evidence
              </label>
              {isCompressingPhoto ? (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                  <span>Optimizing photo compression for Firestore...</span>
                </div>
              ) : photoSelected ? (
                <div className="relative rounded-2xl overflow-hidden border border-emerald-300 p-2.5 bg-emerald-50 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs font-bold text-emerald-800 truncate">
                    <img
                      src={photoSelected}
                      alt="Evidence preview"
                      className="w-10 h-10 rounded-lg object-cover border border-emerald-200 shrink-0"
                    />
                    <div className="truncate">
                      <span className="block truncate">Evidence Photo Attached (Geotagged)</span>
                      <span className="text-[10px] text-emerald-600 font-semibold block">Compressed & Ready</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPhotoSelected(null)}
                    className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer shrink-0 ml-2"
                    title="Remove attached photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex-1 py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-emerald-600" />
                    <span>Take Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-slate-500" />
                    <span>Browse File</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSimulatePhoto}
                    className="py-2.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[10px] font-semibold text-slate-500 transition-colors cursor-pointer"
                    title="Use sample geotagged photo preview"
                  >
                    Sample
                  </button>
                </div>
              )}
            </div>

            {/* Narrative description */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Field Observation Details
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the environmental impact, water color, debris volume, or immediate risk to residents..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white resize-none font-medium"
              />
            </div>

            {/* Whistleblower Anonymous Toggle */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <EyeOff className="w-4 h-4 text-slate-500" />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Submit as Whistleblower
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Conceal personal name from public incident logs (RA 9003 protected)
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
              />
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Transmitting to CENRO Triage Queue...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Transmit Incident Report (+50 Eco-Points)</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};


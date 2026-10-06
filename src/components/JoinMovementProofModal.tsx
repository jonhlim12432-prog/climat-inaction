import React, { useState } from 'react';
import {
  X,
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  Award,
  Users,
  Image as ImageIcon,
  ShieldCheck,
  User,
  Info,
} from 'lucide-react';
import { CommunityActivity, UserProfile } from '../types';
import { compressImage } from '../utils/imageCompressor';

interface JoinMovementProofModalProps {
  activity: CommunityActivity | null;
  isOpen: boolean;
  onClose: () => void;
  citizenProfile?: UserProfile | null;
  onSubmitProof: (data: {
    activityId: string;
    activityTitle: string;
    activityCategory?: string;
    description: string;
    photoUrl: string;
    hoursSpent: number;
    ecoPointsReward: number;
    citizenName?: string;
    citizenEmail?: string;
    citizenBarangay?: string;
    citizenAvatar?: string;
  }) => Promise<void>;
}

// Quick high-quality field proof presets for testing or demonstration
const SAMPLE_PROOF_PHOTOS = [
  {
    label: 'Mangrove Coastal Cleanup',
    url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
    description: 'Collected 3 sacks of non-biodegradable plastics and fishing gear tangled in mangrove roots.',
  },
  {
    label: 'Ridge Tree Planting',
    url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    description: 'Planted 10 native hardwood saplings on the upland watershed slope to stabilize hillside soil.',
  },
  {
    label: 'Riverbank Debris Clearing',
    url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    description: 'Assisted barangay volunteer corps in removing clogged driftwood and plastic bottles from drainage spillway.',
  },
];

export const JoinMovementProofModal: React.FC<JoinMovementProofModalProps> = ({
  activity,
  isOpen,
  onClose,
  citizenProfile,
  onSubmitProof,
}) => {
  const [proofPhoto, setProofPhoto] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [hoursSpent, setHoursSpent] = useState<number>(2);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !activity) return null;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setErrorMessage(null);
      try {
        const compressed = await compressImage(file, 600, 600, 0.80);
        setProofPhoto(compressed);
      } catch (err) {
        console.error('Failed to compress proof image', err);
        setErrorMessage('Failed to process image. Please try another photo.');
      }
    }
  };

  const handleSelectSample = (sample: typeof SAMPLE_PROOF_PHOTOS[0]) => {
    setProofPhoto(sample.url);
    if (!description.trim()) {
      setDescription(sample.description);
    }
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofPhoto) {
      setErrorMessage('Please upload or select a photo proof of your participation before submitting.');
      return;
    }
    if (!description.trim()) {
      setErrorMessage('Please describe your participation accomplishments.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    try {
      await onSubmitProof({
        activityId: activity.id,
        activityTitle: activity.title,
        activityCategory: activity.category,
        description: description.trim(),
        photoUrl: proofPhoto,
        hoursSpent: Number(hoursSpent) || 2,
        ecoPointsReward: activity.ecoPointsReward,
        citizenName: citizenProfile?.name,
        citizenEmail: citizenProfile?.email,
        citizenBarangay: citizenProfile?.barangay,
        citizenAvatar: citizenProfile?.avatarUrl,
      });
      // Reset & Close
      setProofPhoto('');
      setDescription('');
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to submit participation proof. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl space-y-4 sm:space-y-5 relative border border-slate-100 my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 pr-6">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>Community Movement Participation Proof</span>
          </div>
          <h2 className="text-xl font-black font-display text-slate-900 tracking-tight">
            Submit Movement Proof
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            To complete your registration and earn Eco-Points, upload photographic proof of your participation. CENRO Municipal Administrators will check, verify, and approve your submission to credit your points!
          </p>
        </div>

        {/* Selected Activity Summary Card */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                {activity.category}
              </span>
              <h3 className="font-extrabold text-sm text-slate-900 leading-snug">
                {activity.title}
              </h3>
            </div>
            <span className="text-xs font-black text-emerald-700 bg-white border border-emerald-200 px-2.5 py-1 rounded-xl shrink-0 shadow-2xs">
              +{activity.ecoPointsReward} Eco-Points
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-medium pt-1.5 border-t border-emerald-200/60">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{activity.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{activity.date}</span>
            </div>
          </div>
        </div>

        {/* Submitting Citizen Identity Card */}
        {citizenProfile && (
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              {citizenProfile.avatarUrl ? (
                <img
                  src={citizenProfile.avatarUrl}
                  alt={citizenProfile.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-400"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                  {citizenProfile.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <span className="font-bold text-slate-900 block leading-tight">{citizenProfile.name}</span>
                <span className="text-[10px] text-slate-500">{citizenProfile.barangay} · Citizen ID Verified</span>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              Submitting Citizen
            </span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Proof Photo Upload */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block font-bold text-slate-800">
                Photographic Proof of Participation *
              </label>
              <span className="text-[10px] text-rose-600 font-bold">Required for Points</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Upload a clear photo showing you actively volunteering, planting seedlings, clearing debris, or participating on-site.
            </p>

            {proofPhoto ? (
              <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500 group shadow-sm">
                <img
                  src={proofPhoto}
                  alt="Participation proof preview"
                  className="w-full h-48 sm:h-52 object-cover"
                />
                <div className="absolute top-2 right-2 flex items-center gap-1.5">
                  <label className="bg-slate-900/80 hover:bg-slate-900 text-white text-[11px] px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer shadow-md">
                    Change
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setProofPhoto('')}
                    className="bg-rose-600/90 hover:bg-rose-600 text-white text-[11px] px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer shadow-md"
                  >
                    Remove
                  </button>
                </div>
                <div className="absolute bottom-2 left-2 bg-emerald-950/80 text-emerald-200 text-[10px] px-2.5 py-1 rounded-md font-bold flex items-center gap-1.5 backdrop-blur-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Proof Photo Loaded</span>
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50/70 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-all group">
                <div className="w-12 h-12 rounded-full bg-emerald-100 group-hover:bg-emerald-200 flex items-center justify-center text-emerald-700 transition-colors">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-bold text-emerald-900 block text-xs">Click or Tap to Upload Proof Photo</span>
                  <span className="text-[11px] text-slate-500">PNG, JPG, or WEBP (Max 4MB)</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}

            {/* Quick Demo Sample Photos for instantaneous verification testing */}
            <div className="pt-1">
              <span className="text-[10px] text-slate-400 font-semibold block mb-1">
                Or select a sample field action photo:
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {SAMPLE_PROOF_PHOTOS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    className="text-[10px] font-medium p-1.5 rounded-lg border border-slate-200 hover:border-emerald-400 bg-slate-50 hover:bg-emerald-50 text-slate-700 truncate cursor-pointer transition-colors text-left flex items-center gap-1"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="truncate">{sample.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description of Accomplishments */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-800">
              Participation Notes & Accomplishments *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Cleared 3 sacks of plastic and discarded nets along the shoreline. Planted 5 mangrove propagules..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white resize-none"
            />
          </div>

          {/* Hours Contributed */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-800">
              Hours Contributed
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0.5}
                max={24}
                step={0.5}
                value={hoursSpent}
                onChange={(e) => setHoursSpent(parseFloat(e.target.value) || 1)}
                className="w-24 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono text-center focus:outline-emerald-600"
              />
              <span className="text-slate-500 font-medium">hours of community service</span>
            </div>
          </div>

          {/* Admin Verification Notice */}
          <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-[11px] text-emerald-950 space-y-1">
            <div className="font-extrabold text-emerald-900 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>Admin Verification & Eco-Points Crediting</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              Your submission will be dispatched to the <strong className="text-slate-900">CENRO Admin Review Queue</strong>. Once an administrator checks and verifies your photo proof, <strong className="text-emerald-700 font-black">+{activity.ecoPointsReward} Eco-Points</strong> will be credited directly to your Citizen Profile!
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !proofPhoto}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold cursor-pointer transition-all shadow-md shadow-emerald-950/20 flex items-center gap-2"
            >
              {submitting ? (
                <span>Submitting Proof...</span>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Submit Proof for Admin Verification</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

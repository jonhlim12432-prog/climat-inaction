import React, { useState, useRef } from 'react';
import {
  User,
  ShieldCheck,
  Award,
  CreditCard,
  CheckCircle2,
  FileCheck,
  RefreshCw,
  Edit3,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Camera,
  Medal,
  Upload,
  Trash2,
  Eye,
  X,
  Clock,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Image as ImageIcon,
} from 'lucide-react';
import { UserProfile, Incident, CommunityActivity } from '../types';
import { evaluateCitizenBadges } from '../utils/badgeSystem';
import { CitizenBadgesSection } from './CitizenBadgesSection';
import { compressImage } from '../utils/imageCompressor';

interface CitizenProfileViewProps {
  userProfile: UserProfile;
  incidents?: Incident[];
  activities?: CommunityActivity[];
  onUpdateProfile: (updatedData: Partial<UserProfile>) => Promise<void>;
  onOpenReportModal: () => void;
  onViewTracker: () => void;
  onBrowseActivities: () => void;
  onOpenProofModalForActivity?: (activity: CommunityActivity) => void;
}

// Preset avatars for rapid eco citizen styling
const PRESET_AVATARS = [
  {
    name: 'Eco Ranger',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Forest Steward',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Marine Guardian',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Youth Volunteer',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
  },
];

export const CitizenProfileView: React.FC<CitizenProfileViewProps> = ({
  userProfile,
  incidents = [],
  activities = [],
  onUpdateProfile,
  onOpenReportModal,
  onViewTracker,
  onBrowseActivities,
  onOpenProofModalForActivity,
}) => {
  const [name, setName] = useState(userProfile.name);
  const [phone, setPhone] = useState(userProfile.phone);
  const [barangay, setBarangay] = useState(userProfile.barangay);
  const [city, setCity] = useState(userProfile.city);
  const [address, setAddress] = useState(userProfile.address);
  const [bio, setBio] = useState(userProfile.bio);
  const [emergencyName, setEmergencyName] = useState(userProfile.emergencyContact.name);
  const [emergencyPhone, setEmergencyPhone] = useState(userProfile.emergencyContact.phone);
  const [avatarUrl, setAvatarUrl] = useState<string>(userProfile.avatarUrl || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [photoSavedSuccess, setPhotoSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);
  const [zoomProof, setZoomProof] = useState<{
    url: string;
    title: string;
    description?: string;
    status?: string;
    points?: number;
    date?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const headerFileInputRef = useRef<HTMLInputElement>(null);

  // Evaluate dynamic citizen achievement badge system
  const {
    badges,
    unlockedCount,
    totalCount,
    incidentsCount,
    activitiesCount,
    highestBadge,
  } = evaluateCitizenBadges(userProfile, incidents, activities);

  const barangayList = [
    'Barangay Central',
    'Sanito',
    'Baluran',
    'Poblacion',
    'Upper Central Ridge',
    'Titay Coastal',
    'Don Andres',
  ];

  // Process uploaded image file
  const handlePhotoUpload = async (file: File) => {
    try {
      const compressed = await compressImage(file, 400, 400, 0.82);
      setAvatarUrl(compressed);
      setSaving(true);
      try {
        await onUpdateProfile({ avatarUrl: compressed });
        setPhotoSavedSuccess(true);
        setTimeout(() => setPhotoSavedSuccess(false), 3000);
      } finally {
        setSaving(false);
      }
    } catch (err) {
      console.error('Failed to process avatar photo', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handlePhotoUpload(file);
    }
  };

  const handleSelectPresetAvatar = async (url: string) => {
    setAvatarUrl(url);
    setSaving(true);
    try {
      await onUpdateProfile({ avatarUrl: url });
      setPhotoSavedSuccess(true);
      setTimeout(() => setPhotoSavedSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleRemovePhoto = async () => {
    setAvatarUrl('');
    setSaving(true);
    try {
      await onUpdateProfile({ avatarUrl: '' });
      setPhotoSavedSuccess(true);
      setTimeout(() => setPhotoSavedSuccess(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onUpdateProfile({
        name,
        phone,
        barangay,
        city,
        address,
        bio,
        avatarUrl,
        emergencyContact: {
          name: emergencyName,
          phone: emergencyPhone,
        },
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden file inputs for avatar upload */}
      <input
        ref={headerFileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white text-slate-900 rounded-3xl p-5 shadow-xs border border-emerald-200/90">
        <h1 className="font-black text-xl font-display tracking-tight text-emerald-950">
          Citizen Profile & Account Information
        </h1>
        <p className="text-xs text-slate-600 mt-1 leading-snug">
          Track your citizen verification status, uploaded profile photo, accumulated eco-points, community rank, and environmental stewardship awards.
        </p>
      </div>

      {/* Visual Badge System for Citizen Profile */}
      <CitizenBadgesSection
        evaluatedBadges={badges}
        unlockedCount={unlockedCount}
        totalCount={totalCount}
        incidentsCount={incidentsCount}
        activitiesCount={activitiesCount}
        onOpenReportModal={onOpenReportModal}
        onBrowseActivities={onBrowseActivities}
      />

      {/* Responsive 2-Column Grid for Desktop and Tablet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Identity, Stats, KYC */}
        <div className="lg:col-span-5 space-y-4">
          {/* Primary Profile Identity Card with Interactive Photo Upload */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-4">
            <div className="flex items-start gap-4">
              {/* Avatar with Camera Trigger & Image Display */}
              <div className="relative group shrink-0">
                {avatarUrl || userProfile.avatarUrl ? (
                  <img
                    src={avatarUrl || userProfile.avatarUrl}
                    alt={userProfile.name}
                    className="w-16 h-16 rounded-full object-cover shadow-md ring-4 ring-emerald-100 group-hover:ring-emerald-300 transition-all"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center text-white font-extrabold text-xl shadow-md ring-4 ring-emerald-100">
                    {userProfile.name ? userProfile.name.split(' ').map((n) => n[0]).join('').slice(0, 2) : 'MK'}
                  </div>
                )}

                {/* Camera Upload Trigger Overlay */}
                <button
                  type="button"
                  onClick={() => headerFileInputRef.current?.click()}
                  title="Upload / Change Profile Photo"
                  className="absolute -bottom-1 -left-1 bg-slate-900/90 hover:bg-slate-900 active:scale-95 text-white p-1.5 rounded-full ring-2 ring-white shadow-md cursor-pointer transition-transform hover:scale-110"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>

                {userProfile.isVerified && (
                  <span
                    className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 ring-2 ring-white"
                    title="Verified Citizen Status"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-extrabold text-lg text-slate-900 font-display truncate">
                    {userProfile.name}
                  </h2>
                  <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Citizen
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-700 mt-0.5">{userProfile.barangay}</p>

                {highestBadge && (
                  <div className="mt-2 flex items-center gap-1.5 bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-emerald-300 text-emerald-950 px-2.5 py-1 rounded-xl text-[11px] font-black shadow-2xs w-fit">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Honor: {highestBadge.name} ({highestBadge.tier.toUpperCase()})</span>
                  </div>
                )}

                <div className="mt-2 flex flex-col gap-1 text-xs">
                  <span className="inline-flex items-center gap-1.5 bg-slate-100/80 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-full text-[11px] font-medium w-fit truncate max-w-full">
                    <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{userProfile.email}</span>
                  </span>
                  <span className="text-slate-600 font-mono text-[11px]">
                    {userProfile.phone}
                  </span>
                </div>
              </div>
            </div>

            {/* Photo upload status or trigger banner */}
            {photoSavedSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Profile photo updated successfully!</span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={() => headerFileInputRef.current?.click()}
                className="flex-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 py-1.5 px-3 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{avatarUrl ? 'Change Photo' : 'Upload Profile Photo'}</span>
              </button>
              {avatarUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="text-xs font-bold text-slate-500 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 py-1.5 px-2.5 rounded-xl transition-colors cursor-pointer"
                  title="Remove profile photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Stat Cards 1, 2, 3, 4 */}
          <div className="space-y-3">
            {/* CURRENT ECO-POINTS */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Current Eco-Points
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-black text-emerald-600 font-display tabular-nums">
                  {userProfile.ecoPoints}
                </span>
                <span className="text-xs font-bold text-emerald-700">pts</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                +100 pts on KYC approval • +100 pts on verified movement proof • +50 pts on report remediation
              </p>
            </div>

            {/* HONORS & BADGES UNLOCKED */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Civic Honors & Badges
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-3xl font-black text-emerald-700 font-display tabular-nums">
                  {unlockedCount}
                </span>
                <span className="text-xs font-bold text-slate-500">of {totalCount} Badges Unlocked</span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium mt-1 flex items-center gap-1">
                <Medal className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Top Distinction: <strong className="text-emerald-800 font-bold">{highestBadge?.name || 'Citizen Volunteer'}</strong></span>
              </p>
            </div>

            {/* CITIZEN LEVEL */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Citizen Level
              </span>
              <div className="text-lg font-black text-emerald-800 font-display mt-0.5">
                {userProfile.level}
              </div>
              <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                Rank: <span className="font-bold text-emerald-700">{userProfile.rank}</span> • Status: <span className="text-emerald-600 font-bold">Active</span>
              </p>
            </div>

            {/* REPORTING AUTHORIZATION */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Reporting Authorization
              </span>
              <div className="text-lg font-black text-emerald-600 font-display mt-0.5">
                Authorized
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Verified ID required to file incident reports with priority triage.
              </p>
            </div>
          </div>

          {/* Government ID (KYC) Verification Card */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 font-display">
                Government ID (KYC) Verification
              </h3>
              <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Verified Citizen
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Your government ID has been verified by CENRO administration. Real-time incident reporting and movement participation are fully authorized.
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-700">
              Government / Civil Service ID • Number:{' '}
              <span className="font-mono font-bold text-emerald-800">{userProfile.kycNumber}</span>
            </div>

            <button
              onClick={() => setShowKycModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs py-2 px-3.5 rounded-xl transition-colors cursor-pointer"
            >
              Update / Replace ID
            </button>
          </div>
        </div>

        {/* Right Column: Edit Profile & Movements */}
        <div className="lg:col-span-7 space-y-4">
          {/* Edit Profile Information & Contact Details */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 font-display">
                Edit Profile Information & Contact Details
              </h3>
              {savedSuccess && (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
                </span>
              )}
            </div>

            {/* Profile Photo Uploader Card inside Edit Form */}
            <div className="p-4 bg-emerald-50/50 border border-emerald-200/80 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Citizen Profile Photo</span>
                  <span className="text-[11px] text-slate-500">
                    Upload your profile picture to personalize your civic presence and proof submissions.
                  </span>
                </div>
                {avatarUrl && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Photo Active
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3.5 pt-1">
                <div className="relative shrink-0">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar preview"
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500 shadow-xs"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center shadow-xs">
                      {name ? name.slice(0, 2).toUpperCase() : 'MK'}
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl cursor-pointer shadow-2xs flex items-center gap-1.5 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{avatarUrl ? 'Choose New File' : 'Upload Photo'}</span>
                    </button>
                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 font-bold text-xs px-2.5 py-1.5 rounded-xl cursor-pointer transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    Supported: JPG, PNG, WEBP (Max 4MB)
                  </span>
                </div>
              </div>

              {/* Quick Preset Avatars */}
              <div className="pt-2 border-t border-emerald-200/50">
                <span className="text-[10px] text-slate-600 font-bold block mb-1.5">
                  Or pick a Community Volunteer Avatar:
                </span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {PRESET_AVATARS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPresetAvatar(preset.url)}
                      className="group flex items-center gap-1.5 bg-white hover:bg-emerald-100/60 border border-slate-200 hover:border-emerald-300 p-1 rounded-xl text-left cursor-pointer transition-all shrink-0"
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-6 h-6 rounded-lg object-cover"
                      />
                      <span className="text-[10px] font-semibold text-slate-700 pr-1.5 group-hover:text-emerald-900">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
              {/* Registered Email */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Registered Email Address (Official Citizen Account)
                </label>
                <input
                  type="text"
                  disabled
                  value={userProfile.email}
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 cursor-not-allowed"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  This is your official registered citizen portal login email address.
                </span>
              </div>

              {/* Full Legal Name */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              {/* Mobile Phone Number */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Mobile Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              {/* Barangay Residence */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Barangay Residence *
                </label>
                <select
                  value={barangay}
                  onChange={(e) => setBarangay(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                >
                  {barangayList.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* City / Municipality */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  City / Municipality
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              {/* Street Address / Purok */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Street Address / Purok *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              {/* Climate Stewardship Bio */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Climate Stewardship Bio
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell the community about your environmental involvement or advocacy..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white resize-none"
                />
              </div>

              {/* Emergency Contact Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    placeholder="Contact person in disaster"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Emergency Contact Phone
                  </label>
                  <input
                    type="text"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder="+63 917 000 0000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Citizen Account Standing & Response Participation */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 font-display">
              Citizen Account Standing & Response Participation
            </h3>

            <div className="space-y-2.5">
              <div className="p-3.5 bg-slate-50 border border-slate-200/70 rounded-2xl">
                <h4 className="font-extrabold text-xs text-slate-900">Identity Compliance</h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Government ID verified under Municipal Ordinance #2026-04.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200/70 rounded-2xl">
                <h4 className="font-extrabold text-xs text-slate-900">Priority Triage Access</h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Direct dispatch queue routing for confirmed environmental violations.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200/70 rounded-2xl">
                <h4 className="font-extrabold text-xs text-slate-900">Community Restoration</h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Authorized volunteer for barangay tree drives and river cleanups.
                </p>
              </div>
            </div>
          </div>

          {/* My Joined Movements & Participation Proofs (Rich Photo & Verification Status) */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 font-display">
                  My Joined Movements & Participation Proofs
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track your uploaded proofs, CENRO admin verification, and earned eco-points.
                </p>
              </div>
              <button
                type="button"
                onClick={onBrowseActivities}
                className="text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Browse Drives</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {userProfile.joinedMovements && userProfile.joinedMovements.length > 0 ? (
              <div className="space-y-3 pt-1">
                {userProfile.joinedMovements.map((m) => (
                  <div
                    key={m.id}
                    className="p-3.5 bg-slate-50/80 border border-slate-200/80 rounded-2xl space-y-2.5 transition-all hover:bg-white hover:shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Proof Photo Thumbnail with Click to Zoom */}
                        {m.proofPhoto ? (
                          <div
                            onClick={() =>
                              setZoomProof({
                                url: m.proofPhoto!,
                                title: m.activityTitle,
                                description: m.description,
                                status: m.status,
                                points: m.pointsAwarded,
                                date: m.date,
                              })
                            }
                            className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 cursor-pointer group/thumb ring-1 ring-emerald-300"
                            title="Click to zoom proof photo"
                          >
                            <img
                              src={m.proofPhoto}
                              alt={m.activityTitle}
                              className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center text-white transition-opacity">
                              <Eye className="w-4 h-4" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                        )}

                        <div className="min-w-0">
                          <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug truncate">
                            {m.activityTitle}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <span>{m.date || m.submittedDate || 'Recent'}</span>
                            {m.activityCategory && (
                              <>
                                <span>•</span>
                                <span className="font-semibold text-emerald-800">{m.activityCategory}</span>
                              </>
                            )}
                          </div>
                          {m.description && (
                            <p className="text-[11px] text-slate-600 line-clamp-2 mt-1">
                              "{m.description}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Status & Points Badges */}
                      <div className="text-right shrink-0 flex flex-col items-end gap-1">
                        <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg block">
                          +{m.pointsAwarded} pts
                        </span>

                        {m.status === 'Verified' && (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Verified</span>
                          </span>
                        )}

                        {m.status === 'Pending Review' && (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold">
                            <Clock className="w-3 h-3" />
                            <span>Pending Admin</span>
                          </span>
                        )}

                        {m.status === 'Rejected' && (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-full font-bold">
                            <AlertCircle className="w-3 h-3" />
                            <span>Needs Resubmission</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Explanatory Verification Footer */}
                    <div className="text-[10.5px] pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-slate-500">
                      {m.status === 'Verified' ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          ✓ Verified by CENRO administration · Eco-Points credited to your account
                        </span>
                      ) : m.status === 'Pending Review' ? (
                        <span className="text-amber-700 font-semibold flex items-center gap-1">
                          ⏳ Under admin review in CMS verification queue · Points awarded on approval
                        </span>
                      ) : (
                        <span className="text-rose-700 font-semibold">
                          Feedback: {m.adminFeedback || 'Please provide clearer photo proof.'}
                        </span>
                      )}

                      {m.proofPhoto && (
                        <button
                          type="button"
                          onClick={() =>
                            setZoomProof({
                              url: m.proofPhoto!,
                              title: m.activityTitle,
                              description: m.description,
                              status: m.status,
                              points: m.pointsAwarded,
                              date: m.date,
                            })
                          }
                          className="text-[10.5px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer flex items-center gap-0.5"
                        >
                          <span>View Proof</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                <p>
                  You have not submitted participation proofs for any community movements yet. Browse upcoming volunteer drives, upload your photo proof, and get verified for Eco-Points!
                </p>
                <button
                  type="button"
                  onClick={onBrowseActivities}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Browse Climate Activities
                </button>
              </div>
            )}
          </div>

          {/* Bottom Quick Links */}
          <div className="space-y-2 pt-2">
            <button
              onClick={onOpenReportModal}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              Submit New Incident Report
            </button>

            <button
              onClick={onViewTracker}
              className="w-full py-3 bg-white hover:bg-slate-50 text-emerald-800 border border-emerald-600/40 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              View My Incident Reports
            </button>

            <button
              onClick={onBrowseActivities}
              className="w-full py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              Browse Community Volunteer Drives
            </button>
          </div>
        </div>
      </div>

      {/* Proof Photo Zoom Modal */}
      {zoomProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl space-y-0 relative border border-slate-100">
            <button
              onClick={() => setZoomProof(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative h-64 sm:h-72 bg-slate-900">
              <img
                src={zoomProof.url}
                alt={zoomProof.title}
                className="w-full h-full object-contain"
              />
              <span
                className={`absolute top-4 left-4 text-[10px] font-bold px-3 py-1 rounded-full shadow-md text-white ${
                  zoomProof.status === 'Verified' ? 'bg-emerald-600' : 'bg-amber-500'
                }`}
              >
                {zoomProof.status || 'Submitted Proof'}
              </span>
            </div>

            <div className="p-5 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-base text-slate-900">{zoomProof.title}</h4>
                {zoomProof.points && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl">
                    +{zoomProof.points} Eco-Points
                  </span>
                )}
              </div>
              {zoomProof.description && (
                <p className="text-xs text-slate-600 leading-relaxed">
                  {zoomProof.description}
                </p>
              )}
              {zoomProof.date && (
                <span className="text-[11px] text-slate-400 block pt-1">
                  Submitted on: {zoomProof.date}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Update KYC Modal */}
      {showKycModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 font-display">
              Update Government ID (KYC)
            </h3>
            <p className="text-xs text-slate-600">
              Upload a clear photo of your Philippine National ID (PhilSys), Driver's License, or Civil Service Commission ID.
            </p>
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center text-xs text-slate-500 space-y-2">
              <Camera className="w-8 h-8 text-slate-400 mx-auto" />
              <span>Tap to capture or upload government ID card</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowKycModal(false)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('ID submitted to CENRO registry for audit review.');
                  setShowKycModal(false);
                }}
                className="flex-1 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Submit ID
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

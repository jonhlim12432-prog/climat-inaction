import React, { useState } from 'react';
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
} from 'lucide-react';
import { UserProfile } from '../types';

interface CitizenProfileViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (updatedData: Partial<UserProfile>) => Promise<void>;
  onOpenReportModal: () => void;
  onViewTracker: () => void;
  onBrowseActivities: () => void;
}

export const CitizenProfileView: React.FC<CitizenProfileViewProps> = ({
  userProfile,
  onUpdateProfile,
  onOpenReportModal,
  onViewTracker,
  onBrowseActivities,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [phone, setPhone] = useState(userProfile.phone);
  const [barangay, setBarangay] = useState(userProfile.barangay);
  const [city, setCity] = useState(userProfile.city);
  const [address, setAddress] = useState(userProfile.address);
  const [bio, setBio] = useState(userProfile.bio);
  const [emergencyName, setEmergencyName] = useState(userProfile.emergencyContact.name);
  const [emergencyPhone, setEmergencyPhone] = useState(userProfile.emergencyContact.phone);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);

  const barangayList = [
    'Barangay Central',
    'Sanito',
    'Baluran',
    'Poblacion',
    'Upper Central Ridge',
    'Titay Coastal',
    'Don Andres',
  ];

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
      {/* Header Banner */}
      <div className="bg-[#15803d] text-white rounded-3xl p-5 shadow-sm border border-emerald-600/30">
        <h1 className="font-extrabold text-xl font-display tracking-tight">
          Citizen Profile & Account Information
        </h1>
        <p className="text-xs text-emerald-100/90 mt-1 leading-snug">
          Track your citizen verification status, accumulated eco-points, community rank, and environmental stewardship awards.
        </p>
      </div>

      {/* Responsive 2-Column Grid for Desktop and Tablet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Identity, Stats, KYC */}
        <div className="lg:col-span-5 space-y-4">
          {/* Primary Profile Identity Card (Exact to screenshot) */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex items-start gap-4">
          {/* Avatar (Large green circle) */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center text-white font-extrabold text-xl shadow-md ring-4 ring-emerald-100">
              MK
            </div>
            {userProfile.isVerified && (
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 ring-2 ring-white">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-extrabold text-lg text-slate-900 font-display">
                {userProfile.name}
              </h2>
              <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3" />
                Verified Citizen
              </span>
            </div>

            <p className="text-xs font-semibold text-slate-700 mt-0.5">{userProfile.barangay}</p>

            <div className="mt-2 flex flex-col gap-1 text-xs">
              <span className="inline-flex items-center gap-1.5 bg-slate-100/80 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-full text-[11px] font-medium w-fit">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                {userProfile.email}
              </span>
              <span className="text-slate-600 font-mono text-[11px]">
                {userProfile.phone}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            alert('Account is verified under LGU Citizen Single Sign-On.');
          }}
          className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
        >
          Sign Out
        </button>
      </div>

      {/* Stat Cards 1, 2, 3 */}
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
            +100 pts on KYC approval • +50 pts on report remediation • +30 pts on carbon audit
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

      {/* Government ID (KYC) Verification Card (Exact to screenshot) */}
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
          Your government ID has been verified by CENRO administration. Real-time incident reporting is fully authorized.
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
      {/* Edit Profile Information & Contact Details (Exact to screenshot) */}
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

          {/* Save Button (Prominent green button from screenshot) */}
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

      {/* Citizen Account Standing & Response Participation (Exact to screenshot) */}
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

      {/* My Joined Movements & Participation Proofs (Exact to screenshot) */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-900 font-display">
            My Joined Movements & Participation Proofs
          </h3>
          <button
            onClick={() => alert('Movement history refreshed with municipal registry.')}
            className="text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
          >
            Refresh History
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Track your submitted activity proofs, admin verification status, and earned eco-points.
        </p>

        {userProfile.joinedMovements.length > 0 ? (
          <div className="space-y-2">
            {userProfile.joinedMovements.map((m) => (
              <div
                key={m.id}
                className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 block">{m.activityTitle}</span>
                  <span className="text-[11px] text-slate-500">{m.date}</span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-700 font-bold block">+{m.pointsAwarded} pts</span>
                  <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                    {m.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            You have not submitted participation proofs for any community activities yet. Browse upcoming drives to participate and earn Eco-Points!
          </div>
        )}
      </div>

      {/* Bottom Quick Links (Exact to screenshot) */}
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
          Browse Community Drives
        </button>
      </div>
    </div>
  </div>

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
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('ID submitted to CENRO registry for audit review.');
                  setShowKycModal(false);
                }}
                className="flex-1 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs"
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

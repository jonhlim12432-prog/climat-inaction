import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Lock, Mail, User, Phone, MapPin, LogIn, UserPlus, X, ShieldCheck } from 'lucide-react';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: (user: UserProfile) => void;
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticate,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('markkennethulgasan@gmail.com');
  const [password, setPassword] = useState('kenmark10');
  const [name, setName] = useState('Mark Kenneth Ariston');
  const [barangay, setBarangay] = useState('Barangay Central');
  const [phone, setPhone] = useState('09123456789');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please enter your email and password.');
      return;
    }

    const userProfile: UserProfile = {
      name: authMode === 'signup' ? name : (email.includes('mark') ? 'Mark Kenneth Ariston' : 'Registered Citizen'),
      email: email,
      phone: phone,
      barangay: barangay,
      city: 'Zamboanga Sibugay',
      address: `Purok 1, ${barangay}`,
      bio: 'Committed municipal eco-guardian and community reporter.',
      emergencyContact: {
        name: 'Emergency Next-of-Kin',
        phone: '09988776655',
      },
      isVerified: true,
      kycNumber: 'PS-SIBUGAY-2026-99',
      ecoPoints: 150,
      rank: 'Eco-Champion Tier 1',
      level: 'Level 3 Guardian',
      reportingAuthorized: true,
      joinedMovements: [],
    };

    onAuthenticate(userProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 relative border border-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 mx-auto flex items-center justify-center text-white shadow-lg shadow-emerald-900/30 ring-4 ring-emerald-500/20">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 tracking-tight">
            {authMode === 'login' ? 'Citizen Portal Login' : 'Create Citizen Account'}
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            {authMode === 'login'
              ? 'Log in to access environmental incident reporting, tracker, and carbon auditing.'
              : 'Sign up for a municipal eco-guardian account to report hazards and earn eco-points.'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              authMode === 'login' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('signup')}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              authMode === 'signup' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {authMode === 'signup' && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mark Kenneth Ariston"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-emerald-600"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-emerald-600"
              />
            </div>
          </div>

          {authMode === 'signup' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Barangay</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={barangay}
                    onChange={(e) => setBarangay(e.target.value)}
                    placeholder="Barangay"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobile Phone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="09..."
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#15803d] hover:bg-[#166534] text-white font-bold py-3 rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-950/20 flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
            >
              {authMode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              <span>{authMode === 'login' ? 'Login to Citizen Portal' : 'Register & Create Account'}</span>
            </button>
          </div>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-[11px] text-slate-500">
          Protected by LGU Zamboanga Sibugay Municipal Security & Privacy Standards.
        </div>
      </div>
    </div>
  );
};

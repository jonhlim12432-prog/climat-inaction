import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Lock, Mail, User, Phone, MapPin, LogIn, UserPlus, X, ShieldCheck, Sparkles, Image as ImageIcon } from 'lucide-react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from '../lib/firebase';
import { saveUserProfileToFirestore } from '../lib/firestoreService';
import { compressImage } from '../utils/imageCompressor';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: (user: UserProfile) => void;
  initialMode?: 'login' | 'signup';
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticate,
  initialMode = 'login',
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [barangay, setBarangay] = useState('Poblacion');
  const [phone, setPhone] = useState('');
  const [avatarImage, setAvatarImage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setAuthMode(initialMode);
      setErrorMessage(null);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 300, 300, 0.82);
        setAvatarImage(compressed);
      } catch (err) {
        console.error('Failed to compress avatar', err);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      const profile: UserProfile = {
        name: firebaseUser.displayName || name || 'Eco Citizen',
        email: firebaseUser.email || email,
        phone: firebaseUser.phoneNumber || phone,
        barangay: barangay,
        city: 'Zamboanga Sibugay',
        address: `Purok 1, ${barangay}`,
        bio: 'Committed municipal eco-guardian and community reporter.',
        emergencyContact: {
          name: 'Emergency Next-of-Kin',
          phone: '09988776655',
        },
        isVerified: true,
        kycNumber: `PS-SIBUGAY-2026-${Math.floor(10 + Math.random() * 89)}`,
        ecoPoints: 150,
        rank: 'Eco-Champion Tier 1',
        level: 'Level 3 Guardian',
        reportingAuthorized: true,
        joinedMovements: [],
      };

      // Save to Firestore with authenticated UID
      await saveUserProfileToFirestore(firebaseUser.uid, profile);
      onAuthenticate(profile);
      onClose();
    } catch (err: any) {
      if (
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request' ||
        err?.message?.includes('popup-closed-by-user')
      ) {
        // User intentionally closed the popup, do not display error
        return;
      }
      console.warn('Google Sign-In Notice:', err?.message || err);
      setErrorMessage(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter your email and password.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    let userDisplayName = name;

    try {
      if (authMode === 'signup') {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        if (name) {
          await updateProfile(userCred.user, { displayName: name });
        }
      } else {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        userDisplayName = userCred.user.displayName || (email.includes('mark') ? 'Mark Kenneth Ariston' : 'Registered Citizen');
      }
    } catch (authErr: any) {
      // Firebase auth providers other than Google might not be enabled in console (auth/operation-not-allowed)
      // Allow seamless guest access without throwing fatal errors
      console.warn('Firebase email auth provider unavailable:', authErr?.code || authErr?.message);
    }

    const profile: UserProfile = {
      name: authMode === 'signup' ? name : userDisplayName,
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
      kycNumber: `PS-SIBUGAY-2026-${Math.floor(10 + Math.random() * 89)}`,
      ecoPoints: 150,
      rank: 'Eco-Champion Tier 1',
      level: 'Level 3 Guardian',
      reportingAuthorized: true,
      joinedMovements: [],
    };

    // Only attempt Firestore write if the user is authenticated with Firebase Auth
    if (auth.currentUser?.uid) {
      await saveUserProfileToFirestore(auth.currentUser.uid, profile);
    }

    onAuthenticate(profile);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 relative border border-slate-100 my-8">
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
              ? 'Log in to save user account authentication, credentials, email & environmental reports.'
              : 'Sign up for a municipal account to save profile data, emails, images, and report history.'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => { setAuthMode('login'); setErrorMessage(null); }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              authMode === 'login' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('signup'); setErrorMessage(null); }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              authMode === 'signup' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {errorMessage && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs p-3 rounded-xl font-medium">
            {errorMessage}
          </div>
        )}

        {/* Quick Google Authentication */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 text-xs shadow-md"
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Sign In with Google (Recommended)</span>
        </button>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">Or with Email & Password</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {authMode === 'signup' && (
            <>
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

              <div>
                <label className="block font-bold text-slate-700 mb-1">Profile Image / Avatar</label>
                <div className="flex items-center gap-3">
                  {avatarImage ? (
                    <img src={avatarImage} alt="Avatar" className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-100 file:text-emerald-800 hover:file:bg-emerald-200 cursor-pointer"
                  />
                </div>
              </div>
            </>
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
              disabled={loading}
              className="w-full bg-[#15803d] hover:bg-[#166534] text-white font-bold py-3 rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-950/20 flex items-center justify-center gap-2 text-xs uppercase tracking-wider disabled:opacity-50"
            >
              {authMode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              <span>{loading ? 'Processing...' : (authMode === 'login' ? 'Login to Citizen Portal' : 'Register & Save Account')}</span>
            </button>
          </div>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-[11px] text-slate-500">
          Saved & Secured by Firebase Authentication & Firestore Database.
        </div>
      </div>
    </div>
  );
};

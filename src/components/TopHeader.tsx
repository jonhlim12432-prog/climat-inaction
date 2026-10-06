import React from 'react';
import {
  Bell,
  Menu,
  AlertTriangle,
  X,
  Plus,
  ShieldCheck,
  User,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { UserProfile } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface TopHeaderProps {
  userProfile: UserProfile | null;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onOpenMenu: () => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  onOpenReportModal?: () => void;
  onOpenProfile?: () => void;
  onOpenAlerts?: () => void;
  onOpenAuthModal?: (mode?: 'login' | 'signup') => void;
  logoUrl?: string;
  pagasaAlert: {
    level: string;
    badge: string;
    title: string;
    advisory: string;
    active: boolean;
  };
  onDismissAlert?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  userProfile,
  unreadNotificationsCount,
  onOpenNotifications,
  onOpenMenu,
  activeTab = 'home',
  setActiveTab,
  onOpenReportModal,
  onOpenProfile,
  onOpenAlerts,
  onOpenAuthModal,
  logoUrl,
  pagasaAlert,
  onDismissAlert,
}) => {
  const [alertDismissed, setAlertDismissed] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full shadow-xs bg-white/85 backdrop-blur-md border-b border-emerald-200/80 transition-all">
      {/* Primary Top Bar */}
      <div className="w-full max-w-7xl 2xl:max-w-[1536px] mx-auto text-slate-800 px-3 sm:px-5 md:px-6 lg:px-8 py-2.5 flex items-center justify-between">
        {/* Left: Brand Lockup with Dynamic Uploaded Logo */}
        <div
          onClick={() => setActiveTab?.('home')}
          className="flex items-center gap-2.5 cursor-pointer select-none group flex-shrink-0"
        >
          <div className="flex items-center justify-center flex-shrink-0">
            {logoUrl && logoUrl.trim() !== '' ? (
              <img
                src={logoUrl}
                alt="Municipal Logo"
                className="h-8 w-auto object-contain"
              />
            ) : (
              /* Default Earth Emblem */
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-500 to-sky-400 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                🌍
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm sm:text-base tracking-tight font-display text-slate-900 group-hover:text-emerald-700 transition-colors">Climate Action</span>
              <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[8.5px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                Portal
              </span>
            </div>
            <p className="text-[9px] text-slate-500 font-medium leading-none mt-0.5">
              Zamboanga Sibugay · Citizen Telemetry
            </p>
          </div>
        </div>

        {/* Right Actions: Quick Report + Eco Points + Notifications + Profile / Menu */}
        <div className="flex items-center gap-2">
          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Quick Report Button (Desktop & Tablet) */}
          {onOpenReportModal && (
            <button
              onClick={onOpenReportModal}
              className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Report Incident</span>
            </button>
          )}

          {/* Eco Points Pill (Desktop & Tablet) */}
          {userProfile ? (
            <div
              onClick={() => setActiveTab?.('profile')}
              className="hidden md:flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-300/80 px-2.5 py-1 rounded-full text-xs text-emerald-800 font-bold cursor-pointer transition-colors shadow-2xs"
              title="Your Eco-Points"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="tabular-nums font-mono text-emerald-950 font-black">{userProfile.ecoPoints}</span>
              <span className="text-[10px] text-emerald-700 font-semibold">pts</span>
            </div>
          ) : null}

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            aria-label="View notifications"
            className="relative w-8 h-8 rounded-full bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-xs border border-slate-200/80"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
            )}
          </button>

          {/* Citizen Profile Quick Avatar / Sign In Button */}
          {userProfile ? (
            <button
              onClick={() => {
                if (onOpenProfile) onOpenProfile();
                else setActiveTab?.('profile');
              }}
              title="View Citizen Profile"
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-full pl-1 pr-2.5 py-1 transition-all cursor-pointer group shadow-2xs"
            >
              {userProfile.avatarUrl ? (
                <img
                  src={userProfile.avatarUrl}
                  alt={userProfile.name}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-emerald-400 group-hover:ring-emerald-500"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center ring-1 ring-emerald-400">
                  {userProfile.name ? userProfile.name.slice(0, 2).toUpperCase() : 'MK'}
                </div>
              )}
              <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-800 hidden sm:inline-block">
                {userProfile.name.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={() => onOpenAuthModal?.('login')}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs px-3.5 py-1.5 rounded-full shadow-xs transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={onOpenMenu}
            aria-label="Open navigation menu"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 active:scale-95 transition-all flex items-center justify-center cursor-pointer border border-slate-200/80"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Emergency PAGASA Advisory Banner */}
      {!alertDismissed && pagasaAlert && pagasaAlert.active && (
        <div className="bg-[#fff1f2] border-b border-rose-200 px-3.5 sm:px-5 md:px-6 lg:px-8 py-1.5 sm:py-2 transition-all animate-in fade-in slide-in-from-top duration-300">
          <div className="w-full max-w-7xl 2xl:max-w-[1536px] mx-auto flex items-start justify-between gap-2.5">
            <div
              onClick={() => onOpenAlerts?.()}
              className={`flex items-start gap-2 ${onOpenAlerts ? 'cursor-pointer group flex-1' : ''}`}
            >
              <div className="mt-0.5 text-rose-600 flex-shrink-0">
                <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
              </div>
              <div className="text-[11px] sm:text-xs text-rose-950 leading-snug">
                <span className="font-bold text-rose-900">PAGASA Advisory: </span>
                <span className="font-medium text-rose-800 group-hover:underline">{pagasaAlert.title}</span>
                {onOpenAlerts && (
                  <span className="ml-1 text-[9.5px] font-bold text-rose-700 bg-rose-100 px-1 py-0.2 rounded group-hover:bg-rose-200 inline-block">
                    Forecast →
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                setAlertDismissed(true);
                onDismissAlert?.();
              }}
              aria-label="Dismiss advisory banner"
              className="text-rose-400 hover:text-rose-700 p-0.5 rounded transition-colors flex-shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

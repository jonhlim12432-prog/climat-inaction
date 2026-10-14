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
      <div className="w-full max-w-7xl 2xl:max-w-[1536px] mx-auto text-slate-800 px-2.5 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-1.5 sm:gap-3">
        {/* Left: Brand Lockup with Dynamic Uploaded Logo */}
        <div
          onClick={() => setActiveTab?.('home')}
          className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer select-none group min-w-0 shrink"
        >
          <div className="flex items-center justify-center shrink-0">
            {logoUrl && logoUrl.trim() !== '' ? (
              <img
                src={logoUrl}
                alt="Municipal Logo"
                className="h-7 w-7 sm:h-8 sm:w-8 object-contain rounded-full"
              />
            ) : (
              /* Default Earth Emblem */
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-500 to-sky-400 flex items-center justify-center text-white font-bold text-xs shadow-inner shrink-0">
                🌍
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="font-extrabold text-xs sm:text-base tracking-tight font-display text-slate-900 group-hover:text-emerald-700 transition-colors whitespace-nowrap">
                Climate Action
              </span>
              <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[7.5px] sm:text-[8.5px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider shrink-0">
                Portal
              </span>
            </div>
            <p className="text-[8.5px] sm:text-[9px] text-slate-500 font-medium leading-none mt-0.5 truncate hidden sm:block">
              Zamboanga Sibugay · Citizen Telemetry
            </p>
          </div>
        </div>

        {/* Center: Desktop Navigation Bar */}
        {setActiveTab && (
          <nav className="hidden xl:flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/70 shadow-2xs">
            {[
              { id: 'home', label: 'Home' },
              { id: 'map', label: 'GIS Map' },
              { id: 'tracker', label: 'Tracker' },
              { id: 'calculator', label: 'Calculator' },
              { id: 'forum', label: 'Forum' },
              { id: 'alerts', label: 'Alerts' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        )}

        {/* Right Actions: Install App + Quick Report + Eco Points + Notifications + Sign In / Profile + Menu */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* PWA Install Button (Leveled height h-7 sm:h-8, compact for Android) */}
          <PWAInstallButton />

          {/* Quick Report Button (Desktop & Tablet) */}
          {onOpenReportModal && (
            <button
              onClick={onOpenReportModal}
              className="hidden md:inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-extrabold text-xs h-8 px-3 rounded-full shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Report Incident</span>
            </button>
          )}

          {/* Eco Points Pill (Desktop & Tablet) */}
          {userProfile ? (
            <div
              onClick={() => setActiveTab?.('profile')}
              className="hidden md:flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-300/80 px-2.5 h-8 rounded-full text-xs text-emerald-800 font-bold cursor-pointer transition-colors shadow-2xs shrink-0"
              title="Your Eco-Points"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="tabular-nums font-mono text-emerald-950 font-black">{userProfile.ecoPoints}</span>
              <span className="text-[10px] text-emerald-700 font-semibold">pts</span>
            </div>
          ) : null}

          {/* Notifications Bell (Leveled h-7 sm:h-8) */}
          <button
            onClick={onOpenNotifications}
            aria-label="View notifications"
            className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-xs border border-slate-200/80 shrink-0"
          >
            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
            )}
          </button>

          {/* Citizen Profile Quick Avatar / Sign In Button (Leveled height h-7 sm:h-8, compact for Android) */}
          {userProfile ? (
            <button
              onClick={() => {
                if (onOpenProfile) onOpenProfile();
                else setActiveTab?.('profile');
              }}
              title="View Citizen Profile"
              className="flex items-center gap-1 sm:gap-1.5 bg-slate-100 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-full pl-0.5 sm:pl-1 pr-2 sm:pr-2.5 h-7 sm:h-8 transition-all cursor-pointer group shadow-2xs shrink-0"
            >
              {userProfile.avatarUrl ? (
                <img
                  src={userProfile.avatarUrl}
                  alt={userProfile.name}
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover ring-1 ring-emerald-400 group-hover:ring-emerald-500"
                />
              ) : (
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-700 text-white font-bold text-[9px] sm:text-[10px] flex items-center justify-center ring-1 ring-emerald-400">
                  {userProfile.name ? userProfile.name.slice(0, 2).toUpperCase() : 'MK'}
                </div>
              )}
              <span className="text-[11px] sm:text-xs font-bold text-slate-800 group-hover:text-emerald-800 hidden min-[420px]:inline-block whitespace-nowrap">
                {userProfile.name.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={() => onOpenAuthModal?.('login')}
              className="flex items-center gap-1 sm:gap-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-[11px] sm:text-xs h-7 sm:h-8 px-2 sm:px-2.5 rounded-full shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
              title="Sign in to your account"
            >
              <LogIn className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="whitespace-nowrap">Sign In</span>
            </button>
          )}

          {/* Mobile Menu Hamburger Button (Leveled h-7 sm:h-8) */}
          <button
            onClick={onOpenMenu}
            aria-label="Open navigation menu"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 active:scale-95 transition-all flex items-center justify-center cursor-pointer border border-slate-200/80 shrink-0"
          >
            <Menu className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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

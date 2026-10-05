import React from 'react';
import {
  Bell,
  Menu,
  AlertTriangle,
  X,
  Plus,
  ShieldCheck,
  User,
} from 'lucide-react';
import { UserProfile } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface TopHeaderProps {
  userProfile: UserProfile;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onOpenMenu: () => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  onOpenReportModal?: () => void;
  onOpenProfile?: () => void;
  onOpenAlerts?: () => void;
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
  logoUrl,
  pagasaAlert,
  onDismissAlert,
}) => {
  const [alertDismissed, setAlertDismissed] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full shadow-md bg-[#15803d]">
      {/* Primary Top Bar */}
      <div className="w-full max-w-7xl 2xl:max-w-[1536px] mx-auto text-white px-3 sm:px-5 md:px-6 lg:px-8 py-2.5 flex items-center justify-between border-b border-[#166534]">
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
              <span className="font-extrabold text-sm sm:text-base tracking-tight font-display text-white">Climate Action</span>
              <span className="bg-emerald-900/60 text-emerald-200 border border-emerald-400/40 text-[8.5px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                Portal
              </span>
            </div>
            <p className="text-[9px] text-emerald-100/90 font-medium leading-none mt-0.5">
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
              className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-emerald-950 font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Report Incident</span>
            </button>
          )}

          {/* Eco Points Pill (Desktop & Tablet) */}
          <div
            onClick={() => setActiveTab?.('profile')}
            className="hidden md:flex items-center gap-1.5 bg-emerald-800/80 hover:bg-emerald-800 border border-emerald-600/40 px-2.5 py-1 rounded-full text-xs text-emerald-100 font-bold cursor-pointer transition-colors"
            title="Your Eco-Points"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="tabular-nums font-mono text-amber-300">{userProfile.ecoPoints}</span>
            <span className="text-[10px] text-emerald-300">pts</span>
          </div>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            aria-label="View notifications"
            className="relative w-8 h-8 rounded-full bg-emerald-800/80 hover:bg-emerald-600 active:scale-95 transition-all flex items-center justify-center text-emerald-100 hover:text-white cursor-pointer shadow-xs"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 animate-pulse ring-2 ring-emerald-800" />
            )}
          </button>

          {/* Citizen Profile Quick Avatar */}
          <button
            onClick={() => {
              if (onOpenProfile) onOpenProfile();
              else setActiveTab?.('profile');
            }}
            title="View Citizen Profile"
            className="flex items-center gap-1.5 bg-emerald-800/90 hover:bg-emerald-700/90 border border-emerald-500/50 rounded-full pl-1 pr-2.5 py-1 transition-all cursor-pointer group"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-950 text-white font-bold text-[10px] flex items-center justify-center ring-1 ring-emerald-400/60 group-hover:ring-emerald-300">
              MK
            </div>
            <span className="text-xs font-bold text-emerald-100 group-hover:text-white hidden sm:inline-block">
              {userProfile.name.split(' ')[0]}
            </span>
          </button>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={onOpenMenu}
            aria-label="Open navigation menu"
            className="w-8 h-8 rounded-full bg-emerald-800/80 hover:bg-emerald-600 active:scale-95 transition-all flex items-center justify-center text-emerald-100 hover:text-white cursor-pointer"
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

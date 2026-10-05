import React from 'react';
import {
  X,
  Home,
  AlertCircle,
  ClipboardList,
  MapPin,
  BookOpen,
  Users,
  MessageSquare,
  Calculator,
  User,
  BellRing,
  PhoneCall,
  ShieldCheck,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { UserProfile } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProfile: UserProfile;
  onOpenReportModal: () => void;
  logoUrl?: string;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  userProfile,
  onOpenReportModal,
  logoUrl,
}) => {
  if (!isOpen) return null;

  const handleNavClick = (tabId: string) => {
    if (tabId === 'report') {
      onClose();
      onOpenReportModal();
    } else {
      setActiveTab(tabId);
      onClose();
    }
  };

  const navItems = [
    { id: 'home', label: 'Home Dashboard', icon: Home },
    { id: 'report', label: 'Report Incident', icon: AlertCircle, highlight: true },
    { id: 'tracker', label: 'Incident Tracker', icon: ClipboardList },
    { id: 'map', label: 'Interactive GIS Map', icon: MapPin },
    { id: 'calculator', label: 'Carbon Footprint Calculator', icon: Calculator },
    { id: 'forum', label: 'Community Climate Forum', icon: MessageSquare },
    { id: 'activities', label: 'Community Activities & Drives', icon: Users },
    { id: 'knowledge', label: 'Climate Knowledge & Info', icon: BookOpen },
    { id: 'profile', label: 'Citizen Profile', icon: User },
    { id: 'alerts', label: 'Official Alerts & Bulletins', icon: BellRing },
    { id: 'guides', label: 'Citizen User Guides', icon: HelpCircle },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div className="absolute inset-y-0 left-0 max-w-[280px] w-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
        {/* Drawer Header (Green banner matching screenshot) */}
        <div className="bg-[#15803d] text-white p-3.5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white/20 p-0.5 flex items-center justify-center ring-1 ring-emerald-300 overflow-hidden">
                {logoUrl && logoUrl.trim() !== '' ? (
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-cover rounded-full bg-white" />
                ) : (
                  <span className="text-sm">🌍</span>
                )}
              </div>
              <div>
                <h2 className="font-extrabold text-sm leading-tight font-display">Climate Action</h2>
                <p className="text-[9.5px] text-emerald-100">Reporting & Information System</p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="w-7 h-7 rounded-full bg-emerald-800/80 hover:bg-emerald-700 flex items-center justify-center text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* User Account Capsule - Direct Profile Navigation Function */}
          <div
            onClick={() => {
              setActiveTab('profile');
              onClose();
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setActiveTab('profile');
                onClose();
              }
            }}
            className="bg-emerald-800/90 hover:bg-emerald-700/90 active:scale-[0.99] transition-all rounded-xl p-2.5 flex items-center justify-between border border-emerald-500/50 shadow-xs cursor-pointer group"
            title="Open Citizen Profile"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full ring-2 ring-emerald-300 bg-emerald-950 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                MK
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-white group-hover:text-emerald-100 transition-colors">
                    {userProfile.name}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-300" />
                  Verified Citizen
                </span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab('profile');
                onClose();
              }}
              className="text-[10.5px] bg-white text-emerald-900 font-bold px-2.5 py-1 rounded-lg shadow-xs hover:bg-emerald-50 transition-colors cursor-pointer flex items-center gap-1"
            >
              <User className="w-3 h-3 text-emerald-700" />
              <span>Profile</span>
            </button>
          </div>
        </div>

        {/* Navigation Link List */}
        <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
          <div className="px-2 py-1 mb-1">
            <PWAInstallButton className="w-full justify-center py-2" />
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-[13px] font-semibold transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 border-l-3 border-emerald-600 font-bold'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-slate-500'}`} />
                <span className="flex-1 truncate">{item.label}</span>
                {item.highlight && (
                  <span className="bg-emerald-600 text-white text-[9px] px-1.5 py-0.2 rounded font-bold">
                    NEW
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Municipal Emergency Hotlines Footer (Exact to screenshot) */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold mb-1">
            <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
            <span>24/7 Municipal Hotlines</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600">Municipal Disaster Rescue :</span>
            <a
              href="tel:09765544554"
              className="font-bold text-emerald-700 hover:text-emerald-800 font-mono tracking-tight"
            >
              09765544554
            </a>
          </div>
          <p className="text-[10px] text-slate-500 mt-2">
            Zamboanga Sibugay · CENRO Standards Compliance
          </p>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Home, Map, Plus, ClipboardList, User } from 'lucide-react';

interface BottomNavBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenReportModal: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  setActiveTab,
  onOpenReportModal,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg pb-safe md:hidden">
      <div className="max-w-md mx-auto grid grid-cols-5 items-center h-12 px-3 relative">
        {/* Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center py-0.5 transition-colors cursor-pointer ${
            activeTab === 'home' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 mb-0.5" />
          <span className="text-[9.5px] font-semibold leading-none">Home</span>
        </button>

        {/* Map */}
        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center justify-center py-0.5 transition-colors cursor-pointer ${
            activeTab === 'map' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Map className="w-3.5 h-3.5 sm:w-4 sm:h-4 mb-0.5" />
          <span className="text-[9.5px] font-semibold leading-none">Map</span>
        </button>

        {/* Compact Center Report Button */}
        <div className="relative flex flex-col items-center justify-center -top-1.5">
          <button
            onClick={onOpenReportModal}
            aria-label="Report an incident"
            className="w-9.5 h-9.5 sm:w-10 sm:h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white flex items-center justify-center shadow-md shadow-emerald-700/30 ring-2 ring-white transition-all cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>
          <span className="text-[9px] font-bold text-emerald-800 mt-0.5 leading-none">Report</span>
        </div>

        {/* Track */}
        <button
          onClick={() => setActiveTab('tracker')}
          className={`flex flex-col items-center justify-center py-0.5 transition-colors cursor-pointer ${
            activeTab === 'tracker' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ClipboardList className="w-3.5 h-3.5 sm:w-4 sm:h-4 mb-0.5" />
          <span className="text-[9.5px] font-semibold leading-none">Track</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center py-0.5 transition-colors cursor-pointer ${
            activeTab === 'profile' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 mb-0.5" />
          <span className="text-[9.5px] font-semibold leading-none">Profile</span>
        </button>
      </div>
    </nav>
  );
};

import React, { useState } from 'react';
import { Users, ChevronRight, CheckCircle2, Sparkles, Compass } from 'lucide-react';
import { CommunityActivity } from '../types';

interface CommunityActivitiesSectionProps {
  activities: CommunityActivity[];
  onToggleJoin: (id: string) => Promise<void>;
  onViewAllActivities: () => void;
  onOpenTipModal: () => void;
}

export const CommunityActivitiesSection: React.FC<CommunityActivitiesSectionProps> = ({
  activities,
  onToggleJoin,
  onViewAllActivities,
  onOpenTipModal,
}) => {
  const [joiningId, setJoiningId] = useState<string | null>(null);

  const handleJoinClick = async (id: string) => {
    setJoiningId(id);
    try {
      await onToggleJoin(id);
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Community Climate Activities Header & Card */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-3.5 animate-card-entrance">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-700" />
            <h2 className="font-extrabold text-slate-900 text-sm tracking-tight uppercase font-display">
              Community Climate Activities
            </h2>
          </div>
          <button
            onClick={onViewAllActivities}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5 cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Activity Row with subtle stagger */}
        {activities.slice(0, 2).map((act, idx) => (
          <div
            key={act.id}
            style={{ animationDelay: `${(idx + 1) * 70}ms` }}
            className="p-3.5 bg-slate-50/90 border border-slate-200/70 rounded-2xl flex items-center justify-between gap-3 animate-card-fade hover:bg-emerald-50/40 hover:-translate-y-0.5 transition-all shadow-xs"
          >
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 leading-snug">
                {act.title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                <span className="font-semibold text-emerald-800">{act.volunteerCount} Volunteers</span>
                <span className="mx-1.5">·</span>
                <span>{act.barangay}</span>
                <span className="mx-1.5">·</span>
                <span className="text-amber-600 font-bold">+{act.ecoPointsReward} pts</span>
              </p>
            </div>
            <button
              onClick={() => handleJoinClick(act.id)}
              disabled={joiningId === act.id}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 whitespace-nowrap cursor-pointer ${
                act.joined
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
              }`}
            >
              {act.joined ? '✓ Joined' : 'Join Activity'}
            </button>
          </div>
        ))}
      </div>

      {/* Today's Climate Tip Card (Exact match to screenshot) */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-3xl p-5 shadow-xs animate-card-entrance animate-stagger-1 hover:-translate-y-0.5 transition-all">
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <span className="font-extrabold text-xs text-emerald-950 uppercase tracking-wider font-display">
            Today's Climate Tip
          </span>
        </div>

        <p className="text-xs text-emerald-950 font-medium leading-relaxed italic mb-3">
          "Conserve water, even during rainy days. It helps prevent stormwater culvert overload and ensures ample reservoir reserves during dry periods."
        </p>

        <button
          onClick={onOpenTipModal}
          className="inline-flex items-center gap-1 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
        >
          <span>Learn More</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

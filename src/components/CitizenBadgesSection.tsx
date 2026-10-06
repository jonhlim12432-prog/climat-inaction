import React, { useState } from 'react';
import {
  Award,
  ShieldCheck,
  ShieldAlert,
  Flame,
  Sprout,
  Users,
  Crown,
  Globe,
  Eye,
  Lock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  X,
  PlusCircle,
  HelpCircle,
  TrendingUp,
  FileCheck,
  Medal,
} from 'lucide-react';
import {
  BadgeDefinition,
  EvaluatedBadge,
  BadgeTier,
  BadgeCategory,
} from '../utils/badgeSystem';

interface CitizenBadgesSectionProps {
  evaluatedBadges: EvaluatedBadge[];
  unlockedCount: number;
  totalCount: number;
  incidentsCount: number;
  activitiesCount: number;
  onOpenReportModal?: () => void;
  onBrowseActivities?: () => void;
}

export const CitizenBadgesSection: React.FC<CitizenBadgesSectionProps> = ({
  evaluatedBadges,
  unlockedCount,
  totalCount,
  incidentsCount,
  activitiesCount,
  onOpenReportModal,
  onBrowseActivities,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'unlocked' | 'locked' | 'incidents' | 'activities'>('all');
  const [selectedBadge, setSelectedBadge] = useState<EvaluatedBadge | null>(null);

  const completionPercent = Math.round((unlockedCount / totalCount) * 100);

  // Filter badges
  const filteredBadges = evaluatedBadges.filter((b) => {
    if (activeFilter === 'unlocked') return b.isUnlocked;
    if (activeFilter === 'locked') return !b.isUnlocked;
    if (activeFilter === 'incidents') return b.category === 'incidents';
    if (activeFilter === 'activities') return b.category === 'activities';
    return true;
  });

  const getTierStyles = (tier: BadgeTier, isUnlocked: boolean) => {
    if (!isUnlocked) {
      return {
        cardBorder: 'border-slate-200 bg-slate-50/70',
        emblemBg: 'bg-slate-200 text-slate-400 border-slate-300',
        badgePill: 'bg-slate-200 text-slate-600',
        ringGlow: 'ring-1 ring-slate-200',
        textColor: 'text-slate-500',
        progressBg: 'bg-emerald-600',
      };
    }

    switch (tier) {
      case 'emerald':
        return {
          cardBorder: 'border-emerald-300 bg-gradient-to-b from-emerald-50/80 via-white to-teal-50/60 shadow-emerald-500/10',
          emblemBg: 'bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 text-white border-emerald-300 shadow-lg shadow-emerald-600/30',
          badgePill: 'bg-emerald-600 text-white shadow-xs',
          ringGlow: 'ring-4 ring-emerald-500/20',
          textColor: 'text-emerald-950',
          progressBg: 'bg-gradient-to-r from-emerald-500 to-teal-500',
        };
      case 'gold':
        return {
          cardBorder: 'border-amber-300 bg-gradient-to-b from-amber-50/70 via-white to-yellow-50/50 shadow-amber-500/10',
          emblemBg: 'bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 text-white border-amber-300 shadow-lg shadow-amber-600/30',
          badgePill: 'bg-amber-600 text-white shadow-xs',
          ringGlow: 'ring-4 ring-amber-500/20',
          textColor: 'text-amber-950',
          progressBg: 'bg-gradient-to-r from-amber-500 to-yellow-500',
        };
      case 'silver':
        return {
          cardBorder: 'border-slate-300 bg-gradient-to-b from-slate-50/80 via-white to-zinc-50/50 shadow-slate-500/10',
          emblemBg: 'bg-gradient-to-br from-slate-400 via-slate-500 to-zinc-600 text-white border-slate-300 shadow-lg shadow-slate-600/20',
          badgePill: 'bg-slate-600 text-white shadow-xs',
          ringGlow: 'ring-4 ring-slate-400/20',
          textColor: 'text-slate-900',
          progressBg: 'bg-slate-600',
        };
      case 'bronze':
      default:
        return {
          cardBorder: 'border-amber-700/30 bg-gradient-to-b from-amber-50/60 via-white to-orange-50/40 shadow-amber-900/5',
          emblemBg: 'bg-gradient-to-br from-amber-600 via-yellow-700 to-amber-800 text-white border-amber-600 shadow-md shadow-amber-800/20',
          badgePill: 'bg-amber-800 text-white shadow-xs',
          ringGlow: 'ring-4 ring-amber-600/20',
          textColor: 'text-amber-950',
          progressBg: 'bg-amber-700',
        };
    }
  };

  const renderBadgeIcon = (iconName: string, className: string = 'w-6 h-6') => {
    switch (iconName) {
      case 'eye':
        return <Eye className={className} />;
      case 'shield-alert':
        return <ShieldAlert className={className} />;
      case 'shield-check':
        return <ShieldCheck className={className} />;
      case 'flame':
        return <Flame className={className} />;
      case 'sprout':
        return <Sprout className={className} />;
      case 'users':
        return <Users className={className} />;
      case 'crown':
        return <Crown className={className} />;
      case 'globe':
      default:
        return <Globe className={className} />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-5">
      {/* Title & Overall Completion */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-900/20">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 font-display">
              Citizen Honors & Achievement Badges
            </h3>
          </div>
          <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
            Unlock municipal distinctions by actively reporting community hazards and participating in ecological movements.
          </p>
        </div>

        {/* Global Progress Dial / Pill */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 px-3.5 py-2.5 rounded-2xl w-fit">
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Honors Progress
            </span>
            <div className="text-sm font-black text-slate-900 font-display">
              <span className="text-emerald-700">{unlockedCount}</span> of {totalCount} Unlocked
            </div>
          </div>
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-600 transition-all duration-700"
                strokeDasharray={`${completionPercent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-[10px] font-black text-slate-700">
              {completionPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Live Metric Counters with Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Metric 1: Reported Incidents */}
        <div className="bg-gradient-to-r from-emerald-50/70 to-teal-50/40 border border-emerald-100/90 rounded-2xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                Incidents Reported
              </span>
              <div className="text-lg font-black text-emerald-950 font-display">
                {incidentsCount} <span className="text-xs font-semibold text-emerald-700">hazards filed</span>
              </div>
            </div>
          </div>
          {onOpenReportModal && (
            <button
              onClick={onOpenReportModal}
              className="text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>+ Report</span>
            </button>
          )}
        </div>

        {/* Metric 2: Activities Joined */}
        <div className="bg-gradient-to-r from-amber-50/70 to-yellow-50/40 border border-amber-100/90 rounded-2xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-amber-200 flex items-center justify-center text-amber-700 shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                Activities Joined
              </span>
              <div className="text-lg font-black text-amber-950 font-display">
                {activitiesCount} <span className="text-xs font-semibold text-amber-700">drives joined</span>
              </div>
            </div>
          </div>
          {onBrowseActivities && (
            <button
              onClick={onBrowseActivities}
              className="text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Browse</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
        >
          All Badges ({totalCount})
        </button>
        <button
          onClick={() => setActiveFilter('unlocked')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
            activeFilter === 'unlocked'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Unlocked ({unlockedCount})</span>
        </button>
        <button
          onClick={() => setActiveFilter('locked')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
            activeFilter === 'locked'
              ? 'bg-slate-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Locked ({totalCount - unlockedCount})</span>
        </button>
        <button
          onClick={() => setActiveFilter('incidents')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            activeFilter === 'incidents'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
        >
          Hazard Reports
        </button>
        <button
          onClick={() => setActiveFilter('activities')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            activeFilter === 'activities'
              ? 'bg-amber-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
        >
          Community Drives
        </button>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredBadges.map((badge) => {
          const style = getTierStyles(badge.tier, badge.isUnlocked);

          return (
            <div
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`rounded-2xl p-4 border transition-all duration-200 cursor-pointer flex flex-col justify-between relative group hover:shadow-md hover:-translate-y-0.5 ${style.cardBorder}`}
            >
              {/* Top Header inside Card */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  {/* Emblem */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-transform duration-200 group-hover:scale-105 ${style.emblemBg} ${style.ringGlow}`}
                  >
                    {renderBadgeIcon(badge.iconName, 'w-6 h-6')}
                  </div>

                  {/* Status / Tier Pill */}
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${style.badgePill}`}
                    >
                      {badge.tier}
                    </span>
                    {badge.isUnlocked ? (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-emerald-700 bg-emerald-100/90 px-1.5 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Unlocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-slate-400 bg-slate-200/80 px-1.5 py-0.5 rounded-md">
                        <Lock className="w-3 h-3 text-slate-400" />
                        Locked
                      </span>
                    )}
                  </div>
                </div>

                {/* Badge Titles */}
                <div>
                  <h4 className={`font-black text-sm font-display tracking-tight ${style.textColor}`}>
                    {badge.name}
                  </h4>
                  <p className="text-[11px] font-bold text-slate-500 mt-0.5 line-clamp-1">
                    {badge.tagline}
                  </p>
                  <p className="text-xs text-slate-600 mt-1.5 leading-snug line-clamp-2">
                    {badge.description}
                  </p>
                </div>
              </div>

              {/* Bottom Progress & Reward Section */}
              <div className="mt-4 pt-3 border-t border-slate-200/60 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-500">Progress</span>
                  <span className="font-mono font-bold text-slate-700">
                    {badge.progressPercent}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${style.progressBg}`}
                    style={{ width: `${badge.progressPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                  <span className="truncate max-w-[140px] font-medium">{badge.progressLabel}</span>
                  <span className="font-bold text-emerald-700 shrink-0">
                    +{badge.ecoPointsBonus} pts
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Badge Detail Modal Dialog */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative border border-slate-100 my-8">
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-4 pr-8">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 shrink-0 ${getTierStyles(selectedBadge.tier, selectedBadge.isUnlocked).emblemBg} ${getTierStyles(selectedBadge.tier, selectedBadge.isUnlocked).ringGlow}`}
              >
                {renderBadgeIcon(selectedBadge.iconName, 'w-8 h-8')}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${getTierStyles(selectedBadge.tier, selectedBadge.isUnlocked).badgePill}`}
                  >
                    {selectedBadge.tier} Tier
                  </span>
                  {selectedBadge.isUnlocked ? (
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Awarded & Active
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Lock className="w-3 h-3 text-slate-400" />
                      In Progress
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-black font-display text-slate-900 mt-1">
                  {selectedBadge.name}
                </h3>
                <p className="text-xs font-bold text-slate-500">
                  {selectedBadge.tagline}
                </p>
              </div>
            </div>

            {/* Lore / Story */}
            <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-600 leading-relaxed italic">
              "{selectedBadge.lore}"
            </div>

            {/* Criteria Progress */}
            <div className="space-y-2 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Requirement Criteria</span>
                <span className="font-bold text-emerald-700">{selectedBadge.progressLabel}</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${getTierStyles(selectedBadge.tier, selectedBadge.isUnlocked).progressBg}`}
                  style={{ width: `${selectedBadge.progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500">
                {selectedBadge.description}
              </p>
            </div>

            {/* Perks & Rights */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Medal className="w-3.5 h-3.5 text-emerald-600" />
                Civic Privileges & Perks
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {selectedBadge.perks.map((perk, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Eco-Points Reward */}
            <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
              <span className="font-bold text-emerald-950">Eco-Points Reward</span>
              <span className="font-black text-emerald-700 font-display text-sm">
                +{selectedBadge.ecoPointsBonus} pts
              </span>
            </div>

            {/* Action Footer */}
            <div className="pt-1 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedBadge(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Close
              </button>
              {!selectedBadge.isUnlocked && selectedBadge.category === 'incidents' && onOpenReportModal && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBadge(null);
                    onOpenReportModal();
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
                >
                  File Incident Report Now
                </button>
              )}
              {!selectedBadge.isUnlocked && selectedBadge.category === 'activities' && onBrowseActivities && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBadge(null);
                    onBrowseActivities();
                  }}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
                >
                  Explore Cleanups & Drives
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import {
  AlertTriangle,
  Clock,
  RefreshCw,
  CheckCircle2,
  Camera,
  ListFilter,
  ShieldCheck,
  AlertOctagon,
} from 'lucide-react';
import { Incident } from '../types';

interface CitizenActivitySummaryProps {
  incidents: Incident[];
  onSelectStatusFilter: (status: string) => void;
  onOpenReportModal: (initialCategory?: string) => void;
  onViewTracker: () => void;
}

export const CitizenActivitySummary: React.FC<CitizenActivitySummaryProps> = ({
  incidents,
  onSelectStatusFilter,
  onOpenReportModal,
  onViewTracker,
}) => {
  // Compute counts
  const filedCount = incidents.length;
  const triageCount = incidents.filter(
    (i) => i.status === 'Pending Review' || i.status === 'In Triage' || i.isOfflinePending
  ).length;
  const dispatchedCount = incidents.filter((i) => i.status === 'Dispatched').length;
  const remediatedCount = incidents.filter((i) => i.status === 'Remediated').length;

  const quickCategories = [
    { label: 'Flooding & Drainage', key: 'flooding' },
    { label: 'Illegal Dumping', key: 'dumping' },
    { label: 'Water Pollution', key: 'water_pollution' },
    { label: 'Deforestation', key: 'deforestation' },
    { label: 'Air Hazard', key: 'air_hazard' },
  ];

  return (
    <div className="space-y-4">
      {/* My Citizen Activity Card */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 animate-card-entrance animate-stagger-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-extrabold text-slate-900 text-sm tracking-tight uppercase font-display">
            My Citizen Activity & Reports
          </h2>
          <span className="inline-flex items-center gap-1 bg-emerald-800 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3 text-emerald-300" />
            Verified Citizen
          </span>
        </div>

        {/* 4 Metrics Grid with staggered entrance */}
        <div className="grid grid-cols-2 gap-3">
          {/* Filed By Me */}
          <button
            onClick={() => onSelectStatusFilter('all')}
            style={{ animationDelay: '100ms' }}
            className="text-left bg-slate-50/70 hover:bg-rose-50/40 border border-slate-200/60 rounded-2xl p-3.5 transition-all group cursor-pointer animate-card-fade hover:-translate-y-0.5 shadow-xs"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="w-7 h-7 rounded-lg bg-rose-100/70 flex items-center justify-center text-rose-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Filed by Me
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 font-display tabular-nums">
              {filedCount}
            </div>
            <div className="text-xs font-bold text-slate-800 leading-tight">My Submissions</div>
            <div className="text-[11px] text-emerald-700 font-medium">Personal account log</div>
          </button>

          {/* Awaiting Triage */}
          <button
            onClick={() => onSelectStatusFilter('In Triage')}
            style={{ animationDelay: '150ms' }}
            className="text-left bg-slate-50/70 hover:bg-amber-50/40 border border-slate-200/60 rounded-2xl p-3.5 transition-all group cursor-pointer animate-card-fade hover:-translate-y-0.5 shadow-xs"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="w-7 h-7 rounded-lg bg-amber-100/70 flex items-center justify-center text-amber-700">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                Awaiting Triage
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 font-display tabular-nums">
              {triageCount}
            </div>
            <div className="text-xs font-bold text-slate-800 leading-tight">Pending Review</div>
            <div className="text-[11px] text-emerald-700 font-medium">Under CENRO intake</div>
          </button>

          {/* Dispatched */}
          <button
            onClick={() => onSelectStatusFilter('Dispatched')}
            style={{ animationDelay: '200ms' }}
            className="text-left bg-slate-50/70 hover:bg-sky-50/40 border border-slate-200/60 rounded-2xl p-3.5 transition-all group cursor-pointer animate-card-fade hover:-translate-y-0.5 shadow-xs"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="w-7 h-7 rounded-lg bg-sky-100/70 flex items-center justify-center text-sky-600">
                <RefreshCw className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider">
                Dispatched
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 font-display tabular-nums">
              {dispatchedCount}
            </div>
            <div className="text-xs font-bold text-slate-800 leading-tight">In Progress</div>
            <div className="text-[11px] text-emerald-700 font-medium">Field unit deployed</div>
          </button>

          {/* Remediated */}
          <button
            onClick={() => onSelectStatusFilter('Remediated')}
            style={{ animationDelay: '250ms' }}
            className="text-left bg-slate-50/70 hover:bg-emerald-50/40 border border-slate-200/60 rounded-2xl p-3.5 transition-all group cursor-pointer animate-card-fade hover:-translate-y-0.5 shadow-xs"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="w-7 h-7 rounded-lg bg-emerald-100/70 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                Remediated
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 font-display tabular-nums">
              {remediatedCount}
            </div>
            <div className="text-xs font-bold text-slate-800 leading-tight">Resolved Incidents</div>
            <div className="text-[11px] text-emerald-700 font-medium">Remediated & Closed</div>
          </button>
        </div>
      </div>

      {/* Report An Environmental Incident Banner (Exact match to screenshot) */}
      <div className="bg-[#15803d] text-white rounded-3xl p-5 shadow-md border border-emerald-600/30 animate-card-entrance animate-stagger-2 transition-all hover:shadow-lg">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white flex-shrink-0">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base font-display text-white tracking-tight">
              Report an Environmental Incident
            </h3>
            <p className="text-xs text-emerald-100/90 leading-relaxed mt-0.5">
              See flooding, illegal dumping, pollution or another environmental problem? Report it to the municipality and help make our community safer and cleaner.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 mb-3.5">
          <button
            onClick={() => onOpenReportModal()}
            className="flex-1 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-emerald-950 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Camera className="w-4 h-4 text-emerald-950" />
            <span>Report Now</span>
          </button>

          <button
            onClick={onViewTracker}
            className="flex-1 bg-emerald-800/80 hover:bg-emerald-800 active:scale-95 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 border border-emerald-400/30 transition-all cursor-pointer"
          >
            <ListFilter className="w-4 h-4" />
            <span>View Incident Tracker</span>
          </button>
        </div>

        {/* Category Quick Tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {quickCategories.map((c) => (
            <button
              key={c.key}
              onClick={() => onOpenReportModal(c.key)}
              className="bg-emerald-800/70 hover:bg-emerald-700 text-emerald-100 hover:text-white text-[11px] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap transition-colors border border-emerald-500/20 active:scale-95 cursor-pointer"
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Shield, PhoneCall, CheckCircle2, AlertOctagon, Clock } from 'lucide-react';

export const ResponseProtocolCard: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-4 animate-card-entrance">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-700" />
          <h2 className="font-extrabold text-slate-900 text-sm tracking-tight uppercase font-display">
            Municipal Response Protocol
          </h2>
        </div>
        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          CENRO Standards
        </span>
      </div>

      {/* 3 Stages List (Exact styling from screenshot) with subtle stagger */}
      <div className="space-y-2.5">
        {/* Stage 1 */}
        <div
          style={{ animationDelay: '80ms' }}
          className="p-3 bg-slate-50/80 border border-slate-200/60 rounded-2xl flex items-start gap-3 animate-card-fade hover:bg-emerald-50/40 hover:-translate-y-0.5 transition-all"
        >
          <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md flex-shrink-0">
            Stage 1
          </span>
          <div>
            <h4 className="font-bold text-xs text-slate-900 leading-tight">
              Intake & Digital Triage
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              Automated deduplication and geotag verification (&lt; 1 hr).
            </p>
          </div>
        </div>

        {/* Stage 2 */}
        <div
          style={{ animationDelay: '140ms' }}
          className="p-3 bg-slate-50/80 border border-slate-200/60 rounded-2xl flex items-start gap-3 animate-card-fade hover:bg-emerald-50/40 hover:-translate-y-0.5 transition-all"
        >
          <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md flex-shrink-0">
            Stage 2
          </span>
          <div>
            <h4 className="font-bold text-xs text-slate-900 leading-tight">
              Eco-Warden Field Dispatch
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              On-site photographic inspection within 4 hours for Critical tickets.
            </p>
          </div>
        </div>

        {/* Stage 3 */}
        <div
          style={{ animationDelay: '200ms' }}
          className="p-3 bg-slate-50/80 border border-slate-200/60 rounded-2xl flex items-start gap-3 animate-card-fade hover:bg-emerald-50/40 hover:-translate-y-0.5 transition-all"
        >
          <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md flex-shrink-0">
            Stage 3
          </span>
          <div>
            <h4 className="font-bold text-xs text-slate-900 leading-tight">
              Inter-Agency Remediation
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              Culvert clearance, waste extraction, or environmental citations.
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Rescue Hotline Box (Exact to screenshot) */}
      <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
            Municipal Disaster Rescue
          </span>
          <a
            href="tel:09765544554"
            className="text-base font-extrabold text-emerald-700 hover:text-emerald-800 font-mono tracking-tight"
          >
            09765544554
          </a>
        </div>
        <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-2.5 py-1 rounded-full uppercase tracking-wider">
          24/7 Rapid Response
        </span>
      </div>
    </div>
  );
};

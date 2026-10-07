import React from 'react';
import {
  X,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  Building2,
  Calendar,
  Share2,
} from 'lucide-react';
import { Incident } from '../types';

interface IncidentDetailsModalProps {
  incident: Incident | null;
  onClose: () => void;
}

export const IncidentDetailsModal: React.FC<IncidentDetailsModalProps> = ({
  incident,
  onClose,
}) => {
  if (!incident) return null;

  const getStageActive = (stage: number) => {
    switch (incident.status) {
      case 'Pending Review':
        return stage === 1;
      case 'In Triage':
        return stage <= 2;
      case 'Dispatched':
        return stage <= 3;
      case 'Remediated':
        return stage <= 4;
      default:
        return false;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-4 bg-emerald-700 text-white flex items-center justify-between sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-emerald-800/80 px-2 py-0.5 rounded text-emerald-200">
                {incident.ticketNumber}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
                {incident.type}
              </span>
            </div>
            <h3 className="font-extrabold text-base font-display text-white mt-1 leading-snug">
              {incident.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full bg-emerald-800/80 hover:bg-emerald-600 flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Status & Priority Overview */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Current Status
              </span>
              <span className="text-sm font-extrabold text-emerald-800">
                {incident.status}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Severity Level
              </span>
              <span className={`text-sm font-extrabold ${incident.severity === 'Critical' ? 'text-rose-600' : 'text-amber-600'}`}>
                {incident.severity} Priority
              </span>
            </div>
          </div>

          {/* Response Protocol Milestones */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              CENRO Municipal Protocol Milestones
            </h4>
            <div className="space-y-3 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {/* Stage 1 */}
              <div className="relative">
                <div className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${getStageActive(1) ? 'border-emerald-600 text-emerald-600' : 'border-slate-300'}`}>
                  <div className={`w-2 h-2 rounded-full ${getStageActive(1) ? 'bg-emerald-600' : 'bg-transparent'}`} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block leading-tight">
                    Stage 1: Citizen Intake & Geotag Verification
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Logged by {incident.reportedBy} on {incident.reportedDate}
                  </p>
                </div>
              </div>

              {/* Stage 2 */}
              <div className="relative">
                <div className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${getStageActive(2) ? 'border-emerald-600 text-emerald-600' : 'border-slate-300'}`}>
                  <div className={`w-2 h-2 rounded-full ${getStageActive(2) ? 'bg-emerald-600' : 'bg-transparent'}`} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block leading-tight">
                    Stage 2: CENRO Digital Triage & Risk Assessment
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Assigned: {incident.assignedUnit || 'Intake Dispatch Queue'}
                  </p>
                </div>
              </div>

              {/* Stage 3 */}
              <div className="relative">
                <div className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${getStageActive(3) ? 'border-emerald-600 text-emerald-600' : 'border-slate-300'}`}>
                  <div className={`w-2 h-2 rounded-full ${getStageActive(3) ? 'bg-emerald-600' : 'bg-transparent'}`} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block leading-tight">
                    Stage 3: Eco-Warden Field Deployment
                  </span>
                  <p className="text-[11px] text-slate-500">
                    On-site physical inspection and inter-agency dispatch
                  </p>
                </div>
              </div>

              {/* Stage 4 */}
              <div className="relative">
                <div className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${getStageActive(4) ? 'border-emerald-600 text-emerald-600' : 'border-slate-300'}`}>
                  <div className={`w-2 h-2 rounded-full ${getStageActive(4) ? 'bg-emerald-600' : 'bg-transparent'}`} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block leading-tight">
                    Stage 4: Inter-Agency Remediation & Audit Closure
                  </span>
                  <p className="text-[11px] text-slate-500">
                    {incident.status === 'Remediated'
                      ? `Remediated on ${incident.remediationDate || 'Recent'}`
                      : 'Pending physical completion of municipal remediation'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description & Details */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Incident Narrative & Field Observation
            </h4>
            <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
              {incident.description}
            </p>
          </div>

          {/* Location & GIS Telemetry */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Geographic Telemetry & Barangay
            </h4>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{incident.location}</span>
              </div>
              <p className="text-slate-500 text-[11px] pl-5">
                Barangay: {incident.barangay} · Coordinates: {incident.coordinates.lat.toFixed(4)}° N, {incident.coordinates.lng.toFixed(4)}° E
              </p>
            </div>
          </div>

          {/* Photographic Evidence if Available */}
          {incident.imageUrl && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Photographic Telemetry Evidence
              </h4>
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 max-h-64 flex items-center justify-center">
                <img
                  src={incident.imageUrl}
                  alt={incident.title}
                  className="w-full h-full object-cover max-h-64"
                />
              </div>
            </div>
          )}

          {/* Remediation Note if Available */}
          {incident.remediationNote && (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Official Remediation Report</span>
              </div>
              <p className="text-emerald-800 leading-relaxed">
                {incident.remediationNote}
              </p>
            </div>
          )}

          {/* Reporter & Audit Info */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span>Reported by: <strong className="text-slate-800">{incident.reportedBy || 'Verified Citizen'}</strong></span>
            <span>{incident.reportedDate}</span>
          </div>

          {/* Action button */}
          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors"
            >
              Done Viewing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

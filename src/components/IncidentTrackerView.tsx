import React, { useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  RefreshCw,
  AlertTriangle,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Eye,
  Plus,
  Trash2,
} from 'lucide-react';
import { Incident, IncidentStatus } from '../types';

interface IncidentTrackerViewProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
  onOpenReportModal: () => void;
  initialFilter?: string;
  onDeleteIncident?: (id: string) => void;
  onClearPendingIncidents?: () => void;
}

export const IncidentTrackerView: React.FC<IncidentTrackerViewProps> = ({
  incidents,
  onSelectIncident,
  onOpenReportModal,
  initialFilter = 'all',
  onDeleteIncident,
  onClearPendingIncidents,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(initialFilter);
  const [barangayFilter, setBarangayFilter] = useState('all');

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch =
      searchTerm === '' ||
      inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.barangay.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      inc.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesBarangay =
      barangayFilter === 'all' ||
      inc.barangay.toLowerCase() === barangayFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesBarangay;
  });

  const getStatusBadge = (incident: Incident) => {
    if (incident.isOfflinePending) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full animate-pulse">
          <Clock className="w-3 h-3 text-amber-700" />
          Offline Pending Sync
        </span>
      );
    }

    switch (incident.status) {
      case 'Pending Review':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3" />
            Pending Review
          </span>
        );
      case 'In Triage':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200/80 px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3" />
            Under Triage
          </span>
        );
      case 'Dispatched':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 bg-sky-50 border border-sky-200/80 px-2 py-0.5 rounded-full">
            <RefreshCw className="w-3 h-3 animate-spin text-sky-600" />
            Dispatched
          </span>
        );
      case 'Remediated':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            Remediated
          </span>
        );
      default:
        return null;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return <span className="text-[10px] font-extrabold text-rose-600 uppercase">Critical</span>;
      case 'High':
        return <span className="text-[10px] font-extrabold text-amber-600 uppercase">High</span>;
      default:
        return <span className="text-[10px] font-extrabold text-slate-500 uppercase">Standard</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white text-slate-900 rounded-3xl p-5 shadow-xs border border-emerald-200/90 animate-card-entrance">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-black text-xl font-display tracking-tight text-emerald-950">
              Environmental Incident Tracker
            </h1>
            <p className="text-xs text-slate-600 mt-1 leading-snug">
              Search, filter, and inspect verified community reports and municipal dispatch milestones across Zamboanga Sibugay.
            </p>
          </div>
          <button
            onClick={onOpenReportModal}
            className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Report</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-slate-200 space-y-3 animate-card-entrance animate-stagger-1">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search reports by title, barangay, or ID..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {['all', 'Pending Review', 'In Triage', 'Dispatched', 'Remediated'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                statusFilter.toLowerCase() === st.toLowerCase()
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'all' ? 'All Incidents' : st}
            </button>
          ))}
          {onClearPendingIncidents && incidents.some((i) => i.status === 'Pending Review' || (i.status as string) === 'Pending' || i.isOfflinePending) && (
            <button
              type="button"
              onClick={() => {
                if (confirm('Are you sure you want to remove all pending incident reports?')) {
                  onClearPendingIncidents();
                }
              }}
              className="text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer flex items-center gap-1.5 ml-auto"
              title="Remove all pending reports"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear Pending Reports</span>
            </button>
          )}
        </div>
      </div>

      {/* Incident List with Responsive Multi-Column Grid */}
      {filteredIncidents.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-xs animate-card-fade">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-800">
            No incident reports match your filter criteria.
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search keywords, clearing status filters, or submit a new report.
          </p>
          <button
            onClick={onOpenReportModal}
            className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Submit First Report</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
          {filteredIncidents.map((incident, idx) => (
            <div
              key={incident.id}
              onClick={() => onSelectIncident(incident)}
              style={{ animationDelay: `${Math.min(idx * 45, 360)}ms` }}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:border-emerald-500/80 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group animate-card-entrance flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-slate-500">
                      {incident.ticketNumber}
                    </span>
                    <span className="text-slate-300">·</span>
                    {getSeverityBadge(incident.severity)}
                  </div>
                  <div className="flex items-center gap-1">
                    {getStatusBadge(incident)}
                    {onDeleteIncident && (incident.isOfflinePending || incident.status === 'Pending Review' || (incident.status as string) === 'Pending') && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Remove pending incident report ${incident.ticketNumber}?`)) {
                            onDeleteIncident(incident.id);
                          }
                        }}
                        className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete pending report"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                  {incident.title}
                </h4>

                <div className="flex items-center gap-1 text-xs text-slate-500 mt-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="truncate">{incident.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-2.5 border-t border-slate-100">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>{incident.reportedDate}</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-700 font-bold group-hover:translate-x-0.5 transition-transform">
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

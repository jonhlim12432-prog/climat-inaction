import React, { useState } from 'react';
import {
  MapPin,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Info,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Eye,
  SlidersHorizontal,
  X,
  Compass,
} from 'lucide-react';
import { Incident } from '../types';

interface GISMapSectionProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
}

export const GISMapSection: React.FC<GISMapSectionProps> = ({
  incidents,
  onSelectIncident,
}) => {
  const [selectedPin, setSelectedPin] = useState<Incident | null>(incidents[0] || null);
  const [activeLayer, setActiveLayer] = useState<'all' | 'flood' | 'dumping' | 'watershed'>('all');
  const [isFullView, setIsFullView] = useState(false);
  const [mapMode, setMapMode] = useState<'satellite' | 'streetview'>('satellite');

  // Filtered incidents based on active layer
  const displayedIncidents = incidents.filter((inc) => {
    if (activeLayer === 'flood') return inc.type.toLowerCase().includes('flood') || inc.type.toLowerCase().includes('water');
    if (activeLayer === 'dumping') return inc.type.toLowerCase().includes('dumping') || inc.type.toLowerCase().includes('waste');
    if (activeLayer === 'watershed') return inc.barangay.toLowerCase().includes('watershed') || inc.location.toLowerCase().includes('reserve');
    return true;
  });

  const getPinColor = (status: string, severity: string) => {
    if (status === 'Remediated') return 'bg-emerald-500 ring-emerald-300';
    if (status === 'Dispatched') return 'bg-sky-500 ring-sky-300';
    if (status === 'In Triage') return 'bg-amber-400 ring-amber-200';
    if (severity === 'Critical') return 'bg-rose-600 ring-rose-300';
    return 'bg-amber-500 ring-amber-300';
  };

  const mapIframeUrl = mapMode === 'satellite'
    ? 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126487.31976274488!2d122.5186938803961!3d7.782377626861583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3253b75417ec6e33%3A0x6b1f237efb8e23f0!2sIpil%2C%20Zamboanga%20Sibugay!5e1!3m2!1sen!2sph!4v1791192315691!5m2!1sen!2sph'
    : 'https://www.google.com/maps/embed?pb=!4v1791192315691!6m8!1m7!1sigYEYSoARoF5BB_6UDXNbA!2m2!1d7.782377626861583!2d122.5868938803961!3f317.6762!4f0!5f0.7820865974627469';

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-4 animate-card-entrance">
      {/* Title & Top Bar */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-700" />
            <h2 className="font-extrabold text-slate-900 text-sm tracking-tight uppercase font-display">
              Environmental Incident Map
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">
              GIS Telemetry
            </span>
            <button
              onClick={() => setIsFullView(true)}
              className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 px-2.5 py-1 rounded-full transition-all active:scale-95 cursor-pointer shadow-2xs"
              title="Expand to Full View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full View</span>
            </button>
          </div>
        </div>

        {/* Status Legend row */}
        <div className="flex items-center gap-2.5 flex-wrap text-[11px] font-medium text-slate-600 mt-2">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" /> Critical
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Pending
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> In Triage
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" /> In Progress
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Resolved
          </span>
        </div>
      </div>

      {/* Map Interactive Frame */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-900 h-72 sm:h-96 w-full select-none">
        <iframe
          src={mapIframeUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          title="Google Maps Satellite & Street View Telemetry"
          className="w-full h-full absolute inset-0"
        />

        {/* Map Header Overlay */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10 pointer-events-none">
          <span className="bg-slate-950/85 backdrop-blur-xs text-white text-[10px] font-bold px-3 py-1.5 rounded-lg border border-white/20 shadow-lg">
            🛰️ Live GIS Satellite View · Zamboanga Sibugay
          </span>
        </div>

        {/* Street View / Satellite Switcher in card view */}
        <div className="absolute top-2.5 right-2.5 z-10 flex gap-1">
          <button
            onClick={() => setMapMode(mapMode === 'satellite' ? 'streetview' : 'satellite')}
            className="bg-slate-900/90 hover:bg-slate-950 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-white/20 backdrop-blur-xs shadow-md transition-all cursor-pointer flex items-center gap-1"
          >
            <Compass className="w-3 h-3 text-emerald-400" />
            <span>{mapMode === 'satellite' ? 'Street View' : 'Satellite'}</span>
          </button>
        </div>
      </div>

      {/* Layer Toggles */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          onClick={() => setActiveLayer('all')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeLayer === 'all'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          All Layers ({incidents.length})
        </button>
        <button
          onClick={() => setActiveLayer('flood')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeLayer === 'flood'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Flood Lowlands
        </button>
        <button
          onClick={() => setActiveLayer('watershed')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeLayer === 'watershed'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Watershed Reserves
        </button>
        <button
          onClick={() => setActiveLayer('dumping')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeLayer === 'dumping'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Solid Waste Sites
        </button>
      </div>

      {/* Selected Incident Telemetry Card */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
            Selected Incident Telemetry
          </span>
          {selectedPin && (
            <span className="text-[11px] font-mono font-bold text-slate-500">
              {selectedPin.ticketNumber}
            </span>
          )}
        </div>

        {selectedPin ? (
          <div className="space-y-2">
            <h4 className="font-extrabold text-sm text-slate-900 leading-snug">
              {selectedPin.title}
            </h4>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="font-semibold text-slate-800">{selectedPin.barangay}</span>
              <span>·</span>
              <span>{selectedPin.location}</span>
            </div>
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {selectedPin.description}
            </p>
            <div className="flex items-center justify-between pt-2">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Status: {selectedPin.status}
              </span>
              <button
                onClick={() => onSelectIncident(selectedPin)}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-0.5 cursor-pointer"
              >
                <span>Inspect CENRO Protocol</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">
            Select any incident to view description, barangay coordinates, and audit history.
          </p>
        )}
      </div>

      {/* Full GIS Action Button */}
      <button
        onClick={() => setIsFullView(true)}
        className="w-full py-2.5 rounded-2xl border-2 border-emerald-600/40 text-emerald-800 hover:bg-emerald-50 active:scale-[0.99] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
      >
        <Maximize2 className="w-4 h-4 text-emerald-700" />
        <span>Open Full View GIS Map & Hotspot Layers</span>
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* FULL VIEW MODAL / EXPANDED WORKSPACE */}
      {isFullView && (
        <div
          onClick={() => setIsFullView(false)}
          className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md p-2 sm:p-4 md:p-6 flex items-center justify-center animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white text-slate-900 rounded-3xl w-full max-w-6xl max-h-[94vh] shadow-2xl border border-slate-200/90 my-auto flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-white shrink-0">
              <div className="min-w-0 pr-3">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Full View GIS Console
                  </span>
                  <span className="text-xs font-mono text-slate-400">Province of Zamboanga Sibugay</span>
                </div>
                <h3 className="font-extrabold text-base sm:text-xl text-slate-900 font-display leading-tight mt-1 truncate">
                  Interactive GIS Satellite Map & Environmental Hotspots
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setMapMode(mapMode === 'satellite' ? 'streetview' : 'satellite')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Switch to {mapMode === 'satellite' ? 'Street View' : 'Satellite'}</span>
                </button>
                <button
                  onClick={() => setIsFullView(false)}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                  aria-label="Close full view map"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Split view with Full Map on Left and Scrollable Hotspots on Right */}
            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row min-h-0">
              {/* Map Column */}
              <div className="flex-1 relative bg-slate-950 min-h-[320px] sm:min-h-[420px] lg:min-h-0">
                <iframe
                  src={mapIframeUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="Full View Google Maps Satellite & Street View Telemetry"
                  className="w-full h-full absolute inset-0"
                />
                <div className="absolute top-3 left-3 z-10 pointer-events-none">
                  <span className="bg-slate-950/90 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white/20 shadow-lg backdrop-blur-xs">
                    🛰️ Active Mode: {mapMode === 'satellite' ? 'Satellite Telemetry' : 'Street View 360'}
                  </span>
                </div>
              </div>

              {/* Scrollable Hotspot Telemetry Sidebar */}
              <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-slate-200 bg-slate-50 flex flex-col max-h-[45vh] lg:max-h-none overflow-hidden shrink-0">
                {/* Layer filter tabs */}
                <div className="p-3 border-b border-slate-200 bg-white flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs shrink-0">
                  <button
                    onClick={() => setActiveLayer('all')}
                    className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap text-xs transition-all cursor-pointer ${
                      activeLayer === 'all' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    All ({incidents.length})
                  </button>
                  <button
                    onClick={() => setActiveLayer('flood')}
                    className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap text-xs transition-all cursor-pointer ${
                      activeLayer === 'flood' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Flood
                  </button>
                  <button
                    onClick={() => setActiveLayer('watershed')}
                    className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap text-xs transition-all cursor-pointer ${
                      activeLayer === 'watershed' ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Watershed
                  </button>
                  <button
                    onClick={() => setActiveLayer('dumping')}
                    className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap text-xs transition-all cursor-pointer ${
                      activeLayer === 'dumping' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Waste
                  </button>
                </div>

                {/* Scrollable Incident List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5 overscroll-contain">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Active Hotspots ({displayedIncidents.length})
                  </span>
                  {displayedIncidents.map((incident) => {
                    const isSelected = selectedPin?.id === incident.id;
                    return (
                      <div
                        key={incident.id}
                        onClick={() => setSelectedPin(incident)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white border-emerald-500 shadow-md ring-1 ring-emerald-400'
                            : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-mono font-bold text-slate-500">{incident.ticketNumber}</span>
                          <span className="font-bold text-slate-700">{incident.status}</span>
                        </div>
                        <h4 className="font-bold text-xs text-slate-900 leading-snug">{incident.title}</h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                          <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{incident.barangay} · {incident.location}</span>
                        </div>
                        <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100">
                          <span className="text-[10px] font-bold uppercase text-rose-600">{incident.severity}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsFullView(false);
                              onSelectIncident(incident);
                            }}
                            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-0.5 cursor-pointer"
                          >
                            <span>Inspect</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-white shrink-0 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                LGU CENRO Real-time GIS Spatial Telemetry
              </span>
              <button
                onClick={() => setIsFullView(false)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                Close Full View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { IMAGES } from '../assets';
import {
  MapPin,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Info,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Eye,
  SlidersHorizontal,
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
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mapMode, setMapMode] = useState<'satellite' | 'streetview'>('satellite');

  // Pin coordinates mapped to percentage positions on the satellite image
  const pinPositions = [
    { id: 'inc-101', top: '48%', left: '42%', severity: 'High' },
    { id: 'inc-102', top: '35%', left: '68%', severity: 'Critical' },
    { id: 'inc-103', top: '72%', left: '38%', severity: 'High' },
    { id: 'inc-104', top: '24%', left: '28%', severity: 'Critical' },
  ];

  const getPinColor = (status: string, severity: string) => {
    if (status === 'Remediated') return 'bg-emerald-500 ring-emerald-300';
    if (status === 'Dispatched') return 'bg-sky-500 ring-sky-300';
    if (status === 'In Triage') return 'bg-amber-400 ring-amber-200';
    if (severity === 'Critical') return 'bg-rose-600 ring-rose-300';
    return 'bg-amber-500 ring-amber-300';
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-4 animate-card-entrance">
      {/* Title */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-700" />
            <h2 className="font-extrabold text-slate-900 text-sm tracking-tight uppercase font-display">
              Environmental Incident Map
            </h2>
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            GIS Telemetry
          </span>
        </div>

        {/* Status Legend row (Exact to screenshot) */}
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

      {/* Map Interactive Frame (Embedded Google Maps Satellite / Street View) */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-900 aspect-4/3 select-none">
        <div className="w-full h-full relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!4v1791192315691!6m8!1m7!1sigYEYSoARoF5BB_6UDXNbA!2m2!1d7.782377626861583!2d122.5868938803961!3f317.6762!4f0!5f0.7820865974627469"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title="Google Maps Satellite & Street View Telemetry"
            className="w-full h-full absolute inset-0"
          />
        </div>

        {/* Map Header Overlay */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10 pointer-events-none">
          <span className="bg-slate-950/85 backdrop-blur-xs text-white text-[10px] font-bold px-3 py-1.5 rounded-lg border border-white/20 shadow-lg">
            🛰️ Live Google Maps Satellite View · Zamboanga Sibugay
          </span>
        </div>
      </div>

      {/* Layer Toggles */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          onClick={() => setActiveLayer('all')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
            activeLayer === 'all'
              ? 'bg-emerald-700 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          All Layers
        </button>
        <button
          onClick={() => setActiveLayer('flood')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
            activeLayer === 'flood'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Flood Lowlands
        </button>
        <button
          onClick={() => setActiveLayer('watershed')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
            activeLayer === 'watershed'
              ? 'bg-emerald-800 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Watershed Reserves
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
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-0.5"
              >
                <span>Inspect CENRO Protocol</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">
            Click any pin on the map to view instant incident description, barangay, and audit history.
          </p>
        )}
      </div>

      {/* Full GIS Action Button (Exact to screenshot) */}
      <button
        onClick={() => {
          if (selectedPin) onSelectIncident(selectedPin);
        }}
        className="w-full py-2.5 rounded-2xl border-2 border-emerald-600/40 text-emerald-800 hover:bg-emerald-50 active:scale-[0.99] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
      >
        <span>Open Full GIS Map & Hotspot Layers</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

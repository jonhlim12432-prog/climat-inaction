import React, { useState } from 'react';
import {
  Sun,
  CloudRain,
  RotateCw,
  AlertTriangle,
  ChevronRight,
  Wind,
  Droplets,
  Gauge,
  X,
  Maximize2,
  Minimize2,
  Compass,
  Activity,
  ShieldCheck,
  Thermometer,
} from 'lucide-react';
import { TelemetryData } from '../types';

interface ClimateStatusCardProps {
  telemetry: TelemetryData;
  onRefresh: () => Promise<void>;
  isRefreshing: boolean;
  onViewAlertsTab?: () => void;
}

export const ClimateStatusCard: React.FC<ClimateStatusCardProps> = ({
  telemetry,
  onRefresh,
  isRefreshing,
  onViewAlertsTab,
}) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <div className="bg-gradient-to-br from-white via-emerald-50/50 to-teal-50/30 text-slate-800 rounded-3xl p-5 shadow-sm border border-emerald-200/90 relative overflow-hidden animate-card-entrance transition-all duration-300 hover:shadow-md">
      {/* Background radial glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-300/20 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header Row */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-300/80 shadow-2xs">
          Today's Climate Status
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowDetailModal(true)}
            className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-emerald-900 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 px-2.5 py-1 rounded-full transition-all active:scale-95 shadow-2xs cursor-pointer"
            title="Open full view telemetry dashboard"
          >
            <Maximize2 className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline">Full View</span>
          </button>
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-white hover:bg-emerald-100/70 border border-emerald-200 px-3 py-1 rounded-full transition-all active:scale-95 shadow-2xs cursor-pointer"
            title="Refresh live telemetry sensors"
          >
            <RotateCw className={`w-3.5 h-3.5 text-emerald-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Live Telemetry</span>
          </button>
        </div>
      </div>

      {/* Primary Climate Display */}
      <div className="flex items-start gap-4 mb-5 relative z-10">
        <div className="relative mt-1 text-emerald-600">
          <Sun className="w-12 h-12 stroke-[1.8] text-amber-500 animate-spin-slow" />
          <CloudRain className="w-6 h-6 absolute -bottom-1 -right-1 text-sky-500" />
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black tracking-tight font-display text-slate-900">
              {telemetry.temp}°C
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-800 leading-tight">
            {telemetry.condition}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Feels like {telemetry.feelsLike}°C · Updated {telemetry.lastUpdated}
          </p>
        </div>
      </div>

      {/* 3 Metric Grid Cards with subtle stagger */}
      <div className="grid grid-cols-3 gap-2.5 mb-4 relative z-10">
        {/* Heat Index */}
        <div
          style={{ animationDelay: '80ms' }}
          className="bg-white/90 border border-amber-200/90 rounded-2xl p-2.5 sm:p-3 text-center transition-all hover:bg-amber-50/50 hover:-translate-y-0.5 animate-card-fade shadow-2xs"
        >
          <span className="text-[10px] text-amber-800 uppercase font-bold tracking-wider block mb-1">
            Heat Index
          </span>
          <div className="text-lg sm:text-xl font-black text-amber-600 font-display">
            {telemetry.heatIndex.value}°C
          </div>
          <span className="text-[11px] font-bold text-slate-600">
            ({telemetry.heatIndex.status})
          </span>
        </div>

        {/* Air Quality */}
        <div
          style={{ animationDelay: '140ms' }}
          className="bg-white/90 border border-emerald-200/90 rounded-2xl p-2.5 sm:p-3 text-center transition-all hover:bg-emerald-50/50 hover:-translate-y-0.5 animate-card-fade shadow-2xs"
        >
          <span className="text-[10px] text-emerald-800 uppercase font-bold tracking-wider block mb-1">
            Air Quality
          </span>
          <div className="text-xs sm:text-sm font-black text-emerald-700 font-display leading-tight truncate">
            AQI {telemetry.airQuality.aqi}
          </div>
          <span className="text-[11px] font-bold text-slate-600">
            {telemetry.airQuality.status}
          </span>
        </div>

        {/* Rain Risk */}
        <div
          style={{ animationDelay: '200ms' }}
          className="bg-white/90 border border-sky-200/90 rounded-2xl p-2.5 sm:p-3 text-center transition-all hover:bg-sky-50/50 hover:-translate-y-0.5 animate-card-fade shadow-2xs"
        >
          <span className="text-[10px] text-sky-800 uppercase font-bold tracking-wider block mb-1">
            Rain Risk
          </span>
          <div className="text-lg sm:text-xl font-black text-sky-600 font-display">
            {telemetry.rainRisk.value}%
          </div>
          <span className="text-[11px] font-bold text-slate-600">
            {telemetry.rainRisk.status}
          </span>
        </div>
      </div>

      {/* PAGASA Advisory Pill Banner */}
      <button
        onClick={() => setShowDetailModal(true)}
        style={{ animationDelay: '260ms' }}
        className="w-full text-left bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-300/80 rounded-2xl p-3 transition-all group cursor-pointer animate-card-fade hover:-translate-y-0.5 shadow-2xs"
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
            PAGASA Status: {telemetry.pagasaAlert.level}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-emerald-950 font-medium leading-relaxed">
            {telemetry.pagasaAlert.advisory}
          </p>
          <ChevronRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </div>
      </button>

      {/* Detailed Telemetry Modal - Full View Visible & Scrollable */}
      {showDetailModal && (
        <div
          onClick={() => {
            setShowDetailModal(false);
            setIsFullScreen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/70 backdrop-blur-md animate-in fade-in overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`bg-white text-slate-900 shadow-2xl border border-slate-200/90 my-auto flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 transition-all ${
              isFullScreen
                ? 'w-full h-full max-w-none max-h-none rounded-none sm:rounded-3xl'
                : 'w-full max-w-2xl max-h-[90vh] rounded-3xl'
            }`}
          >
            {/* Header: Anchored at Top for Permanent Visibility */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-white shrink-0">
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Live Sensor Network
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">Array 04</span>
                </div>
                <h3 className="font-extrabold text-base sm:text-xl text-slate-900 font-display leading-tight mt-1 truncate">
                  Municipal Environmental Telemetry
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Zamboanga Sibugay · Ipil Telemetry Station</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                  title={isFullScreen ? 'Exit full screen' : 'Full screen view'}
                  aria-label={isFullScreen ? 'Exit full screen' : 'Full screen view'}
                >
                  {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setIsFullScreen(false);
                  }}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  aria-label="Close telemetry modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Content Body with Smooth Scrolling */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 overscroll-contain">
              {/* Primary Current Conditions Summary */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
                    <Sun className="w-8 h-8 text-amber-300 animate-spin-slow" />
                  </div>
                  <div>
                    <div className="text-4xl font-black font-display tracking-tight leading-none">
                      {telemetry.temp}°C
                    </div>
                    <div className="text-sm font-bold text-emerald-100 mt-1">{telemetry.condition}</div>
                    <div className="text-xs text-emerald-200/90 font-medium">Feels like {telemetry.feelsLike}°C</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:text-right border-t sm:border-t-0 sm:border-l border-white/20 pt-3 sm:pt-0 sm:pl-4">
                  <div>
                    <span className="text-[10px] text-emerald-200 uppercase font-bold block">Heat Index</span>
                    <span className="text-sm font-extrabold text-white">{telemetry.heatIndex.value}°C ({telemetry.heatIndex.status})</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-200 uppercase font-bold block">Rainfall Risk</span>
                    <span className="text-sm font-extrabold text-white">{telemetry.rainRisk.value}% ({telemetry.rainRisk.status})</span>
                  </div>
                </div>
              </div>

              {/* PAGASA Weather Bulletin */}
              <div className="bg-amber-50/90 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-950 space-y-2 shadow-2xs">
                <div className="flex items-center gap-1.5 font-extrabold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-xs uppercase tracking-wider">PAGASA Weather Bulletin</span>
                  <span className="ml-auto bg-amber-200 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {telemetry.pagasaAlert.level}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-slate-800">
                  {telemetry.pagasaAlert.advisory}
                </p>
                <div className="pt-2 text-[11px] font-semibold text-amber-900/90 border-t border-amber-200/60 leading-snug">
                  Recommendation: Keep local drainage culverts clear and stay alert for CDRRMO flood sirens.
                </div>
              </div>

              {/* Sensor parameters Grid */}
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-2.5 uppercase tracking-wider">
                  Atmospheric & Environmental Sensors
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Wind className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-slate-500 block text-[10px] truncate">Surface Wind</span>
                      <span className="font-extrabold text-slate-900 truncate block">{telemetry.windSpeed}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                      <Droplets className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-slate-500 block text-[10px] truncate">Humidity</span>
                      <span className="font-extrabold text-slate-900 truncate block">{telemetry.humidity}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                      <Gauge className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-slate-500 block text-[10px] truncate">UV Radiation</span>
                      <span className="font-extrabold text-slate-900 truncate block">{telemetry.uvIndex}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                      <Sun className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-slate-500 block text-[10px] truncate">Solar Irradiance</span>
                      <span className="font-extrabold text-slate-900 truncate block">640 W/m²</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Air Quality Index Breakdown */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Air Quality Breakdown (AQI {telemetry.airQuality.aqi})
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {telemetry.airQuality.status}
                  </span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
                  <div className="bg-white p-2 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">PM2.5</span>
                    <span className="font-bold text-slate-800 block text-xs mt-0.5">12 µg/m³</span>
                    <span className="text-[9px] text-emerald-600 font-bold block">Good</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">PM10</span>
                    <span className="font-bold text-slate-800 block text-xs mt-0.5">24 µg/m³</span>
                    <span className="text-[9px] text-emerald-600 font-bold block">Good</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">O3</span>
                    <span className="font-bold text-slate-800 block text-xs mt-0.5">38 ppb</span>
                    <span className="text-[9px] text-emerald-600 font-bold block">Normal</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">NO2</span>
                    <span className="font-bold text-slate-800 block text-xs mt-0.5">9 ppb</span>
                    <span className="text-[9px] text-emerald-600 font-bold block">Low</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">CO</span>
                    <span className="font-bold text-slate-800 block text-xs mt-0.5">0.4 ppm</span>
                    <span className="text-[9px] text-emerald-600 font-bold block">Safe</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">SO2</span>
                    <span className="font-bold text-slate-800 block text-xs mt-0.5">2 ppb</span>
                    <span className="text-[9px] text-emerald-600 font-bold block">Safe</span>
                  </div>
                </div>
              </div>

              {/* Hourly forecast mini trend with horizontal scroll support on small screens */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Hourly Heat & Temperature Telemetry
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Temp / Heat Index</span>
                </div>
                <div className="grid grid-cols-6 gap-2 text-center overflow-x-auto pb-1">
                  {telemetry.hourlyTrend.map((h, i) => (
                    <div key={i} className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-xs min-w-[54px]">
                      <span className="text-slate-500 block font-mono text-[10px]">{h.time}</span>
                      <span className="font-extrabold text-slate-900 block mt-1 text-sm">{h.temp}°</span>
                      <span className="text-amber-600 font-bold block text-[11px] mt-0.5">{h.heatIndex}°</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Station Diagnostics & Hardware Health */}
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/60 rounded-2xl flex items-center justify-between text-xs text-emerald-950">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div>
                    <span className="font-bold block">Station Array 04 Status: 100% Operational</span>
                    <span className="text-[10px] text-emerald-800 font-medium">Telemetry sync rate: 60s · LoRaWAN Signal: Strong (-64 dBm)</span>
                  </div>
                </div>
                <span className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shrink-0">
                  Online
                </span>
              </div>
            </div>

            {/* Footer: Anchored at Bottom for Permanent Visibility */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-white shrink-0 flex gap-2">
              {onViewAlertsTab && (
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setIsFullScreen(false);
                    onViewAlertsTab();
                  }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>3-Day Forecast & Alerts</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setIsFullScreen(false);
                }}
                className={`${onViewAlertsTab ? 'px-5' : 'w-full'} bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer`}
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

import React, { useState } from 'react';
import { Sun, CloudRain, RotateCw, AlertTriangle, ChevronRight, Wind, Droplets, Gauge } from 'lucide-react';
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

  return (
    <div className="bg-gradient-to-br from-white via-emerald-50/50 to-teal-50/30 text-slate-800 rounded-3xl p-5 shadow-sm border border-emerald-200/90 relative overflow-hidden animate-card-entrance transition-all duration-300 hover:shadow-md">
      {/* Background radial glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-300/20 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header Row */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-300/80 shadow-2xs">
          Today's Climate Status
        </span>
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
          <ChevronRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
        </div>
      </button>

      {/* Detailed Telemetry Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white text-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 font-display">
                  Municipal Environmental Telemetry
                </h3>
                <p className="text-xs text-slate-500">Zamboanga Sibugay · Sensor Array 04</p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-950">
                <div className="flex items-center gap-1.5 font-bold mb-1 text-amber-900">
                  <AlertTriangle className="w-4 h-4" />
                  <span>PAGASA Weather Bulletin</span>
                </div>
                <p>{telemetry.pagasaAlert.advisory}</p>
                <div className="mt-2 text-[11px] font-semibold text-amber-800">
                  Recommendation: Keep drainage culverts clear and stay alert for CDRRMO flood sirens.
                </div>
              </div>

              {/* Sensor parameters */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                  <Wind className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="text-slate-500 block text-[10px]">Surface Wind</span>
                    <span className="font-bold text-slate-800">{telemetry.windSpeed}</span>
                  </div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-sky-600" />
                  <div>
                    <span className="text-slate-500 block text-[10px]">Humidity</span>
                    <span className="font-bold text-slate-800">{telemetry.humidity}</span>
                  </div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-purple-600" />
                  <div>
                    <span className="text-slate-500 block text-[10px]">UV Radiation</span>
                    <span className="font-bold text-slate-800">{telemetry.uvIndex}</span>
                  </div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-600" />
                  <div>
                    <span className="text-slate-500 block text-[10px]">Solar Irradiance</span>
                    <span className="font-bold text-slate-800">640 W/m²</span>
                  </div>
                </div>
              </div>

              {/* Hourly forecast mini trend */}
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-2">
                  Hourly Heat & Temperature Telemetry
                </span>
                <div className="grid grid-cols-6 gap-1 text-center">
                  {telemetry.hourlyTrend.map((h, i) => (
                    <div key={i} className="bg-slate-100/80 p-1.5 rounded-lg text-[10px]">
                      <span className="text-slate-500 block font-mono">{h.time}</span>
                      <span className="font-bold text-slate-900 block mt-0.5">{h.temp}°</span>
                      <span className="text-amber-600 font-semibold block">{h.heatIndex}°</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {onViewAlertsTab && (
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    onViewAlertsTab();
                  }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>3-Day Forecast & Alerts</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setShowDetailModal(false)}
                className={`${onViewAlertsTab ? 'px-4' : 'w-full'} bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

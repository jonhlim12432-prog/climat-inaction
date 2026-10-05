import React, { useState, useEffect } from 'react';
import {
  CloudRain,
  Sun,
  CloudSun,
  CloudLightning,
  Wind,
  Droplets,
  AlertTriangle,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Info,
  Calendar,
  Compass,
  ArrowUpRight,
  ChevronRight,
  PhoneCall,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { WeatherForecastResponse, DayForecast } from '../types';
import { apiService } from '../services/api';

interface GroundedWeatherForecastCardProps {
  onOpenReportModal?: (category?: string) => void;
}

export const GroundedWeatherForecastCard: React.FC<GroundedWeatherForecastCardProps> = ({
  onOpenReportModal,
}) => {
  const [forecast, setForecast] = useState<WeatherForecastResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [locationQuery, setLocationQuery] = useState('Zamboanga Sibugay, Philippines');
  const [isCustomizingLocation, setIsCustomizingLocation] = useState(false);
  const [customInput, setCustomInput] = useState('');

  const locationPresets = [
    'Zamboanga Sibugay, Philippines',
    'Ipil Coastal & Sibugay Bay, Philippines',
    'Sanito River Catchment, Zamboanga Sibugay',
    'Titay Watershed & Mountain Ridges',
  ];

  const fetchForecast = async (loc?: string, isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const data = await apiService.getWeatherForecast(loc || locationQuery);
      setForecast(data);
    } catch (err) {
      console.error('Failed to load grounded weather forecast:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, []);

  const handleSelectPreset = (loc: string) => {
    setLocationQuery(loc);
    setIsCustomizingLocation(false);
    fetchForecast(loc, true);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      setLocationQuery(customInput.trim());
      setIsCustomizingLocation(false);
      fetchForecast(customInput.trim(), true);
    }
  };

  const getWeatherIcon = (condition: string, sizeClass = 'w-6 h-6') => {
    const c = condition.toLowerCase();
    if (c.includes('thunder') || c.includes('lightning') || c.includes('storm')) {
      return <CloudLightning className={`${sizeClass} text-amber-500`} />;
    }
    if (c.includes('rain') || c.includes('shower') || c.includes('downpour')) {
      return <CloudRain className={`${sizeClass} text-sky-500`} />;
    }
    if (c.includes('partly') || (c.includes('cloud') && c.includes('sun'))) {
      return <CloudSun className={`${sizeClass} text-amber-400`} />;
    }
    if (c.includes('wind') || c.includes('breeze')) {
      return <Wind className={`${sizeClass} text-teal-400`} />;
    }
    if (c.includes('clear') || c.includes('sun')) {
      return <Sun className={`${sizeClass} text-amber-500`} />;
    }
    return <CloudSun className={`${sizeClass} text-emerald-500`} />;
  };

  const getAdvisoryBadge = (level?: string) => {
    if (level === 'Orange Alert') {
      return (
        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />
          Orange Alert
        </span>
      );
    }
    if (level === 'Yellow Alert') {
      return (
        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
          Yellow Alert
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
        Normal
      </span>
    );
  };

  if (loading && !forecast) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
            <span className="font-extrabold text-sm text-slate-800 font-display">
              Fetching Google Search Grounded Weather...
            </span>
          </div>
          <span className="text-xs text-slate-400">PAGASA Telemetry</span>
        </div>
        <p className="text-xs text-slate-500">
          Querying live weather bulletins and tropical depression radar via Gemini with Google Search grounding...
        </p>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const selectedDay: DayForecast | undefined = forecast?.days[selectedDayIndex] || forecast?.days[0];

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-4 animate-card-entrance">
      {/* Header with Google Search Grounding badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              Google Search Grounding
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-sky-800 px-2.5 py-0.5 rounded-full border border-sky-200">
              <ShieldCheck className="w-3 h-3 text-sky-600" />
              DOST-PAGASA Grounded
            </span>
          </div>
          <h2 className="font-extrabold text-base sm:text-lg text-slate-900 mt-1 font-display tracking-tight flex items-center gap-1.5">
            Local 3-Day Synoptic Weather Forecast
          </h2>
        </div>

        {/* Refresh & Location Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCustomizingLocation(!isCustomizingLocation)}
            className="text-xs font-semibold text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
            title="Switch municipality/area"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden xs:inline">Area</span>
          </button>
          <button
            onClick={() => fetchForecast(locationQuery, true)}
            disabled={refreshing}
            className="text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:scale-95 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Grounding...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Location Switcher Subpanel (Expandable) */}
      {isCustomizingLocation && (
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Select Municipal Area for Live Grounding</span>
            <button
              onClick={() => setIsCustomizingLocation(false)}
              className="text-slate-400 hover:text-slate-700 text-xs"
            >
              ✕
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {locationPresets.map((loc) => (
              <button
                key={loc}
                onClick={() => handleSelectPreset(loc)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-all text-left cursor-pointer ${
                  locationQuery === loc
                    ? 'bg-emerald-700 text-white border-emerald-700 font-bold'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
          <form onSubmit={handleCustomSubmit} className="flex gap-1.5 pt-1">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Or type a municipality (e.g. Buug, Malangas, Naga)..."
              className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-hidden focus:border-emerald-600 bg-white"
            />
            <button
              type="submit"
              className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Active Location & Grounded Status Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50/80 px-3 py-2 rounded-xl border border-slate-100">
        <div className="flex items-center gap-1.5 truncate">
          <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span className="font-bold text-slate-800 truncate">{forecast?.location}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 text-[11px]">
          <span className="text-slate-400">Updated: {forecast?.lastUpdated}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live telemetry active" />
        </div>
      </div>

      {/* Quota rate limit banner if free tier quota exceeded */}
      {forecast?.isQuotaLimited && (
        <div className="p-2.5 bg-amber-50/90 border border-amber-200 rounded-xl text-xs flex items-center justify-between gap-2 text-amber-900">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span className="text-[11px]">
              Serving verified DOST-PAGASA telemetry cache (API quota rate-limited).
            </span>
          </div>
          <span className="text-[10px] font-bold bg-amber-200/70 text-amber-950 px-2 py-0.5 rounded-full flex-shrink-0">
            Verified Cache
          </span>
        </div>
      )}

      {/* Live Synoptic Weather Overview Banner */}
      {forecast?.synopticSummary && (
        <div className="p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border border-emerald-200/80 rounded-2xl text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-900 font-extrabold text-[11px] uppercase tracking-wide">
            <Compass className="w-3.5 h-3.5 text-emerald-700" />
            <span>PAGASA Synoptic Weather Briefing</span>
          </div>
          <p className="text-slate-700 leading-relaxed text-[11.5px]">
            {forecast.synopticSummary}
          </p>
        </div>
      )}

      {/* 3-Day Forecast Cards Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">
          <span>3-Day Outlook (Tap to Inspect)</span>
          <span>Temp / Rain / Advisory</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {forecast?.days.map((day, idx) => {
            const isSelected = selectedDayIndex === idx;
            return (
              <div
                key={idx}
                onClick={() => setSelectedDayIndex(idx)}
                style={{ animationDelay: `${idx * 80}ms` }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative animate-card-fade hover:-translate-y-0.5 ${
                  isSelected
                    ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200/90'
                }`}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between gap-1 mb-2">
                  <div className="truncate">
                    <span className="font-extrabold text-xs text-slate-900 block truncate font-display">
                      {day.dayName}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{day.date}</span>
                  </div>
                  {getAdvisoryBadge(day.advisoryLevel)}
                </div>

                {/* Weather Icon & Condition */}
                <div className="flex items-center gap-2.5 my-2">
                  <div className="p-2 bg-slate-100/80 rounded-xl flex-shrink-0">
                    {getWeatherIcon(day.condition)}
                  </div>
                  <div className="truncate">
                    <div className="flex items-baseline gap-1">
                      <span className="font-extrabold text-lg text-slate-900">
                        {day.tempHigh}°
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">
                        / {day.tempLow}°C
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-600 font-medium block truncate" title={day.condition}>
                      {day.condition}
                    </span>
                  </div>
                </div>

                {/* Metrics: Rain Risk & Heat Index */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1 text-slate-600">
                    <Droplets className="w-3.5 h-3.5 text-sky-500" />
                    <span className="font-bold text-slate-800">{day.rainRisk}%</span>
                    <span className="text-[10px] text-slate-400">rain</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-600">
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span className="font-bold text-slate-800">{day.heatIndex}°C</span>
                    <span className="text-[10px] text-slate-400">index</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day In-Depth Advisory Breakdown */}
      {selectedDay && (
        <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-700" />
              <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">
                Detailed Briefing · {selectedDay.dayName}
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              Surface Winds: {selectedDay.wind}
            </span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
            {selectedDay.summary}
          </p>

          {/* Environmental Action Recommendation for Citizens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
              <div className="flex items-center gap-1 font-bold text-emerald-950">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Drainage & Flood Preparedness</span>
              </div>
              <p className="text-[11px] text-emerald-900 leading-snug">
                {selectedDay.rainRisk >= 60
                  ? 'High precipitation forecast. Clear roadside culverts of plastic litter to prevent local backwater flooding.'
                  : 'Maintain clean rain barrels and verify neighborhood drainage grates are free of tree debris.'}
              </p>
            </div>

            <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
              <div className="flex items-center gap-1 font-bold text-amber-950">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Heat & Coastal Safety</span>
              </div>
              <p className="text-[11px] text-amber-900 leading-snug">
                Heat index reaching {selectedDay.heatIndex}°C. Limit strenuous outdoor work between 11:00 AM and 2:00 PM; stay hydrated.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grounding Web Sources & Citations */}
      {forecast?.groundingSources && forecast.groundingSources.length > 0 && (
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              Verified Google Search Grounding Sources
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold">Live Web Citations</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {forecast.groundingSources.map((source, sIdx) => (
              <a
                key={sIdx}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 px-2.5 py-1 rounded-xl transition-all cursor-pointer group"
              >
                <span className="truncate max-w-[200px]">{source.title}</span>
                <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Action Footer: Report Incident & Emergency Hotline */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-1">
        <button
          onClick={() => onOpenReportModal?.('flooding')}
          className="w-full sm:w-auto text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-3.5 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-emerald-700" />
          <span>Report Weather Damage / Flooding</span>
        </button>

        <a
          href="tel:09765544554"
          className="w-full sm:w-auto text-xs font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3.5 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 text-center"
        >
          <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
          <span>24/7 Disaster Hotline: 09765544554</span>
        </a>
      </div>
    </div>
  );
};

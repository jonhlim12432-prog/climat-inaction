import React from 'react';
import {
  ShieldCheck,
  Thermometer,
  AlertTriangle,
  Award,
  TreePine,
  MapPin,
  ArrowRight,
  UserPlus,
  LogIn,
  Wind,
  Droplets,
  Sun,
  Activity,
  CheckCircle2,
  PhoneCall,
  Flame,
  Globe,
  Compass,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { TelemetryData, Incident, CommunityActivity, UserProfile } from '../types';

interface LandingHeroViewProps {
  telemetry: TelemetryData | null;
  incidents: Incident[];
  activities: CommunityActivity[];
  userProfile: UserProfile | null;
  onOpenAuthModal: (mode?: 'login' | 'signup') => void;
  onExploreDashboard: (tab?: string) => void;
  onOpenReportModal: () => void;
}

export const LandingHeroView: React.FC<LandingHeroViewProps> = ({
  telemetry,
  incidents,
  activities,
  userProfile,
  onOpenAuthModal,
  onExploreDashboard,
  onOpenReportModal,
}) => {
  const verifiedIncidentsCount = incidents.filter((i) => i.status === 'Remediated' || i.status === 'Dispatched').length;
  const activeActivitiesCount = activities.length;

  return (
    <div className="space-y-12 pb-12">
      {/* =========================================================================
          HERO SECTION
      ========================================================================= */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white shadow-xl border border-emerald-700/50 p-6 sm:p-10 md:p-12">
        {/* Ambient atmospheric lighting effect */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Mission Narrative & Direct CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/60 text-emerald-200 text-xs font-bold shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Zamboanga Sibugay Climate Action & Telemetry Portal</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight leading-[1.15]">
              Empowering Citizens. <br />
              <span className="text-emerald-300">Protecting Our Province.</span>
            </h1>

            <p className="text-sm sm:text-base text-emerald-100/90 max-w-xl font-normal leading-relaxed">
              Experience the official community-driven climate monitoring network. Geotag environmental hazards, receive real-time PAGASA weather advisories, participate in municipal conservation movements, and earn verified eco-rewards.
            </p>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {!userProfile ? (
                <>
                  <button
                    onClick={() => onOpenAuthModal('signup')}
                    className="bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-black text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4 stroke-[2.5]" />
                    <span>Create Citizen Account</span>
                  </button>

                  <button
                    onClick={() => onOpenAuthModal('login')}
                    className="bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl backdrop-blur-xs transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Citizen Login</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => onExploreDashboard('profile')}
                  className="bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-black text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4 stroke-[2.5]" />
                  <span>Welcome back, {userProfile.name} (View Profile)</span>
                </button>
              )}

              <button
                onClick={() => onExploreDashboard('home')}
                className="bg-emerald-800/80 hover:bg-emerald-700/80 text-emerald-100 hover:text-white border border-emerald-600/50 font-bold text-xs sm:text-sm px-4 py-3 rounded-2xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Explore Live Radar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Trust highlights */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-emerald-700/60 max-w-lg">
              <div>
                <span className="block font-black text-xl sm:text-2xl text-white">14</span>
                <span className="text-[11px] text-emerald-200">Municipalities</span>
              </div>
              <div>
                <span className="block font-black text-xl sm:text-2xl text-white">2.4k+</span>
                <span className="text-[11px] text-emerald-200">Eco Citizens</span>
              </div>
              <div>
                <span className="block font-black text-xl sm:text-2xl text-emerald-300">98.4%</span>
                <span className="text-[11px] text-emerald-200">Response Rate</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Micro-Climate Telemetry Card */}
          <div className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-white/20 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/15">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/30 flex items-center justify-center text-emerald-300">
                    <Activity className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white font-display">Live Telemetry Station</h3>
                    <p className="text-[10px] text-emerald-200">Zamboanga Sibugay Sensor Hub</p>
                  </div>
                </div>
                <span className="bg-emerald-400/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Active
                </span>
              </div>

              {/* Temp & Condition */}
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-4xl sm:text-5xl font-black text-white font-display tracking-tight">
                    {telemetry?.temp ?? 32}°C
                  </span>
                  <p className="text-xs text-emerald-200 mt-1">
                    Feels like {telemetry?.feelsLike ?? 36}°C · {telemetry?.condition ?? 'Partly Cloudy'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200 block">Rain Risk</span>
                  <span className="text-xl font-black text-amber-300">
                    {telemetry?.rainRisk?.value ?? 45}%
                  </span>
                </div>
              </div>

              {/* Environmental Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 text-center">
                  <Flame className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                  <span className="text-[10px] text-emerald-200 block">Heat Index</span>
                  <span className="text-xs font-black text-white">{telemetry?.heatIndex?.value ?? 38}°C</span>
                </div>
                <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 text-center">
                  <Wind className="w-4 h-4 text-sky-300 mx-auto mb-1" />
                  <span className="text-[10px] text-emerald-200 block">Air Quality</span>
                  <span className="text-xs font-black text-white">AQI {telemetry?.airQuality?.aqi ?? 68}</span>
                </div>
                <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 text-center">
                  <Droplets className="w-4 h-4 text-teal-300 mx-auto mb-1" />
                  <span className="text-[10px] text-emerald-200 block">Humidity</span>
                  <span className="text-xs font-black text-white">{telemetry?.humidity ?? '78%'}</span>
                </div>
              </div>

              {/* PAGASA Emergency Advisory */}
              {telemetry?.pagasaAlert?.active && (
                <div className="bg-amber-500/20 border border-amber-400/40 rounded-xl p-3 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-extrabold text-amber-200 block">
                      {telemetry.pagasaAlert.level}: {telemetry.pagasaAlert.badge}
                    </span>
                    <p className="text-[11px] text-amber-100/90 leading-tight mt-0.5">
                      {telemetry.pagasaAlert.advisory}
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={() => onExploreDashboard('home')}
                className="w-full bg-white/20 hover:bg-white/30 text-white font-bold text-xs py-2.5 rounded-xl border border-white/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View Full Meteorological Breakdown</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          KEY PILLARS & VALUE PROPOSITIONS
      ========================================================================= */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 tracking-tight">
            Comprehensive Climate Resilience Framework
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            A unified municipal telemetry ecosystem connecting citizen reporters, barangay disaster rescue units, and environmental officers in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Micro-Climate Telemetry */}
          <div
            onClick={() => onExploreDashboard('home')}
            className="group bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shadow-inner group-hover:scale-105 transition-transform">
                <Thermometer className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 font-display group-hover:text-emerald-700 transition-colors">
                Real-Time Telemetry & Radar
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hyper-local temperature sensors, heat index alerts, and PAGASA severe weather bulletins to keep your family and crops secure.
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
              <span>View Weather Station</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </div>
          </div>

          {/* Card 2: Incident Whistleblower Reporting */}
          <div
            onClick={() => onExploreDashboard('tracker')}
            className="group bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shadow-inner group-hover:scale-105 transition-transform">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 font-display group-hover:text-amber-700 transition-colors">
                Incident Dispatch Tracker
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Geotag flood heights, fallen trees, illegal logging, and open burning for rapid inspection and verification by CDRRMO officers.
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-amber-700 group-hover:translate-x-1 transition-transform">
              <span>Browse Incident Map ({incidents.length})</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </div>
          </div>

          {/* Card 3: Verified Climate Movements & Badges */}
          <div
            onClick={() => onExploreDashboard('activities')}
            className="group bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold shadow-inner group-hover:scale-105 transition-transform">
                <TreePine className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 font-display group-hover:text-teal-700 transition-colors">
                Community Eco Movements
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Join coastal cleanups, mangrove planting, and e-waste recycling drives. Submit photo evidence to earn Eco-Points and honor badges.
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-teal-700 group-hover:translate-x-1 transition-transform">
              <span>Join Movements ({activeActivitiesCount})</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </div>
          </div>

          {/* Card 4: Carbon Calculator & Governance */}
          <div
            onClick={() => onExploreDashboard('calculator')}
            className="group bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold shadow-inner group-hover:scale-105 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 font-display group-hover:text-sky-700 transition-colors">
                Personal Carbon Audit
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Calculate personal carbon emissions across transport, household energy, and waste, receiving actionable reduction roadmaps.
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-sky-700 group-hover:translate-x-1 transition-transform">
              <span>Start Carbon Audit</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          COMMUNITY CALL-TO-ACTION BANNER
      ========================================================================= */}
      <section className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-emerald-600/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 bg-emerald-400/20 border border-emerald-300/30 text-emerald-200 text-[11px] font-bold px-2.5 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>Official Barangay Participation Protocol</span>
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
              Ready to take action in your community?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-lg">
              Create your citizen profile in under a minute to start reporting local climate events, collecting eco-rewards, and building community resilience.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {!userProfile ? (
              <button
                onClick={() => onOpenAuthModal('signup')}
                className="bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4 stroke-[2.5]" />
                <span>Register Free Account</span>
              </button>
            ) : (
              <button
                onClick={onOpenReportModal}
                className="bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Report Environmental Incident</span>
              </button>
            )}

            <button
              onClick={() => onExploreDashboard('home')}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-5 py-3.5 rounded-2xl border border-white/20 transition-all cursor-pointer"
            >
              Explore Public Portal
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

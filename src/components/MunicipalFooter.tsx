import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Building,
  PhoneCall,
  ChevronRight,
  ShieldCheck,
  Leaf,
  Sparkles,
  Users,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  HeartHandshake,
  ArrowRight,
  BookOpen,
  Award,
} from 'lucide-react';
import { MunicipalHotline, FooterConfig, ClimateTipItem } from '../types';

export const DEFAULT_FOOTER_CONFIG: FooterConfig = {
  portalName: 'Climate Action System',
  portalSubtitle: 'City Government of Zamboanga Sibugay',
  municipality: 'Zamboanga Sibugay',
  missionNarrative:
    'Integrated municipal digital infrastructure empowering citizens to document, verify, and resolve real-world environmental violations across Zamboanga Sibugay in coordination with CENRO and DENR.',
  copyrightText: '© 2026 Climate Action Reporting & Information System • City Government of Zamboanga Sibugay.',
  complianceText:
    'Official Municipal Environmental Portal • Republic Act No. 9003 (Ecological Solid Waste Management Act), RA 9729 (Climate Change Act) & RA 8749 (Clean Air Act) Compliance',
  systemArchitect:
    'System Architect: Architected by GC KA SOHO in collaboration with the Municipal Climate Resilience Taskforce, LGU CENRO Officers, and Academic Environmental Science Advisors.',
  advisorsText:
    'Academic & Scientific Review: Western Mindanao State University Marine & Environmental Studies Consortium.',
  whistleblowerTagline: '256-Bit Whistleblower Protocol',
  coordinationTagline: 'Official CENRO & DENR Partnered',
  climateTips: [
    {
      id: 'tip-1',
      category: 'Action & Tips',
      title: 'Rainwater Catchment & Drainage Pressure Relief',
      description:
        'Install fine mesh-covered drums under roof eaves to collect non-potable water for garden irrigation, reducing sudden stormwater surges into lowland Purok culverts.',
      actionCall: 'Calculate Household Runoff',
      badge: 'Immediate Action',
    },
    {
      id: 'tip-2',
      category: 'Climate Awareness',
      title: 'Zamboanga Sibugay Mangrove Carbon Sinks',
      description:
        'Our coastal mangroves sequester up to 4x more carbon per hectare than terrestrial rainforests while acting as natural surge breakers against storm waves.',
      actionCall: 'View GIS Mangrove Zones',
      badge: 'Sibugay Ecology',
    },
    {
      id: 'tip-3',
      category: 'Community Involvement',
      title: 'Purok Zero-Waste & Barangay Clean Drives',
      description:
        'Join weekly Saturday morning coastal and river cleanups organized by Barangay Eco-Warriors. Earn +50 Eco-Points towards municipal tax credits and seed certificates.',
      actionCall: 'Join Active Volunteer Drives',
      badge: 'Community Action',
    },
    {
      id: 'tip-4',
      category: 'Legal & Ordinance',
      title: 'Municipal Ordinance #2026-04: Single-Use Plastic Ban',
      description:
        'Commercial establishments and wet market vendors are prohibited from providing non-biodegradable plastic bags. Bring reusable rattan or cloth bags (bayong).',
      actionCall: 'Report Plastic Dumping',
      badge: 'Enacted Ordinance',
    },
    {
      id: 'tip-5',
      category: 'Action & Tips',
      title: 'Backyard Vermicomposting & Organic Diversion',
      description:
        'Diverting fruit peels and vegetable scraps into household compost bins cuts municipal landfill methane emissions by 38% while producing nutrient-rich garden soil.',
      actionCall: 'Take Carbon Footprint Audit',
      badge: 'Waste Reduction',
    },
    {
      id: 'tip-6',
      category: 'Community Involvement',
      title: 'Youth Climate Ambassador Program',
      description:
        'High school and university students across Zamboanga Sibugay can register as verified Geotag Monitors to lead environmental reporting in their local schools.',
      actionCall: 'Browse Knowledge Hub',
      badge: 'Youth Leadership',
    },
  ],
  communityPledges: [
    'Always segregate biodegradable, recyclable, and hazardous household waste at source (RA 9003).',
    'Report open burning (siga) immediately to protect clean air and asthmatic seniors (RA 8749).',
    'Preserve freshwater riverbanks and plant native mangrove propagules along coastal buffer zones.',
    'Conserve grid electricity during peak 1:00 PM – 4:00 PM thermal load hours.',
  ],
};

interface MunicipalFooterProps {
  onNavigate: (tab: string) => void;
  onOpenReportModal: () => void;
  hotlines?: MunicipalHotline[];
  footerConfig?: FooterConfig;
}

export const MunicipalFooter: React.FC<MunicipalFooterProps> = ({
  onNavigate,
  onOpenReportModal,
  hotlines,
  footerConfig = DEFAULT_FOOTER_CONFIG,
}) => {
  const [selectedTipCategory, setSelectedTipCategory] = useState<string>('All');

  const displayHotlines =
    hotlines && hotlines.length > 0
      ? hotlines.slice(0, 3)
      : [
          {
            id: 'default-1',
            agencyName: 'Municipal Disaster Rescue (CDRRMO)',
            number: '09765544554',
            hours: '24/7 Rapid Response',
            category: 'Disaster Rescue' as const,
            priority: 'Emergency' as const,
          },
          {
            id: 'default-2',
            agencyName: 'CENRO Environmental Hotline',
            number: '(062) 925-1100',
            hours: 'Office Desk',
            category: 'Environmental Crime' as const,
            priority: 'Standard Desk' as const,
            description: 'cenro.metroverde@lgu.gov.ph',
          },
        ];

  const filteredTips =
    selectedTipCategory === 'All'
      ? footerConfig.climateTips
      : footerConfig.climateTips.filter((t) => t.category === selectedTipCategory);

  const handleActionClick = (actionCall?: string) => {
    if (!actionCall) return;
    if (actionCall.toLowerCase().includes('report')) {
      onOpenReportModal();
    } else if (actionCall.toLowerCase().includes('carbon') || actionCall.toLowerCase().includes('runoff')) {
      onNavigate('calculator');
    } else if (actionCall.toLowerCase().includes('volunteer') || actionCall.toLowerCase().includes('drive')) {
      onNavigate('activities');
    } else if (actionCall.toLowerCase().includes('gis') || actionCall.toLowerCase().includes('map')) {
      onNavigate('map');
    } else if (actionCall.toLowerCase().includes('knowledge') || actionCall.toLowerCase().includes('hub')) {
      onNavigate('knowledge');
    } else {
      onNavigate('forum');
    }
  };

  return (
    <footer className="space-y-6 pt-6 pb-20 md:pb-6 text-white">
      {/* =========================================================================
          SECTION 1: CLIMATE AWARENESS, TIPS & COMMUNITY INVOLVEMENT CAROUSEL/GRID
      ========================================================================= */}
      <div className="bg-gradient-to-br from-[#0a4328] via-[#063b22] to-[#032b17] rounded-3xl p-5 sm:p-7 shadow-2xl border border-emerald-600/40 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-emerald-700/60">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-400/30">
                <Lightbulb className="w-4 h-4 text-emerald-300" />
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-white font-display tracking-tight">
                Climate Awareness, Action Tips & Community Involvement
              </h3>
            </div>
            <p className="text-xs text-emerald-200/90 mt-1 max-w-2xl leading-relaxed">
              Equipping citizens of Zamboanga Sibugay with actionable daily practices, local ecological knowledge, and verified civic participation initiatives.
            </p>
          </div>

          {/* Tip Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {['All', 'Action & Tips', 'Climate Awareness', 'Community Involvement', 'Legal & Ordinance'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedTipCategory(cat)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  selectedTipCategory === cat
                    ? 'bg-emerald-400 text-emerald-950 shadow-sm shadow-emerald-900/40'
                    : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-800/80 border border-emerald-700/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Tip & Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTips.map((tip) => (
            <div
              key={tip.id}
              className="bg-emerald-950/70 border border-emerald-700/50 hover:border-emerald-500/70 rounded-2xl p-4 flex flex-col justify-between transition-all hover:bg-emerald-900/60 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300 bg-emerald-900/80 border border-emerald-600/40 px-2 py-0.5 rounded-md">
                    {tip.category}
                  </span>
                  {tip.badge && (
                    <span className="text-[9.5px] font-bold text-amber-300 bg-amber-950/60 border border-amber-500/40 px-1.5 py-0.2 rounded-full">
                      {tip.badge}
                    </span>
                  )}
                </div>
                <h4 className="font-extrabold text-sm text-white group-hover:text-emerald-200 transition-colors">
                  {tip.title}
                </h4>
                <p className="text-xs text-emerald-100/80 leading-relaxed font-normal">
                  {tip.description}
                </p>
              </div>

              {tip.actionCall && (
                <button
                  onClick={() => handleActionClick(tip.actionCall)}
                  className="mt-3.5 pt-2.5 border-t border-emerald-800/60 flex items-center justify-between text-xs font-bold text-emerald-300 hover:text-emerald-100 transition-colors group/btn cursor-pointer"
                >
                  <span>{tip.actionCall}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Community Stewardship Pledges Banner */}
        <div className="bg-emerald-900/50 border border-emerald-600/50 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-teal-300" />
            <h4 className="font-extrabold text-xs sm:text-sm text-white uppercase tracking-wider font-display">
              Zamboanga Sibugay Community Citizen Pledge
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-emerald-100">
            {footerConfig.communityPledges.map((pledge, idx) => (
              <div key={idx} className="flex items-start gap-2 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-800/40">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{pledge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: MUNICIPAL DIRECTORY, GOVERNANCE & 4-COLUMN FOOTER
      ========================================================================= */}
      <div className="bg-gradient-to-b from-[#0e5a38] via-[#09472c] to-[#04331f] text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-emerald-600/40 space-y-6">
        {/* LOGO IN THE MIDDLE (CENTERED) BEFORE THE COLUMNS */}
        <div className="flex flex-col items-center justify-center text-center space-y-2.5 pb-5 border-b border-emerald-700/60">
          {/* Centered Logo Emblem (Full, No Framing) */}
          <div className="flex items-center justify-center">
            {footerConfig.logoUrl && footerConfig.logoUrl.trim() !== '' ? (
              <img
                src={footerConfig.logoUrl}
                alt="Municipal Logo"
                className="h-14 w-auto object-contain"
              />
            ) : (
              <span className="text-3xl filter drop-shadow-sm select-none">🌍</span>
            )}
          </div>

          {/* Centered Brand Title & Subtitle */}
          <div>
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              <h3 className="font-extrabold text-lg sm:text-xl font-display text-white tracking-tight">
                {footerConfig.portalName}
              </h3>
              <span className="bg-emerald-500/20 text-emerald-200 border border-emerald-400/40 text-[9.5px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Official LGU
              </span>
            </div>
            <p className="text-xs text-emerald-200/90 font-medium mt-0.5">
              {footerConfig.portalSubtitle}
            </p>
          </div>

          {/* Centered Mission Narrative */}
          <p className="text-xs text-emerald-100/90 leading-relaxed max-w-2xl mx-auto font-normal">
            {footerConfig.missionNarrative}
          </p>

          {/* Trust Badges Centered Before the Columns */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <div className="flex items-center gap-1.5 bg-emerald-950/70 border border-emerald-600/50 rounded-full px-3 py-1 text-[11px] font-semibold text-emerald-200">
              <Lock className="w-3 h-3 text-emerald-300" />
              <span>{footerConfig.whistleblowerTagline}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-950/70 border border-emerald-600/50 rounded-full px-3 py-1 text-[11px] font-semibold text-emerald-200">
              <Building className="w-3 h-3 text-emerald-300" />
              <span>{footerConfig.coordinationTagline}</span>
            </div>
          </div>
        </div>

        {/* 4 COLUMNS RESPONSIVE LAYOUT */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 pt-1">
          {/* COLUMN 1: Citizen Navigation */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 pb-1 border-b border-emerald-700/50">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <h4 className="font-extrabold text-xs sm:text-sm text-white uppercase tracking-wider font-display">
                Citizen Portal
              </h4>
            </div>

            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="flex items-center gap-1.5 text-emerald-100/90 hover:text-white hover:translate-x-0.5 transition-all text-left w-full group cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-emerald-400 group-hover:text-emerald-200 flex-shrink-0" />
                  <span className="truncate">Dashboard Overview</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenReportModal}
                  className="flex items-center gap-1.5 text-emerald-300 font-bold hover:text-white hover:translate-x-0.5 transition-all text-left w-full group cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-emerald-400 group-hover:text-emerald-200 flex-shrink-0" />
                  <span className="truncate">Report Incident</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tracker')}
                  className="flex items-center gap-1.5 text-emerald-100/90 hover:text-white hover:translate-x-0.5 transition-all text-left w-full group cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-emerald-400 group-hover:text-emerald-200 flex-shrink-0" />
                  <span className="truncate">Incident Tracker</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('map')}
                  className="flex items-center gap-1.5 text-emerald-100/90 hover:text-white hover:translate-x-0.5 transition-all text-left w-full group cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-emerald-400 group-hover:text-emerald-200 flex-shrink-0" />
                  <span className="truncate">GIS Hotspot Map</span>
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 2: Climate Resources & Tools */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 pb-1 border-b border-emerald-700/50">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              <h4 className="font-extrabold text-xs sm:text-sm text-white uppercase tracking-wider font-display">
                Eco Resources
              </h4>
            </div>

            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('calculator')}
                  className="flex items-center gap-1.5 text-emerald-100/90 hover:text-white hover:translate-x-0.5 transition-all text-left w-full group cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-teal-400 group-hover:text-teal-200 flex-shrink-0" />
                  <span className="truncate">Carbon Footprint Audit</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('forum')}
                  className="flex items-center gap-1.5 text-emerald-100/90 hover:text-white hover:translate-x-0.5 transition-all text-left w-full group cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-teal-400 group-hover:text-teal-200 flex-shrink-0" />
                  <span className="truncate">Community Forum</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('activities')}
                  className="flex items-center gap-1.5 text-emerald-100/90 hover:text-white hover:translate-x-0.5 transition-all text-left w-full group cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-teal-400 group-hover:text-teal-200 flex-shrink-0" />
                  <span className="truncate">Volunteer Drives</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('knowledge')}
                  className="flex items-center gap-1.5 text-emerald-100/90 hover:text-white hover:translate-x-0.5 transition-all text-left w-full group cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-teal-400 group-hover:text-teal-200 flex-shrink-0" />
                  <span className="truncate">Knowledge Hub</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('alerts')}
                  className="flex items-center gap-1.5 text-emerald-100/90 hover:text-white hover:translate-x-0.5 transition-all text-left w-full group cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-teal-400 group-hover:text-teal-200 flex-shrink-0" />
                  <span className="truncate">Alerts & Bulletins</span>
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: Emergency Hotlines */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 pb-1 border-b border-emerald-700/50">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <h4 className="font-extrabold text-xs sm:text-sm text-white uppercase tracking-wider font-display">
                Emergency Hotlines
              </h4>
            </div>

            <div className="space-y-2">
              {displayHotlines.map((hotline) => (
                <div key={hotline.id} className="bg-emerald-950/70 border border-emerald-700/60 rounded-xl p-2.5">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-emerald-200 font-medium truncate">{hotline.agencyName}</span>
                    <span className="text-[9px] font-bold text-amber-300 bg-amber-950/80 border border-amber-500/40 px-1.5 py-0.2 rounded-full">
                      {hotline.hours}
                    </span>
                  </div>
                  <a
                    href={`tel:${hotline.number}`}
                    className="flex items-center gap-1.5 font-mono font-bold text-emerald-300 text-xs hover:text-white transition-colors"
                  >
                    <PhoneCall className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    <span>{hotline.number}</span>
                  </a>
                  {hotline.description && (
                    <p className="text-[10px] text-emerald-300/80 truncate mt-0.5">
                      {hotline.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* COLUMN 4: Governance & Whistleblower Encryption */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 pb-1 border-b border-emerald-700/50">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <h4 className="font-extrabold text-xs sm:text-sm text-white uppercase tracking-wider font-display">
                Security & Standards
              </h4>
            </div>

            <div className="bg-emerald-950/70 border border-emerald-700/60 rounded-xl p-3 space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-emerald-200 font-bold">
                <Shield className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Encrypted Citizen Submissions</span>
              </div>
              <p className="text-emerald-200/80 text-[11px] leading-relaxed">
                All evidence photos and geocoordinates are sanitized with SHA-256 telemetry verification complying with DENR-EMB evidence protocols.
              </p>
            </div>

            <div className="bg-emerald-950/50 border border-emerald-800/60 rounded-xl p-2.5 space-y-1">
              <span className="font-bold text-white text-xs block">LGU Coordination</span>
              <p className="text-emerald-200/80 text-[10.5px] leading-tight">
                Synchronized with CENRO, CDRRMO, and DOST-PAGASA regional stations.
              </p>
            </div>
          </div>
        </div>

        {/* System Architect & Advisors Tagline */}
        <div className="pt-3 border-t border-emerald-700/60 text-center space-y-1">
          <p className="text-emerald-200/90 text-[11.5px] leading-relaxed font-medium">
            {footerConfig.systemArchitect}
          </p>
          {footerConfig.advisorsText && (
            <p className="text-emerald-300/80 text-[10.5px]">
              {footerConfig.advisorsText}
            </p>
          )}
        </div>
      </div>

      {/* =========================================================================
          SECTION 3: OFFICIAL BOTTOM GREEN FOOTER BANNER (ATTACHED SCREENSHOT)
      ========================================================================= */}
      <div className="bg-[#093c25] text-white p-5 rounded-3xl text-center space-y-2 shadow-lg border border-emerald-800/80">
        <p className="text-xs sm:text-sm text-emerald-100 font-semibold tracking-tight">
          {footerConfig.copyrightText}
        </p>
        <p className="text-[11px] sm:text-xs text-emerald-300/90 font-medium max-w-3xl mx-auto leading-relaxed">
          {footerConfig.complianceText}
        </p>
      </div>
    </footer>
  );
};

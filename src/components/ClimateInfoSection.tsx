import React, { useState } from 'react';
import { IMAGES } from '../assets';
import { BookOpen, ChevronRight, ExternalLink } from 'lucide-react';
import { ClimateArticleModal } from './ClimateArticleModal';

export interface ClimateTopic {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  category: string;
  readTime: string;
  summary: string;
  ordinance: string;
  actionItems: string[];
}

export const CLIMATE_TOPICS: ClimateTopic[] = [
  {
    id: 'vulnerability',
    title: 'Climate Vulnerability',
    subtitle: 'Understanding the risks for a safer future.',
    image: IMAGES.climateVulnerability,
    category: 'Risk Mitigation',
    readTime: '3 min read',
    summary: 'Zamboanga Sibugay and coastal river basins experience heightened monsoonal storm surges and localized heat index spikes. Assessing local topography allows communities to map safe zones.',
    ordinance: 'Municipal Disaster Risk Reduction & Management Code #2026-04',
    actionItems: [
      'Locate your nearest designated barangay evacuation center before storm warnings.',
      'Check local drainage outlets within 50 meters of your residence.',
      'Monitor real-time PAGASA advisories on the Citizen Portal dashboard.',
    ],
  },
  {
    id: 'flood',
    title: 'Flood Preparedness',
    subtitle: 'Be prepared, stay safe and protect waterways.',
    image: IMAGES.floodPreparedness,
    category: 'Civil Defense',
    readTime: '4 min read',
    summary: 'Flash flooding during low-pressure systems can elevate water levels in less than 45 minutes. Early reporting of choked culverts prevents structural backflooding.',
    ordinance: 'Clean Drainage & Waterway Protection Ordinance #2025-18',
    actionItems: [
      'Elevate household electrical panels and appliances at least 1 meter above road grade.',
      'Never dump construction debris or bags into roadside canals.',
      'Report blocked culverts immediately via the Citizen Report tool.',
    ],
  },
  {
    id: 'forest',
    title: 'Forest Protection',
    subtitle: 'Healthy forests, healthier tomorrow and stable slopes.',
    image: IMAGES.forestProtection,
    category: 'Conservation',
    readTime: '4 min read',
    summary: 'Endemic tree roots retain up to 70% of mountain precipitation, preventing severe mudslides and replenishing municipal drinking aquifers.',
    ordinance: 'Philippine Forestry Reform Act & LGU Tree Protection Bylaw',
    actionItems: [
      'Join upcoming community tree planting drives along riverbank buffer zones.',
      'Report illegal timber cutting and unauthorized charcoal burning in upland ridges.',
      'Support endemic species: Narra, Molave, and native bamboo varieties.',
    ],
  },
  {
    id: 'waste',
    title: 'Solid Waste Management',
    subtitle: 'Reduce • Reuse • Recycle with RA 9003 compliance.',
    image: IMAGES.wasteManagement,
    category: 'Ecological Health',
    readTime: '5 min read',
    summary: 'Republic Act 9003 mandates source segregation into biodegradable, recyclable, residual, and special hazardous waste. Unsegregated garbage will not be collected.',
    ordinance: 'Ecological Solid Waste Management Act of 2000 (RA 9003)',
    actionItems: [
      'Implement color-coded household bins: Green for organics, Blue for dry paper/plastic recyclables.',
      'Maintain backyard or community Bokashi/vermicompost for food leftovers.',
      'Refuse single-use plastics during wet market shopping.',
    ],
  },
  {
    id: 'water',
    title: 'Water Resource Protection',
    subtitle: 'Clean water, healthy communities and stream protection.',
    image: IMAGES.gisSatelliteView,
    category: 'Water Security',
    readTime: '3 min read',
    summary: 'Protecting our coastal mangrove belts and mountain headwaters guarantees clean water access for downstream fisherfolk and farming cooperatives.',
    ordinance: 'Philippine Clean Water Act of 2004 (RA 9275)',
    actionItems: [
      'Install grease traps in household kitchen sinks to prevent oil discharge into public canals.',
      'Harvest non-potable rainwater for outdoor cleaning and plant irrigation.',
      'Participate in the monthly "Sihig" Coastal Cleanup volunteer events.',
    ],
  },
  {
    id: 'energy',
    title: 'Energy Efficiency',
    subtitle: 'Small actions, big impact for low-carbon living.',
    image: IMAGES.forestProtection,
    category: 'Clean Energy',
    readTime: '3 min read',
    summary: 'Shifting to LED lighting, maintaining inverter appliances, and adopting solar offset panels slashes both household electricity bills and fossil grid emissions.',
    ordinance: 'Energy Efficiency & Conservation Act (RA 11285)',
    actionItems: [
      'Conduct a home energy audit using the Carbon Footprint Tool.',
      'Unplug phantom chargers and electronics during peak daytime hours.',
      'Explore barangay net-metering solar grants with the local CENRO office.',
    ],
  },
];

interface ClimateInfoSectionProps {
  topics?: ClimateTopic[];
}

export const ClimateInfoSection: React.FC<ClimateInfoSectionProps> = ({ topics }) => {
  const activeTopics = topics && topics.length > 0 ? topics : CLIMATE_TOPICS;
  const [selectedTopic, setSelectedTopic] = useState<ClimateTopic | null>(null);

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-700" />
          <h2 className="font-extrabold text-slate-900 text-sm tracking-tight uppercase font-display">
            Climate Information
          </h2>
        </div>
        <button
          onClick={() => setSelectedTopic(activeTopics[0])}
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5 cursor-pointer"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Cards List */}
      <div className="space-y-3.5">
        {activeTopics.map((topic, idx) => (
          <div
            key={topic.id}
            onClick={() => setSelectedTopic(topic)}
            style={{ animationDelay: `${idx * 60}ms` }}
            className="rounded-2xl border border-slate-200 overflow-hidden hover:border-emerald-500 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group bg-slate-50/50 animate-card-entrance"
          >
            {/* Image Container with Fallback */}
            <div className="relative h-36 w-full bg-emerald-950 overflow-hidden">
              <img
                src={topic.image}
                alt={topic.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  // Fallback container
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white text-[11px] font-medium">
                <span className="bg-emerald-900/80 backdrop-blur-xs px-2 py-0.5 rounded-md font-bold text-emerald-200">
                  {topic.category}
                </span>
                <span>{topic.readTime}</span>
              </div>
            </div>

            {/* Content text */}
            <div className="p-3.5 bg-white">
              <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                {topic.title}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                {topic.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal viewer */}
      {selectedTopic && (
        <ClimateArticleModal
          topic={selectedTopic}
          onClose={() => setSelectedTopic(null)}
        />
      )}
    </div>
  );
};

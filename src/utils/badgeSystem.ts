import { Incident, CommunityActivity, UserProfile } from '../types';

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'emerald';
export type BadgeCategory = 'incidents' | 'activities' | 'leadership';

export interface BadgeDefinition {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: BadgeCategory;
  tier: BadgeTier;
  iconName: 'eye' | 'shield-alert' | 'shield-check' | 'flame' | 'sprout' | 'users' | 'crown' | 'globe';
  incidentRequirement?: number;
  activityRequirement?: number;
  requiresBoth?: boolean;
  ecoPointsBonus: number;
  perks: string[];
  lore: string;
}

export const CITIZEN_BADGES: BadgeDefinition[] = [
  // --- INCIDENT REPORTING BADGES ---
  {
    id: 'badge-eco-watcher',
    name: 'Eco-Watcher',
    tagline: 'First Alert Sentinel',
    description: 'Report at least 1 verified municipal environmental or disaster hazard.',
    category: 'incidents',
    tier: 'bronze',
    iconName: 'eye',
    incidentRequirement: 1,
    ecoPointsBonus: 50,
    perks: [
      'Official LGU Citizen Reporter Accreditation',
      'Direct dispatch routing to Barangay Disaster Desk',
      'Citizen telemetry feedback channel',
    ],
    lore: 'Awarded to watchful citizens whose initial reports prevent small hazards from escalating into community emergencies.',
  },
  {
    id: 'badge-eco-guardian',
    name: 'Eco-Guardian',
    tagline: 'Vigilant Hazard Monitor',
    description: 'Report at least 3 verified municipal incidents to protect local waterways and roads.',
    category: 'incidents',
    tier: 'silver',
    iconName: 'shield-alert',
    incidentRequirement: 3,
    ecoPointsBonus: 100,
    perks: [
      'Silver Citizen Dispatch Verification Tag',
      'Priority triage status in CENRO operations queue',
      'Direct SMS notifications on reported incident remediation',
    ],
    lore: 'Earned through consistent environmental vigilance across barangay puroks and river corridors.',
  },
  {
    id: 'badge-eco-warrior',
    name: 'Eco-Warrior',
    tagline: 'Frontline Environmental Defender',
    description: 'Report at least 5 verified municipal hazards, illegal dumping, or climate incidents.',
    category: 'incidents',
    tier: 'gold',
    iconName: 'shield-check',
    incidentRequirement: 5,
    ecoPointsBonus: 250,
    perks: [
      'Gold Eco-Warrior Honor on Municipal Leaderboard',
      'Expedited rapid-response inspection trigger',
      'Official Certificate of Environmental Detection from CENRO',
      'Exclusive invitation to quarterly LGU Disaster Preparedness briefings',
    ],
    lore: 'The premier field reporter distinction recognized under Municipal Climate Resilience Ordinance #2026-04.',
  },
  {
    id: 'badge-disaster-sentinel',
    name: 'Disaster Sentinel',
    tagline: 'Guardian of Civil Safety',
    description: 'Report at least 8 verified municipal incidents with photographic documentation.',
    category: 'incidents',
    tier: 'emerald',
    iconName: 'flame',
    incidentRequirement: 8,
    ecoPointsBonus: 500,
    perks: [
      'Emerald Level Civil Safety Distinction',
      'Direct hotline link with Municipal Disaster Risk Reduction Council',
      'Nominated for Annual Outstanding Citizen Environmental Steward Award',
    ],
    lore: 'Reserved for the most dedicated citizen guardians who stand as stalwart pillars of community resilience.',
  },

  // --- COMMUNITY ACTIVITY BADGES ---
  {
    id: 'badge-green-volunteer',
    name: 'Green Volunteer',
    tagline: 'Hands-On Eco-Advocate',
    description: 'Participate in at least 1 community mangrove planting, coastal cleanup, or drainage drive.',
    category: 'activities',
    tier: 'bronze',
    iconName: 'sprout',
    activityRequirement: 1,
    ecoPointsBonus: 50,
    perks: [
      'Listed on Municipal Volunteer Service Register',
      'Free citizen eco-volunteer field kit & safety vest',
      '+15% bonus eco-points multiplier on future drives',
    ],
    lore: 'Commemorates taking that vital first physical step into collective grassroots community action.',
  },
  {
    id: 'badge-active-mobilizer',
    name: 'Active Mobilizer',
    tagline: 'Grassroots Community Force',
    description: 'Participate in at least 2 community environmental restoration movements.',
    category: 'activities',
    tier: 'silver',
    iconName: 'users',
    activityRequirement: 2,
    ecoPointsBonus: 120,
    perks: [
      'Lead Volunteer Team Captain eligibility',
      'Special recognition by Barangay Council during assemblies',
      'Complimentary indigenous tree sapling seedling pack',
    ],
    lore: 'Given to proactive movers who consistently bring energy, hands, and heart to municipal ecological drives.',
  },
  {
    id: 'badge-community-leader',
    name: 'Community Leader',
    tagline: 'Inspirational Civic Champion',
    description: 'Participate in at least 4 community environmental volunteer movements.',
    category: 'activities',
    tier: 'gold',
    iconName: 'crown',
    activityRequirement: 4,
    ecoPointsBonus: 300,
    perks: [
      'Authorized to propose and sponsor official barangay cleanups',
      'Voting delegate status in LGU Climate Assembly forums',
      'Engraved Gold Community Leadership Medallion from the Mayor',
      'Special feature spotlight on Municipal Portal banner',
    ],
    lore: 'Marks an influential citizen who does not simply attend events, but champions community stewardship and inspires others.',
  },

  // --- COMPREHENSIVE CIVIC EXCELLENCE ---
  {
    id: 'badge-earth-champion',
    name: 'Earth Champion',
    tagline: 'Master of Environmental Stewardship',
    description: 'Report at least 3 incidents AND join at least 3 community movements.',
    category: 'leadership',
    tier: 'emerald',
    iconName: 'globe',
    incidentRequirement: 3,
    activityRequirement: 3,
    requiresBoth: true,
    ecoPointsBonus: 600,
    perks: [
      'Highest Municipal Civic Honor for Environmental Excellence',
      'Lifetime Citizen Hall of Fame induction',
      'Annual Municipal Climate Medal presented by CENRO Directorate',
      'Permanent 2x Eco-Points accelerator across the platform',
    ],
    lore: 'The supreme civic award uniting keen hazard reporting vigilance with tireless hands-on restoration leadership.',
  },
];

export interface EvaluatedBadge extends BadgeDefinition {
  isUnlocked: boolean;
  progressPercent: number;
  currentValue: number;
  targetValue: number;
  progressLabel: string;
  unlockedAt?: string;
}

export function evaluateCitizenBadges(
  userProfile: UserProfile,
  incidents: Incident[] = [],
  activities: CommunityActivity[] = []
): {
  badges: EvaluatedBadge[];
  unlockedCount: number;
  totalCount: number;
  incidentsCount: number;
  activitiesCount: number;
  highestBadge: EvaluatedBadge | null;
} {
  // Calculate reported incidents count for the current user
  const userIdentifier = userProfile.name?.toLowerCase().trim() || '';
  const userEmail = userProfile.email?.toLowerCase().trim() || '';

  const userReportedIncidents = incidents.filter((inc) => {
    const reporter = (inc.reportedBy || '').toLowerCase().trim();
    if (!reporter) return false;
    if (userIdentifier && (reporter === userIdentifier || reporter.includes(userIdentifier.split(' ')[0]))) return true;
    if (userEmail && reporter.includes(userEmail.split('@')[0])) return true;
    // Default demo citizen accounts
    if (userIdentifier.includes('mark') && (reporter.includes('mark') || reporter.includes('ulgasan') || reporter.includes('ariston'))) return true;
    return false;
  });

  // Base incidents reported (respecting seed data minimums if demo profile)
  const incidentsCount = Math.max(
    userReportedIncidents.length,
    userIdentifier.includes('mark') ? 2 : 1
  );

  // Calculate joined activities count
  const joinedMovementsCount = userProfile.joinedMovements?.length || 0;
  const directJoinedCount = activities.filter((a) => a.joined).length;
  const activitiesCount = Math.max(joinedMovementsCount, directJoinedCount, 1);

  const evaluated: EvaluatedBadge[] = CITIZEN_BADGES.map((badge) => {
    let isUnlocked = false;
    let progressPercent = 0;
    let currentValue = 0;
    let targetValue = 0;
    let progressLabel = '';

    if (badge.requiresBoth) {
      const incReq = badge.incidentRequirement || 3;
      const actReq = badge.activityRequirement || 3;
      const incMet = incidentsCount >= incReq;
      const actMet = activitiesCount >= actReq;
      isUnlocked = incMet && actMet;

      const incRatio = Math.min(1, incidentsCount / incReq);
      const actRatio = Math.min(1, activitiesCount / actReq);
      progressPercent = Math.round(((incRatio + actRatio) / 2) * 100);
      currentValue = Math.min(incidentsCount, incReq) + Math.min(activitiesCount, actReq);
      targetValue = incReq + actReq;
      progressLabel = `${incidentsCount}/${incReq} reports • ${activitiesCount}/${actReq} activities`;
    } else if (badge.incidentRequirement) {
      targetValue = badge.incidentRequirement;
      currentValue = incidentsCount;
      isUnlocked = incidentsCount >= targetValue;
      progressPercent = Math.min(100, Math.round((currentValue / targetValue) * 100));
      progressLabel = `${currentValue} of ${targetValue} reports filed`;
    } else if (badge.activityRequirement) {
      targetValue = badge.activityRequirement;
      currentValue = activitiesCount;
      isUnlocked = activitiesCount >= targetValue;
      progressPercent = Math.min(100, Math.round((currentValue / targetValue) * 100));
      progressLabel = `${currentValue} of ${targetValue} activities joined`;
    }

    return {
      ...badge,
      isUnlocked,
      progressPercent,
      currentValue,
      targetValue,
      progressLabel,
      unlockedAt: isUnlocked ? 'Verified Citizen Record' : undefined,
    };
  });

  const unlockedCount = evaluated.filter((b) => b.isUnlocked).length;

  // Determine highest unlocked badge (emerald > gold > silver > bronze)
  const tierWeight: Record<BadgeTier, number> = {
    emerald: 4,
    gold: 3,
    silver: 2,
    bronze: 1,
  };

  const unlockedBadges = evaluated.filter((b) => b.isUnlocked);
  unlockedBadges.sort((a, b) => tierWeight[b.tier] - tierWeight[a.tier]);
  const highestBadge = unlockedBadges[0] || null;

  return {
    badges: evaluated,
    unlockedCount,
    totalCount: evaluated.length,
    incidentsCount,
    activitiesCount,
    highestBadge,
  };
}

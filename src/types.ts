export type IncidentCategory = 
  | 'flooding' 
  | 'dumping' 
  | 'water_pollution' 
  | 'deforestation' 
  | 'air_hazard' 
  | 'other';

export type IncidentStatus = 
  | 'Pending Review' 
  | 'In Triage' 
  | 'Dispatched' 
  | 'Remediated';

export type IncidentSeverity = 'Critical' | 'High' | 'Moderate' | 'Low';

export interface Incident {
  id: string;
  ticketNumber: string;
  type: string;
  category: IncidentCategory;
  title: string;
  location: string;
  barangay: string;
  coordinates: { lat: number; lng: number };
  status: IncidentStatus;
  severity: IncidentSeverity;
  reportedDate: string;
  reportedBy: string;
  description: string;
  imageUrl?: string;
  remediationNote?: string;
  remediationDate?: string;
  assignedUnit?: string;
  isOfflinePending?: boolean;
  offlineQueuedAt?: string;
}

export interface TelemetryData {
  temp: number;
  feelsLike: number;
  condition: string;
  heatIndex: { value: number; status: string };
  airQuality: { aqi: number; status: string };
  rainRisk: { value: number; status: string };
  windSpeed: string;
  humidity: string;
  uvIndex: string;
  lastUpdated: string;
  pagasaAlert: {
    level: string;
    badge: string;
    title: string;
    advisory: string;
    active: boolean;
  };
  hourlyTrend: Array<{ time: string; temp: number; heatIndex: number }>;
}

export interface ForumComment {
  id: string;
  author: string;
  authorAvatar?: string;
  authorBadge?: string;
  text: string;
  timestamp: string;
}

export interface ForumPost {
  id: string;
  author: string;
  authorRole: string;
  barangay: string;
  title: string;
  content: string;
  category: string;
  upvotes: number;
  upvotedByUser: boolean;
  comments: ForumComment[];
  createdAt: string;
  tags: string[];
}

export interface CommunityActivity {
  id: string;
  title: string;
  description: string;
  location: string;
  barangay: string;
  date: string;
  time: string;
  volunteerCount: number;
  maxVolunteers: number;
  joined: boolean;
  ecoPointsReward: number;
  organizer: string;
  category: string;
}

export interface ActivityProof {
  id: string;
  activityId?: string;
  citizenName: string;
  citizenEmail?: string;
  citizenPhone?: string;
  citizenBarangay?: string;
  citizenAvatar?: string;
  activityTitle: string;
  activityCategory?: string;
  description: string;
  photoUrl: string;
  submittedDate: string;
  ecoPointsReward: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  adminFeedback?: string;
  hoursSpent?: number;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  barangay: string;
  city: string;
  address: string;
  bio: string;
  emergencyContact: {
    name: string;
    phone: string;
  };
  isVerified: boolean;
  kycNumber: string;
  ecoPoints: number;
  rank: string;
  level: string;
  reportingAuthorized: boolean;
  avatarUrl?: string;
  joinedMovements: Array<{
    id: string;
    activityId?: string;
    activityTitle: string;
    activityCategory?: string;
    date: string;
    status: 'Verified' | 'Pending Review' | 'Rejected';
    pointsAwarded: number;
    proofPhoto?: string;
    description?: string;
    submittedDate?: string;
    adminFeedback?: string;
  }>;
}

export interface CarbonAuditResult {
  totalKgCO2e: number;
  nationalAvgKgCO2e: number;
  breakdown: {
    electricity: number;
    transport: number;
    diet: number;
    lpg: number;
    waste: number;
  };
  treesNeeded: number;
  comparisonPercentage: number;
  recommendations: string[];
  ecoPointsAwarded: number;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface DayForecast {
  dayName: string;
  date: string;
  condition: string;
  tempHigh: number;
  tempLow: number;
  rainRisk: number;
  heatIndex: number;
  wind: string;
  summary: string;
  advisoryLevel?: 'Normal' | 'Yellow Alert' | 'Orange Alert';
}

export interface WeatherForecastResponse {
  location: string;
  synopticSummary: string;
  days: DayForecast[];
  groundingSources: GroundingSource[];
  lastUpdated: string;
  isLiveGrounded: boolean;
  isQuotaLimited?: boolean;
}

export interface MunicipalHotline {
  id: string;
  agencyName: string;
  number: string;
  hours: string;
  category: 'Disaster Rescue' | 'Environmental Crime' | 'Medical & EMS' | 'Police & Peacekeeping' | 'Marine Patrol';
  priority: 'Emergency' | 'Standard Desk';
  description?: string;
}

export interface SubAdminPermissions {
  canManageIncidents: boolean;
  canManageActivities: boolean;
  canManageHotlines: boolean;
  canManageClimateInfo: boolean;
  canManageNews: boolean;
  canManageKYC: boolean;
  canManageUsers: boolean;
  canManageSubAdmins: boolean;
}

export interface SubAdminAccount {
  id: string;
  staffId: string;
  name: string;
  email: string;
  department: string;
  role: string;
  jurisdiction: string;
  status: 'Active (On Duty)' | 'Off Duty' | 'Suspended';
  permissions: SubAdminPermissions;
  lastActive: string;
}

export interface NewsUpdate {
  id: string;
  title: string;
  category: 'Press Release' | 'Municipal Ordinance' | 'Eco Alert' | 'Notice' | 'Project Milestone';
  summary: string;
  content: string;
  date: string;
  priority: 'Breaking' | 'Featured' | 'Standard';
  pinned: boolean;
  author: string;
}

export interface ClimateTipItem {
  id: string;
  category: 'Climate Awareness' | 'Action & Tips' | 'Community Involvement' | 'Legal & Ordinance';
  title: string;
  description: string;
  actionCall?: string;
  badge?: string;
}

export interface FooterConfig {
  logoUrl?: string;
  portalName: string;
  portalSubtitle: string;
  municipality: string;
  missionNarrative: string;
  copyrightText: string;
  complianceText: string;
  systemArchitect: string;
  advisorsText: string;
  whistleblowerTagline: string;
  coordinationTagline: string;
  climateTips: ClimateTipItem[];
  communityPledges: string[];
}



/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { apiService } from './services/api';
import {
  Incident,
  TelemetryData,
  ForumPost,
  CommunityActivity,
  UserProfile,
  MunicipalHotline,
  SubAdminAccount,
  NewsUpdate,
  FooterConfig,
  ActivityProof,
} from './types';

// Components
import { TopHeader } from './components/TopHeader';
import { NavigationDrawer } from './components/NavigationDrawer';
import { BottomNavBar } from './components/BottomNavBar';
import { NotificationsModal } from './components/NotificationsModal';
import { ClimateStatusCard } from './components/ClimateStatusCard';
import { CitizenActivitySummary } from './components/CitizenActivitySummary';
import { IncidentReportModal } from './components/IncidentReportModal';
import { IncidentTrackerView } from './components/IncidentTrackerView';
import { IncidentDetailsModal } from './components/IncidentDetailsModal';
import { GISMapSection } from './components/GISMapSection';
import { ClimateInfoSection, CLIMATE_TOPICS, ClimateTopic } from './components/ClimateInfoSection';
import { ResponseProtocolCard } from './components/ResponseProtocolCard';
import { CommunityActivitiesSection } from './components/CommunityActivitiesSection';
import { CommunityForumView } from './components/CommunityForumView';
import { CarbonCalculatorView } from './components/CarbonCalculatorView';
import { CitizenProfileView } from './components/CitizenProfileView';
import { JoinMovementProofModal } from './components/JoinMovementProofModal';
import { MunicipalFooter, DEFAULT_FOOTER_CONFIG } from './components/MunicipalFooter';
import { GroundedWeatherForecastCard } from './components/GroundedWeatherForecastCard';
import { CMSAdminDashboard } from './components/CMSAdminDashboard';
import { UserAuthModal } from './components/UserAuthModal';
import { LandingHeroView } from './components/LandingHeroView';
import { AnimatedBackground } from './components/AnimatedBackground';
import { updateFavicon } from './utils/favicon';
import { useOnlineStatus } from './utils/useOnlineStatus';
import { syncOfflineIncidents } from './utils/offlineStorage';
import { OfflineSyncBanner } from './components/OfflineSyncBanner';
import { auth } from './lib/firebase';
import {
  saveUserProfileToFirestore,
  getUserProfileFromFirestore,
  saveIncidentToFirestore,
  subscribeIncidents,
  saveActivityToFirestore,
  deleteActivityFromFirestore,
  subscribeActivities,
  saveNewsToFirestore,
  deleteNewsFromFirestore,
  subscribeNews,
  saveHotlineToFirestore,
  deleteHotlineFromFirestore,
  subscribeHotlines,
  saveClimateTopicToFirestore,
  deleteClimateTopicFromFirestore,
  subscribeClimateTopics,
  saveProofToFirestore,
  subscribeProofs,
  updateProofStatusInFirestore,
  saveFooterConfigToFirestore,
  subscribeFooterConfig,
  saveSubAdminToFirestore,
  deleteSubAdminFromFirestore,
  subscribeSubAdmins,
} from './lib/firestoreService';

import {
  Plus,
  ChevronRight,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [initialReportCategory, setInitialReportCategory] = useState<string | undefined>();
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isRefreshingTelemetry, setIsRefreshingTelemetry] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isSyncingOfflineReports, setIsSyncingOfflineReports] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  // Online / Offline Connectivity & Sync Hook
  const { isOnline, pendingOfflineCount, refreshPendingCount } = useOnlineStatus();

  // Core Data States
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    temp: 32,
    feelsLike: 36,
    condition: 'Partly Cloudy & Humid',
    heatIndex: { value: 36, status: 'Normal (Safe)' },
    airQuality: { aqi: 42, status: 'Good' },
    rainRisk: { value: 15, status: 'Low Risk' },
    windSpeed: '12 km/h NE',
    humidity: '78%',
    uvIndex: '6 Moderate',
    lastUpdated: 'Just now',
    pagasaAlert: {
      level: 'Normal',
      badge: 'Normal Operations',
      title: 'No Severe Weather Advisory',
      advisory: 'Municipal weather telemetry normal.',
      active: false,
    },
    hourlyTrend: [
      { time: '6 AM', temp: 26, heatIndex: 28 },
      { time: '9 AM', temp: 30, heatIndex: 34 },
      { time: '12 PM', temp: 33, heatIndex: 38 },
      { time: '3 PM', temp: 32, heatIndex: 36 },
      { time: '6 PM', temp: 29, heatIndex: 32 },
    ],
  });
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [activities, setActivities] = useState<CommunityActivity[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activityProofs, setActivityProofs] = useState<ActivityProof[]>([]);
  const [selectedActivityForProof, setSelectedActivityForProof] = useState<CommunityActivity | null>(null);
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [movementToast, setMovementToast] = useState<string | null>(null);
  const [trackerInitialFilter, setTrackerInitialFilter] = useState('all');
  const [footerConfig, setFooterConfig] = useState<FooterConfig>(() => {
    try {
      const cached = localStorage.getItem('portal_branding_footer_config');
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (_) {}
    return DEFAULT_FOOTER_CONFIG;
  });

  // Municipal Data States (Managed by CMS Admin Dashboard)
  const [hotlines, setHotlines] = useState<MunicipalHotline[]>([
    {
      id: 'hotline-1',
      agencyName: 'Municipal Disaster Rescue (CDRRMO)',
      number: '09765544554',
      hours: '24/7 Rapid Response',
      category: 'Disaster Rescue',
      priority: 'Emergency',
      description: 'Flash flooding, landslide extraction, and swiftwater rescue units.',
    },
    {
      id: 'hotline-2',
      agencyName: 'CENRO Environmental Hotline',
      number: '(062) 925-1100',
      hours: 'Mon-Fri 8:00 AM - 5:00 PM',
      category: 'Environmental Crime',
      priority: 'Standard Desk',
      description: 'cenro.metroverde@lgu.gov.ph',
    },
    {
      id: 'hotline-3',
      agencyName: 'Emergency Police Dispatch',
      number: '911',
      hours: '24/7 Operations',
      category: 'Police & Peacekeeping',
      priority: 'Emergency',
      description: 'Illegal logging interceptions and environmental violator arrests.',
    },
  ]);

  const [newsUpdates, setNewsUpdates] = useState<NewsUpdate[]>([
    {
      id: 'news-1',
      title: 'Mandatory Rainwater Catchment in Commercial Establishments',
      category: 'Municipal Ordinance',
      summary: 'All buildings with roof areas exceeding 150 sq.m are required to install functional catchment drums.',
      content: 'Under Municipal Ordinance #2026-04, establishments must retain stormwater runoff to alleviate flash flooding in low-lying puroks during torrential downpours.',
      date: '2026-10-04',
      priority: 'Breaking',
      pinned: true,
      author: 'City Council Environment Committee',
    },
    {
      id: 'news-2',
      title: 'CENRO Deploys 4 New Water Quality Telemetry Buoys in Coastal Zone',
      category: 'Project Milestone',
      summary: 'Autonomous solar-powered water sensors now monitor dissolved oxygen and salinity in Sibugay waters.',
      content: 'In collaboration with DOST, four marine monitoring stations are broadcasting real-time water data to alert local fisherfolk of hypoxic plumes.',
      date: '2026-10-02',
      priority: 'Featured',
      pinned: false,
      author: 'CENRO Aquatic Taskforce',
    },
  ]);

  const [climateTopics, setClimateTopics] = useState<ClimateTopic[]>(CLIMATE_TOPICS);

  const [subAdmins, setSubAdmins] = useState<SubAdminAccount[]>(() => {
    try {
      const cached = localStorage.getItem('portal_subadmins_cache');
      if (cached) return JSON.parse(cached);
    } catch (_) {}
    return [
      {
        id: 'sa-1',
        staffId: 'CENRO-SUB-101',
        name: 'Engr. Teresa Ramos',
        email: 'teresa.ramos@cenro.metroverde.gov.ph',
        department: 'CENRO Environmental Division',
        role: 'Environmental Compliance Officer',
        jurisdiction: 'Central & Sanito',
        status: 'Active (On Duty)',
        permissions: {
          canManageIncidents: true,
          canManageActivities: true,
          canManageHotlines: true,
          canManageClimateInfo: true,
          canManageNews: true,
          canManageKYC: true,
          canManageUsers: true,
          canManageSubAdmins: true,
        },
        lastActive: 'Just now',
      },
      {
        id: 'sa-2',
        staffId: 'CDRRMO-SUB-204',
        name: 'Capt. Juanito Veloso',
        email: 'juanito.veloso@cdrrmo.gov.ph',
        department: 'CDRRMO Rapid Disaster Response',
        role: 'Triage & Dispatch Officer',
        jurisdiction: 'Poblacion Coastal Zone',
        status: 'Active (On Duty)',
        permissions: {
          canManageIncidents: true,
          canManageActivities: false,
          canManageHotlines: true,
          canManageClimateInfo: false,
          canManageNews: true,
          canManageKYC: false,
          canManageUsers: false,
          canManageSubAdmins: false,
        },
        lastActive: '25 mins ago',
      },
      {
        id: 'sa-3',
        staffId: 'WARDEN-SUB-309',
        name: 'Bgy. Capt. Melchor Dizon',
        email: 'melchor.dizon@barangay.gov.ph',
        department: 'Barangay Eco-Warden Liaison',
        role: 'Field Environmental Inspector',
        jurisdiction: 'Baluran & Watershed Buffer',
        status: 'Active (On Duty)',
        permissions: {
          canManageIncidents: true,
          canManageActivities: true,
          canManageHotlines: false,
          canManageClimateInfo: false,
          canManageNews: false,
          canManageKYC: false,
          canManageUsers: false,
          canManageSubAdmins: false,
        },
        lastActive: '1 hour ago',
      },
    ];
  });

  // Separate Access URL Hash / Query Route Listener (Admin portal isolated from public website)
  useEffect(() => {
    const checkAdminRoute = () => {
      const hash = window.location.hash.toLowerCase();
      const pathname = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (
        hash === '#admin' ||
        hash === '#staff' ||
        hash === '#cms' ||
        hash === '#portal-admin' ||
        pathname.startsWith('/admin') ||
        search.includes('mode=admin') ||
        search.includes('admin=true')
      ) {
        setIsAdminMode(true);
      } else {
        setIsAdminMode(false);
      }
    };
    checkAdminRoute();
    window.addEventListener('hashchange', checkAdminRoute);
    window.addEventListener('popstate', checkAdminRoute);
    return () => {
      window.removeEventListener('hashchange', checkAdminRoute);
      window.removeEventListener('popstate', checkAdminRoute);
    };
  }, []);

  // Automatic Favicon Synchronization Effect
  useEffect(() => {
    updateFavicon(footerConfig.logoUrl);
  }, [footerConfig.logoUrl]);

  // Load initial data & connect Firestore real-time persistence listeners
  useEffect(() => {
    async function loadData() {
      try {
        const [tel, incs, posts, acts, proofsData] = await Promise.all([
          apiService.getTelemetry(),
          apiService.getIncidents(),
          apiService.getForumPosts(),
          apiService.getActivities(),
          apiService.getProofs(),
        ]);
        setTelemetry(tel);
        setIncidents(incs);
        setForumPosts(posts);
        setActivities(acts);
        if (proofsData && proofsData.length > 0) {
          setActivityProofs(proofsData);
        }
      } catch (err) {
        console.error('Error loading initial app data', err);
      }
    }
    loadData();

    // Subscribe to Firestore collections for live multi-user sync & persistent saving
    const unsubIncs = subscribeIncidents((fireIncs) => {
      if (fireIncs && fireIncs.length > 0) {
        setIncidents((prev) => {
          const map = new Map<string, Incident>();
          prev.forEach((i) => map.set(i.id, i));
          fireIncs.forEach((i) => map.set(i.id, i as any));
          return Array.from(map.values());
        });
      }
    });

    const unsubActs = subscribeActivities((fireActs) => {
      if (fireActs && fireActs.length > 0) {
        setActivities((prev) => {
          const map = new Map<string, CommunityActivity>();
          prev.forEach((a) => map.set(a.id, a));
          fireActs.forEach((a) => map.set(a.id, a as any));
          return Array.from(map.values());
        });
      }
    });

    const unsubNews = subscribeNews((fireNews) => {
      if (fireNews && fireNews.length > 0) {
        setNewsUpdates((prev) => {
          const map = new Map<string, NewsUpdate>();
          prev.forEach((n) => map.set(n.id, n));
          fireNews.forEach((n) => map.set(n.id, n as any));
          return Array.from(map.values());
        });
      }
    });

    const unsubHotlines = subscribeHotlines((fireHotlines) => {
      if (fireHotlines && fireHotlines.length > 0) {
        setHotlines((prev) => {
          const map = new Map<string, MunicipalHotline>();
          prev.forEach((h) => map.set(h.id, h));
          fireHotlines.forEach((h) => map.set(h.id, h as any));
          return Array.from(map.values());
        });
      }
    });

    const unsubTopics = subscribeClimateTopics((fireTopics) => {
      if (fireTopics && fireTopics.length > 0) {
        setClimateTopics((prev) => {
          const map = new Map<string, ClimateTopic>();
          prev.forEach((t) => map.set(t.id, t));
          fireTopics.forEach((t) => map.set(t.id, t as any));
          return Array.from(map.values());
        });
      }
    });

    const unsubProofs = subscribeProofs((fireProofs) => {
      if (fireProofs && fireProofs.length > 0) {
        setActivityProofs(fireProofs);
      }
    });

    const unsubFooter = subscribeFooterConfig((fireConfig) => {
      if (fireConfig) {
        setFooterConfig(fireConfig);
      }
    });

    const unsubSubAdmins = subscribeSubAdmins((fireSAs) => {
      if (fireSAs && fireSAs.length > 0) {
        setSubAdmins(fireSAs);
      }
    });

    // Sync authenticated user profile from Firestore (no mock auto-login)
    const unsubAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const firestoreProfile = await getUserProfileFromFirestore(user.uid);
        if (firestoreProfile) {
          setUserProfile(firestoreProfile);
          setCurrentUser(firestoreProfile);
        } else {
          const newProfile: UserProfile = {
            name: user.displayName || user.email?.split('@')[0] || 'Eco Citizen',
            email: user.email || '',
            phone: user.phoneNumber || '',
            barangay: 'Poblacion',
            city: 'Zamboanga Sibugay',
            address: 'Purok 1, Poblacion',
            bio: 'Active municipal climate action steward.',
            emergencyContact: {
              name: 'Emergency Contact',
              phone: '911',
            },
            isVerified: true,
            kycNumber: `PS-SIBUGAY-${user.uid.slice(0, 6).toUpperCase()}`,
            ecoPoints: 100,
            rank: 'Eco-Champion Tier 1',
            level: 'Level 2 Guardian',
            reportingAuthorized: true,
            joinedMovements: [],
          };
          setUserProfile(newProfile);
          setCurrentUser(newProfile);
          await saveUserProfileToFirestore(user.uid, newProfile);
        }
      } else {
        setUserProfile(null);
        setCurrentUser(null);
      }
    });

    return () => {
      unsubIncs();
      unsubActs();
      unsubNews();
      unsubHotlines();
      unsubTopics();
      unsubProofs();
      unsubFooter();
      unsubSubAdmins();
      unsubAuth();
    };
  }, []);

  // Clean Logout Handler
  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (err) {
      console.warn('Sign out error:', err);
    }
    setCurrentUser(null);
    setUserProfile(null);
    setActiveTab('home');
  };

  // Handler to update and persist footer / branding configuration (including website logo)
  const handleUpdateFooterConfig = async (newConfig: FooterConfig) => {
    setFooterConfig(newConfig);
    try {
      localStorage.setItem('portal_branding_footer_config', JSON.stringify(newConfig));
    } catch (_) {}
    await saveFooterConfigToFirestore(newConfig);
  };

  // Telemetry refresh handler
  const handleRefreshTelemetry = async () => {
    setIsRefreshingTelemetry(true);
    try {
      const refreshed = await apiService.refreshTelemetry();
      setTelemetry(refreshed);
    } finally {
      setIsRefreshingTelemetry(false);
    }
  };

  // Submit Incident Handler
  const handleCreateIncident = async (incidentData: Partial<Incident>) => {
    const { incident, ecoPointsAwarded } = await apiService.createIncident(incidentData);
    setIncidents((prev) => [incident, ...prev.filter(i => i.id !== incident.id)]);
    refreshPendingCount();
    // Save incident and attached images directly to Firestore
    await saveIncidentToFirestore(incident as any);
    if (userProfile) {
      const updatedProfile = { ...userProfile, ecoPoints: userProfile.ecoPoints + ecoPointsAwarded };
      setUserProfile(updatedProfile);
      if (auth.currentUser?.uid) {
        await saveUserProfileToFirestore(auth.currentUser.uid, updatedProfile);
      }
    }
  };

  // Sync Offline Pending Incident Reports
  const handleSyncPendingReports = async () => {
    if (isSyncingOfflineReports) return;
    setIsSyncingOfflineReports(true);
    try {
      const { syncedCount, syncedIncidents } = await syncOfflineIncidents((data) =>
        apiService.createIncident(data)
      );
      if (syncedCount > 0) {
        // Refresh incidents list from API/cache
        const refreshed = await apiService.getIncidents();
        setIncidents(refreshed);
      }
      refreshPendingCount();
    } catch (err) {
      console.warn('Error during manual sync of offline incidents', err);
    } finally {
      setIsSyncingOfflineReports(false);
    }
  };

  // Auto-sync offline incidents when browser reconnects to the network
  useEffect(() => {
    if (isOnline && pendingOfflineCount > 0) {
      handleSyncPendingReports();
    }
  }, [isOnline, pendingOfflineCount]);

  // Update Incident Status (Admin / Triage)
  const handleUpdateIncidentStatus = async (
    id: string,
    status: any,
    remediationNote?: string,
    assignedUnit?: string
  ) => {
    await apiService.updateIncidentStatus(id, { status, remediationNote, assignedUnit });
    setIncidents((prev) => {
      const updatedList = prev.map((inc) => {
        if (inc.id === id) {
          const updated = {
            ...inc,
            status,
            remediationNote: remediationNote || inc.remediationNote,
            assignedUnit: assignedUnit || inc.assignedUnit,
            remediationDate: status === 'Remediated' ? new Date().toISOString().split('T')[0] : inc.remediationDate,
          };
          saveIncidentToFirestore(updated as any);
          return updated;
        }
        return inc;
      });
      return updatedList;
    });
  };

  // Community Activity Toggle Join & Proof Submission Handlers
  const handleToggleJoinActivity = async (id: string) => {
    const act = activities.find((a) => a.id === id);
    if (act && !act.joined) {
      // Require photographic proof submission to join climate movements and earn points
      setSelectedActivityForProof(act);
      setIsProofModalOpen(true);
      return;
    }

    const res = await apiService.toggleJoinActivity(id);
    setActivities((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, joined: res.joined, volunteerCount: res.volunteerCount }
          : a
      )
    );
    if (userProfile && res.ecoPoints) {
      setUserProfile((prev) => (prev ? { ...prev, ecoPoints: res.ecoPoints } : null));
    }
  };

  const handleOpenProofModal = (act: CommunityActivity) => {
    setSelectedActivityForProof(act);
    setIsProofModalOpen(true);
  };

  const handleSubmitProof = async (data: {
    activityId: string;
    activityTitle: string;
    activityCategory?: string;
    description: string;
    photoUrl: string;
    hoursSpent: number;
    ecoPointsReward: number;
    citizenName?: string;
    citizenEmail?: string;
    citizenBarangay?: string;
    citizenAvatar?: string;
  }) => {
    try {
      const res = await apiService.submitActivityProof({
        ...data,
        citizenName: userProfile?.name || 'Verified Citizen',
        citizenEmail: userProfile?.email || 'citizen@sibugay.gov',
        citizenBarangay: userProfile?.barangay || 'Barangay Central',
        citizenAvatar: userProfile?.avatarUrl,
      });

      // Save to Firestore
      saveProofToFirestore(res.proof);

      // Update state
      setActivityProofs((prev) => [res.proof, ...prev.filter((p) => p.id !== res.proof.id)]);

      // Mark activity as joined in local state
      setActivities((prev) =>
        prev.map((a) =>
          a.id === data.activityId
            ? { ...a, joined: true, volunteerCount: a.volunteerCount + 1 }
            : a
        )
      );

      // Update user profile movements
      if (res.profile) {
        setUserProfile(res.profile);
      } else if (userProfile) {
        const movementRecord = {
          id: `jm-${Date.now()}`,
          activityId: data.activityId,
          activityTitle: data.activityTitle,
          activityCategory: data.activityCategory,
          date: new Date().toISOString().split('T')[0],
          proofPhoto: data.photoUrl,
          description: data.description,
          status: 'Pending Review' as const,
          pointsAwarded: data.ecoPointsReward,
          submittedDate: new Date().toISOString().split('T')[0],
        };
        const updatedMovements = [
          movementRecord,
          ...(userProfile.joinedMovements || []).filter((m) => m.activityTitle !== data.activityTitle),
        ];
        const updated = { ...userProfile, joinedMovements: updatedMovements };
        setUserProfile(updated);
        if (auth.currentUser) {
          saveUserProfileToFirestore(auth.currentUser.uid, updated);
        }
      }

      setMovementToast(
        `✓ Proof submitted for "${data.activityTitle}"! CENRO administrators will check and verify your proof to credit +${data.ecoPointsReward} Eco-Points.`
      );
      setTimeout(() => setMovementToast(null), 5000);
    } catch (err: any) {
      console.error('Error submitting proof:', err);
      throw err;
    }
  };

  const handleApproveProof = async (proofId: string, citizenName: string, points: number) => {
    try {
      await apiService.updateProofStatus(proofId, 'Approved');
      await updateProofStatusInFirestore(proofId, 'Approved');

      setActivityProofs((prev) =>
        prev.map((p) => (p.id === proofId ? { ...p, status: 'Approved' } : p))
      );

      const targetProof = activityProofs.find((p) => p.id === proofId);
      if (userProfile) {
        const newEcoPoints = (userProfile.ecoPoints || 0) + points;
        const updatedMovements = (userProfile.joinedMovements || []).map((m) =>
          m.activityTitle === targetProof?.activityTitle || m.activityId === targetProof?.activityId
            ? { ...m, status: 'Verified' as const, pointsAwarded: points }
            : m
        );
        const updated = { ...userProfile, ecoPoints: newEcoPoints, joinedMovements: updatedMovements };
        setUserProfile(updated);
        if (auth.currentUser) {
          saveUserProfileToFirestore(auth.currentUser.uid, updated);
        }
      }
    } catch (err) {
      console.error('Error approving proof:', err);
    }
  };

  const handleRejectProof = async (proofId: string, feedback?: string) => {
    try {
      await apiService.updateProofStatus(proofId, 'Rejected', feedback);
      await updateProofStatusInFirestore(proofId, 'Rejected', feedback);

      setActivityProofs((prev) =>
        prev.map((p) => (p.id === proofId ? { ...p, status: 'Rejected', adminFeedback: feedback } : p))
      );

      const targetProof = activityProofs.find((p) => p.id === proofId);
      if (userProfile) {
        const updatedMovements = (userProfile.joinedMovements || []).map((m) =>
          m.activityTitle === targetProof?.activityTitle || m.activityId === targetProof?.activityId
            ? { ...m, status: 'Rejected' as const, adminFeedback: feedback }
            : m
        );
        const updated = { ...userProfile, joinedMovements: updatedMovements };
        setUserProfile(updated);
        if (auth.currentUser) {
          saveUserProfileToFirestore(auth.currentUser.uid, updated);
        }
      }
    } catch (err) {
      console.error('Error rejecting proof:', err);
    }
  };

  // Forum Handlers
  const handleUpvotePost = async (id: string) => {
    const res = await apiService.upvoteForumPost(id);
    setForumPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, upvotes: res.upvotes, upvotedByUser: res.upvotedByUser } : p
      )
    );
  };

  const handleAddComment = async (postId: string, text: string) => {
    const newComment = await apiService.addForumComment(postId, text);
    setForumPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
      )
    );
    if (userProfile) {
      setUserProfile((prev) => prev ? { ...prev, ecoPoints: prev.ecoPoints + 10 } : null);
    }
  };

  const handleCreateForumPost = async (postData: {
    title: string;
    content: string;
    category: string;
    tags: string[];
  }) => {
    const newPost = await apiService.createForumPost(postData);
    setForumPosts((prev) => [newPost, ...prev]);
    if (userProfile) {
      setUserProfile((prev) => prev ? { ...prev, ecoPoints: prev.ecoPoints + 25 } : null);
    }
  };

  // Carbon Audit Completion Handler
  const handleCarbonAudit = async (data: any) => {
    const result = await apiService.calculateCarbonFootprint(data);
    if (userProfile) {
      setUserProfile((prev) =>
        prev ? { ...prev, ecoPoints: prev.ecoPoints + result.ecoPointsAwarded } : null
      );
    }
    return result;
  };

  // Update Profile
  const handleUpdateProfile = async (data: Partial<UserProfile>) => {
    const updated = await apiService.updateProfile(data);
    setUserProfile(updated);
    if (auth.currentUser?.uid) {
      await saveUserProfileToFirestore(auth.currentUser.uid, updated);
    }
  };

  // Filter into tracker
  const handleStatusFilter = (status: string) => {
    setTrackerInitialFilter(status);
    setActiveTab('tracker');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openReportWithCategory = (cat?: string) => {
    setInitialReportCategory(cat);
    setIsReportModalOpen(true);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // CMS Admin Dashboard View Mode (Separate Integration & Access Gateway)
  if (isAdminMode || activeTab === 'admin') {
    return (
      <CMSAdminDashboard
        onBackToPublic={() => {
          setIsAdminMode(false);
          window.location.hash = '';
          setActiveTab('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        incidents={incidents}
        onUpdateIncidentStatus={handleUpdateIncidentStatus}
        telemetry={telemetry}
        onRefreshTelemetry={handleRefreshTelemetry}
        userProfile={userProfile}
        onUpdateUserProfile={handleUpdateProfile}
        activities={activities}
        onAddActivity={(newAct) => {
          setActivities((prev) => [newAct, ...prev]);
          saveActivityToFirestore(newAct as any);
        }}
        onUpdateActivity={(updAct) => {
          setActivities((prev) => prev.map((a) => (a.id === updAct.id ? updAct : a)));
          saveActivityToFirestore(updAct as any);
        }}
        onDeleteActivity={(id) => {
          setActivities((prev) => prev.filter((a) => a.id !== id));
          deleteActivityFromFirestore(id);
        }}
        proofs={activityProofs}
        onApproveProof={handleApproveProof}
        onRejectProof={handleRejectProof}
        hotlines={hotlines}
        onAddHotline={(newH) => {
          setHotlines((prev) => [...prev, newH]);
          saveHotlineToFirestore(newH as any);
        }}
        onUpdateHotline={(updH) => {
          setHotlines((prev) => prev.map((h) => (h.id === updH.id ? updH : h)));
          saveHotlineToFirestore(updH as any);
        }}
        onDeleteHotline={(id) => {
          setHotlines((prev) => prev.filter((h) => h.id !== id));
          deleteHotlineFromFirestore(id);
        }}
        climateTopics={climateTopics}
        onAddClimateTopic={(newTopic) => {
          setClimateTopics((prev) => [...prev, newTopic]);
          saveClimateTopicToFirestore(newTopic as any);
        }}
        onUpdateClimateTopic={(updTopic) => {
          setClimateTopics((prev) => prev.map((t) => (t.id === updTopic.id ? updTopic : t)));
          saveClimateTopicToFirestore(updTopic as any);
        }}
        onDeleteClimateTopic={(id) => {
          setClimateTopics((prev) => prev.filter((t) => t.id !== id));
          deleteClimateTopicFromFirestore(id);
        }}
        newsUpdates={newsUpdates}
        onAddNewsUpdate={(newN) => {
          setNewsUpdates((prev) => [newN, ...prev]);
          saveNewsToFirestore(newN as any);
        }}
        onUpdateNewsUpdate={(updN) => {
          setNewsUpdates((prev) => prev.map((n) => (n.id === updN.id ? updN : n)));
          saveNewsToFirestore(updN as any);
        }}
        onDeleteNewsUpdate={(id) => {
          setNewsUpdates((prev) => prev.filter((n) => n.id !== id));
          deleteNewsFromFirestore(id);
        }}
        subAdmins={subAdmins}
        onAddSubAdmin={(newSA) => {
          setSubAdmins((prev) => [...prev, newSA]);
          saveSubAdminToFirestore(newSA);
        }}
        onUpdateSubAdmin={(updSA) => {
          setSubAdmins((prev) => prev.map((sa) => (sa.id === updSA.id ? updSA : sa)));
          saveSubAdminToFirestore(updSA);
        }}
        onDeleteSubAdmin={(id) => {
          setSubAdmins((prev) => prev.filter((sa) => sa.id !== id));
          deleteSubAdminFromFirestore(id);
        }}
        footerConfig={footerConfig}
        onUpdateFooterConfig={handleUpdateFooterConfig}
      />
    );
  }

  return (
    <div className="min-h-screen text-slate-900 flex flex-col selection:bg-emerald-200 selection:text-emerald-950 font-sans antialiased w-full relative">
      {/* Animated Organic Light Background */}
      <AnimatedBackground />

      {/* Top Header with Desktop Navbar & Mobile Navigation (Full Width) */}
      <TopHeader
        userProfile={currentUser || userProfile}
        unreadNotificationsCount={2}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenMenu={() => setIsMenuOpen(true)}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenReportModal={() => openReportWithCategory()}
        onOpenProfile={() => handleTabChange('profile')}
        onOpenAlerts={() => handleTabChange('alerts')}
        onOpenAuthModal={openAuthModal}
        logoUrl={footerConfig.logoUrl}
        pagasaAlert={telemetry?.pagasaAlert || { level: 'Standard', badge: 'Monitoring', title: 'Normal Conditions', advisory: 'No active typhoon warnings in province.', active: false }}
      />

      {/* User Authentication Modal */}
      <UserAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onAuthenticate={(prof) => {
          setCurrentUser(prof);
          setUserProfile(prof);
          setIsAuthModalOpen(false);
        }}
      />

      {/* Main Content Area: Responsive container auto-adjusting to fit desktop and mobile screens */}
      <main className="flex-1 w-full max-w-7xl 2xl:max-w-[1536px] mx-auto p-3.5 sm:p-5 md:p-6 lg:p-8 space-y-6 pb-20 md:pb-8">
        {/* Offline Mode & Incident Sync Alert Banner */}
        <OfflineSyncBanner
          isOnline={isOnline}
          pendingOfflineCount={pendingOfflineCount}
          onSyncPendingReports={handleSyncPendingReports}
          isSyncing={isSyncingOfflineReports}
        />

        {/* TAB: HOME */}
          {activeTab === 'home' && (
            <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6 lg:items-start">
              {/* Left Column (Primary Telemetry & Incident Reporting) */}
              <div className="space-y-4 lg:col-span-7 xl:col-span-8">
                {/* Climate Telemetry Card */}
                <ClimateStatusCard
                  telemetry={telemetry}
                  onRefresh={handleRefreshTelemetry}
                  isRefreshing={isRefreshingTelemetry}
                  onViewAlertsTab={() => {
                    setActiveTab('alerts');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />

                {/* Citizen Activity & Reports Summary */}
                <CitizenActivitySummary
                  incidents={incidents}
                  onSelectStatusFilter={handleStatusFilter}
                  onOpenReportModal={openReportWithCategory}
                  onViewTracker={() => {
                    setTrackerInitialFilter('all');
                    setActiveTab('tracker');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />

                {/* MY SUBMITTED REPORTS & STATUS Card (Exact to screenshot) */}
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-3 animate-card-entrance animate-stagger-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="w-4 h-4 text-emerald-700" />
                      <h2 className="font-extrabold text-slate-900 text-xs sm:text-sm tracking-tight uppercase font-display">
                        My Submitted Reports & Status
                      </h2>
                    </div>
                    <button
                      onClick={() => {
                        setTrackerInitialFilter('all');
                        setActiveTab('tracker');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>View Tracker</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Table Header Row (Exact to screenshot) */}
                  <div className="grid grid-cols-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider px-2 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span>Type</span>
                    <span>Location</span>
                    <span>Status</span>
                    <span className="text-right">Date</span>
                  </div>

                  {/* Content Rows */}
                  {incidents.length === 0 ? (
                    <div className="py-8 text-center space-y-2 animate-card-fade">
                      <h3 className="font-extrabold text-sm text-slate-800">
                        No Incident Reports Filed Yet
                      </h3>
                      <p className="text-xs text-slate-500 max-w-xs mx-auto">
                        Your account is ready to report local hazards, illegal dumping, or flooding.
                      </p>
                      <button
                        onClick={() => openReportWithCategory()}
                        className="mt-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>+ Submit First Report</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {incidents.slice(0, 3).map((inc, idx) => (
                        <div
                          key={inc.id}
                          onClick={() => setSelectedIncident(inc)}
                          style={{ animationDelay: `${(idx + 1) * 60}ms` }}
                          className="grid grid-cols-4 items-center text-xs p-2 rounded-xl hover:bg-emerald-50/70 border border-transparent hover:border-emerald-200 transition-all cursor-pointer group animate-card-fade hover:-translate-y-0.5"
                        >
                          <span className="font-bold text-slate-900 truncate pr-1 group-hover:text-emerald-700 transition-colors">
                            {inc.type}
                          </span>
                          <span className="text-slate-600 truncate pr-1">
                            {inc.barangay}
                          </span>
                          <div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                              inc.status === 'Remediated'
                                ? 'bg-emerald-100 text-emerald-800'
                                : inc.status === 'Dispatched'
                                ? 'bg-sky-100 text-sky-800'
                                : inc.status === 'In Triage'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {inc.status}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 text-right font-mono truncate">
                            {inc.reportedDate.split(' ')[0]}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* GIS Environmental Incident Map */}
                <div className="animate-card-entrance animate-stagger-4">
                  <GISMapSection
                    incidents={incidents}
                    onSelectIncident={(inc) => setSelectedIncident(inc)}
                  />
                </div>
              </div>

              {/* Right Column (Live Advisories, Response Protocol, Activities, Knowledge) */}
              <div className="space-y-4 lg:col-span-5 xl:col-span-4 lg:sticky lg:top-20">
                {/* Municipal Response Protocol (CENRO Standards) */}
                <div className="animate-card-entrance animate-stagger-5">
                  <ResponseProtocolCard />
                </div>

                {/* Community Activities & Tip */}
                <div className="animate-card-entrance">
                  <CommunityActivitiesSection
                    activities={activities}
                    onToggleJoin={handleToggleJoinActivity}
                    onOpenProofModal={handleOpenProofModal}
                    onViewAllActivities={() => {
                      setActiveTab('activities');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onOpenTipModal={() => setShowTipModal(true)}
                  />
                </div>

                {/* Climate Knowledge Hub */}
                <div className="animate-card-entrance animate-stagger-3">
                  <ClimateInfoSection />
                </div>
              </div>
            </div>
          )}

          {/* TAB: GIS MAP */}
          {activeTab === 'map' && (
            <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6 lg:items-start">
              <div className="lg:col-span-8">
                <GISMapSection
                  incidents={incidents}
                  onSelectIncident={(inc) => setSelectedIncident(inc)}
                />
              </div>
              <div className="lg:col-span-4 lg:sticky lg:top-20">
                <ResponseProtocolCard />
              </div>
            </div>
          )}

          {/* TAB: TRACKER */}
          {activeTab === 'tracker' && (
            <IncidentTrackerView
              incidents={incidents}
              onSelectIncident={(inc) => setSelectedIncident(inc)}
              onOpenReportModal={() => openReportWithCategory()}
              initialFilter={trackerInitialFilter}
            />
          )}

          {/* TAB: CARBON CALCULATOR */}
          {activeTab === 'calculator' && (
            <CarbonCalculatorView onAuditCompleted={handleCarbonAudit} />
          )}

          {/* TAB: COMMUNITY FORUM */}
          {activeTab === 'forum' && (
            <CommunityForumView
              posts={forumPosts}
              onUpvotePost={handleUpvotePost}
              onAddComment={handleAddComment}
              onCreatePost={handleCreateForumPost}
            />
          )}

          {/* TAB: COMMUNITY ACTIVITIES */}
          {activeTab === 'activities' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white text-slate-900 rounded-3xl p-5 shadow-xs border border-emerald-200/90">
                <h1 className="font-black text-xl font-display tracking-tight text-emerald-950">
                  Community Volunteer Drives
                </h1>
                <p className="text-xs text-slate-600 mt-1 leading-snug">
                  Mobilize with local youth and barangay volunteers. Clean coastal mangroves, declog river culverts, and plant native trees to earn eco-points.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activities.map((act, idx) => (
                  <div
                    key={act.id}
                    style={{ animationDelay: `${Math.min(idx * 60, 360)}ms` }}
                    className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-3 animate-card-entrance hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          {act.category}
                        </span>
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          +{act.ecoPointsReward} Eco-Points
                        </span>
                      </div>

                      <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                        {act.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {act.description}
                      </p>
                    </div>

                    <div className="space-y-2.5 pt-2 border-t border-slate-100">
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1 text-slate-700">
                        <div>📍 <span className="font-semibold">{act.location}</span> ({act.barangay})</div>
                        <div>📅 <span className="font-semibold">{act.date}</span> · {act.time}</div>
                        <div>👥 <span className="font-semibold text-emerald-800">{act.volunteerCount} / {act.maxVolunteers}</span> Registered Citizens</div>
                      </div>

                      <button
                        onClick={() => handleOpenProofModal(act)}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                          act.joined
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                        }`}
                      >
                        {act.joined ? '✓ Proof Submitted (Pending Admin Review)' : 'Join & Submit Participation Proof'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: CITIZEN PROFILE */}
          {activeTab === 'profile' && (
            <CitizenProfileView
              userProfile={currentUser || userProfile}
              incidents={incidents}
              activities={activities}
              onUpdateProfile={handleUpdateProfile}
              onOpenReportModal={() => openReportWithCategory()}
              onViewTracker={() => {
                setTrackerInitialFilter('all');
                setActiveTab('tracker');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBrowseActivities={() => {
                setActiveTab('activities');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenProofModalForActivity={handleOpenProofModal}
              onLogout={handleLogout}
              onOpenAuthModal={openAuthModal}
            />
          )}

          {/* TAB: KNOWLEDGE */}
          {activeTab === 'knowledge' && (
            <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6 lg:items-start">
              <div className="space-y-4 lg:col-span-8">
                <div className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white text-slate-900 rounded-3xl p-5 shadow-xs border border-emerald-200/90">
                  <h1 className="font-black text-xl font-display tracking-tight text-emerald-950">
                    Climate Knowledge & Municipal Ordinances
                  </h1>
                  <p className="text-xs text-slate-600 mt-1 leading-snug">
                    Comprehensive environmental science guides, RA 9003 compliance protocols, and flood resilience checklists.
                  </p>
                </div>
                <ClimateInfoSection topics={climateTopics} />
              </div>
              <div className="lg:col-span-4 lg:sticky lg:top-20">
                <ResponseProtocolCard />
              </div>
            </div>
          )}

          {/* TAB: ALERTS */}
          {activeTab === 'alerts' && (
            <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6 lg:items-start">
              <div className="space-y-4 lg:col-span-7 xl:col-span-8">
                <div className="bg-gradient-to-r from-emerald-50 via-sky-50/50 to-white text-slate-900 rounded-3xl p-5 shadow-xs border border-emerald-200/90">
                  <h1 className="font-black text-xl font-display tracking-tight text-emerald-950">
                    Official Alerts & Weather Bulletins
                  </h1>
                  <p className="text-xs text-slate-600 mt-1 leading-snug">
                    Real-time municipal advisories grounded with live Google Search telemetry, DOST-PAGASA regional bulletins, and CDRRMO emergency standards.
                  </p>
                </div>

                {/* Google Search Grounded 3-Day Weather Forecast */}
                <GroundedWeatherForecastCard
                  onOpenReportModal={openReportWithCategory}
                />
              </div>

              <div className="space-y-4 lg:col-span-5 xl:col-span-4 lg:sticky lg:top-20">
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 font-display">
                      Active Municipal Hazard Advisories
                    </span>
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      Priority Directives
                    </span>
                  </div>

                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-rose-900 font-extrabold">
                      <span>{telemetry.pagasaAlert.badge}</span>
                      <span className="bg-rose-600 text-white px-2 py-0.5 rounded text-[10px]">Active</span>
                    </div>
                    <h4 className="font-bold text-rose-950 text-sm">{telemetry.pagasaAlert.title}</h4>
                    <p className="text-rose-800 leading-relaxed">{telemetry.pagasaAlert.advisory}</p>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-amber-900 font-extrabold">
                      <span>Municipal Ordinance #2026-04</span>
                      <span className="bg-amber-600 text-white px-2 py-0.5 rounded text-[10px]">Notice</span>
                    </div>
                    <h4 className="font-bold text-amber-950 text-sm">Mandatory Rainwater Catchment in Commercial Establishments</h4>
                    <p className="text-amber-800 leading-relaxed">
                      All buildings with roof areas exceeding 150 sq.m are required to install functional catchment drums to relieve urban culverts during convective storms.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: GUIDES */}
          {activeTab === 'guides' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white text-slate-900 rounded-3xl p-5 shadow-xs border border-emerald-200/90">
                <h1 className="font-black text-xl font-display tracking-tight text-emerald-950">
                  Citizen User Guides
                </h1>
                <p className="text-xs text-slate-600 mt-1 leading-snug">
                  Step-by-step instructions on geotagging incident evidence, filing whistleblower reports, and redeeming eco-points.
                </p>
              </div>
              <ResponseProtocolCard />
            </div>
          )}

          {/* Municipal Footer (Rendered on all pages matching screenshots) */}
          <MunicipalFooter
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenReportModal={() => openReportWithCategory()}
            hotlines={hotlines}
            footerConfig={footerConfig}
          />
        </main>

        {/* Fixed Mobile Bottom Navigation Bar */}
        <BottomNavBar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenReportModal={() => openReportWithCategory()}
        />

        {/* Slide-out Navigation Drawer (Clean citizen navigation without admin link) */}
        <NavigationDrawer
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          userProfile={currentUser || userProfile}
          onOpenReportModal={() => openReportWithCategory()}
          onOpenAuthModal={openAuthModal}
          onLogout={handleLogout}
          logoUrl={footerConfig.logoUrl}
        />

        {/* Notifications Modal */}
        <NotificationsModal
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          onOpenAlertsTab={() => {
            setActiveTab('alerts');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* Incident Reporting Modal */}
        <IncidentReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          onSubmit={handleCreateIncident}
          initialCategory={initialReportCategory}
        />

        {/* Incident Details Modal */}
        <IncidentDetailsModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />

        {/* Climate Tip Modal */}
        {showTipModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-3 text-xs">
              <h3 className="font-extrabold text-base text-slate-900 font-display">
                Water Conservation & Flood Management
              </h3>
              <p className="text-slate-600 leading-relaxed">
                During tropical depressions, municipal culverts can reach hydraulic capacity within minutes. When households minimize non-critical drainage discharge (like heavy laundry water), it decreases backflow risk into lowland residential puroks.
              </p>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 font-semibold">
                Tip: Store rainwater in lidded drums with fine mesh screens to prevent mosquito breeding.
              </div>
              <button
                onClick={() => setShowTipModal(false)}
                className="w-full py-2.5 bg-emerald-700 text-white font-bold rounded-xl mt-2"
              >
                Close Tip
              </button>
            </div>
          </div>
        )}

        {/* Community Movement Participation Proof Modal */}
        <JoinMovementProofModal
          isOpen={isProofModalOpen}
          activity={selectedActivityForProof}
          citizenProfile={userProfile}
          onClose={() => {
            setIsProofModalOpen(false);
            setSelectedActivityForProof(null);
          }}
          onSubmitProof={handleSubmitProof}
        />

        {/* Movement Submission Notification Toast */}
        {movementToast && (
          <div className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:max-w-md z-50 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/50 flex items-start gap-3 animate-in fade-in slide-in-from-bottom duration-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <span className="font-extrabold text-emerald-300 block mb-0.5">Proof Submitted to Admin Queue</span>
              <p className="text-slate-200 leading-snug">{movementToast}</p>
            </div>
            <button
              onClick={() => setMovementToast(null)}
              className="text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
    </div>
  );
}

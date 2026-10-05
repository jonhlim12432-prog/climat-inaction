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
import { MunicipalFooter, DEFAULT_FOOTER_CONFIG } from './components/MunicipalFooter';
import { GroundedWeatherForecastCard } from './components/GroundedWeatherForecastCard';
import { CMSAdminDashboard } from './components/CMSAdminDashboard';
import { UserAuthModal } from './components/UserAuthModal';
import { updateFavicon } from './utils/favicon';
import { useOnlineStatus } from './utils/useOnlineStatus';
import { syncOfflineIncidents } from './utils/offlineStorage';
import { OfflineSyncBanner } from './components/OfflineSyncBanner';

import {
  Plus,
  ChevronRight,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
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

  // Online / Offline Connectivity & Sync Hook
  const { isOnline, pendingOfflineCount, refreshPendingCount } = useOnlineStatus();

  // Core Data States
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [activities, setActivities] = useState<CommunityActivity[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [trackerInitialFilter, setTrackerInitialFilter] = useState('all');
  const [footerConfig, setFooterConfig] = useState<FooterConfig>(DEFAULT_FOOTER_CONFIG);

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

  const [subAdmins, setSubAdmins] = useState<SubAdminAccount[]>([
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
  ]);

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

  // Load initial data
  useEffect(() => {
    async function loadData() {
      try {
        const [tel, incs, posts, acts, prof] = await Promise.all([
          apiService.getTelemetry(),
          apiService.getIncidents(),
          apiService.getForumPosts(),
          apiService.getActivities(),
          apiService.getProfile(),
        ]);
        setTelemetry(tel);
        setIncidents(incs);
        setForumPosts(posts);
        setActivities(acts);
        setUserProfile(prof);
      } catch (err) {
        console.error('Error loading initial app data', err);
      }
    }
    loadData();
  }, []);

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
    if (userProfile) {
      setUserProfile((prev) => prev ? { ...prev, ecoPoints: prev.ecoPoints + ecoPointsAwarded } : null);
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
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === id
          ? {
              ...inc,
              status,
              remediationNote: remediationNote || inc.remediationNote,
              assignedUnit: assignedUnit || inc.assignedUnit,
              remediationDate: status === 'Remediated' ? new Date().toISOString().split('T')[0] : inc.remediationDate,
            }
          : inc
      )
    );
  };

  // Community Activity Toggle Join
  const handleToggleJoinActivity = async (id: string) => {
    const res = await apiService.toggleJoinActivity(id);
    setActivities((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, joined: res.joined, volunteerCount: res.volunteerCount }
          : a
      )
    );
    if (userProfile && res.ecoPoints) {
      setUserProfile((prev) => prev ? { ...prev, ecoPoints: res.ecoPoints } : null);
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
  };

  // Filter into tracker
  const handleStatusFilter = (status: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setTrackerInitialFilter(status);
    setActiveTab('tracker');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openReportWithCategory = (cat?: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setInitialReportCategory(cat);
    setIsReportModalOpen(true);
  };

  const handleTabChange = (tab: string) => {
    if (['tracker', 'forum', 'activities', 'calculator', 'profile'].includes(tab) && !currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!userProfile || !telemetry) {
    return (
      <div className="min-h-screen bg-[#064e3b] flex items-center justify-center p-4">
        <div className="text-center text-white space-y-3">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin mx-auto" />
          <h2 className="font-extrabold text-lg font-display">Initializing Climate Action Portal...</h2>
          <p className="text-xs text-emerald-200">Zamboanga Sibugay Municipal Telemetry</p>
        </div>
      </div>
    );
  }

  // REQUIRED LOGIN / CREATE ACCOUNT LANDING PAGE TO PROCEED
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#064e3b] via-[#04331f] to-[#022213] text-white flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-emerald-500 selection:text-white">
        <div className="max-w-xl w-full bg-white text-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl border border-emerald-500/30 space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 mx-auto flex items-center justify-center text-white shadow-xl shadow-emerald-950/60 ring-4 ring-emerald-500/20">
              <span className="text-3xl">🌍</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-slate-900">
              {footerConfig.portalName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {footerConfig.portalSubtitle}
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs text-emerald-900 space-y-1.5">
            <span className="font-extrabold block uppercase tracking-wider text-emerald-800">
              🔒 Login / Create Account Required to Proceed
            </span>
            <p className="text-emerald-700 leading-relaxed">
              To ensure verified municipal environmental reporting, community participation, and tracking, all citizens must sign in or create an account before accessing the platform.
            </p>
          </div>

          <UserAuthModal
            isOpen={true}
            onClose={() => {}}
            onAuthenticate={(prof) => {
              setCurrentUser(prof);
              setUserProfile(prof);
            }}
          />
        </div>
      </div>
    );
  }

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
        onAddActivity={(newAct) => setActivities((prev) => [newAct, ...prev])}
        onUpdateActivity={(updAct) =>
          setActivities((prev) => prev.map((a) => (a.id === updAct.id ? updAct : a)))
        }
        onDeleteActivity={(id) => setActivities((prev) => prev.filter((a) => a.id !== id))}
        hotlines={hotlines}
        onAddHotline={(newH) => setHotlines((prev) => [...prev, newH])}
        onUpdateHotline={(updH) =>
          setHotlines((prev) => prev.map((h) => (h.id === updH.id ? updH : h)))
        }
        onDeleteHotline={(id) => setHotlines((prev) => prev.filter((h) => h.id !== id))}
        climateTopics={climateTopics}
        onAddClimateTopic={(newTopic) => setClimateTopics((prev) => [...prev, newTopic])}
        onUpdateClimateTopic={(updTopic) =>
          setClimateTopics((prev) => prev.map((t) => (t.id === updTopic.id ? updTopic : t)))
        }
        onDeleteClimateTopic={(id) => setClimateTopics((prev) => prev.filter((t) => t.id !== id))}
        newsUpdates={newsUpdates}
        onAddNewsUpdate={(newN) => setNewsUpdates((prev) => [newN, ...prev])}
        onUpdateNewsUpdate={(updN) =>
          setNewsUpdates((prev) => prev.map((n) => (n.id === updN.id ? updN : n)))
        }
        onDeleteNewsUpdate={(id) => setNewsUpdates((prev) => prev.filter((n) => n.id !== id))}
        subAdmins={subAdmins}
        onAddSubAdmin={(newSA) => setSubAdmins((prev) => [...prev, newSA])}
        onUpdateSubAdmin={(updSA) =>
          setSubAdmins((prev) => prev.map((sa) => (sa.id === updSA.id ? updSA : sa)))
        }
        onDeleteSubAdmin={(id) => setSubAdmins((prev) => prev.filter((sa) => sa.id !== id))}
        footerConfig={footerConfig}
        onUpdateFooterConfig={(cfg) => setFooterConfig(cfg)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#064e3b] text-slate-900 flex flex-col selection:bg-emerald-200 selection:text-emerald-950 font-sans antialiased w-full relative">
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
        logoUrl={footerConfig.logoUrl}
        pagasaAlert={telemetry.pagasaAlert}
      />

      {/* Mandatory Citizen Login Banner when not logged in */}
      {!currentUser && (
        <div className="bg-amber-400 text-slate-950 px-4 py-2.5 text-xs font-extrabold flex items-center justify-between shadow-md z-30">
          <span className="flex items-center gap-1.5">
            <span>🔒 Citizen Account Required:</span>
            <span>Please login or sign up to access incident reporting, trackers, carbon audits, and community forums.</span>
          </span>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="bg-slate-950 hover:bg-black text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm whitespace-nowrap"
          >
            Login / Sign Up Now
          </button>
        </div>
      )}

      {/* User Authentication Modal */}
      <UserAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
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
              <div className="bg-[#15803d] text-white rounded-3xl p-5 shadow-sm border border-emerald-600/30">
                <h1 className="font-extrabold text-xl font-display tracking-tight">
                  Community Volunteer Drives
                </h1>
                <p className="text-xs text-emerald-100/90 mt-1 leading-snug">
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
                        onClick={() => handleToggleJoinActivity(act.id)}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                          act.joined
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                        }`}
                      >
                        {act.joined ? '✓ You Are Registered for This Drive' : 'Join Volunteer Mobilization'}
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
              userProfile={userProfile}
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
            />
          )}

          {/* TAB: KNOWLEDGE */}
          {activeTab === 'knowledge' && (
            <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6 lg:items-start">
              <div className="space-y-4 lg:col-span-8">
                <div className="bg-[#15803d] text-white rounded-3xl p-5 shadow-sm border border-emerald-600/30">
                  <h1 className="font-extrabold text-xl font-display tracking-tight">
                    Climate Knowledge & Municipal Ordinances
                  </h1>
                  <p className="text-xs text-emerald-100/90 mt-1 leading-snug">
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
                <div className="bg-[#15803d] text-white rounded-3xl p-5 shadow-sm border border-emerald-600/30">
                  <h1 className="font-extrabold text-xl font-display tracking-tight">
                    Official Alerts & Weather Bulletins
                  </h1>
                  <p className="text-xs text-emerald-100/90 mt-1 leading-snug">
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
              <div className="bg-[#15803d] text-white rounded-3xl p-5 shadow-sm border border-emerald-600/30">
                <h1 className="font-extrabold text-xl font-display tracking-tight">
                  Citizen User Guides
                </h1>
                <p className="text-xs text-emerald-100/90 mt-1 leading-snug">
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
          userProfile={userProfile}
          onOpenReportModal={() => openReportWithCategory()}
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
    </div>
  );
}

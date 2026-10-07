/**
 * Offline Storage & Synchronization Layer
 * Provides persistent local caching for climate information, telemetry, and pending incident reports.
 * Allows the portal to be fully operational even when the user is disconnected.
 */

import {
  Incident,
  TelemetryData,
  WeatherForecastResponse,
  UserProfile,
  MunicipalHotline,
  NewsUpdate,
} from '../types';

const STORAGE_KEYS = {
  TELEMETRY: 'climate_portal_telemetry_cache_v2',
  WEATHER: 'climate_portal_weather_cache_v2',
  INCIDENTS: 'climate_portal_incidents_cache_v2',
  OFFLINE_QUEUE: 'climate_portal_offline_queue_v2',
  CLIMATE_TOPICS: 'climate_portal_topics_cache_v2',
  USER_PROFILE: 'climate_portal_profile_cache_v2',
  HOTLINES: 'climate_portal_hotlines_cache_v2',
  NEWS: 'climate_portal_news_cache_v2',
  LAST_SYNC: 'climate_portal_last_sync_timestamp',
};

// ==========================================
// TELEMETRY CACHE
// ==========================================
export function saveTelemetryCache(data: TelemetryData): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TELEMETRY, JSON.stringify({
      data,
      savedAt: new Date().toISOString(),
    }));
  } catch (e) {
    console.warn('Failed to save telemetry to persistent cache', e);
  }
}

export function getCachedTelemetry(): TelemetryData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TELEMETRY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed.data || null;
  } catch (e) {
    console.warn('Failed to parse cached telemetry', e);
    return null;
  }
}

// ==========================================
// WEATHER FORECAST CACHE
// ==========================================
export function saveWeatherForecastCache(data: WeatherForecastResponse): void {
  try {
    localStorage.setItem(STORAGE_KEYS.WEATHER, JSON.stringify({
      data,
      savedAt: new Date().toISOString(),
    }));
  } catch (e) {
    console.warn('Failed to save weather to persistent cache', e);
  }
}

export function getCachedWeatherForecast(): WeatherForecastResponse | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WEATHER);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed.data || null;
  } catch (e) {
    console.warn('Failed to parse cached weather', e);
    return null;
  }
}

// ==========================================
// INCIDENTS CACHE & OFFLINE QUEUE
// ==========================================
export function saveIncidentsCache(incidents: Incident[]): void {
  try {
    // Only cache non-temporary items or merge properly
    localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify({
      data: incidents,
      savedAt: new Date().toISOString(),
    }));
  } catch (e) {
    console.warn('Failed to save incidents to persistent cache', e);
  }
}

export function getCachedIncidents(): Incident[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INCIDENTS);
    const offlineQueue = getOfflinePendingIncidents();
    
    let baseList: Incident[] = [];
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.data)) {
        baseList = parsed.data;
      }
    }
    
    // Merge offline pending queue at the top without duplicates
    const offlineIds = new Set(offlineQueue.map((i) => i.id));
    const filteredBase = baseList.filter((i) => !offlineIds.has(i.id));
    return [...offlineQueue, ...filteredBase];
  } catch (e) {
    console.warn('Failed to parse cached incidents', e);
    return getOfflinePendingIncidents();
  }
}

export function getOfflinePendingIncidents(): Incident[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('Failed to read offline incident queue', e);
    return [];
  }
}

export function queueOfflineIncident(incidentData: Partial<Incident>): Incident {
  const offlineId = `offline-inc-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const ticketNumber = `OFFLINE-PENDING-${Math.floor(1000 + Math.random() * 9000)}`;
  
  const offlineIncident: Incident = {
    id: offlineId,
    ticketNumber,
    type: incidentData.type || 'Environmental Incident',
    category: incidentData.category || 'flooding',
    title: incidentData.title || 'Offline Reported Incident',
    location: incidentData.location || 'Zamboanga Sibugay (Offline)',
    barangay: incidentData.barangay || 'Barangay Central',
    coordinates: incidentData.coordinates || { lat: 7.785, lng: 122.585 },
    status: 'Pending Review',
    severity: incidentData.severity || 'Moderate',
    reportedDate: new Date().toLocaleString(),
    reportedBy: incidentData.reportedBy || 'Eco Citizen (Offline)',
    description: incidentData.description || '',
    imageUrl: incidentData.imageUrl,
    assignedUnit: 'CENRO Digital Intake (Queued for Cloud Sync)',
    isOfflinePending: true,
    offlineQueuedAt: new Date().toISOString(),
  };

  try {
    const currentQueue = getOfflinePendingIncidents();
    const updatedQueue = [offlineIncident, ...currentQueue];
    localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(updatedQueue));
    
    // Also update main cache
    const currentCached = getCachedIncidents();
    saveIncidentsCache([offlineIncident, ...currentCached.filter(i => i.id !== offlineIncident.id)]);
  } catch (e) {
    console.warn('Error saving offline incident to queue', e);
  }

  return offlineIncident;
}

export function removeOfflineIncidentFromQueue(id: string): void {
  try {
    const currentQueue = getOfflinePendingIncidents();
    const updatedQueue = currentQueue.filter((inc) => inc.id !== id);
    localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(updatedQueue));
  } catch (e) {
    console.warn('Error removing incident from offline queue', e);
  }
}

export function clearOfflineIncidentQueue(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.OFFLINE_QUEUE);
    const cached = getCachedIncidents();
    const cleanList = cached.filter(
      (i) =>
        !i.isOfflinePending &&
        i.status !== 'Pending Review' &&
        (i.status as string) !== 'Pending' &&
        !i.ticketNumber?.includes('OFFLINE-PENDING')
    );
    saveIncidentsCache(cleanList);
  } catch (e) {
    console.warn('Error clearing offline queue', e);
  }
}

// ==========================================
// PROFILE CACHE
// ==========================================
export function saveProfileCache(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.warn('Failed to cache profile', e);
  }
}

export function getCachedProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

// ==========================================
// HOTLINES & NEWS CACHE
// ==========================================
export function saveHotlinesCache(hotlines: MunicipalHotline[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.HOTLINES, JSON.stringify(hotlines));
  } catch (e) {
    console.warn('Failed to cache hotlines', e);
  }
}

export function getCachedHotlines(): MunicipalHotline[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HOTLINES);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function saveNewsCache(news: NewsUpdate[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(news));
  } catch (e) {
    console.warn('Failed to cache news', e);
  }
}

export function getCachedNews(): NewsUpdate[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NEWS);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

// ==========================================
// SYNC MANAGER: Offline -> Online Sync
// ==========================================
export async function syncOfflineIncidents(
  createIncidentFn: (data: Partial<Incident>) => Promise<{ incident: Incident; ecoPointsAwarded: number }>
): Promise<{ syncedCount: number; errors: number; syncedIncidents: Incident[] }> {
  const queue = getOfflinePendingIncidents();
  if (queue.length === 0) {
    return { syncedCount: 0, errors: 0, syncedIncidents: [] };
  }

  let syncedCount = 0;
  let errors = 0;
  const syncedIncidents: Incident[] = [];

  for (const pendingInc of queue) {
    try {
      const payload: Partial<Incident> = {
        type: pendingInc.type,
        category: pendingInc.category,
        title: pendingInc.title,
        location: pendingInc.location,
        barangay: pendingInc.barangay,
        coordinates: pendingInc.coordinates,
        severity: pendingInc.severity,
        reportedBy: pendingInc.reportedBy,
        description: pendingInc.description,
        imageUrl: pendingInc.imageUrl,
      };

      const result = await createIncidentFn(payload);
      if (result && result.incident) {
        removeOfflineIncidentFromQueue(pendingInc.id);
        syncedIncidents.push(result.incident);
        syncedCount++;
      } else {
        errors++;
      }
    } catch (err) {
      console.warn('Failed to sync offline incident:', pendingInc.id, err);
      errors++;
    }
  }

  localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
  return { syncedCount, errors, syncedIncidents };
}

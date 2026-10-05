import React, { useState } from 'react';
import { WifiOff, Wifi, RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface OfflineSyncBannerProps {
  isOnline: boolean;
  pendingOfflineCount: number;
  onSyncPendingReports: () => Promise<void>;
  isSyncing?: boolean;
}

export const OfflineSyncBanner: React.FC<OfflineSyncBannerProps> = ({
  isOnline,
  pendingOfflineCount,
  onSyncPendingReports,
  isSyncing = false,
}) => {
  const [syncSuccessMessage, setSyncSuccessMessage] = useState<string | null>(null);

  const handleSyncClick = async () => {
    try {
      await onSyncPendingReports();
      setSyncSuccessMessage('All pending incident reports successfully synced with CENRO cloud servers!');
      setTimeout(() => setSyncSuccessMessage(null), 4000);
    } catch (e) {
      console.error('Error syncing reports', e);
    }
  };

  // If online and no pending reports and no success message, keep clean UI
  if (isOnline && pendingOfflineCount === 0 && !syncSuccessMessage) {
    return null;
  }

  return (
    <aside aria-label="Connectivity and sync status" className="w-full">
      {/* Offline Mode Active Banner */}
      {!isOnline && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-emerald-900 text-white px-4 py-3 rounded-2xl shadow-lg border border-amber-400/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/30 border border-amber-300/40 flex items-center justify-center shrink-0">
              <WifiOff className="w-5 h-5 text-amber-200 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider bg-amber-500/40 px-2 py-0.5 rounded text-amber-100 border border-amber-400/40">
                  Offline Mode Active
                </span>
                {pendingOfflineCount > 0 && (
                  <span className="text-xs bg-white text-amber-900 font-bold px-2 py-0.5 rounded-full shadow-sm">
                    {pendingOfflineCount} Queued {pendingOfflineCount === 1 ? 'Report' : 'Reports'}
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-100 mt-0.5 leading-relaxed">
                Persistent local cache is active. You can view basic climate forecasts, advisory telemetry, and pending incident reports. New reports filed now will automatically sync once your connection is restored.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reconnected with Pending Reports to Sync Banner */}
      {isOnline && pendingOfflineCount > 0 && (
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white px-4 py-3 rounded-2xl shadow-lg border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center shrink-0">
              <Wifi className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider bg-emerald-500/40 px-2 py-0.5 rounded text-emerald-100 border border-emerald-400/40">
                  Online Restored
                </span>
                <span className="text-xs bg-emerald-400 text-emerald-950 font-extrabold px-2 py-0.5 rounded-full">
                  {pendingOfflineCount} Pending Incident {pendingOfflineCount === 1 ? 'Report' : 'Reports'} Ready
                </span>
              </div>
              <p className="text-xs text-emerald-100 mt-0.5">
                Internet connection restored. Sync your offline incident reports to transmit GPS coordinates and intake telemetry to CENRO triage.
              </p>
            </div>
          </div>

          <button
            onClick={handleSyncClick}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-xs rounded-xl shadow-md transition shrink-0 active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Transmitting to CENRO...' : 'Sync Pending Reports Now'}
          </button>
        </div>
      )}

      {/* Sync Success Notification Toast */}
      {syncSuccessMessage && (
        <div className="bg-emerald-900/95 border border-emerald-400/50 text-emerald-100 px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2.5 text-xs animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span className="font-semibold">{syncSuccessMessage}</span>
        </div>
      )}
    </aside>
  );
};

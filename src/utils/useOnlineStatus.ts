import { useState, useEffect, useCallback } from 'react';
import { getOfflinePendingIncidents } from './offlineStorage';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [pendingCount, setPendingCount] = useState<number>(() => {
    return getOfflinePendingIncidents().length;
  });

  const refreshPendingCount = useCallback(() => {
    setPendingCount(getOfflinePendingIncidents().length);
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      refreshPendingCount();
    };
    const handleOffline = () => {
      setIsOnline(false);
      refreshPendingCount();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('storage', refreshPendingCount);

    // Initial check
    refreshPendingCount();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('storage', refreshPendingCount);
    };
  }, [refreshPendingCount]);

  return {
    isOnline,
    pendingOfflineCount: pendingCount,
    refreshPendingCount,
  };
}

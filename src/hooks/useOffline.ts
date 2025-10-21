import { useState, useEffect, useCallback } from 'react';

interface OfflineState {
  isOnline: boolean;
  isOffline: boolean;
  wasOffline: boolean;
}

interface OfflineOptions {
  pingUrl?: string;
  pingTimeout?: number;
  pingInterval?: number;
}

/**
 * Custom hook for detecting online/offline status
 * Provides more reliable offline detection than just navigator.onLine
 */
export function useOffline(options: OfflineOptions = {}): OfflineState {
  const {
    pingUrl = 'https://www.google.com/favicon.ico',
    pingTimeout = 5000,
    pingInterval = 30000,
  } = options;

  const [isOnline, setIsOnline] = useState(() => {
    if (typeof navigator !== 'undefined') {
      return navigator.onLine;
    }
    return true;
  });

  const [wasOffline, setWasOffline] = useState(false);

  // Check online status by attempting to fetch a small resource
  const checkOnlineStatus = useCallback(async (): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), pingTimeout);

      const response = await fetch(pingUrl, {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return true;
    } catch {
      return false;
    }
  }, [pingUrl, pingTimeout]);

  // Update online status
  const updateOnlineStatus = useCallback(async () => {
    const online = await checkOnlineStatus();
    
    setIsOnline((prevOnline) => {
      if (!prevOnline && online) {
        // Just came back online
        setWasOffline(true);
        console.log('🌐 Connection restored');
      } else if (prevOnline && !online) {
        // Just went offline
        console.log('📵 Connection lost');
      }
      return online;
    });
  }, [checkOnlineStatus]);

  // Handle browser online/offline events
  useEffect(() => {
    const handleOnline = () => {
      console.log('🌐 Browser detected online');
      setIsOnline(true);
      setWasOffline(true);
    };

    const handleOffline = () => {
      console.log('📵 Browser detected offline');
      setIsOnline(false);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  // Periodically check online status
  useEffect(() => {
    const interval = setInterval(updateOnlineStatus, pingInterval);
    
    // Check immediately
    updateOnlineStatus();

    return () => clearInterval(interval);
  }, [updateOnlineStatus, pingInterval]);

  // Reset wasOffline flag after some time
  useEffect(() => {
    if (wasOffline) {
      const timeout = setTimeout(() => {
        setWasOffline(false);
      }, 5000); // Reset after 5 seconds

      return () => clearTimeout(timeout);
    }
  }, [wasOffline]);

  return {
    isOnline,
    isOffline: !isOnline,
    wasOffline,
  };
}

/**
 * Hook specifically for showing offline notifications
 */
export function useOfflineNotification() {
  const { isOnline, wasOffline } = useOffline();

  return {
    showOfflineWarning: !isOnline,
    showReconnectedNotice: wasOffline && isOnline,
    isOnline,
  };
}

/**
 * Higher-order hook that adds offline-aware behavior to async functions
 */
export function useOfflineAware<T extends (...args: any[]) => Promise<any>>(
  asyncFunction: T,
  fallbackMessage: string = 'This action is not available offline'
): T & { isOffline: boolean } {
  const { isOffline } = useOffline();

  const wrappedFunction = useCallback(
    async (...args: Parameters<T>) => {
      if (isOffline) {
        throw new Error(fallbackMessage);
      }
      return asyncFunction(...args);
    },
    [asyncFunction, isOffline, fallbackMessage]
  ) as T;

  return Object.assign(wrappedFunction, { isOffline });
}

export default useOffline;

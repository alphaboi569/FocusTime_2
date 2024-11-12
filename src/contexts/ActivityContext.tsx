import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { getDB } from '../database';

interface ActivityContextType {
  startTimer: (type: 'work' | 'break', durationMinutes: number, presetId: string) => Promise<void>;
  completeTimer: (sessionId: number) => Promise<void>;
  recordCycle: (workSessionId: number, breakSessionId: number) => Promise<void>;
  trackSiteVisit: (siteUrl: string) => Promise<() => Promise<void>>;
  isReady: boolean;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [db, setDB] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    getDB().then(database => {
      setDB(database);
      setIsReady(true);
    });
  }, []);

  const startTimer = useCallback(async (type: 'work' | 'break', durationMinutes: number, presetId: string) => {
    if (!db) return;
    return db.startTimerSession(type, durationMinutes, presetId);
  }, [db]);

  const completeTimer = useCallback(async (sessionId: number) => {
    if (!db) return;
    return db.completeTimerSession(sessionId);
  }, [db]);

  const recordCycle = useCallback(async (workSessionId: number, breakSessionId: number) => {
    if (!db) return;
    return db.recordCompletedCycle(workSessionId, breakSessionId);
  }, [db]);

  const trackSiteVisit = useCallback(async (siteUrl: string) => {
    if (!db) return () => Promise.resolve();
    const visitId = db.startSiteVisit(siteUrl);
    return async () => {
      await db.endSiteVisit(visitId);
    };
  }, [db]);

  return (
    <ActivityContext.Provider value={{
      startTimer,
      completeTimer,
      recordCycle,
      trackSiteVisit,
      isReady
    }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
};
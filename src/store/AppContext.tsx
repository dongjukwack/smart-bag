import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { AppState, IncidentActionState, AuthState, SettingsState } from '../types';
import { initialMockState, missingSuspectedMockState } from './mockData';
import {
  defaultAuthState,
  getInitialSupabaseAuthState,
  isSupabaseConfigured,
  sessionToAuthState,
  signInWithSupabasePassword,
  signOutFromSupabase,
  subscribeToSupabaseAuthChanges,
} from '../lib/supabase';

interface AppContextType {
  auth: AuthState;
  setAuth: (auth: AuthState) => void;
  authReady: boolean;
  loginWithPassword: (email: string, password: string) => Promise<AuthState>;
  logout: () => Promise<void>;
  appState: AppState;
  setAppState: (state: AppState) => void;
  settings: SettingsState;
  updateSettings: (partial: Partial<SettingsState>) => void;
  triggerMissingScenario: () => void;
  triggerNormalScenario: () => void;
  updateIncidentState: (incidentId: string, newState: IncidentActionState, memo?: string) => void;
  markIncidentRead: (incidentId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultSettings: SettingsState = {
  loudAlarm: true,
  voiceGuide: true,
  locationSharing: 'emergency',
  pushNotification: true,
  smsUrgent: true,
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuthState] = useState<AuthState>(defaultAuthState);
  const [authReady, setAuthReady] = useState(!isSupabaseConfigured);

  const [appState, setAppState] = useState<AppState>(initialMockState);
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);

  const setAuth = useCallback((nextAuth: AuthState) => {
    setAuthState(nextAuth);
  }, []);

  useEffect(() => {
    let disposed = false;

    if (!isSupabaseConfigured) {
      setAuthReady(true);
      return undefined;
    }

    const syncAuth = async () => {
      try {
        const nextAuth = await getInitialSupabaseAuthState();
        if (!disposed) {
          setAuthState(nextAuth);
          setAuthReady(true);
        }
      } catch {
        if (!disposed) {
          setAuthState(defaultAuthState);
          setAuthReady(true);
        }
      }
    };

    void syncAuth();

    const unsubscribe = subscribeToSupabaseAuthChanges((session) => {
      void (async () => {
        if (disposed) return;
        const nextAuth = session
          ? await sessionToAuthState(session)
          : defaultAuthState;
        if (!disposed) {
          setAuthState(nextAuth);
          setAuthReady(true);
        }
      })();
    });

    return () => {
      disposed = true;
      unsubscribe();
    };
  }, []);

  const loginWithPassword = useCallback(async (email: string, password: string) => {
    const nextAuth = await signInWithSupabasePassword(email, password);
    setAuthState(nextAuth);
    return nextAuth;
  }, []);

  const logout = useCallback(async () => {
    await signOutFromSupabase();
    setAuthState(defaultAuthState);
    setAppState(initialMockState);
  }, []);

  const updateSettings = useCallback((partial: Partial<SettingsState>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  }, []);

  const triggerMissingScenario = useCallback(() => {
    setAppState(missingSuspectedMockState);
  }, []);

  const triggerNormalScenario = useCallback(() => {
    setAppState(initialMockState);
  }, []);

  const updateIncidentState = useCallback((incidentId: string, newState: IncidentActionState, memo?: string) => {
    setAppState(prev => ({
      ...prev,
      incidents: prev.incidents.map(i =>
        i.id === incidentId
          ? { ...i, actionState: newState, ...(memo !== undefined ? { caregiverMemo: memo } : {}) }
          : i
      ),
    }));
  }, []);

  const markIncidentRead = useCallback((incidentId: string) => {
    setAppState(prev => ({
      ...prev,
      incidents: prev.incidents.map(i =>
        i.id === incidentId ? { ...i, isRead: true } : i
      ),
    }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        auth, setAuth,
        authReady, loginWithPassword, logout,
        appState, setAppState,
        settings, updateSettings,
        triggerMissingScenario, triggerNormalScenario,
        updateIncidentState, markIncidentRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

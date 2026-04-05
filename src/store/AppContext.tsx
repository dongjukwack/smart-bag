import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { AppState, IncidentActionState, AuthState, SettingsState } from '../types';
import { initialMockState, missingSuspectedMockState, defaultSettings } from './mockData';
import {
  defaultAuthState,
  getInitialSupabaseAuthState,
  isSupabaseConfigured,
  sessionToAuthState,
  signInWithSupabasePassword,
  signOutFromSupabase,
  subscribeToSupabaseAuthChanges,
} from '../lib/supabase';
import {
  loadSupabaseBootstrap,
  persistIncidentPatch,
  persistSettings,
  persistUserStatus,
} from '../lib/supabase-data';

interface AppContextType {
  auth: AuthState;
  /** 개발 전용 모크 로그인 (Supabase 미세팅 시) */
  loginAsMock: (role: 'ELDER' | 'CAREGIVER') => void;
  authReady: boolean;
  loginWithPassword: (email: string, password: string) => Promise<AuthState>;
  logout: () => Promise<void>;
  appState: AppState;
  settings: SettingsState;
  updateSettings: (partial: Partial<SettingsState>) => void;
  triggerMissingScenario: () => void;
  triggerNormalScenario: () => void;
  updateIncidentState: (incidentId: string, newState: IncidentActionState, memo?: string) => void;
  markIncidentRead: (incidentId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuthState] = useState<AuthState>(defaultAuthState);
  const [authReady, setAuthReady] = useState(!isSupabaseConfigured);

  const [appState, setAppState] = useState<AppState>(initialMockState);
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);

  const loginAsMock = useCallback((role: 'ELDER' | 'CAREGIVER') => {
    setAuthState({ isAuthenticated: true, role, accessToken: null, userId: null, email: null });
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
    setSettings(defaultSettings);
  }, []);

  useEffect(() => {
    let disposed = false;

    const syncData = async () => {
      if (!authReady || !auth.isAuthenticated) {
        if (!disposed) {
          setAppState(initialMockState);
          setSettings(defaultSettings);
        }
        return;
      }

      if (!isSupabaseConfigured) return;

      try {
        const bootstrap = await loadSupabaseBootstrap(auth);
        if (!disposed) {
          setAppState(bootstrap.appState);
          setSettings(bootstrap.settings);
        }
      } catch {
        if (!disposed) {
          setAppState(initialMockState);
          setSettings(defaultSettings);
        }
      }
    };

    void syncData();

    return () => {
      disposed = true;
    };
  }, [auth, authReady]);

  const updateSettings = useCallback((partial: Partial<SettingsState>) => {
    setSettings(prev => {
      const next = { ...prev, ...partial };
      void persistSettings(auth, next).catch(() => undefined);
      return next;
    });
  }, [auth]);

  const triggerMissingScenario = useCallback(() => {
    setAppState(missingSuspectedMockState);
    void persistUserStatus(auth, missingSuspectedMockState).catch(() => undefined);
  }, [auth]);

  const triggerNormalScenario = useCallback(() => {
    setAppState(initialMockState);
    void persistUserStatus(auth, initialMockState).catch(() => undefined);
  }, [auth]);

  const updateIncidentState = useCallback((incidentId: string, newState: IncidentActionState, memo?: string) => {
    setAppState(prev => ({
      ...prev,
      incidents: prev.incidents.map(i =>
        i.id === incidentId
          ? { ...i, actionState: newState, ...(memo !== undefined ? { caregiverMemo: memo } : {}) }
          : i
      ),
    }));
    void persistIncidentPatch(incidentId, {
      action_state: newState,
      ...(memo !== undefined ? { caregiver_memo: memo } : {}),
    }).catch(() => undefined);
  }, []);

  const markIncidentRead = useCallback((incidentId: string) => {
    setAppState(prev => ({
      ...prev,
      incidents: prev.incidents.map(i =>
        i.id === incidentId ? { ...i, isRead: true } : i
      ),
    }));
    void persistIncidentPatch(incidentId, { is_read: true }).catch(() => undefined);
  }, []);

  return (
    <AppContext.Provider
      value={{
        auth, loginAsMock,
        authReady, loginWithPassword, logout,
        appState,
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

import { createClient, type Session, type User } from '@supabase/supabase-js';
import type { AuthState, Role } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()
  || import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY?.trim()
  || import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const defaultAuthState: AuthState = {
  isAuthenticated: false,
  role: null,
  accessToken: null,
  userId: null,
  email: null,
};

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabasePublishableKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export const getSupabaseConfigError = () =>
  'Supabase 환경 변수가 없습니다. VITE_SUPABASE_URL 과 VITE_SUPABASE_PUBLISHABLE_KEY 를 설정해 주세요.';

const normalizeRole = (value: unknown): Role => {
  if (typeof value !== 'string') return null;

  const normalized = value.trim().toUpperCase();
  if (normalized === 'ELDER' || normalized === 'SENIOR') return 'ELDER';
  if (normalized === 'CAREGIVER' || normalized === 'GUARDIAN') return 'CAREGIVER';
  return null;
};

const getRoleFromUser = async (user: User): Promise<Role> => {
  const directRole = normalizeRole(
    user.user_metadata?.role
    ?? user.user_metadata?.app_role
    ?? user.app_metadata?.role
    ?? user.app_metadata?.app_role,
  );

  if (directRole) return directRole;
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (error) return null;
  return normalizeRole(data?.role);
};

export const sessionToAuthState = async (session: Session | null): Promise<AuthState> => {
  if (!session?.user) return defaultAuthState;

  const role = await getRoleFromUser(session.user);
  return {
    isAuthenticated: true,
    role,
    accessToken: session.access_token,
    userId: session.user.id,
    email: session.user.email ?? null,
  };
};

export const getInitialSupabaseAuthState = async (): Promise<AuthState> => {
  if (!supabase) return defaultAuthState;

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) throw error;
  return sessionToAuthState(session);
};

export const subscribeToSupabaseAuthChanges = (
  callback: (session: Session | null) => void,
) => {
  if (!supabase) return () => undefined;

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });

  return () => subscription.unsubscribe();
};

export const signInWithSupabasePassword = async (email: string, password: string) => {
  if (!supabase) {
    throw new Error(getSupabaseConfigError());
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  const authState = await sessionToAuthState(data.session);
  if (!authState.role) {
    await supabase.auth.signOut();
    throw new Error('사용자 역할을 찾을 수 없습니다. user metadata 또는 profiles.role 에 ELDER/CAREGIVER 를 설정해 주세요.');
  }

  return authState;
};

export const signOutFromSupabase = async () => {
  if (!supabase) return;

  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

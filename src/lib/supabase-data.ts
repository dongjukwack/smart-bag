import type {
  AppState,
  AuthState,
  ConnectionStatus,
  IncidentActionState,
  IncidentItem,
  IncidentType,
  SettingsState,
  UserStatusType,
} from '../types';
import { initialMockState, defaultSettings } from '../store/mockData';
import { isSupabaseConfigured, supabase } from './supabase';

type DbDeviceStateRow = {
  user_id: string;
  connection_status: string;
  battery_level: number;
  last_sync_at: string | null;
  location_permission: boolean;
  notification_permission: boolean;
  last_connected_address: string | null;
  last_connected_at: string | null;
  last_connected_lat: number | null;
  last_connected_lng: number | null;
};

type DbUserStatusRow = {
  user_id: string;
  status: string;
  message_title: string;
  message_desc: string;
  missing_items: unknown;
  user_location_address: string | null;
  user_location_at: string | null;
  user_location_lat: number | null;
  user_location_lng: number | null;
};

type DbIncidentRow = {
  id: string;
  user_id: string;
  type: string;
  title: string;
  occurred_at: string;
  is_read: boolean;
  action_state: string | null;
  caregiver_memo: string | null;
  location_context: {
    userLocation?: string;
    userLat?: number;
    userLng?: number;
    bagLocation?: string;
    bagLat?: number;
    bagLng?: number;
  } | null;
};

type DbSettingsRow = {
  user_id: string;
  loud_alarm: boolean;
  voice_guide: boolean;
  location_sharing: SettingsState['locationSharing'];
  push_notification: boolean;
  sms_urgent: boolean;
};

const timeFormatter = new Intl.DateTimeFormat('ko-KR', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'Asia/Seoul',
});

const knownConnectionStatuses: ConnectionStatus[] = [
  'bagConnected',
  'connectionLost',
  'locationUnavailable',
  'learning',
];

const knownUserStatuses: UserStatusType[] = [
  'NORMAL',
  'NEEDS_RECHECK',
  'MISSING_SUSPECTED',
  'DEVICE_CHECK',
];

const knownIncidentTypes: IncidentType[] = [
  'NORMAL',
  'RECHECK',
  'MISSING_SUSPECTED',
  'CAREGIVER_NOTIFIED',
  'RESOLVED',
  'DISCONNECTED',
  'LOCATION_SAVED',
];

const knownIncidentActionStates: IncidentActionState[] = [
  'open',
  'userRechecking',
  'caregiverAcknowledged',
  'resolved',
];

const formatTimeLabel = (value?: string | null, fallback = initialMockState.system.lastSyncTime) => {
  if (!value) return fallback;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return timeFormatter.format(date);
};

const buildTodayIsoFromTime = (time: string) => {
  const [hours = '08', minutes = '42'] = time.split(':');
  const now = new Date();
  const seeded = new Date(now);
  seeded.setHours(Number(hours), Number(minutes), 0, 0);
  return seeded.toISOString();
};

const normalizeConnectionStatus = (value: string | null | undefined): ConnectionStatus =>
  knownConnectionStatuses.includes((value ?? '') as ConnectionStatus)
    ? (value as ConnectionStatus)
    : initialMockState.system.status;

const normalizeUserStatus = (value: string | null | undefined): UserStatusType =>
  knownUserStatuses.includes((value ?? '') as UserStatusType)
    ? (value as UserStatusType)
    : initialMockState.userStatus.status;

const normalizeIncidentType = (value: string | null | undefined): IncidentType =>
  knownIncidentTypes.includes((value ?? '') as IncidentType)
    ? (value as IncidentType)
    : 'NORMAL';

const normalizeIncidentActionState = (value: string | null | undefined): IncidentActionState | undefined =>
  knownIncidentActionStates.includes((value ?? '') as IncidentActionState)
    ? (value as IncidentActionState)
    : undefined;

const toSettingsState = (row: DbSettingsRow | null): SettingsState => {
  if (!row) return defaultSettings;
  return {
    loudAlarm: row.loud_alarm,
    voiceGuide: row.voice_guide,
    locationSharing: row.location_sharing,
    pushNotification: row.push_notification,
    smsUrgent: row.sms_urgent,
  };
};

const toSettingsRow = (userId: string, settings: SettingsState): DbSettingsRow => ({
  user_id: userId,
  loud_alarm: settings.loudAlarm,
  voice_guide: settings.voiceGuide,
  location_sharing: settings.locationSharing,
  push_notification: settings.pushNotification,
  sms_urgent: settings.smsUrgent,
});

const toIncidentItem = (row: DbIncidentRow): IncidentItem => ({
  id: row.id,
  type: normalizeIncidentType(row.type),
  title: row.title,
  time: formatTimeLabel(row.occurred_at),
  isRead: row.is_read,
  actionState: normalizeIncidentActionState(row.action_state),
  caregiverMemo: row.caregiver_memo ?? undefined,
  locationContext: row.location_context
    ? {
        userLocation: row.location_context.userLocation ?? initialMockState.incidents[0]?.locationContext?.userLocation ?? '알 수 없음',
        userLat: row.location_context.userLat,
        userLng: row.location_context.userLng,
        bagLocation: row.location_context.bagLocation ?? initialMockState.system.lastConnectedLocation?.address ?? '알 수 없음',
        bagLat: row.location_context.bagLat,
        bagLng: row.location_context.bagLng,
      }
    : undefined,
});

const toAppState = (
  deviceRow: DbDeviceStateRow | null,
  statusRow: DbUserStatusRow | null,
  incidentRows: DbIncidentRow[],
): AppState => ({
  system: {
    status: normalizeConnectionStatus(deviceRow?.connection_status),
    batteryLevel: deviceRow?.battery_level ?? initialMockState.system.batteryLevel,
    lastSyncTime: formatTimeLabel(deviceRow?.last_sync_at),
    locationPermission: deviceRow?.location_permission ?? initialMockState.system.locationPermission,
    notificationPermission: deviceRow?.notification_permission ?? initialMockState.system.notificationPermission,
    lastConnectedLocation: {
      address: deviceRow?.last_connected_address ?? initialMockState.system.lastConnectedLocation?.address ?? '알 수 없음',
      timestamp: formatTimeLabel(deviceRow?.last_connected_at),
      lat: deviceRow?.last_connected_lat ?? initialMockState.system.lastConnectedLocation?.lat,
      lng: deviceRow?.last_connected_lng ?? initialMockState.system.lastConnectedLocation?.lng,
    },
  },
  userStatus: {
    status: normalizeUserStatus(statusRow?.status),
    messageTitle: statusRow?.message_title ?? initialMockState.userStatus.messageTitle,
    messageDesc: statusRow?.message_desc ?? initialMockState.userStatus.messageDesc,
    missingItems: Array.isArray(statusRow?.missing_items)
      ? statusRow!.missing_items as AppState['userStatus']['missingItems']
      : initialMockState.userStatus.missingItems,
    userCurrentLocation: {
      address: statusRow?.user_location_address ?? initialMockState.userStatus.userCurrentLocation?.address ?? '알 수 없음',
      timestamp: formatTimeLabel(statusRow?.user_location_at),
      lat: statusRow?.user_location_lat ?? initialMockState.userStatus.userCurrentLocation?.lat,
      lng: statusRow?.user_location_lng ?? initialMockState.userStatus.userCurrentLocation?.lng,
    },
  },
  incidents: incidentRows.map(toIncidentItem),
});

const createDefaultDeviceRow = (elderId: string): DbDeviceStateRow => ({
  user_id: elderId,
  connection_status: initialMockState.system.status,
  battery_level: initialMockState.system.batteryLevel,
  last_sync_at: buildTodayIsoFromTime(initialMockState.system.lastSyncTime),
  location_permission: initialMockState.system.locationPermission,
  notification_permission: initialMockState.system.notificationPermission,
  last_connected_address: initialMockState.system.lastConnectedLocation?.address ?? null,
  last_connected_at: buildTodayIsoFromTime(initialMockState.system.lastConnectedLocation?.timestamp ?? initialMockState.system.lastSyncTime),
  last_connected_lat: initialMockState.system.lastConnectedLocation?.lat ?? null,
  last_connected_lng: initialMockState.system.lastConnectedLocation?.lng ?? null,
});

const createDefaultUserStatusRow = (elderId: string): DbUserStatusRow => ({
  user_id: elderId,
  status: initialMockState.userStatus.status,
  message_title: initialMockState.userStatus.messageTitle,
  message_desc: initialMockState.userStatus.messageDesc,
  missing_items: initialMockState.userStatus.missingItems,
  user_location_address: initialMockState.userStatus.userCurrentLocation?.address ?? null,
  user_location_at: buildTodayIsoFromTime(initialMockState.userStatus.userCurrentLocation?.timestamp ?? initialMockState.system.lastSyncTime),
  user_location_lat: initialMockState.userStatus.userCurrentLocation?.lat ?? null,
  user_location_lng: initialMockState.userStatus.userCurrentLocation?.lng ?? null,
});

const createDefaultIncidentRows = (elderId: string): DbIncidentRow[] =>
  initialMockState.incidents.map((incident) => ({
    id: incident.id,
    user_id: elderId,
    type: incident.type,
    title: incident.title,
    occurred_at: buildTodayIsoFromTime(incident.time),
    is_read: incident.isRead,
    action_state: incident.actionState ?? null,
    caregiver_memo: incident.caregiverMemo ?? null,
    location_context: incident.locationContext ?? null,
  }));

const resolveElderIdForAuth = async (auth: AuthState): Promise<string | null> => {
  if (!auth.userId) return null;
  if (auth.role === 'ELDER') return auth.userId;
  if (auth.role !== 'CAREGIVER' || !supabase) return null;

  const { data, error } = await supabase
    .from('care_links')
    .select('elder_id')
    .eq('caregiver_id', auth.userId)
    .order('is_primary', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data?.elder_id ?? null;
};

const ensureSettingsRow = async (auth: AuthState) => {
  if (!supabase || !auth.userId) return;

  const { data, error } = await supabase
    .from('app_settings')
    .select('user_id')
    .eq('user_id', auth.userId)
    .maybeSingle();

  if (error) throw error;
  if (data) return;

  const { error: upsertError } = await supabase
    .from('app_settings')
    .upsert(toSettingsRow(auth.userId, defaultSettings), { onConflict: 'user_id' });

  if (upsertError) throw upsertError;
};

const ensureElderSeedRows = async (elderId: string) => {
  if (!supabase) return;

  const [{ data: deviceRow, error: deviceError }, { data: statusRow, error: statusError }, { data: incidentRows, error: incidentError }] = await Promise.all([
    supabase.from('device_states').select('user_id').eq('user_id', elderId).maybeSingle(),
    supabase.from('user_statuses').select('user_id').eq('user_id', elderId).maybeSingle(),
    supabase.from('incidents').select('id').eq('user_id', elderId).limit(1),
  ]);

  if (deviceError) throw deviceError;
  if (statusError) throw statusError;
  if (incidentError) throw incidentError;

  if (!deviceRow) {
    const { error } = await supabase.from('device_states').upsert(createDefaultDeviceRow(elderId), { onConflict: 'user_id' });
    if (error) throw error;
  }

  if (!statusRow) {
    const { error } = await supabase.from('user_statuses').upsert(createDefaultUserStatusRow(elderId), { onConflict: 'user_id' });
    if (error) throw error;
  }

  if (!incidentRows || incidentRows.length === 0) {
    const { error } = await supabase.from('incidents').upsert(createDefaultIncidentRows(elderId), { onConflict: 'id' });
    if (error) throw error;
  }
};

export const loadSupabaseBootstrap = async (auth: AuthState): Promise<{ appState: AppState; settings: SettingsState }> => {
  if (!isSupabaseConfigured || !supabase || !auth.isAuthenticated || !auth.userId) {
    return { appState: initialMockState, settings: defaultSettings };
  }

  await ensureSettingsRow(auth);
  const elderId = await resolveElderIdForAuth(auth);

  if (auth.role === 'ELDER' && elderId) {
    await ensureElderSeedRows(elderId);
  }

  const [settingsResult, deviceResult, statusResult, incidentsResult] = await Promise.all([
    supabase.from('app_settings').select('*').eq('user_id', auth.userId).maybeSingle(),
    elderId ? supabase.from('device_states').select('*').eq('user_id', elderId).maybeSingle() : Promise.resolve({ data: null, error: null }),
    elderId ? supabase.from('user_statuses').select('*').eq('user_id', elderId).maybeSingle() : Promise.resolve({ data: null, error: null }),
    elderId
      ? supabase.from('incidents').select('*').eq('user_id', elderId).order('occurred_at', { ascending: false })
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (settingsResult.error) throw settingsResult.error;
  if (deviceResult.error) throw deviceResult.error;
  if (statusResult.error) throw statusResult.error;
  if (incidentsResult.error) throw incidentsResult.error;

  return {
    appState: toAppState(deviceResult.data as DbDeviceStateRow | null, statusResult.data as DbUserStatusRow | null, (incidentsResult.data ?? []) as DbIncidentRow[]),
    settings: toSettingsState(settingsResult.data as DbSettingsRow | null),
  };
};

export const persistSettings = async (auth: AuthState, settings: SettingsState) => {
  if (!isSupabaseConfigured || !supabase || !auth.userId) return;

  const { error } = await supabase
    .from('app_settings')
    .upsert(toSettingsRow(auth.userId, settings), { onConflict: 'user_id' });

  if (error) throw error;
};

export const persistIncidentPatch = async (
  incidentId: string,
  patch: Partial<Pick<DbIncidentRow, 'is_read' | 'action_state' | 'caregiver_memo'>>,
) => {
  if (!isSupabaseConfigured || !supabase) return;

  const { error } = await supabase
    .from('incidents')
    .update(patch)
    .eq('id', incidentId);

  if (error) throw error;
};

export const persistUserStatus = async (auth: AuthState, appState: AppState) => {
  if (!isSupabaseConfigured || !supabase || auth.role !== 'ELDER' || !auth.userId) return;

  const { error } = await supabase
    .from('user_statuses')
    .upsert({
      user_id: auth.userId,
      status: appState.userStatus.status,
      message_title: appState.userStatus.messageTitle,
      message_desc: appState.userStatus.messageDesc,
      missing_items: appState.userStatus.missingItems,
      user_location_address: appState.userStatus.userCurrentLocation?.address ?? null,
      user_location_at: buildTodayIsoFromTime(appState.userStatus.userCurrentLocation?.timestamp ?? initialMockState.system.lastSyncTime),
      user_location_lat: appState.userStatus.userCurrentLocation?.lat ?? null,
      user_location_lng: appState.userStatus.userCurrentLocation?.lng ?? null,
    }, { onConflict: 'user_id' });

  if (error) throw error;
};

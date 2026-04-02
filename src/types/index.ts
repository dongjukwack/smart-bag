// src/types/index.ts

export type Role = 'ELDER' | 'CAREGIVER' | null;

export interface AuthState {
  isAuthenticated: boolean;
  role: Role;
  accessToken: string | null;
  userId: string | null;
  email: string | null;
}

export interface SettingsState {
  loudAlarm: boolean;
  voiceGuide: boolean;
  locationSharing: 'always' | 'emergency' | 'off';
  pushNotification: boolean;
  smsUrgent: boolean;
}

export type ConnectionStatus = 'bagConnected' | 'connectionLost' | 'locationUnavailable' | 'learning';

export interface SystemState {
  status: ConnectionStatus;
  batteryLevel: number;
  lastSyncTime: string;
  locationPermission: boolean;
  notificationPermission: boolean;
  lastConnectedLocation?: {
    address: string;
    timestamp: string;
    lat?: number;
    lng?: number;
  };
}

export type UserStatusType = 'NORMAL' | 'NEEDS_RECHECK' | 'MISSING_SUSPECTED' | 'DEVICE_CHECK';

export interface MissingItem {
  id: string;
  name: string;
  reason: string;
}

export interface UserStatus {
  status: UserStatusType;
  messageTitle: string;
  messageDesc: string;
  missingItems: MissingItem[];
  userCurrentLocation?: {
    address: string;
    timestamp: string;
    lat?: number;
    lng?: number;
  };
}

export type IncidentActionState = 'open' | 'userRechecking' | 'caregiverAcknowledged' | 'resolved';
export type IncidentType = 'NORMAL' | 'RECHECK' | 'MISSING_SUSPECTED' | 'CAREGIVER_NOTIFIED' | 'RESOLVED' | 'DISCONNECTED' | 'LOCATION_SAVED';

export interface IncidentItem {
  id: string;
  type: IncidentType;
  title: string;
  time: string;
  isRead: boolean;
  actionState?: IncidentActionState;
  locationContext?: {
    userLocation: string;
    userLat?: number;
    userLng?: number;
    bagLocation: string;
    bagLat?: number;
    bagLng?: number;
  };
  caregiverMemo?: string;
}

export interface AppState {
  system: SystemState;
  userStatus: UserStatus;
  incidents: IncidentItem[];
}

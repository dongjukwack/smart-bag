import type { AppState, SettingsState } from '../types';

export const defaultSettings: SettingsState = {
  loudAlarm: true,
  voiceGuide: true,
  locationSharing: 'emergency',
  pushNotification: true,
  smsUrgent: true,
};

export const initialMockState: AppState = {
  system: {
    status: 'bagConnected',
    batteryLevel: 85,
    lastSyncTime: '08:42',
    locationPermission: true,
    notificationPermission: true,
    lastConnectedLocation: {
      address: '자택',
      timestamp: '08:42',
      lat: 37.5665,
      lng: 126.9780
    }
  },
  userStatus: {
    status: 'NORMAL',
    messageTitle: '준비 완료',
    messageDesc: '필수 물품이 모두 가방에 있어요.',
    missingItems: [],
    userCurrentLocation: {
      address: '자택',
      timestamp: '08:42',
      lat: 37.5665,
      lng: 126.9780
    }
  },
  incidents: [
    {
      id: 'i-1',
      type: 'MISSING_SUSPECTED',
      title: '약통 누락 의심',
      time: '08:46',
      isRead: false,
      actionState: 'open',
      locationContext: {
        userLocation: '산책로 입구',
        userLat: 37.5680,
        userLng: 126.9805,
        bagLocation: '자택',
        bagLat: 37.5665,
        bagLng: 126.9780
      }
    },
    {
      id: 'i-2',
      type: 'RESOLVED',
      title: '다시 확인 후 정상',
      time: '08:46',
      isRead: true,
      actionState: 'resolved'
    },
    {
      id: 'i-3',
      type: 'NORMAL',
      title: '외출 완료',
      time: '08:46',
      isRead: true
    }
  ]
};

export const missingSuspectedMockState: AppState = {
  ...initialMockState,
  userStatus: {
    status: 'MISSING_SUSPECTED',
    messageTitle: '다시 확인이 필요해요',
    messageDesc: '빠진 물건이 있을 수 있어요',
    missingItems: [
      { id: 'm-1', name: '약통', reason: '평소 월요일보다 가방 무게가 가벼워요' },
      { id: 'm-2', name: '지갑', reason: '챙기지 않은 것 같아요' }
    ],
    userCurrentLocation: {
      address: '현관 앞',
      timestamp: '08:45',
      lat: 37.5670,
      lng: 126.9785
    }
  }
};

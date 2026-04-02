import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Button, Toast } from 'antd-mobile';
import { ArrowLeft, Navigation, PhoneCall } from 'lucide-react';

// Fix leaflet default icon issue in Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
const DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const UserIcon = L.divIcon({
  className: 'custom-map-icon',
  html: `<div style="background:#2563eb;width:36px;height:36px;border-radius:50%;border:3px solid white;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 10px rgba(0,0,0,0.3)"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

const BagIcon = L.divIcon({
  className: 'custom-map-icon',
  html: `<div style="background:#ef4444;width:36px;height:36px;border-radius:50%;border:3px solid white;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 10px rgba(0,0,0,0.3)"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M4 10v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10"/><path d="M4 10a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/></svg></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

const RecenterMap = ({ bounds }: { bounds: L.LatLngBounds }) => {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [map, bounds]);
  return null;
};

export const IncidentMapViewer: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { appState, auth } = useApp();

  const incident = id ? appState.incidents.find(i => i.id === id) : null;

  let uLat: number, uLng: number, bLat: number, bLng: number;
  let uStr: string, bStr: string;

  if (incident?.locationContext) {
    uLat = incident.locationContext.userLat ?? 37.5665;
    uLng = incident.locationContext.userLng ?? 126.978;
    bLat = incident.locationContext.bagLat ?? 37.5665;
    bLng = incident.locationContext.bagLng ?? 126.978;
    uStr = incident.locationContext.userLocation;
    bStr = incident.locationContext.bagLocation;
  } else {
    uLat = appState.userStatus.userCurrentLocation?.lat ?? 37.5665;
    uLng = appState.userStatus.userCurrentLocation?.lng ?? 126.978;
    bLat = appState.system.lastConnectedLocation?.lat ?? 37.5665;
    bLng = appState.system.lastConnectedLocation?.lng ?? 126.978;
    uStr = appState.userStatus.userCurrentLocation?.address ?? '알 수 없음';
    bStr = appState.system.lastConnectedLocation?.address ?? '알 수 없음';
  }

  const bounds = L.latLngBounds([uLat, uLng], [bLat, bLng]);

  return (
    <div className="relative w-full h-screen flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-[1000] px-5 pt-12 pb-3" style={{ background: 'linear-gradient(rgba(255,255,255,0.95), rgba(255,255,255,0))' }}>
        <button
          onClick={() => navigate(-1)}
          className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-md text-gray-700 active:scale-95 transition-transform"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer bounds={bounds} zoom={15} style={{ width: '100%', height: '100%' }} zoomControl={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
          <RecenterMap bounds={bounds} />
          <Polyline positions={[[uLat, uLng], [bLat, bLng]]} color="#2563eb" dashArray="5, 10" weight={3} />
          <Marker position={[bLat, bLng]} icon={BagIcon}>
            <Popup><b>가방 마지막 위치</b><br />{bStr}</Popup>
          </Marker>
          <Marker position={[uLat, uLng]} icon={UserIcon}>
            <Popup><b>{auth.role === 'ELDER' ? '내 위치' : '보호 대상자 위치'}</b><br />{uStr}</Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Bottom Card */}
      <div className="absolute bottom-6 left-4 right-4 bg-white rounded-2xl p-5 shadow-xl z-[1000] safe-area-bottom">
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          {auth.role === 'ELDER' ? '내 위치와 가방' : '김영수 님과 가방 위치'}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          가방: {bStr} / 스마트폰: {uStr}
        </p>

        {auth.role === 'CAREGIVER' && incident?.actionState !== 'resolved' && (
          <div className="flex gap-3">
            <Button
              size="large"
              onClick={() => { Toast.show({ content: '전화 연결 중...', position: 'bottom' }); }}
              style={{ flex: 1, borderRadius: '12px', fontWeight: 700, border: '1.5px solid #e5e7eb' }}
            >
              <span className="flex items-center justify-center gap-2"><PhoneCall size={18} /> 전화</span>
            </Button>
            <Button
              color="primary"
              size="large"
              onClick={() => navigate(-1)}
              style={{ flex: 1, borderRadius: '12px', fontWeight: 700 }}
            >
              상세화면 복귀
            </Button>
          </div>
        )}

        {auth.role === 'ELDER' && (
          <Button
            block
            color="primary"
            size="large"
            onClick={() => { Toast.show({ content: '길찾기 기능은 Google Maps 연동 후 사용 가능합니다', position: 'bottom' }); }}
            style={{ borderRadius: '12px', fontWeight: 700 }}
          >
            <span className="flex items-center justify-center gap-2"><Navigation size={18} /> 가방 위치로 길찾기</span>
          </Button>
        )}
      </div>
    </div>
  );
};

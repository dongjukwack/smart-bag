import React from 'react';
import { useApp } from '../../store/AppContext';
import { useNavigate } from 'react-router-dom';
import { NavBar, Card, ProgressBar } from 'antd-mobile';
import { Battery, MapPin, Wifi, WifiOff } from 'lucide-react';

export const GuardianDevice: React.FC = () => {
  const { appState } = useApp();
  const { system } = appState;
  const navigate = useNavigate();
  const isConnected = system.status === 'bagConnected';

  return (
    <div className="animate-fade-in safe-area-top">
      <NavBar back={null} style={{ '--height': '56px' } as React.CSSProperties}>
        스마트 가방 상태
      </NavBar>

      <div className="app-page app-page-inner-top app-page-section pb-8">
        <Card
          className={`device-hero-card ${isConnected ? 'device-hero-card--connected' : 'device-hero-card--disconnected'}`}
          bodyStyle={{ padding: '20px' }}
        >
          <div className="device-hero-card__body">
            <div className={`device-hero-card__icon ${isConnected ? 'device-hero-card__icon--connected' : 'device-hero-card__icon--disconnected'}`}>
              {isConnected
                ? <Wifi size={26} className="text-green-600" />
                : <WifiOff size={26} className="text-red-500" />}
            </div>
            <div className="device-hero-card__content">
              <p className="device-hero-card__eyebrow">스마트 가방 연결</p>
              <h2 className="device-hero-card__title">{isConnected ? '정상 연결됨' : '연결 끊김'}</h2>
              <p className="device-hero-card__time">마지막 동기화 {system.lastSyncTime}</p>
            </div>
          </div>
        </Card>

        <Card className="device-detail-panel" bodyStyle={{ padding: '20px' }}>
          <div className="device-detail-panel__header">
            <div className="device-detail-panel__heading">
              <div className="device-detail-panel__icon device-detail-panel__icon--blue" aria-hidden="true">
                <Battery size={18} />
              </div>
              <div>
                <p className="device-detail-panel__eyebrow">배터리</p>
                <p className="device-detail-panel__title">전원 상태</p>
              </div>
            </div>
            <div className="device-detail-panel__value device-detail-panel__value--blue">{system.batteryLevel}%</div>
          </div>
          <div className="device-battery-card">
            <ProgressBar
              percent={system.batteryLevel}
              style={{
                '--fill-color': system.batteryLevel > 20 ? '#2563eb' : '#ef4444',
                '--track-color': '#dbeafe',
                '--track-width': '10px',
              } as React.CSSProperties}
            />
            <p className="device-battery-card__caption">
              {system.batteryLevel > 20 ? '충분한 배터리' : '충전이 필요합니다'}
            </p>
          </div>
        </Card>

        <Card
          className="device-detail-panel"
          bodyStyle={{ padding: '20px' }}
          onClick={() => navigate('/map')}
          style={{ cursor: 'pointer' }}
        >
          <div className="device-detail-panel__header">
            <div className="device-detail-panel__heading">
              <div className="device-detail-panel__icon device-detail-panel__icon--blue" aria-hidden="true">
                <MapPin size={18} />
              </div>
              <div>
                <p className="device-detail-panel__eyebrow">마지막 위치</p>
                <p className="device-detail-panel__title">연결 기준 지점</p>
              </div>
            </div>
            <span className="device-detail-panel__link">지도 보기</span>
          </div>
          <div className="device-location-card">
            <div className="device-location-card__icon" aria-hidden="true">
              <MapPin size={22} className="text-blue-600" />
            </div>
            <div className="device-location-card__content">
              <p className="device-location-card__address">{system.lastConnectedLocation?.address || '알 수 없음'}</p>
              <p className="device-location-card__time">{system.lastConnectedLocation?.timestamp || system.lastSyncTime}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

import React from 'react';
import { useApp } from '../../store/AppContext';
import { useNavigate } from 'react-router-dom';
import { NavBar, Card, ProgressBar, Tag, Dialog } from 'antd-mobile';
import { Battery, MapPin, CheckCircle2, AlertTriangle, ChevronRight, Wifi, WifiOff, User, Bell, Share2, LogOut } from 'lucide-react';
import { AccountSummaryCard } from '../../components/AccountSummaryCard';
import { RowActionCard } from '../../components/RowActionCard';

// ========== Guardian Device ==========
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
        {/* Connection */}
        <Card className={`device-hero-card ${isConnected ? 'device-hero-card--connected' : 'device-hero-card--disconnected'}`} bodyStyle={{ padding: '20px' }}>
          <div className="device-hero-card__body">
            <div className={`device-hero-card__icon ${isConnected ? 'device-hero-card__icon--connected' : 'device-hero-card__icon--disconnected'}`}>
              {isConnected ? <Wifi size={26} className="text-green-600" /> : <WifiOff size={26} className="text-red-500" />}
            </div>
            <div className="device-hero-card__content">
              <p className="device-hero-card__eyebrow">스마트 가방 연결</p>
              <h2 className="device-hero-card__title">{isConnected ? '정상 연결됨' : '연결 끊김'}</h2>
              <p className="device-hero-card__time">마지막 동기화 {system.lastSyncTime}</p>
            </div>
          </div>
        </Card>

        {/* Battery */}
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
              style={{ '--fill-color': system.batteryLevel > 20 ? '#2563eb' : '#ef4444', '--track-color': '#dbeafe', '--track-width': '10px' } as React.CSSProperties}
            />
            <p className="device-battery-card__caption">{system.batteryLevel > 20 ? '충분한 배터리' : '충전이 필요합니다'}</p>
          </div>
        </Card>

        {/* Location */}
        <Card className="device-detail-panel" bodyStyle={{ padding: '20px' }} onClick={() => navigate('/map')} style={{ cursor: 'pointer' }}>
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

// ========== Guardian History ==========
export const GuardianHistory: React.FC = () => {
  const { appState, markIncidentRead } = useApp();
  const { incidents } = appState;
  const navigate = useNavigate();

  const handleClick = (id: string) => {
    markIncidentRead(id);
    navigate(`/guardian/incident/${id}`);
  };

  return (
    <div className="animate-fade-in safe-area-top">
      <NavBar back={null} style={{ '--height': '56px' } as React.CSSProperties}>
        사건 기록
      </NavBar>
      <div className="app-page app-page-inner-top pb-8">
        {incidents.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-base">아직 기록이 없어요.</div>
        ) : (
          <div className="flex flex-col gap-4 mt-4">
            {incidents.map((incident) => {
              const isWarning = incident.type === 'MISSING_SUSPECTED';
              const isResolved = incident.actionState === 'resolved';
              return (
                <Card
                  key={incident.id}
                  onClick={() => handleClick(incident.id)}
                  style={{ borderRadius: '14px', border: isWarning && !isResolved ? '1px solid #fecaca' : '1px solid #e5e7eb', cursor: 'pointer' }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      isWarning ? (isResolved ? 'bg-gray-100' : 'bg-red-50') : 'bg-blue-50'
                    }`}>
                      {isWarning
                        ? (isResolved ? <CheckCircle2 size={24} className="text-green-500" /> : <AlertTriangle size={24} className="text-red-500" />)
                        : <CheckCircle2 size={24} className="text-blue-500" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base font-bold text-gray-800 truncate">{incident.title}</span>
                        {!incident.isRead && <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">오전 {incident.time}</span>
                        {isResolved && <Tag color="success" fill="outline" style={{ fontSize: '11px' } as React.CSSProperties}>해결됨</Tag>}
                        {!isResolved && isWarning && <Tag color="danger" fill="outline" style={{ fontSize: '11px' } as React.CSSProperties}>확인 필요</Tag>}
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-300 shrink-0" />
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// ========== Guardian Settings ==========
export const GuardianSettings: React.FC = () => {
  const { logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await Dialog.confirm({ content: '로그아웃 하시겠습니까?', confirmText: '로그아웃', cancelText: '취소' });
    if (result) {
      await logout();
      navigate('/');
    }
  };

  return (
    <div className="animate-fade-in safe-area-top">
      <NavBar back={null} style={{ '--height': '56px' } as React.CSSProperties}>
        설정
      </NavBar>
      <div className="app-page app-page-inner-top app-page-section pb-8">
        {/* Profile */}
        <AccountSummaryCard
          label="보호자 계정"
          name="동주 님"
          accent="blue"
        />

        {/* Menu */}
        <div className="row-action-stack">
          {[
            { icon: <User size={18} className="text-blue-600" />, bg: 'bg-blue-50', label: '대상자 관리', path: '/guardian/settings/target' },
            { icon: <Bell size={18} className="text-amber-600" />, bg: 'bg-amber-50', label: '위급 알림 설정', path: '/guardian/settings/alerts' },
            { icon: <Share2 size={18} className="text-green-600" />, bg: 'bg-green-50', label: '사건 기록 내보내기', path: '/guardian/settings/export' },
          ].map((item) => (
            <RowActionCard
              key={item.label}
              title={item.label}
              leading={<div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center`}>{item.icon}</div>}
              onClick={() => navigate(item.path)}
            />
          ))}
        </div>

        <div className="settings-footer-stack">
          <div className="settings-meta-card">
            <div className="settings-meta-card__row">
              <span className="settings-meta-card__label">앱 버전</span>
              <span className="settings-meta-card__value">1.2.0</span>
            </div>
          </div>

          <button className="settings-logout-button" onClick={handleLogout}>
            <LogOut size={18} />
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
};

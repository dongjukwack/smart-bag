import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import { Card, Button, Tag, ProgressBar } from 'antd-mobile';
import { AlertTriangle, CheckCircle2, Battery, BarChart3, ArrowUpRight, Wifi, WifiOff } from 'lucide-react';
import { RowActionCard } from '../../components/RowActionCard';
import { MOCK_ELDER_NAME } from '../../store/mockData';

export const GuardianDashboard: React.FC = () => {
  const { appState } = useApp();
  const navigate = useNavigate();
  const { incidents, system } = appState;

  const urgentIncidents = incidents.filter(i =>
    i.actionState === 'open' || i.actionState === 'userRechecking'
  );

  return (
    <div className="app-page app-page-top app-page-section animate-fade-in safe-area-top">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <p className="text-base text-gray-400 font-medium">안녕하세요 보호자님</p>
        <h1 className="text-[28px] font-extrabold text-gray-900 leading-tight">
          {MOCK_ELDER_NAME} 모니터링
        </h1>
      </div>

      {/* Urgent Alert Cards */}
      {urgentIncidents.length > 0 ? (
        <div className="flex flex-col gap-4">
          {urgentIncidents.map(incident => (
            <Card
              key={incident.id}
              className="guardian-alert-panel"
              bodyStyle={{ padding: '20px' }}
            >
              <div className="guardian-alert-panel__body">
                <div className="guardian-alert-panel__icon" aria-hidden="true">
                  <AlertTriangle size={24} />
                </div>
                <div className="guardian-alert-panel__content">
                  <div className="guardian-alert-panel__status">⚠️ 확인 필요</div>
                  <div className="guardian-alert-panel__info">
                    <p className="guardian-alert-panel__title">{incident.title}</p>
                    <p className="guardian-alert-panel__time">오전 {incident.time} 감지</p>
                  </div>
                </div>
              </div>
              <div className="guardian-alert-panel__footer">
                <Button
                  block
                  color="primary"
                  size="large"
                  onClick={() => navigate(`/guardian/incident/${incident.id}`)}
                  style={{ borderRadius: '16px', fontWeight: 700 }}
                >
                  상세 보기
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card
          style={{ borderRadius: '16px', border: '1.5px solid #d1fae5', backgroundColor: '#f0fdf4' }}
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 size={24} className="text-green-600 shrink-0" />
            <p className="text-base font-bold text-green-700">모든 기기가 정상 연결되어 있습니다.</p>
          </div>
        </Card>
      )}

      {/* Status Summary Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Today Summary */}
        <Card className="dashboard-mini-panel dashboard-mini-panel--summary" bodyStyle={{ padding: '18px' }}>
          <div className="dashboard-mini-panel__header">
            <div className="dashboard-mini-panel__heading">
              <div className="dashboard-mini-panel__icon dashboard-mini-panel__icon--blue" aria-hidden="true">
                <BarChart3 size={18} />
              </div>
              <div>
                <p className="dashboard-mini-panel__eyebrow">오늘 상태</p>
                <p className="dashboard-mini-panel__title">사건 요약</p>
              </div>
            </div>
          </div>

          <div className="dashboard-mini-stats">
            <div className="dashboard-mini-stat dashboard-mini-stat--blue">
              <span className="dashboard-mini-stat__label">정상</span>
              <span className="dashboard-mini-stat__value">
                {incidents.filter(i => i.actionState === 'resolved' || i.type === 'NORMAL').length}건
              </span>
            </div>
            <div className="dashboard-mini-stat dashboard-mini-stat--amber">
              <span className="dashboard-mini-stat__label">확인 필요</span>
              <span className="dashboard-mini-stat__value">{urgentIncidents.length}건</span>
            </div>
          </div>
        </Card>

        {/* Device Card */}
        <Card
          className="dashboard-mini-panel dashboard-mini-panel--device"
          bodyStyle={{ padding: '18px' }}
          onClick={() => navigate('/guardian/device')}
          style={{ cursor: 'pointer' }}
        >
          <div className="dashboard-mini-panel__header">
            <div className="dashboard-mini-panel__heading">
              <div className="dashboard-mini-panel__icon dashboard-mini-panel__icon--emerald" aria-hidden="true">
                <Battery size={18} />
              </div>
              <div>
                <p className="dashboard-mini-panel__eyebrow">기기</p>
                <p className="dashboard-mini-panel__title">연결 상태</p>
              </div>
            </div>
            <ArrowUpRight size={16} className="text-gray-300 shrink-0" />
          </div>

          <div className="dashboard-device-meter">
            <div className="dashboard-device-meter__value-row">
              <span className="dashboard-device-meter__value">{system.batteryLevel}%</span>
              <span className="dashboard-device-meter__caption">배터리 잔량</span>
            </div>
            <ProgressBar
              percent={system.batteryLevel}
              style={{ '--fill-color': system.batteryLevel > 20 ? '#2563eb' : '#ef4444', '--track-color': '#dbeafe', '--track-width': '8px' } as React.CSSProperties}
            />
          </div>

          <div className="dashboard-device-status">
            <div className="dashboard-device-status__icon" aria-hidden="true">
              {system.status === 'bagConnected' ? <Wifi size={16} /> : <WifiOff size={16} />}
            </div>
            <div className="min-w-0">
              <p className="dashboard-device-status__label">현재 연결</p>
              <Tag
                color={system.status === 'bagConnected' ? 'success' : 'danger'}
                fill="outline"
                style={{ fontSize: '12px' } as React.CSSProperties}
              >
                {system.status === 'bagConnected' ? '연결됨' : '연결 끊김'}
              </Tag>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Alerts */}
      <div>
        <p className="text-sm font-bold text-gray-400 mb-4 px-1">최근 알림</p>
        <div className="row-action-stack">
          {incidents.slice(0, 5).map((incident) => (
            <RowActionCard
              key={incident.id}
              title={incident.title}
              description={incident.time}
              leading={
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  incident.actionState === 'resolved' ? 'bg-gray-100' : incident.type === 'MISSING_SUSPECTED' ? 'bg-orange-50' : 'bg-blue-50'
                }`}>
                  {incident.actionState === 'resolved'
                    ? <CheckCircle2 size={22} className="text-green-500" />
                    : incident.type === 'MISSING_SUSPECTED'
                      ? <AlertTriangle size={22} className="text-orange-500" />
                      : <CheckCircle2 size={22} className="text-blue-500" />
                  }
                </div>
              }
              onClick={() => navigate(`/guardian/incident/${incident.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

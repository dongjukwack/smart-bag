import React from 'react';
import { useApp } from '../../store/AppContext';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Tag } from 'antd-mobile';
import { AlertTriangle, CheckCircle2, Wifi } from 'lucide-react';
import { RowActionCard } from '../../components/RowActionCard';
import { MOCK_ELDER_NAME } from '../../store/mockData';

export const SeniorHome: React.FC = () => {
  const { appState } = useApp();
  const navigate = useNavigate();
  const { userStatus, system } = appState;

  const isNormal = userStatus.status === 'NORMAL';
  const isMissing = userStatus.status === 'MISSING_SUSPECTED';

  return (
    <div className="app-page app-page-top app-page-section animate-fade-in safe-area-top">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <h1 className="text-[28px] font-extrabold text-gray-900 leading-tight">
          안녕하세요,<br />{MOCK_ELDER_NAME}
        </h1>
        <Tag
          className="status-connection-pill"
          color={system.status === 'bagConnected' ? 'success' : 'danger'}
          fill="outline"
          style={{ '--border-radius': '20px' } as React.CSSProperties}
        >
          <span className="status-connection-pill__content">
            <Wifi size={14} />
            {system.status === 'bagConnected' ? '가방 연결됨 · 정상' : '가방 연결 끊김'}
          </span>
        </Tag>
      </div>

      {/* Status Card */}
      <Card
        style={{
          borderRadius: '16px',
          border: isNormal ? '1.5px solid #d1fae5' : '1.5px solid #fecaca',
          backgroundColor: isNormal ? '#f0fdf4' : '#fef2f2',
        }}
      >
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${isNormal ? 'bg-green-100' : 'bg-red-100'}`}>
            {isNormal
              ? <CheckCircle2 size={28} className="text-green-600" />
              : <AlertTriangle size={28} className="text-red-500" />
            }
          </div>
          <div className="flex-1 min-w-0">
            <h2 className={`text-xl font-bold mb-1 ${isNormal ? 'text-green-700' : 'text-red-600'}`}>
              {isNormal ? '준비 완료' : userStatus.messageTitle}
            </h2>
            <p className="text-base text-gray-600 leading-relaxed">
              {isNormal ? '필수 물품이 모두 가방에 있어요.' : userStatus.messageDesc}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-200/50 text-sm text-gray-500">
          <span>마지막 확인 {system.lastSyncTime}</span>
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            보호자 공유 켜짐
          </span>
        </div>
      </Card>

      {/* Emergency Button */}
      {isMissing && (
        <div>
          <Button
            block
            color="danger"
            size="large"
            onClick={() => navigate('/senior/alert')}
            style={{ borderRadius: '12px', fontWeight: 700, fontSize: '18px', height: '56px' }}
          >
            ⚠️ 지금 확인하기
          </Button>
        </div>
      )}

      {/* Menu */}
      <div className="row-action-stack">
        {[
          { label: '최근 기록', desc: '외출 및 알림 이력', path: '/senior/history' },
          { label: '기기 상태', desc: '배터리, 연결, 위치', path: '/senior/device' },
          { label: '설정', desc: '알림, 공유, 계정 관리', path: '/senior/settings' },
        ].map((item) => (
          <RowActionCard
            key={item.label}
            title={item.label}
            description={item.desc}
            onClick={() => navigate(item.path)}
          />
        ))}
      </div>
    </div>
  );
};

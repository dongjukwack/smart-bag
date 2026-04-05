import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import { NavBar, Dialog } from 'antd-mobile';
import { User, Bell, Share2, HelpCircle, LogOut } from 'lucide-react';
import { AccountSummaryCard } from '../../components/AccountSummaryCard';
import { RowActionCard } from '../../components/RowActionCard';
import { MOCK_ELDER_NAME } from '../../store/mockData';

export const SeniorSettings: React.FC = () => {
  const { logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await Dialog.confirm({
      content: '로그아웃 하시겠습니까?',
      confirmText: '로그아웃',
      cancelText: '취소',
    });
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
        {/* Profile Card */}
        <AccountSummaryCard
          label="내 계정"
          name={MOCK_ELDER_NAME}
          accent="emerald"
        />

        {/* Settings Menu */}
        <div className="row-action-stack">
          <RowActionCard
            title="연결된 사용자 관리"
            leading={<div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center"><User size={18} className="text-blue-600" /></div>}
            onClick={() => navigate('/senior/settings/users')}
          />
          <RowActionCard
            title="알림 수신 설정"
            leading={<div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center"><Bell size={18} className="text-amber-600" /></div>}
            onClick={() => navigate('/senior/settings/alerts')}
          />
          <RowActionCard
            title="공유 범위 설정"
            leading={<div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center"><Share2 size={18} className="text-green-600" /></div>}
            onClick={() => navigate('/senior/settings/sharing')}
          />
          <RowActionCard
            title="도움말"
            leading={<div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center"><HelpCircle size={18} className="text-gray-500" /></div>}
            onClick={() => navigate('/senior/settings/help')}
          />
        </div>

        <div className="settings-footer-stack">
          <div className="settings-meta-card">
            <div className="settings-meta-card__row">
              <span className="settings-meta-card__label">앱 버전</span>
              <span className="settings-meta-card__value">1.2.0 (Build 500)</span>
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

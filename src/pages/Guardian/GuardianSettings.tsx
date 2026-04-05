import React from 'react';
import { useApp } from '../../store/AppContext';
import { useNavigate } from 'react-router-dom';
import { NavBar, Dialog } from 'antd-mobile';
import { User, Bell, Share2, LogOut } from 'lucide-react';
import { AccountSummaryCard } from '../../components/AccountSummaryCard';
import { RowActionCard } from '../../components/RowActionCard';
import { MOCK_CAREGIVER_NAME } from '../../store/mockData';

export const GuardianSettings: React.FC = () => {
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

  const menuItems = [
    { icon: <User size={18} className="text-blue-600" />, bg: 'bg-blue-50', label: '대상자 관리', path: '/guardian/settings/target' },
    { icon: <Bell size={18} className="text-amber-600" />, bg: 'bg-amber-50', label: '위급 알림 설정', path: '/guardian/settings/alerts' },
    { icon: <Share2 size={18} className="text-green-600" />, bg: 'bg-green-50', label: '사건 기록 내보내기', path: '/guardian/settings/export' },
  ];

  return (
    <div className="animate-fade-in safe-area-top">
      <NavBar back={null} style={{ '--height': '56px' } as React.CSSProperties}>
        설정
      </NavBar>

      <div className="app-page app-page-inner-top app-page-section pb-8">
        <AccountSummaryCard label="보호자 계정" name={MOCK_CAREGIVER_NAME} accent="blue" />

        <div className="row-action-stack">
          {menuItems.map((item) => (
            <RowActionCard
              key={item.label}
              title={item.label}
              leading={
                <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center`}>
                  {item.icon}
                </div>
              }
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

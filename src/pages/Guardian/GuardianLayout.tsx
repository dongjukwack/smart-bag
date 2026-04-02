import React from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from '../../components/BottomNav';
import type { NavItem } from '../../components/BottomNav';
import { useApp } from '../../store/AppContext';

export const GuardianLayout: React.FC = () => {
  const { appState } = useApp();
  const urgentCount = appState.incidents.filter(
    i => i.actionState === 'open' || i.actionState === 'userRechecking'
  ).length;

  const navItems: NavItem[] = [
    { icon: 'HOME', label: '홈', path: '/guardian', badge: urgentCount > 0 ? urgentCount : undefined },
    { icon: 'DEVICE', label: '기기', path: '/guardian/device' },
    { icon: 'HISTORY', label: '기록', path: '/guardian/history' },
    { icon: 'SETTINGS', label: '설정', path: '/guardian/settings' },
  ];

  return (
    <div className="app-shell">
      <div className="app-shell__content">
        <Outlet />
      </div>
      <BottomNav items={navItems} />
    </div>
  );
};

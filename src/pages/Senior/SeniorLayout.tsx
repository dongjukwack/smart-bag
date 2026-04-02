import React from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from '../../components/BottomNav';
import type { NavItem } from '../../components/BottomNav';

export const SeniorLayout: React.FC = () => {
  const navItems: NavItem[] = [
    { icon: 'HOME', label: '홈', path: '/senior' },
    { icon: 'HISTORY', label: '기록', path: '/senior/history' },
    { icon: 'DEVICE', label: '기기', path: '/senior/device' },
    { icon: 'SETTINGS', label: '설정', path: '/senior/settings' },
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

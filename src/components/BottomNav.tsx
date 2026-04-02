import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TabBar } from 'antd-mobile';
import { Home, ClipboardList, Settings, Bell, Smartphone } from 'lucide-react';

export interface NavItem {
  icon: 'HOME' | 'HISTORY' | 'SETTINGS' | 'ALERTS' | 'DEVICE';
  label: string;
  path: string;
  badge?: number;
}

interface BottomNavProps {
  items: NavItem[];
}

const iconMap = {
  HOME: Home,
  HISTORY: ClipboardList,
  SETTINGS: Settings,
  ALERTS: Bell,
  DEVICE: Smartphone,
};

export const BottomNav: React.FC<BottomNavProps> = ({ items }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="bottom-nav-shell w-full shrink-0 safe-area-bottom">
      <TabBar
        activeKey={location.pathname}
        onChange={(key) => navigate(key)}
        safeArea
        style={{ '--tab-bar-padding-top': '8px', '--tab-bar-padding-bottom': '8px' } as React.CSSProperties}
      >
        {items.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <TabBar.Item
              key={item.path}
              icon={<Icon size={24} />}
              title={item.label}
              badge={item.badge}
            />
          );
        })}
      </TabBar>
    </div>
  );
};

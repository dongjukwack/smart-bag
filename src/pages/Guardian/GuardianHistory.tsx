import React from 'react';
import { useApp } from '../../store/AppContext';
import { useNavigate } from 'react-router-dom';
import { NavBar } from 'antd-mobile';
import { IncidentCard } from '../../components/IncidentCard';

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
            {incidents.map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                onClick={handleClick}
                showActionTag
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

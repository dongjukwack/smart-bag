import React from 'react';
import { useApp } from '../../store/AppContext';
import { useNavigate } from 'react-router-dom';
import { NavBar, Card, Tag } from 'antd-mobile';
import { CheckCircle2, AlertTriangle, ChevronRight } from 'lucide-react';

export const SeniorHistory: React.FC = () => {
  const { appState, markIncidentRead } = useApp();
  const { incidents } = appState;
  const navigate = useNavigate();

  const handleClick = (id: string) => {
    markIncidentRead(id);
    navigate(`/senior/alert`);
  };

  return (
    <div className="animate-fade-in safe-area-top">
      <NavBar back={null} style={{ '--height': '56px' } as React.CSSProperties}>
        나의 외출 기록
      </NavBar>

      <div className="app-page app-page-inner-top pb-8">
        {incidents.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-base">
            아직 기록이 없어요.
          </div>
        ) : (
          <div className="flex flex-col gap-4 mt-4">
            {incidents.map((incident) => {
              const isWarning = incident.type === 'MISSING_SUSPECTED';
              const isResolved = incident.actionState === 'resolved';

              return (
                <Card
                  key={incident.id}
                  onClick={() => handleClick(incident.id)}
                  style={{
                    borderRadius: '14px',
                    border: isWarning && !isResolved ? '1px solid #fecaca' : '1px solid #e5e7eb',
                    cursor: 'pointer',
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      isWarning ? (isResolved ? 'bg-gray-100' : 'bg-red-50') : 'bg-blue-50'
                    }`}>
                      {isWarning ? (
                        isResolved
                          ? <CheckCircle2 size={24} className="text-green-500" />
                          : <AlertTriangle size={24} className="text-red-500" />
                      ) : (
                        <CheckCircle2 size={24} className="text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base font-bold text-gray-800 truncate">{incident.title}</span>
                        {!incident.isRead && (
                          <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">오전 {incident.time}</span>
                        {isResolved && (
                          <Tag color="success" fill="outline" style={{ fontSize: '11px' } as React.CSSProperties}>해결됨</Tag>
                        )}
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-300 shrink-0" />
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

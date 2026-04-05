import React from 'react';
import { Card, Tag } from 'antd-mobile';
import { CheckCircle2, AlertTriangle, ChevronRight } from 'lucide-react';
import type { IncidentItem } from '../types';

interface IncidentCardProps {
  incident: IncidentItem;
  onClick: (id: string) => void;
  /** Guardian 모드에서는 '확인 필요' Tag를 추가로 표시 */
  showActionTag?: boolean;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({
  incident,
  onClick,
  showActionTag = false,
}) => {
  const isWarning = incident.type === 'MISSING_SUSPECTED';
  const isResolved = incident.actionState === 'resolved';

  const iconBg = isWarning
    ? isResolved ? 'bg-gray-100' : 'bg-red-50'
    : 'bg-blue-50';

  const icon = isWarning
    ? isResolved
      ? <CheckCircle2 size={24} className="text-green-500" />
      : <AlertTriangle size={24} className="text-red-500" />
    : <CheckCircle2 size={24} className="text-blue-500" />;

  return (
    <Card
      onClick={() => onClick(incident.id)}
      style={{
        borderRadius: '14px',
        border: isWarning && !isResolved ? '1px solid #fecaca' : '1px solid #e5e7eb',
        cursor: 'pointer',
      }}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base font-bold text-gray-800 truncate">{incident.title}</span>
            {!incident.isRead && (
              <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" aria-label="미읽음" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">오전 {incident.time}</span>
            {isResolved && (
              <Tag color="success" fill="outline" style={{ fontSize: '11px' } as React.CSSProperties}>
                해결됨
              </Tag>
            )}
            {showActionTag && !isResolved && isWarning && (
              <Tag color="danger" fill="outline" style={{ fontSize: '11px' } as React.CSSProperties}>
                확인 필요
              </Tag>
            )}
          </div>
        </div>

        <ChevronRight size={18} className="text-gray-300 shrink-0" aria-hidden="true" />
      </div>
    </Card>
  );
};

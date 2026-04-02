import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import { NavBar, Card, Button, TextArea, Toast, Dialog, Tag } from 'antd-mobile';
import { MapPin, CheckCircle2, PhoneCall, AlertTriangle, Clock3, ArrowUpRight, FileText } from 'lucide-react';

export const IncidentDetail: React.FC = () => {
  const { appState, updateIncidentState } = useApp();
  const { id } = useParams();
  const navigate = useNavigate();

  const incident = appState.incidents.find(i => i.id === id);
  const [memo, setMemo] = useState(incident?.caregiverMemo || '');

  if (!incident) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-500 mb-4">사건을 찾을 수 없습니다</p>
          <Button color="primary" onClick={() => navigate('/guardian')}>
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  const isResolved = incident.actionState === 'resolved';

  const handleCall = () => {
    updateIncidentState(incident.id, 'caregiverAcknowledged', memo);
    Toast.show({ icon: 'success', content: '김영수 님에게 전화를 연결합니다', position: 'bottom' });
  };

  const handleResolve = async () => {
    const result = await Dialog.confirm({
      content: '이 사건을 해결 완료로 처리하시겠습니까?',
      confirmText: '해결 완료',
      cancelText: '취소',
    });
    if (result) {
      updateIncidentState(incident.id, 'resolved', memo);
      Toast.show({ icon: 'success', content: '사건이 해결 완료 처리되었습니다', position: 'bottom' });
      setTimeout(() => navigate('/guardian'), 500);
    }
  };

  const handleSaveMemo = () => {
    updateIncidentState(incident.id, incident.actionState || 'open', memo);
    Toast.show({ content: '메모가 저장되었습니다', position: 'bottom' });
  };

  return (
    <div className="min-h-screen bg-gray-50 safe-area-top">
      <NavBar
        onBack={() => navigate(-1)}
        style={{ '--height': '56px' } as React.CSSProperties}
      >
        사건 상세
      </NavBar>

      <div className="app-page app-page-inner-top app-page-section detail-page-content animate-fade-in">
        {/* Status Badge */}
        <Card
          className={`detail-surface-card detail-hero-card ${isResolved ? 'detail-hero-card--resolved' : 'detail-hero-card--alert'}`}
          bodyStyle={{ padding: '22px' }}
        >
          <div className="detail-hero-card__status-row">
            <Tag
              color={isResolved ? 'success' : 'danger'}
              fill="outline"
              style={{ fontSize: '13px', padding: '4px 10px', background: 'rgba(255,255,255,0.72)' } as React.CSSProperties}
            >
              {isResolved ? '해결됨' : '확인 필요'}
            </Tag>
            {incident.actionState === 'caregiverAcknowledged' && (
              <Tag color="primary" fill="outline" style={{ fontSize: '12px', background: 'rgba(255,255,255,0.72)' } as React.CSSProperties}>
                연락 완료
              </Tag>
            )}
          </div>

          <div className="detail-hero-card__body">
            <div className="detail-hero-card__icon" aria-hidden="true">
              {isResolved ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
            </div>
            <div className="detail-hero-card__content">
              <p className="detail-hero-card__eyebrow">김영수 님 사건</p>
              <h2 className="detail-hero-card__title">{incident.title}</h2>
              <div className="detail-hero-card__meta">
                <Clock3 size={16} />
                <span>발생 시각 오전 {incident.time}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Location */}
        {incident.locationContext && (
          <Card
            className="detail-surface-card"
            bodyStyle={{ padding: '22px' }}
          >
            <div className="detail-section-header">
              <div>
                <p className="detail-section-eyebrow">위치 정보</p>
                <h3 className="detail-section-title">마지막 감지 흐름</h3>
              </div>
              <Button
                size="small"
                fill="outline"
                color="primary"
                onClick={() => navigate(`/map/${incident.id}`)}
                style={{ borderRadius: '999px', fontWeight: 700 }}
              >
                <span className="flex items-center gap-1.5">
                  지도 보기
                  <ArrowUpRight size={14} />
                </span>
              </Button>
            </div>

            <div className="detail-location-summary">
              <span className="detail-location-summary__chip">위치 포인트 2개</span>
              <span className="detail-location-summary__hint">최근 감지 순서대로 정리</span>
            </div>

            <div className="detail-location-list">
              <div className="detail-location-row detail-location-row--primary">
                <div className="detail-location-row__step" aria-hidden="true">1</div>
                <div className="detail-location-row__icon" aria-hidden="true">
                  <MapPin size={18} />
                </div>
                <div className="detail-location-row__copy">
                  <p className="detail-location-row__label">스마트폰 위치</p>
                  <p className="detail-location-row__value">{incident.locationContext.userLocation}</p>
                </div>
              </div>
              <div className="detail-location-row">
                <div className="detail-location-row__step" aria-hidden="true">2</div>
                <div className="detail-location-row__icon" aria-hidden="true">
                  <MapPin size={18} />
                </div>
                <div className="detail-location-row__copy">
                  <p className="detail-location-row__label">가방 연결 해제 위치</p>
                  <p className="detail-location-row__value">{incident.locationContext.bagLocation}</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Memo */}
        <Card className="detail-surface-card" bodyStyle={{ padding: '22px' }}>
          <div className="detail-memo-panel">
            <div className="detail-memo-intro">
              <div>
                <p className="detail-section-eyebrow">보호자 메모</p>
                <h3 className="detail-section-title">대응 내용을 기록해 두세요</h3>
              </div>
              <div className="detail-section-icon" aria-hidden="true">
                <FileText size={18} />
              </div>
            </div>

            <div className="detail-textarea-shell">
              <TextArea
                placeholder="상황에 대한 메모를 남겨주세요"
                value={memo}
                onChange={setMemo}
                autoSize={{ minRows: 4, maxRows: 7 }}
                maxLength={200}
                showCount
                style={{
                  '--font-size': '16px',
                  '--color': '#0f172a',
                  '--placeholder-color': '#94a3b8',
                } as React.CSSProperties}
              />
            </div>

            <div className="detail-memo-panel__footer">
              <p className="detail-memo-panel__hint">메모는 사건 기록과 함께 저장됩니다.</p>
              <Button
                block
                fill="outline"
                onClick={handleSaveMemo}
                style={{ borderRadius: '14px', fontWeight: 700 }}
              >
                메모 저장
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="detail-bottom-actions fixed safe-area-bottom" style={{ zIndex: 50 }}>
        <div className="flex gap-3">
          {!isResolved && (
            <Button
              size="large"
              onClick={handleCall}
              style={{ flex: 1, borderRadius: '12px', fontWeight: 700, border: '1.5px solid #e5e7eb' }}
            >
              <span className="flex items-center justify-center gap-2">
                <PhoneCall size={20} /> 연락하기
              </span>
            </Button>
          )}
          <Button
            color={isResolved ? 'default' : 'success'}
            size="large"
            disabled={isResolved}
            onClick={handleResolve}
            style={{ flex: 1, borderRadius: '12px', fontWeight: 700 }}
          >
            <span className="flex items-center justify-center gap-2">
              <CheckCircle2 size={20} />
              {isResolved ? '해결됨' : '해결 완료'}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from './AppContext';
import { Bug, CheckCircle, AlertTriangle, X } from 'lucide-react';

export const ScenarioTester: React.FC = () => {
  const { triggerMissingScenario, triggerNormalScenario, appState } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const isMissing = appState.userStatus.status === 'MISSING_SUSPECTED';

  if (!isOpen) {
    return (
      <div
        style={{
          position: 'fixed', bottom: '100px', right: '16px', zIndex: 999,
          width: '44px', height: '44px', borderRadius: '22px',
          background: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)', cursor: 'pointer',
        }}
        onClick={() => setIsOpen(true)}
      >
        <Bug size={22} color="white" />
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed', bottom: '100px', right: '16px', zIndex: 999,
        background: 'white', borderRadius: '16px', padding: '16px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.15)', border: '1px solid #e5e7eb',
        width: '220px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#6b7280' }}>테스트 제어판</span>
        <button onClick={() => setIsOpen(false)} style={{ padding: '4px' }}><X size={16} color="#9ca3af" /></button>
      </div>

      <button
        onClick={() => { triggerNormalScenario(); setIsOpen(false); }}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px',
          background: !isMissing ? '#eff6ff' : '#f3f4f6', borderRadius: '10px', marginBottom: '6px',
          fontSize: '14px', fontWeight: 600, color: '#111827',
        }}
      >
        <CheckCircle size={16} color={!isMissing ? '#2563eb' : '#9ca3af'} /> 정상 상태
      </button>

      <button
        onClick={() => { triggerMissingScenario(); setIsOpen(false); }}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px',
          background: isMissing ? '#fef2f2' : '#f3f4f6', borderRadius: '10px',
          fontSize: '14px', fontWeight: 600, color: '#111827',
        }}
      >
        <AlertTriangle size={16} color={isMissing ? '#ef4444' : '#9ca3af'} /> 누락 발생
      </button>
    </div>
  );
};

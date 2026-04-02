import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import { NavBar, List, Switch, Button, Card, Tag, Toast } from 'antd-mobile';
import { User, Download, Phone, Calendar } from 'lucide-react';

export const GuardianTargetManagement: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in safe-area-top">
      <NavBar onBack={() => navigate(-1)} style={{ '--height': '56px' } as React.CSSProperties}>
        대상자 관리
      </NavBar>
      <div className="app-page app-page-inner-top app-page-section pb-8">
        <Card style={{ borderRadius: '16px' }}>
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
              <User size={28} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-xl font-bold text-gray-900">김영수 님</p>
              <Tag color="primary" fill="outline" style={{ fontSize: '12px', marginTop: '4px' } as React.CSSProperties}>기본 대상자 (아버지)</Tag>
            </div>
            <Button
              size="small"
              onClick={() => { Toast.show({ content: '정보 수정은 서버 연동 후 가능합니다', position: 'bottom' }); }}
              style={{ borderRadius: '8px' }}
            >
              정보 수정
            </Button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-base text-gray-700">
              <Phone size={18} className="text-gray-400" />
              <span>010-1234-5678</span>
            </div>
            <div className="flex items-center gap-3 text-base text-gray-700">
              <Calendar size={18} className="text-gray-400" />
              <span>1950.05.08</span>
            </div>
          </div>
        </Card>

        <Button
          block
          size="large"
          onClick={() => { Toast.show({ content: '새 대상자 연결은 서버 연동 후 가능합니다', position: 'bottom' }); }}
          style={{ borderRadius: '12px', fontWeight: 700, border: '1.5px solid #e5e7eb' }}
        >
          + 새 대상자 연결하기
        </Button>
      </div>
    </div>
  );
};

export const GuardianAlertSettings: React.FC = () => {
  const { settings, updateSettings } = useApp();
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in safe-area-top">
      <NavBar onBack={() => navigate(-1)} style={{ '--height': '56px' } as React.CSSProperties}>
        위급 알림 설정
      </NavBar>
      <div className="app-page app-page-inner-top pb-8">
        <List
          style={{ '--border-inner': '1px solid #f3f4f6', '--border-top': 'none', '--border-bottom': 'none' } as React.CSSProperties}
          className="!rounded-2xl overflow-hidden"
        >
          <List.Item
            extra={<Switch checked={settings.pushNotification} onChange={v => updateSettings({ pushNotification: v })} />}
            description="배터리 부족, 기기 연결 끊김 등"
          >
            <span className="text-base font-bold">기본 푸시 알림</span>
          </List.Item>
          <List.Item
            extra={<Switch checked={settings.smsUrgent} onChange={v => updateSettings({ smsUrgent: v })} />}
            description="앱이 꺼져있어도 문자로 긴급 연락"
          >
            <span className="text-base font-bold text-red-600">누락 의심 SMS 수신</span>
          </List.Item>
        </List>
      </div>
    </div>
  );
};

export const GuardianExportRecords: React.FC = () => {
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('week');
  const navigate = useNavigate();
  const { appState } = useApp();

  const handleExport = () => {
    // CSV generation simulation
    const header = '날짜,시간,유형,제목,상태\n';
    const rows = appState.incidents.map(i =>
      `2025-04-03,${i.time},${i.type},${i.title},${i.actionState || 'N/A'}`
    ).join('\n');
    const csv = header + rows;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `smartbag_report_${period}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    Toast.show({ icon: 'success', content: 'CSV 파일이 다운로드되었습니다', position: 'bottom' });
  };

  const options = [
    { value: 'week' as const, label: '최근 1주일' },
    { value: 'month' as const, label: '최근 1개월' },
    { value: 'all' as const, label: '전체 기간' },
  ];

  return (
    <div className="animate-fade-in safe-area-top">
      <NavBar onBack={() => navigate(-1)} style={{ '--height': '56px' } as React.CSSProperties}>
        사건 기록 내보내기
      </NavBar>
      <div className="app-page app-page-inner-top app-page-section pb-8">
        <Card style={{ borderRadius: '16px' }}>
          <p className="text-base text-gray-600 mb-4 leading-relaxed">
            요양사, 주치의, 가족 등에게 대상자의 활동 기록과 누락 사건 이력을 전달할 수 있는 보고서를 생성합니다.
          </p>

          <p className="text-sm font-bold text-gray-400 mb-3">내보내기 기간</p>
          <div className="flex flex-col gap-3 mb-4">
            {options.map(opt => (
              <button
                key={opt.value}
                className={`w-full text-left rounded-xl p-3.5 border-2 transition-colors ${
                  period === opt.value ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-white'
                }`}
                onClick={() => setPeriod(opt.value)}
              >
                <span className={`text-base font-bold ${period === opt.value ? 'text-blue-700' : 'text-gray-700'}`}>
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </Card>

        <Button
          block
          color="primary"
          size="large"
          onClick={handleExport}
          style={{ borderRadius: '12px', fontWeight: 700 }}
        >
          <span className="flex items-center justify-center gap-2">
            <Download size={20} />
            CSV 보고서 다운로드
          </span>
        </Button>
      </div>
    </div>
  );
};

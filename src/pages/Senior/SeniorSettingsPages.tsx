import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import { NavBar, List, Switch, Button, Dialog, Toast, Collapse } from 'antd-mobile';
import { UserMinus, Plus } from 'lucide-react';

export const SeniorConnectedUsers: React.FC = () => {
  const navigate = useNavigate();

  const handleRemove = async () => {
    const result = await Dialog.confirm({
      content: '동주 님을 보호자 목록에서 제거하시겠습니까?',
      confirmText: '제거',
      cancelText: '취소',
    });
    if (result) {
      Toast.show({ content: '보호자가 제거되었습니다', position: 'bottom' });
    }
  };

  return (
    <div className="animate-fade-in safe-area-top">
      <NavBar onBack={() => navigate(-1)} style={{ '--height': '56px' } as React.CSSProperties}>
        연결된 사용자 관리
      </NavBar>
      <div className="app-page app-page-inner-top app-page-section pb-8">
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <p className="text-sm font-bold text-gray-400 mb-3">등록된 보호자</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-bold text-gray-900">동주 님</p>
              <p className="text-sm text-gray-500 mt-1">기본 보호자 · 모든 권한 허용됨</p>
            </div>
            <button
              className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500 active:bg-red-100"
              onClick={handleRemove}
            >
              <UserMinus size={20} />
            </button>
          </div>
        </div>
        <Button
          block
          size="large"
          style={{ borderRadius: '12px', fontWeight: 700, border: '1.5px solid #e5e7eb' }}
          onClick={() => { Toast.show({ content: '새 보호자 등록은 서버 연동 후 가능합니다', position: 'bottom' }); }}
        >
          <span className="flex items-center justify-center gap-2">
            <Plus size={20} />
            새 보호자 등록하기
          </span>
        </Button>
      </div>
    </div>
  );
};

export const SeniorAlertSettings: React.FC = () => {
  const { settings, updateSettings } = useApp();
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in safe-area-top">
      <NavBar onBack={() => navigate(-1)} style={{ '--height': '56px' } as React.CSSProperties}>
        알림 수신 설정
      </NavBar>
      <div className="app-page app-page-inner-top pb-8">
        <List
          style={{ '--border-inner': '1px solid #f3f4f6', '--border-top': 'none', '--border-bottom': 'none' } as React.CSSProperties}
          className="!rounded-2xl overflow-hidden"
        >
          <List.Item
            extra={<Switch checked={settings.loudAlarm} onChange={v => updateSettings({ loudAlarm: v })} />}
            description="누락 의심 시 가방에서 소리가 납니다"
          >
            <span className="text-base font-bold">가방 큰 소리 알림</span>
          </List.Item>
          <List.Item
            extra={<Switch checked={settings.voiceGuide} onChange={v => updateSettings({ voiceGuide: v })} />}
            description="앱 알림 시 목소리로 상황을 읽어줍니다"
          >
            <span className="text-base font-bold">음성 친화 안내</span>
          </List.Item>
        </List>
      </div>
    </div>
  );
};

export const SeniorSharingSettings: React.FC = () => {
  const { settings, updateSettings } = useApp();
  const navigate = useNavigate();

  const options: { value: 'always' | 'emergency' | 'off'; label: string; desc: string }[] = [
    { value: 'always', label: '항상 공유', desc: '보호자에게 내 위치를 항상 공유합니다' },
    { value: 'emergency', label: '위급 시에만', desc: '누락 의심 상황에서만 위치를 공유합니다' },
    { value: 'off', label: '공유 끄기', desc: '위치 공유를 완전히 끕니다' },
  ];

  return (
    <div className="animate-fade-in safe-area-top">
      <NavBar onBack={() => navigate(-1)} style={{ '--height': '56px' } as React.CSSProperties}>
        공유 범위 설정
      </NavBar>
      <div className="app-page app-page-inner-top pb-8">
        <p className="text-sm text-gray-400 mb-4 font-bold">위치 데이터 공유</p>
        <div className="flex flex-col gap-3">
          {options.map(opt => (
            <button
              key={opt.value}
              className={`w-full text-left rounded-2xl p-4 border-2 transition-colors ${
                settings.locationSharing === opt.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-100 bg-white'
              }`}
              onClick={() => {
                updateSettings({ locationSharing: opt.value });
                Toast.show({ content: `${opt.label}으로 변경됨`, position: 'bottom' });
              }}
            >
              <p className={`text-base font-bold ${settings.locationSharing === opt.value ? 'text-blue-700' : 'text-gray-800'}`}>
                {opt.label}
              </p>
              <p className="text-sm text-gray-500 mt-1">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const SeniorHelp: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in safe-area-top">
      <NavBar onBack={() => navigate(-1)} style={{ '--height': '56px' } as React.CSSProperties}>
        도움말
      </NavBar>
      <div className="app-page app-page-inner-top pb-8">
        <Collapse
          style={{ '--border-top': 'none', '--border-bottom': 'none' } as React.CSSProperties}
          className="!rounded-2xl overflow-hidden"
        >
          <Collapse.Panel key="1" title={<span className="text-base font-bold">가방 작동 방법</span>}>
            <p className="text-base text-gray-600 leading-relaxed">
              스마트 가방은 외출 시 필수 물품의 무게와 센서 데이터를 분석하여 빠진 물건이 없는지 자동으로 확인합니다.
              가방에 물건을 넣고 나면, 앱에서 "준비 완료" 메시지를 확인할 수 있습니다.
            </p>
          </Collapse.Panel>
          <Collapse.Panel key="2" title={<span className="text-base font-bold">앱 알림이 울릴 때 대처법</span>}>
            <p className="text-base text-gray-600 leading-relaxed">
              앱에서 "물품 누락 의심" 알림이 오면:<br />
              1. 알림을 눌러 상세 정보를 확인하세요.<br />
              2. 빠진 물건이 맞으면 챙겨주세요.<br />
              3. 이미 챙겼다면 "다시 확인하기"를 눌러주세요.
            </p>
          </Collapse.Panel>
          <Collapse.Panel key="3" title={<span className="text-base font-bold">고객 센터 연결</span>}>
            <p className="text-base text-gray-600 leading-relaxed">
              문의 전화: 1588-0000<br />
              운영 시간: 평일 09:00 ~ 18:00<br />
              이메일: support@smartbag.kr
            </p>
          </Collapse.Panel>
        </Collapse>
      </div>
    </div>
  );
};

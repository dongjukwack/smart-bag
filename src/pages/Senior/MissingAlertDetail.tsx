import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import { NavBar, Card, Button, Toast } from 'antd-mobile';
import { AlertCircle, MapPin, Navigation, CheckCircle2 } from 'lucide-react';

export const MissingAlertDetail: React.FC = () => {
  const navigate = useNavigate();
  const { appState, triggerNormalScenario } = useApp();
  const { userStatus } = appState;

  const handleRecheck = () => {
    triggerNormalScenario();
    Toast.show({ icon: 'success', content: '확인 완료! 정상 상태로 전환됩니다.', position: 'bottom' });
    setTimeout(() => navigate('/senior'), 500);
  };

  const handleNotifyCaregiver = () => {
    Toast.show({ icon: 'success', content: '보호자에게 알림을 전송했습니다.', position: 'bottom' });
  };

  const handleVoiceGuide = () => {
    Toast.show({ content: '🔊 "약통이 가방에 없는 것 같아요. 집에 돌아가 확인해주세요."', duration: 4000, position: 'center' });
  };

  return (
    <div className="min-h-screen bg-red-50/30 animate-fade-in safe-area-top">
      <NavBar
        onBack={() => navigate(-1)}
        style={{ '--height': '56px', background: 'transparent' } as React.CSSProperties}
      >
        상세 정보
      </NavBar>

      <div className="app-page app-page-inner-top app-page-section pb-40">
        {/* Alert Status */}
        <Card
          style={{
            borderRadius: '16px',
            border: '1.5px solid #fecaca',
            backgroundColor: '#fef2f2',
          }}
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center shrink-0">
              <AlertCircle size={28} className="text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-red-600 mb-1">
                {userStatus.messageTitle || '약통이 빠졌을 수 있어요'}
              </h2>
              <p className="text-base text-gray-600">
                {userStatus.messageDesc || '평소 월요일보다 가방 무게가 가벼워요'}
              </p>
            </div>
          </div>
        </Card>

        {/* Location Info */}
        <Card
          style={{ borderRadius: '16px', cursor: 'pointer' }}
          onClick={() => navigate('/map')}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-gray-400">위치 정보</p>
            <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
              지도 보기
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-base text-gray-700">
              <MapPin size={18} className="text-gray-400 shrink-0" />
              <span>가방 위치: {appState.system.lastConnectedLocation?.address || '자택'}</span>
            </div>
            <div className="flex items-center gap-2 text-base text-red-600 font-bold">
              <Navigation size={18} className="text-red-400 shrink-0" />
              <span>내 위치: {userStatus.userCurrentLocation?.address || '현관 앞'}</span>
            </div>
          </div>
        </Card>

        {/* Missing Items */}
        {userStatus.missingItems.length > 0 && (
          <div>
            <p className="text-sm font-bold text-gray-400 mb-4 px-1">누락 의심 물품</p>
            <div className="flex flex-col gap-3">
              {userStatus.missingItems.map((item, i) => (
                <Card key={item.id} style={{ borderRadius: '14px', border: i === 0 ? '1.5px solid #fecaca' : '1px solid #e5e7eb' }}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${i === 0 ? 'bg-red-50' : 'bg-gray-50'}`}>
                      {i === 0
                        ? <AlertCircle size={24} className="text-red-500" />
                        : <CheckCircle2 size={24} className="text-gray-400" />
                      }
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.reason}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto p-5 bg-gradient-to-t from-white via-white to-white/90 safe-area-bottom" style={{ zIndex: 50 }}>
        <Button
          block
          color="danger"
          size="large"
          onClick={handleRecheck}
          style={{ borderRadius: '12px', fontWeight: 700, fontSize: '18px', height: '56px', marginBottom: '10px' }}
        >
          다시 확인하기
        </Button>
        <Button
          block
          size="large"
          onClick={handleNotifyCaregiver}
          style={{ borderRadius: '12px', fontWeight: 700, fontSize: '16px', height: '48px', marginBottom: '8px', border: '1.5px solid #e5e7eb' }}
        >
          보호자에게 알리기
        </Button>
        <button
          className="w-full text-center text-base font-bold text-gray-400 py-2 active:text-gray-600 transition-colors"
          onClick={handleVoiceGuide}
        >
          🔊 음성으로 안내 듣기
        </button>
      </div>
    </div>
  );
};

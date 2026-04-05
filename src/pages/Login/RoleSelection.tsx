import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import { Button, Input, Toast } from 'antd-mobile';
import { Backpack } from 'lucide-react';

export const RoleSelection: React.FC = () => {
  const { auth, authReady, loginWithPassword, loginAsMock } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const centeredColumnStyle = { width: '100%', maxWidth: '360px' };

  useEffect(() => {
    if (!authReady || !auth.isAuthenticated || !auth.role) return;
    navigate(auth.role === 'ELDER' ? '/senior' : '/guardian', { replace: true });
  }, [auth.isAuthenticated, auth.role, authReady, navigate]);

  const handleLogin = (role: 'ELDER' | 'CAREGIVER') => {
    loginAsMock(role);
    Toast.show({ content: role === 'ELDER' ? '고령자 모드로 접속합니다' : '보호자 모드로 접속합니다', position: 'bottom' });
    navigate(role === 'ELDER' ? '/senior' : '/guardian');
  };

  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) return;

    try {
      setIsSubmitting(true);
      const nextAuth = await loginWithPassword(email, password);
      if (!nextAuth.role) {
        Toast.show({ content: '사용자 역할을 찾을 수 없습니다', position: 'bottom' });
        return;
      }

      Toast.show({ content: 'Supabase 로그인에 성공했습니다', position: 'bottom' });
      navigate(nextAuth.role === 'ELDER' ? '/senior' : '/guardian');
    } catch (error) {
      const message = error instanceof Error ? error.message : '로그인에 실패했습니다';
      Toast.show({ content: message, position: 'bottom' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page bg-white animate-fade-in">
      <div className="flex w-full flex-col gap-8" style={centeredColumnStyle}>
        {/* Logo */}
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mb-5 shadow-lg shadow-blue-200">
            <Backpack size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">SmartBag</h1>
          <p className="text-base text-gray-500 mt-2 font-medium">안전한 외출의 시작</p>
        </div>

        {/* Login Form */}
        <form className="flex w-full flex-col gap-4" onSubmit={handleLoginSubmit}>
          <div className="w-full">
            <Input
              placeholder="이메일"
              value={email}
              onChange={setEmail}
              autoComplete="username"
              style={{ '--font-size': '16px', '--color': '#374151' } as React.CSSProperties}
              className="!w-full !bg-gray-50 !rounded-xl !border !border-gray-200 !px-4 !py-3"
            />
          </div>
          <div className="w-full">
            <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
              style={{ '--font-size': '16px' } as React.CSSProperties}
              className="!w-full !bg-gray-50 !rounded-xl !border !border-gray-200 !px-4 !py-3"
            />
          </div>
          <Button
            block
            color="primary"
            size="large"
            type="submit"
            disabled={!email || !password || isSubmitting}
            style={{ borderRadius: '12px', fontWeight: 700 }}
          >
            {isSubmitting ? '로그인 중...' : '로그인'}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex w-full items-center gap-3 py-2">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-xs font-semibold text-gray-400 tracking-wider whitespace-nowrap">테스트 전용 접속</span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        {/* Quick Access Buttons */}
        <div className="flex w-full flex-col gap-4">
          <Button
            block
            size="large"
            onClick={() => handleLogin('ELDER')}
            style={{
              borderRadius: '12px',
              fontWeight: 700,
              backgroundColor: '#f0f9ff',
              color: '#2563eb',
              border: '1.5px solid #bfdbfe',
            }}
          >
            👴 고령자 모드로 시작
          </Button>
          <Button
            block
            size="large"
            onClick={() => handleLogin('CAREGIVER')}
            style={{
              borderRadius: '12px',
              fontWeight: 700,
              backgroundColor: '#f0fdf4',
              color: '#16a34a',
              border: '1.5px solid #bbf7d0',
            }}
          >
            👨‍👧 보호자 모드로 시작
          </Button>
        </div>
      </div>
    </div>
  );
};

# ADR-001: UI 라이브러리로 antd-mobile 선택

- **날짜**: 2026-03-20
- **상태**: 승인됨

## 배경

고령자를 대상으로 하는 모바일 앱이므로, 48px+ 터치 타겟·16px+ 폰트·Toast/Dialog 피드백 등 접근성 기준을 충족하는 검증된 모바일 컴포넌트 라이브러리가 필요했다.

## 결정

**antd-mobile v5** 채택.

- React Native와 달리 웹(SPA)에서 네이티브 수준의 모바일 UX 제공
- TabBar, Card, List, Switch, Toast, Dialog, ProgressBar 등 필요한 컴포넌트 완비
- TypeScript 공식 지원
- 전 세계적으로 사용량 많은 검증된 라이브러리

## 결과

`antd-mobile unstableSetRender`를 `main.tsx`에서 등록하여 React 19와 호환.  
`Button onClick`에서 `Toast.show()` 직접 반환 시 `ToastHandler` 타입 충돌 발생 → `() => { Toast.show(); }` 래핑으로 해결.

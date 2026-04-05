# SmartBag — 코드 컨벤션 (CONVENTIONS)

## 1. 언어 및 포맷

- **TypeScript strict 모드** 사용. `any` 사용 금지.
- 컴포넌트: `React.FC<Props>` 형태로 명시.
- `export default` 대신 **named export** 사용 (`export const Foo: React.FC`).
- 파일명: `PascalCase.tsx` (컴포넌트), `camelCase.ts` (유틸리티).

---

## 2. 컴포넌트 패턴

### 페이지 컴포넌트 기본 구조

```tsx
// 1. react import
import React from 'react';
// 2. 라우팅
import { useNavigate } from 'react-router-dom';
// 3. 전역 상태
import { useApp } from '../../store/AppContext';
// 4. antd-mobile 컴포넌트
import { Card, Button, Toast } from 'antd-mobile';
// 5. lucide-react 아이콘
import { AlertTriangle } from 'lucide-react';
// 6. 공통 컴포넌트
import { RowActionCard } from '../../components/RowActionCard';

export const MyPage: React.FC = () => {
  const { appState } = useApp();
  const navigate = useNavigate();

  return (
    <div className="app-page app-page-top app-page-section animate-fade-in safe-area-top">
      {/* 내용 */}
    </div>
  );
};
```

### 서브 페이지 (NavBar 포함) 기본 구조

```tsx
return (
  <div className="min-h-screen bg-gray-50 safe-area-top">
    <NavBar onBack={() => navigate(-1)} style={{ '--height': '56px' } as React.CSSProperties}>
      페이지 제목
    </NavBar>
    <div className="app-page app-page-inner-top app-page-section pb-8">
      {/* 내용 */}
    </div>
  </div>
);
```

---

## 3. antd-mobile 사용 규칙

### Button onClick — 반드시 void 함수 형태

```tsx
// ❌ 잘못된 방법 (TypeScript 오류)
onClick={() => Toast.show({ content: '...' })}

// ✅ 올바른 방법
onClick={() => { Toast.show({ content: '...' }); }}
```

### Dialog

```tsx
// ❌ 금지
confirm('로그아웃 하시겠습니까?');

// ✅ 사용
const result = await Dialog.confirm({
  content: '로그아웃 하시겠습니까?',
  confirmText: '로그아웃',
  cancelText: '취소',
});
```

### antd-mobile 커스텀 CSS 변수

```tsx
// NavBar 높이
style={{ '--height': '56px' } as React.CSSProperties}

// ProgressBar 색상
style={{
  '--fill-color': '#2563eb',
  '--track-color': '#dbeafe',
  '--track-width': '10px',
} as React.CSSProperties}
```

---

## 4. CSS 패턴

### 레이아웃 유틸리티 클래스 (index.css에 정의됨)

| 클래스 | 용도 |
|--------|------|
| `app-shell` | 최상위 레이아웃 (grid, 탭바 포함) |
| `app-shell__content` | 스크롤 영역 |
| `app-page` | `px-20px` 기본 패딩 |
| `app-page-top` | 상단 56px 여백 (헤더 없는 탭 페이지) |
| `app-page-inner-top` | 상단 16px 여백 (NavBar 있는 서브 페이지) |
| `app-page-section` | `flex flex-col gap-24px` |
| `animate-fade-in` | 0.25s fadeIn 애니메이션 |
| `safe-area-top` | iOS safe area 상단 보정 |
| `safe-area-bottom` | iOS safe area 하단 보정 |

### 간격 규칙

```tsx
// ❌ 금지 — 인라인 margin
style={{ marginBottom: '16px' }}

// ❌ 금지 — Tailwind space-y
<div className="space-y-4">

// ✅ 사용 — gap 또는 app-page-section
<div className="flex flex-col gap-4">
<div className="app-page-section">
```

### 공통 BEM 블록 목록

| 블록 | 파일 위치 | 용도 |
|------|-----------|------|
| `app-shell`, `app-shell__content` | index.css | 전체 레이아웃 |
| `bottom-nav-shell` | index.css | 하단 탭바 컨테이너 |
| `row-action-card` | index.css | 메뉴 행 카드 |
| `device-hero-card` | index.css | 기기 연결 상태 카드 |
| `device-detail-panel` | index.css | 배터리/위치 패널 |
| `guardian-alert-panel` | index.css | 보호자 긴급 알림 카드 |
| `dashboard-mini-panel` | index.css | 대시보드 요약 카드 |
| `detail-hero-card` | index.css | 사건 상세 헤더 카드 |
| `detail-location-row` | index.css | 위치 타임라인 행 |
| `detail-memo-panel` | index.css | 메모 영역 |
| `settings-meta-card` | index.css | 설정 앱 버전 카드 |
| `settings-logout-button` | index.css | 로그아웃 버튼 |
| `status-connection-pill` | index.css | 연결 상태 Tag |

> 새 BEM 블록 추가 시: `src/index.css` **맨 아래** 에 추가.

---

## 5. 상태 및 DB 규칙

### DB 쓰기 경로

```
컴포넌트
  → useApp() 훅 (AppContext 액션)
    → supabase-data.ts 함수
      → Supabase DB
```

- 컴포넌트에서 `supabase` 클라이언트를 **직접 임포트하지 않는다**.
- 모든 DB 읽기/쓰기는 `src/lib/supabase-data.ts`의 함수를 통해서만.

### 새 DB 연동 추가 절차

1. `supabase/schema.sql`에 테이블/컬럼 추가
2. `src/lib/supabase-data.ts`에 함수 추가
3. `src/store/AppContext.tsx`에서 해당 함수 호출
4. 컴포넌트에서는 `useApp()` 훅만 사용

---

## 6. 공통 컴포넌트 사용법

### RowActionCard

메뉴 목록, 최근 알림 목록 등 "행 + 화살표" 패턴에 사용.

```tsx
import { RowActionCard } from '../../components/RowActionCard';

<div className="row-action-stack">
  <RowActionCard
    title="연결된 사용자 관리"
    description="보호자, 대상자 연결 설정"
    leading={
      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
        <User size={18} className="text-blue-600" />
      </div>
    }
    onClick={() => navigate('/senior/settings/users')}
  />
</div>
```

### AccountSummaryCard

설정 페이지 상단 계정 요약 카드.

```tsx
import { AccountSummaryCard } from '../../components/AccountSummaryCard';

<AccountSummaryCard
  label="내 계정"
  name="김영수 님"
  accent="emerald"   // 'blue' | 'emerald' | 'violet'
/>
```

---

## 7. 접근성 하드 규칙

- 최소 폰트 크기: **16px** (절대 낮추지 말 것)
- 터치 타겟: **48px** 이상
- 버튼 높이: **56px** 이상
- 아이콘만 단독 사용 금지 — 반드시 텍스트 라벨 동반
- 장식용 아이콘에는 `aria-hidden="true"` 추가

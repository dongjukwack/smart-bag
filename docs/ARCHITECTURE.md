# SmartBag — 아키텍처 (ARCHITECTURE)

## 기술 스택

| 구분 | 기술 | 버전 | 역할 |
|------|------|------|------|
| 번들러 | Vite | 8.x | 개발 서버, 프로덕션 빌드 |
| UI 프레임워크 | React | 19.x | 컴포넌트 렌더링 |
| 언어 | TypeScript | 5.9.x | 타입 안전성 |
| 스타일링 | Tailwind CSS | 4.x | 유틸리티 클래스 |
| 모바일 UI | antd-mobile | 5.42.x | 모바일 최적화 컴포넌트 |
| 라우팅 | react-router-dom | 7.x | SPA 네비게이션 |
| 지도 | react-leaflet + leaflet | 5.x / 1.9.x | OpenStreetMap 지도 |
| 아이콘 | lucide-react | 1.7.x | SVG 아이콘 |
| 백엔드 | Supabase | 2.x | Auth + Postgres DB |
| 배포 | Render | Static Site | `render.yaml` Blueprint |

> **변경 금지**: 위 스택의 메이저 버전 변경 또는 새 UI 라이브러리 추가 시 반드시 팀 동의 필요.

---

## 디렉터리 구조

```
smartbag v2/
├── src/
│   ├── App.tsx                      # 라우팅 정의 (BrowserRouter + Routes)
│   ├── main.tsx                     # 진입점, antd-mobile unstableSetRender 등록
│   ├── index.css                    # 글로벌 스타일 + BEM 유틸리티 전체
│   │
│   ├── lib/
│   │   ├── supabase.ts              # Supabase 클라이언트, Auth 헬퍼 함수
│   │   └── supabase-data.ts         # DB CRUD 함수 (컴포넌트에서 직접 임포트 금지)
│   │
│   ├── types/
│   │   └── index.ts                 # 모든 TypeScript 타입 정의 (AuthState, SettingsState 등)
│   │
│   ├── store/
│   │   ├── AppContext.tsx            # 전역 상태 (auth, appState, settings)
│   │   ├── mockData.ts              # Mock 초기 데이터 + defaultSettings
│   │   └── ScenarioTester.tsx       # 개발용 플로팅 시나리오 전환 버튼
│   │
│   ├── components/
│   │   ├── BottomNav.tsx            # antd-mobile TabBar 래퍼
│   │   ├── RowActionCard.tsx        # 공통 메뉴 행 카드 (title + description + 화살표)
│   │   └── AccountSummaryCard.tsx   # 설정 페이지 계정 요약 카드
│   │
│   └── pages/
│       ├── Login/
│       │   └── RoleSelection.tsx    # 로그인 + 역할 선택
│       ├── Senior/
│       │   ├── SeniorLayout.tsx     # 고령자 탭 레이아웃 (app-shell)
│       │   ├── SeniorHome.tsx
│       │   ├── SeniorHistory.tsx
│       │   ├── SeniorDevice.tsx
│       │   ├── SeniorSettings.tsx
│       │   ├── SeniorSettingsPages.tsx  # 연결된사용자, 알림, 공유, 도움말
│       │   └── MissingAlertDetail.tsx
│       ├── Guardian/
│       │   ├── GuardianLayout.tsx   # 보호자 탭 레이아웃 (app-shell + 배지)
│       │   ├── GuardianDashboard.tsx
│       │   ├── GuardianStubs.tsx    # GuardianDevice, GuardianHistory, GuardianSettings
│       │   ├── GuardianSettingsPages.tsx  # 대상자, 알림, CSV 내보내기
│       │   └── IncidentDetail.tsx
│       └── Shared/
│           └── IncidentMapViewer.tsx
│
├── supabase/
│   └── schema.sql                   # Supabase 테이블 + RLS 정책
├── render.yaml                      # Render 배포 Blueprint
├── AGENTS.md                        # AI 에이전트 지침
└── docs/                            # 이 문서들
```

---

## 네비게이션 구조

```
/ (로그인 · RoleSelection)
│
├── /senior (SeniorLayout — 하단 탭 4개)
│   ├── /senior            → SeniorHome
│   ├── /senior/history    → SeniorHistory
│   ├── /senior/device     → SeniorDevice
│   ├── /senior/settings   → SeniorSettings
│   │   ├── /senior/settings/users    → SeniorConnectedUsers
│   │   ├── /senior/settings/alerts   → SeniorAlertSettings
│   │   ├── /senior/settings/sharing  → SeniorSharingSettings
│   │   └── /senior/settings/help     → SeniorHelp
│   └── /senior/alert      → MissingAlertDetail (독립, 탭 없음)
│
├── /guardian (GuardianLayout — 하단 탭 4개 + 배지)
│   ├── /guardian          → GuardianDashboard
│   ├── /guardian/device   → GuardianDevice
│   ├── /guardian/history  → GuardianHistory
│   ├── /guardian/settings → GuardianSettings
│   │   ├── /guardian/settings/target  → GuardianTargetManagement
│   │   ├── /guardian/settings/alerts  → GuardianAlertSettings
│   │   └── /guardian/settings/export  → GuardianExportRecords
│   └── /guardian/incident/:id → IncidentDetail (독립, 탭 없음)
│
└── /map/:id?  → IncidentMapViewer (공유, 인증 불필요)
```

---

## 전역 상태 구조 (AppContext)

```typescript
AppContext
├── auth: AuthState
│   ├── isAuthenticated: boolean
│   ├── role: 'ELDER' | 'CAREGIVER' | null
│   ├── accessToken: string | null
│   ├── userId: string | null
│   └── email: string | null
├── authReady: boolean              // Supabase 세션 복원 완료 여부
├── loginWithPassword(email, password) → Promise<AuthState>
├── logout() → Promise<void>
│
├── appState: AppState
│   ├── system: SystemState         // 배터리, 연결, 위치
│   ├── userStatus: UserStatus      // 상태(NORMAL/MISSING_SUSPECTED), 누락 물품
│   └── incidents: IncidentItem[]   // 사건 목록
│
├── settings: SettingsState
│   ├── loudAlarm, voiceGuide
│   ├── locationSharing
│   ├── pushNotification, smsUrgent
├── updateSettings(partial)         // → persistSettings() 호출
│
├── triggerMissingScenario()        // → persistUserStatus() 호출
├── triggerNormalScenario()         // → persistUserStatus() 호출
├── updateIncidentState(id, state, memo?) // → persistIncidentPatch() 호출
└── markIncidentRead(id)            // → persistIncidentPatch() 호출
```

---

## 데이터 흐름

```
[컴포넌트]
    │  useApp() 훅으로 Context 읽기
    ▼
[AppContext]
    │  Supabase 설정 여부에 따라
    ├─ 미설정 → Mock 데이터 사용 (개발 모드)
    └─ 설정됨 → supabase-data.ts 함수 호출
                    │
                    ▼
              [supabase-data.ts]
                  Supabase DB 읽기/쓰기
                    │
                    ▼
              [Supabase Postgres]
                  profiles, incidents, app_settings, ...
```

---

## 인증 흐름

```
앱 시작
│
├─ isSupabaseConfigured? No  → authReady = true (Mock 모드)
│
└─ Yes → getInitialSupabaseAuthState()
         │  세션 있음 → sessionToAuthState() → profiles.role 조회 → AuthState
         │  세션 없음 → defaultAuthState
         └─ subscribeToSupabaseAuthChanges() → 세션 변경 시 자동 업데이트
```

---

## 환경 변수

| 변수 | 필수 | 설명 |
|------|------|------|
| `VITE_SUPABASE_URL` | 아니오 | Supabase 프로젝트 URL (미설정 시 Mock 모드) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | 아니오 | Supabase anon 키 |

`.env.local` (gitignore됨) 또는 Render 환경 변수에 설정.

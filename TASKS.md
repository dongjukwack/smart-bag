# SmartBag — 개발 Task List

> 기준일: 2026-04-03
> 상태: `[x]` 완료 · `[/]` 진행중 · `[ ]` 미완

---

## ✅ Phase 1 — UI 기반 구축 (완료)

### 환경 설정
- [x] Vite + React + TypeScript 프로젝트 초기화
- [x] Tailwind CSS v4 설정
- [x] antd-mobile 설치 및 테마 적용
- [x] Pretendard 폰트 적용
- [x] react-router-dom v7 라우팅 구성
- [x] react-leaflet + leaflet 지도 라이브러리 설치

### 공통 컴포넌트
- [x] BottomNav → antd-mobile TabBar 교체
- [x] SeniorLayout (4탭: 홈/기록/기기/설정)
- [x] GuardianLayout (4탭 + 배지 카운트)

### 상태 관리
- [x] AppContext — auth, appState, settings
- [x] updateIncidentState() — 사건 상태/메모 변경
- [x] markIncidentRead() — 읽음 처리
- [x] updateSettings() — 설정 저장
- [x] triggerMissingScenario() / triggerNormalScenario() — 데모용
- [x] mockData.ts — 초기 Mock 데이터

---

## ✅ Phase 2 — 고령자 모드 (완료)

- [x] 로그인 페이지 (RoleSelection) — antd Input/Button, 큰 폰트
- [x] 고령자 홈 (SeniorHome) — 상태카드, 긴급버튼, 메뉴
- [x] 고령자 기록 (SeniorHistory) — 카드 클릭→상세, 읽음처리
- [x] 고령자 기기 (SeniorDevice) — ProgressBar, Toast 피드백
- [x] 고령자 설정 (SeniorSettings) — List, 계정 카드, 로그아웃
- [x] 연결된 사용자 관리 (SeniorConnectedUsers)
- [x] 알림 수신 설정 (SeniorAlertSettings) — Switch, state 저장
- [x] 공유 범위 설정 (SeniorSharingSettings) — 3단계, state 저장
- [x] 도움말 (SeniorHelp) — Collapse FAQ
- [x] 누락 알림 상세 (MissingAlertDetail)
  - [x] 누락 물품 리스트
  - [x] 위치정보 → 지도 연결
  - [x] "다시 확인하기" → 상태 NORMAL 복원

---

## ✅ Phase 3 — 보호자 모드 (완료)

- [x] 보호자 홈 (GuardianDashboard)
  - [x] 긴급 사건 카드 (미해결 목록)
  - [x] 정상/확인필요 건수 요약
  - [x] 기기 상태 미니카드
  - [x] 최근 알림 리스트
- [x] 보호자 기기 (GuardianDevice) — 배터리, 위치
- [x] 보호자 기록 (GuardianHistory) — 사건 목록, 상태 Tag
- [x] 보호자 설정 (GuardianSettings) — 계정 카드, 로그아웃
- [x] 대상자 관리 (GuardianTargetManagement)
- [x] 위급 알림 설정 (GuardianAlertSettings) — Switch, state 저장
- [x] 사건 기록 내보내기 (GuardianExportRecords) — CSV 실제 다운로드
- [x] 사건 상세 (IncidentDetail)
  - [x] 메모 입력 + 저장
  - [x] 연락하기 → caregiverAcknowledged 상태
  - [x] 해결 완료 → resolved 상태 + 홈 복귀

---

## ✅ Phase 4 — 공유 기능 (완료)

- [x] 지도 (IncidentMapViewer)
  - [x] Leaflet OpenStreetMap
  - [x] 사용자 마커 (파랑) / 가방 마커 (빨강)
  - [x] 점선 Polyline 연결
  - [x] incident.id 기반 좌표 or 현재 상태 좌표
  - [x] 역할별 하단 버튼 (고령자/보호자)
- [x] ScenarioTester 플로팅 버튼

---

## ✅ Phase 5 — 품질 검증 (완료)

- [x] TypeScript 타입 검사 (`tsc --noEmit`)
- [x] Production 빌드 (`npm run build`)
- [x] 모바일 뷰포트 (375×812) 렌더링 확인
- [x] 전체 플로우 테스트 (고령자/보호자 시나리오)
- [x] PRD.md 작성
- [x] TASKS.md 작성

---

## [/] Phase 6 — Supabase Auth / DB 연동 (진행중)

### 인증
- [x] Supabase Auth 이메일/비밀번호 로그인
- [x] 세션 복원 및 auth state 구독
- [x] `profiles.role` fallback 기반 역할 판별
- [ ] 회원가입/비밀번호 재설정 UX

### 데이터베이스
- [x] `supabase/schema.sql` 작성
- [x] `profiles`, `care_links`, `device_states`, `user_statuses`, `incidents`, `app_settings` 테이블 생성
- [x] RLS 정책 적용
- [x] 고령자 첫 로그인 시 기본 row 자동 seed
- [x] 설정 저장 DB 연동
- [x] 사건 상태/메모/읽음 처리 DB 연동
- [x] 누락/정상 시나리오 상태 DB 반영
- [ ] 프로필/연결 관계 UI를 DB 데이터로 완전 치환

### 실시간 데이터
- [ ] Supabase Realtime 또는 Polling 연동
- [ ] 배터리/연결 상태 실시간 업데이트
- [ ] 누락 감지 시 자동 사건 생성

### 디바이스/알림 기능
- [ ] 가방 상태 폴링 또는 센서 연동
- [ ] 가방 소리 울리기 실제 기기 연동
- [ ] FCM (Firebase Cloud Messaging) Push 알림
- [ ] 보호자 SMS 수신 연동
- [ ] 실제 전화 연결 (`tel:` 딥링크)
- [ ] TTS (음성 안내) 연결

### 배포
- [x] GitHub 원격 저장소 푸시
- [x] Render Blueprint (`render.yaml`) 작성
- [x] Render 정적 사이트 배포

---

## ⬜ Phase 7 — 고도화 (선택)

- [ ] PWA (Progressive Web App) 설치 지원
- [ ] Google Maps API 교체 (정밀 길찾기)
- [ ] 다국어 지원 (i18n)
- [ ] 앱스토어 배포 (Capacitor 또는 React Native 전환)

---

## 파일 구조

```
smartbag v2/
├── src/
│   ├── App.tsx                          # 라우팅
│   ├── main.tsx                         # 진입점
│   ├── index.css                        # 글로벌 스타일
│   ├── lib/
│   │   ├── supabase.ts                  # Supabase auth
│   │   └── supabase-data.ts             # DB 읽기/쓰기/bootstrap
│   ├── types/
│   │   └── index.ts                     # 타입 정의
│   ├── store/
│   │   ├── AppContext.tsx               # 전역 상태
│   │   ├── mockData.ts                  # Mock 데이터
│   │   └── ScenarioTester.tsx          # 데모용 시나리오 전환
│   ├── components/
│   │   ├── BottomNav.tsx               # 하단 탭바
│   │   ├── RowActionCard.tsx           # 공통 메뉴 카드
│   │   └── AccountSummaryCard.tsx      # 설정 계정 요약 카드
│   └── pages/
│       ├── Login/
│       │   └── RoleSelection.tsx
│       ├── Senior/
│       │   ├── SeniorLayout.tsx
│       │   ├── SeniorHome.tsx
│       │   ├── SeniorHistory.tsx
│       │   ├── SeniorDevice.tsx
│       │   ├── SeniorSettings.tsx
│       │   ├── SeniorSettingsPages.tsx
│       │   └── MissingAlertDetail.tsx
│       ├── Guardian/
│       │   ├── GuardianLayout.tsx
│       │   ├── GuardianDashboard.tsx
│       │   ├── GuardianStubs.tsx        # Device, History, Settings
│       │   ├── GuardianSettingsPages.tsx
│       │   └── IncidentDetail.tsx
│       └── Shared/
│           └── IncidentMapViewer.tsx
├── supabase/
│   └── schema.sql                       # Supabase 스키마 / RLS
├── render.yaml                          # Render Blueprint
├── PRD.md                               # 제품 요구사항 문서
├── TASKS.md                             # 개발 태스크 목록 (이 파일)
└── package.json
```

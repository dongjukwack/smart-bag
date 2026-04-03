# SmartBag — Product Requirements Document (PRD)

## 1. 프로젝트 개요

| 항목 | 내용 |
|---|---|
| **프로젝트명** | SmartBag |
| **버전** | 1.2.0 |
| **플랫폼** | 모바일 웹앱 (iOS/Android 브라우저, PWA 확장 가능) |
| **기술 스택** | React + TypeScript + Vite + Tailwind CSS v4 + Ant Design Mobile |
| **현재 상태** | 프론트엔드 완성, Supabase Auth/DB 기본 연동 완료, 실시간 센서/알림 연동 대기 |

---

## 1.1 핵심 문제 정의

- SmartBag의 핵심 문제는 `가방 분실 방지`가 아니라 `외출 전 필수품 누락 방지`이다.
- 주요 누락 대상은 `지갑`, `약통` 같은 외출 필수품이다.
- 가방은 필수품을 담는 기준 컨테이너이자 센서 장치이며, 제품은 `필수품이 가방에 들어갔는지`를 중심으로 판단한다.

---

## 2. 제품 사용자

### A. 고령자 (Elder)
- SmartBag 가방과 앱을 직접 사용하는 노인
- 디지털 기기 사용이 서투를 수 있음
- **핵심 니즈**: 외출 전에 필수품을 가방에 빠뜨리지 않도록 돕고, 누락 의심 시 쉽게 다시 확인하게 하기

### B. 보호자 (Caregiver)
- 고령자의 가족, 요양사 등
- **핵심 니즈**: 고령자가 필수품을 빠뜨리고 외출했을 가능성을 빠르게 파악하고, 위치/가방 상태를 바탕으로 대응하기

---

## 3. 접근성 기준 (Senior-Friendly)

| 항목 | 기준 |
|---|---|
| 최소 폰트 크기 | **16px** (본문), 28px (제목) |
| 터치 타겟 최소 크기 | **48×48px** (WCAG 2.1 AAA) |
| 버튼 최소 높이 | **56px** |
| 색상 대비 | 4.5:1 이상 (WCAG AA) |
| 아이콘 표시 | 아이콘 + 텍스트 라벨 항상 함께 |
| 피드백 방식 | Toast / Dialog (alert() 사용 금지) |

---

## 4. 핵심 기능 요구사항

### 4.1 공통

- [x] 이메일/비밀번호 로그인 (Supabase Auth)
- [x] 역할 선택 (고령자 / 보호자)
- [x] 로그아웃

### 4.2 고령자 모드

#### 홈 (SeniorHome)
- [x] 가방 연결 상태 표시 (WiFi 아이콘 + 색상 Tag)
- [x] 상태 카드 자동 전환: 정상(초록) ↔ 누락의심(빨강)
- [x] 누락 상황 시 "지금 확인하기" 긴급 버튼 출현
- [x] 최근 기록 / 기기 상태 / 설정 링크 메뉴

#### 기록 (SeniorHistory)
- [x] 사건 목록 표시 (읽음/미읽음 구분)
- [x] 사건 클릭 → 누락 알림 상세 이동
- [x] 읽음 처리

#### 기기 상태 (SeniorDevice)
- [x] 연결 상태 카드
- [x] 배터리 퍼센트 + ProgressBar
- [x] 마지막 위치 → 지도 연결
- [x] "가방 소리 울리기" → Toast 피드백

#### 설정 (SeniorSettings)
- [x] 연결된 사용자 관리
- [x] 알림 수신 설정 (Switch, state 저장)
- [x] 공유 범위 설정 (항상/위급시/끄기, state 저장)
- [x] 도움말 (Collapse FAQ)
- [x] 로그아웃 (Dialog 확인)

#### 누락 알림 상세 (MissingAlertDetail)
- [x] 누락 물품 리스트 표시
- [x] 위치 정보 (내 위치 / 가방 위치) → 지도 연결
- [x] "다시 확인하기" → 상태 NORMAL 복원 + 홈 이동
- [x] "보호자에게 알리기" → Toast
- [x] "음성으로 안내 듣기" → Toast (TTS 연동 대기)

### 4.3 보호자 모드

#### 홈 대시보드 (GuardianDashboard)
- [x] 긴급 사건 카드 (open/userRechecking 상태 목록)
- [x] 정상/확인필요 건수 요약
- [x] 기기 상태 미니 카드 (배터리 + 연결상태)
- [x] 최근 알림 리스트 → 사건 상세 이동
- [x] 홈탭 배지 (긴급 미해결 건수)

#### 기기 (GuardianDevice)
- [x] 연결 상태 카드
- [x] 배터리 ProgressBar
- [x] 마지막 위치 → 지도 연결

#### 사건 기록 (GuardianHistory)
- [x] 전체 사건 목록 (읽음/미읽음, 상태 Tag)
- [x] 클릭 → 사건 상세 이동

#### 설정 (GuardianSettings)
- [x] 대상자 관리 (정보 표시, 연결 추가)
- [x] 위급 알림 설정 (Switch, state 저장)
- [x] 사건 기록 내보내기 (CSV 다운로드)
- [x] 로그아웃

#### 사건 상세 (IncidentDetail)
- [x] 사건 제목/시간/상태 Tag
- [x] 위치 정보 → 지도 연결
- [x] 보호자 메모 입력 + 저장
- [x] "연락하기" → 상태 caregiverAcknowledged 전환
- [x] "해결 완료" → 상태 resolved 전환 + 대시보드 복귀

### 4.4 공유 기능

#### 지도 (IncidentMapViewer)
- [x] Leaflet 기반 OpenStreetMap
- [x] 사용자 마커 (파랑) + 가방 마커 (빨강)
- [x] 두 지점 간 점선 연결 (Polyline)
- [x] incident.id 있으면 해당 사건 좌표, 없으면 현재 상태 좌표
- [x] 고령자: "가방 위치로 길찾기" 버튼
- [x] 보호자: "전화" + "상세화면 복귀" 버튼

---

## 5. 상태 관리 구조

```
AppContext
├── auth: { isAuthenticated, role }
├── appState
│   ├── system: { status, batteryLevel, lastSyncTime, lastConnectedLocation }
│   ├── userStatus: { status, messageTitle, messageDesc, missingItems, userCurrentLocation }
│   └── incidents: IncidentItem[]
├── settings
│   ├── loudAlarm: boolean
│   ├── voiceGuide: boolean
│   ├── locationSharing: 'always' | 'emergency' | 'off'
│   ├── pushNotification: boolean
│   └── smsUrgent: boolean
├── updateIncidentState(id, newState, memo?)
├── markIncidentRead(id)
├── updateSettings(partial)
├── triggerMissingScenario()
└── triggerNormalScenario()
```

---

## 6. 네비게이션 구조

```
/ (로그인)
│
├── /senior (SeniorLayout — 하단 탭 4개)
│   ├── /senior          → SeniorHome
│   ├── /senior/history  → SeniorHistory
│   ├── /senior/device   → SeniorDevice
│   ├── /senior/settings → SeniorSettings
│   │   ├── /senior/settings/users   → SeniorConnectedUsers
│   │   ├── /senior/settings/alerts  → SeniorAlertSettings
│   │   ├── /senior/settings/sharing → SeniorSharingSettings
│   │   └── /senior/settings/help    → SeniorHelp
│   └── /senior/alert    → MissingAlertDetail (독립 페이지)
│
├── /guardian (GuardianLayout — 하단 탭 4개, 배지 포함)
│   ├── /guardian          → GuardianDashboard
│   ├── /guardian/device   → GuardianDevice
│   ├── /guardian/history  → GuardianHistory
│   ├── /guardian/settings → GuardianSettings
│   │   ├── /guardian/settings/target  → GuardianTargetManagement
│   │   ├── /guardian/settings/alerts  → GuardianAlertSettings
│   │   └── /guardian/settings/export  → GuardianExportRecords
│   └── /guardian/incident/:id → IncidentDetail (독립 페이지)
│
└── /map/:id? → IncidentMapViewer (독립 페이지, 인증 불필요)
```

---

## 7. 커스텀 백엔드 연동 시 필요한 API

현재 구현은 Supabase Auth + Postgres 테이블을 사용한다. 아래 API 목록은 추후 별도 Spring Boot / Node.js 서버로 이전하거나 확장할 때 필요한 경계 정의다.

| API | 메서드 | 설명 |
|-----|--------|------|
| `/auth/login` | POST | 이메일/비밀번호 로그인 |
| `/auth/logout` | POST | 로그아웃 |
| `/users/me` | GET | 내 프로필 조회 |
| `/devices` | GET | 연결된 가방 정보 |
| `/devices/:id/ring` | POST | 가방 소리 울리기 |
| `/incidents` | GET | 사건 목록 조회 |
| `/incidents/:id` | GET | 사건 상세 조회 |
| `/incidents/:id` | PATCH | 사건 상태/메모 수정 |
| `/incidents/:id/read` | POST | 읽음 처리 |
| `/location/current` | GET | 현재 위치 조회 |
| `/settings` | GET/PATCH | 알림/공유 설정 조회/수정 |

---

## 8. 향후 개발 항목

| 우선순위 | 항목 |
|---------|------|
| 높음 | 프로필/연결 관계 UI를 DB 실데이터 기준으로 완전 전환 |
| 높음 | 실시간 가방 센서 데이터 연동 (WebSocket, Realtime 또는 Polling) |
| 높음 | 가방 소리 울리기 / 전화 / 음성안내 실제 기능 연결 |
| 중간 | FCM Push 알림 연동 |
| 중간 | 서버 전용 API 계층 분리 (Spring Boot / Node.js) |
| 낮음 | PWA 설치 지원 |
| 낮음 | Google Maps API 교체 (현재 OpenStreetMap) |
| 낮음 | 다국어 지원 (i18n) |

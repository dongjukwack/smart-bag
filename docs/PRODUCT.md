# SmartBag — 제품 정의 (PRODUCT)

## 핵심 문제 정의

SmartBag의 핵심 문제는 **`가방 분실 방지`가 아니라 `외출 전 필수품 누락 방지`**다.

- 주요 누락 대상: `지갑`, `약통`, `열쇠`, `교통카드` 같은 외출 필수품
- 제품이 판단하는 기준: **"오늘 필수품이 가방에 들어갔는가?"**
- 가방은 필수품을 담는 기준 컨테이너이자 센서 장치

---

## 사용자

### A. 고령자 (Elder)

- SmartBag 가방과 앱을 직접 사용하는 노인
- 디지털 기기에 익숙하지 않을 수 있음
- **핵심 니즈**: 외출 전 필수품을 빠뜨리지 않도록 돕고, 누락 의심 시 쉽게 재확인하게 하기

### B. 보호자 (Caregiver)

- 고령자의 가족, 요양사 등
- **핵심 니즈**: 고령자가 필수품을 빠뜨리고 외출했을 가능성을 빠르게 파악하고, 위치·가방 상태를 바탕으로 대응하기

---

## 접근성 기준 (Senior-Friendly)

| 항목 | 기준 |
|------|------|
| 최소 폰트 크기 | **16px** 본문, 28px 제목 |
| 터치 타겟 | 최소 **48×48px** (WCAG 2.1 AAA) |
| 버튼 최소 높이 | **56px** |
| 색상 대비 | 4.5:1 이상 (WCAG AA) |
| 아이콘 | 아이콘 + 텍스트 라벨 항상 함께 |
| 피드백 | Toast / Dialog (`alert()` 사용 금지) |

---

## 기능 요구사항

### 공통
- [x] 이메일/비밀번호 로그인 (Supabase Auth)
- [x] 역할 선택 (고령자 / 보호자)
- [x] 로그아웃

### 고령자 모드

#### 홈 (SeniorHome)
- [x] 가방 연결 상태 표시
- [x] 상태 카드 자동 전환: 정상(초록) ↔ 누락 의심(빨강)
- [x] 누락 상황 시 "지금 확인하기" 긴급 버튼 출현
- [x] 최근 기록 / 기기 상태 / 설정 메뉴 (RowActionCard)

#### 기록 (SeniorHistory)
- [x] 사건 목록 (읽음/미읽음 구분)
- [x] 클릭 → 누락 알림 상세 이동
- [x] 읽음 처리 (DB 반영)

#### 기기 상태 (SeniorDevice)
- [x] 연결 상태 (device-hero-card)
- [x] 배터리 ProgressBar
- [x] 마지막 위치 → 지도 연결
- [x] 가방 소리 울리기 (Toast)

#### 설정 (SeniorSettings)
- [x] AccountSummaryCard (프로필)
- [x] 연결된 사용자 관리
- [x] 알림 수신 설정 (Switch, DB 저장)
- [x] 공유 범위 설정 (3단계, DB 저장)
- [x] 도움말 (Collapse FAQ)
- [x] 로그아웃 (Dialog 확인 → Supabase signOut)

#### 누락 알림 상세 (MissingAlertDetail)
- [x] 누락 물품 리스트 표시
- [x] 위치 정보 → 지도 연결
- [x] "다시 확인하기" → 상태 NORMAL 복원 + 홈 이동
- [x] "보호자에게 알리기" → Toast
- [x] "음성으로 안내 듣기" → Toast (TTS 연동 대기)

### 보호자 모드

#### 홈 대시보드 (GuardianDashboard)
- [x] 긴급 사건 카드 (guardian-alert-panel)
- [x] 정상/확인필요 건수 요약 (dashboard-mini-panel)
- [x] 기기 상태 미니카드 (배터리 + 연결 상태)
- [x] 최근 알림 리스트 (RowActionCard)
- [x] 홈탭 배지 (미해결 건수)

#### 기기 (GuardianDevice)
- [x] 연결 상태 (device-hero-card)
- [x] 배터리 ProgressBar
- [x] 마지막 위치 → 지도 연결

#### 사건 기록 (GuardianHistory)
- [x] 전체 사건 목록 (읽음/미읽음, 상태 Tag)
- [x] 클릭 → 사건 상세

#### 설정 (GuardianSettings)
- [x] AccountSummaryCard (보호자 프로필)
- [x] 대상자 관리
- [x] 위급 알림 설정 (Switch, DB 저장)
- [x] 사건 기록 내보내기 (CSV 다운로드)
- [x] 로그아웃

#### 사건 상세 (IncidentDetail)
- [x] 사건 제목/시간/상태 Tag (detail-hero-card)
- [x] 위치 정보 타임라인 (detail-location-row)
- [x] 보호자 메모 입력 + 저장 (DB 반영)
- [x] 연락하기 → `caregiverAcknowledged` 상태
- [x] 해결 완료 → `resolved` 상태 + 홈 복귀

### 지도 (IncidentMapViewer)
- [x] Leaflet + OpenStreetMap
- [x] 사용자 마커(파랑) + 가방 마커(빨강)
- [x] 점선 Polyline 연결
- [x] 고령자: "가방 위치로 길찾기" 버튼
- [x] 보호자: "전화" + "상세화면 복귀" 버튼

---

## 향후 개발 항목

| 우선순위 | 항목 |
|---------|------|
| 높음 | 프로필/연결 관계 UI를 DB 실데이터 기준으로 완전 전환 |
| 높음 | 실시간 가방 센서 데이터 연동 (Supabase Realtime / Polling) |
| 높음 | 가방 소리 울리기 / 전화 / 음성 안내 실제 기능 연결 |
| 중간 | FCM Push 알림 연동 |
| 중간 | 서버 전용 API 계층 분리 (Spring Boot / Node.js) |
| 낮음 | PWA 설치 지원 |
| 낮음 | Google Maps API 교체 |
| 낮음 | 다국어 지원 (i18n) |

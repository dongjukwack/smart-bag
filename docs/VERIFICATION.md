# SmartBag — 검증 기준 (VERIFICATION)

## 1. 커밋 전 필수 체크리스트

```bash
# 1. 타입 검사
npx tsc --noEmit

# 2. 프로덕션 빌드
npm run build

# 3. 빌드 결과 미리보기 (선택)
npm run preview
```

> 위 세 명령 중 하나라도 실패하면 **커밋하지 말 것**.

---

## 2. TypeScript 규칙

- `tsc --noEmit` 오류 0개: **필수**
- `any` 타입: **금지** — 불가피한 경우 `// eslint-disable-next-line @typescript-eslint/no-explicit-any` 주석 추가 후 사유 설명
- `ToastHandler` 반환 타입 이슈: antd-mobile Button `onClick`에 `Toast.show()` 직접 반환 금지 → `() => { Toast.show(...); }` 래핑 필수

---

## 3. 빌드 기준

| 기준 | 목표값 |
|------|--------|
| 빌드 성공 | exit code 0 |
| JS 번들 크기 | 600KB 이하 (gzip 200KB 이하) |
| CSS 번들 크기 | 80KB 이하 |
| 청크 분할 경고 | 무시 가능 (현재 SPA 구조상 불가피) |

---

## 4. 수동 테스트 시나리오

### 고령자 플로우

| 단계 | 검증 항목 |
|------|-----------|
| 로그인 | "고령자 모드로 시작" 버튼 클릭 → `/senior` 이동 |
| 홈 | 상태카드 초록 (정상), 배지 없음 확인 |
| 기록 | 사건 목록 렌더링, 클릭 시 → `/senior/alert` 이동 |
| 기기 | 배터리 85% ProgressBar, 지도 보기 링크 작동 |
| 설정 | 알림 Switch 토글 → 재방문 시 값 유지 |
| 누락 시나리오 | ScenarioTester → "누락 발생" → 홈 상태카드 빨강 전환 확인 |
| 누락 상세 | "지금 확인하기" → `/senior/alert` 이동, 옳은 물품 표시 |
| 정상 복원 | "다시 확인하기" → 홈 상태카드 초록 복원 |

### 보호자 플로우

| 단계 | 검증 항목 |
|------|-----------|
| 로그인 | "보호자 모드로 시작" 버튼 클릭 → `/guardian` 이동 |
| 대시보드 | 누락 시나리오 후 긴급카드 표시, 홈탭 배지 1 확인 |
| 사건 목록 | 클릭 → `/guardian/incident/:id` 이동 |
| 사건 상세 | 메모 입력 후 "메모 저장" → 뒤로 갔다 재방문 시 메모 유지 |
| 해결 완료 | "해결 완료" → resolved 상태, 대시보드 배지 사라짐 |
| 기록 내보내기 | CSV 다운로드 버튼 → `.csv` 파일 저장 확인 |

### 지도

| 단계 | 검증 항목 |
|------|-----------|
| 기기 페이지 → "지도 보기" | `/map` 이동, Leaflet 지도 렌더링 확인 |
| 마커 | 파란 마커 (사용자), 빨간 마커 (가방), 점선 연결선 |
| 사건 상세 → "지도 보기" | `/map/:id` 이동, 사건 좌표로 마커 배치 |

---

## 5. 모바일 뷰포트 기준

| 항목 | 기준 |
|------|------|
| 테스트 기준 해상도 | 375×812 (iPhone 14) |
| 기본 폰트 | 16px 이상 |
| 버튼 높이 | 56px 이상 |
| 터치 타겟 최소 크기 | 48×48px |
| 하단 탭바 | safe-area-inset-bottom 적용 확인 |
| 상단 | safe-area-inset-top 적용 확인 |

---

## 6. Supabase 연동 검증

Supabase 환경 변수가 설정된 경우 추가로 확인:

```bash
# .env.local 설정 확인
cat .env.local
# VITE_SUPABASE_URL=https://xxx.supabase.co
# VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...
```

| 검증 항목 | 방법 |
|-----------|------|
| 로그인 성공 | 실제 이메일/비밀번호로 로그인 → `profiles` 테이블 `role` 기반 라우팅 |
| 세션 유지 | 페이지 새로고침 후 로그인 상태 유지 |
| 설정 저장 | Switch 토글 → Supabase `app_settings` 테이블 반영 확인 |
| 사건 상태 변경 | "해결 완료" → `incidents` 테이블 `action_state = 'resolved'` 확인 |

---

## 7. 알려진 제약 및 우회

| 이슈 | 원인 | 우회 |
|------|------|------|
| `ToastHandler` 타입 오류 | antd-mobile `onClick` 반환 타입 strict | `() => { Toast.show(...); }` 래핑 |
| Leaflet SSR 이슈 | 서버 환경에서 `window` 없음 | Vite 환경이므로 무관, CSR 전용 |
| 청크 크기 경고 | SPA 단일 번들 구조 | 600KB 이하 유지 시 무시 가능 |

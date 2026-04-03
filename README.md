# SmartBag

SmartBag은 고령자가 외출 전에 `지갑`, `약통` 같은 필수품을 가방에 넣지 않고 나가는 상황을 줄이기 위한 모바일 웹앱 프로토타입입니다.

이 프로젝트의 핵심은 `가방 분실 방지`가 아닙니다. 가방은 필수품 누락 여부를 판단하는 기준 컨테이너이자 센서 장치이며, 제품의 중심 문제는 `필수품 누락 방지`입니다.

## 제품 목적

- 고령자가 외출 전에 필수품을 빠뜨리지 않도록 돕는다.
- 누락 의심 상황이 발생하면 고령자에게 즉시 재확인을 유도한다.
- 필요 시 보호자가 사건을 빠르게 확인하고 대응할 수 있게 한다.

## 현재 상태

- 프론트엔드 UI 구현 완료
- Supabase Auth 이메일/비밀번호 로그인 연결 완료
- Supabase DB 스키마 및 기본 상태 동기화 연결 완료
- 첫 고령자 로그인 시 `device_states`, `user_statuses`, `incidents`, `app_settings` 기본 데이터 자동 시드
- 일부 동작은 아직 Mock 또는 후속 연동 대기
  - 가방 소리 울리기
  - 음성 안내(TTS)
  - 실제 전화 연결
  - 푸시/SMS 알림
  - 실시간 센서 데이터
- Render 정적 사이트 배포 가능 상태 (`render.yaml` 포함)

## 사용자 역할

### 고령자

- 외출 준비 상태를 확인한다.
- 누락 의심 알림을 받고 다시 확인한다.
- 가방 연결 상태, 배터리, 마지막 위치를 본다.

### 보호자

- 누락 의심 사건을 모니터링한다.
- 사건 상세에서 메모를 남기고 연락/해결 처리를 한다.
- 대상자의 기기 상태와 위치 맥락을 확인한다.

## 주요 문서

- `PRD.md`: 제품 요구사항, 접근성 기준, 상태 구조, 라우팅, API 경계
- `TASKS.md`: 구현 완료 범위와 남은 개발 단계

## 기술 스택

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Ant Design Mobile
- React Router
- React Leaflet + Leaflet

## 로컬 실행

```bash
npm install
npm run dev
```

프로덕션 빌드:

```bash
npm run build
```

## Supabase 연결

1. `.env.example`을 참고해서 프로젝트 루트에 `.env.local` 또는 `.env`를 만듭니다.
2. 아래 값을 채웁니다.

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

3. Supabase SQL Editor에서 [schema.sql](/Users/kwackdongju/smartbag v2/supabase/schema.sql#L1)을 전체 실행합니다.
4. 사용자 프로필과 연결 관계를 넣습니다.

```sql
insert into public.profiles (id, role, full_name)
values
  ('ELDER_USER_UUID', 'ELDER', '김영수 님'),
  ('CAREGIVER_USER_UUID', 'CAREGIVER', '동주 님')
on conflict (id) do update
set role = excluded.role,
    full_name = excluded.full_name;

insert into public.care_links (elder_id, caregiver_id, is_primary)
values
  ('ELDER_USER_UUID', 'CAREGIVER_USER_UUID', true)
on conflict (elder_id, caregiver_id) do update
set is_primary = excluded.is_primary;
```

5. Supabase 사용자에는 앱 역할이 있어야 합니다.

- `user_metadata.role` 또는 `app_metadata.role`
- 허용 값: `ELDER`, `CAREGIVER`

역할 메타데이터가 없으면 로그인은 성공해도 앱 진입은 막히도록 되어 있습니다. 메타데이터가 없을 때는 `profiles.role`도 fallback으로 조회합니다.

현재 구현은 `profiles.role` fallback 조회를 지원하므로, 메타데이터 없이도 `profiles` 테이블이 맞게 들어가 있으면 앱 진입이 가능합니다.

## Render 배포

1. GitHub에 현재 브랜치를 푸시합니다.
2. Render 대시보드에서 `New + > Blueprint`로 저장소를 연결합니다.
3. 루트의 [render.yaml](/Users/kwackdongju/smartbag v2/render.yaml#L1)을 그대로 사용합니다.
4. 환경 변수 두 개를 입력합니다.

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

정적 사이트이므로 별도 서버 프로세스는 없습니다. SPA 라우팅은 `render.yaml`의 rewrite 설정으로 처리합니다.

## 구조 요약

```text
src/
├── App.tsx                  # 역할별 라우팅
├── main.tsx                 # 진입점
├── index.css                # 글로벌 스타일 / 접근성 UI 기준 반영
├── lib/
│   ├── supabase.ts          # Supabase 클라이언트 / auth 처리
│   └── supabase-data.ts     # DB bootstrap / 읽기 / 쓰기
├── store/
│   ├── AppContext.tsx       # auth, appState, settings, Supabase sync
│   ├── mockData.ts          # 기본 seed/fallback 데이터
│   └── ScenarioTester.tsx   # 누락/정상 시나리오 전환
├── pages/
│   ├── Login/               # 역할 선택 / Supabase 로그인 / 빠른 테스트 진입
│   ├── Senior/              # 고령자 플로우
│   ├── Guardian/            # 보호자 플로우
│   └── Shared/              # 공용 지도 화면
└── components/
    ├── BottomNav.tsx        # 하단 탭바
    ├── RowActionCard.tsx    # 공통 행형 메뉴 카드
    └── AccountSummaryCard.tsx

supabase/
└── schema.sql               # Supabase Postgres 스키마 / RLS

render.yaml                  # Render Blueprint
```

## 다음 단계

- `profiles`, `care_links` 기반 실데이터를 UI의 이름/관계 정보에 완전 반영
- Supabase Realtime 또는 센서 이벤트 연동
- 푸시 알림, SMS, TTS, `tel:` 딥링크 등 실기능 연결
- 가방 소리 울리기 서버/기기 연동

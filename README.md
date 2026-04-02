# SmartBag

SmartBag은 고령자가 외출 전에 `지갑`, `약통` 같은 필수품을 가방에 넣지 않고 나가는 상황을 줄이기 위한 모바일 웹앱 프로토타입입니다.

이 프로젝트의 핵심은 `가방 분실 방지`가 아닙니다. 가방은 필수품 누락 여부를 판단하는 기준 컨테이너이자 센서 장치이며, 제품의 중심 문제는 `필수품 누락 방지`입니다.

## 제품 목적

- 고령자가 외출 전에 필수품을 빠뜨리지 않도록 돕는다.
- 누락 의심 상황이 발생하면 고령자에게 즉시 재확인을 유도한다.
- 필요 시 보호자가 사건을 빠르게 확인하고 대응할 수 있게 한다.

## 현재 상태

- 프론트엔드 UI 구현 완료
- 전역 상태는 `mockData + AppContext` 기반
- Supabase Auth 연결 가능 상태
- 로그인, 전화, TTS, 푸시, 서버 저장은 일부 Mock 또는 연동 대기 상태
- 백엔드 API 및 실시간 센서 연동은 아직 미완성

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

1. `.env.example`을 참고해서 프로젝트 루트에 `.env`를 만듭니다.
2. 아래 값을 채웁니다.

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

3. Supabase 사용자에는 앱 역할이 있어야 합니다.

- `user_metadata.role` 또는 `app_metadata.role`
- 허용 값: `ELDER`, `CAREGIVER`

역할 메타데이터가 없으면 로그인은 성공해도 앱 진입은 막히도록 되어 있습니다. 메타데이터가 없을 때는 `profiles.role`도 fallback으로 조회합니다.

## 구조 요약

```text
src/
├── App.tsx                  # 역할별 라우팅
├── main.tsx                 # 진입점
├── index.css                # 글로벌 스타일 / 접근성 UI 기준 반영
├── store/
│   ├── AppContext.tsx       # auth, appState, settings
│   ├── mockData.ts          # 데모용 상태 데이터
│   └── ScenarioTester.tsx   # 누락/정상 시나리오 전환
├── pages/
│   ├── Login/               # 역할 선택 / Mock 로그인
│   ├── Senior/              # 고령자 플로우
│   ├── Guardian/            # 보호자 플로우
│   └── Shared/              # 공용 지도 화면
└── components/
    └── BottomNav.tsx        # 하단 탭바
```

## 다음 단계

- JWT 로그인 및 로그인 상태 유지
- 사건 목록/상세/읽음 처리 API 연동
- 설정 저장 API 연동
- 가방 센서 및 연결 상태 실시간 연동
- 푸시 알림, TTS, `tel:` 딥링크 등 실기능 연결

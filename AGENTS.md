# SmartBag — AGENTS.md

AI 코딩 에이전트를 위한 작업 지침서입니다.  
이 파일을 먼저 읽고, `docs/` 하위 문서를 필요한 만큼 참조하세요.

---

## 빠른 참조

| 문서 | 목적 |
|------|------|
| [docs/INDEX.md](docs/INDEX.md) | 문서 목록 및 탐색 지도 |
| [docs/PRODUCT.md](docs/PRODUCT.md) | 제품 목표·사용자·기능 전체 정의 |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | 기술 스택, 디렉터리 구조, 데이터 흐름 |
| [docs/CONVENTIONS.md](docs/CONVENTIONS.md) | 코드 스타일, 컴포넌트 패턴, CSS 규칙 |
| [docs/VERIFICATION.md](docs/VERIFICATION.md) | 빌드·타입검사·수동 테스트 기준 |
| [docs/API.md](docs/API.md) | Supabase 스키마, RLS, DB 계층 |
| [docs/RUNBOOKS/](docs/RUNBOOKS/) | 배포·환경설정·긴급 대응 가이드 |
| [docs/ADR/](docs/ADR/) | 아키텍처 결정 기록 |

---

## 작업 전 필수 확인

1. **기술 스택 변경 금지**: React 19 + Vite 8 + Tailwind v4 + antd-mobile 5 + Supabase 2 — 새 메이저 라이브러리 추가 전 반드시 확인.
2. **CSS 패턴**: `space-y-*`, `mb-*` 대신 `app-page-section` / `gap-*` / BEM 클래스 사용 → [docs/CONVENTIONS.md](docs/CONVENTIONS.md) 참조.
3. **antd-mobile Button onClick**: `() => Toast.show(…)` 직접 할당 시 TypeScript 오류. `() => { Toast.show(…); }` 형태로 래핑.
4. **DB 쓰기**: 모든 DB 쓰기는 `src/lib/supabase-data.ts`의 함수를 통해서만. 컴포넌트에서 직접 supabase 클라이언트 임포트 금지.
5. **인증 게이트**: `PrivateRoute`는 `authReady` 플래그를 기다린 뒤 리디렉션. Supabase 미설정 시에도 개발 Mock 모드로 동작.

---

## 새 기능 추가 체크리스트

- [ ] 타입은 `src/types/index.ts`에 먼저 정의
- [ ] 상태 변경은 `AppContext`에 액션으로 추가
- [ ] DB 연동이 필요하면 `supabase-data.ts`에 함수 추가 후 Context에서 호출
- [ ] 새 페이지는 `App.tsx`에 라우트 등록
- [ ] CSS: 새 BEM 블록은 `src/index.css` 맨 아래 추가
- [ ] `npm run build` 통과 확인 후 커밋

---

## 제약사항

- `src/store/AppContext.tsx`에서 `supabase` 클라이언트를 직접 사용하지 않음 (`src/lib/supabase.ts`만 사용)
- `alert()`, `confirm()` 사용 금지 → `Dialog.confirm()` (antd-mobile) 사용
- 인라인 `style={{ marginBottom: '16px' }}` 대신 `app-page-section` gap 사용
- 고령자 접근성 기준: 최소 폰트 16px, 터치 타겟 48px — 절대 낮추지 말 것

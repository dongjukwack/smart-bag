# SmartBag — 문서 목록 (INDEX)

> `docs/` 폴더의 모든 문서에 대한 탐색 지도입니다.  
> 처음 코드베이스를 접하는 경우 이 순서대로 읽으세요.

---

## 읽기 순서 (추천)

```
1. AGENTS.md (루트)   → AI 에이전트 규칙 요약
2. PRODUCT.md         → 무엇을 만드는가
3. ARCHITECTURE.md    → 어떻게 구성되어 있는가
4. CONVENTIONS.md     → 어떤 규칙으로 코드를 쓰는가
5. API.md             → DB 스키마 및 RLS
6. VERIFICATION.md    → 어떻게 검증하는가
```

---

## 문서 목록

| 파일 | 목적 | 최종 수정 |
|------|------|-----------|
| [PRODUCT.md](PRODUCT.md) | 제품 정의, 사용자 목표, 기능 요구사항 전체 | 2026-04-06 |
| [ARCHITECTURE.md](ARCHITECTURE.md) | 기술 스택, 디렉터리 구조, 데이터 흐름 | 2026-04-06 |
| [CONVENTIONS.md](CONVENTIONS.md) | 코드 스타일, CSS 패턴, 컴포넌트 가이드 | 2026-04-06 |
| [VERIFICATION.md](VERIFICATION.md) | 빌드·타입·수동 테스트 기준 | 2026-04-06 |
| [API.md](API.md) | Supabase 스키마, RLS, `supabase-data.ts` 함수 목록 | 2026-04-06 |
| [RUNBOOKS/](RUNBOOKS/) | 배포·환경설정·긴급 대응 절차 | 2026-04-06 |
| [ADR/](ADR/) | 아키텍처 결정 기록 (의사결정 히스토리) | 2026-04-06 |

---

## 프로젝트 루트 핵심 파일

| 파일 | 목적 |
|------|------|
| `AGENTS.md` | AI 에이전트 지침서 (이 파일 상위) |
| `README.md` | 프로젝트 소개 및 시작 가이드 |
| `PRD.md` | 제품 요구사항 문서 (기능 체크리스트 포함) |
| `TASKS.md` | 개발 태스크 체크리스트 |
| `render.yaml` | Render 배포 Blueprint |
| `supabase/schema.sql` | DB 스키마 및 RLS 정책 |

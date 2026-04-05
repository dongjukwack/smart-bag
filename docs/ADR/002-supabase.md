# ADR-002: 백엔드로 Supabase 선택

- **날짜**: 2026-04-03
- **상태**: 승인됨

## 배경

별도 백엔드 서버 없이 빠르게 Auth + DB를 붙여야 했다. 팀 규모가 작고 초기 출시 속도가 중요한 상황.

## 결정

**Supabase (Auth + Postgres)** 채택.

- 이메일/비밀번호 인증 즉시 사용 가능
- PostgreSQL 기반으로 RLS 정책으로 세밀한 접근 제어
- JS SDK 제공으로 별도 서버 불필요
- `profiles.role` 컬럼으로 고령자/보호자 역할 판별
- 환경 변수 미설정 시 Mock 모드로 로컬 개발 가능

## 결과

`src/lib/supabase.ts` — Auth 헬퍼  
`src/lib/supabase-data.ts` — DB CRUD  
컴포넌트는 이 두 파일을 직접 import하지 않고, AppContext를 통해서만 접근.

## 향후

트래픽 증가 또는 복잡한 비즈니스 로직 필요 시 Spring Boot / Node.js 별도 API 서버로 분리 가능.  
현재 `docs/API.md`에 경계 정의 문서화 완료.

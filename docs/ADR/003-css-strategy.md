# ADR-003: CSS 전략 — Tailwind + BEM 하이브리드

- **날짜**: 2026-04-02
- **상태**: 승인됨

## 배경

Tailwind v4의 유틸리티 클래스 단독 사용 시 복잡한 모바일 카드 스타일에서 JSX가 지나치게 길어지고, `space-y-*` / `mb-*`가 antd-mobile 컴포넌트의 margin과 충돌하는 문제가 있었다.

## 결정

**Tailwind 유틸리티 + BEM 블록 클래스 하이브리드** 전략 채택.

- **레이아웃 유틸리티**(`app-shell`, `app-page`, `app-page-section` 등): `src/index.css`에 BEM 블록으로 정의
- **컴포넌트 클래스**(`device-hero-card`, `guardian-alert-panel`, `detail-hero-card` 등): 역시 BEM으로 정의
- **인라인 간격 금지**: `style={{ marginBottom }}` 대신 `app-page-section`(gap-24px) 사용
- Tailwind는 **flex, grid, items-center** 등 구조적 유틸리티에만 한정 사용

## 결과

- JSX 가독성 향상
- antd-mobile 컴포넌트 margin 충돌 해소
- 새 블록은 `src/index.css` 맨 아래에 추가하는 규칙으로 통일

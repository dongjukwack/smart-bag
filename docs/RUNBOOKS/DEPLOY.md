# SmartBag — 배포 및 환경 설정 가이드 (RUNBOOK: DEPLOY)

## 로컬 개발 환경 시작

```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수 설정 (처음 한 번만)
cp .env.example .env.local
# .env.local 열어서 Supabase URL, KEY 입력
# (미설정 시 Mock 모드로 동작 — 개발에서 OK)

# 3. 개발 서버 시작
npm run dev
# → http://localhost:5173/ (포트 충돌 시 5174)
```

---

## Render 배포

### 방법 1: render.yaml Blueprint (권장)

```yaml
# render.yaml (이미 설정됨)
services:
  - type: web
    name: smart-bag
    runtime: static
    buildCommand: npm ci && npm run build
    staticPublishPath: ./dist
    envVars:
      - key: VITE_SUPABASE_URL
        sync: false
      - key: VITE_SUPABASE_PUBLISHABLE_KEY
        sync: false
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

1. GitHub에 푸시
2. Render Dashboard → "New Blueprint Instance"
3. GitHub repo 연결
4. Environment Variables에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` 입력
5. Deploy

### 방법 2: 수동 배포

```bash
# 프로덕션 빌드
npm run build

# dist/ 폴더를 Render Static Site에 업로드
```

---

## Supabase 초기 설정

```bash
# 1. Supabase 프로젝트 생성
#    → https://supabase.com/dashboard/projects

# 2. SQL Editor에서 스키마 적용
#    supabase/schema.sql 파일 전체 복사 후 실행

# 3. Authentication 설정
#    → Email/Password 활성화
#    → URL Configuration: Site URL = Render 배포 URL

# 4. 사용자 생성
#    → Authentication > Users > Invite User (또는 직접 가입)
#    → profiles 테이블에 role 설정:
#       UPDATE profiles SET role = 'ELDER' WHERE id = '<user-id>';
#       UPDATE profiles SET role = 'CAREGIVER' WHERE id = '<user-id>';
```

---

## 빌드 명령어 참조

```bash
npm run dev        # 개발 서버 (HMR 포함)
npm run build      # 프로덕션 빌드 (tsc + vite build)
npm run preview    # 빌드 결과 로컬 미리보기
npm run lint       # ESLint 검사
npx tsc --noEmit  # 타입 검사만 (빌드 없이)
```

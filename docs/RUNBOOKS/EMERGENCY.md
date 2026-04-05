# SmartBag — 긴급 대응 (RUNBOOK: EMERGENCY)

## 빌드 실패 시

```bash
# 타입 오류 확인
npx tsc --noEmit

# 흔한 원인 1: Toast.show() onClick 직접 반환
# ❌  onClick={() => Toast.show(...)}
# ✅  onClick={() => { Toast.show(...); }}

# 흔한 원인 2: 미사용 import
# → IDE 경고 또는 tsc 메시지 확인 후 삭제
```

---

## 로그인 안 될 때

```
1. Supabase 환경 변수 확인
   - VITE_SUPABASE_URL : https://xxx.supabase.co
   - VITE_SUPABASE_PUBLISHABLE_KEY : eyJ...

2. Supabase Dashboard > Authentication > Users
   - 해당 이메일 계정 존재 확인

3. profiles 테이블에 role 설정 확인
   SELECT id, role FROM profiles WHERE id = '<user-id>';
   → role = 'ELDER' 또는 'CAREGIVER' 이어야 함

4. Supabase > Authentication > URL Configuration
   - Site URL이 현재 배포 URL과 일치하는지 확인
```

---

## 데이터가 화면에 안 나올 때

```
1. Supabase 연결 확인
   - 브라우저 DevTools > Network 탭
   - Supabase API 요청 응답 코드 확인

2. RLS 정책 확인
   - Supabase > Table Editor > policies
   - 해당 테이블에 SELECT 정책이 있는지 확인

3. Mock 모드 fallback 여부 확인
   - isSupabaseConfigured = false이면 Mock 데이터 사용 (이는 정상)
   - .env.local 파일 있는지 확인
```

---

## Render 배포 후 흰 화면

```
1. SPA rewrite 규칙 확인
   render.yaml > routes:
     - type: rewrite
       source: /*
       destination: /index.html

2. 빌드 로그 확인
   Render Dashboard > Service > Logs
   → npm run build 오류 확인

3. 환경 변수 누락 확인
   Render > Service > Environment
   → VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY 존재 여부
```

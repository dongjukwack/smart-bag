# SmartBag — API 및 DB 레이어 (API)

## 1. 개요

현재 백엔드는 **Supabase (Auth + Postgres)** 를 사용한다.  
별도 REST API 서버는 없으며, 클라이언트에서 Supabase JS SDK를 통해 직접 데이터베이스에 접근한다.

> **중요**: 컴포넌트에서 `supabase` 클라이언트를 직접 import하지 않는다.  
> 반드시 `src/lib/supabase-data.ts`의 함수를 거쳐야 한다.

---

## 2. Supabase 설정

### 환경 변수

```
VITE_SUPABASE_URL=https://<project-id>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...   # anon key
```

미설정 시 `isSupabaseConfigured = false` → Mock 데이터 사용 (개발 모드).

### 클라이언트 초기화 (`src/lib/supabase.ts`)

```typescript
export const supabase = isSupabaseConfigured
  ? createClient(url, key, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null;
```

---

## 3. DB 스키마

> 전체 DDL: `supabase/schema.sql`

### `profiles`

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | uuid (PK, FK→auth.users) | Supabase Auth user ID |
| `role` | text | `'ELDER'` 또는 `'CAREGIVER'` |
| `display_name` | text | 표시 이름 |
| `created_at` | timestamptz | |

### `care_links`

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | uuid (PK) | |
| `elder_id` | uuid (FK→profiles) | |
| `caregiver_id` | uuid (FK→profiles) | |
| `is_primary` | boolean | 대표 보호자 여부 |
| `created_at` | timestamptz | |

### `device_states`

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `user_id` | uuid (PK, FK→profiles) | elder의 user ID |
| `connection_status` | text | `bagConnected` / `connectionLost` / ... |
| `battery_level` | integer | 0–100 |
| `last_sync_at` | timestamptz | |
| `location_permission` | boolean | |
| `notification_permission` | boolean | |
| `last_connected_address` | text | |
| `last_connected_at` | timestamptz | |
| `last_connected_lat` | float | |
| `last_connected_lng` | float | |

### `user_statuses`

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `user_id` | uuid (PK, FK→profiles) | elder의 user ID |
| `status` | text | `NORMAL` / `MISSING_SUSPECTED` / `NEEDS_RECHECK` / `DEVICE_CHECK` |
| `message_title` | text | 상태 메시지 제목 |
| `message_desc` | text | 상태 메시지 설명 |
| `missing_items` | jsonb | 누락 물품 배열 |
| `user_location_address` | text | |
| `user_location_at` | timestamptz | |
| `user_location_lat` | float | |
| `user_location_lng` | float | |

### `incidents`

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | uuid (PK) | |
| `user_id` | uuid (FK→profiles) | elder의 user ID |
| `type` | text | `NORMAL` / `MISSING_SUSPECTED` / `RECHECK` / `RESOLVED` / ... |
| `title` | text | |
| `occurred_at` | timestamptz | |
| `is_read` | boolean | 읽음 여부 |
| `action_state` | text | `open` / `userRechecking` / `caregiverAcknowledged` / `resolved` |
| `caregiver_memo` | text | 보호자 메모 |
| `location_context` | jsonb | `{ userLocation, userLat, userLng, bagLocation, bagLat, bagLng }` |

### `app_settings`

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `user_id` | uuid (PK, FK→profiles) | 설정 소유자 |
| `loud_alarm` | boolean | 큰 소리 알람 |
| `voice_guide` | boolean | 음성 안내 |
| `location_sharing` | text | `always` / `emergency` / `off` |
| `push_notification` | boolean | 푸시 알림 |
| `sms_urgent` | boolean | SMS 긴급 알림 |

---

## 4. RLS (Row Level Security) 정책

| 테이블 | 정책 요약 |
|--------|-----------|
| `profiles` | 본인만 SELECT/UPDATE |
| `care_links` | elder 또는 caregiver 당사자만 접근 |
| `device_states` | elder 본인, 또는 연결된 caregiver |
| `user_statuses` | elder 본인, 또는 연결된 caregiver |
| `incidents` | elder 본인, 또는 연결된 caregiver |
| `app_settings` | 본인만 접근 |

---

## 5. DB 계층 함수 (`src/lib/supabase-data.ts`)

### `loadSupabaseBootstrap(auth)`

초기 로그인 후 전체 앱 상태를 한 번에 로드. 고령자 첫 로그인 시 기본 row를 자동 seed.

```typescript
const { appState, settings } = await loadSupabaseBootstrap(auth);
```

### `persistSettings(auth, settings)`

`app_settings` 테이블 upsert. 설정 Switch 토글 시 `updateSettings()` → 이 함수 호출.

### `persistIncidentPatch(incidentId, patch)`

`incidents` 테이블 부분 업데이트.

```typescript
// 읽음 처리
await persistIncidentPatch(id, { is_read: true });

// 상태 + 메모 변경
await persistIncidentPatch(id, {
  action_state: 'resolved',
  caregiver_memo: '직접 확인 완료',
});
```

### `persistUserStatus(auth, appState)`

`user_statuses` 테이블 upsert. 시나리오 전환 시 호출.

---

## 6. Auth 헬퍼 (`src/lib/supabase.ts`)

| 함수 | 설명 |
|------|------|
| `getInitialSupabaseAuthState()` | 앱 시작 시 세션 복원 |
| `subscribeToSupabaseAuthChanges(cb)` | 세션 변경 구독 (자동 로그아웃 감지 등) |
| `sessionToAuthState(session)` | Session → AuthState 변환 (profiles.role 조회 포함) |
| `signInWithSupabasePassword(email, pw)` | 이메일/비밀번호 로그인 |
| `signOutFromSupabase()` | 로그아웃 |

### 역할 판별 우선순위

```
1. user.user_metadata.role
2. user.user_metadata.app_role
3. user.app_metadata.role
4. user.app_metadata.app_role
5. profiles.role (DB 조회)
```

→ 모두 없으면 로그인 차단 (signOut 후 에러 throw).

---

## 7. 향후 API 계층 분리 시 경계 정의

커스텀 서버(Spring Boot / Node.js)로 이전할 경우의 API 목록:

| API | 메서드 | 역할 |
|-----|--------|------|
| `/auth/login` | POST | 로그인 |
| `/auth/logout` | POST | 로그아웃 |
| `/users/me` | GET | 프로필 조회 |
| `/devices` | GET | 기기 상태 조회 |
| `/devices/:id/ring` | POST | 가방 소리 울리기 |
| `/incidents` | GET | 사건 목록 |
| `/incidents/:id` | GET/PATCH | 사건 상세 조회/수정 |
| `/incidents/:id/read` | POST | 읽음 처리 |
| `/settings` | GET/PATCH | 알림/공유 설정 |

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('ELDER', 'CAREGIVER')),
  full_name text,
  phone text,
  birth_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.care_links (
  elder_id uuid not null references public.profiles(id) on delete cascade,
  caregiver_id uuid not null references public.profiles(id) on delete cascade,
  is_primary boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (elder_id, caregiver_id),
  constraint elder_caregiver_distinct check (elder_id <> caregiver_id)
);

create table if not exists public.device_states (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  connection_status text not null check (connection_status in ('bagConnected', 'connectionLost', 'locationUnavailable', 'learning')),
  battery_level integer not null default 0 check (battery_level between 0 and 100),
  last_sync_at timestamptz,
  location_permission boolean not null default true,
  notification_permission boolean not null default true,
  last_connected_address text,
  last_connected_at timestamptz,
  last_connected_lat double precision,
  last_connected_lng double precision,
  updated_at timestamptz not null default now()
);

create table if not exists public.user_statuses (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  status text not null check (status in ('NORMAL', 'NEEDS_RECHECK', 'MISSING_SUSPECTED', 'DEVICE_CHECK')),
  message_title text not null,
  message_desc text not null,
  missing_items jsonb not null default '[]'::jsonb,
  user_location_address text,
  user_location_at timestamptz,
  user_location_lat double precision,
  user_location_lng double precision,
  updated_at timestamptz not null default now()
);

create table if not exists public.incidents (
  id text primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('NORMAL', 'RECHECK', 'MISSING_SUSPECTED', 'CAREGIVER_NOTIFIED', 'RESOLVED', 'DISCONNECTED', 'LOCATION_SAVED')),
  title text not null,
  occurred_at timestamptz not null default now(),
  is_read boolean not null default false,
  action_state text check (action_state in ('open', 'userRechecking', 'caregiverAcknowledged', 'resolved')),
  caregiver_memo text,
  location_context jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_settings (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  loud_alarm boolean not null default true,
  voice_guide boolean not null default true,
  location_sharing text not null default 'emergency' check (location_sharing in ('always', 'emergency', 'off')),
  push_notification boolean not null default true,
  sms_urgent boolean not null default true,
  updated_at timestamptz not null default now()
);

create index if not exists idx_care_links_caregiver on public.care_links(caregiver_id);
create index if not exists idx_incidents_user_time on public.incidents(user_id, occurred_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

drop trigger if exists set_device_states_updated_at on public.device_states;
create trigger set_device_states_updated_at
before update on public.device_states
for each row execute procedure public.set_updated_at();

drop trigger if exists set_user_statuses_updated_at on public.user_statuses;
create trigger set_user_statuses_updated_at
before update on public.user_statuses
for each row execute procedure public.set_updated_at();

drop trigger if exists set_incidents_updated_at on public.incidents;
create trigger set_incidents_updated_at
before update on public.incidents
for each row execute procedure public.set_updated_at();

drop trigger if exists set_app_settings_updated_at on public.app_settings;
create trigger set_app_settings_updated_at
before update on public.app_settings
for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.care_links enable row level security;
alter table public.device_states enable row level security;
alter table public.user_statuses enable row level security;
alter table public.incidents enable row level security;
alter table public.app_settings enable row level security;

drop policy if exists "profiles_select_self_or_linked" on public.profiles;
create policy "profiles_select_self_or_linked"
on public.profiles
for select
to authenticated
using (
  auth.uid() = id
  or exists (
    select 1
    from public.care_links cl
    where (cl.elder_id = id and cl.caregiver_id = auth.uid())
       or (cl.caregiver_id = id and cl.elder_id = auth.uid())
  )
);

drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "care_links_select_participants" on public.care_links;
create policy "care_links_select_participants"
on public.care_links
for select
to authenticated
using (elder_id = auth.uid() or caregiver_id = auth.uid());

drop policy if exists "device_states_select_owner_or_caregiver" on public.device_states;
create policy "device_states_select_owner_or_caregiver"
on public.device_states
for select
to authenticated
using (
  user_id = auth.uid()
  or exists (
    select 1
    from public.care_links cl
    where cl.elder_id = device_states.user_id
      and cl.caregiver_id = auth.uid()
  )
);

drop policy if exists "device_states_write_owner" on public.device_states;
create policy "device_states_write_owner"
on public.device_states
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "user_statuses_select_owner_or_caregiver" on public.user_statuses;
create policy "user_statuses_select_owner_or_caregiver"
on public.user_statuses
for select
to authenticated
using (
  user_id = auth.uid()
  or exists (
    select 1
    from public.care_links cl
    where cl.elder_id = user_statuses.user_id
      and cl.caregiver_id = auth.uid()
  )
);

drop policy if exists "user_statuses_write_owner" on public.user_statuses;
create policy "user_statuses_write_owner"
on public.user_statuses
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "incidents_select_owner_or_caregiver" on public.incidents;
create policy "incidents_select_owner_or_caregiver"
on public.incidents
for select
to authenticated
using (
  user_id = auth.uid()
  or exists (
    select 1
    from public.care_links cl
    where cl.elder_id = incidents.user_id
      and cl.caregiver_id = auth.uid()
  )
);

drop policy if exists "incidents_insert_owner" on public.incidents;
create policy "incidents_insert_owner"
on public.incidents
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "incidents_update_owner_or_caregiver" on public.incidents;
create policy "incidents_update_owner_or_caregiver"
on public.incidents
for update
to authenticated
using (
  user_id = auth.uid()
  or exists (
    select 1
    from public.care_links cl
    where cl.elder_id = incidents.user_id
      and cl.caregiver_id = auth.uid()
  )
)
with check (
  user_id = auth.uid()
  or exists (
    select 1
    from public.care_links cl
    where cl.elder_id = incidents.user_id
      and cl.caregiver_id = auth.uid()
  )
);

drop policy if exists "app_settings_select_self" on public.app_settings;
create policy "app_settings_select_self"
on public.app_settings
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "app_settings_write_self" on public.app_settings;
create policy "app_settings_write_self"
on public.app_settings
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

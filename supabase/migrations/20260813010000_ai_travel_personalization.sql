create table public.trip_context_events (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  event_type text not null,
  occurred_at timestamptz not null default now(),
  region text,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb
);

create index trip_context_events_session_id_idx on public.trip_context_events(session_id);
create index trip_context_events_occurred_at_idx on public.trip_context_events(occurred_at desc);

create table public.merchant_recommendation_profiles (
  merchant_id text primary key references public.merchants(id) on delete cascade,
  summary text not null,
  tags text[] not null default '{}',
  signature_items text[] not null default '{}',
  recommendation_contexts text[] not null default '{}'
);

alter table public.trip_context_events enable row level security;
alter table public.merchant_recommendation_profiles enable row level security;

-- MVP is deliberately limited to the documented demo session. No write policy
-- is granted to browser roles; production session ownership belongs with Auth.
create policy "public can read demo trip context events"
  on public.trip_context_events for select
  using (session_id = 'demo-traveler-001');
create policy "public can read merchant recommendation profiles"
  on public.merchant_recommendation_profiles for select using (true);

grant select on public.trip_context_events to anon, authenticated;
grant select on public.merchant_recommendation_profiles to anon, authenticated;

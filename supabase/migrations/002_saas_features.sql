-- ============================================================
-- MIGRATION 002 — Fonctionnalités SaaS
-- Colle dans Supabase > SQL Editor > Run
-- ============================================================

-- ============================================================
-- TABLE : notifications (in-app)
-- ============================================================
create table if not exists notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  family_id uuid references families(id) on delete cascade,
  title text not null,
  message text not null,
  type text check (type in ('off_mode', 'routine', 'grocery', 'system', 'payment')) default 'system',
  is_read boolean default false,
  created_at timestamp with time zone default now()
);

alter table notifications enable row level security;
create policy "Users see own notifications" on notifications for select using (auth.uid() = user_id);
create policy "Users update own notifications" on notifications for update using (auth.uid() = user_id);
create policy "Users delete own notifications" on notifications for delete using (auth.uid() = user_id);
create policy "System can insert notifications" on notifications for insert with check (true);

-- ============================================================
-- TABLE : subscriptions (gestion Stripe)
-- ============================================================
create table if not exists subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade unique,
  stripe_subscription_id text unique,
  stripe_customer_id text,
  plan text check (plan in ('free', 'pro', 'family')) default 'free',
  status text check (status in ('active', 'canceled', 'past_due', 'trialing', 'incomplete')) default 'active',
  current_period_end timestamp with time zone,
  cancel_at_period_end boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table subscriptions enable row level security;
create policy "Users see own subscription" on subscriptions for select using (auth.uid() = user_id);

-- ============================================================
-- TABLE : file_uploads (upload sécurisé avec quota)
-- ============================================================
create table if not exists file_uploads (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid references families(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  name text not null,
  storage_path text not null,
  size_bytes integer not null,
  mime_type text,
  is_public boolean default false,
  created_at timestamp with time zone default now()
);

alter table file_uploads enable row level security;
create policy "Family members manage uploads" on file_uploads for all
  using (family_id in (select family_id from profiles where id = auth.uid()));

-- Vue pour vérifier le quota (max 50MB par famille)
create or replace view family_storage_usage as
  select
    family_id,
    count(*) as file_count,
    coalesce(sum(size_bytes), 0) as total_bytes,
    round(coalesce(sum(size_bytes), 0) / 1024.0 / 1024.0, 2) as total_mb,
    50 - round(coalesce(sum(size_bytes), 0) / 1024.0 / 1024.0, 2) as remaining_mb
  from file_uploads
  group by family_id;

-- ============================================================
-- TABLE : audit_logs (traçabilité)
-- ============================================================
create table if not exists audit_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete set null,
  family_id uuid references families(id) on delete set null,
  action text not null, -- 'login', 'off_mode_on', 'routine_created', etc.
  details jsonb default '{}',
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone default now()
);

alter table audit_logs enable row level security;
create policy "Users see own audit logs" on audit_logs for select using (auth.uid() = user_id);
create policy "System can insert audit logs" on audit_logs for insert with check (true);

-- ============================================================
-- TABLE : user_settings (préférences utilisateur)
-- ============================================================
create table if not exists user_settings (
  user_id uuid primary key references profiles(id) on delete cascade,
  email_notifications boolean default true,
  off_mode_notifications boolean default true,
  routine_reminders boolean default true,
  language text default 'fr',
  timezone text default 'Europe/Paris',
  updated_at timestamp with time zone default now()
);

alter table user_settings enable row level security;
create policy "Users manage own settings" on user_settings for all using (auth.uid() = user_id);

-- Créer les settings par défaut à l'inscription
create or replace function handle_new_user_settings()
returns trigger as $$
begin
  insert into user_settings (user_id) values (new.id) on conflict do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_profile_created
  after insert on profiles
  for each row execute procedure handle_new_user_settings();

-- ============================================================
-- TABLE : partner_invites (invitations sécurisées)
-- ============================================================
create table if not exists partner_invites (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid references families(id) on delete cascade,
  invited_by uuid references profiles(id),
  token text unique default encode(gen_random_bytes(32), 'hex'),
  email text,
  expires_at timestamp with time zone default now() + interval '7 days',
  used_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

alter table partner_invites enable row level security;
create policy "Family members see invites" on partner_invites for select
  using (family_id in (select family_id from profiles where id = auth.uid()));
create policy "Family members create invites" on partner_invites for insert
  with check (family_id in (select family_id from profiles where id = auth.uid()));

-- ============================================================
-- INDEX pour performance
-- ============================================================
create index if not exists idx_notifications_user_id on notifications(user_id, is_read, created_at desc);
create index if not exists idx_audit_logs_user_id on audit_logs(user_id, created_at desc);
create index if not exists idx_memories_family_id on memories(family_id);
create index if not exists idx_routines_family_id on routines(family_id, is_active);
create index if not exists idx_profiles_family_id on profiles(family_id);

-- ============================================================
-- REALTIME — activer pour les notifications live
-- ============================================================
alter publication supabase_realtime add table notifications;
alter publication supabase_realtime add table profiles;

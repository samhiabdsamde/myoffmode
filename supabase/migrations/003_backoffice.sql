-- ============================================================
-- MIGRATION 003 — Backoffice & Support
-- ============================================================

-- Ajouter le rôle admin aux profils
alter table profiles add column if not exists admin_role text
  check (admin_role in ('super_admin', 'admin', 'support')) default null;

alter table profiles add column if not exists is_blocked boolean default false;
alter table profiles add column if not exists blocked_reason text;
alter table profiles add column if not exists blocked_at timestamp with time zone;

-- TABLE : support_tickets
create table if not exists support_tickets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete set null,
  email text not null,
  subject text not null,
  message text not null,
  status text check (status in ('open', 'in_progress', 'resolved', 'closed')) default 'open',
  priority text check (priority in ('low', 'medium', 'high', 'urgent')) default 'medium',
  assigned_to uuid references profiles(id) on delete set null,
  admin_notes text,
  resolved_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table support_tickets enable row level security;
-- Users voient leurs propres tickets
create policy "Users see own tickets" on support_tickets for select using (auth.uid() = user_id);
create policy "Users create tickets" on support_tickets for insert with check (auth.uid() = user_id or user_id is null);
-- Admins voient tout
create policy "Admins manage tickets" on support_tickets for all using (
  exists (select 1 from profiles where id = auth.uid() and admin_role is not null)
);

-- TABLE : support_replies
create table if not exists support_replies (
  id uuid primary key default uuid_generate_v4(),
  ticket_id uuid references support_tickets(id) on delete cascade,
  user_id uuid references profiles(id) on delete set null,
  message text not null,
  is_admin_reply boolean default false,
  created_at timestamp with time zone default now()
);

alter table support_replies enable row level security;
create policy "Ticket participants see replies" on support_replies for select using (
  ticket_id in (
    select id from support_tickets where user_id = auth.uid()
  ) or exists (select 1 from profiles where id = auth.uid() and admin_role is not null)
);
create policy "Users and admins insert replies" on support_replies for insert with check (auth.uid() = user_id);

-- TABLE : admin_actions (audit complet des actions admin)
create table if not exists admin_actions (
  id uuid primary key default uuid_generate_v4(),
  admin_id uuid references profiles(id),
  target_user_id uuid references profiles(id),
  action text not null,
  details jsonb default '{}',
  ip_address inet,
  created_at timestamp with time zone default now()
);

alter table admin_actions enable row level security;
create policy "Admins see all actions" on admin_actions for select using (
  exists (select 1 from profiles where id = auth.uid() and admin_role in ('super_admin', 'admin'))
);
create policy "System inserts actions" on admin_actions for insert with check (true);

-- TABLE : email_logs (traçabilité emails envoyés)
create table if not exists email_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete set null,
  to_email text not null,
  subject text not null,
  type text not null,
  status text check (status in ('sent', 'failed', 'bounced')) default 'sent',
  resend_id text,
  created_at timestamp with time zone default now()
);

alter table email_logs enable row level security;
create policy "Admins see email logs" on email_logs for select using (
  exists (select 1 from profiles where id = auth.uid() and admin_role is not null)
);
create policy "System inserts email logs" on email_logs for insert with check (true);

-- Push subscriptions table
create table if not exists push_subscriptions (
  user_id uuid primary key references profiles(id) on delete cascade,
  endpoint text not null,
  subscription jsonb not null,
  updated_at timestamp with time zone default now()
);

alter table push_subscriptions enable row level security;
create policy "Users manage own push sub" on push_subscriptions for all using (auth.uid() = user_id);

-- Index performance
create index if not exists idx_support_tickets_status on support_tickets(status, created_at desc);
create index if not exists idx_support_tickets_user on support_tickets(user_id);
create index if not exists idx_admin_actions_admin on admin_actions(admin_id, created_at desc);
create index if not exists idx_email_logs_user on email_logs(user_id, created_at desc);
create index if not exists idx_profiles_admin_role on profiles(admin_role) where admin_role is not null;
create index if not exists idx_profiles_blocked on profiles(is_blocked) where is_blocked = true;

-- Realtime pour support
alter publication supabase_realtime add table support_tickets;
alter publication supabase_realtime add table support_replies;

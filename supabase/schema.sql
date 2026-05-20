-- ============================================
-- NESTI — Schéma Supabase complet
-- Colle ce SQL dans Supabase > SQL Editor > Run
-- ============================================

-- Active les extensions nécessaires
create extension if not exists "uuid-ossp";

-- ============================================
-- TABLE : families (un foyer = une famille)
-- ============================================
create table families (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  invite_code text unique default substr(md5(random()::text), 1, 8),
  created_at timestamp with time zone default now()
);

-- ============================================
-- TABLE : profiles (étend auth.users de Supabase)
-- ============================================
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  family_id uuid references families(id),
  full_name text,
  role text check (role in ('mom', 'partner')) default 'mom',
  is_premium boolean default false,
  stripe_customer_id text,
  stripe_subscription_id text,
  off_mode boolean default false,
  created_at timestamp with time zone default now()
);

-- ============================================
-- TABLE : routines (les routines de maman)
-- ============================================
create table routines (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid references families(id) on delete cascade,
  title text not null,
  description text,
  time_of_day text check (time_of_day in ('morning', 'afternoon', 'evening', 'anytime')),
  day_type text check (day_type in ('weekday', 'weekend', 'everyday')) default 'everyday',
  order_index integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- ============================================
-- TABLE : grocery_items (liste de courses)
-- ============================================
create table grocery_items (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid references families(id) on delete cascade,
  name text not null,
  quantity text,
  brand text,
  category text default 'other',
  is_checked boolean default false,
  is_recurring boolean default true,
  created_at timestamp with time zone default now()
);

-- ============================================
-- TABLE : memories (le cerveau IA de la famille)
-- ============================================
create table memories (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid references families(id) on delete cascade,
  category text check (category in ('child', 'food', 'routine', 'preference', 'emergency', 'other')) default 'other',
  content text not null,
  child_name text,
  created_at timestamp with time zone default now()
);

-- ============================================
-- TABLE : children (profils enfants)
-- ============================================
create table children (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid references families(id) on delete cascade,
  name text not null,
  age integer,
  school_name text,
  school_pickup_time text,
  allergies text,
  notes text,
  created_at timestamp with time zone default now()
);

-- ============================================
-- TABLE : daily_logs (ce que le partenaire a fait)
-- ============================================
create table daily_logs (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid references families(id) on delete cascade,
  user_id uuid references profiles(id),
  routine_id uuid references routines(id),
  completed_at timestamp with time zone default now(),
  date date default current_date
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) — sécurité des données
-- ============================================
alter table families enable row level security;
alter table profiles enable row level security;
alter table routines enable row level security;
alter table grocery_items enable row level security;
alter table memories enable row level security;
alter table children enable row level security;
alter table daily_logs enable row level security;

-- Profiles : chaque user voit son propre profil
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

-- Familles : membres de la même famille
create policy "Family members can view family"
  on families for select using (
    id in (select family_id from profiles where id = auth.uid())
  );

-- Routines : membres de la même famille
create policy "Family members can manage routines"
  on routines for all using (
    family_id in (select family_id from profiles where id = auth.uid())
  );

-- Courses : membres de la même famille
create policy "Family members can manage grocery"
  on grocery_items for all using (
    family_id in (select family_id from profiles where id = auth.uid())
  );

-- Memories : membres de la même famille
create policy "Family members can manage memories"
  on memories for all using (
    family_id in (select family_id from profiles where id = auth.uid())
  );

-- Enfants : membres de la même famille
create policy "Family members can manage children"
  on children for all using (
    family_id in (select family_id from profiles where id = auth.uid())
  );

-- Logs : membres de la même famille
create policy "Family members can manage logs"
  on daily_logs for all using (
    family_id in (select family_id from profiles where id = auth.uid())
  );

-- ============================================
-- FONCTION : crée le profil automatiquement après signup
-- ============================================
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

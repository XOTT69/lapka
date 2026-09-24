-- LAPKA customer data schema. Apply to a Supabase project after it is created.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null check (type in ('Собака','Кіт')),
  age text,
  birth_date date,
  weight text,
  breed text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customer_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  external_order_id text not null unique,
  total numeric(12,2) not null default 0,
  status text not null default 'new',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.pets enable row level security;
alter table public.customer_orders enable row level security;

create policy "profiles_select_own" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "pets_select_own" on public.pets for select to authenticated using ((select auth.uid()) = user_id);
create policy "pets_insert_own" on public.pets for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "pets_update_own" on public.pets for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "pets_delete_own" on public.pets for delete to authenticated using ((select auth.uid()) = user_id);

create policy "orders_select_own" on public.customer_orders for select to authenticated using ((select auth.uid()) = user_id);
create policy "orders_insert_own" on public.customer_orders for insert to authenticated with check ((select auth.uid()) = user_id);

grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.pets to authenticated;
grant select, insert on public.customer_orders to authenticated;

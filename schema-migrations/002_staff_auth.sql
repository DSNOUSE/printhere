-- Staff auth: profiles linked to Supabase Auth users
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'staff'
    check (role in ('admin', 'staff')),
  active boolean default true,
  created_at timestamptz default now()
);

-- Internal notes for staff (not shown to customers)
alter table orders add column if not exists internal_notes text;

-- Audit trail for order status changes
create table if not exists order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  from_status text,
  to_status text not null,
  changed_by uuid references profiles(id),
  note text,
  created_at timestamptz default now()
);

create index if not exists order_status_history_order_id_idx on order_status_history(order_id);

-- Auto-create profile row when a staff user is created in Supabase Auth
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email)
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- RLS: profiles readable by own user; orders not exposed to anon
alter table profiles enable row level security;
alter table order_status_history enable row level security;

create policy "Users can read own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Staff can read status history"
  on order_status_history for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.active = true
        and profiles.role in ('admin', 'staff')
    )
  );

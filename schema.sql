-- Products table
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  base_price numeric(10,2) not null,
  turnaround_days int default 5,
  accepted_formats text[] default array['pdf','ai','psd','png','jpg','tiff'],
  active boolean default true,
  created_at timestamptz default now()
);

-- Orders table
create table orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  product_id uuid references products(id),
  product_name text not null,
  quantity int not null default 1,
  unit_price numeric(10,2) not null,
  total_price numeric(10,2) not null,
  notes text,
  file_url text not null,
  file_name text not null,
  file_size int,
  status text not null default 'pending_payment',
  stripe_session_id text,
  stripe_payment_intent text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Status options: pending_payment | paid | in_production | shipped | completed | cancelled

-- Index for looking up by stripe session
create index orders_stripe_session_id_idx on orders(stripe_session_id);
create index orders_email_idx on orders(customer_email);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger orders_updated_at
  before update on orders
  for each row execute function update_updated_at();

-- Seed some products
insert into products (name, description, base_price, turnaround_days) values
  ('Business Cards', '400gsm silk laminated, full colour both sides', 15000.00, 3),
  ('Flyers A5', '130gsm gloss, full colour single sided', 20000.00, 4),
  ('Roller Banner', '850 x 2000mm with aluminium stand', 45000.00, 5),
  ('Poster A1', '170gsm silk, full colour', 12000.00, 3),
  ('Booklets A4', 'Saddle stitched, full colour throughout', 35000.00, 7),
  ('Canvas Print', 'Gallery wrapped, ready to hang', 27000.00, 6);

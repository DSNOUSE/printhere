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
  paystack_reference text unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Status options: pending_payment | paid | in_production | shipped | completed | cancelled

-- Enable Row Level Security
alter table products enable row level security;
alter table categories enable row level security;
alter table orders enable row level security;

-- RLS Policies for products (public read, admin write)
create policy "Public can view products" on products for select using (active = true);
create policy "Admins can manage products" on products for all using (auth.role() = 'authenticated');

-- RLS Policies for categories (public read, admin write)
create policy "Public can view categories" on categories for select using (active = true);
create policy "Admins can manage categories" on categories for all using (auth.role() = 'authenticated');

-- RLS Policies for orders (insert for customers, all for authenticated)
create policy "Anyone can create orders" on orders for insert with check (true);
create policy "Customers can view own orders" on orders for select using (customer_email = auth.jwt() ->> 'email');
create policy "Admins can manage all orders" on orders for all using (auth.role() = 'authenticated');

-- Index for looking up by paystack reference
create index orders_paystack_reference_idx on orders(paystack_reference);
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
insert into products (name, description, base_price, turnaround_days, slug) values
  ('Business Cards', '400gsm silk laminated, full colour both sides', 15000.00, 3, 'business-cards-standard'),
  ('Flyers A5', '130gsm gloss, full colour single sided', 20000.00, 4, 'flyers-a5'),
  ('Roller Banner', '850 x 2000mm with aluminium stand', 45000.00, 5, 'roller-banner'),
  ('Poster A1', '170gsm silk, full colour', 12000.00, 3, 'poster-a1'),
  ('Booklets A4', 'Saddle stitched, full colour throughout', 35000.00, 7, 'booklets-a4'),
  ('Canvas Print', 'Gallery wrapped, ready to hang', 27000.00, 6, 'canvas-print');

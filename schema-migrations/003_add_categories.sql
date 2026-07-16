-- Create categories table
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  image_url text,
  display_order int default 0,
  active boolean default true,
  created_at timestamptz default now()
);

-- Add category_id and slug to products
alter table products add column category_id uuid references categories(id);
alter table products add column slug text unique;
alter table products add column image_url text;

-- Seed categories
insert into categories (name, slug, description, display_order) values
  ('Business Cards', 'business-cards', 'Professional business cards for your brand', 1),
  ('Flyers & Leaflets', 'flyers-leaflets', 'Eye-catching flyers to promote your business', 2),
  ('Posters & Banners', 'posters-banners', 'Large format prints for maximum impact', 3),
  ('Booklets & Brochures', 'booklets-brochures', 'Multi-page booklets and brochures', 4),
  ('Large Format', 'large-format', 'Canvas prints, foamex boards, and more', 5),
  ('Stationery', 'stationery', 'Notepads, letterheads, and envelopes', 6);

-- Update existing products with slugs and categories
update products set 
  slug = 'business-cards-standard',
  category_id = (select id from categories where slug = 'business-cards')
where name = 'Business Cards';

update products set 
  slug = 'flyers-a5',
  category_id = (select id from categories where slug = 'flyers-leaflets')
where name = 'Flyers A5';

update products set 
  slug = 'roller-banner',
  category_id = (select id from categories where slug = 'posters-banners')
where name = 'Roller Banner';

update products set 
  slug = 'poster-a1',
  category_id = (select id from categories where slug = 'posters-banners')
where name = 'Poster A1';

update products set 
  slug = 'booklets-a4',
  category_id = (select id from categories where slug = 'booklets-brochures')
where name = 'Booklets A4';

update products set 
  slug = 'canvas-print',
  category_id = (select id from categories where slug = 'large-format')
where name = 'Canvas Print';

-- Create indexes
create index products_category_id_idx on products(category_id);
create index products_slug_idx on products(slug);
create index categories_slug_idx on categories(slug);
create extension if not exists pgcrypto;

create table public.merchants (
  id text primary key,
  name text not null,
  region text not null,
  station_id text,
  category text not null,
  latitude double precision,
  longitude double precision,
  opening_time time,
  closing_time time,
  is_partner boolean not null default false,
  rail_shipping_enabled boolean not null default false,
  packaging_available boolean not null default false,
  app_order_available boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.merchant_package_types (
  id text primary key,
  merchant_id text not null references public.merchants(id) on delete cascade,
  name text not null,
  length_cm numeric(8,2) not null check (length_cm > 0),
  width_cm numeric(8,2) not null check (width_cm > 0),
  height_cm numeric(8,2) not null check (height_cm > 0),
  max_weight_kg numeric(8,2) not null check (max_weight_kg > 0)
);

create table public.products (
  id text primary key,
  merchant_id text not null references public.merchants(id) on delete restrict,
  name text not null,
  category text not null,
  base_price numeric(12,2) not null check (base_price >= 0),
  rail_shipping_enabled boolean not null default false,
  station_pickup_available boolean not null default false,
  quick_delivery_available boolean not null default false,
  shipping_cutoff_at timestamptz
);

create table public.railway_package_types (
  id text primary key,
  name text not null,
  length_cm numeric(8,2) not null check (length_cm > 0),
  width_cm numeric(8,2) not null check (width_cm > 0),
  height_cm numeric(8,2) not null check (height_cm > 0),
  max_weight_kg numeric(8,2) not null check (max_weight_kg > 0)
);

create table public.orders (
  id text primary key default gen_random_uuid()::text,
  source text not null,
  merchant_id text not null references public.merchants(id) on delete restrict,
  status text not null,
  created_at timestamptz not null default now()
);

create table public.order_items (
  id text primary key default gen_random_uuid()::text,
  order_id text not null references public.orders(id) on delete cascade,
  product_id text references public.products(id) on delete set null,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null check (unit_price >= 0)
);

create table public.shipping_orders (
  id text primary key default gen_random_uuid()::text,
  order_id text not null unique references public.orders(id) on delete cascade,
  recipient_name text not null,
  recipient_phone text not null,
  delivery_mode text not null,
  destination_station text,
  destination_address text,
  selected_service text,
  shipping_fee numeric(12,2) not null default 0 check (shipping_fee >= 0),
  status text not null,
  created_at timestamptz not null default now()
);

create table public.shipments (
  id text primary key default gen_random_uuid()::text,
  shipping_order_id text not null unique references public.shipping_orders(id) on delete cascade,
  receipt_number text not null unique,
  train_no text,
  origin_station text not null,
  destination_station text not null,
  departure_at timestamptz,
  arrival_at timestamptz,
  tracking_status text not null,
  current_station text,
  created_at timestamptz not null default now()
);

create index merchant_package_types_merchant_id_idx on public.merchant_package_types(merchant_id);
create index products_merchant_id_idx on public.products(merchant_id);
create index orders_merchant_id_idx on public.orders(merchant_id);
create index order_items_order_id_idx on public.order_items(order_id);
create index shipping_orders_order_id_idx on public.shipping_orders(order_id);
create index shipments_shipping_order_id_idx on public.shipments(shipping_order_id);

alter table public.merchants enable row level security;
alter table public.merchant_package_types enable row level security;
alter table public.products enable row level security;
alter table public.railway_package_types enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.shipping_orders enable row level security;
alter table public.shipments enable row level security;

create policy "public can read merchants" on public.merchants for select using (true);
create policy "public can read merchant package types" on public.merchant_package_types for select using (true);
create policy "public can read products" on public.products for select using (true);
create policy "public can read railway package types" on public.railway_package_types for select using (true);

-- Orders and shipping tables intentionally have no anonymous policies. Writes
-- must be performed by an authenticated server-side workflow added at integration.

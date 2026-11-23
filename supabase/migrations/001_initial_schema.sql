create extension if not exists "pgcrypto";

create type user_role as enum (
  'admin',
  'staff'
);

create type order_status as enum (
  'new',
  'picking',
  'packed',
  'dispatched',
  'exception'
);

create type return_status as enum (
  'registered',
  'inspecting',
  'approved',
  'rejected',
  'restocked'
);

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role user_role not null default 'staff',
  created_at timestamptz not null default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  customer_email text,
  status order_status not null default 'new',
  created_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  sku text not null,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  picked boolean not null default false
);

create table inventory (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  product_name text not null,
  stock_available integer not null default 0 check (stock_available >= 0),
  stock_allocated integer not null default 0 check (stock_allocated >= 0),
  reorder_threshold integer not null default 0 check (reorder_threshold >= 0),
  updated_at timestamptz not null default now()
);

create table dispatches (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references orders(id) on delete cascade,
  carrier text not null,
  carrier_reference text,
  destination text not null,
  pickup_window text,
  dispatch_date timestamptz,
  created_at timestamptz not null default now()
);

create table returns (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  customer_name text not null,
  reason text not null,
  condition text,
  status return_status not null default 'registered',
  created_at timestamptz not null default now()
);

create index orders_status_idx on orders(status);
create index order_items_order_id_idx on order_items(order_id);
create index dispatches_order_id_idx on dispatches(order_id);
create index returns_order_id_idx on returns(order_id);
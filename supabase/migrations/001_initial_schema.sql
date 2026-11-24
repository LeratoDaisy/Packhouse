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

-- Row Level Security
-- Packhouse MVP users are authenticated operators. Operational data is
-- restricted to authenticated users; profiles are limited to the signed-in
-- user's own profile.

alter table profiles enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table inventory enable row level security;
alter table dispatches enable row level security;
alter table returns enable row level security;

drop policy if exists "Authenticated users can read own profile" on profiles;
create policy "Authenticated users can read own profile"
on profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "Authenticated users can read orders" on orders;
create policy "Authenticated users can read orders"
on orders
for select
to authenticated
using (true);

drop policy if exists "Authenticated users can insert orders" on orders;
create policy "Authenticated users can insert orders"
on orders
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated users can update orders" on orders;
create policy "Authenticated users can update orders"
on orders
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can read order items" on order_items;
create policy "Authenticated users can read order items"
on order_items
for select
to authenticated
using (true);

drop policy if exists "Authenticated users can insert order items" on order_items;
create policy "Authenticated users can insert order items"
on order_items
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated users can update order items" on order_items;
create policy "Authenticated users can update order items"
on order_items
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can read inventory" on inventory;
create policy "Authenticated users can read inventory"
on inventory
for select
to authenticated
using (true);

drop policy if exists "Authenticated users can insert inventory" on inventory;
create policy "Authenticated users can insert inventory"
on inventory
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated users can update inventory" on inventory;
create policy "Authenticated users can update inventory"
on inventory
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can read dispatches" on dispatches;
create policy "Authenticated users can read dispatches"
on dispatches
for select
to authenticated
using (true);

drop policy if exists "Authenticated users can insert dispatches" on dispatches;
create policy "Authenticated users can insert dispatches"
on dispatches
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated users can update dispatches" on dispatches;
create policy "Authenticated users can update dispatches"
on dispatches
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can read returns" on returns;
create policy "Authenticated users can read returns"
on returns
for select
to authenticated
using (true);

drop policy if exists "Authenticated users can insert returns" on returns;
create policy "Authenticated users can insert returns"
on returns
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated users can update returns" on returns;
create policy "Authenticated users can update returns"
on returns
for update
to authenticated
using (true)
with check (true);

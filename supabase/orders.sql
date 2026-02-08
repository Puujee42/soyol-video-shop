-- Supabase SQL Editor дээр ажиллуулна.
-- Захиалга болон захиалгын дэлгэрэнгүй (order_items).

-- Захиалга
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'paid', 'cancelled')),
  total numeric not null default 0,
  created_at timestamptz default timezone('utc'::text, now())
);

create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created_at on public.orders(created_at desc);

-- Захиалгын дэлгэрэнгүй (бараа бүр)
create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null,
  product_name text not null,
  product_image text,
  quantity int not null default 1,
  price numeric not null
);

create index if not exists idx_order_items_order_id on public.order_items(order_id);

-- RLS
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "Users can read own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Users can insert own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "Users can read order_items of own orders"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );

create policy "Users can insert order_items for own orders"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );

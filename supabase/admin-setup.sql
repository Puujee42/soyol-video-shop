-- Supabase Dashboard → SQL Editor. Админ панел болон products хүснэгтийн тохиргоо.

-- 1) profiles: эрх (role) нэмэх
alter table public.profiles
  add column if not exists role text not null default 'user' check (role in ('user', 'admin'));

-- 2) orders: төлбөрийн арга, баталгаажсан огноо
alter table public.orders
  add column if not exists payment_method text default 'cash' check (payment_method in ('cash', 'qpay', 'card'));
alter table public.orders
  add column if not exists payment_confirmed_at timestamptz;

-- 3) products хүснэгт (Supabase дээр)
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric not null default 0,
  image text,
  category text not null default 'tech',
  stock_status text not null default 'in-stock' check (stock_status in ('in-stock', 'pre-order')),
  stock_count int not null default 0,
  created_at timestamptz default timezone('utc'::text, now()),
  updated_at timestamptz default timezone('utc'::text, now())
);

create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_stock_status on public.products(stock_status);
create index if not exists idx_products_created_at on public.products(created_at desc);

-- RLS products
alter table public.products enable row level security;

-- Бүх хэрэглэгч унших (дэлгүүр)
create policy "Anyone can read products"
  on public.products for select
  using (true);

-- Зөвхөн админ нэмэх/засах/устгах
create policy "Admin can insert products"
  on public.products for insert
  with check (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

create policy "Admin can update products"
  on public.products for update
  using ((select role from public.profiles where id = auth.uid()) = 'admin');

create policy "Admin can delete products"
  on public.products for delete
  using ((select role from public.profiles where id = auth.uid()) = 'admin');

-- Админ бүх захиалгыг унших, төлбөр баталгаажуулах (update)
create policy "Admin can read all orders"
  on public.orders for select
  using ((select role from public.profiles where id = auth.uid()) = 'admin');

create policy "Admin can update orders"
  on public.orders for update
  using ((select role from public.profiles where id = auth.uid()) = 'admin');

-- Эхний админ тохируулах: Supabase Dashboard → Table Editor → profiles → тухайн хэрэглэгчийн мөрөнд role = 'admin' гэж тохируулна.
-- Эсвэл SQL: update public.profiles set role = 'admin' where id = 'auth-users-таны-uuid';
comment on column public.profiles.role is 'user | admin';

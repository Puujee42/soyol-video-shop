-- Мэдэгдлийн хүснэгт (Supabase SQL Editor эсвэл Terminal-аас ажиллуулна)
create table public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  message text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Real-time идэвхжүүлэх (хэрэв "already in publication" гарвал Dashboard → Database → Replication дээр notifications нэмнэ)
alter publication supabase_realtime add table public.notifications;

-- Индекс (уншихад хурдан)
create index if not exists idx_notifications_user_id on public.notifications(user_id);
create index if not exists idx_notifications_created_at on public.notifications(created_at desc);

-- RLS
alter table public.notifications enable row level security;

create policy "Users can read own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can update own notifications (is_read)"
  on public.notifications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Төлбөр/захиалга амжилттай болоход мэдэгдэл үүсгэхэд хэрэглэгч өөртөө insert хийх
create policy "Users can insert own notifications"
  on public.notifications for insert
  with check (auth.uid() = user_id);

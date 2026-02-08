-- d.monkh2007@gmail.com-ийг админ болгох.
-- Supabase Dashboard → SQL Editor дээр ажиллуулна.
-- Анхаар: Эхлээд admin-setup.sql ажиллуулсан байна (profiles.role бага орсон байх).
-- Хэрэв профил байхгүй бол үүсгэж, role = 'admin' тохируулна
insert into public.profiles (id, role)
select id, 'admin'
from auth.users
where email = 'd.monkh2007@gmail.com'
on conflict (id) do update set role = 'admin';

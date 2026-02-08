-- Supabase Dashboard → SQL Editor дээр ажиллуулна.
-- Smart Phone Auth: шинэ хэрэглэгчийг public.profiles хүснэгтэд автоматаар бүртгэнэ.

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  phone TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS идэвхжүүлэх
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Хэрэглэгч өөрийн профиль унших/засах боломжтой
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Шинэ хэрэглэгч бүртгэгдэхэд профил үүсгэх (optional trigger)
-- CREATE OR REPLACE FUNCTION public.handle_new_user()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   INSERT INTO public.profiles (id, phone)
--   VALUES (NEW.id, NEW.phone);
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- v13 migration: Auth, profiles, session_answers, question_flags, RLS
-- Run in Supabase SQL editor after enabling Email OTP + Google OAuth in the dashboard

-- ─── New tables ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS profiles (
  id                       uuid primary key references auth.users(id) on delete cascade,
  full_name                text,
  email                    text,
  subscription_tier        text default 'free' check (subscription_tier in ('free','pro')),
  subscription_expires_at  timestamptz,
  exam_preference          text default 'CPL' check (exam_preference in ('CPL','ATPL')),
  created_at               timestamptz default now(),
  updated_at               timestamptz default now()
);

CREATE TABLE IF NOT EXISTS session_answers (
  id                  uuid primary key default gen_random_uuid(),
  session_id          uuid references sessions(id) on delete cascade,
  question_id         uuid references questions(id) on delete cascade,
  selected_option_id  uuid references question_options(id) on delete set null,
  is_correct          boolean,
  answered_at         timestamptz default now()
);

CREATE INDEX IF NOT EXISTS session_answers_session_id_idx ON session_answers(session_id);

CREATE TABLE IF NOT EXISTS question_flags (
  id          uuid primary key default gen_random_uuid(),
  question_id uuid references questions(id) on delete cascade,
  user_id     uuid references auth.users(id) on delete cascade,
  reason      text,
  resolved    boolean default false,
  created_at  timestamptz default now()
);

-- ─── Alter sessions ───────────────────────────────────────────────────────────

ALTER TABLE sessions
  ADD COLUMN IF NOT EXISTS user_id uuid references auth.users(id) on delete cascade;

CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);

-- ─── Auto-create profile on signup ────────────────────────────────────────────

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── Enable RLS ───────────────────────────────────────────────────────────────

ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_answers   ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_flags    ENABLE ROW LEVEL SECURITY;

ALTER TABLE subjects          ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics            ENABLE ROW LEVEL SECURITY;
ALTER TABLE source_books      ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters          ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_options  ENABLE ROW LEVEL SECURITY;

-- ─── Profiles policies ────────────────────────────────────────────────────────

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- ─── Sessions policies ────────────────────────────────────────────────────────

CREATE POLICY "Users can view own sessions"
  ON sessions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create sessions"
  ON sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ─── Session answers policies ─────────────────────────────────────────────────

CREATE POLICY "Users can view own answers"
  ON session_answers FOR SELECT
  USING (session_id IN (SELECT id FROM sessions WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own answers"
  ON session_answers FOR INSERT
  WITH CHECK (session_id IN (SELECT id FROM sessions WHERE user_id = auth.uid()));

-- ─── Question flags policies ──────────────────────────────────────────────────

CREATE POLICY "Users can flag questions"
  ON question_flags FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own flags"
  ON question_flags FOR SELECT USING (auth.uid() = user_id);

-- ─── Content table policies (authenticated read) ──────────────────────────────

CREATE POLICY "Authenticated users can read subjects"
  ON subjects FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read topics"
  ON topics FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read books"
  ON source_books FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read chapters"
  ON chapters FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read active questions"
  ON questions FOR SELECT USING (auth.role() = 'authenticated' AND active = true);

CREATE POLICY "Authenticated users can read question options"
  ON question_options FOR SELECT USING (auth.role() = 'authenticated');

-- ─── Admin full-access policies ───────────────────────────────────────────────
-- Checks is_admin in user_metadata (set via SQL on auth.users.raw_user_meta_data)

CREATE POLICY "Admins have full access to questions"
  ON questions FOR ALL
  USING ((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true);

CREATE POLICY "Admins have full access to subjects"
  ON subjects FOR ALL
  USING ((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true);

CREATE POLICY "Admins have full access to topics"
  ON topics FOR ALL
  USING ((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true);

CREATE POLICY "Admins have full access to source_books"
  ON source_books FOR ALL
  USING ((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true);

CREATE POLICY "Admins have full access to chapters"
  ON chapters FOR ALL
  USING ((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true);

CREATE POLICY "Admins have full access to question_options"
  ON question_options FOR ALL
  USING ((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true);

CREATE POLICY "Admins have full access to question_flags"
  ON question_flags FOR ALL
  USING ((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true);

CREATE POLICY "Admins have full access to sessions"
  ON sessions FOR ALL
  USING ((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true);

CREATE POLICY "Admins have full access to session_answers"
  ON session_answers FOR ALL
  USING ((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true);

-- ─── Grant admin claim ────────────────────────────────────────────────────────
-- Run separately after the admin user signs in for the first time:
--
-- UPDATE auth.users
-- SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'::jsonb
-- WHERE email = 'vineet@example.com';  -- replace with actual email

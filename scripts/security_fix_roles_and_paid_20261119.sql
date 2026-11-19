-- Closes two holes found on 2026-11-19 (run by hand in the Supabase SQL editor, once the code
-- that reads app_metadata is deployed):
--
-- 1. Self-made admins. Every admin policy read is_admin from the JWT's user_metadata, which any
--    user can change from the browser (supabase.auth.updateUser). The flag moves to
--    app_metadata, which only the service key can set, and every policy that read it from
--    user_metadata is rewritten to read app_metadata.
-- 2. Self-made paid access. "Users can update own profile" let a student change any column of
--    their own profile, subscription columns included. Students keep UPDATE on the columns the
--    app's profile setup writes; everything else (subscription_*) is the server's alone.
--
-- Also creates subscription_grants, where the server records each grant of paid access (a
-- Razorpay payment, or an admin) from now on.
--
-- Check first: security_check_roles_and_paid.sql, before and after.
BEGIN;

-- ── 1. Admins ────────────────────────────────────────────────────────────────────────────
-- The accounts that are admins. Remove any line you don't recognise BEFORE running.
UPDATE auth.users
   SET raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"is_admin": true}'::jsonb
 WHERE email IN (
   'vikram@craftbits.com',
   'vingoyal@gmail.com',
   'shashgoyal28@gmail.com',
   'chahat777sharma@gmail.com'
 );

-- Nobody's user_metadata flag means anything any more: remove it everywhere.
UPDATE auth.users SET raw_user_meta_data = raw_user_meta_data - 'is_admin'
 WHERE raw_user_meta_data ? 'is_admin';

-- Rewrite every public policy that reads user_metadata (admin full-access policies on
-- questions, sessions, session_answers, subjects, topics, source_books, chapters, countries,
-- and any others) to read app_metadata instead, keeping its command, roles and type.
DO $$
DECLARE
  p record;
  stmt text;
BEGIN
  FOR p IN
    SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
      FROM pg_policies
     WHERE schemaname = 'public'
       AND (coalesce(qual, '') || coalesce(with_check, '')) ILIKE '%user_metadata%'
  LOOP
    EXECUTE format('DROP POLICY %I ON %I.%I', p.policyname, p.schemaname, p.tablename);
    stmt := format('CREATE POLICY %I ON %I.%I AS %s FOR %s TO %s',
      p.policyname, p.schemaname, p.tablename, p.permissive, p.cmd,
      (SELECT string_agg(CASE WHEN r = 'public' THEN 'public' ELSE quote_ident(r) END, ', ') FROM unnest(p.roles) r));
    IF p.qual IS NOT NULL THEN
      stmt := stmt || format(' USING (%s)', replace(p.qual, 'user_metadata', 'app_metadata'));
    END IF;
    IF p.with_check IS NOT NULL THEN
      stmt := stmt || format(' WITH CHECK (%s)', replace(p.with_check, 'user_metadata', 'app_metadata'));
    END IF;
    EXECUTE stmt;
    RAISE NOTICE 'Rewrote %.%: %', p.tablename, p.policyname, stmt;
  END LOOP;
END $$;

-- ── 2. Profiles: students may update only these columns of their own row ─────────────────
-- (app/profile/setup writes full_name, exam_type, exam_type_set_at, country, country_set_at;
-- exam_preference is the older equivalent.) The server uses the service key, which keeps full
-- access. Inserts come from the handle_new_user trigger (SECURITY DEFINER), not from students.
REVOKE INSERT, UPDATE, DELETE ON public.profiles FROM anon, authenticated;
GRANT UPDATE (full_name, exam_type, exam_type_set_at, country, country_set_at, exam_preference)
   ON public.profiles TO authenticated;

-- ── 3. A record of every grant of paid access ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.subscription_grants (
  id                  bigserial PRIMARY KEY,
  created_at          timestamptz NOT NULL DEFAULT now(),
  user_id             uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source              text NOT NULL CHECK (source IN ('razorpay_verify', 'razorpay_webhook', 'admin')),
  tier                text,
  plan                text,
  expires_at          timestamptz,
  razorpay_order_id   text,
  razorpay_payment_id text,
  amount              integer,   -- smallest currency unit (paise, cents)
  currency            text,
  granted_by          uuid REFERENCES auth.users(id) ON DELETE SET NULL,  -- the admin, for source 'admin'
  UNIQUE (razorpay_payment_id, source)
);
CREATE INDEX IF NOT EXISTS subscription_grants_user ON public.subscription_grants (user_id, created_at DESC);
ALTER TABLE public.subscription_grants ENABLE ROW LEVEL SECURITY;  -- no policies: server only
REVOKE ALL ON public.subscription_grants FROM anon, authenticated;

COMMIT;

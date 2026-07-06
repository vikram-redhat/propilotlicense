-- Student country migration: capture which country's exam a student is preparing for
-- Run in Supabase SQL editor, AFTER scripts/migrate_countries.sql

-- ─── profiles: add country ──────────────────────────────────────────────────────
-- No default on the column itself — new signups should see the picker in
-- /profile/setup (gated by proxy.ts checking user_metadata.country). Existing
-- profiles are backfilled explicitly below instead, since 100% of the current
-- user base and question bank is India/DGCA.

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS country text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS country_set_at timestamptz;

-- ─── Backfill existing users to India ───────────────────────────────────────────
-- Silent backfill — no new prompt for current users. Only profiles/signups
-- created after this migration (country IS NULL) go through the setup picker.

UPDATE profiles SET country = 'IN', country_set_at = now() WHERE country IS NULL;

-- Also backfill the JWT user_metadata copy (proxy.ts reads this, not the profiles
-- table, to avoid an extra DB round-trip on every request).
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || jsonb_build_object('country', 'IN')
WHERE (raw_user_meta_data ->> 'country') IS NULL;

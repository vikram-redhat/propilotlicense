-- Countries migration: admin-manageable country catalog + per-book tagging
-- Run in Supabase SQL editor

-- ─── Countries catalog ─────────────────────────────────────────────────────────
-- Admin-manageable (not a hardcoded enum) so new countries can be added later
-- from /admin/countries without a code change.

CREATE TABLE IF NOT EXISTS countries (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,   -- ISO 3166-1 alpha-2, e.g. 'IN' — drives the flag emoji
  name        text not null,          -- e.g. 'India'
  sort_order  integer default 0,
  active      boolean default true,
  created_at  timestamptz default now()
);

INSERT INTO countries (code, name, sort_order) VALUES
  ('IN', 'India', 1),
  ('US', 'United States', 2),
  ('AU', 'Australia', 3)
ON CONFLICT (code) DO NOTHING;

-- ─── Tag books by country ───────────────────────────────────────────────────────
-- Existing books default to India since every book in the bank today is DGCA-specific.

ALTER TABLE source_books ADD COLUMN IF NOT EXISTS countries text[] DEFAULT '{IN}';

-- ─── RLS ────────────────────────────────────────────────────────────────────────

ALTER TABLE countries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read countries"
  ON countries FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins have full access to countries"
  ON countries FOR ALL
  USING ((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true);

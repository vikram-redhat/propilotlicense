-- ProPilotLicense v3 migration
-- Run in Supabase SQL editor BEFORE re-seeding
-- Changes: 3-scope (topic/book/combined), question_count, time_limit_secs, topic_id on sessions

-- 1. Drop old scope constraint (was 'subject' | 'book') and add v3 values
ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_scope_check;
ALTER TABLE sessions ADD CONSTRAINT sessions_scope_check
  CHECK (scope IN ('topic', 'book', 'combined'));

-- 2. Update default scope value for new rows
ALTER TABLE sessions ALTER COLUMN scope SET DEFAULT 'combined';

-- 3. Add topic_id to sessions (populated when scope = 'topic')
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS topic_id uuid
  REFERENCES topics(id) ON DELETE SET NULL;

-- 4. Add question_count and time_limit_secs (always question_count * 45)
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS question_count integer;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS time_limit_secs integer;

-- 5. Truncate all tables for a clean v3 reseed
TRUNCATE question_options, questions, sessions, topics, source_books, subjects
  RESTART IDENTITY CASCADE;

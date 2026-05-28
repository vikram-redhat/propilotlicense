-- ProPilotLicense v2 migration
-- Run this in the Supabase SQL editor BEFORE re-seeding

-- 1. subjects: add licence_types
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS licence_types text[] DEFAULT '{CPL}';

-- 2. source_books: add licence_types + sort_order, drop old unique constraint
ALTER TABLE source_books ADD COLUMN IF NOT EXISTS licence_types text[] DEFAULT '{CPL}';
ALTER TABLE source_books ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;
ALTER TABLE source_books DROP CONSTRAINT IF EXISTS source_books_subject_id_title_key;

-- 3. questions: add source_book_id, citation fields
ALTER TABLE questions ADD COLUMN IF NOT EXISTS source_book_id uuid REFERENCES source_books(id) ON DELETE SET NULL;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS source_chapter text;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS source_page text;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS citation_verified boolean DEFAULT false;

-- 4. sessions: add licence_type, scope, source_book_id
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS licence_type text NOT NULL DEFAULT 'CPL';
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS scope text NOT NULL DEFAULT 'subject' CHECK (scope IN ('subject', 'book'));
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS source_book_id uuid REFERENCES source_books(id) ON DELETE SET NULL;

-- 5. Wipe old v1 seed data so v2 seed can run clean
TRUNCATE question_options, questions, sessions, topics, source_books, subjects RESTART IDENTITY CASCADE;

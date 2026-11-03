-- Syllabus chapter: which DGCA syllabus topic (one of the 26 verified IC Joshi chapters)
-- a question tests, separate from where it came from (source_book_id / chapter_id /
-- source_chapter, which stay as they are).
--   syllabus_chapter_source: 'rule' (copied from a trusted chapter_id), 'ai' (classifier),
--                            'reviewed' (set by an admin in /admin/review)
-- Safe to run before or after the code deploy: nothing selects these columns by name
-- until it has been run. Run scripts/seed_syllabus_chapter_joshi.sql after this.

ALTER TABLE questions
  ADD COLUMN IF NOT EXISTS syllabus_chapter_id         uuid REFERENCES chapters(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS syllabus_chapter_confidence text CHECK (syllabus_chapter_confidence IN ('high', 'medium', 'low')),
  ADD COLUMN IF NOT EXISTS syllabus_chapter_source     text CHECK (syllabus_chapter_source IN ('rule', 'ai', 'reviewed'));

CREATE INDEX IF NOT EXISTS idx_questions_syllabus_chapter
  ON questions (syllabus_chapter_id) WHERE active;

-- Chapter metadata for verified chapter lists (and, later, public chapter pages).
-- All nullable. Run before scripts/ic_joshi_chapters_2019.sql, which writes them.
-- Safe to run before or after the code deploy: nothing selects these columns yet,
-- and existing chapter queries name their columns explicitly.

ALTER TABLE chapters
  ADD COLUMN IF NOT EXISTS exam_weight     text CHECK (exam_weight IN ('High', 'Medium', 'Low')),
  ADD COLUMN IF NOT EXISTS syllabus_topics text,
  ADD COLUMN IF NOT EXISTS key_subtopics   text,
  ADD COLUMN IF NOT EXISTS page_start      integer,
  ADD COLUMN IF NOT EXISTS page_end        integer,
  ADD COLUMN IF NOT EXISTS verified_at     timestamptz;

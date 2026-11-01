-- Question review mode (/admin/review).
-- Adds questions.last_reviewed_at + last_reviewed_by so reviewers can work through the
-- bank in batches, never-reviewed first, then least-recently reviewed.
-- Safe to run before or after the code deploy: the review page shows a "run the
-- migration" notice until these columns exist, and nothing else reads them.

ALTER TABLE questions ADD COLUMN IF NOT EXISTS last_reviewed_at timestamptz;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS last_reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS questions_last_reviewed_at_idx ON questions (last_reviewed_at NULLS FIRST, created_at);

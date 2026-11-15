-- Ending a session.
--   sessions.ended_at: when the session ended — the student reached the last question, the
--     mock timer ran out, or they pressed End session / Submit. Null while it's unfinished.
--   sessions.ended_early: true when the student ended it with questions still unanswered.
--   sessions.answered_count: how many questions had been answered when it ended.
-- Written only by /api/session/end with the service role, so no new RLS policy is needed.
-- Safe to run before or after the code deploy: until it's run, ending a session still shows
-- the results but records nothing, and the "Continue" card stays hidden (it can't tell an
-- ended session from an unfinished one without ended_at).

ALTER TABLE sessions ADD COLUMN IF NOT EXISTS ended_at timestamptz;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS ended_early boolean;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS answered_count integer;

-- The continue card reads a student's most recent session.
CREATE INDEX IF NOT EXISTS sessions_user_created_idx ON sessions (user_id, created_at DESC);

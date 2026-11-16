-- sessions.question_count: allow any positive length.
-- A check constraint added outside the repo's migrations (sessions_question_count_check)
-- rejects 20, so paid 20-question sessions (the picker's default and chapter practice,
-- since 2026-11-15) fail to start with "violates check constraint". "Practise the rest"
-- (the unanswered questions, any number) and a composite paper short of 100 questions
-- would fail the same way. The length is set by /api/session/start and /api/session/rest.

-- 1. See the current rule (for the record)
SELECT pg_get_constraintdef(oid) AS current_rule FROM pg_constraint WHERE conname = 'sessions_question_count_check';

-- 2. Replace it
ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_question_count_check;
ALTER TABLE sessions ADD CONSTRAINT sessions_question_count_check CHECK (question_count > 0);

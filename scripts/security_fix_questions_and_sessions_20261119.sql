-- Closes two more holes found on 2026-11-19 (run by hand in the Supabase SQL editor):
--
-- 1. Reading the question bank directly. "Authenticated users can read active questions" and
--    "Authenticated users can read question options" let any logged-in account, free ones
--    included, read every question and every option (with the correct answer) straight from
--    the database API. A student may now read a question, and its options, only if it is in
--    one of their own sessions. Sessions are created by the server (below), which applies the
--    free-tier limits, so a free account can read only what its free sessions gave it.
-- 2. Creating sessions directly. "Users can create sessions" let any account insert a session
--    with any questions, scope, length or mode, skipping the free-tier limits in
--    /api/session/start. Sessions are now created only by the server (service key): the
--    start, rest and end routes already use it.
--
-- Answers: the session page still records each answer from the browser, but only for a
-- question in that student's own session.
--
-- Admins keep full access through their existing "Admins have full access to …" policies
-- (app_metadata.is_admin). The server's service key bypasses all of this.
BEGIN;

-- ── 1. Questions and options: only through the student's own sessions ────────────────────
DROP POLICY IF EXISTS "Authenticated users can read active questions" ON public.questions;
CREATE POLICY "Students can read questions in their own sessions" ON public.questions
  FOR SELECT TO authenticated
  USING (
    active = true
    AND EXISTS (
      SELECT 1 FROM public.sessions s
       WHERE s.user_id = (SELECT auth.uid())
         AND questions.id = ANY (s.question_ids)
    )
  );

DROP POLICY IF EXISTS "Authenticated users can read question options" ON public.question_options;
CREATE POLICY "Students can read options of questions in their own sessions" ON public.question_options
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.sessions s
       WHERE s.user_id = (SELECT auth.uid())
         AND question_options.question_id = ANY (s.question_ids)
    )
  );

-- Only the server writes questions and options (admins through their own policies).
REVOKE INSERT, UPDATE, DELETE ON public.questions, public.question_options FROM anon;

-- ── 2. Sessions: created only by the server ──────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can create sessions" ON public.sessions;
-- No student policy for insert, update or delete is left; revoke the table rights as well.
-- Students keep SELECT on their own sessions ("Users can view own sessions").
REVOKE INSERT, UPDATE, DELETE ON public.sessions FROM anon, authenticated;

-- ── 3. Answers: only for a question in the student's own session ─────────────────────────
DROP POLICY IF EXISTS "Users can insert own answers" ON public.session_answers;
CREATE POLICY "Users can insert own answers" ON public.session_answers
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.sessions s
       WHERE s.id = session_answers.session_id
         AND s.user_id = (SELECT auth.uid())
         AND session_answers.question_id = ANY (s.question_ids)
    )
  );
REVOKE UPDATE, DELETE ON public.session_answers FROM anon, authenticated;
REVOKE INSERT ON public.session_answers FROM anon;

-- The policies look up a student's sessions by user: make sure that's indexed.
CREATE INDEX IF NOT EXISTS sessions_user_id ON public.sessions (user_id);

COMMIT;

-- Check (read-only): the policies on these tables after the change.
SELECT tablename, policyname, cmd, roles::text, qual, with_check
  FROM pg_policies
 WHERE schemaname = 'public' AND tablename IN ('questions', 'question_options', 'sessions', 'session_answers')
 ORDER BY tablename, policyname;

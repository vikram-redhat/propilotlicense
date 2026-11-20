-- 2026-11-21. Run by hand in the Supabase SQL editor.
--
-- One row each time a free account is refused a session (app/api/session/start), so limit
-- hits can be counted:
--   type 'daily_limit'  already had today's free 10-question mixed session (India time)
--   type 'taster_used'  already used the free taster on that chapter
-- Only the server (service role) reads or writes it: RLS on, no policies.
CREATE TABLE IF NOT EXISTS public.free_session_blocks (
  id         bigserial PRIMARY KEY,
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type       text NOT NULL CHECK (type IN ('daily_limit', 'taster_used')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS free_session_blocks_created_at ON public.free_session_blocks (created_at DESC);

ALTER TABLE public.free_session_blocks ENABLE ROW LEVEL SECURITY;

-- Check (read-only): the table, empty until the first refusal.
SELECT count(*) FROM public.free_session_blocks;

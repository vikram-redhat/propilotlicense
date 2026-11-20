-- 2026-11-20. Run by hand in the Supabase SQL editor.
--
-- DGCA result notices, moved out of lib/data/dgca-exam-sessions.json so the notice check
-- (app/api/cron/dgca-notices) can publish new ones itself. The results guide, its "Awaiting
-- result" list, the updates bar and /dgca-updates read the rows that aren't hidden.
--   session_id: the session in lib/data/dgca-exam-sessions.json (e.g. olod-08-2026); null when
--               the check couldn't match the notice to a session (it's then inserted hidden).
--   label:      the notice title, as DGCA wrote it.
--   source:     'auto' (the notice check) or 'manual'.
-- Only the server (service role) reads or writes it: RLS on, no policies.
BEGIN;

CREATE TABLE IF NOT EXISTS public.dgca_results (
  id          bigserial PRIMARY KEY,
  session_id  text,
  label       text NOT NULL,
  url         text NOT NULL UNIQUE,
  notice_date date,
  seen_at     timestamptz NOT NULL DEFAULT now(),
  hidden      boolean NOT NULL DEFAULT false,
  source      text NOT NULL DEFAULT 'auto' CHECK (source IN ('auto', 'manual'))
);

ALTER TABLE public.dgca_results ENABLE ROW LEVEL SECURITY;

-- The two notices in the data file's results array (seen on 2026-11-19).
INSERT INTO public.dgca_results (session_id, label, url, notice_date, seen_at, source) VALUES
  ('olod-07-2026', 'OLODE Session 07 of 2026 (Flight Crew and RTR Restricted)',
   'https://pariksha.dgca.gov.in/PDFViewer.jsp?pdf=C8503A582ECA84F53DF11BA51761E1EB', '2026-11-03', '2026-11-19 12:00+05:30', 'manual'),
  ('fir-10-2026', 'FIR(A)/AFIR(A) Oral, Regular Session 10 of 2026',
   'https://pariksha.dgca.gov.in/PDFViewer.jsp?pdf=D4842F8558F5C7A9B6340F8602C04D2E', NULL, '2026-11-19 12:00+05:30', 'manual')
ON CONFLICT (url) DO NOTHING;

COMMIT;

-- Check (read-only): the two seed rows.
SELECT id, session_id, label, notice_date, seen_at, hidden, source FROM public.dgca_results ORDER BY id;

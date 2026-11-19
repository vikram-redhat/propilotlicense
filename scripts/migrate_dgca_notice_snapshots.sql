-- The weekly DGCA notice check (app/api/cron/dgca-notices): one row per run.
-- A successful run saves the full notice list it found; the next run compares with the latest
-- successful row. A failed run saves the error, so two failures in a row can be emailed.
-- Only the server (service role) reads or writes it: RLS on, no policies.
CREATE TABLE IF NOT EXISTS public.dgca_notice_snapshots (
  id          bigserial PRIMARY KEY,
  ran_at      timestamptz NOT NULL DEFAULT now(),
  ok          boolean NOT NULL,
  error       text,
  notices     jsonb,              -- [{board, title, url}] when ok
  changes     jsonb,              -- the new or changed notices this run found
  emailed     text,               -- 'changes', 'failing', or null (nothing sent)
  email_error text,               -- set when an email was due but couldn't be sent
  trigger     text NOT NULL DEFAULT 'cron'  -- 'cron' or 'manual'
);

CREATE INDEX IF NOT EXISTS dgca_notice_snapshots_ran_at ON public.dgca_notice_snapshots (ran_at DESC);

ALTER TABLE public.dgca_notice_snapshots ENABLE ROW LEVEL SECURITY;

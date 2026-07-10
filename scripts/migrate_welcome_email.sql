-- Welcome-email idempotency flag.
-- Adds profiles.welcome_email_sent_at and backfills every existing profile to now()
-- so current users are NOT sent a retroactive welcome — only new signups going forward.
-- RUN THIS BEFORE DEPLOYING the welcome-email code (the /auth/callback handler reads
-- this column; an explicit select on a missing column hard-fails).

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS welcome_email_sent_at timestamptz;

UPDATE profiles SET welcome_email_sent_at = now() WHERE welcome_email_sent_at IS NULL;

-- Backfill full_name for existing profiles that never captured a name (all
-- email/password signups before the profile-setup name step existed).
-- Uses the account email as the name, per product decision. New signups now
-- collect a real full name in /profile/setup and write it to both profiles
-- and auth user_metadata.
--
-- Display (header, UserMenu, welcome email) reads user_metadata.full_name with
-- an email-prefix fallback, so we intentionally do NOT overwrite auth metadata
-- here — that would make greetings show the full email instead of the prefix.
-- This only populates the profiles.full_name column (used by the admin
-- students list and any future name-based features).

UPDATE profiles
SET full_name = email
WHERE full_name IS NULL OR btrim(full_name) = '';

-- Source kind and question refs.
--   source_books.source_kind: 'textbook' (the default, every existing book) or 'legal'
--     (a primary legal source such as the Bharatiya Vayuyan Niyam, 2026 or the Adhiniyam).
--     The results page shows a legal source's own disclaimer.
--   questions.external_ref: a stable ref from an imported batch (e.g. BVN26-001), so a
--     question can be found and discussed by its ref. Unique where set.
-- Safe to run before or after the code deploy: the results page reads books with
-- select('*') and treats a missing source_kind as 'textbook'. Run it before
-- scripts/import-bvn26.mjs, which writes both columns.

ALTER TABLE source_books
  ADD COLUMN IF NOT EXISTS source_kind text NOT NULL DEFAULT 'textbook'
    CHECK (source_kind IN ('textbook', 'legal'));

ALTER TABLE questions ADD COLUMN IF NOT EXISTS external_ref text;

CREATE UNIQUE INDEX IF NOT EXISTS questions_external_ref_key
  ON questions (external_ref) WHERE external_ref IS NOT NULL;

-- Review mode ordering (/admin/review).
-- review_batch() returns the next batch of question ids in review order:
--   1. never-reviewed before reviewed; reviewed ones least-recently reviewed first
--   2. within never-reviewed: answered before never-answered
--   3. among answered: % wrong desc, then answer count desc
--   4. never-answered: created_at asc
-- Stats are aggregated from session_answers inside the query, before the LIMIT.
-- Safe to run before or after the code deploy: until this function exists the review
-- route falls back to plain last_reviewed_at / created_at ordering.

CREATE INDEX IF NOT EXISTS session_answers_question_id_idx ON session_answers (question_id);

CREATE OR REPLACE FUNCTION review_batch(
  p_subject uuid    DEFAULT NULL,
  p_book    uuid    DEFAULT NULL,
  p_chapter uuid    DEFAULT NULL,
  p_status  text    DEFAULT 'published',
  p_exclude uuid[]  DEFAULT '{}',
  p_limit   int     DEFAULT 20
)
RETURNS TABLE (id uuid)
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  WITH stats AS (
    SELECT question_id,
           count(*) AS answered,
           count(*) FILTER (WHERE is_correct IS NOT TRUE) AS wrong
    FROM session_answers
    GROUP BY question_id
  )
  SELECT q.id
  FROM questions q
  LEFT JOIN stats s ON s.question_id = q.id
  WHERE (p_subject IS NULL OR q.subject_id = p_subject)
    AND (p_book    IS NULL OR q.source_book_id = p_book)
    AND (p_chapter IS NULL OR q.chapter_id = p_chapter)
    AND (p_status <> 'published' OR q.active = true)
    AND (p_status <> 'draft'     OR q.active = false)
    AND (p_status <> 'flagged'   OR q.flagged = true)
    AND NOT (q.id = ANY (p_exclude))
  ORDER BY q.last_reviewed_at ASC NULLS FIRST,
           (s.answered IS NULL) ASC,
           s.wrong::numeric / s.answered DESC NULLS LAST,
           s.answered DESC NULLS LAST,
           q.created_at ASC
  LIMIT p_limit
$$;

-- Admin-only: called by the review route with the service-role key.
REVOKE EXECUTE ON FUNCTION review_batch(uuid, uuid, uuid, text, uuid[], int) FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION review_batch(uuid, uuid, uuid, text, uuid[], int) TO service_role;

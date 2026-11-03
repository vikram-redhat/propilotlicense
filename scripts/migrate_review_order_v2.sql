-- review_batch() v2: adds syllabus chapter and syllabus confidence filters for
-- /admin/review (Brief B Step 5). Ordering is unchanged from
-- scripts/migrate_review_order.sql. Needs scripts/migrate_syllabus_chapter.sql.
--
-- Safe to run before or after the code deploy: until it runs, the review route uses the
-- old function when no syllabus filter is set, and falls back to plain
-- least-recently-reviewed ordering when one is.

DROP FUNCTION IF EXISTS review_batch(uuid, uuid, uuid, text, uuid[], int);

CREATE OR REPLACE FUNCTION review_batch(
  p_subject             uuid    DEFAULT NULL,
  p_book                uuid    DEFAULT NULL,
  p_chapter             uuid    DEFAULT NULL,
  p_status              text    DEFAULT 'published',
  p_exclude             uuid[]  DEFAULT '{}',
  p_limit               int     DEFAULT 20,
  p_syllabus_chapter    uuid    DEFAULT NULL,
  p_syllabus_confidence text    DEFAULT NULL
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
    AND (p_syllabus_chapter    IS NULL OR q.syllabus_chapter_id = p_syllabus_chapter)
    AND (p_syllabus_confidence IS NULL OR q.syllabus_chapter_confidence = p_syllabus_confidence)
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

REVOKE EXECUTE ON FUNCTION review_batch(uuid, uuid, uuid, text, uuid[], int, uuid, text) FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION review_batch(uuid, uuid, uuid, text, uuid[], int, uuid, text) TO service_role;

-- 2026-11-19. Run by hand in the Supabase SQL editor.
--
-- 1. Page ranges for book chapters (chapters.page_start, page_end), so the admin Generate tool
--    keeps a generated page number only when it falls inside the chapter it's filed under.
--    RK Bali, Air Regulations (Eleventh Revised Edition, 2018), from the contents page:
--    chapters 17-23. Each chapter ends the page before the next starts; 23 ends at p. 630.
--    The other chapters' ranges are added when they're known (a chapter without a range
--    keeps no generated page number).
-- 2. questions.created_by: the admin who created the question. Filled by the database from
--    the login that inserts the row (auth.uid()), so the Generate tool and the question form
--    record it without sending it; rows inserted with the service key (scripts) stay empty.
BEGIN;

ALTER TABLE public.chapters
  ADD COLUMN IF NOT EXISTS page_start integer,
  ADD COLUMN IF NOT EXISTS page_end   integer;
ALTER TABLE public.chapters DROP CONSTRAINT IF EXISTS chapters_page_range_check;
ALTER TABLE public.chapters ADD CONSTRAINT chapters_page_range_check
  CHECK (page_start IS NULL OR page_end IS NULL OR page_end >= page_start);

UPDATE public.chapters c
   SET page_start = r.page_start, page_end = r.page_end
  FROM (VALUES
    (17, 427, 460),
    (18, 461, 502),
    (19, 503, 534),
    (20, 535, 540),
    (21, 541, 550),
    (22, 551, 556),
    (23, 557, 630)
  ) AS r(chapter_number, page_start, page_end)
 WHERE c.book_id = '15db3a2f-0718-4f98-beeb-177d9b92a4a4'  -- RK Bali, Air Regulations
   AND c.chapter_number = r.chapter_number;

ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL DEFAULT auth.uid();

COMMIT;

-- Check (read-only)
SELECT chapter_number, chapter_name, page_start, page_end
  FROM public.chapters
 WHERE book_id = '15db3a2f-0718-4f98-beeb-177d9b92a4a4' AND page_start IS NOT NULL
 ORDER BY chapter_number;

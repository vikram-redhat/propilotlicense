-- Remap IC Joshi question citations from the old invented 16-chapter numbering to the
-- verified 2019 chapters (follows scripts/ic_joshi_chapters_2019.sql).
--
-- Paste the whole file into the Supabase SQL editor and run it once. Everything runs
-- in one DO block, so any failed check raises and nothing changes.
--
--   1. Back up id, chapter_id, source_chapter, citation_verified for every IC Joshi
--      question into backup_joshi_citations_20261103 (RLS on, service role only).
--   2. For each question whose source_chapter is "Chapter N" with N in the old→new
--      mapping: set chapter_id to the verified chapter and source_chapter to
--      "Chapter <new>: <name>". A question that already has a different chapter_id
--      is left completely unchanged and listed. Unrecognised or blank values are
--      left unchanged and listed.
--   3. citation_verified = false on all IC Joshi questions: the chapter is now
--      consistent but not panel-confirmed (decision 2026-11-03; backup keeps the
--      previous values).
-- source_page, source_book_id, question text, options, explanations and every other
-- book are not touched. The final SELECT prints the report.
--
-- Undo (restores chapter_id, source_chapter, citation_verified):
--   UPDATE questions q SET chapter_id = b.chapter_id, source_chapter = b.source_chapter,
--          citation_verified = b.citation_verified
--   FROM backup_joshi_citations_20261103 b WHERE b.id = q.id;

DROP TABLE IF EXISTS _joshi_remap_report;
CREATE TEMP TABLE _joshi_remap_report (seq serial, section text, detail text, n int);

DO $$
DECLARE
  v_book     uuid;
  v_n        int;
  v_backup   int;
  v_mapped   int;
  v_flag     int;
BEGIN
  SELECT id INTO STRICT v_book FROM source_books
  WHERE author = 'IC Joshi' AND title = 'Aviation Meteorology';

  IF (SELECT count(*) FROM chapters WHERE book_id = v_book AND verified_at IS NOT NULL) <> 26 THEN
    RAISE EXCEPTION 'Expected 26 verified IC Joshi chapters: run scripts/ic_joshi_chapters_2019.sql first';
  END IF;

  IF to_regclass('public.backup_joshi_citations_20261103') IS NOT NULL THEN
    RAISE EXCEPTION 'backup_joshi_citations_20261103 already exists: this remap has already been run';
  END IF;

  -- ── Step 1: backup ──────────────────────────────────────────────────────────
  CREATE TABLE backup_joshi_citations_20261103 AS
    SELECT q.id, q.chapter_id, q.source_chapter, q.citation_verified
    FROM questions q
    JOIN source_books b ON b.id = q.source_book_id
    WHERE b.author = 'IC Joshi' AND b.title = 'Aviation Meteorology';
  ALTER TABLE backup_joshi_citations_20261103 ENABLE ROW LEVEL SECURITY;
  SELECT count(*) INTO v_backup FROM backup_joshi_citations_20261103;
  INSERT INTO _joshi_remap_report (section, n) VALUES ('Backup rows', v_backup);

  -- ── Step 2: work out each question's target chapter ─────────────────────────
  DROP TABLE IF EXISTS _map;
  CREATE TEMP TABLE _map (old_number int PRIMARY KEY, new_number int);
  INSERT INTO _map VALUES
    (1, 1), (2, 3), (3, 2), (4, 6), (5, 5), (6, 8), (7, 11), (8, 7),
    (9, 14), (10, 14), (11, 13), (12, 12), (13, 16), (14, 16), (15, 25), (16, 26);

  DROP TABLE IF EXISTS _plan;
  CREATE TEMP TABLE _plan AS
    SELECT q.id, q.chapter_id AS current_chapter_id, q.source_chapter,
           c.id AS new_chapter_id, c.chapter_number AS new_number, c.chapter_name AS new_name,
           CASE
             WHEN c.id IS NULL                                        THEN 'unmapped'
             WHEN q.chapter_id IS NOT NULL AND q.chapter_id <> c.id   THEN 'conflict'
             ELSE 'remap'
           END AS action
    FROM questions q
    LEFT JOIN _map m ON m.old_number = (substring(q.source_chapter FROM '^\s*Chapter\s+(\d+)\s*$'))::int
    LEFT JOIN chapters c ON c.book_id = v_book AND c.chapter_number = m.new_number
    WHERE q.source_book_id = v_book;

  UPDATE questions q
  SET chapter_id     = p.new_chapter_id,
      source_chapter = format('Chapter %s: %s', p.new_number, p.new_name)
  FROM _plan p
  WHERE p.id = q.id AND p.action = 'remap';
  GET DIAGNOSTICS v_mapped = ROW_COUNT;

  -- ── Step 3: not panel-confirmed yet ─────────────────────────────────────────
  UPDATE questions SET citation_verified = false
  WHERE source_book_id = v_book AND citation_verified IS DISTINCT FROM false;
  GET DIAGNOSTICS v_flag = ROW_COUNT;

  -- ── Sanity: every remapped question now agrees with its text ────────────────
  SELECT count(*) INTO v_n
  FROM questions q JOIN _plan p ON p.id = q.id AND p.action = 'remap'
  WHERE q.chapter_id IS DISTINCT FROM p.new_chapter_id
     OR q.source_chapter IS DISTINCT FROM format('Chapter %s: %s', p.new_number, p.new_name);
  IF v_n > 0 THEN
    RAISE EXCEPTION '% remapped question(s) did not end up as planned', v_n;
  END IF;

  -- ── Report ──────────────────────────────────────────────────────────────────
  INSERT INTO _joshi_remap_report (section, n) VALUES
    ('Questions remapped (chapter_id + source_chapter)', v_mapped),
    ('citation_verified set true → false',               v_flag);

  INSERT INTO _joshi_remap_report (section, detail, n)
  SELECT 'AFTER: questions per verified chapter', format('Ch %s %s', c.chapter_number, c.chapter_name), count(q.id)
  FROM chapters c LEFT JOIN questions q ON q.chapter_id = c.id AND q.source_book_id = v_book
  WHERE c.book_id = v_book
  GROUP BY c.chapter_number, c.chapter_name ORDER BY c.chapter_number;

  INSERT INTO _joshi_remap_report (section, n)
  SELECT 'AFTER: total with a verified chapter', count(*)
  FROM questions WHERE source_book_id = v_book AND chapter_id IN (SELECT id FROM chapters WHERE book_id = v_book);

  INSERT INTO _joshi_remap_report (section, detail)
  SELECT 'CONFLICT (left unchanged)',
         format('%s — source_chapter "%s" maps to Ch %s, but chapter_id is Ch %s %s',
                p.id, p.source_chapter, p.new_number, cur.chapter_number, cur.chapter_name)
  FROM _plan p LEFT JOIN chapters cur ON cur.id = p.current_chapter_id
  WHERE p.action = 'conflict' ORDER BY p.source_chapter, p.id;

  INSERT INTO _joshi_remap_report (section, detail)
  SELECT 'UNMAPPED (left unchanged)', format('%s — source_chapter %s', p.id, coalesce('"' || p.source_chapter || '"', 'NULL'))
  FROM _plan p WHERE p.action = 'unmapped' ORDER BY p.id;
END $$;

SELECT section, detail, n FROM _joshi_remap_report ORDER BY seq;

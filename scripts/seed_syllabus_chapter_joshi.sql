-- Seed questions.syllabus_chapter_id for IC Joshi questions from their (Brief A)
-- chapter_id, source 'rule', confidence 'high'. Run after
-- scripts/migrate_syllabus_chapter.sql.
--
-- Skips the 7 Brief A conflicts: they are linked to Ch 1 Atmosphere but are about
-- monsoon convection, SIGMETs/AIRMETs, ENSO and ITCZ icing, so their chapter_id is known
-- to be wrong. The classifier places them instead.
--
-- Only fills empty syllabus_chapter_id, so re-running it changes nothing. Expect 319.

DO $$
DECLARE
  v_book uuid;
  v_n    int;
BEGIN
  SELECT id INTO STRICT v_book FROM source_books
  WHERE author = 'IC Joshi' AND title = 'Aviation Meteorology';

  UPDATE questions
  SET syllabus_chapter_id         = chapter_id,
      syllabus_chapter_source     = 'rule',
      syllabus_chapter_confidence = 'high'
  WHERE source_book_id = v_book
    AND active
    AND chapter_id IN (SELECT id FROM chapters WHERE book_id = v_book)
    AND syllabus_chapter_id IS NULL
    AND id NOT IN (
      '07597585-ce92-4a75-98af-f29ce98e7e4f',
      '9fe48085-f2ce-451f-b7ee-08c5c0a941eb',
      '9ddfa083-29b4-4b4a-a564-76395d9eb99c',
      'cb697b24-b73e-4f92-8bf4-9a7a554ae1f8',
      'aeeb06ea-d2ff-4f93-b4b7-bd15a8930c21',
      '5b6296d3-0dad-43c8-874a-6e24211caf6c',
      'c3179b92-7598-4c4e-a3dd-6ec9f8cc8dab'
    );
  GET DIAGNOSTICS v_n = ROW_COUNT;
  RAISE NOTICE 'Seeded % IC Joshi questions', v_n;
END $$;

SELECT syllabus_chapter_source, syllabus_chapter_confidence, count(*)
FROM questions q JOIN source_books b ON b.id = q.source_book_id
WHERE b.author = 'IC Joshi' AND b.title = 'Aviation Meteorology'
GROUP BY 1, 2 ORDER BY 1, 2;

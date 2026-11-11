-- Replace the RK Bali (Air Regulations) chapters with the Captain Panel's list from the
-- Eleventh Revised Edition, 2018 (source: scripts/data/rk-bali-chapters-2018.csv), so they
-- can serve as the Air Regulations syllabus map. Modelled on scripts/ic_joshi_chapters_2019.sql.
--
-- Paste the whole file into the Supabase SQL editor and run it once.
--
-- Everything happens inside one DO block, which Postgres runs as a single atomic
-- statement: any failed check raises, and nothing at all is changed. Steps:
--   1. insert the 22 chapters as new rows (old rows kept until step 3). Chapters 21
--      (Facilitation) and 22 (Human Performance and Limitations) have no topics yet.
--   2. repoint questions.chapter_id and sessions.chapter_id via the old→new mapping
--      (approved 2026-11-11; CARs → 14 for now, the classifier re-places them)
--   3. confirm nothing references the old rows (every FK into chapters is checked),
--      then delete exactly 14 old rows
--   4. set source_books.edition = 'Eleventh Revised Edition, 2018' (nothing else on the row)
-- The final SELECT prints before/after per-chapter counts of active questions and
-- the number of sessions repointed.
--
-- Only touches the RK Bali book. questions.source_chapter is not modified.

DROP TABLE IF EXISTS _rk_bali_report;
CREATE TEMP TABLE _rk_bali_report (seq serial, section text, chapter_number int, chapter_name text, n int);

DO $$
DECLARE
  v_book       uuid;
  v_n          int;
  v_q_before   int;
  v_q_after    int;
  v_q_moved    int;
  v_s_moved    int;
  v_deleted    int;
  v_bad        text;
  r            record;
BEGIN
  -- ── Guards ──────────────────────────────────────────────────────────────────
  SELECT id INTO STRICT v_book FROM source_books
  WHERE id = '15db3a2f-0718-4f98-beeb-177d9b92a4a4' AND author = 'RK Bali' AND title = 'Air Regulations';

  IF EXISTS (SELECT 1 FROM chapters WHERE book_id = v_book AND verified_at IS NOT NULL) THEN
    RAISE EXCEPTION 'Verified RK Bali chapters already exist: this script has already been run';
  END IF;

  -- Old rows, captured by id before anything changes.
  DROP TABLE IF EXISTS _old_ch;
  CREATE TEMP TABLE _old_ch AS
    SELECT id, chapter_number, chapter_name FROM chapters WHERE book_id = v_book;

  -- Old chapter number → 2018 chapter number.
  DROP TABLE IF EXISTS _map;
  CREATE TEMP TABLE _map (old_number int, old_name text, new_number int);
  INSERT INTO _map VALUES
    (1 , 'Introduction and ICAO'                   , 2),
    (2 , 'ICAO Annexes'                            , 2),
    (3 , 'Aircraft Act 1934'                       , 14),
    (4 , 'Aircraft Rules 1937 and Amendments'      , 14),
    (5 , 'DGCA – Organisation and Functions'       , 14),
    (6 , 'Civil Aviation Requirements (CARs)'      , 14),
    (7 , 'Personnel Licensing'                     , 15),
    (8 , 'Rules of the Air'                        , 4),
    (9 , 'Air Traffic Services'                    , 5),
    (10, 'Aerodromes and Facilities'               , 12),
    (11, 'Search and Rescue'                       , 11),
    (12, 'Accident and Incident Investigation'     , 20),
    (13, 'Human Performance and Limitations'       , 22),
    (14, 'AIP India'                               , 10);

  SELECT count(*) INTO v_n FROM _old_ch;
  IF v_n <> 14 THEN
    RAISE EXCEPTION 'Expected 14 existing RK Bali chapters, found %', v_n;
  END IF;

  SELECT string_agg(format('#%s %s', m.old_number, m.old_name), ', ') INTO v_bad
  FROM _map m LEFT JOIN _old_ch o ON o.chapter_number = m.old_number AND o.chapter_name = m.old_name
  WHERE o.id IS NULL;
  IF v_bad IS NOT NULL THEN
    RAISE EXCEPTION 'Existing RK Bali chapters do not match the mapping: % not found', v_bad;
  END IF;

  -- ── Before counts ───────────────────────────────────────────────────────────
  INSERT INTO _rk_bali_report (section, chapter_number, chapter_name, n)
  SELECT 'BEFORE: active questions per old chapter', o.chapter_number, o.chapter_name, count(q.id)
  FROM _old_ch o LEFT JOIN questions q ON q.chapter_id = o.id AND q.active
  GROUP BY o.chapter_number, o.chapter_name ORDER BY o.chapter_number;

  SELECT count(*) INTO v_q_before FROM questions WHERE chapter_id IN (SELECT id FROM _old_ch) AND active;
  INSERT INTO _rk_bali_report (section, n) VALUES ('BEFORE: total active questions', v_q_before);

  -- ── Step 1: insert the 22 chapters ──────────────────────────────────────────
  -- If chapters carries any unique index besides the PK (e.g. book_id + chapter_number
  -- or + chapter_name), park the old rows out of the way first so the new ones fit.
  -- They are deleted below in this same transaction.
  IF EXISTS (SELECT 1 FROM pg_index WHERE indrelid = 'public.chapters'::regclass AND indisunique AND NOT indisprimary) THEN
    UPDATE chapters
    SET chapter_number = chapter_number + 1000,
        sort_order     = sort_order + 1000,
        chapter_name   = chapter_name || ' (pre-2018)'
    WHERE id IN (SELECT id FROM _old_ch);
  END IF;

  INSERT INTO chapters (book_id, chapter_number, chapter_name, sort_order, exam_weight, syllabus_topics, key_subtopics, verified_at)
  SELECT v_book, v.n, v.name, v.n, v.weight, v.topics, v.subtopics, now()
  FROM (VALUES
      (1, 'Definitions and Abbreviations', 'Medium', 'ATS, ATC, aerodrome, aeroplane, ADIZ, ALERFA, RNAV, approach, PBN, ELT, ATIS, ceiling', 'Decision altitude, DR, DA, EDTO, DETRESFA, EOBT, ETA, flight plan'),
      (2, 'International Organisations and Conventions', 'High', 'Paris Convention, Chicago Convention, air navigation, articles of the Convention, ICAO Annexes, standards and recommended practices', 'Nationality of aircraft, documents to be carried, SARPs, ICAO, powers of the PIC, Montreal Convention, DGCA'),
      (3, 'Aircraft Nationality and Registration Marks', 'Medium', 'Identification plates, provisions, registration', 'Aircraft registration, State marks'),
      (4, 'Rules of the Air', 'High', 'Applicability, compliance, negligent operation of aeroplanes, aerobatic flights, air traffic control service, position reports, VMC, IMC, special VFR, IFR, VFR, controlled airspace, ADC, ADIZ, urgency and distress signals', 'Psychoactive substances, lights to be displayed, emergency landing, converging, overtaking, right of way, collision, anti-collision lights, simulated instrument flights, flight plan, ground signals, marshalling signals, RVSM, non-RVSM, semi-circular rule, unlawful interference'),
      (5, 'Air Traffic Services', 'High', 'Divisions of ATS, ATC, AIP, airspace classification, FIR, prohibited, restricted and danger areas, ATS routes', 'Airspace classification, flight information service, CPDLC, ATIS, D-ATIS, alerting service, RNAV and RNP airspace, arrivals and departures, STAR and SID'),
      (6, 'Area Control Service', 'High', 'PANS-OPS, vertical and horizontal separation, longitudinal and lateral separation', 'Climbing and descending tracks, separation based on time and distance, same and reciprocal tracks, Mach number technique, performance-based separation'),
      (7, 'Approach Control Service', 'High', 'Separation of departing and arriving aircraft, reduction in separation minima, EAT, ETA', 'RNP and RNAV procedures, holding fix, visual approaches'),
      (8, 'Aerodrome Control Service', 'Medium', 'Take-off, runway incursion, wake turbulence, circuit traffic', 'Wind shear, aerodrome lights, runway lights, hot spots, hold short position'),
      (9, 'Use of Air Traffic Services Surveillance System', 'Medium', 'ADS-B, ATS surveillance systems, ADS-C, primary radar', 'Squawk codes, Mode C, MLAT, radar contact, SSR, Mode A'),
      (10, 'Aeronautical Information Services', 'Medium', 'AIP, NOTAM, AIRAC, AIC, checklist', 'Circulars, notices, AIP parts 1 and 2, FIR, CTA, TMA, en route'),
      (11, 'Search and Rescue', 'Medium', 'SAR procedures, signals, air-to-ground and ground-to-air signals, rescue coordination centre', 'Units for SAR, symbols for survivors and rescue teams, international distress frequency, satellites, INMARSAT'),
      (12, 'Visual Aids for Navigation', 'High', 'Landing direction indicator, runway markings, centre line markings, threshold markings, aiming point markings, touchdown zone, taxiway markings, colour codes for lights', 'Holding point markings, aircraft stand markings, colour codes for markings, lights, emergency lighting, approach lights, beacons, precision approach lighting, VASI, PAPI, rapid exit taxiway, markers'),
      (13, 'Procedures for Air Navigation Services', 'High', 'General criteria, obstacle clearance, instrument departure procedures, SIDs, standard arrival procedures, gradients, CDFA, MSA, approach segments, reversal and racetrack procedures, precision and non-precision approaches, parallel runway operations, area navigation and RNAV, altimeter setting procedure, SSR transponder settings, ACAS and TCAS, communication failure procedures', 'Straight and turning departures and arrivals, GBAS and RNP departures, fix tolerance, aeroplane categories by approach speed, missed approach segment, ICAO classification of approaches, IAP, holding procedures, DME arc entry'),
      (14, 'National Law', 'High', 'Bharatiya Vayuyan Adhiniyam, 2024; Bharatiya Vayuyan Niyam, 2026 (replacing the Aircraft Act, 1934 and Aircraft Rules, 1937)', 'Powers and penalties, documents to be carried, carriage of personnel, dangerous flying, refuelling, smoking, carriage of birds and animals, dropping of articles, age for professional pilots, safety management systems, certificate of registration, PEDs, operating crew, cabin crew, FDTL limits, foreign licences, logbooks, accidents and incidents, scheduled and non-scheduled operations, public health'),
      (15, 'Personnel Licensing and Annex 1', 'Medium', 'National provisions for flight crew licensing, SPL, CPL, ATPL, CHPL, ATPL(H), PPL, ratings', 'Issue and renewal of licences, eligibility'),
      (16, 'Airworthiness of Aircraft', 'Low', 'ICAO Annex 8', 'National provisions'),
      (17, 'Operational Procedures', 'Medium', 'ICAO Annex 6, documents, admission to the flight deck, AOC, PRM, stowage of baggage and cargo, low visibility operations, CAT II and III approaches and landings', 'Flight recorders, wipers, minimum fuel and oxygen, EDTO, fire extinguishers, communication and navigation equipment, ELT, life rafts, minimum rest, ultra long-range flights'),
      (18, 'Special Operations and Hazards', 'High', 'De-icing, anti-icing, bird strike, smoke, decompression, microburst, wake turbulence', 'Fuel jettisoning, hydroplaning, MEL, noise abatement'),
      (19, 'Communications', 'High', 'Q codes, categories of messages', 'Radio phraseology, METAR, SPECI, TREND, TAF, ROFOR, SIGMET, AIRMET, CAVOK, distress and urgency, radio waves'),
      (20, 'Aircraft Accident and Incident', 'Medium', 'National provisions, serious incident and injury, reporting procedures', NULL),
      (21, 'Facilitation', 'High', NULL, NULL),
      (22, 'Human Performance and Limitations', 'Medium', NULL, NULL)
  ) AS v(n, name, weight, topics, subtopics);

  SELECT count(*) INTO v_n FROM chapters WHERE book_id = v_book AND verified_at IS NOT NULL;
  IF v_n <> 22 THEN
    RAISE EXCEPTION 'Expected 22 new chapters after insert, found %', v_n;
  END IF;

  -- ── Step 2: repoint questions and sessions ──────────────────────────────────
  DROP TABLE IF EXISTS _idmap;
  CREATE TEMP TABLE _idmap AS
    SELECT o.id AS old_id, n.id AS new_id
    FROM _old_ch o
    JOIN _map m     ON m.old_number = o.chapter_number
    JOIN chapters n ON n.book_id = v_book AND n.verified_at IS NOT NULL AND n.chapter_number = m.new_number;

  SELECT count(*) INTO v_n FROM _idmap;
  IF v_n <> 14 THEN
    RAISE EXCEPTION 'Old→new id mapping has % rows, expected 14', v_n;
  END IF;

  UPDATE questions q SET chapter_id = m.new_id FROM _idmap m WHERE q.chapter_id = m.old_id;
  GET DIAGNOSTICS v_q_moved = ROW_COUNT;

  UPDATE sessions s SET chapter_id = m.new_id FROM _idmap m WHERE s.chapter_id = m.old_id;
  GET DIAGNOSTICS v_s_moved = ROW_COUNT;

  -- ── Step 3: no dangling references, then delete the old rows ────────────────
  -- Checks every foreign key into chapters, not just the two known ones, so a
  -- reference we didn't know about stops the run instead of being cascaded or nulled.
  FOR r IN
    SELECT c.conrelid::regclass AS tbl, a.attname AS col
    FROM pg_constraint c
    JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = c.conkey[1]
    WHERE c.contype = 'f' AND c.confrelid = 'public.chapters'::regclass
  LOOP
    EXECUTE format('SELECT count(*) FROM %s WHERE %I IN (SELECT id FROM _old_ch)', r.tbl, r.col) INTO v_n;
    IF v_n > 0 THEN
      RAISE EXCEPTION '% row(s) in %.% still reference old RK Bali chapters; nothing was changed', v_n, r.tbl, r.col;
    END IF;
  END LOOP;

  DELETE FROM chapters WHERE id IN (SELECT id FROM _old_ch);
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  IF v_deleted <> 14 THEN
    RAISE EXCEPTION 'Deleted % old chapter rows, expected 14', v_deleted;
  END IF;

  -- ── Step 4: edition ─────────────────────────────────────────────────────────
  UPDATE source_books SET edition = 'Eleventh Revised Edition, 2018' WHERE id = v_book;

  -- ── After counts ────────────────────────────────────────────────────────────
  SELECT count(*) INTO v_q_after FROM questions
  WHERE chapter_id IN (SELECT id FROM chapters WHERE book_id = v_book) AND active;
  IF v_q_after <> v_q_before THEN
    RAISE EXCEPTION 'Active RK Bali question count changed from % to %', v_q_before, v_q_after;
  END IF;

  INSERT INTO _rk_bali_report (section, chapter_number, chapter_name, n)
  SELECT 'AFTER: active questions per new chapter', c.chapter_number, c.chapter_name, count(q.id)
  FROM chapters c LEFT JOIN questions q ON q.chapter_id = c.id AND q.active
  WHERE c.book_id = v_book
  GROUP BY c.chapter_number, c.chapter_name ORDER BY c.chapter_number;

  INSERT INTO _rk_bali_report (section, n) VALUES
    ('AFTER: total active questions',         v_q_after),
    ('Questions repointed (incl. inactive)',  v_q_moved),
    ('Sessions repointed',                    v_s_moved),
    ('Old chapter rows deleted',              v_deleted);
END $$;

SELECT section, chapter_number, chapter_name, n FROM _rk_bali_report ORDER BY seq;

-- Replace IC Joshi (Aviation Meteorology) chapters with the Captain Panel's verified
-- list from the printed 2019 edition (source: scripts/data/ic-joshi-chapters-2019.csv).
--
-- Run AFTER scripts/migrate_chapter_metadata.sql. Paste the whole file into the
-- Supabase SQL editor and run it once.
--
-- Everything happens inside one DO block, which Postgres runs as a single atomic
-- statement: any failed check raises, and nothing at all is changed. Steps:
--   1. insert the 26 verified chapters as new rows (old rows kept until step 3)
--   2. repoint questions.chapter_id and sessions.chapter_id via the old→new mapping
--   3. confirm nothing references the old rows (every FK into chapters is checked),
--      then delete exactly 16 old rows
--   4. set source_books.edition = '2019'
-- The final SELECT prints before/after per-chapter counts of active questions and
-- the number of sessions repointed.
--
-- Only touches the IC Joshi book. questions.source_chapter is not modified.

DROP TABLE IF EXISTS _ic_joshi_report;
CREATE TEMP TABLE _ic_joshi_report (seq serial, section text, chapter_number int, chapter_name text, n int);

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
  WHERE author = 'IC Joshi' AND title = 'Aviation Meteorology';   -- STRICT: exactly one row

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_schema = 'public' AND table_name = 'chapters' AND column_name = 'verified_at') THEN
    RAISE EXCEPTION 'chapters.verified_at missing: run scripts/migrate_chapter_metadata.sql first';
  END IF;

  IF EXISTS (SELECT 1 FROM chapters WHERE book_id = v_book AND verified_at IS NOT NULL) THEN
    RAISE EXCEPTION 'Verified IC Joshi chapters already exist: this script has already been run';
  END IF;

  -- Old rows, captured by id before anything changes.
  DROP TABLE IF EXISTS _old_ch;
  CREATE TEMP TABLE _old_ch AS
    SELECT id, chapter_number, chapter_name FROM chapters WHERE book_id = v_book;

  -- Old chapter number → new chapter number (from the brief).
  DROP TABLE IF EXISTS _map;
  CREATE TEMP TABLE _map (old_number int, old_name text, new_number int);
  INSERT INTO _map VALUES
    (1,  'The Atmosphere',                      1),
    (2,  'Temperature',                         3),
    (3,  'Atmospheric Pressure',                2),
    (4,  'Winds',                               6),
    (5,  'Humidity and Moisture',               5),
    (6,  'Clouds',                              8),
    (7,  'Precipitation',                      11),
    (8,  'Visibility and Fog',                  7),
    (9,  'Air Masses',                         14),
    (10, 'Fronts',                             14),
    (11, 'Thunderstorms',                      13),
    (12, 'Icing',                              12),
    (13, 'Turbulence',                         16),
    (14, 'Wind Shear',                         16),
    (15, 'Aviation Weather Reports and METAR', 25),
    (16, 'Weather Forecasting and TAF',        26);

  SELECT count(*) INTO v_n FROM _old_ch;
  IF v_n <> 16 THEN
    RAISE EXCEPTION 'Expected 16 existing IC Joshi chapters, found %', v_n;
  END IF;

  SELECT string_agg(format('#%s %s', m.old_number, m.old_name), ', ') INTO v_bad
  FROM _map m LEFT JOIN _old_ch o ON o.chapter_number = m.old_number AND o.chapter_name = m.old_name
  WHERE o.id IS NULL;
  IF v_bad IS NOT NULL THEN
    RAISE EXCEPTION 'Existing IC Joshi chapters do not match the mapping: % not found', v_bad;
  END IF;

  -- ── Before counts ───────────────────────────────────────────────────────────
  INSERT INTO _ic_joshi_report (section, chapter_number, chapter_name, n)
  SELECT 'BEFORE: active questions per old chapter', o.chapter_number, o.chapter_name, count(q.id)
  FROM _old_ch o LEFT JOIN questions q ON q.chapter_id = o.id AND q.active
  GROUP BY o.chapter_number, o.chapter_name ORDER BY o.chapter_number;

  SELECT count(*) INTO v_q_before FROM questions WHERE chapter_id IN (SELECT id FROM _old_ch) AND active;
  INSERT INTO _ic_joshi_report (section, n) VALUES ('BEFORE: total active questions', v_q_before);

  -- ── Step 1: insert the 26 verified chapters ─────────────────────────────────
  -- If chapters carries any unique index besides the PK (e.g. book_id + chapter_number
  -- or + chapter_name), park the old rows out of the way first so the new ones fit.
  -- They are deleted below in this same transaction.
  IF EXISTS (SELECT 1 FROM pg_index WHERE indrelid = 'public.chapters'::regclass AND indisunique AND NOT indisprimary) THEN
    UPDATE chapters
    SET chapter_number = chapter_number + 1000,
        sort_order     = sort_order + 1000,
        chapter_name   = chapter_name || ' (pre-2019)'
    WHERE id IN (SELECT id FROM _old_ch);
  END IF;

  INSERT INTO chapters (book_id, chapter_number, chapter_name, sort_order, exam_weight, syllabus_topics, key_subtopics, verified_at)
  SELECT v_book, v.n, v.name, v.n, v.weight, v.topics, v.subtopics, now()
  FROM (VALUES
      (1, 'Atmosphere', 'High', 'Composition and structure; dry and saturated air; percentage of gases; troposphere and tropopause; ISA conditions; lapse rate', 'Nitrogen, oxygen, CO2, ozone; relative humidity; dry air; convection, radiation, conduction; evaporation and condensation; height of tropopause at equator and poles; ISA deviation'),
      (2, 'Atmospheric Pressure', 'High', 'Static and dynamic pressure; vertical variation of pressure; semi-diurnal variation; pressure gradient; altimetry; pressure patterns', 'Standard atmospheric pressure; air warmer or colder than ISA; altimeter correction; mean sea level, altitude, height, elevation; transition layer and transition level; flight level; pressure and density altitude; QFE, QNH, QFF, QNE numericals; altimeter under-reading and over-reading; low and high pressure areas; col; ridge'),
      (3, 'Temperature', 'High', 'Heat and temperature; Celsius and Fahrenheit; ambient and surface temperature; specific heat; latent heat; heat transfer; radiation; convection; insolation', 'Stefan-Boltzmann law; Wien''s law; Planck''s law; solar radiation; absorption; back scatter; effect of clouds'),
      (4, 'Air Density', 'High', 'Density altitude; pressure altitude; dry and moist air density; humidity', 'Density variation with height; numericals on density altitude'),
      (5, 'Humidity', 'High', 'Water vapour; absolute humidity; wet bulb; dew point temperature; frost point', 'Water vapour variation with air temperature; dry bulb, wet bulb and dew point relationship'),
      (6, 'Winds', 'High', 'Wind direction and speed; anemometer; gust, lull, squall, gale; backing and veering; Buys Ballot''s law; wind patterns; fohn winds; ravine winds; thermal wind; isotherms; westerly winds; wind shear; Beaufort scale; monsoon; roaring forties; trade winds', 'Coriolis force; rotation of the earth and winds; geostrophic wind; types of winds; cyclostrophic wind; gradient wind; cyclone and anticyclone; inertial winds; turbulence; eddies; diurnal variation of winds; sea and land breeze; anabatic and katabatic winds'),
      (7, 'Visibility and Fog', 'High', 'Visibility; fog; runway visual range (RVR); haze, dust, smoke haze, mist, fog, smog; dust storm; vertical and slant visibility; instruments for measuring visibility', 'Transmissometer; scopograph; radiation fog; advection fog; steaming fog; frontal fog'),
      (8, 'Clouds', 'Medium', 'Convergence and divergence; frontal zones; high, medium and low clouds; flying in clouds; condensation trails', 'High, medium and low clouds; lifting condensation level; cirrus, altostratus, stratus, stratocumulus, cumulonimbus; cloud reporting and cloud amount reporting; ceiling; height of clouds; wing tip trails; Mintra, Drytra and Maxtra levels'),
      (9, 'Stability of Atmosphere', 'Medium', 'Isothermal and adiabatic processes; lapse rate; DALR, SALR, ELR; inversion; atmospheric instability; conditional instability; latent instability; criteria for stability', 'DALR, ELR, SALR; saturated air; isothermal atmosphere; lapse rate inversion'),
      (10, 'Optical Phenomenon', 'Low', 'Rainbow; halo; mirage; corona; twilight colours; aurora borealis; St Elmo''s fire', NULL),
      (11, 'Precipitation', 'Medium', 'Ice crystal and coalescence theories; clouds and precipitation; snow and sleet; rainy day; diurnal and seasonal variation; cloud seeding', 'Classification of rainfall; warm clouds and cold clouds; cloud burst; flash floods'),
      (12, 'Ice Accretion', 'Medium', 'Airframe icing; engine icing; temperature range for icing; effects of airframe and engine icing', 'Hoar frost; rime ice; glaze ice; opaque rime; carburettor icing; impact icing; freezing level; liquid water content'),
      (13, 'Thunderstorm', 'High', 'Thunderstorms; frontal storms; classification of storms; conditions favourable for formation; life cycle: cumulus, mature and dissipating stages; dust devil; radar detection', 'Updraughts and downdraughts; icing; gusts; turbulence; severe thunderstorms; movement of thunderstorms; light, moderate and severe thunderstorms; aviation hazards; wind shear; squall; hail; showers; lightning; noise; avoidance of thunderstorms; air pocket; microburst; sand and dust storms; tornado; nor''westers'),
      (14, 'Air Masses and Western Disturbances', 'Medium', 'Air masses; classification; temperature and humidity of air masses; fronts', 'Arctic, polar continental, polar maritime, tropical continental, tropical maritime and equatorial air masses; cold and warm fronts; occluded fronts; warm and cold occlusions; western disturbances; hazards'),
      (15, 'Jet Streams', NULL, 'Subtropical jet stream; tropical jet stream; Arctic jet stream; clear air turbulence (CAT)', 'CAT; jet stream; shear in jet streams'),
      (16, 'Clear Air Turbulence', 'Medium', 'Wind shear', NULL),
      (17, 'Mountain Waves', 'Low', 'Wind; lenticular clouds; rotor streaming; altimeter errors; seasonal variation', 'Hazards for flying in mountain waves'),
      (18, 'Tropical Systems', 'Medium', 'Inter-tropical convergence zone (ITCZ); cyclones; tropical storms; hurricanes; circulation; flying conditions; frequency of cyclones', 'Easterly waves; surges; shear lines; tropical cyclones; monsoon depressions; the eye'),
      (19, 'Climatology India', 'Medium', 'NE monsoon; SW monsoon; pre-monsoon; winter; visibility; low-level turbulence; upper and medium-level winds; synoptic charts; monsoon trough and its axis', 'Break monsoon; El Niño; post-monsoon; route winds'),
      (20, 'General Circulation', NULL, 'Hadley cell; trade winds; ITCZ; three-cell model; Ferrel cell', 'Horse latitudes; roaring forties; global pressure'),
      (21, 'Meteorological Services for Aviation', 'High', 'World Meteorological Organization; India Meteorological Department', 'METAR; SPECI; AIREP; PIREP; SIGMET; TAF; TREND; ROFOR; local and area forecasts; aerodrome warnings'),
      (22, 'Weather Radar and Met Satellites', 'Low', 'Radar; wavelength; Doppler; cloud echoes; hooks and appendages', 'INSAT-2E'),
      (23, 'Met Instruments', 'Medium', 'Barometer; barograph; thermometer; hygrometer; hygrograph; rain gauge; wind vane; anemometer', 'Ceilometer; ceiling balloon; transmissometer; theodolite; RAWIN; radiosonde; satellites'),
      (24, 'Station Models', 'Medium', 'Meaning of symbols', NULL),
      (25, 'Aviation Weather Reports and Codes', NULL, 'METAR; SPECI; TREND; CAVOK; cloud base; cloud layers; rain and drizzle', 'Few, scattered, broken and overcast; landing forecast'),
      (26, 'Aviation Weather Forecast', NULL, 'TAF; route forecast', 'SIGMET; meteorological charts')
  ) AS v(n, name, weight, topics, subtopics);

  SELECT count(*) INTO v_n FROM chapters WHERE book_id = v_book AND verified_at IS NOT NULL;
  IF v_n <> 26 THEN
    RAISE EXCEPTION 'Expected 26 new chapters after insert, found %', v_n;
  END IF;

  -- ── Step 2: repoint questions and sessions ──────────────────────────────────
  DROP TABLE IF EXISTS _idmap;
  CREATE TEMP TABLE _idmap AS
    SELECT o.id AS old_id, n.id AS new_id
    FROM _old_ch o
    JOIN _map m     ON m.old_number = o.chapter_number
    JOIN chapters n ON n.book_id = v_book AND n.verified_at IS NOT NULL AND n.chapter_number = m.new_number;

  SELECT count(*) INTO v_n FROM _idmap;
  IF v_n <> 16 THEN
    RAISE EXCEPTION 'Old→new id mapping has % rows, expected 16', v_n;
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
      RAISE EXCEPTION '% row(s) in %.% still reference old IC Joshi chapters; nothing was changed', v_n, r.tbl, r.col;
    END IF;
  END LOOP;

  DELETE FROM chapters WHERE id IN (SELECT id FROM _old_ch);
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  IF v_deleted <> 16 THEN
    RAISE EXCEPTION 'Deleted % old chapter rows, expected 16', v_deleted;
  END IF;

  -- ── Step 4: edition ─────────────────────────────────────────────────────────
  UPDATE source_books SET edition = '2019' WHERE id = v_book;

  -- ── After counts ────────────────────────────────────────────────────────────
  SELECT count(*) INTO v_q_after FROM questions
  WHERE chapter_id IN (SELECT id FROM chapters WHERE book_id = v_book) AND active;
  IF v_q_after <> v_q_before THEN
    RAISE EXCEPTION 'Active IC Joshi question count changed from % to %', v_q_before, v_q_after;
  END IF;

  INSERT INTO _ic_joshi_report (section, chapter_number, chapter_name, n)
  SELECT 'AFTER: active questions per new chapter', c.chapter_number, c.chapter_name, count(q.id)
  FROM chapters c LEFT JOIN questions q ON q.chapter_id = c.id AND q.active
  WHERE c.book_id = v_book
  GROUP BY c.chapter_number, c.chapter_name ORDER BY c.chapter_number;

  INSERT INTO _ic_joshi_report (section, n) VALUES
    ('AFTER: total active questions',         v_q_after),
    ('Questions repointed (incl. inactive)',  v_q_moved),
    ('Sessions repointed',                    v_s_moved),
    ('Old chapter rows deleted',              v_deleted);
END $$;

SELECT section, chapter_number, chapter_name, n FROM _ic_joshi_report ORDER BY seq;

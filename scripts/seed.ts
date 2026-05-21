import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const subjects = [
  { name: 'Aviation Medicine', code: 'MED', icon_name: 'stethoscope', sort_order: 1, active: true, description: 'Human factors, physiology, and aeromedical principles' },
  { name: 'Meteorology',       code: 'MET', icon_name: 'wind',        sort_order: 2, active: true, description: 'Weather systems, forecasting, and aviation weather products' },
  { name: 'Navigation',        code: 'NAV', icon_name: 'route',       sort_order: 3, active: true, description: 'Air navigation, charts, radio aids, and GPS systems' },
  { name: 'Instruments',       code: 'INS', icon_name: 'gauge',       sort_order: 4, active: true, description: 'Flight instruments, pitot-static and gyroscopic systems' },
  { name: 'Aero Engines',      code: 'ENG', icon_name: 'engine',      sort_order: 5, active: true, description: 'Piston and jet engine theory, fuel systems, and powerplant instruments' },
  { name: 'Airframes',         code: 'AFR', icon_name: 'building',    sort_order: 6, active: true, description: 'Aircraft structures, hydraulics, landing gear, and pressurisation' },
  { name: 'Avionics',          code: 'AVI', icon_name: 'antenna',     sort_order: 7, active: true, description: 'Radio communications, navigation aids, transponders, and FMS' },
  { name: 'Air Regulations',   code: 'REG', icon_name: 'gavel',       sort_order: 8, active: true, description: 'ICAO standards, DGCA CARs, flight rules, and licensing' },
]

const topicsByCode: Record<string, string[]> = {
  NAV: ['Dead reckoning', 'Wind triangle', 'VOR/NDB', 'DME', 'ILS', 'GPS/GNSS', 'Celestial navigation', 'Charts and projections', 'Time zones', 'Great circle and rhumb line'],
  MET: ['Atmosphere structure', 'Pressure systems', 'Winds', 'Clouds and precipitation', 'Thunderstorms', 'Icing', 'METAR/TAF decode', 'SIGMET', 'Fronts', 'ITCZ'],
  INS: ['Pitot-static system', 'Altimeter', 'ASI', 'VSI', 'Gyroscopic instruments', 'Magnetic compass', 'EFIS', 'TCAS'],
  ENG: ['Piston engine fundamentals', 'Carburation', 'Fuel systems', 'Turbochargers', 'Jet engine fundamentals', 'Engine instruments'],
  AFR: ['Aircraft structures', 'Control surfaces', 'Hydraulic systems', 'Landing gear', 'Pressurisation', 'Ice protection'],
  AVI: ['VHF communications', 'HF communications', 'Transponder/SSR', 'ADF', 'VOR', 'ILS/MLS', 'FMS', 'ELT'],
  REG: ['ICAO annexes', 'DGCA CAR series', 'Flight rules (VFR/IFR)', 'ATC procedures', 'Licensing requirements', 'Airspace classification'],
  MED: ['Hypoxia', 'Hyperventilation', 'Spatial disorientation', 'Vision', 'Hearing', 'G-forces', 'Fatigue', 'Psychology of flight'],
}

const sourceBooksByCode: Record<string, { title: string; author: string }[]> = {
  NAV: [{ title: 'Air Navigation', author: 'Bali' }],
  MET: [{ title: 'Aviation Meteorology', author: 'I.C. Joshi' }],
  INS: [{ title: 'Aircraft Instruments', author: 'E.H.J. Pallett' }],
  ENG: [{ title: 'Aircraft Piston Engines', author: 'Delmar' }],
  AFR: [{ title: 'Aircraft Structures for Engineering Students', author: 'Megson' }],
  AVI: [{ title: 'Avionics Navigation Systems', author: 'Kayton & Fried' }],
  REG: [{ title: 'DGCA Civil Aviation Requirements', author: 'DGCA' }],
  MED: [{ title: 'Aviation Medicine', author: 'Ernsting' }],
}

const sampleQuestions: Record<string, {
  question_text: string
  difficulty: 'easy' | 'medium' | 'hard'
  explanation: string
  options: { A: string; B: string; C: string; D: string }
  correct: 'A' | 'B' | 'C' | 'D'
}[]> = {
  MED: [
    {
      question_text: 'Hypoxia is defined as a state in which:',
      difficulty: 'easy',
      explanation: 'Hypoxia literally means "below normal oxygen" — it is a deficiency of oxygen reaching the body\'s tissues, regardless of the cause.',
      options: { A: 'The blood contains excessive carbon dioxide', B: 'The tissues receive insufficient oxygen', C: 'Breathing rate is abnormally elevated', D: 'Nitrogen narcosis affects the brain' },
      correct: 'B',
    },
    {
      question_text: 'The time of useful consciousness (TUC) at 35,000 ft without supplemental oxygen is approximately:',
      difficulty: 'easy',
      explanation: 'At 35,000 ft the TUC is approximately 30–60 seconds, requiring immediate use of oxygen equipment.',
      options: { A: '3–5 minutes', B: '10–15 minutes', C: '30–60 seconds', D: '5–8 minutes' },
      correct: 'C',
    },
    {
      question_text: 'Hyperventilation results in:',
      difficulty: 'medium',
      explanation: 'Hyperventilation causes excessive CO2 to be exhaled, leading to hypocapnia and respiratory alkalosis, which causes dizziness and tingling.',
      options: { A: 'Increased CO2 in the blood', B: 'Decreased O2 in the blood', C: 'Decreased CO2 in the blood (hypocapnia)', D: 'Increased nitrogen in the tissues' },
      correct: 'C',
    },
    {
      question_text: 'Which of the following best describes "the leans" in spatial disorientation?',
      difficulty: 'medium',
      explanation: '"The leans" occurs when a slow roll goes undetected, and upon correction the pilot feels tilted even though the aircraft is wings-level, due to semicircular canal adaptation.',
      options: {
        A: 'A vestibular illusion where the pilot senses a bank that does not exist',
        B: 'Excessive cockpit workload causing lean posture',
        C: 'A slow undetected roll followed by a sensation of banking after recovery',
        D: 'Coriolis illusion caused by rapid head movement'
      },
      correct: 'C',
    },
    {
      question_text: 'The critical flicker fusion frequency (CFFF) is most affected by:',
      difficulty: 'hard',
      explanation: 'CFFF — the rate at which a flickering light appears continuous — decreases with hypoxia, fatigue, and CNS depressants, making it a sensitive measure of pilot alertness.',
      options: {
        A: 'Ambient noise levels in the cockpit',
        B: 'Hypoxia, fatigue, and alcohol, all of which reduce CFFF',
        C: 'Peripheral vision acuity only',
        D: 'High ambient light levels which increase CFFF proportionally'
      },
      correct: 'B',
    },
  ],
  MET: [
    {
      question_text: 'The standard lapse rate of temperature in the troposphere is approximately:',
      difficulty: 'easy',
      explanation: 'The International Standard Atmosphere (ISA) defines a lapse rate of 2°C per 1,000 ft (or 6.5°C per 1,000 m) in the troposphere.',
      options: { A: '1°C per 1,000 ft', B: '2°C per 1,000 ft', C: '3°C per 1,000 ft', D: '4°C per 1,000 ft' },
      correct: 'B',
    },
    {
      question_text: 'A METAR observation of "TS" indicates:',
      difficulty: 'easy',
      explanation: 'In a METAR, "TS" is the present weather code for thunderstorm.',
      options: { A: 'Turbulent conditions only', B: 'Thunderstorm', C: 'Transient shower', D: 'Towering cumulus' },
      correct: 'B',
    },
    {
      question_text: 'In the Northern Hemisphere, wind flows around a low pressure system:',
      difficulty: 'medium',
      explanation: 'Coriolis force deflects air to the right in the Northern Hemisphere, resulting in counter-clockwise (cyclonic) flow around a low.',
      options: { A: 'Clockwise and outward', B: 'Clockwise and inward', C: 'Counter-clockwise and inward', D: 'Counter-clockwise and outward' },
      correct: 'C',
    },
    {
      question_text: 'Structural icing is most likely to occur in which cloud type?',
      difficulty: 'medium',
      explanation: 'Cumulonimbus clouds contain large supercooled water droplets and strong updrafts, making them the most hazardous for airframe icing.',
      options: { A: 'Cirrus', B: 'Cumulonimbus', C: 'Altostratus', D: 'Stratocumulus' },
      correct: 'B',
    },
    {
      question_text: 'Mountain wave turbulence is most intense:',
      difficulty: 'hard',
      explanation: 'Mountain wave turbulence is most severe at the wave crests, especially below the level of the tropopause, and can extend to altitudes well above the mountain top.',
      options: {
        A: 'On the windward side at mountain level',
        B: 'In the rotor zone beneath the wave crests on the leeward side',
        C: 'Directly over the mountain peaks',
        D: 'At altitudes above the tropopause only'
      },
      correct: 'B',
    },
  ],
  NAV: [
    {
      question_text: 'Magnetic variation is the angle between:',
      difficulty: 'easy',
      explanation: 'Magnetic variation (or declination) is the angular difference between true north and magnetic north at a given location.',
      options: {
        A: 'True north and compass north due to deviation',
        B: 'True north and magnetic north',
        C: 'Magnetic north and compass north',
        D: 'Heading and track'
      },
      correct: 'B',
    },
    {
      question_text: 'A VOR radial is defined as a:',
      difficulty: 'easy',
      explanation: 'A VOR radial is a specific magnetic bearing FROM the VOR station. Aircraft track TO or FROM radials.',
      options: {
        A: 'Magnetic bearing from the aircraft to the VOR',
        B: 'Magnetic bearing from the VOR to the aircraft',
        C: 'True bearing from the VOR to the aircraft',
        D: 'Relative bearing to the VOR'
      },
      correct: 'B',
    },
    {
      question_text: 'The angle of dip is maximum at the:',
      difficulty: 'medium',
      explanation: 'Magnetic dip (or inclination) is maximum (90°) at the magnetic poles where the magnetic field is vertical.',
      options: { A: 'Magnetic equator', B: 'Geographic equator', C: 'Magnetic poles', D: 'Tropic of Cancer' },
      correct: 'C',
    },
    {
      question_text: 'On a Lambert Conformal Conic chart, great circle routes appear as:',
      difficulty: 'medium',
      explanation: 'On a Lambert chart, great circle routes appear as nearly straight lines (slight concavity toward the pole), making it ideal for long-range navigation.',
      options: {
        A: 'Perfect straight lines only along the standard parallels',
        B: 'Curved lines concave toward the equator',
        C: 'Approximately straight lines (very slight concavity toward the nearest pole)',
        D: 'Rhumb lines only'
      },
      correct: 'C',
    },
    {
      question_text: 'An aircraft tracks 090°M at 120 kt TAS. Wind is 360°/30 kt. The drift angle is approximately:',
      difficulty: 'hard',
      explanation: 'With wind from the north and aircraft heading east, the wind is from the left (port). Drift = arcsin(30/120) ≈ 14° to the right (starboard). Heading must be corrected left.',
      options: { A: '14° right (starboard)', B: '14° left (port)', C: '30°', D: '7°' },
      correct: 'B',
    },
  ],
  INS: [
    {
      question_text: 'The altimeter measures:',
      difficulty: 'easy',
      explanation: 'The altimeter is an aneroid barometer that measures static pressure and converts it to altitude using the ISA model.',
      options: { A: 'Dynamic pressure', B: 'Differential pressure between static and pitot', C: 'Absolute static pressure', D: 'Temperature-corrected density altitude' },
      correct: 'C',
    },
    {
      question_text: 'An ASI reads lower than actual speed when:',
      difficulty: 'easy',
      explanation: 'A blocked static source causes the ASI to read lower on ascent (trapped lower pressure) and higher on descent, depending on blockage type.',
      options: { A: 'The pitot tube is blocked', B: 'The static vent is blocked and the aircraft is descending', C: 'The aircraft is climbing with a blocked static vent', D: 'Temperature is above ISA standard' },
      correct: 'C',
    },
    {
      question_text: 'Gyroscopic precession causes a force to appear:',
      difficulty: 'medium',
      explanation: 'Gyroscopic precession: a force applied to a spinning gyro appears 90° ahead in the direction of rotation.',
      options: {
        A: 'Opposite to the applied force',
        B: '90° ahead of the applied force in the direction of rotation',
        C: '180° from the applied force',
        D: '45° behind the applied force'
      },
      correct: 'B',
    },
    {
      question_text: 'The turning error of a magnetic compass is greatest when turning through:',
      difficulty: 'medium',
      explanation: 'Turning error is maximum when passing through north or south headings due to the dip component of the magnetic field.',
      options: { A: 'East or West', B: 'North or South', C: '045° and 225°', D: 'Northeast and Southwest' },
      correct: 'B',
    },
    {
      question_text: 'A TCAS resolution advisory (RA) instructs the crew to:',
      difficulty: 'hard',
      explanation: 'An RA provides vertical guidance (climb/descend) to resolve a conflict. TAs only alert; RAs command action. Crew must follow RA commands immediately and inform ATC.',
      options: {
        A: 'Alert the crew of nearby traffic with no guidance',
        B: 'Manoeuvre immediately in the direction instructed and notify ATC',
        C: 'Contact ATC for a resolution vector',
        D: 'Descend immediately below the threat aircraft'
      },
      correct: 'B',
    },
  ],
  ENG: [
    {
      question_text: 'The Otto cycle describes the thermodynamic process in a:',
      difficulty: 'easy',
      explanation: 'The Otto cycle (constant-volume combustion) describes the theoretical operation of the spark-ignition (gasoline/AVGAS) piston engine.',
      options: { A: 'Turbofan engine', B: 'Diesel engine', C: 'Spark-ignition piston engine', D: 'Turboprop engine' },
      correct: 'C',
    },
    {
      question_text: 'Detonation in a piston engine is caused by:',
      difficulty: 'easy',
      explanation: 'Detonation (knocking) occurs when the air-fuel mixture ignites spontaneously and uncontrolled due to excessive heat, causing rapid pressure rise that can damage pistons.',
      options: {
        A: 'Too rich a mixture at high altitude',
        B: 'Spontaneous ignition of the unburnt mixture ahead of the flame front',
        C: 'Retarded ignition timing',
        D: 'Excessively rich mixture at sea level'
      },
      correct: 'B',
    },
    {
      question_text: 'Moving the mixture control to \'lean\' reduces:',
      difficulty: 'medium',
      explanation: 'Leaning reduces fuel flow to the engine by reducing the fuel-to-air ratio, improving fuel efficiency at altitude where air density is lower.',
      options: {
        A: 'Air flow into the carburettor',
        B: 'Fuel flow to achieve a better fuel-to-air ratio',
        C: 'Both fuel and air flow equally',
        D: 'Ignition timing advance'
      },
      correct: 'B',
    },
    {
      question_text: 'Carburettor ice is most likely to form at OAT between:',
      difficulty: 'medium',
      explanation: 'Carburettor icing can occur in temperatures between -10°C and +30°C with moderate to high humidity due to the venturi effect dropping temperature by 20–30°C inside the carb.',
      options: { A: '-30°C and -10°C', B: '-10°C and +30°C', C: '+30°C and +45°C', D: '-50°C and -30°C' },
      correct: 'B',
    },
    {
      question_text: 'The purpose of a turbocharger\'s wastegate is to:',
      difficulty: 'hard',
      explanation: 'The wastegate is a valve that bypasses exhaust gas around the turbine, controlling turbine speed and thus the boost pressure delivered by the compressor.',
      options: {
        A: 'Allow excess air to bypass the compressor at high altitudes',
        B: 'Control the turbine speed by diverting exhaust gas away from the turbine',
        C: 'Dump compressed air to prevent over-boosting at low altitudes',
        D: 'Regulate fuel flow to the turbine injector'
      },
      correct: 'B',
    },
  ],
  AFR: [
    {
      question_text: 'The primary purpose of an aircraft\'s semi-monocoque structure is to:',
      difficulty: 'easy',
      explanation: 'Semi-monocoque structure uses both the skin and internal frames/stringers to carry loads, combining lightweight design with structural strength.',
      options: {
        A: 'Reduce aerodynamic drag only',
        B: 'Carry structural loads through a combination of skin and internal framework',
        C: 'Provide a pressurised fuselage automatically',
        D: 'Allow for easier maintenance access'
      },
      correct: 'B',
    },
    {
      question_text: 'Ailerons are primarily used to control:',
      difficulty: 'easy',
      explanation: 'Ailerons control roll (bank angle) around the longitudinal axis of the aircraft.',
      options: { A: 'Pitch', B: 'Yaw', C: 'Roll', D: 'Pitch and yaw simultaneously' },
      correct: 'C',
    },
    {
      question_text: 'A hydraulic accumulator in an aircraft system is used to:',
      difficulty: 'medium',
      explanation: 'A hydraulic accumulator stores pressurised fluid to supply the system during peak demand or if the main pump fails temporarily.',
      options: {
        A: 'Filter hydraulic fluid of contaminants',
        B: 'Store pressurised fluid for emergency use and absorb pressure surges',
        C: 'Convert hydraulic pressure to electrical power',
        D: 'Regulate constant pressure to actuators'
      },
      correct: 'B',
    },
    {
      question_text: 'Differential ailerons are designed to:',
      difficulty: 'medium',
      explanation: 'Differential aileron deflection (one aileron travels up more than the other travels down) reduces adverse yaw by minimising the induced drag difference between the two wings.',
      options: {
        A: 'Increase roll rate by deflecting both ailerons downward',
        B: 'Reduce adverse yaw by moving the up-going aileron through a greater angle',
        C: 'Provide automatic trim in level flight',
        D: 'Increase aileron authority at high speed'
      },
      correct: 'B',
    },
    {
      question_text: 'The cabin differential pressure in a pressurised aircraft is the difference between:',
      difficulty: 'hard',
      explanation: 'Differential pressure is the difference between cabin pressure and ambient outside pressure. This drives structural design loads on the fuselage.',
      options: {
        A: 'Sea-level pressure and current altitude pressure outside',
        B: 'Cockpit pressure and cabin pressure',
        C: 'Cabin internal pressure and ambient external pressure at current altitude',
        D: 'Regulated bleed air pressure and static port pressure'
      },
      correct: 'C',
    },
  ],
  AVI: [
    {
      question_text: 'VHF communications in aviation use the frequency range:',
      difficulty: 'easy',
      explanation: 'Aviation VHF comms occupy 118.000–136.975 MHz (30 kHz channel spacing). VHF stands for Very High Frequency.',
      options: { A: '30–300 kHz', B: '3–30 MHz', C: '118–136.975 MHz', D: '406–960 MHz' },
      correct: 'C',
    },
    {
      question_text: 'Mode C transponder replies include:',
      difficulty: 'easy',
      explanation: 'Mode C transmits the aircraft\'s pressure altitude in addition to the squawk code, allowing ATC to see both identity and altitude.',
      options: { A: 'Identity (squawk) only', B: 'Identity and pressure altitude', C: 'Identity, pressure altitude, and GPS position', D: 'ADS-B data only' },
      correct: 'B',
    },
    {
      question_text: 'The ILS glideslope frequency is paired with the localiser frequency and operates in:',
      difficulty: 'medium',
      explanation: 'The ILS glideslope transmits in the UHF band (329.15–335 MHz) and is automatically paired with its associated localiser VHF frequency.',
      options: { A: 'VHF band 108–118 MHz', B: 'UHF band 329.15–335 MHz', C: 'HF band 2–30 MHz', D: 'SHF band 5.0–5.25 GHz' },
      correct: 'B',
    },
    {
      question_text: 'An FMS CDU shows "UNABLE RNP" — this means:',
      difficulty: 'medium',
      explanation: '"UNABLE RNP" indicates that the navigation system cannot meet the Required Navigation Performance accuracy standard for the current route segment.',
      options: {
        A: 'The FMS has lost all GPS signals',
        B: 'The navigation system cannot guarantee the required accuracy for the current phase',
        C: 'A route discontinuity has been detected',
        D: 'The radio altimeter is inoperative'
      },
      correct: 'B',
    },
    {
      question_text: 'HF radio is preferred over VHF for long-range oceanic communication because:',
      difficulty: 'hard',
      explanation: 'HF waves (2–30 MHz) reflect off the ionosphere, allowing communication over thousands of kilometres. VHF is line-of-sight only and limited to about 200 nm at cruise altitude.',
      options: {
        A: 'HF has a shorter wavelength and greater bandwidth',
        B: 'HF waves reflect off the ionosphere enabling beyond-line-of-sight propagation',
        C: 'HF is immune to atmospheric interference',
        D: 'HF requires no ground infrastructure at remote locations'
      },
      correct: 'B',
    },
  ],
  REG: [
    {
      question_text: 'ICAO Annex 2 covers:',
      difficulty: 'easy',
      explanation: 'ICAO Annex 2 contains the Rules of the Air — the international standards and recommended practices for VFR and IFR flight.',
      options: { A: 'Personnel licensing', B: 'Rules of the Air', C: 'Aerodromes', D: 'Air traffic services' },
      correct: 'B',
    },
    {
      question_text: 'Under DGCA regulations, the minimum visibility for VFR flight in Class G airspace below 3,000 ft AMSL is:',
      difficulty: 'easy',
      explanation: 'In Class G airspace at and below 3,000 ft AMSL (or 1,000 ft AGL, whichever is higher), DGCA requires a minimum flight visibility of 5 km for VFR.',
      options: { A: '1.5 km', B: '3 km', C: '5 km', D: '8 km' },
      correct: 'C',
    },
    {
      question_text: 'An aircraft operating IFR must maintain a minimum altitude of ___ above the highest obstacle within ___ nm of track:',
      difficulty: 'medium',
      explanation: 'ICAO IFR minimum obstacle clearance altitude (MOCA) requires 1,000 ft (300 m) above the highest obstacle within 5 nm in non-mountainous terrain.',
      options: { A: '500 ft within 5 nm', B: '1,000 ft within 5 nm', C: '2,000 ft within 10 nm', D: '1,500 ft within 8 nm' },
      correct: 'B',
    },
    {
      question_text: 'A Class B airspace requires:',
      difficulty: 'medium',
      explanation: 'Class B airspace (typically around busy terminal areas) requires an ATC clearance, a transponder with Mode C (or ADS-B Out), and two-way communication.',
      options: {
        A: 'Two-way radio contact only',
        B: 'ATC clearance, Mode C/ADS-B transponder, and two-way communication',
        C: 'A flight plan filed at least 1 hour prior',
        D: 'VFR flight only'
      },
      correct: 'B',
    },
    {
      question_text: 'Under ICAO, an ATPL holder flying as P1 on a multi-crew aircraft has their privileges restricted if they have not performed, within the preceding 90 days, at least:',
      difficulty: 'hard',
      explanation: 'ICAO Annex 1 requires 3 take-offs and 3 landings as pilot flying within 90 days to maintain recency for acting as pilot-in-command.',
      options: {
        A: '3 take-offs and 3 landings as pilot flying',
        B: '5 take-offs and 5 landings in any capacity',
        C: '1 instrument approach as pilot flying',
        D: '10 hours as P1 in the aircraft type'
      },
      correct: 'A',
    },
  ],
}

async function seed() {
  console.log('Seeding subjects…')
  const { data: insertedSubjects, error: subErr } = await supabase
    .from('subjects')
    .upsert(subjects, { onConflict: 'code' })
    .select()

  if (subErr) { console.error('Subjects error:', subErr); return }
  console.log(`  ✓ ${insertedSubjects?.length} subjects`)

  const subjectMap: Record<string, string> = {}
  insertedSubjects?.forEach(s => { subjectMap[s.code] = s.id })

  console.log('Seeding topics…')
  let topicCount = 0
  const topicMap: Record<string, Record<string, string>> = {}

  for (const [code, topicNames] of Object.entries(topicsByCode)) {
    const subId = subjectMap[code]
    if (!subId) continue
    const rows = topicNames.map((name, i) => ({ subject_id: subId, name, sort_order: i + 1 }))
    const { data: tops, error: topErr } = await supabase.from('topics').upsert(rows, { onConflict: 'subject_id,name' }).select()
    if (topErr) { console.error(`Topics error (${code}):`, topErr); continue }
    topicCount += tops?.length || 0
    topicMap[code] = {}
    tops?.forEach(t => { topicMap[code][t.name] = t.id })
  }
  console.log(`  ✓ ${topicCount} topics`)

  console.log('Seeding source books…')
  let bookCount = 0
  for (const [code, books] of Object.entries(sourceBooksByCode)) {
    const subId = subjectMap[code]
    if (!subId) continue
    const rows = books.map(b => ({ subject_id: subId, title: b.title, author: b.author }))
    const { data: booksData } = await supabase.from('source_books').upsert(rows, { onConflict: 'subject_id,title' }).select()
    bookCount += booksData?.length || 0
  }
  console.log(`  ✓ ${bookCount} source books`)

  console.log('Seeding sample questions…')
  let questionCount = 0

  for (const [code, qs] of Object.entries(sampleQuestions)) {
    const subId = subjectMap[code]
    if (!subId) continue

    for (const q of qs) {
      const { data: newQ, error: qErr } = await supabase
        .from('questions')
        .insert({
          subject_id: subId,
          topic_id: null,
          question_text: q.question_text,
          difficulty: q.difficulty,
          explanation: q.explanation,
          source_type: 'manual',
          active: true,
        })
        .select('id')
        .single()

      if (qErr) { console.error(`Question error (${code}):`, qErr); continue }

      const optRows = (['A', 'B', 'C', 'D'] as const).map(letter => ({
        question_id: newQ!.id,
        option_letter: letter,
        option_text: q.options[letter],
        is_correct: letter === q.correct,
      }))
      await supabase.from('question_options').insert(optRows)
      questionCount++
    }
  }
  console.log(`  ✓ ${questionCount} questions with options`)
  console.log('\nSeed complete.')
}

seed().catch(console.error)

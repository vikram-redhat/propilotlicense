/**
 * Seeds the chapters table from existing source_books.
 * Run once after the chapters table has been created in Supabase.
 * Safe to re-run — uses upsert with ignoreDuplicates.
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

type ChapterEntry = { number: number; name: string }
const chaptersData: Record<string, ChapterEntry[]> = {
  'Aviation Meteorology||IC Joshi': [
    { number:1, name:'The Atmosphere' }, { number:2, name:'Temperature' }, { number:3, name:'Atmospheric Pressure' },
    { number:4, name:'Winds' }, { number:5, name:'Humidity and Moisture' }, { number:6, name:'Clouds' },
    { number:7, name:'Precipitation' }, { number:8, name:'Visibility and Fog' }, { number:9, name:'Air Masses' },
    { number:10, name:'Fronts' }, { number:11, name:'Thunderstorms' }, { number:12, name:'Icing' },
    { number:13, name:'Turbulence' }, { number:14, name:'Wind Shear' },
    { number:15, name:'Aviation Weather Reports and METAR' }, { number:16, name:'Weather Forecasting and TAF' },
  ],
  'Ground Studies for Pilots – Meteorology||Underdown & Standen': [
    { number:1, name:'The Atmosphere' }, { number:2, name:'Temperature and Stability' },
    { number:3, name:'Pressure and Altimetry' }, { number:4, name:'Winds and Circulation' },
    { number:5, name:'Humidity, Cloud and Fog' }, { number:6, name:'Precipitation and Visibility' },
    { number:7, name:'Air Masses and Frontal Systems' }, { number:8, name:'Thunderstorms and Severe Weather' },
    { number:9, name:'Icing Conditions' }, { number:10, name:'Turbulence' },
    { number:11, name:'Aviation Weather Services and METAR/TAF' },
  ],
  'Meteorology||Nordian': [
    { number:1, name:'The Atmosphere and its Properties' }, { number:2, name:'Temperature' },
    { number:3, name:'Atmospheric Pressure' }, { number:4, name:'Wind Systems' },
    { number:5, name:'Moisture and Precipitation' }, { number:6, name:'Cloud Formation' },
    { number:7, name:'Fog and Visibility' }, { number:8, name:'Air Masses and Fronts' },
    { number:9, name:'Thunderstorms' }, { number:10, name:'Icing and Turbulence' },
    { number:11, name:'Weather Forecasting and METAR/TAF' },
  ],
  'Meteorology||Oxford': [
    { number:1, name:'The Atmosphere' }, { number:2, name:'Temperature' }, { number:3, name:'Pressure and Altimetry' },
    { number:4, name:'Wind' }, { number:5, name:'Moisture in the Atmosphere' }, { number:6, name:'Clouds and Precipitation' },
    { number:7, name:'Thunderstorms' }, { number:8, name:'Icing' }, { number:9, name:'Turbulence and Wind Shear' },
    { number:10, name:'Air Masses and Fronts' }, { number:11, name:'Aviation Weather Reports and Services' },
  ],
  'Meteorology for Pilot||Mike Wickson': [
    { number:1, name:'Introduction to the Atmosphere' }, { number:2, name:'Temperature and Lapse Rates' },
    { number:3, name:'Pressure and Altimetry' }, { number:4, name:'Wind' },
    { number:5, name:'Clouds and Precipitation' }, { number:6, name:'Thunderstorms' },
    { number:7, name:'Icing' }, { number:8, name:'Turbulence' }, { number:9, name:'Visibility and Fog' },
    { number:10, name:'Aviation Meteorological Services' },
  ],
  'Aviation Law and Meteorology||Trevor Thom': [
    { number:1, name:'Introduction to Meteorology' }, { number:2, name:'The Atmosphere' },
    { number:3, name:'Clouds and Precipitation' }, { number:4, name:'Fronts and Air Masses' },
    { number:5, name:'Thunderstorms and Icing' }, { number:6, name:'Aviation Weather Services' },
  ],
  'Air Law||Oxford': [
    { number:1, name:'International Organisations and ICAO' }, { number:2, name:'ICAO Annexes – Overview' },
    { number:3, name:'Personnel Licensing – Annex 1' }, { number:4, name:'Rules of the Air – Annex 2' },
    { number:5, name:'Operation of Aircraft – Annex 6' }, { number:6, name:'Aircraft Nationality and Registration – Annex 7' },
    { number:7, name:'Airworthiness – Annex 8' }, { number:8, name:'Air Traffic Services – Annex 11' },
    { number:9, name:'Search and Rescue – Annex 12' }, { number:10, name:'Accident Investigation – Annex 13' },
    { number:11, name:'Aerodromes – Annex 14' }, { number:12, name:'National Regulations and Airspace' },
    { number:13, name:'ATC Procedures' }, { number:14, name:'Procedures for Air Navigation' },
  ],
  'Air Regulations||RK Bali': [
    { number:1, name:'Introduction and ICAO' }, { number:2, name:'ICAO Annexes' },
    { number:3, name:'Aircraft Act 1934' }, { number:4, name:'Aircraft Rules 1937 and Amendments' },
    { number:5, name:'DGCA – Organisation and Functions' }, { number:6, name:'Civil Aviation Requirements (CARs)' },
    { number:7, name:'Personnel Licensing' }, { number:8, name:'Rules of the Air' },
    { number:9, name:'Air Traffic Services' }, { number:10, name:'Aerodromes and Facilities' },
    { number:11, name:'Search and Rescue' }, { number:12, name:'Accident and Incident Investigation' },
    { number:13, name:'Human Performance and Limitations' }, { number:14, name:'AIP India' },
  ],
  'Air Law and ATC Procedures||Nordian': [
    { number:1, name:'Introduction to Aviation Law' }, { number:2, name:'ICAO Structure and Annexes' },
    { number:3, name:'Personnel Licensing' }, { number:4, name:'Rules of the Air – VFR' },
    { number:5, name:'Rules of the Air – IFR' }, { number:6, name:'Airspace Classification' },
    { number:7, name:'ATC Procedures – General' }, { number:8, name:'Clearances and Instructions' },
    { number:9, name:'Separation Standards' }, { number:10, name:'Communication Procedures and Failures' },
    { number:11, name:'Emergency Procedures' },
  ],
  'Air Regulations for Pilots||V Krishnan & AK Chopra': [
    { number:1, name:'ICAO – Organisation and Structure' }, { number:2, name:'ICAO Annexes and Standards' },
    { number:3, name:'Aircraft Act 1934' }, { number:4, name:'Aircraft Rules' },
    { number:5, name:'DGCA Regulations' }, { number:6, name:'CARs – Operations' },
    { number:7, name:'Licensing Requirements' }, { number:8, name:'Flight Rules' },
    { number:9, name:'ATC Procedures' }, { number:10, name:'Accident Reporting and Investigation' },
  ],
  'Aircraft Act 1934||India': [
    { number:1, name:'Part I – Preliminary' }, { number:2, name:'Part II – Registration of Aircraft' },
    { number:3, name:'Part III – Airworthiness' }, { number:4, name:'Part IV – Licensing of Personnel' },
    { number:5, name:'Part V – Regulation of Air Transport' }, { number:6, name:'Part VI – Control of Air Navigation' },
    { number:7, name:'Part VII – Investigation of Accidents' }, { number:8, name:'Part VIII – Penalties and Miscellaneous' },
  ],
  'Aircraft Rules 1920, 1937, 1954 & 2003||India': [
    { number:1, name:'Section 1 – General and Registration' }, { number:2, name:'Section 2 – Airworthiness Requirements' },
    { number:3, name:'Section 3 – Personnel Licensing' }, { number:4, name:'Section 4 – Operations and Air Traffic' },
    { number:5, name:'Section 5 – Carriage of Goods' }, { number:6, name:'Section 6 – Aerodromes' },
    { number:7, name:'Section 7 – Enforcement' },
  ],
  'DGCA Civil Aviation Requirements (CAR)||DGCA': [
    { number:1, name:'Series A – Airworthiness' }, { number:2, name:'Series B – Aerodromes' },
    { number:3, name:'Series C – Personnel Licensing' }, { number:4, name:'Series D – Operations' },
    { number:5, name:'Series E – Air Traffic Services' }, { number:6, name:'Series X – Miscellaneous' },
  ],
  'Human Performance & Limitations||Nordian': [
    { number:1, name:'Human Factors in Aviation' }, { number:2, name:'Basic Aviation Physiology' },
    { number:3, name:'Hypoxia and Hyperventilation' }, { number:4, name:'Vision' },
    { number:5, name:'Hearing and Spatial Disorientation' }, { number:6, name:'Acceleration and G-Forces' },
    { number:7, name:'Fatigue and Sleep' }, { number:8, name:'Stress and Workload' },
    { number:9, name:'Human Error and CRM' }, { number:10, name:'Psychology of Flying' },
  ],
  'Human Performance & Limitations||Oxford': [
    { number:1, name:'Introduction to Human Factors' }, { number:2, name:'Aviation Physiology' },
    { number:3, name:'Sensory Perception' }, { number:4, name:'Spatial Disorientation' },
    { number:5, name:'Fatigue' }, { number:6, name:'Stress and Anxiety' },
    { number:7, name:'Human Error' }, { number:8, name:'Crew Resource Management' },
  ],
  'ICAO Annexes||ICAO': [
    { number:1, name:'Annex 1 – Personnel Licensing' }, { number:2, name:'Annex 2 – Rules of the Air' },
    { number:3, name:'Annex 3 – Meteorological Services' }, { number:4, name:'Annex 4 – Aeronautical Charts' },
    { number:5, name:'Annex 6 – Operation of Aircraft' }, { number:6, name:'Annex 8 – Airworthiness' },
    { number:7, name:'Annex 11 – Air Traffic Services' }, { number:8, name:'Annex 12 – Search and Rescue' },
    { number:9, name:'Annex 13 – Accident Investigation' }, { number:10, name:'Annex 14 – Aerodromes' },
    { number:11, name:'Annex 17 – Security' }, { number:12, name:'Annex 19 – Safety Management' },
  ],
  'ICAO Docs||ICAO': [
    { number:1, name:'Doc 4444 – PANS-ATM (ATC Procedures)' }, { number:2, name:'Doc 8168 – PANS-OPS (Flight Procedures)' },
    { number:3, name:'Doc 9432 – Manual of Radiotelephony' }, { number:4, name:'Doc 8400 – ICAO Abbreviations and Codes' },
    { number:5, name:'Doc 9574 – Manual on RVSM' },
  ],
  'AIP India||India': [
    { number:1, name:'GEN – General' }, { number:2, name:'ENR – En Route' }, { number:3, name:'AD – Aerodromes' },
  ],
  'Air Navigation||Trevor Thom': [
    { number:1, name:'The Earth and Positions' }, { number:2, name:'Direction and Bearing' },
    { number:3, name:'Distance, Speed and Time' }, { number:4, name:'Charts and Projections' },
    { number:5, name:'Dead Reckoning Navigation' }, { number:6, name:'The Triangle of Velocities' },
    { number:7, name:'In-Flight Navigation Techniques' }, { number:8, name:'The Magnetic Compass' },
    { number:9, name:'Radio Navigation Aids' }, { number:10, name:'Area Navigation and GPS' },
    { number:11, name:'Flight Planning' }, { number:12, name:'Mass, Balance and Performance' },
  ],
  'JAR ATPL & CPL General Navigation||Keith Williams': [
    { number:1, name:'The Earth and Positions' }, { number:2, name:'Latitude and Longitude' },
    { number:3, name:'Directions and Variation' }, { number:4, name:'Charts and Projections' },
    { number:5, name:'Dead Reckoning' }, { number:6, name:'Triangle of Velocities' },
    { number:7, name:'In-Flight Navigation' }, { number:8, name:'Radio Navigation' },
    { number:9, name:'Pressure Instruments in Navigation' }, { number:10, name:'Flight Planning' },
    { number:11, name:'Mass and Balance' }, { number:12, name:'Performance' },
  ],
  'Ground Studies for Pilots – Navigation||Underdown & Palmer': [
    { number:1, name:'The Earth' }, { number:2, name:'Maps and Charts' }, { number:3, name:'Dead Reckoning' },
    { number:4, name:'The Triangle of Velocities' }, { number:5, name:'The Magnetic Compass' },
    { number:6, name:'Radio Navigation Aids' }, { number:7, name:'Modern Navigation Systems' },
    { number:8, name:'Flight Planning' }, { number:9, name:'Mass, Balance and Loading' },
  ],
  'General Navigation – Navigation||Nordian': [
    { number:1, name:'The Earth and Positions' }, { number:2, name:'Directions and Variation' },
    { number:3, name:'Chart Projections' }, { number:4, name:'Dead Reckoning' },
    { number:5, name:'Wind and Drift' }, { number:6, name:'In-Flight Navigation' },
    { number:7, name:'Radio Navigation' }, { number:8, name:'Modern Systems – GPS and INS' },
    { number:9, name:'Flight Planning' },
  ],
  'Navigation for Pilot||JE Hitchcock': [
    { number:1, name:'Basics of Navigation' }, { number:2, name:'The Earth' },
    { number:3, name:'Charts and Projections' }, { number:4, name:'Dead Reckoning' },
    { number:5, name:'Wind Calculations' }, { number:6, name:'Radio Aids' }, { number:7, name:'Navigation Planning' },
  ],
  'Flight Performance & Planning 1||Oxford': [
    { number:1, name:'Performance Theory' }, { number:2, name:'Aerodrome Performance' },
    { number:3, name:'Take-off Performance' }, { number:4, name:'En Route Performance' },
    { number:5, name:'Landing Performance' }, { number:6, name:'Noise Abatement' },
  ],
  'Flight Performance & Planning 2 (FP & M)||Oxford': [
    { number:1, name:'Mass and Balance Theory' }, { number:2, name:'Loading Systems' },
    { number:3, name:'Centre of Gravity Calculations' }, { number:4, name:'Loading Schedules' },
    { number:5, name:'Flight Planning Basics' }, { number:6, name:'ICAO Flight Plans' },
  ],
  'Mass & Balance Flight Performance and Planning||Nordian': [
    { number:1, name:'Basic Principles of Mass and Balance' }, { number:2, name:'Weighing and Centre of Gravity' },
    { number:3, name:'Loading Schedules' }, { number:4, name:'Performance Calculations' }, { number:5, name:'Flight Planning' },
  ],
  'Radio Navigation and Instrument Flying||Trevor Thom': [
    { number:1, name:'Radio Principles' }, { number:2, name:'Automatic Direction Finding' },
    { number:3, name:'VOR Navigation' }, { number:4, name:'Distance Measuring Equipment' },
    { number:5, name:'Instrument Landing System' }, { number:6, name:'Radar and SSR' },
    { number:7, name:'Satellite Navigation' }, { number:8, name:'Area Navigation' },
    { number:9, name:'Flight Instruments Overview' }, { number:10, name:'Automatic Flight Systems' },
  ],
  'Operational Procedures||Nordian': [
    { number:1, name:'General Operating Rules' }, { number:2, name:'Pre-flight Procedures' },
    { number:3, name:'En Route Procedures' }, { number:4, name:'Approach and Landing' },
    { number:5, name:'Emergency Procedures' }, { number:6, name:'Special Operations' },
  ],
  'JAR ATPL(A) and CPL(A) Instruments||Keith Williams': [
    { number:1, name:'Pitot-Static System' }, { number:2, name:'The Altimeter' },
    { number:3, name:'Air Speed Indicator' }, { number:4, name:'Vertical Speed Indicator and Machmeter' },
    { number:5, name:'Gyroscopes – Theory' }, { number:6, name:'Attitude Indicator' },
    { number:7, name:'Heading Indicator' }, { number:8, name:'Turn Coordinator and Balance Indicator' },
    { number:9, name:'The Magnetic Compass' }, { number:10, name:'Remote Indicating Compass' },
    { number:11, name:'EFIS Systems' }, { number:12, name:'Inertial Navigation' },
    { number:13, name:'Flight Management System' }, { number:14, name:'Autopilot and AFCS' },
    { number:15, name:'GPWS and EGPWS' }, { number:16, name:'TCAS' },
    { number:17, name:'Radio Altimeter and Weather Radar' },
  ],
  'Ground Studies for Pilots – Radio Aids||Underdown & Cockburn': [
    { number:1, name:'Radio Wave Theory' }, { number:2, name:'Automatic Direction Finding – ADF/NDB' },
    { number:3, name:'VHF Omnidirectional Range – VOR' }, { number:4, name:'Distance Measuring Equipment – DME' },
    { number:5, name:'Instrument Landing System – ILS' }, { number:6, name:'Microwave Landing System' },
    { number:7, name:'Secondary Surveillance Radar' }, { number:8, name:'Primary Radar' },
    { number:9, name:'Area Navigation – RNAV' }, { number:10, name:'Satellite Navigation – GNSS' },
    { number:11, name:'Communication Systems' },
  ],
  'Navigation – 2 Radio Navigation||Oxford': [
    { number:1, name:'Introduction to Radio Navigation' }, { number:2, name:'NDB and ADF' },
    { number:3, name:'VOR' }, { number:4, name:'DME' }, { number:5, name:'ILS' }, { number:6, name:'MLS' },
    { number:7, name:'Radar Navigation and SSR' }, { number:8, name:'RNAV and GPS' }, { number:9, name:'Communication Systems' },
  ],
  'Instrumentation Aircraft General Knowledge||Nordian': [
    { number:1, name:'Pitot-Static Systems' }, { number:2, name:'Pressure Instruments' },
    { number:3, name:'Gyroscopic Instruments' }, { number:4, name:'Magnetic Compass' },
    { number:5, name:'Electronic Displays – EFIS' }, { number:6, name:'Flight Management' },
    { number:7, name:'Autopilot Systems' }, { number:8, name:'Warning Systems – GPWS and TCAS' },
    { number:9, name:'Communication Equipment' },
  ],
  'Aircraft General Knowledge 4||Oxford': [
    { number:1, name:'Part 1 – Radio Navigation Systems' }, { number:2, name:'Part 2 – Instrument Systems' },
    { number:3, name:'Part 3 – Avionics and Autopilots' },
  ],
  'Ground Studies for Pilots – Flight Instruments and Automatic Flight Control Systems||David Harris': [
    { number:1, name:'Pitot-Static Instruments' }, { number:2, name:'Pressure Altitude and ASI' },
    { number:3, name:'Gyroscopic Theory' }, { number:4, name:'Attitude and Heading Systems' },
    { number:5, name:'Turn and Bank Indicators' }, { number:6, name:'The Magnetic Compass' },
    { number:7, name:'Electronic Flight Instruments' }, { number:8, name:'Inertial Navigation' },
    { number:9, name:'Automatic Flight Control' }, { number:10, name:'Warning Systems' },
  ],
  'Avionics and Flight Management for the Professional Pilot||David Robson': [
    { number:1, name:'Navigation Principles' }, { number:2, name:'Radio Navigation Aids' },
    { number:3, name:'GPS and GNSS' }, { number:4, name:'FMS Architecture' }, { number:5, name:'FMS Operations' },
    { number:6, name:'Autopilots and Flight Directors' }, { number:7, name:'Surveillance Systems' },
    { number:8, name:'Communication Systems' }, { number:9, name:'Future Air Navigation Systems' },
  ],
  'JAR ATPL & CPL Principles of Flight||Keith Williams': [
    { number:1, name:'Basic Aerodynamics' }, { number:2, name:'Lift' }, { number:3, name:'Drag' },
    { number:4, name:'Stalling and Spinning' }, { number:5, name:'Stability' }, { number:6, name:'Control' },
    { number:7, name:'High Speed Flight' }, { number:8, name:'Propellers' }, { number:9, name:'Jet Engine Principles' },
    { number:10, name:'Aircraft Performance' }, { number:11, name:'Structural Considerations' }, { number:12, name:'Flight Mechanics' },
  ],
  'Aircraft General Knowledge 1||Oxford': [
    { number:1, name:'Airframe Structures' }, { number:2, name:'Windows, Doors and Sealing' },
    { number:3, name:'Flight Control Surfaces' }, { number:4, name:'Undercarriage and Wheels' },
    { number:5, name:'Hydraulic Systems' }, { number:6, name:'Pneumatic Systems' }, { number:7, name:'Fuel Systems' },
    { number:8, name:'Pressurisation and Air Conditioning' }, { number:9, name:'Ice and Rain Protection' },
    { number:10, name:'Fire Detection and Suppression' }, { number:11, name:'Oxygen Systems and Emergency Equipment' },
  ],
  'Aircraft General Knowledge 2||Oxford': [
    { number:1, name:'Piston Engine Fundamentals' }, { number:2, name:'Carburation and Fuel Injection' },
    { number:3, name:'Ignition Systems' }, { number:4, name:'Engine Instruments' },
    { number:5, name:'Supercharging and Turbocharging' }, { number:6, name:'Propeller Systems' },
    { number:7, name:'Engine Oil Systems' }, { number:8, name:'Cooling Systems' }, { number:9, name:'Gas Turbine – Introduction' },
  ],
  'Aircraft General Knowledge 3||Oxford': [
    { number:1, name:'Gas Turbine Engines – Detail' }, { number:2, name:'Turbofan and Turboprop' },
    { number:3, name:'Engine Starting Systems' }, { number:4, name:'Jet Fuel Systems' },
    { number:5, name:'Thrust Reversal' }, { number:6, name:'Engine Control Systems' },
    { number:7, name:'APU' }, { number:8, name:'Electrical Generation' }, { number:9, name:'Advanced Hydraulics' },
  ],
  'Airframe and Systems||Nordian': [
    { number:1, name:'Aircraft Structures' }, { number:2, name:'Flight Controls' }, { number:3, name:'Hydraulic Systems' },
    { number:4, name:'Landing Gear' }, { number:5, name:'Fuel Systems' }, { number:6, name:'Pressurisation' },
    { number:7, name:'De-icing and Anti-icing' }, { number:8, name:'Fire Protection' }, { number:9, name:'Emergency Systems' },
  ],
  'Airframes and Systems Aircraft General Knowledge||Nordian': [
    { number:1, name:'Airframe Fundamentals' }, { number:2, name:'Primary and Secondary Controls' },
    { number:3, name:'Hydraulics and Pneumatics' }, { number:4, name:'Undercarriage Systems' },
    { number:5, name:'Fuel System Management' }, { number:6, name:'Cabin Pressurisation' },
    { number:7, name:'De-icing and Anti-icing' }, { number:8, name:'Fire Protection' }, { number:9, name:'Emergency Equipment' },
  ],
  'Powerplant Aircraft General Knowledge||Nordian': [
    { number:1, name:'Piston Engine Theory' }, { number:2, name:'Fuel and Fuel Systems' },
    { number:3, name:'Carburettors and Injection' }, { number:4, name:'Supercharging' },
    { number:5, name:'Ignition' }, { number:6, name:'Lubrication' }, { number:7, name:'Cooling' },
    { number:8, name:'Engine Instruments' }, { number:9, name:'Gas Turbines – Introduction' },
  ],
  'Electrics Aircraft General Knowledge||Nordian': [
    { number:1, name:'Basic Electricity' }, { number:2, name:'Aircraft Electrical Systems' },
    { number:3, name:'Batteries' }, { number:4, name:'Generators and Alternators' },
    { number:5, name:'Distribution Systems' }, { number:6, name:'Electrical Instruments' }, { number:7, name:'Avionics Power Supply' },
  ],
  'Principle of Flight||Nordian': [
    { number:1, name:'Aerodynamic Fundamentals' }, { number:2, name:'Lift Generation' }, { number:3, name:'Drag' },
    { number:4, name:'Stalling' }, { number:5, name:'Stability and Control' }, { number:6, name:'High Speed Effects' },
    { number:7, name:'Propulsion' },
  ],
  'Principle of Flight||Oxford': [
    { number:1, name:'Introduction to Aerodynamics' }, { number:2, name:'Lift' }, { number:3, name:'Drag' },
    { number:4, name:'Stall and Spin' }, { number:5, name:'Stability' }, { number:6, name:'Control Surfaces' },
    { number:7, name:'High Speed Flight' }, { number:8, name:'Propellers and Jets' }, { number:9, name:'Performance' },
  ],
}

async function main() {
  console.log('Fetching existing books…')
  const { data: books, error } = await supabase.from('source_books').select('id, title, author')

  if (error) { console.error('Failed to fetch books:', error.message); process.exit(1) }
  if (!books?.length) { console.error('No books found — run seed.ts first'); process.exit(1) }

  const rows: { book_id: string; chapter_number: number; chapter_name: string; sort_order: number }[] = []
  let matched = 0

  for (const book of books) {
    const key = `${book.title}||${book.author}`
    const chapters = chaptersData[key]
    if (!chapters) continue
    matched++
    chapters.forEach(ch => rows.push({ book_id: book.id, chapter_number: ch.number, chapter_name: ch.name, sort_order: ch.number }))
  }

  console.log(`Inserting ${rows.length} chapters across ${matched} books…`)
  const { error: insErr } = await supabase.from('chapters').insert(rows)
  if (insErr) { console.error('Insert failed:', insErr.message); process.exit(1) }
  console.log(`✓ Done — ${rows.length} chapters seeded.`)
}

main().catch(console.error)

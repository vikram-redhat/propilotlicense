/**
 * ProPilotLicence.com — Setup Script
 *
 * Run after schema SQL has been executed in Supabase.
 * Seeds: subjects → topics → source books → chapters → generates ~50 questions per subject
 *
 * Usage: npx tsx scripts/setup.ts
 * Requires: .env.local with NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY
 */

import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ─── Config ───────────────────────────────────────────────────────────────────

const TARGET_PER_SUBJECT = 50
const BATCH_SIZE = 5
const RETRY_LIMIT = 2

const PRIMARY_BOOKS: Record<string, { title: string; author: string }> = {
  MET:  { title: 'Aviation Meteorology',                  author: 'IC Joshi' },
  REG:  { title: 'Air Regulations',                       author: 'RK Bali' },
  NAV:  { title: 'Air Navigation',                        author: 'Trevor Thom' },
  RAI:  { title: 'JAR ATPL(A) and CPL(A) Instruments',   author: 'Keith Williams' },
  TECH: { title: 'JAR ATPL & CPL Principles of Flight',  author: 'Keith Williams' },
}

const DIFFICULTY_CYCLE: Array<'easy'|'medium'|'hard'> = ['easy','medium','easy','medium','hard']

// ─── Subjects ─────────────────────────────────────────────────────────────────

const subjects = [
  { name:'Meteorology',             code:'MET',  icon_name:'wind',   licence_types:['CPL','ATPL'], sort_order:1, description:`Meteorology is the study of the Earth's atmosphere and the weather phenomena that affect aviation. This subject covers the structure and composition of the atmosphere, pressure systems, temperature and humidity, clouds, precipitation, thunderstorms, icing, visibility, fronts, and the interpretation of aviation weather reports and forecasts including METAR, TAF, SIGMET, and AIRMET. Pilots must be able to anticipate and respond to weather hazards including windshear, microbursts, clear air turbulence, and in-flight icing conditions.` },
  { name:'Air Regulations',         code:'REG',  icon_name:'gavel',  licence_types:['CPL','ATPL'], sort_order:2, description:`Air Regulations covers the legal and procedural framework governing civil aviation in India and internationally. This subject includes the Aircraft Act 1934, Aircraft Rules, DGCA Civil Aviation Requirements (CARs), ICAO Annexes, the AIP India, airspace classification, flight rules (VFR and IFR), ATC procedures, pilot licensing requirements, flight and duty time limitations, accident and incident reporting, and human performance and limitations.` },
  { name:'Air Navigation',          code:'NAV',  icon_name:'route',  licence_types:['CPL','ATPL'], sort_order:3, description:`Air Navigation covers the science and practice of determining an aircraft's position and directing its flight path. Topics include dead reckoning, the wind triangle, VOR, NDB, DME, ILS, GPS/GNSS, chart projections, great circle and rhumb line tracks, time zones, magnetic variation, mass and balance, and performance planning.` },
  { name:'Radio Aids & Instruments',code:'RAI',  icon_name:'radio',  licence_types:['CPL','ATPL'], sort_order:4, description:`Radio Aids and Instruments covers the operating principles, capabilities, and limitations of navigation and communication systems in modern aircraft, plus flight instruments. Includes VHF/HF communications, transponders, ADF, VOR, DME, ILS, MLS, GPS/GNSS, TCAS, EGPWS, pitot-static instruments, gyroscopic instruments, EFIS, FMS, and autopilot systems.` },
  { name:'Technical General',       code:'TECH', icon_name:'engine', licence_types:['CPL','ATPL'], sort_order:5, description:`Technical General covers the theoretical and practical knowledge of aircraft structures, systems, and powerplants for CPL and ATPL examinations. Topics include principles of flight, airframe structures, flight control systems, hydraulic systems, landing gear, piston and gas turbine engines, fuel systems, electrical systems, pressurisation, ice protection, and fire detection.` },
]

// ─── Topics ───────────────────────────────────────────────────────────────────

const topicsData: Record<string, string[]> = {
  MET:  ['Atmosphere structure','Pressure and altimetry','Temperature','Winds and circulation','Clouds and precipitation','Thunderstorms','Icing','Visibility and fog','Fronts','ITCZ','METAR and TAF decode','SIGMET and AIRMET','Turbulence','Wind shear'],
  REG:  ['ICAO annexes','DGCA CAR series','Aircraft Act and Rules','Flight rules – VFR','Flight rules – IFR','ATC procedures','Airspace classification','Licensing requirements','Flight and duty time limitations','Accident and incident reporting','Human performance and limitations','AIP India'],
  NAV:  ['Dead reckoning','Wind triangle calculations','VOR navigation','NDB and ADF','DME operations','ILS approach','GPS and GNSS','Celestial navigation','Chart projections','Time zones and date line','Great circle and rhumb line','Flight planning','Mass and balance','Performance planning'],
  RAI:  ['VHF communications','HF communications','Transponder and SSR','ADF and NDB','VOR principles','DME','ILS and MLS','GPS and GNSS','TCAS','EGPWS and GPWS','Pitot-static instruments','Gyroscopic instruments','Magnetic compass','Autopilot and AFCS','EFIS and FMS'],
  TECH: ['Principles of flight','Lift and drag','Stability and control','Airframe structures','Flight control systems','Hydraulic systems','Landing gear','Piston engines','Gas turbine engines','Fuel systems','Electrical systems','Pressurisation','Ice and rain protection','Fire protection'],
}

// ─── Source Books ─────────────────────────────────────────────────────────────

const booksData = [
  { code:'MET',  title:'Aviation Meteorology',                    author:'IC Joshi',            licence_types:['CPL','ATPL'], sort_order:1 },
  { code:'MET',  title:'Ground Studies for Pilots – Meteorology', author:'Underdown & Standen', licence_types:['CPL','ATPL'], sort_order:2 },
  { code:'MET',  title:'Meteorology',                             author:'Nordian',             licence_types:['CPL','ATPL'], sort_order:3 },
  { code:'MET',  title:'Meteorology',                             author:'Oxford',              licence_types:['CPL','ATPL'], sort_order:4 },
  { code:'MET',  title:'Meteorology for Pilot',                   author:'Mike Wickson',        licence_types:['CPL','ATPL'], sort_order:5 },
  { code:'MET',  title:'Aviation Law and Meteorology',            author:'Trevor Thom',         licence_types:['CPL'],        sort_order:6 },
  { code:'REG',  title:'Air Law',                                 author:'Oxford',                 licence_types:['CPL','ATPL'], sort_order:1 },
  { code:'REG',  title:'Air Regulations',                         author:'RK Bali',                licence_types:['CPL','ATPL'], sort_order:2 },
  { code:'REG',  title:'Air Law and ATC Procedures',              author:'Nordian',                licence_types:['CPL','ATPL'], sort_order:3 },
  { code:'REG',  title:'Air Regulations for Pilots',              author:'V Krishnan & AK Chopra', licence_types:['CPL','ATPL'], sort_order:4 },
  { code:'REG',  title:'Aircraft Act 1934',                       author:'India',                  licence_types:['CPL','ATPL'], sort_order:5 },
  { code:'REG',  title:'Aircraft Rules 1920, 1937, 1954 & 2003', author:'India',                  licence_types:['CPL','ATPL'], sort_order:6 },
  { code:'REG',  title:'DGCA Civil Aviation Requirements (CAR)', author:'DGCA',                   licence_types:['CPL','ATPL'], sort_order:7 },
  { code:'REG',  title:'Human Performance & Limitations',         author:'Nordian',                licence_types:['CPL','ATPL'], sort_order:8 },
  { code:'REG',  title:'Human Performance & Limitations',         author:'Oxford',                 licence_types:['CPL','ATPL'], sort_order:9 },
  { code:'REG',  title:'ICAO Annexes',                            author:'ICAO',                   licence_types:['CPL','ATPL'], sort_order:10 },
  { code:'REG',  title:'ICAO Docs',                               author:'ICAO',                   licence_types:['CPL','ATPL'], sort_order:11 },
  { code:'REG',  title:'AIP India',                               author:'India',                  licence_types:['CPL','ATPL'], sort_order:12 },
  { code:'NAV',  title:'Air Navigation',                                author:'Trevor Thom',        licence_types:['CPL','ATPL'], sort_order:1 },
  { code:'NAV',  title:'JAR ATPL & CPL General Navigation',             author:'Keith Williams',     licence_types:['CPL','ATPL'], sort_order:2 },
  { code:'NAV',  title:'Ground Studies for Pilots – Navigation',        author:'Underdown & Palmer', licence_types:['CPL','ATPL'], sort_order:3 },
  { code:'NAV',  title:'General Navigation – Navigation',               author:'Nordian',            licence_types:['CPL','ATPL'], sort_order:4 },
  { code:'NAV',  title:'Navigation for Pilot',                          author:'JE Hitchcock',       licence_types:['CPL','ATPL'], sort_order:5 },
  { code:'NAV',  title:'Flight Performance & Planning 1',               author:'Oxford',             licence_types:['CPL','ATPL'], sort_order:6 },
  { code:'NAV',  title:'Flight Performance & Planning 2 (FP & M)',      author:'Oxford',             licence_types:['CPL','ATPL'], sort_order:7 },
  { code:'NAV',  title:'Mass & Balance Flight Performance and Planning', author:'Nordian',            licence_types:['CPL','ATPL'], sort_order:8 },
  { code:'NAV',  title:'Radio Navigation and Instrument Flying',        author:'Trevor Thom',        licence_types:['CPL','ATPL'], sort_order:9 },
  { code:'NAV',  title:'Operational Procedures',                        author:'Nordian',            licence_types:['CPL','ATPL'], sort_order:10 },
  { code:'RAI',  title:'JAR ATPL(A) and CPL(A) Instruments',                                author:'Keith Williams',       licence_types:['CPL','ATPL'], sort_order:1 },
  { code:'RAI',  title:'Ground Studies for Pilots – Radio Aids',                             author:'Underdown & Cockburn', licence_types:['CPL','ATPL'], sort_order:2 },
  { code:'RAI',  title:'Radio Navigation and Instrument Flying',                             author:'Trevor Thom',          licence_types:['CPL','ATPL'], sort_order:3 },
  { code:'RAI',  title:'Navigation – 2 Radio Navigation',                                   author:'Oxford',               licence_types:['CPL','ATPL'], sort_order:4 },
  { code:'RAI',  title:'Instrumentation Aircraft General Knowledge',                         author:'Nordian',              licence_types:['CPL','ATPL'], sort_order:5 },
  { code:'RAI',  title:'Aircraft General Knowledge 4',                                       author:'Oxford',               licence_types:['CPL','ATPL'], sort_order:6 },
  { code:'RAI',  title:'Ground Studies for Pilots – Flight Instruments and Automatic Flight Control Systems', author:'David Harris',  licence_types:['CPL','ATPL'], sort_order:7 },
  { code:'RAI',  title:'Avionics and Flight Management for the Professional Pilot',           author:'David Robson',         licence_types:['ATPL'],        sort_order:8 },
  { code:'TECH', title:'JAR ATPL & CPL Principles of Flight',              author:'Keith Williams', licence_types:['CPL','ATPL'], sort_order:1 },
  { code:'TECH', title:'Aircraft General Knowledge 1',                     author:'Oxford',         licence_types:['CPL','ATPL'], sort_order:2 },
  { code:'TECH', title:'Aircraft General Knowledge 2',                     author:'Oxford',         licence_types:['CPL','ATPL'], sort_order:3 },
  { code:'TECH', title:'Aircraft General Knowledge 3',                     author:'Oxford',         licence_types:['CPL','ATPL'], sort_order:4 },
  { code:'TECH', title:'Airframe and Systems',                             author:'Nordian',        licence_types:['CPL','ATPL'], sort_order:5 },
  { code:'TECH', title:'Airframes and Systems Aircraft General Knowledge', author:'Nordian',        licence_types:['CPL','ATPL'], sort_order:6 },
  { code:'TECH', title:'Powerplant Aircraft General Knowledge',            author:'Nordian',        licence_types:['CPL','ATPL'], sort_order:7 },
  { code:'TECH', title:'Electrics Aircraft General Knowledge',             author:'Nordian',        licence_types:['CPL','ATPL'], sort_order:8 },
  { code:'TECH', title:'Principle of Flight',                              author:'Nordian',        licence_types:['CPL','ATPL'], sort_order:9 },
  { code:'TECH', title:'Principle of Flight',                              author:'Oxford',         licence_types:['CPL','ATPL'], sort_order:10 },
]

// ─── Chapters ─────────────────────────────────────────────────────────────────
// Keyed by "Title||Author" matching booksData entries.
// All chapter/page references are approximate — citation_verified defaults to false.
// Regulatory documents (ICAO Annexes, Aircraft Act, AIP) use Parts/Sections/Annexes.

type ChapterEntry = { number: number; name: string }
const chaptersData: Record<string, ChapterEntry[]> = {

  // ── METEOROLOGY ─────────────────────────────────────────────────────────────

  'Aviation Meteorology||IC Joshi': [
    { number:1,  name:'The Atmosphere' },
    { number:2,  name:'Temperature' },
    { number:3,  name:'Atmospheric Pressure' },
    { number:4,  name:'Winds' },
    { number:5,  name:'Humidity and Moisture' },
    { number:6,  name:'Clouds' },
    { number:7,  name:'Precipitation' },
    { number:8,  name:'Visibility and Fog' },
    { number:9,  name:'Air Masses' },
    { number:10, name:'Fronts' },
    { number:11, name:'Thunderstorms' },
    { number:12, name:'Icing' },
    { number:13, name:'Turbulence' },
    { number:14, name:'Wind Shear' },
    { number:15, name:'Aviation Weather Reports and METAR' },
    { number:16, name:'Weather Forecasting and TAF' },
  ],

  'Ground Studies for Pilots – Meteorology||Underdown & Standen': [
    { number:1,  name:'The Atmosphere' },
    { number:2,  name:'Temperature and Stability' },
    { number:3,  name:'Pressure and Altimetry' },
    { number:4,  name:'Winds and Circulation' },
    { number:5,  name:'Humidity, Cloud and Fog' },
    { number:6,  name:'Precipitation and Visibility' },
    { number:7,  name:'Air Masses and Frontal Systems' },
    { number:8,  name:'Thunderstorms and Severe Weather' },
    { number:9,  name:'Icing Conditions' },
    { number:10, name:'Turbulence' },
    { number:11, name:'Aviation Weather Services and METAR/TAF' },
  ],

  'Meteorology||Nordian': [
    { number:1,  name:'The Atmosphere and its Properties' },
    { number:2,  name:'Temperature' },
    { number:3,  name:'Atmospheric Pressure' },
    { number:4,  name:'Wind Systems' },
    { number:5,  name:'Moisture and Precipitation' },
    { number:6,  name:'Cloud Formation' },
    { number:7,  name:'Fog and Visibility' },
    { number:8,  name:'Air Masses and Fronts' },
    { number:9,  name:'Thunderstorms' },
    { number:10, name:'Icing and Turbulence' },
    { number:11, name:'Weather Forecasting and METAR/TAF' },
  ],

  'Meteorology||Oxford': [
    { number:1,  name:'The Atmosphere' },
    { number:2,  name:'Temperature' },
    { number:3,  name:'Pressure and Altimetry' },
    { number:4,  name:'Wind' },
    { number:5,  name:'Moisture in the Atmosphere' },
    { number:6,  name:'Clouds and Precipitation' },
    { number:7,  name:'Thunderstorms' },
    { number:8,  name:'Icing' },
    { number:9,  name:'Turbulence and Wind Shear' },
    { number:10, name:'Air Masses and Fronts' },
    { number:11, name:'Aviation Weather Reports and Services' },
  ],

  'Meteorology for Pilot||Mike Wickson': [
    { number:1,  name:'Introduction to the Atmosphere' },
    { number:2,  name:'Temperature and Lapse Rates' },
    { number:3,  name:'Pressure and Altimetry' },
    { number:4,  name:'Wind' },
    { number:5,  name:'Clouds and Precipitation' },
    { number:6,  name:'Thunderstorms' },
    { number:7,  name:'Icing' },
    { number:8,  name:'Turbulence' },
    { number:9,  name:'Visibility and Fog' },
    { number:10, name:'Aviation Meteorological Services' },
  ],

  'Aviation Law and Meteorology||Trevor Thom': [
    { number:1,  name:'Introduction to Meteorology' },
    { number:2,  name:'The Atmosphere' },
    { number:3,  name:'Clouds and Precipitation' },
    { number:4,  name:'Fronts and Air Masses' },
    { number:5,  name:'Thunderstorms and Icing' },
    { number:6,  name:'Aviation Weather Services' },
  ],

  // ── AIR REGULATIONS ──────────────────────────────────────────────────────────

  'Air Law||Oxford': [
    { number:1,  name:'International Organisations and ICAO' },
    { number:2,  name:'ICAO Annexes – Overview' },
    { number:3,  name:'Personnel Licensing – Annex 1' },
    { number:4,  name:'Rules of the Air – Annex 2' },
    { number:5,  name:'Operation of Aircraft – Annex 6' },
    { number:6,  name:'Aircraft Nationality and Registration – Annex 7' },
    { number:7,  name:'Airworthiness – Annex 8' },
    { number:8,  name:'Air Traffic Services – Annex 11' },
    { number:9,  name:'Search and Rescue – Annex 12' },
    { number:10, name:'Accident Investigation – Annex 13' },
    { number:11, name:'Aerodromes – Annex 14' },
    { number:12, name:'National Regulations and Airspace' },
    { number:13, name:'ATC Procedures' },
    { number:14, name:'Procedures for Air Navigation' },
  ],

  'Air Regulations||RK Bali': [
    { number:1,  name:'Introduction and ICAO' },
    { number:2,  name:'ICAO Annexes' },
    { number:3,  name:'Aircraft Act 1934' },
    { number:4,  name:'Aircraft Rules 1937 and Amendments' },
    { number:5,  name:'DGCA – Organisation and Functions' },
    { number:6,  name:'Civil Aviation Requirements (CARs)' },
    { number:7,  name:'Personnel Licensing' },
    { number:8,  name:'Rules of the Air' },
    { number:9,  name:'Air Traffic Services' },
    { number:10, name:'Aerodromes and Facilities' },
    { number:11, name:'Search and Rescue' },
    { number:12, name:'Accident and Incident Investigation' },
    { number:13, name:'Human Performance and Limitations' },
    { number:14, name:'AIP India' },
  ],

  'Air Law and ATC Procedures||Nordian': [
    { number:1,  name:'Introduction to Aviation Law' },
    { number:2,  name:'ICAO Structure and Annexes' },
    { number:3,  name:'Personnel Licensing' },
    { number:4,  name:'Rules of the Air – VFR' },
    { number:5,  name:'Rules of the Air – IFR' },
    { number:6,  name:'Airspace Classification' },
    { number:7,  name:'ATC Procedures – General' },
    { number:8,  name:'Clearances and Instructions' },
    { number:9,  name:'Separation Standards' },
    { number:10, name:'Communication Procedures and Failures' },
    { number:11, name:'Emergency Procedures' },
  ],

  'Air Regulations for Pilots||V Krishnan & AK Chopra': [
    { number:1,  name:'ICAO – Organisation and Structure' },
    { number:2,  name:'ICAO Annexes and Standards' },
    { number:3,  name:'Aircraft Act 1934' },
    { number:4,  name:'Aircraft Rules' },
    { number:5,  name:'DGCA Regulations' },
    { number:6,  name:'CARs – Operations' },
    { number:7,  name:'Licensing Requirements' },
    { number:8,  name:'Flight Rules' },
    { number:9,  name:'ATC Procedures' },
    { number:10, name:'Accident Reporting and Investigation' },
  ],

  // Regulatory documents — use Parts/Sections instead of chapters
  'Aircraft Act 1934||India': [
    { number:1,  name:'Part I – Preliminary' },
    { number:2,  name:'Part II – Registration of Aircraft' },
    { number:3,  name:'Part III – Airworthiness' },
    { number:4,  name:'Part IV – Licensing of Personnel' },
    { number:5,  name:'Part V – Regulation of Air Transport' },
    { number:6,  name:'Part VI – Control of Air Navigation' },
    { number:7,  name:'Part VII – Investigation of Accidents' },
    { number:8,  name:'Part VIII – Penalties and Miscellaneous' },
  ],

  'Aircraft Rules 1920, 1937, 1954 & 2003||India': [
    { number:1,  name:'Section 1 – General and Registration' },
    { number:2,  name:'Section 2 – Airworthiness Requirements' },
    { number:3,  name:'Section 3 – Personnel Licensing' },
    { number:4,  name:'Section 4 – Operations and Air Traffic' },
    { number:5,  name:'Section 5 – Carriage of Goods' },
    { number:6,  name:'Section 6 – Aerodromes' },
    { number:7,  name:'Section 7 – Enforcement' },
  ],

  'DGCA Civil Aviation Requirements (CAR)||DGCA': [
    { number:1,  name:'Series A – Airworthiness' },
    { number:2,  name:'Series B – Aerodromes' },
    { number:3,  name:'Series C – Personnel Licensing' },
    { number:4,  name:'Series D – Operations' },
    { number:5,  name:'Series E – Air Traffic Services' },
    { number:6,  name:'Series X – Miscellaneous' },
  ],

  'Human Performance & Limitations||Nordian': [
    { number:1,  name:'Human Factors in Aviation' },
    { number:2,  name:'Basic Aviation Physiology' },
    { number:3,  name:'Hypoxia and Hyperventilation' },
    { number:4,  name:'Vision' },
    { number:5,  name:'Hearing and Spatial Disorientation' },
    { number:6,  name:'Acceleration and G-Forces' },
    { number:7,  name:'Fatigue and Sleep' },
    { number:8,  name:'Stress and Workload' },
    { number:9,  name:'Human Error and CRM' },
    { number:10, name:'Psychology of Flying' },
  ],

  'Human Performance & Limitations||Oxford': [
    { number:1,  name:'Introduction to Human Factors' },
    { number:2,  name:'Aviation Physiology' },
    { number:3,  name:'Sensory Perception' },
    { number:4,  name:'Spatial Disorientation' },
    { number:5,  name:'Fatigue' },
    { number:6,  name:'Stress and Anxiety' },
    { number:7,  name:'Human Error' },
    { number:8,  name:'Crew Resource Management' },
  ],

  'ICAO Annexes||ICAO': [
    { number:1,  name:'Annex 1 – Personnel Licensing' },
    { number:2,  name:'Annex 2 – Rules of the Air' },
    { number:3,  name:'Annex 3 – Meteorological Services' },
    { number:4,  name:'Annex 4 – Aeronautical Charts' },
    { number:5,  name:'Annex 6 – Operation of Aircraft' },
    { number:6,  name:'Annex 8 – Airworthiness' },
    { number:7,  name:'Annex 11 – Air Traffic Services' },
    { number:8,  name:'Annex 12 – Search and Rescue' },
    { number:9,  name:'Annex 13 – Accident Investigation' },
    { number:10, name:'Annex 14 – Aerodromes' },
    { number:11, name:'Annex 17 – Security' },
    { number:12, name:'Annex 19 – Safety Management' },
  ],

  'ICAO Docs||ICAO': [
    { number:1,  name:'Doc 4444 – PANS-ATM (ATC Procedures)' },
    { number:2,  name:'Doc 8168 – PANS-OPS (Flight Procedures)' },
    { number:3,  name:'Doc 9432 – Manual of Radiotelephony' },
    { number:4,  name:'Doc 8400 – ICAO Abbreviations and Codes' },
    { number:5,  name:'Doc 9574 – Manual on RVSM' },
  ],

  'AIP India||India': [
    { number:1,  name:'GEN – General' },
    { number:2,  name:'ENR – En Route' },
    { number:3,  name:'AD – Aerodromes' },
  ],

  // ── AIR NAVIGATION ────────────────────────────────────────────────────────────

  'Air Navigation||Trevor Thom': [
    { number:1,  name:'The Earth and Positions' },
    { number:2,  name:'Direction and Bearing' },
    { number:3,  name:'Distance, Speed and Time' },
    { number:4,  name:'Charts and Projections' },
    { number:5,  name:'Dead Reckoning Navigation' },
    { number:6,  name:'The Triangle of Velocities' },
    { number:7,  name:'In-Flight Navigation Techniques' },
    { number:8,  name:'The Magnetic Compass' },
    { number:9,  name:'Radio Navigation Aids' },
    { number:10, name:'Area Navigation and GPS' },
    { number:11, name:'Flight Planning' },
    { number:12, name:'Mass, Balance and Performance' },
  ],

  'JAR ATPL & CPL General Navigation||Keith Williams': [
    { number:1,  name:'The Earth and Positions' },
    { number:2,  name:'Latitude and Longitude' },
    { number:3,  name:'Directions and Variation' },
    { number:4,  name:'Charts and Projections' },
    { number:5,  name:'Dead Reckoning' },
    { number:6,  name:'Triangle of Velocities' },
    { number:7,  name:'In-Flight Navigation' },
    { number:8,  name:'Radio Navigation' },
    { number:9,  name:'Pressure Instruments in Navigation' },
    { number:10, name:'Flight Planning' },
    { number:11, name:'Mass and Balance' },
    { number:12, name:'Performance' },
  ],

  'Ground Studies for Pilots – Navigation||Underdown & Palmer': [
    { number:1,  name:'The Earth' },
    { number:2,  name:'Maps and Charts' },
    { number:3,  name:'Dead Reckoning' },
    { number:4,  name:'The Triangle of Velocities' },
    { number:5,  name:'The Magnetic Compass' },
    { number:6,  name:'Radio Navigation Aids' },
    { number:7,  name:'Modern Navigation Systems' },
    { number:8,  name:'Flight Planning' },
    { number:9,  name:'Mass, Balance and Loading' },
  ],

  'General Navigation – Navigation||Nordian': [
    { number:1,  name:'The Earth and Positions' },
    { number:2,  name:'Directions and Variation' },
    { number:3,  name:'Chart Projections' },
    { number:4,  name:'Dead Reckoning' },
    { number:5,  name:'Wind and Drift' },
    { number:6,  name:'In-Flight Navigation' },
    { number:7,  name:'Radio Navigation' },
    { number:8,  name:'Modern Systems – GPS and INS' },
    { number:9,  name:'Flight Planning' },
  ],

  'Navigation for Pilot||JE Hitchcock': [
    { number:1,  name:'Basics of Navigation' },
    { number:2,  name:'The Earth' },
    { number:3,  name:'Charts and Projections' },
    { number:4,  name:'Dead Reckoning' },
    { number:5,  name:'Wind Calculations' },
    { number:6,  name:'Radio Aids' },
    { number:7,  name:'Navigation Planning' },
  ],

  'Flight Performance & Planning 1||Oxford': [
    { number:1,  name:'Performance Theory' },
    { number:2,  name:'Aerodrome Performance' },
    { number:3,  name:'Take-off Performance' },
    { number:4,  name:'En Route Performance' },
    { number:5,  name:'Landing Performance' },
    { number:6,  name:'Noise Abatement' },
  ],

  'Flight Performance & Planning 2 (FP & M)||Oxford': [
    { number:1,  name:'Mass and Balance Theory' },
    { number:2,  name:'Loading Systems' },
    { number:3,  name:'Centre of Gravity Calculations' },
    { number:4,  name:'Loading Schedules' },
    { number:5,  name:'Flight Planning Basics' },
    { number:6,  name:'ICAO Flight Plans' },
  ],

  'Mass & Balance Flight Performance and Planning||Nordian': [
    { number:1,  name:'Basic Principles of Mass and Balance' },
    { number:2,  name:'Weighing and Centre of Gravity' },
    { number:3,  name:'Loading Schedules' },
    { number:4,  name:'Performance Calculations' },
    { number:5,  name:'Flight Planning' },
  ],

  'Radio Navigation and Instrument Flying||Trevor Thom': [
    { number:1,  name:'Radio Principles' },
    { number:2,  name:'Automatic Direction Finding' },
    { number:3,  name:'VOR Navigation' },
    { number:4,  name:'Distance Measuring Equipment' },
    { number:5,  name:'Instrument Landing System' },
    { number:6,  name:'Radar and SSR' },
    { number:7,  name:'Satellite Navigation' },
    { number:8,  name:'Area Navigation' },
    { number:9,  name:'Flight Instruments Overview' },
    { number:10, name:'Automatic Flight Systems' },
  ],

  'Operational Procedures||Nordian': [
    { number:1,  name:'General Operating Rules' },
    { number:2,  name:'Pre-flight Procedures' },
    { number:3,  name:'En Route Procedures' },
    { number:4,  name:'Approach and Landing' },
    { number:5,  name:'Emergency Procedures' },
    { number:6,  name:'Special Operations' },
  ],

  // ── RADIO AIDS & INSTRUMENTS ──────────────────────────────────────────────────

  'JAR ATPL(A) and CPL(A) Instruments||Keith Williams': [
    { number:1,  name:'Pitot-Static System' },
    { number:2,  name:'The Altimeter' },
    { number:3,  name:'Air Speed Indicator' },
    { number:4,  name:'Vertical Speed Indicator and Machmeter' },
    { number:5,  name:'Gyroscopes – Theory' },
    { number:6,  name:'Attitude Indicator' },
    { number:7,  name:'Heading Indicator' },
    { number:8,  name:'Turn Coordinator and Balance Indicator' },
    { number:9,  name:'The Magnetic Compass' },
    { number:10, name:'Remote Indicating Compass' },
    { number:11, name:'EFIS Systems' },
    { number:12, name:'Inertial Navigation' },
    { number:13, name:'Flight Management System' },
    { number:14, name:'Autopilot and AFCS' },
    { number:15, name:'GPWS and EGPWS' },
    { number:16, name:'TCAS' },
    { number:17, name:'Radio Altimeter and Weather Radar' },
  ],

  'Ground Studies for Pilots – Radio Aids||Underdown & Cockburn': [
    { number:1,  name:'Radio Wave Theory' },
    { number:2,  name:'Automatic Direction Finding – ADF/NDB' },
    { number:3,  name:'VHF Omnidirectional Range – VOR' },
    { number:4,  name:'Distance Measuring Equipment – DME' },
    { number:5,  name:'Instrument Landing System – ILS' },
    { number:6,  name:'Microwave Landing System' },
    { number:7,  name:'Secondary Surveillance Radar' },
    { number:8,  name:'Primary Radar' },
    { number:9,  name:'Area Navigation – RNAV' },
    { number:10, name:'Satellite Navigation – GNSS' },
    { number:11, name:'Communication Systems' },
  ],

  // Radio Navigation and Instrument Flying (Trevor Thom) — same entry as NAV, different subject
  // Supabase will store two separate rows (subject_id differs), so key lookup below handles this

  'Navigation – 2 Radio Navigation||Oxford': [
    { number:1,  name:'Introduction to Radio Navigation' },
    { number:2,  name:'NDB and ADF' },
    { number:3,  name:'VOR' },
    { number:4,  name:'DME' },
    { number:5,  name:'ILS' },
    { number:6,  name:'MLS' },
    { number:7,  name:'Radar Navigation and SSR' },
    { number:8,  name:'RNAV and GPS' },
    { number:9,  name:'Communication Systems' },
  ],

  'Instrumentation Aircraft General Knowledge||Nordian': [
    { number:1,  name:'Pitot-Static Systems' },
    { number:2,  name:'Pressure Instruments' },
    { number:3,  name:'Gyroscopic Instruments' },
    { number:4,  name:'Magnetic Compass' },
    { number:5,  name:'Electronic Displays – EFIS' },
    { number:6,  name:'Flight Management' },
    { number:7,  name:'Autopilot Systems' },
    { number:8,  name:'Warning Systems – GPWS and TCAS' },
    { number:9,  name:'Communication Equipment' },
  ],

  'Aircraft General Knowledge 4||Oxford': [
    { number:1,  name:'Part 1 – Radio Navigation Systems' },
    { number:2,  name:'Part 2 – Instrument Systems' },
    { number:3,  name:'Part 3 – Avionics and Autopilots' },
  ],

  'Ground Studies for Pilots – Flight Instruments and Automatic Flight Control Systems||David Harris': [
    { number:1,  name:'Pitot-Static Instruments' },
    { number:2,  name:'Pressure Altitude and ASI' },
    { number:3,  name:'Gyroscopic Theory' },
    { number:4,  name:'Attitude and Heading Systems' },
    { number:5,  name:'Turn and Bank Indicators' },
    { number:6,  name:'The Magnetic Compass' },
    { number:7,  name:'Electronic Flight Instruments' },
    { number:8,  name:'Inertial Navigation' },
    { number:9,  name:'Automatic Flight Control' },
    { number:10, name:'Warning Systems' },
  ],

  'Avionics and Flight Management for the Professional Pilot||David Robson': [
    { number:1,  name:'Navigation Principles' },
    { number:2,  name:'Radio Navigation Aids' },
    { number:3,  name:'GPS and GNSS' },
    { number:4,  name:'FMS Architecture' },
    { number:5,  name:'FMS Operations' },
    { number:6,  name:'Autopilots and Flight Directors' },
    { number:7,  name:'Surveillance Systems' },
    { number:8,  name:'Communication Systems' },
    { number:9,  name:'Future Air Navigation Systems' },
  ],

  // ── TECHNICAL GENERAL ──────────────────────────────────────────────────────

  'JAR ATPL & CPL Principles of Flight||Keith Williams': [
    { number:1,  name:'Basic Aerodynamics' },
    { number:2,  name:'Lift' },
    { number:3,  name:'Drag' },
    { number:4,  name:'Stalling and Spinning' },
    { number:5,  name:'Stability' },
    { number:6,  name:'Control' },
    { number:7,  name:'High Speed Flight' },
    { number:8,  name:'Propellers' },
    { number:9,  name:'Jet Engine Principles' },
    { number:10, name:'Aircraft Performance' },
    { number:11, name:'Structural Considerations' },
    { number:12, name:'Flight Mechanics' },
  ],

  'Aircraft General Knowledge 1||Oxford': [
    { number:1,  name:'Airframe Structures' },
    { number:2,  name:'Windows, Doors and Sealing' },
    { number:3,  name:'Flight Control Surfaces' },
    { number:4,  name:'Undercarriage and Wheels' },
    { number:5,  name:'Hydraulic Systems' },
    { number:6,  name:'Pneumatic Systems' },
    { number:7,  name:'Fuel Systems' },
    { number:8,  name:'Pressurisation and Air Conditioning' },
    { number:9,  name:'Ice and Rain Protection' },
    { number:10, name:'Fire Detection and Suppression' },
    { number:11, name:'Oxygen Systems and Emergency Equipment' },
  ],

  'Aircraft General Knowledge 2||Oxford': [
    { number:1,  name:'Piston Engine Fundamentals' },
    { number:2,  name:'Carburation and Fuel Injection' },
    { number:3,  name:'Ignition Systems' },
    { number:4,  name:'Engine Instruments' },
    { number:5,  name:'Supercharging and Turbocharging' },
    { number:6,  name:'Propeller Systems' },
    { number:7,  name:'Engine Oil Systems' },
    { number:8,  name:'Cooling Systems' },
    { number:9,  name:'Gas Turbine – Introduction' },
  ],

  'Aircraft General Knowledge 3||Oxford': [
    { number:1,  name:'Gas Turbine Engines – Detail' },
    { number:2,  name:'Turbofan and Turboprop' },
    { number:3,  name:'Engine Starting Systems' },
    { number:4,  name:'Jet Fuel Systems' },
    { number:5,  name:'Thrust Reversal' },
    { number:6,  name:'Engine Control Systems' },
    { number:7,  name:'APU' },
    { number:8,  name:'Electrical Generation' },
    { number:9,  name:'Advanced Hydraulics' },
  ],

  'Airframe and Systems||Nordian': [
    { number:1,  name:'Aircraft Structures' },
    { number:2,  name:'Flight Controls' },
    { number:3,  name:'Hydraulic Systems' },
    { number:4,  name:'Landing Gear' },
    { number:5,  name:'Fuel Systems' },
    { number:6,  name:'Pressurisation' },
    { number:7,  name:'De-icing and Anti-icing' },
    { number:8,  name:'Fire Protection' },
    { number:9,  name:'Emergency Systems' },
  ],

  'Airframes and Systems Aircraft General Knowledge||Nordian': [
    { number:1,  name:'Airframe Fundamentals' },
    { number:2,  name:'Primary and Secondary Controls' },
    { number:3,  name:'Hydraulics and Pneumatics' },
    { number:4,  name:'Undercarriage Systems' },
    { number:5,  name:'Fuel System Management' },
    { number:6,  name:'Cabin Pressurisation' },
    { number:7,  name:'De-icing and Anti-icing' },
    { number:8,  name:'Fire Protection' },
    { number:9,  name:'Emergency Equipment' },
  ],

  'Powerplant Aircraft General Knowledge||Nordian': [
    { number:1,  name:'Piston Engine Theory' },
    { number:2,  name:'Fuel and Fuel Systems' },
    { number:3,  name:'Carburettors and Injection' },
    { number:4,  name:'Supercharging' },
    { number:5,  name:'Ignition' },
    { number:6,  name:'Lubrication' },
    { number:7,  name:'Cooling' },
    { number:8,  name:'Engine Instruments' },
    { number:9,  name:'Gas Turbines – Introduction' },
  ],

  'Electrics Aircraft General Knowledge||Nordian': [
    { number:1,  name:'Basic Electricity' },
    { number:2,  name:'Aircraft Electrical Systems' },
    { number:3,  name:'Batteries' },
    { number:4,  name:'Generators and Alternators' },
    { number:5,  name:'Distribution Systems' },
    { number:6,  name:'Electrical Instruments' },
    { number:7,  name:'Avionics Power Supply' },
  ],

  'Principle of Flight||Nordian': [
    { number:1,  name:'Aerodynamic Fundamentals' },
    { number:2,  name:'Lift Generation' },
    { number:3,  name:'Drag' },
    { number:4,  name:'Stalling' },
    { number:5,  name:'Stability and Control' },
    { number:6,  name:'High Speed Effects' },
    { number:7,  name:'Propulsion' },
  ],

  'Principle of Flight||Oxford': [
    { number:1,  name:'Introduction to Aerodynamics' },
    { number:2,  name:'Lift' },
    { number:3,  name:'Drag' },
    { number:4,  name:'Stall and Spin' },
    { number:5,  name:'Stability' },
    { number:6,  name:'Control Surfaces' },
    { number:7,  name:'High Speed Flight' },
    { number:8,  name:'Propellers and Jets' },
    { number:9,  name:'Performance' },
  ],
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

function elapsed(startMs: number) {
  const s = Math.floor((Date.now() - startMs) / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

// ─── Phase 1: Reference data ───────────────────────────────────────────────────

async function seedReferenceData() {
  console.log('\n📋  Phase 1 — Seeding reference data\n')

  // Subjects
  const { error: sErr } = await supabase.from('subjects').insert(subjects)
  if (sErr) throw new Error(`Subjects: ${sErr.message}`)
  console.log(`  ✓ ${subjects.length} subjects`)

  const { data: insertedSubjects } = await supabase.from('subjects').select('id, code')
  const subjectMap: Record<string, string> = {}
  insertedSubjects?.forEach(s => { subjectMap[s.code] = s.id })

  // Topics
  const topicRows = Object.entries(topicsData).flatMap(([code, names]) =>
    names.map((name, i) => ({ subject_id: subjectMap[code], name, sort_order: i + 1 }))
  )
  const { error: tErr } = await supabase.from('topics').insert(topicRows)
  if (tErr) throw new Error(`Topics: ${tErr.message}`)
  console.log(`  ✓ ${topicRows.length} topics`)

  // Books
  const bookRows = booksData.map(b => ({
    subject_id: subjectMap[b.code],
    title: b.title, author: b.author,
    licence_types: b.licence_types, sort_order: b.sort_order,
  }))
  const { error: bErr } = await supabase.from('source_books').insert(bookRows)
  if (bErr) throw new Error(`Books: ${bErr.message}`)
  console.log(`  ✓ ${bookRows.length} source books`)

  // Chapters
  const { data: insertedBooks } = await supabase
    .from('source_books').select('id, title, author')

  const chapterRows: any[] = []
  for (const book of (insertedBooks ?? [])) {
    const key = `${book.title}||${book.author}`
    const chapters = chaptersData[key]
    if (!chapters) continue
    chapters.forEach(ch => {
      chapterRows.push({
        book_id: book.id,
        chapter_number: ch.number,
        chapter_name: ch.name,
        sort_order: ch.number,
      })
    })
  }

  if (chapterRows.length) {
    const { error: chErr } = await supabase.from('chapters').insert(chapterRows)
    if (chErr) throw new Error(`Chapters: ${chErr.message}`)
    console.log(`  ✓ ${chapterRows.length} chapters across ${Object.keys(chaptersData).length} books`)
  }

  return subjectMap
}

// ─── Phase 2: Question generation ─────────────────────────────────────────────

interface GeneratedQ {
  question_text: string
  options: { A: string; B: string; C: string; D: string }
  correct_option: 'A' | 'B' | 'C' | 'D'
  explanation: string
  source_chapter: string
  source_page: string
  difficulty: string
}

async function callClaude(
  subjectName: string, bookTitle: string, bookAuthor: string,
  topic: string, difficulty: string, count: number
): Promise<GeneratedQ[]> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4000,
    messages: [{
      role: 'user', content:
`You are an expert aviation examiner creating questions for the DGCA (India) pilot licence exams.

Generate exactly ${count} multiple choice question${count > 1 ? 's' : ''}.
Subject: ${subjectName} | Topic: ${topic} | Book: "${bookTitle}" by ${bookAuthor} | Difficulty: ${difficulty}

Difficulty: easy = factual recall; medium = application/calculation; hard = multi-step/edge cases

EXPLANATION: 5–6 lines in the authoritative voice of "${bookTitle}". Textbook excerpt style.
CITATION: Best estimate of chapter and page in "${bookTitle}". Always provide a number — never "unknown".

Return ONLY a valid JSON array, no markdown, no preamble:
[{"question_text":"...","options":{"A":"...","B":"...","C":"...","D":"..."},"correct_option":"B","explanation":"...","source_chapter":"Chapter 4","source_page":"Page 67","difficulty":"${difficulty}"}]`
    }],
  })
  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  return JSON.parse(text.trim())
}

async function buildChapterMap(bookId: string): Promise<Map<string, string>> {
  const { data: chapters } = await supabase
    .from('chapters').select('id, chapter_name, chapter_number').eq('book_id', bookId)
  const map = new Map<string, string>()
  chapters?.forEach(ch => {
    map.set(ch.chapter_name.toLowerCase(), ch.id)
    map.set(`chapter ${ch.chapter_number}`, ch.id)
  })
  return map
}

function resolveChapterId(sourceChapter: string, chapterMap: Map<string, string>): string | null {
  if (!sourceChapter) return null
  const norm = sourceChapter.toLowerCase()
  for (const [key, id] of chapterMap.entries()) {
    if (norm.includes(key)) return id
  }
  return null
}

async function insertQuestion(
  subjectId: string, topicId: string | null, bookId: string | null,
  chapterMap: Map<string, string>, q: GeneratedQ
): Promise<boolean> {
  const chapterId = bookId ? resolveChapterId(q.source_chapter ?? '', chapterMap) : null
  const { data: inserted, error: qErr } = await supabase.from('questions').insert({
    subject_id: subjectId, topic_id: topicId, source_book_id: bookId,
    chapter_id: chapterId,
    question_text: q.question_text, difficulty: q.difficulty,
    explanation: q.explanation, source_chapter: q.source_chapter,
    source_page: q.source_page, citation_verified: false,
    source_type: 'ai', active: true,
  }).select('id').single()

  if (qErr || !inserted) return false

  const opts = (['A','B','C','D'] as const).map(l => ({
    question_id: inserted.id, option_letter: l,
    option_text: q.options[l], is_correct: l === q.correct_option,
  }))
  const { error: oErr } = await supabase.from('question_options').insert(opts)
  if (oErr) { await supabase.from('questions').delete().eq('id', inserted.id); return false }
  return true
}

async function generateForSubject(subjectCode: string, subjectMap: Record<string, string>) {
  const book = PRIMARY_BOOKS[subjectCode]
  const subjectId = subjectMap[subjectCode]
  const { data: subjectRow } = await supabase.from('subjects').select('name').eq('id', subjectId).single()
  const subjectName = subjectRow?.name ?? subjectCode

  const { data: topics } = await supabase.from('topics').select('id, name')
    .eq('subject_id', subjectId).order('sort_order')
  if (!topics?.length) { console.log('  ⚠ No topics — skipping'); return }

  const { data: bookRow } = await supabase.from('source_books').select('id')
    .eq('subject_id', subjectId).eq('title', book.title).eq('author', book.author).single()
  const bookId = bookRow?.id ?? null
  const chapterMap = bookId ? await buildChapterMap(bookId) : new Map<string,string>()

  const qPerTopic = Math.max(1, Math.ceil(TARGET_PER_SUBJECT / topics.length))
  let total = 0
  let diffIdx = 0

  for (const topic of topics) {
    if (total >= TARGET_PER_SUBJECT) break
    const count = Math.min(qPerTopic, TARGET_PER_SUBJECT - total, BATCH_SIZE)
    const difficulty = DIFFICULTY_CYCLE[diffIdx++ % DIFFICULTY_CYCLE.length]
    let questions: GeneratedQ[] = []
    let attempts = 0
    const t0 = Date.now()

    while (attempts < RETRY_LIMIT && !questions.length) {
      attempts++
      try {
        process.stdout.write(`    ${attempts > 1 ? '[retry] ' : ''}${topic.name} (${difficulty}, ${count}q)... `)
        questions = await callClaude(subjectName, book.title, book.author, topic.name, difficulty, count)
      } catch (err: any) {
        const msg = String(err?.message ?? err).slice(0, 50)
        if (attempts < RETRY_LIMIT) {
          process.stdout.write(`failed (${msg}) — retrying...\n`)
          await sleep(2000)
        } else {
          process.stdout.write(`failed after ${RETRY_LIMIT} attempts — skipped\n`)
        }
      }
    }

    if (!questions.length) continue
    for (const q of questions) {
      if (await insertQuestion(subjectId, topic.id, bookId, chapterMap, q)) total++
    }
    console.log(`✓ ${total} total (${elapsed(t0)})`)
    await sleep(400)
  }
  console.log(`  ✅ ${subjectName} — ${total} questions inserted\n`)
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🛫  ProPilotLicence.com — Setup Script')
  console.log('=======================================')
  console.log(`Target: ~${TARGET_PER_SUBJECT} questions per subject | Batch size: ${BATCH_SIZE}\n`)

  let subjectMap: Record<string, string>
  try {
    subjectMap = await seedReferenceData()
  } catch (err: any) {
    console.error('\n❌ Reference data seeding failed:', err.message)
    console.error('   Ensure the schema SQL (including chapters table) has been run first.')
    process.exit(1)
  }

  console.log('\n🤖  Phase 2 — Generating questions (~5–10 min)\n')
  for (const code of Object.keys(PRIMARY_BOOKS)) {
    const b = PRIMARY_BOOKS[code]
    console.log(`📖  ${code} — "${b.title}" by ${b.author}`)
    await generateForSubject(code, subjectMap)
  }

  const { count } = await supabase.from('questions').select('*', { count:'exact', head:true })
  console.log('🏁  Setup complete')
  console.log(`    Questions: ${count}`)
  console.log('    All active, citations marked approximate — review in /admin')
  console.log('    Next: deploy to Vercel → point propilotlicence.com to deployment')
}

main().catch(err => { console.error('\n❌', err); process.exit(1) })

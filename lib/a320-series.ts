// Single source of truth for the conceptual A320 article series. The shared
// <A320SeriesNav> renders every article's in-page nav from these lists, and the
// procedures series hub lists its upcoming entries from here too.
//
// To publish a new article in a series: add its `slug`. The nav then links it
// automatically everywhere and drops its italic "coming soon" style. No per-article
// edits, and no article can link to an unpublished sibling.
export type A320SeriesItem = { n: number; label: string; slug?: string }

export type A320Series = {
  label: string        // heading shown in the in-article nav
  guideSeries: string  // guide-series URL segment the articles live under (lib/guides.ts)
  items: A320SeriesItem[]
}

// Systems series — lives inside the dgca-exam-guides guide series.
export const A320_SYSTEMS_SERIES: A320Series = {
  label: 'A320 Systems Series',
  guideSeries: 'dgca-exam-guides',
  items: [
    { n: 1, label: 'Hydraulic System — complete guide', slug: 'a320-hydraulic-system' },
    { n: 2, label: 'Autoflight System — AP, FD, ATHR, FCU and FMA logic', slug: 'a320-autoflight-system' },
    { n: 3, label: 'Flight Controls — Normal law, Alternate law and Direct law', slug: 'a320-flight-controls' },
    { n: 4, label: 'Electrical System' },
    { n: 5, label: 'Pneumatics — Air conditioning, Pressurisation and Ventilation' },
    { n: 6, label: 'Engines' },
    { n: 7, label: 'APU' },
    { n: 8, label: 'Fire Fighting' },
    { n: 9, label: 'Landing Gear and Brakes' },
    { n: 10, label: 'Ice and Rain Protection' },
  ],
}

// Operations and procedures series — its own guide series (a320-procedures).
export const A320_PROCEDURES_SERIES: A320Series = {
  label: 'A320 Operations and Procedures Series',
  guideSeries: 'a320-procedures',
  items: [
    { n: 1, label: 'ECAM handling philosophy', slug: 'a320-ecam-handling' },
    { n: 2, label: 'Visual circuit' },
    { n: 3, label: 'Precision approach — ILS and GLS' },
    { n: 4, label: 'Non-precision approaches — VOR, NDB, LOC, RNAV LNAV' },
    { n: 5, label: 'RNP approaches — LNAV/VNAV and LPV' },
    { n: 6, label: 'RNP AR operations' },
  ],
}

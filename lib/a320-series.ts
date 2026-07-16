// Single source of truth for the "A320 Systems Series" — the conceptual series
// of A320 articles that live inside the dgca-exam-guides guide series. The shared
// <A320SeriesNav> renders every article's in-page nav from this list.
//
// To publish a new article in the series: add its `slug`. The nav then links it
// automatically everywhere and drops its italic "coming soon" style. No per-article
// edits, and no article can link to an unpublished sibling.
export type A320SeriesItem = { n: number; label: string; slug?: string }

export const A320_SERIES: A320SeriesItem[] = [
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
]

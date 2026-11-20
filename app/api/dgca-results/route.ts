import { getDgcaResults } from '@/lib/dgca-results'

// The published DGCA result notices, for the updates bar (components/UpdatesBar.tsx), which
// works out its message in the browser. Rebuilt hourly, and straight away when a result row
// changes (revalidateResultPages in lib/dgca-results.ts).
export const dynamic = 'force-static'
export const revalidate = 3600

export async function GET() {
  return Response.json(await getDgcaResults())
}

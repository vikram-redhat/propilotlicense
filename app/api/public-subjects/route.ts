import { publicSubjects } from '@/lib/public-subjects'

// The header's Subjects menu (components/LandingHeader.tsx): the public subject list, with
// each subject's links. Rebuilt hourly, like the counts it filters on.
export const dynamic = 'force-static'
export const revalidate = 3600

export async function GET() {
  const subjects = await publicSubjects()
  return Response.json(subjects.map(({ key, title, href, hrefLoggedIn }) => ({ key, title, href, hrefLoggedIn })))
}

import { notFound } from 'next/navigation'
import { LICENCES } from '@/lib/licence-routes'

// /[licence] catches every top-level path no other route claims, so anything that isn't
// a licence hub 404s here instead of rendering a blank hub with a 200.
export default async function LicenceLayout({ children, params }: {
  children: React.ReactNode
  params: Promise<{ licence: string }>
}) {
  const { licence } = await params
  if (!LICENCES.has(licence)) notFound()
  return children
}

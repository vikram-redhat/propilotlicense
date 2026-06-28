import type { Metadata } from 'next'

const BASE_URL = 'https://propilotlicence.com'

export function buildMetadata({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}): Metadata {
  const url = `${BASE_URL}${path}`
  return {
    title,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'ProPilotLicence',
      type: 'website',
      locale: 'en_IN',
    },
    twitter: { card: 'summary_large_image', title, description },
    robots: { index: true, follow: true },
  }
}

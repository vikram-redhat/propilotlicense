interface Props {
  name: string
  description: string
  url: string
}

export function CourseSchema({ name, description, url }: Props) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    url,
    provider: { '@type': 'Organization', name: 'ProPilotLicence', url: 'https://propilotlicence.com' },
    educationalLevel: 'Professional',
    courseMode: 'online',
    isAccessibleForFree: true,
    offers: [
      { '@type': 'Offer', price: '0', priceCurrency: 'INR', description: 'Free — 10 practice questions' },
      { '@type': 'Offer', price: '250', priceCurrency: 'INR', description: '30-day full access' },
      { '@type': 'Offer', price: '599', priceCurrency: 'INR', description: '90-day full access' },
    ],
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

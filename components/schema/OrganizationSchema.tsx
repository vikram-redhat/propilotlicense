export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ProPilotLicence',
    url: 'https://propilotlicence.com',
    description:
      'DGCA CPL and ATPL theory exam preparation platform. Every question reviewed by a panel of four or more active commercial airline captains before entering the question bank.',
    knowsAbout: [
      'DGCA CPL examination',
      'DGCA ATPL examination',
      'Aviation Meteorology',
      'Air Regulations',
      'Air Navigation',
      'Technical General',
      'Radio Aids and Instruments',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'help@propilotlicence.com',
      contactType: 'customer support',
    },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

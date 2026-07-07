export function WebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ProPilotLicence',
    alternateName: ['ProPilotLicence.com', 'Pro Pilot Licence'],
    url: 'https://propilotlicence.com/',
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

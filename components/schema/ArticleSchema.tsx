interface Props {
  title: string
  description: string
  url: string
  publishedAt: string
  updatedAt: string
}

export function ArticleSchema({ title, description, url, publishedAt, updatedAt }: Props) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    datePublished: publishedAt,
    dateModified: updatedAt,
    author: { '@type': 'Organization', name: 'ProPilotLicence', url: 'https://propilotlicence.com' },
    publisher: { '@type': 'Organization', name: 'ProPilotLicence', url: 'https://propilotlicence.com' },
    reviewedBy: {
      '@type': 'Organization',
      name: 'ProPilotLicence Captain Panel',
      description: 'A panel of four or more active commercial airline captains holding valid DGCA CPL and ATPL licences.',
    },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

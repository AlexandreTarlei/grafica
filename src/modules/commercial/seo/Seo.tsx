import { Helmet } from 'react-helmet-async'
import { env } from '@/core/env'

export type SeoProps = {
  title: string
  description: string
  /** Path absoluto ou URL canónica */
  canonicalPath?: string
  noindex?: boolean
}

const siteOrigin = typeof window !== 'undefined' ? window.location.origin : ''

export function Seo({ title, description, canonicalPath, noindex }: SeoProps) {
  const brand = env.appName || 'SaaS'
  const fullTitle = title.includes(brand) || title.includes('—') ? title : `${title} — ${brand}`
  const canonical = canonicalPath
    ? canonicalPath.startsWith('http')
      ? canonicalPath
      : `${siteOrigin}${canonicalPath.startsWith('/') ? '' : '/'}${canonicalPath}`
    : undefined

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonical ? <link rel="canonical" href={canonical} /> : null}
      {noindex ? <meta name="robots" content="noindex, nofollow" /> : <meta name="robots" content="index, follow" />}
    </Helmet>
  )
}

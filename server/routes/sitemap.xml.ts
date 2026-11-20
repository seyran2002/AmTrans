export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')

  const baseUrl = 'https://amtrans.am'

  const publicRoutes = [
    '',
    '/about-us',
    '/contact-us',
    '/how-to-use',
    '/privacy',
    '/terms',
    '/auth/login',
    '/auth/register'
  ]

  let urlsXml = ''

  for (const route of publicRoutes) {
    const hyUrl = route === '' ? `${baseUrl}/` : `${baseUrl}${route}`
    const enUrl = `${baseUrl}/en${route}`
    const ruUrl = `${baseUrl}/ru${route}`

    // Armenian version (default, no prefix)
    urlsXml += `  <url>
    <loc>${hyUrl}</loc>
    <xhtml:link rel="alternate" hreflang="hy" href="${hyUrl}" />
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="ru" href="${ruUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${hyUrl}" />
  </url>\n`

    // English version (/en)
    urlsXml += `  <url>
    <loc>${enUrl}</loc>
    <xhtml:link rel="alternate" hreflang="hy" href="${hyUrl}" />
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="ru" href="${ruUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${hyUrl}" />
  </url>\n`

    // Russian version (/ru)
    urlsXml += `  <url>
    <loc>${ruUrl}</loc>
    <xhtml:link rel="alternate" hreflang="hy" href="${hyUrl}" />
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="ru" href="${ruUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${hyUrl}" />
  </url>\n`
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlsXml}</urlset>`
})

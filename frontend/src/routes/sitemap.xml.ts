const site = 'https://bogrom.pl';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
    const pages = [
        '/',
        '/windows',
        '/windows/veka',
        '/windows/eko-okna',
        '/windows/kommerling',
        '/doors',
        '/doors/delta',
        '/doors/stalprodukt',
        '/doors/wiked',
        '/others',
        '/others/blinds',
        '/others/sills',
        '/others/garage',
        '/services',
        '/contact',
        '/privacy-policy',
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8" ?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
>
  ${pages
      .map(
          (page) => `
  <url>
    <loc>${site}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === '/' ? '1.0' : '0.8'}</priority>
  </url>
  `
      )
      .join('')}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}

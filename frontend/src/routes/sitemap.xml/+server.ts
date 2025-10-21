import type { RequestHandler } from './$types';

const siteUrl = 'https://bogrom.pl';

const staticPages: string[] = [
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

export const GET: RequestHandler = async () => {
    const sitemap = `<?xml version="1.0" encoding="UTF-8" ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
    .map(
        (page) => `
  <url>
    <loc>${siteUrl}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === '/' ? '1.0' : '0.8'}</priority>
  </url>`
    )
    .join('')}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
};

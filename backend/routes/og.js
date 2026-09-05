import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();
const SITE_URL = 'https://vybebd.store';

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Returns product-type-aware OG title, description, and keywords.
 */
function buildOGMeta(product) {
  const name = product.name;
  const cat  = product.category || '';
  const type = product.productType || 'poster';

  if (type === 'wobbler') {
    return {
      title:    `${name} | Solar Wobbler Bangladesh | VYBE`,
      desc:     (product.shortDescription || `Buy ${name} in Bangladesh. Solar-powered kinetic wobbler — no batteries, just light. Fast delivery, secure checkout.`).slice(0, 200),
      keywords: `${name}, solar wobbler bangladesh, kinetic art, solar toy dhaka, desk decor, buy solar wobbler online`,
    };
  }

  if (type === 'home-decor') {
    return {
      title:    `${name} | Home Decor Bangladesh | VYBE`,
      desc:     (product.shortDescription || product.description || `Buy ${name} online in Bangladesh. Premium home decor, fast delivery.`).slice(0, 200),
      keywords: `${name}, home decor bangladesh, wall decor bd, buy home decor online, ${cat}`,
    };
  }

  // Default: poster
  return {
    title:    `${name} | Buy Poster Online Bangladesh | VYBE`,
    desc:     (product.description || `Premium ${cat} poster from VYBE Bangladesh`).slice(0, 200),
    keywords: `${name}, ${cat} poster, wall art bangladesh, poster bd, buy poster online`,
  };
}

/**
 * GET /api/og/product/:id
 * Returns a minimal HTML page with full OG/Twitter meta tags for social media crawlers.
 * Vercel Edge Middleware rewrites product page requests from bots to this endpoint.
 */
router.get('/product/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .select('name description shortDescription productType category basePrice stock images rating tags')
      .lean();

    if (!product) {
      return res.status(404).send('Not found');
    }

    const { title, desc, keywords } = buildOGMeta(product);
    const titleEsc = escapeHtml(title);
    const descEsc  = escapeHtml(desc);

    const url = `${SITE_URL}/products/${product._id}`;
    const imageUrl = product.images?.[0]?.urls?.large
      || product.images?.[0]?.urls?.medium
      || product.images?.[0]?.url
      || `${SITE_URL}/og-image.jpg`;
    const price   = product.basePrice || 0;
    const inStock = (product.stock || 0) > 0;

    // JSON-LD Product schema
    const jsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.shortDescription || product.description,
      image: product.images?.map(img => img.urls?.large || img.urls?.medium || img.url).filter(Boolean),
      sku: String(product._id),
      brand: { '@type': 'Brand', name: 'VYBE' },
      offers: {
        '@type': 'Offer',
        url,
        priceCurrency: 'BDT',
        price,
        availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        seller: { '@type': 'Organization', name: 'VYBE' },
      },
      ...(product.rating?.count > 0 ? {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.rating.average,
          reviewCount: product.rating.count,
          bestRating: 5,
          worstRating: 1,
        },
      } : {}),
    });

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${titleEsc}</title>
  <meta name="description" content="${descEsc}"/>
  <meta name="keywords" content="${escapeHtml(keywords)}"/>
  <link rel="canonical" href="${escapeHtml(url)}"/>

  <meta property="og:type" content="product"/>
  <meta property="og:site_name" content="VYBE"/>
  <meta property="og:url" content="${escapeHtml(url)}"/>
  <meta property="og:title" content="${titleEsc}"/>
  <meta property="og:description" content="${descEsc}"/>
  <meta property="og:image" content="${escapeHtml(imageUrl)}"/>
  <meta property="og:image:width" content="1200"/>
  <meta property="og:image:height" content="630"/>
  <meta property="product:price:amount" content="${price}"/>
  <meta property="product:price:currency" content="BDT"/>

  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="${titleEsc}"/>
  <meta name="twitter:description" content="${descEsc}"/>
  <meta name="twitter:image" content="${escapeHtml(imageUrl)}"/>

  <script type="application/ld+json">${jsonLd}</script>

  <!-- Redirect browsers (non-bots) to the SPA -->
  <meta http-equiv="refresh" content="0;url=${escapeHtml(url)}"/>
</head>
<body>
  <h1>${titleEsc}</h1>
  <p>${descEsc}</p>
  <img src="${escapeHtml(imageUrl)}" alt="${titleEsc}" width="600"/>
  <p>Price: \u09F3${price}</p>
  <a href="${escapeHtml(url)}">View on VYBE</a>
</body>
</html>`;

    res.set('Content-Type', 'text/html; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(html);
  } catch (error) {
    console.error('OG render error:', error);
    res.status(500).send('Error');
  }
});

export default router;

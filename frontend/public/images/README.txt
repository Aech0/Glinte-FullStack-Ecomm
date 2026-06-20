HERO IMAGES
-----------
Drop your final brand photography in this folder using these exact filenames
so <Hero> picks them up automatically:

  hero-desktop.jpg   2400 × 1100 — banner crop, used on tablet & desktop
  hero-mobile.jpg     900 × 1300 — vertical crop, used on phones

Until those files exist, the site falls back to a brand-coloured placeholder
banner from placehold.co — no broken images.

PRODUCT IMAGES
--------------
Seed product images in backend/data/products.json point at placehold.co URLs
right now. Once you have real photos, use the admin panel (/admin/products)
to swap the URLs — host them on AWS S3 (or any CDN) and paste the URLs in.
The frontend already whitelists *.amazonaws.com in next.config.mjs.

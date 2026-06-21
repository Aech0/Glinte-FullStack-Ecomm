# Glinte — Open Items

Living list of work still ahead. Tick items as we close them.

_Last updated: 2026-06-20 — end of session._

---

## 🔴 Next session — pick up here

- [x] **Shiprocket end-to-end test** — ✅ Live. Test order `#3SA0ZMIU` (Silly Coco × 1, ₹598) completed with Razorpay payment + Shiprocket shipment auto-created from Rewa pickup. Pipeline is fully automated for every future order.

- [ ] **Mobile hero text overlaps the brand wordmark in the background image**
  - On phones, the white "Glossier than glossy." copy sits on top of the large pink "glinte" wordmark watermarked into the photo, causing a visual collision
  - Desktop is fine — issue is mobile-only
  - Likely fix: either reposition copy lower with a stronger gradient mask, or swap the mobile hero image for one without the watermark (owner could supply a cleaner crop), or stack text over a solid darker band
  - Doesn't block launch but the client flagged it — fix before final hand-off

- [ ] **DNS at GoDaddy — connect `glinte.in`** (do this last)
  - Three records: `A @ → Netlify`, `CNAME www → glintelipglaze.netlify.app`, `CNAME api → glinte-fullstack-ecomm-production.up.railway.app`
  - Add custom domain in Netlify (auto-SSL) and Railway (`api.glinte.in`)
  - Update Netlify env `NEXT_PUBLIC_SITE_URL=https://glinte.in` → redeploy
  - Update Railway env `FRONTEND_ORIGIN=https://glinte.in,https://www.glinte.in`
  - Wait for DNS propagation (10 min – 4 hrs)
  - Needs client's GoDaddy access — schedule with owner

## 🟡 After DNS — go-live tasks

- [ ] **Submit `glinte.in` + 4 policy URLs to Razorpay** for website verification (24–48 hr wait)
  - URLs: `/`, `/privacy`, `/terms`, `/refund`, `/shipping`
- [ ] **Razorpay live keys** — generate after website approval; swap on Netlify + Railway
- [ ] **Tighten MongoDB Atlas IP allow-list** — keep `0.0.0.0/0` on Railway Hobby (dynamic egress IPs). Switch to specific IPs only if upgrading to Railway Pro for static IPs.
- [ ] **Write the client handover doc** (`HANDOVER.md`)
  - Admin login + how to rotate password
  - How to add new products (S3 image upload → admin panel URL paste)
  - How to enable Shiprocket fully once KYC complete
  - How to handle stuck/old orders manually
  - Where to look in Atlas / Railway / Netlify dashboards
  - 1-month post-launch support contact + scope

## 🟢 Future scope (post-launch, not blocking)

- [ ] Real `/api/contact` endpoint (replace the `mailto:` on Contact page)
- [ ] Customer-side order cancel button (for orders not yet dispatched)
- [ ] "Forgot password" flow
- [ ] Saved address book in account
- [ ] Wishlist / save-for-later
- [ ] Newsletter signup (Mailchimp or similar)
- [ ] Product reviews / ratings
- [ ] Coupon codes
- [ ] Analytics (GA4 / Meta Pixel) once IDs are available
- [ ] Admin role promotion endpoint (so role changes don't require sign-out/in)
- [ ] Auto-cancel `pending_payment` orders older than 30 min (cron)
- [ ] Source a mobile hero photo without the wordmark watermark (or design a clean overlay) — see hero issue above

## 🧪 Known small things we accepted

- The first test order in Atlas (`pending_payment`) is a stuck artefact — clean up via admin or DB later
- M0 free MongoDB Atlas auto-pauses after 7 days of inactivity. Resume from Atlas dashboard if you see DNS-resolve errors after a long break. Paid tier ($9/mo) avoids this — recommended once revenue starts.
- Mongo writes use a per-collection lock at the route level — fine for current traffic, revisit if write contention shows up
- Shiprocket API user is registered under Vansh's email (sole dev). Customers never see it — Shiprocket's customer-facing emails come from their own `noreply@shiprocket.com` with the owner's brand info. If dev role transfers later, recreate the API user under a brand-owned address.

---

## ✅ Completed (this session — 2026-06-20)

- Razorpay test integration debugged + working end-to-end in production
- GitHub monorepo created: `Aech0/Glinte-FullStack-Ecomm`
- Backend deployed to Railway with all env vars (port 8080, MongoDB Atlas, JWT, Razorpay test keys)
- Frontend deployed to Netlify with Next.js plugin (`netlify.toml` added at repo root)
- Netlify ↔ Railway CORS allow-list configured
- Admin password tightened (no longer `admin123`)
- Mobile hero text legibility improved (dark gradient + light text on mobile only)
- "Pantone Pink Cherub" eyebrow removed from hero
- "Finish" filter removed from sidebar
- Filter UX overhauled: mobile gets a slide-in drawer with active-filter count badge; desktop sidebar unchanged
- Hero, Brand strip, About-us tile carousel, Brand story all live and rendering S3 images
- Shiprocket API user created; env vars added to Railway (awaiting pickup verification + smoke test)

## ✅ Completed (earlier sessions)

- Full scaffold: Next.js 14 + Tailwind frontend; Express + Mongoose backend
- 10 lip gloss SKUs seeded into Mongo with real S3 image URLs
- MongoDB Atlas connected (`glinte` cluster, Mumbai region)
- S3 bucket policy opened for `resources/back/imgs/*` — images publicly readable
- 4 policy pages live (Privacy / Terms / Refund / Shipping) with brand voice
- Footer Legal column wired to policy pages
- Rate-limit on `/api/auth/login` (10 / 15 min) and `/api/auth/register` (5 / hour)
- `helmet` security headers, `trust proxy: 1` for Railway
- Open Graph + Twitter meta + favicon (S3 logo)
- `sitemap.xml` and `robots.txt` (admin/account/cart paths excluded)
- FAQ rewritten in brand voice with owner's 11 product Qs + 5 ops Qs
- Contact email updated to `glintelipglaze@gmail.com` everywhere
- Vertical mobile hero image wired
- Logo wired into Navbar + Footer (S3 hosted)

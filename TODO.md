# Glinte — Open Items

Living list of work still ahead. Tick items as we close them.

## 🔴 Blocking launch

- [ ] **Payment issue — payments failing** (added 2026-06-12)
  - Symptoms: TBD — capture exact error message, browser console, backend logs
  - Was working end-to-end the previous session (two test orders in Atlas, one `pending_payment`, one `fulfilment_pending`)
  - First debug step when we return: check whether anything in `backend/.env` (Razorpay keys, JWT_SECRET) changed; restart both servers; reproduce with browser devtools open and capture the failing request/response
- [ ] **Shiprocket setup** (client-side)
  - KYC verification
  - Wallet recharge (min ₹200, ₹50 cashback offer available)
  - Add first pickup address in Shiprocket → Settings → Pickup Addresses
  - Generate API password → paste into `backend/.env` (`SHIPROCKET_EMAIL`, `SHIPROCKET_PASSWORD`, `SHIPROCKET_PICKUP_LOCATION`)
- [ ] **Razorpay live mode** — needs all 4 policy URLs (now live in code, deploy will publish them)
  - Privacy: `/privacy`
  - Terms: `/terms`
  - Refund: `/refund`
  - Shipping: `/shipping`

## 🟡 Pre-launch hardening (code-side, ready to deploy)

- [x] Privacy / Terms / Refund / Shipping pages
- [x] Footer Legal column linking the four policies
- [x] Rate-limit on `/api/auth/login` (10 / 15 min) and `/api/auth/register` (5 / hour)
- [x] CORS allow-list driven by `FRONTEND_ORIGIN` (comma-separated)
- [x] `helmet` security headers, `trust proxy` for Railway
- [x] Open Graph + Twitter meta for share previews
- [x] `sitemap.xml` (auto-generated, includes all 10 product slugs)
- [x] `robots.txt` (blocks `/admin`, `/account`, `/api`, `/cart`, `/checkout`)
- [x] Favicon wired to S3 logo

## 🚀 Deployment

- [ ] Push repo to GitHub
- [ ] Netlify connect → `frontend/` → env vars set → deploy
- [ ] Railway connect → `backend/` → env vars set → deploy
- [ ] GoDaddy DNS: `glinte.in` → Netlify, `api.glinte.in` → Railway
- [ ] Tighten MongoDB Atlas IP allowlist to Railway egress + owner home IP (remove `0.0.0.0/0`)
- [ ] Swap Razorpay keys to `rzp_live_…` on both Netlify + Railway after KYC clears

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

## 🧪 Known small things we accepted

- The first test order in Atlas (`pending_payment`) is a stuck artefact — clean up via admin or DB later
- M0 free MongoDB Atlas auto-pauses after 7 days of inactivity. If launch slips, paid tier ($9/mo) avoids this.
- Mongo writes use a per-collection lock at the route level — fine for current traffic, revisit if write contention shows up

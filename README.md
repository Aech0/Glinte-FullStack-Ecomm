# Glinte

Custom e-commerce site for **Glinte**, a small-batch lip gloss brand.
Two halves of the codebase mirror the deployment plan in the proposal:

| | Folder | Tech | Runs on |
|---|---|---|---|
| Frontend | `frontend/` | Next.js 14 (App Router) + Tailwind | http://localhost:3000 |
| Backend  | `backend/`  | Express + JSON file store + Razorpay + Shiprocket | http://localhost:4000 |

Data lives in `backend/data/*.json` for now. Migrating to MongoDB Atlas later
is a one-file change in `backend/src/db.js` — every route already touches data
only through that helper.

---

## 1. Prerequisites

- **Node.js 18.17 or newer** (`node --watch` and global `fetch` need it).
  Check with `node -v`. Install from [nodejs.org](https://nodejs.org/).
- A terminal (Git Bash, PowerShell, or Windows Terminal — all fine).

You **don't** need MongoDB, Docker, or anything else right now.

## 2. Install dependencies

Open two terminals from this folder.

```bash
# Terminal 1 — backend
cd backend
npm install

# Terminal 2 — frontend
cd frontend
npm install
```

## 3. Set up environment variables

### Backend (`backend/.env`)

Copy the example and fill in real values:

```bash
cd backend
cp .env.example .env       # Windows: copy .env.example .env
```

Then edit `.env`:

```env
PORT=4000
FRONTEND_ORIGIN=http://localhost:3000

JWT_SECRET=<paste any long random string here>

# From https://dashboard.razorpay.com/app/keys (Test Mode is fine)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx

# From https://app.shiprocket.in/api-user
SHIPROCKET_EMAIL=you@example.com
SHIPROCKET_PASSWORD=your-shiprocket-api-password
SHIPROCKET_PICKUP_LOCATION=Primary

# Auto-created admin on first server boot if no users exist yet
SEED_ADMIN_EMAIL=admin@glinte.in
SEED_ADMIN_PASSWORD=admin123
```

Until you add Razorpay/Shiprocket creds the rest of the site still works —
you just can't complete a checkout. The site itself, browsing, cart, login,
admin all work with no external services.

### Frontend (`frontend/.env.local`)

```bash
cd ../frontend
cp .env.local.example .env.local      # Windows: copy .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

> ⚠️ Use the **same** `KEY_ID` you put in the backend. The secret stays
> on the backend only — never expose it.

## 4. Run

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

Open **http://localhost:3000**.

The backend logs the seeded admin credentials on first boot —
default `admin@glinte.in / admin123`. Visit `/login`, sign in, and you'll see
an **Admin** link in the navbar leading to `/admin`.

---

## What's wired up

| Feature | Status | Notes |
|---|---|---|
| Hero (responsive desktop + mobile banner) | ✅ | Drop `hero-desktop.jpg` and `hero-mobile.jpg` into `frontend/public/images/` |
| Product grid + filters (shade family, finish, price, stock) | ✅ | Sidebar left, 3-up tiles on desktop, 2-up on mobile |
| Product detail page (gallery, variants info, add-to-cart) | ✅ | 4 placeholder images per product |
| Server-side cart (anon cookie + login merge) | ✅ | Cart persists across sessions, logins, devices |
| Out-of-stock handling in cart | ✅ | Item flagged, can't checkout until removed |
| Razorpay checkout (test mode) | ✅ | Order creation → modal → signature verify |
| Shiprocket order create on payment | ✅ | Auto-fired after `/razorpay/verify` |
| Customer auth + order history | ✅ | JWT, bcrypt, 30-day expiry |
| Admin dashboard | ✅ | `/admin` — products CRUD + order list + status updates |
| About / FAQ / Contact | ✅ | Contact form opens user's mail client (swap to /api/contact when SMTP wired) |

## Project layout

```
glinte/
├── backend/
│   ├── data/                  ← JSON file "database"
│   │   ├── products.json      (10 seed lip gloss SKUs, swap with admin UI)
│   │   ├── users.json
│   │   ├── carts.json
│   │   └── orders.json
│   └── src/
│       ├── server.js          (Express bootstrap + admin seeding)
│       ├── db.js              (file store; swap this for Mongoose later)
│       ├── middleware/        (JWT auth + admin guard)
│       ├── routes/            (auth, products, cart, orders, razorpay, admin)
│       └── services/          (Razorpay client + Shiprocket client)
└── frontend/
    └── src/
        ├── app/               (Next.js App Router pages)
        ├── components/        (Navbar, Footer, Hero, ProductCard, FilterSidebar, …)
        └── lib/               (api wrapper, auth + cart React contexts, types)
```

## Test cards & UPI for Razorpay sandbox

- **Card:** `4111 1111 1111 1111`, any future expiry, any CVV
- **UPI:** `success@razorpay`
- Full list: [razorpay.com/docs/payments/payments/test-card-details](https://razorpay.com/docs/payments/payments/test-card-details/)

## Going live — what changes

1. **Database** — Replace the file-based helpers in `backend/src/db.js` with
   Mongoose models pointed at MongoDB Atlas. No route file needs to change.
2. **Image hosting** — Upload product photos to AWS S3 and paste the URLs
   into the admin panel. `next.config.mjs` already permits `*.amazonaws.com`.
3. **Hero images** — Drop the real banner photos into `frontend/public/images/`.
4. **Razorpay** — Switch the keys from test mode (`rzp_test_…`) to live
   (`rzp_live_…`) in both `.env` files. No code changes.
5. **Shiprocket** — Set up your real pickup address in the Shiprocket dashboard,
   point `SHIPROCKET_PICKUP_LOCATION` at its nickname.
6. **Deploy** — Frontend → Netlify (`cd frontend && netlify init`).
   Backend → Railway (point at `backend/`, expose port 4000).
7. **Domain** — Point `glinte.in` at Netlify, add `api.glinte.in` for Railway,
   update `NEXT_PUBLIC_API_URL` and `FRONTEND_ORIGIN` accordingly.

## Things you provide

- [ ] Razorpay test keys (Key ID + Key Secret)
- [ ] Shiprocket API email + password (and pickup-address nickname)
- [ ] Real hero photography (`hero-desktop.jpg`, `hero-mobile.jpg`)
- [ ] Real product photography (4 per SKU recommended)
- [ ] Final product copy (names, shade descriptions, ingredients) — or edit
      via `/admin/products`
- [ ] (Later, for go-live) MongoDB Atlas connection string + AWS S3 bucket

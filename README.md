# Dealer Site

Lead-generation website for a manufactured and tiny home dealership. Visitors browse inventory, request quotes, and submit inquiries; admins manage listings and site content from a dashboard.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 16 (App Router), React 19, Tailwind CSS |
| Backend | Express.js, JWT auth |
| Database | PostgreSQL |

## Project structure

```
DEALER SITE/
├── backend/     Express API (port 5000)
└── frontend/    Next.js app (port 3000)
```

There is no root `package.json` — run each app from its own folder.

## Local setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### 1. Database

```bash
cd backend
cp .env.example .env
# Edit .env with your PostgreSQL password and a strong JWT_SECRET

npm install
npm run db:create    # creates dealer_site database (first time only)
npm run db:init      # schema + seed data
npm run db:migrate   # apply any additional migrations
npm run db:verify    # optional sanity check
```

Default admin login (change before production):

- **Email:** `admin@dealersite.com`
- **Password:** `ChangeMeNow!2025`

### 2. Backend

```bash
cd backend
npm run dev
```

API runs at `http://localhost:5000`. Health check: `GET /api/health`.

### 3. Frontend

```bash
cd frontend
cp .env.local.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:5000/api

npm install
npm run dev
```

Site runs at `http://localhost:3000`. Admin panel: `/admin/login`.

## Email notifications (optional)

When someone submits a contact form, property inquiry, or quote request, the backend can email your team.

1. Copy SMTP settings into `backend/.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
MAIL_FROM=noreply@yourdomain.com
NOTIFY_EMAIL=info@yourdomain.com
```

2. Restart the backend.

Without SMTP configured, notifications are **logged to the backend console** only (no email sent). This is fine for local development.

**Gmail tip:** Use an [App Password](https://support.google.com/accounts/answer/185833), not your regular Gmail password.

## Admin features

| Section | Path | What you can edit |
|---------|------|-------------------|
| Overview | `/admin` | Dashboard stats |
| Properties | `/admin/properties` | Listings, images, virtual tour, floor plan PDF |
| Inquiries | `/admin/inquiries` | Contact & property inquiries |
| Leads | `/admin/leads` | Quote & newsletter leads |
| Home Page | `/admin/home` | Hero text, trust signals |
| Testimonials | `/admin/testimonials` | Customer reviews carousel |
| Team | `/admin/team` | Team members & photos |
| Resources | `/admin/resources` | Blog-style articles |
| FAQs | `/admin/faqs` | Frequently asked questions |
| Pages | `/admin/pages` | About & Financing page content |
| Site Settings | `/admin/settings` | Site name, logo, contact info |

## Public routes

- `/` — Home
- `/inventory` — Browse homes (category, sort, **text search**)
- `/homes/[slug]` — Property detail (gallery, specs, virtual tour, floor plan)
- `/contact` — General contact form
- `/request-quote` — Financing quote request
- `/about`, `/financing` — Content pages
- `/resources`, `/resources/[slug]`, `/resources/faqs`

## Deployment

### Recommended layout

1. **PostgreSQL** — [Supabase](https://supabase.com), [Neon](https://neon.tech), or [Railway](https://railway.app) managed Postgres
2. **Backend** — [Railway](https://railway.app), [Render](https://render.com), or a VPS running Node
3. **Frontend** — [Vercel](https://vercel.com) (ideal for Next.js)

### Backend (example)

1. Copy `backend/.env.example` and set the same variables on your host.
2. Set `NODE_ENV=production`. The API **refuses to start** without a real `JWT_SECRET` and `CLIENT_URL`.
3. Set `CLIENT_URL` to your frontend origin(s) as a comma-separated list (for example `https://yourdomain.com,https://your-preview.vercel.app`). Localhost is **not** auto-allowed in production.
4. Run migrations against production DB:

   ```bash
   npm run db:migrate
   ```

5. **Persist uploads** (pick one):

   - **Volume (simple):** Mount a persistent volume and set `UPLOAD_DIR` to that path (e.g. `/data/uploads`). Files are served at `/uploads/...`.
   - **Object storage (recommended):** Set `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, and usually `S3_PUBLIC_URL` (works with AWS S3, Cloudflare R2, MinIO, etc.). See `backend/.env.example`.

6. Start with `npm start`.

### Frontend (Vercel example)

1. Import the `frontend` folder as a Vercel project.
2. Copy from `frontend/.env.local.example` and set `NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api`.
3. If using S3/R2/CDN for images, set `NEXT_PUBLIC_IMAGE_HOSTS` to those hostnames (comma-separated). `next.config.mjs` also picks up the API host from `NEXT_PUBLIC_API_URL`.
4. Deploy.

### Production checklist

- [ ] Change default admin password (`admin@dealersite.com` / `ChangeMeNow!2025` from seed)
- [ ] Set a long random `JWT_SECRET` (required — server exits without it)
- [ ] Set `CLIENT_URL` to production frontend origin(s) (required)
- [ ] Persist uploads via volume or S3
- [ ] Configure SMTP for real email alerts
- [ ] Set real contact details in **Admin → Site Settings**
- [ ] Use HTTPS everywhere
- [ ] Run `npm run db:migrate` on production database
- [ ] Back up PostgreSQL regularly
## Useful scripts

**Backend** (`cd backend`):

| Command | Description |
|---------|-------------|
| `npm run dev` | Start API with nodemon |
| `npm run db:init` | Reset schema + seed (destructive) |
| `npm run db:migrate` | Apply SQL migrations |
| `npm run db:verify` | Verify tables and seed data |

**Frontend** (`cd frontend`):

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve production build |

## License

Private project — all rights reserved.

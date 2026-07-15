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
cp .env.local.example .env.local   # if present; otherwise create:
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

1. Set environment variables on your host (same as `backend/.env.example`).
2. Set `NODE_ENV=production` and `CLIENT_URL` to your frontend origin(s) as a comma-separated list (for example `https://yourdomain.com,https://your-preview.vercel.app`).
3. Run migrations against production DB:

   ```bash
   npm run db:migrate
   ```

4. Ensure the `uploads/` directory is writable and persisted (volume or object storage). Uploaded images are served from `/uploads/...`.

5. Start with `npm start`.

### Frontend (Vercel example)

1. Import the `frontend` folder as a Vercel project.
2. Set `NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api`.
3. Add your API host to `next.config.mjs` `images.remotePatterns` if using Next Image for uploads.
4. Deploy.

### Production checklist

- [ ] Change default admin password
- [ ] Use a long random `JWT_SECRET`
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

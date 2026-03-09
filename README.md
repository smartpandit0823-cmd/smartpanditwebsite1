# SmartPandit Admin Panel

Production-ready admin panel and backend for SmartPandit spiritual marketplace.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Database:** MongoDB Atlas (Mongoose)
- **Storage:** AWS S3 (images, videos)
- **Auth:** NextAuth.js v5 (Credentials, admin-only)
- **Payments:** Razorpay
- **UI:** Tailwind CSS + Shadcn-style components + Recharts

## Quick Start

### 1. Environment

```bash
cp .env.example .env.local
# Edit .env.local with your MongoDB URI, AWS keys, Razorpay keys, etc.
```

### 2. Install & Run

```bash
npm install
npm run seed    # Seed admin user + sample data (requires MONGODB_URI)
npm run dev     # http://localhost:3000
```

### 3. Login

- **URL:** `/login`
- **Default admin:** `admin@smartpandit.com` / `Admin@123456` (created by seed; credentials live only in DB)

- **API errors:** Terminal/console pe `[API ERROR]` logs dikhenge jab koi API fail hogi (path, message, stack). See `src/lib/api-logger.ts`.

- **Puja sections:** Admin me puja add/edit karne ke liye saare sections — see `docs/PUJA_SECTIONS.md`.

## Vercel Deployment

1. Push this repository to GitHub.
2. Import the repo into Vercel as a Next.js project.
3. Copy values from `.env.example` into Vercel Project Settings -> Environment Variables.
4. Set `NEXTAUTH_URL` and `NEXT_PUBLIC_BASE_URL` to your production domain.
5. Redeploy after adding env vars.

Recommended:

- Use Node.js 20+ on Vercel.
- Keep MongoDB Atlas, AWS S3, Razorpay, Firebase, and Delhivery credentials in Vercel envs only.
- Do not commit real `.env.local` or production secrets.

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/          # Login page
│   ├── admin/                 # Admin dashboard
│   │   ├── pujas/             # Puja CRUD
│   │   ├── puja-requests/     # Booking requests
│   │   ├── products/          # Product catalog
│   │   ├── astrology/         # Astrology requests
│   │   ├── pandits/           # Pandit management
│   │   ├── customers/         # Customer management
│   │   ├── transactions/     # Payment logs
│   │   ├── coupons/           # Coupon codes
│   │   ├── reviews/           # Review moderation
│   │   ├── blogs/             # Blog CMS
│   │   ├── banners/           # Banners
│   │   ├── calendar/          # Festival / Muhurat
│   │   ├── notifications/     # Bulk notifications
│   │   ├── audit-logs/        # Activity trail
│   │   └── settings/          # Site config
│   └── api/
│       ├── auth/[...nextauth]/
│       ├── admin/upload/       # S3 presigned URL
│       └── webhooks/razorpay/
├── components/
│   ├── admin/                 # Admin layout (Sidebar, Header)
│   └── ui/                    # Reusable UI (Button, Card, Table, etc.)
├── lib/
│   ├── db/mongodb.ts          # MongoDB connection
│   ├── s3/upload.ts           # AWS S3 presigned URL
│   ├── auth/options.ts        # NextAuth config
│   └── razorpay/index.ts      # Razorpay SDK
├── models/                    # Mongoose schemas (16 models)
├── repositories/              # Data access layer
├── services/                  # Analytics, Audit
├── schemas/                   # Zod validation
├── actions/                   # Server actions
└── types/
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `AUTH_SECRET` | NextAuth secret (min 32 chars) |
| `NEXTAUTH_URL` | App URL (e.g. http://localhost:3000) |
| `AWS_ACCESS_KEY_ID` | AWS S3 access key |
| `AWS_SECRET_ACCESS_KEY` | AWS S3 secret |
| `AWS_REGION` | e.g. ap-south-1 |
| `AWS_S3_BUCKET` | S3 bucket name |
| `RAZORPAY_KEY_ID` | Razorpay key |
| `RAZORPAY_KEY_SECRET` | Razorpay secret |
| `RAZORPAY_WEBHOOK_SECRET` | Optional, for webhook verification |

## Core Modules

1. **Puja Management** — CRUD, 3-tier packages, samagri, SEO, images
2. **Puja Requests** — Assign pandit, status flow, payment tracking
3. **Products** — Inventory, variants, spiritual fields, low-stock alerts
4. **Astrology Requests** — Assign astrologer, session scheduling
5. **Pandits** — Profile, verification, availability, payout
6. **Dashboard** — Revenue, bookings, top pujas, pandit performance, low stock

## Scripts

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run seed` — Seed admin + sample data

## License

Private - SmartPandit

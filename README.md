# SmartPandit Admin Panel

Production-ready admin panel and backend for SmartPandit spiritual marketplace.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Database:** MongoDB Atlas (Mongoose)
- **Storage:** AWS S3 (images, videos)
- **Auth:** NextAuth.js v5 (Credentials, admin-only)
- **Payments:** Razorpay
- **Integrations:** Google OAuth/Maps, Firebase Admin, Delhivery
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
   - On Vercel these are typically the same (`https://yourdomain.com`).
   - Behind a proxy/load balancer they can differ: `NEXTAUTH_URL=http://internal:3000` and `NEXT_PUBLIC_BASE_URL=https://yourdomain.com`.
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
| `JWT_SECRET` | JWT signing secret for custom user sessions |
| `NEXTAUTH_URL` | Server-side only URL used by NextAuth for callback URLs and internal operations. Can be an internal-facing URL when behind a proxy/load balancer (e.g. `http://internal:3000`). |
| `NEXT_PUBLIC_BASE_URL` | Public-facing URL exposed to the browser for client-side links. Must be the public domain users visit (e.g. `https://yourdomain.com`). |
| `AWS_ACCESS_KEY_ID` | AWS S3 access key |
| `AWS_SECRET_ACCESS_KEY` | AWS S3 secret |
| `AWS_REGION` | AWS region (e.g. `ap-south-1`) |
| `AWS_S3_BUCKET` | S3 bucket name |
| `RAZORPAY_KEY_ID` | Razorpay server key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay server key secret |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay webhook signing secret |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Public Razorpay key ID used in checkout |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID for server-side verification |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Public Google OAuth client ID for browser login |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps JavaScript API key used by admin and user address maps. **Security:** This key is exposed to the browser — configure HTTP referrer restrictions and enable only Maps APIs in [Google Cloud Console](https://cloud.google.com/docs/authentication/api-keys#securing_an_api_key) to prevent abuse. |
| `FIREBASE_PROJECT_ID` | Firebase project ID for OTP verification |
| `FIREBASE_CLIENT_EMAIL` | Firebase Admin service account client email |
| `FIREBASE_PRIVATE_KEY` | Firebase Admin private key with escaped newlines |
| `DELHIVERY_API_TOKEN` | Delhivery API token |
| `DELHIVERY_BASE_URL` | Delhivery API base URL |
| `DELHIVERY_PICKUP_LOCATION` | Delhivery pickup location name configured in your account |
| `DELHIVERY_ORIGIN_PINCODE` | Origin pincode used for delivery estimates |
| `NEXT_PUBLIC_DELHIVERY_PICKUP` | Public pickup label shown in admin settings UI |
| `NEXT_PUBLIC_DELHIVERY_ORIGIN` | Public origin pincode shown in admin settings UI |
| `MSG91_AUTH_KEY` | MSG91 API auth key for OTP sending |
| `MSG91_TEMPLATE_ID` | MSG91 OTP template ID |

> **Security note:** Any variable prefixed with `NEXT_PUBLIC_` is bundled into the browser JS and visible to end users. For API keys like `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` and `NEXT_PUBLIC_RAZORPAY_KEY_ID`, always configure restrictions (HTTP referrer, allowed APIs) in the respective cloud console to prevent abuse and unexpected billing.

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

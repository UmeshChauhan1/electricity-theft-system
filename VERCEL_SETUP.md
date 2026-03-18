# Vercel Deployment Guide — Electricity Theft Detection System

## Prerequisites

- A GitHub account with the repository pushed
- A [Vercel](https://vercel.com) account (free tier works)
- A PostgreSQL database (Vercel Postgres, Neon, or Supabase)

---

## Step 1 — Import Project on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"** and select `electricity-theft-system`
3. Vercel will auto-detect the **Next.js** framework

---

## Step 2 — Create a Database

### Option A: Vercel Postgres (recommended)

1. In your Vercel project, open the **Storage** tab
2. Click **"Create Database"** → **"Postgres"**
3. Give it a name (e.g. `electricity-theft-db`) and click **Create**
4. Vercel automatically sets `DATABASE_URL` in your project's environment variables

### Option B: External database (Neon / Supabase)

1. Sign up at [neon.tech](https://neon.tech) or [supabase.com](https://supabase.com)
2. Create a new PostgreSQL project and copy the connection string
3. Add it manually as `DATABASE_URL` in Vercel (see Step 3)

---

## Step 3 — Set Environment Variables

In your Vercel project go to **Settings → Environment Variables** and add:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Random secret ≥ 32 chars (`openssl rand -base64 32`) |
| `SMTP_HOST` | SMTP server host (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | SMTP port (e.g. `587`) |
| `SMTP_USER` | SMTP username / email address |
| `SMTP_PASSWORD` | SMTP password or App Password |
| `SMTP_FROM` | Sender display name and address |
| `NEXT_PUBLIC_API_URL` | Your Vercel deployment URL |
| `TWILIO_ACCOUNT_SID` | *(optional)* Twilio SID for WhatsApp |
| `TWILIO_AUTH_TOKEN` | *(optional)* Twilio auth token |
| `TWILIO_WHATSAPP_FROM` | *(optional)* Twilio WhatsApp number |

See `.env.production.example` for a full template with descriptions.

---

## Step 4 — Deploy

Click **"Deploy"** in the Vercel dashboard. The build command in `vercel.json` runs:

```
prisma generate && next build
```

---

## Step 5 — Initialize the Database

After the first successful deployment, run the following locally with your production `DATABASE_URL`:

```bash
# Copy the example and fill in values
cp .env.production.example .env.local
# edit .env.local with your production DATABASE_URL

npx prisma db push      # applies the Prisma schema to the database
npm run db:seed         # seeds initial data (admin user, sample records)
```

---

## Step 6 — Verify

1. Open your Vercel deployment URL
2. Log in with the seeded admin credentials
3. Check that meter readings, alerts, and notifications work end-to-end

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Build fails with Prisma error | Ensure `DATABASE_URL` is set; run `prisma generate` before `next build` (already in `vercel.json`) |
| Database connection refused | Verify connection string format and that the DB allows connections from Vercel IPs |
| Emails not sending | Enable Gmail 2FA and use an App Password; verify all `SMTP_*` vars are set |
| `NEXT_PUBLIC_API_URL` wrong | Update the variable in Vercel with the correct deployment URL and redeploy |

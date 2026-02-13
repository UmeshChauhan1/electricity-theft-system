# 🚀 QUICK DEPLOYMENT GUIDE

## Option 1: Deploy to Vercel with Vercel Postgres (EASIEST)

### Step 1: Push to GitHub
```bash
cd electricity-theft-system
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### Step 3: Add Vercel Postgres Database
1. In your Vercel project, go to "Storage" tab
2. Click "Create Database" → Select "Postgres"
3. Click "Create"
4. Environment variables (`DATABASE_URL`, `POSTGRES_URL`, etc.) are auto-added

### Step 4: Add Other Environment Variables
In Vercel Dashboard → Settings → Environment Variables, add:

```
JWT_SECRET=your-super-secret-key-change-this
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=PSPCL <noreply@pspcl.gov.in>
```

(Optional: Add Twilio variables for WhatsApp)

### Step 5: Run Database Setup
```bash
# Pull environment variables locally
vercel env pull .env.local

# Push database schema
npm run db:push

# Seed with sample data
npm run db:seed
```

### Step 6: Redeploy
```bash
vercel --prod
```

Your app is now live! 🎉

---

## Option 2: Local Development

### Step 1: Setup PostgreSQL
```bash
# Install PostgreSQL (if not installed)
# Then create database
createdb electricity_theft_db
```

### Step 2: Configure Environment
```bash
# Copy example env file
cp .env.example .env

# Edit .env and set your DATABASE_URL
# Example: DATABASE_URL="postgresql://user:password@localhost:5432/electricity_theft_db"
```

### Step 3: Install and Setup
```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

Visit http://localhost:3000

---

## 📧 Email Setup (Gmail)

1. Go to Google Account settings
2. Enable 2-Factor Authentication
3. Go to Security → 2-Step Verification → App passwords
4. Generate an app password
5. Use that 16-character password as `SMTP_PASSWORD`

---

## 📱 WhatsApp Setup (Twilio) - OPTIONAL

1. Sign up at https://www.twilio.com
2. Get Account SID and Auth Token from console
3. For testing: Use Twilio WhatsApp Sandbox
   - Go to Messaging → Try it out → Send a WhatsApp message
   - Send the join code to Twilio's number
4. Add to environment variables:
   ```
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
   ```

---

## 🧪 Test the API

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pspcl.gov.in","password":"password123"}'
```

### Get Regions (with auth token)
```bash
curl http://localhost:3000/api/regions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Submit Meter Reading (will auto-detect theft)
```bash
curl -X POST http://localhost:3000/api/readings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "regionId": "REGION_ID_FROM_DB",
    "inputKwh": 1000,
    "outputKwh": 600
  }'
```

---

## 🎯 What Happens When You Submit a Reading?

1. **Algorithm analyzes** the input vs output
2. **If theft detected** (> 12% loss):
   - Alert is created automatically
   - Inspector is assigned
   - Email notification sent
   - WhatsApp notification sent (if configured)
3. **Inspector can then**:
   - View alert in dashboard
   - Approve alert → sends notification to authorities
   - Dispatch team → assigns field investigation
   - Mark as resolved when complete

---

## 📊 Default Users

After running `npm run db:seed`:

| Email | Password | Role |
|-------|----------|------|
| admin@pspcl.gov.in | password123 | ADMIN |
| inspector1@pspcl.gov.in | password123 | INSPECTOR |
| inspector2@pspcl.gov.in | password123 | INSPECTOR |
| dispatcher@pspcl.gov.in | password123 | DISPATCHER |

**⚠️ IMPORTANT: Change these in production!**

---

## 🔧 Useful Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Push database schema
npm run db:push

# Seed database
npm run db:seed

# Open Prisma Studio (database GUI)
npm run db:studio

# Deploy to Vercel
vercel --prod
```

---

## ✅ Checklist

Before deploying to production:

- [ ] Changed default passwords
- [ ] Set strong JWT_SECRET
- [ ] Configured real SMTP server
- [ ] (Optional) Setup Twilio for WhatsApp
- [ ] Tested all API endpoints
- [ ] Verified database connection
- [ ] Checked notification delivery
- [ ] Reviewed security settings

---

## 🆘 Need Help?

1. Check README.md for detailed documentation
2. Review API logs in Vercel dashboard
3. Use Prisma Studio to inspect database: `npm run db:studio`
4. Test API endpoints with Postman or curl

---

**Your electricity theft detection system is ready! ⚡**

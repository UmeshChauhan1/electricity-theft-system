# 🔌 Electricity Theft Detection & Monitoring System

A complete full-stack web application for detecting and monitoring electricity theft using real-time analytics, automated alerts, and intelligent theft detection algorithms.

## ✨ Features

### Core Functionality
- ⚡ **Real-time Theft Detection** - IMO Model and anomaly detection algorithms
- 📊 **Interactive Dashboard** - Live consumption trends and analytics
- 🚨 **Automated Alerts** - Instant notifications to inspectors via Email & WhatsApp
- 🗺️ **Regional Monitoring** - Interactive map with real-time status indicators
- 👥 **Role-Based Access Control** - Admin, Inspector, Dispatcher roles
- 📧 **Multi-Channel Notifications** - Email, WhatsApp, SMS integration
- 📈 **Advanced Analytics** - Statistical analysis and pattern detection
- 🔐 **Secure Authentication** - JWT-based auth system
- 💾 **Database Integration** - PostgreSQL with Prisma ORM

### Technical Features
- Full REST API for all operations
- Automatic alert creation and assignment
- Inspector notification system
- Meter reading analysis
- Historical data tracking
- Status management (Pending → Investigating → Dispatched → Resolved)

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Notifications**: Nodemailer (Email), Twilio (WhatsApp/SMS)
- **Charts**: Recharts
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18 or higher
- PostgreSQL 14 or higher
- npm or yarn
- (Optional) Twilio account for WhatsApp/SMS
- (Optional) SMTP server for email notifications

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Extract the project
cd electricity-theft-system

# Install dependencies
npm install
```

### 2. Database Setup

**Option A: Local PostgreSQL**
```bash
# Create a new PostgreSQL database
createdb electricity_theft_db

# Or using psql
psql -U postgres
CREATE DATABASE electricity_theft_db;
```

**Option B: Use a cloud database (Recommended for deployment)**
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Supabase](https://supabase.com/)
- [Neon](https://neon.tech/)

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/electricity_theft_db"

# JWT Secret (CHANGE THIS!)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Email Configuration (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-specific-password"
SMTP_FROM="PSPCL <noreply@pspcl.gov.in>"

# Twilio for WhatsApp/SMS (Optional)
TWILIO_ACCOUNT_SID="your-account-sid"
TWILIO_AUTH_TOKEN="your-auth-token"
TWILIO_WHATSAPP_FROM="+14155238886"
TWILIO_PHONE_FROM="+1234567890"
```

### 4. Initialize Database

```bash
# Push database schema
npm run db:push

# Seed with sample data
npm run db:seed
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 👤 Default Login Credentials

After seeding, you can login with these accounts:

**Admin:**
- Email: `admin@pspcl.gov.in`
- Password: `password123`

**Inspector 1:**
- Email: `inspector1@pspcl.gov.in`
- Password: `password123`

**Inspector 2:**
- Email: `inspector2@pspcl.gov.in`
- Password: `password123`

**Dispatcher:**
- Email: `dispatcher@pspcl.gov.in`
- Password: `password123`

⚠️ **IMPORTANT**: Change these passwords in production!

## 🌐 Deployment to Vercel

### Method 1: Via GitHub (Recommended)

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Click "Deploy"

3. **Add Vercel Postgres** (Recommended)
   - In your Vercel project → "Storage" tab
   - Create a new Postgres database
   - Environment variables will be auto-added
   - Run migrations from Vercel dashboard or locally:
   ```bash
   vercel env pull .env.local
   npm run db:push
   npm run db:seed
   ```

### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables
vercel env add DATABASE_URL
vercel env add JWT_SECRET
# ... add other env variables

# Deploy to production
vercel --prod
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Alerts
- `GET /api/alerts` - Get all alerts (with filters)
- `PATCH /api/alerts/[id]` - Update alert status, assign inspector, dispatch team

### Regions
- `GET /api/regions` - Get all regions with statistics

### Meter Readings
- `POST /api/readings` - Submit new meter reading (auto-detects theft)

### Users
- `GET /api/users` - Get all users/inspectors

### Notifications
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications` - Mark as read

## 🔧 Configuration

### Email Setup (Gmail Example)

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Google Account → Security → 2-Step Verification → App passwords
3. Use the 16-character password in `SMTP_PASSWORD`

### WhatsApp Setup (Twilio)

1. Sign up at [twilio.com](https://www.twilio.com/)
2. Get your Account SID and Auth Token
3. For testing, use Twilio's WhatsApp Sandbox:
   - Send join code to Twilio WhatsApp number
   - Use sandbox number as `TWILIO_WHATSAPP_FROM`
4. For production, request WhatsApp Business API access

## 📊 How It Works

### Theft Detection Algorithm (IMO Model)

1. **Input Minus Output Analysis**
   - Compares input kWh vs output kWh
   - Calculates total loss percentage
   - Separates technical loss from non-technical loss

2. **Classification Levels**
   - `< 5%` → Normal (Technical loss only)
   - `5-12%` → Low (Slight elevation)
   - `12-20%` → Medium/Suspicious (Investigation needed)
   - `20-30%` → High (Probable theft)
   - `> 30%` → Critical (Confirmed theft)

3. **Automated Workflow**
   - Meter reading submitted via API
   - Algorithm analyzes the data
   - Alert created if suspicious/theft detected
   - Inspector automatically assigned
   - Notifications sent via Email & WhatsApp
   - Inspector can approve/dispatch field team
   - Status tracked until resolution

## 🗂️ Database Schema

### Key Models
- **User** - Inspectors, admins, dispatchers
- **Region** - Geographic areas with expected/current load
- **MeterReading** - Electricity input/output data
- **Alert** - Theft detection alerts with severity
- **Notification** - Email/WhatsApp/SMS records

## 📱 Notification System

The system automatically sends notifications when:
- New theft alert is detected
- Alert is approved by admin
- Dispatch team is assigned
- Alert status changes

Notifications are sent via:
- ✉️ **Email** (always)
- 📱 **WhatsApp** (if phone number configured)
- 📲 **SMS** (if enabled)

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Secure environment variables
- SQL injection protection (Prisma)

## 📈 Future Enhancements

- [ ] Real-time WebSocket updates
- [ ] Google Maps/Leaflet integration
- [ ] Mobile app (React Native)
- [ ] Machine learning predictions
- [ ] Automated field team dispatch
- [ ] Report generation (PDF)
- [ ] Multi-language support
- [ ] Advanced data visualization
- [ ] Historical trend analysis
- [ ] Meter tampering detection

## 🐛 Troubleshooting

**Database connection issues:**
```bash
# Check DATABASE_URL format
postgresql://USER:PASSWORD@HOST:PORT/DATABASE

# Test Prisma connection
npx prisma db push
```

**Build errors:**
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

**Email not sending:**
- Check SMTP credentials
- Enable "Less secure app access" or use App Password
- Verify firewall allows outbound port 587

**WhatsApp not working:**
- Verify Twilio credentials
- Check if phone number is joined to sandbox
- Review Twilio console logs

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API logs in Vercel dashboard
3. Check Prisma Studio: `npm run db:studio`

## 📄 License

MIT License - Free to use for your organization

---

**Built for Punjab State Power Corporation Ltd (PSPCL)**

🔌 Detecting theft, one watt at a time! ⚡

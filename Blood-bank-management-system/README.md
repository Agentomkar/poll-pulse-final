# 🩸 LifeStream — Blood Bank Management System

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://lifestream-bloodbank.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repo-blue?logo=github)](https://github.com/Agentomkar/Blood-Bank-Management-System)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.5-black?logo=next.js)](https://nextjs.org)
[![Groq AI](https://img.shields.io/badge/Groq%20AI-Llama%203.3%2070B-orange)](https://groq.com)

**LifeStream** is a modern, full-featured Blood Bank Management System built with Next.js 16, featuring real-time blood inventory tracking, donor management, emergency blood request coordination, and an **AI-powered chatbot** for intelligent donor assistance.

🌐 **Live Demo:** [https://lifestream-bloodbank.vercel.app](https://lifestream-bloodbank.vercel.app)

---

## ✨ Features

### 🧠 AI-Powered Chatbot
- Intelligent donor registration (step-by-step form wizard)
- Blood group compatibility explanations (O- universal donor, AB+ universal recipient)
- Donor eligibility checks (age, weight, donation frequency)
- Donation FAQs and health tips
- Emergency blood request guidance
- Powered by **Groq's Llama 3.3 70B** with prompt injection protection & rate limiting

### 🩸 Blood Inventory Management
- Real-time tracking of 8 blood groups (A+, A-, B+, B-, O+, O-, AB+, AB-)
- Units available & reserved counts
- Expiry date monitoring
- Auto-seeded with sample data via **PGlite** (embedded PostgreSQL)

### 👥 Donor Management
- Full donor registration with validation
- Donor profiles with eligibility status
- Duplicate email/phone detection
- Local storage persistence

### 🚨 Emergency Blood Requests
- Urgent & critical request submission
- Hospital & patient coordination
- Status tracking (pending, approved, fulfilled, rejected)

### 📊 Dashboard & Analytics
- Real-time statistics
- Blood inventory overview
- Donor metrics
- Request fulfillment tracking

### 🎨 Modern UI/UX
- 3D animated background (Three.js + React Three Fiber)
- Smooth scrolling (Lenis)
- Framer Motion animations
- GSAP-powered micro-interactions
- Custom cursor
- Dark theme with crimson accent
- Responsive design (mobile-friendly)
- Audio controller for sound effects

### 🛡️ Security
- Prompt injection protection for AI chatbot
- IP-based rate limiting (20 requests/min)
- Input validation & sanitization
- Environment variable configuration

---

## 🏗️ Tech Stack

| Category          | Technology                              |
|-------------------|-----------------------------------------|
| **Framework**     | Next.js 16.2.5 (Turbopack)              |
| **Language**      | TypeScript 5.9                          |
| **Styling**       | Tailwind CSS 4.1                        |
| **Database**      | PGlite (embedded PostgreSQL) / Supabase |
| **ORM**           | Drizzle ORM                             |
| **AI**            | Groq SDK (Llama 3.3 70B)                |
| **3D Graphics**   | Three.js, React Three Fiber, Drei       |
| **Animation**     | Framer Motion, GSAP, Lenis              |
| **Charts**        | Recharts                                |
| **Icons**         | Lucide React                            |

---

## 📁 Project Structure

```
Blood-bank-management-system/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai/route.ts          # 🤖 Groq AI chatbot endpoint
│   │   │   ├── donations/route.ts   # Donation records
│   │   │   ├── donors/route.ts      # Donor CRUD
│   │   │   ├── health/route.ts      # Health check
│   │   │   ├── inventory/route.ts   # Blood inventory
│   │   │   ├── requests/route.ts    # Emergency requests
│   │   │   └── stats/route.ts       # Dashboard statistics
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── AIChatbot.tsx            # 🤖 AI chatbot UI
│   │   ├── Hero.tsx                 # Landing hero section
│   │   ├── BloodInventory.tsx       # Inventory display
│   │   ├── DonorRegistration.tsx    # Donor form
│   │   ├── EmergencyRequests.tsx    # Emergency request UI
│   │   ├── DashboardPreview.tsx     # Analytics dashboard
│   │   ├── Features.tsx             # Feature showcase
│   │   ├── Testimonials.tsx         # Testimonials section
│   │   ├── ContactFooter.tsx        # Footer with contact
│   │   ├── Navbar.tsx               # Navigation bar
│   │   ├── ThreeBackground.tsx      # 3D particle background
│   │   ├── ShaderAnimation.tsx      # Shader effects
│   │   ├── CustomCursor.tsx         # Custom mouse cursor
│   │   ├── SmoothScrolling.tsx      # Smooth scroll (Lenis)
│   │   └── ... more components
│   ├── db/
│   │   ├── index.ts                 # Database connection
│   │   └── schema.ts                # Drizzle schema
│   └── lib/
│       ├── fetchJson.ts             # API fetch utility
│       ├── supabase.ts              # Supabase client
│       └── utils.ts                 # Utility functions
├── .env.example                     # Environment template
├── drizzle.config.json
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ (recommended: 22+)
- **npm** or **pnpm** or **yarn**

### 1. Clone & Install
```bash
git clone https://github.com/Agentomkar/Blood-Bank-Management-System.git
cd Blood-bank-management-system
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory:

```env
# Groq API Key (required for AI chatbot)
GROQ_API_KEY=gsk_your_groq_api_key_here
```

> Get a free API key at [console.groq.com](https://console.groq.com)

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The app uses **PGlite** (embedded PostgreSQL) — no external database setup needed! The database auto-seeds with sample blood inventory data on first run.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAgentomkar%2FBlood-Bank-Management-System)

1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel`
3. Add the `GROQ_API_KEY` environment variable in Vercel dashboard (Settings → Environment Variables)
4. Deploy!

**Live:** [https://lifestream-bloodbank.vercel.app](https://lifestream-bloodbank.vercel.app)

> **Note:** On Vercel (serverless), the PGlite embedded database cannot initialize. The AI chatbot (`/api/ai`) and static UI will work, but database-dependent features require Supabase/PostgreSQL configuration.

---

## 📡 API Routes

| Endpoint          | Method | Description                        |
|-------------------|--------|------------------------------------|
| `/api/ai`         | POST   | 🤖 AI chatbot (Groq Llama 3.3)     |
| `/api/health`     | GET    | System health check                |
| `/api/inventory`  | GET    | Blood inventory                    |
| `/api/donors`     | GET    | List donors                        |
| `/api/donors`     | POST   | Register a new donor               |
| `/api/requests`   | GET    | List blood requests                |
| `/api/requests`   | POST   | Create emergency request           |
| `/api/stats`      | GET    | Dashboard statistics               |
| `/api/donations`  | GET    | Donation records                   |

---

## 🤖 AI Chatbot

The chatbot provides intelligent assistance for:

- **"Register me"** — Step-by-step donor registration
- **"Check eligibility"** — Donor eligibility criteria
- **"Donation FAQs"** — Common questions about donation
- **"Set reminder"** — Next eligible donation date (56 days)
- **"Nearby banks"** — Blood bank location guidance
- **"Emergency request"** — Emergency blood request process
- **Blood compatibility** — O- universal donor, AB+ universal recipient, etc.

The AI uses **Groq's Llama 3.3 70B** model with:
- Custom system prompt for blood bank expertise
- Prompt injection protection
- Rate limiting (20 requests/minute/IP)
- Input validation and sanitization
- 15-second timeout
- Fallback to rule-based responses if AI fails

---

## 🗄️ Database

The app uses **PGlite** as a zero-configuration embedded PostgreSQL database:
- No external database server needed
- Auto-creates and seeds on first run
- Stores data in `./db-local/` directory
- Supports all standard SQL operations

### For Production (Optional)
Configure Supabase PostgreSQL in `.env`:
```env
DATABASE_URL=postgresql://postgres:password@host:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 📊 Performance Optimizations

| Metric               | Before  | After   | Improvement |
|----------------------|---------|---------|-------------|
| 3D Particle Objects  | 105     | 68      | 35% less    |
| Frame Rate           | 40-50   | 60 FPS  | Stable      |
| GPU Memory           | High    | 30% less| Reduced     |
| Mobile FPS           | 30-45   | 60 FPS  | Consistent  |
| Button Hover         | Laggy   | Instant | Responsive  |

---

## 🧪 Running Tests

```bash
npm run lint     # ESLint
npm run typecheck # TypeScript checks
```

---

## 📸 Screenshots

| Section | Description |
|---------|-------------|
| **Hero** | Animated landing with 3D background |
| **Inventory** | Blood stock levels for all 8 types |
| **Donor Registration** | Multi-step donor form |
| **Emergency Requests** | Urgent blood request system |
| **Dashboard** | Real-time analytics |
| **AI Chatbot** | Floating chatbot with Groq AI |

---

## 📄 License

This project is open source. Feel free to use, modify, and distribute.

---

## 🙏 Acknowledgements

- [Groq](https://groq.com) for fast AI inference
- [Next.js](https://nextjs.org) for the React framework
- [Three.js](https://threejs.org) for 3D graphics
- [Vercel](https://vercel.com) for hosting
- All blood donors who save lives 🩸❤️

---

<p align="center">Made with ❤️ for saving lives</p>
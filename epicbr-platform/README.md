# EPIC BR Platform — Next.js 14 Recruitment Website

Tanzania's leading HR recruitment platform. Full-stack Next.js 14 application with App Router, TypeScript, Tailwind CSS, JWT authentication, and in-memory data store.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔐 Demo Accounts (password: `Password123!`)

| Role       | Email                       |
|------------|-----------------------------|
| Admin      | admin@epicbr.co.tz          |
| Employer   | amina@dfcubank.co.tz        |
| Recruiter  | james@epicbr.co.tz          |
| Job Seeker | grace@gmail.com             |

## 📁 Project Structure

```
epicbr-platform/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles + Tailwind
│   ├── about/page.tsx              # About EPIC BR
│   ├── services/page.tsx           # Services listing
│   ├── contact/page.tsx            # Contact form
│   ├── jobs/
│   │   ├── page.tsx                # Job listings + search/filter
│   │   └── [id]/page.tsx           # Job detail + apply
│   ├── auth/
│   │   ├── login/page.tsx          # Login
│   │   └── register/page.tsx       # Register (employer/recruiter/jobseeker)
│   ├── dashboard/
│   │   ├── admin/page.tsx          # Admin: users, jobs, applications
│   │   ├── employer/page.tsx       # Employer: post jobs, manage applicants
│   │   ├── recruiter/page.tsx      # Recruiter: candidate pipeline
│   │   └── jobseeker/page.tsx      # Job seeker: applications + CV builder
│   └── api/
│       ├── auth/login/route.ts     # POST login
│       ├── auth/register/route.ts  # POST register
│       ├── auth/logout/route.ts    # POST logout
│       ├── auth/me/route.ts        # GET current user
│       ├── jobs/route.ts           # GET list, POST create
│       ├── jobs/[id]/route.ts      # GET detail, PATCH update
│       ├── applications/route.ts   # GET list, POST apply
│       ├── applications/[id]/route.ts  # PATCH update status
│       ├── cv/route.ts             # GET + POST CV profile
│       ├── users/route.ts          # GET all users (admin)
│       └── contact/route.ts        # POST contact message
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx              # Sticky nav with auth state
│   │   └── Footer.tsx              # Corporate footer
│   └── sections/
│       ├── Hero.tsx                # Landing hero with dashboard mockup
│       └── Sections.tsx            # PlatformOverview, Services, HowItWorks, About, CTA
├── lib/
│   ├── auth.ts                     # JWT sign/verify, cookie helpers
│   ├── db.ts                       # In-memory data store + seed data
│   └── api.ts                      # API response helpers
└── types/index.ts                  # TypeScript interfaces
```

## ✨ Features

### 🏠 Landing Page
- Full marketing page with hero, platform overview, services, how it works, about & CTA

### 👤 Authentication
- Role-based registration (Employer, Recruiter, Job Seeker)
- JWT tokens stored in HTTP-only cookies
- Protected routes with role enforcement

### 💼 Job Listings
- Search by title, company, keyword
- Filter by category and job type
- Real-time filtering via API

### 📋 Dashboards

**Job Seeker**
- Application tracking with status updates
- Full CV Builder (personal info, experience, education, skills, languages)
- Profile strength indicator

**Employer**
- Post job listings with full details
- Manage applicants with status updates (pending → reviewing → shortlisted → interview → offered → hired)
- Job management table

**Recruiter**
- Candidate pipeline view
- Bulk status updates

**Admin**
- Platform overview with stats
- All users, jobs, applications management

## 🗄️ Data Layer

Uses an in-memory singleton store (`lib/db.ts`) that:
- Persists across hot-reloads in development
- Resets on server restart (expected for demo)
- Is easily replaceable with Prisma + PostgreSQL for production

To add a real database:
1. `npm install prisma @prisma/client`
2. Replace `lib/db.ts` with Prisma client calls
3. Run `npx prisma init` and set up your schema

## 🎨 Design System

- **Colors**: Navy `#0B1F3A` + Amber `#E8821A` (EPIC BR brand)
- **Fonts**: DM Serif Display (headings) + DM Sans (body)
- **Framework**: Tailwind CSS with custom design tokens

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Environment Variables
```
JWT_SECRET=your-super-secret-key-min-32-chars
NODE_ENV=production
```

## 🔄 Upgrading to a Real Database

The in-memory store is a drop-in simulation. To upgrade:

```bash
npm install prisma @prisma/client
npx prisma init
# Define schema, then replace db.ts methods with prisma.user.findMany() etc.
```

The API routes are already structured for easy migration — just swap `db.*` calls.

---

Built with ❤️ for Epic Business Resources Ltd — Dar es Salaam, Tanzania

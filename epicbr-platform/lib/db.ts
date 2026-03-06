/**
 * lib/db.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * In-memory data store that simulates a database for the EPIC BR Platform.
 * In production, replace with Prisma + PostgreSQL or another ORM.
 * Data is seeded on startup with realistic Tanzanian HR data.
 */

import { User, Job, Application, CVProfile, ContactMessage } from "@/types";

// ─── Seed Data ────────────────────────────────────────────────────────────────

const seedUsers: User[] = [
  {
    id: "u1",
    name: "Admin EPIC BR",
    email: "admin@epicbr.co.tz",
    role: "admin",
    createdAt: "2024-01-01T08:00:00Z",
  },
  {
    id: "u2",
    name: "Amina Saleh",
    email: "amina@dfcubank.co.tz",
    role: "employer",
    createdAt: "2024-03-15T09:00:00Z",
  },
  {
    id: "u3",
    name: "James Mwangi",
    email: "james@epicbr.co.tz",
    role: "recruiter",
    createdAt: "2024-02-10T10:00:00Z",
  },
  {
    id: "u4",
    name: "Grace Kioko",
    email: "grace@gmail.com",
    role: "jobseeker",
    createdAt: "2024-06-01T11:00:00Z",
  },
  {
    id: "u5",
    name: "Baraka Msindo",
    email: "baraka@acacia.co.tz",
    role: "employer",
    createdAt: "2024-04-20T08:30:00Z",
  },
  {
    id: "u6",
    name: "Faith Nyamwaya",
    email: "faith.nyamwaya@gmail.com",
    role: "jobseeker",
    createdAt: "2024-07-05T12:00:00Z",
  },
];

// Passwords are all: "Password123!" — bcrypt hashes pre-generated
export const seedPasswords: Record<string, string> = {
  "admin@epicbr.co.tz": "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
  "amina@dfcubank.co.tz": "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
  "james@epicbr.co.tz": "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
  "grace@gmail.com": "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
  "baraka@acacia.co.tz": "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
  "faith.nyamwaya@gmail.com": "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
};

const seedJobs: Job[] = [
  {
    id: "j1",
    title: "Senior Finance Manager",
    company: "DFCU Bank Tanzania",
    companyId: "u2",
    location: "Dar es Salaam",
    type: "full-time",
    status: "active",
    salary: "TZS 4,500,000 – 6,000,000/month",
    description:
      "We are seeking an experienced Senior Finance Manager to lead our financial planning, analysis, and reporting functions. The ideal candidate will bring a strong background in banking finance and a proven track record of leading high-performing teams.",
    requirements: [
      "Bachelor's degree in Finance, Accounting or related field (CPA/ACCA preferred)",
      "Minimum 7 years of experience in financial management",
      "Strong knowledge of IFRS and Tanzanian financial regulations",
      "Experience with ERP systems (SAP/Oracle)",
      "Excellent analytical and leadership skills",
    ],
    responsibilities: [
      "Oversee financial planning, budgeting and forecasting processes",
      "Prepare and present financial reports to senior management",
      "Ensure compliance with regulatory requirements",
      "Manage a team of 8 finance professionals",
      "Drive cost optimisation initiatives across the bank",
    ],
    benefits: [
      "Competitive salary with performance bonus",
      "Medical insurance for employee and family",
      "Annual leave of 30 days",
      "Professional development budget",
    ],
    category: "Finance",
    deadline: "2025-03-31",
    postedAt: "2025-01-10T09:00:00Z",
    updatedAt: "2025-01-10T09:00:00Z",
    applicantsCount: 34,
  },
  {
    id: "j2",
    title: "HR Business Partner",
    company: "Acacia Mining",
    companyId: "u5",
    location: "Arusha",
    type: "full-time",
    status: "active",
    salary: "TZS 3,800,000 – 5,200,000/month",
    description:
      "Acacia Mining is looking for a dynamic HR Business Partner to align HR strategy with business objectives, supporting our operations teams across multiple sites in Northern Tanzania.",
    requirements: [
      "Bachelor's degree in Human Resources or Business Administration",
      "Minimum 5 years in an HRBP or senior HR generalist role",
      "Strong knowledge of Tanzanian Labour Laws",
      "Experience in the mining or extractive industry is an advantage",
      "Excellent interpersonal and stakeholder management skills",
    ],
    responsibilities: [
      "Partner with business leaders to implement HR strategies",
      "Lead talent acquisition and workforce planning",
      "Manage employee relations and disciplinary processes",
      "Drive learning & development initiatives",
      "Ensure legal compliance in all HR activities",
    ],
    benefits: [
      "Relocation allowance",
      "Housing and transport allowance",
      "Medical cover for entire family",
      "Annual performance reviews with increments",
    ],
    category: "Human Resources",
    deadline: "2025-04-15",
    postedAt: "2025-01-15T10:30:00Z",
    updatedAt: "2025-01-15T10:30:00Z",
    applicantsCount: 21,
  },
  {
    id: "j3",
    title: "IT Systems Analyst",
    company: "DFCU Bank Tanzania",
    companyId: "u2",
    location: "Dar es Salaam (Hybrid)",
    type: "full-time",
    status: "active",
    salary: "TZS 2,800,000 – 3,800,000/month",
    description:
      "We are hiring an IT Systems Analyst to support the analysis, design, and implementation of banking technology solutions. You will work closely with business and IT teams to optimise system performance and deliver technology projects.",
    requirements: [
      "BSc in Computer Science, Information Technology or related field",
      "3+ years in a systems analyst or IT business analyst role",
      "Experience with core banking systems",
      "Knowledge of SQL and data analysis",
      "ITIL certification is a plus",
    ],
    responsibilities: [
      "Analyse existing IT systems and processes",
      "Gather and document business requirements",
      "Coordinate with vendors and internal development teams",
      "Conduct user acceptance testing",
      "Produce technical and functional documentation",
    ],
    benefits: [
      "Competitive remuneration package",
      "Hybrid work arrangement",
      "Continuous learning and certification support",
      "Career growth in a growing banking group",
    ],
    category: "Technology",
    deadline: "2025-03-20",
    postedAt: "2025-01-20T08:00:00Z",
    updatedAt: "2025-01-20T08:00:00Z",
    applicantsCount: 18,
  },
  {
    id: "j4",
    title: "Sales Director – East Africa",
    company: "Acacia Mining",
    companyId: "u5",
    location: "Dar es Salaam",
    type: "full-time",
    status: "active",
    salary: "TZS 7,000,000 – 10,000,000/month",
    description:
      "We are looking for an accomplished Sales Director to lead our East Africa commercial strategy, develop new markets, and drive revenue growth across Tanzania, Kenya, and Uganda.",
    requirements: [
      "MBA or relevant advanced degree preferred",
      "10+ years in sales leadership, ideally in mining or heavy industry",
      "Proven track record of building and leading high-performance sales teams",
      "Strong regional network in East Africa",
      "Excellent negotiation and presentation skills",
    ],
    responsibilities: [
      "Define and execute the regional sales strategy",
      "Build and manage a team of 15+ sales professionals",
      "Identify and develop new market opportunities",
      "Manage key client relationships at C-suite level",
      "Report to the Group CEO on commercial performance",
    ],
    benefits: [
      "Executive compensation package",
      "Company vehicle",
      "Annual performance bonus (up to 30% of salary)",
      "International travel opportunities",
    ],
    category: "Sales",
    deadline: "2025-05-01",
    postedAt: "2025-01-25T11:00:00Z",
    updatedAt: "2025-01-25T11:00:00Z",
    applicantsCount: 9,
  },
  {
    id: "j5",
    title: "Marketing Officer",
    company: "DFCU Bank Tanzania",
    companyId: "u2",
    location: "Dar es Salaam",
    type: "full-time",
    status: "active",
    salary: "TZS 1,800,000 – 2,500,000/month",
    description:
      "Join our growing marketing team and help shape the brand story of one of Tanzania's most trusted financial institutions. You will plan and execute digital and traditional marketing campaigns.",
    requirements: [
      "Bachelor's degree in Marketing, Communications or related field",
      "2+ years of marketing experience",
      "Proficiency in social media management and digital marketing tools",
      "Creative, with excellent written and verbal communication skills",
      "Experience in financial services is an advantage",
    ],
    responsibilities: [
      "Plan and execute multichannel marketing campaigns",
      "Manage social media accounts and create engaging content",
      "Coordinate with agencies on creative production",
      "Track and report on marketing metrics and ROI",
      "Support event planning and sponsorships",
    ],
    benefits: [
      "Competitive salary",
      "Medical insurance",
      "Friendly and collaborative work environment",
      "Career development opportunities",
    ],
    category: "Marketing",
    deadline: "2025-03-15",
    postedAt: "2025-02-01T09:30:00Z",
    updatedAt: "2025-02-01T09:30:00Z",
    applicantsCount: 47,
  },
  {
    id: "j6",
    title: "Supply Chain Coordinator",
    company: "Acacia Mining",
    companyId: "u5",
    location: "Mwanza",
    type: "contract",
    status: "active",
    salary: "TZS 2,200,000 – 3,000,000/month",
    description:
      "We are seeking a diligent Supply Chain Coordinator to manage procurement, logistics and inventory operations at our Mwanza facility.",
    requirements: [
      "Degree in Supply Chain Management, Logistics or Business",
      "3+ years in supply chain or procurement",
      "Experience with ERP purchasing modules",
      "Knowledge of import/export regulations in Tanzania",
      "Strong organisational skills",
    ],
    responsibilities: [
      "Coordinate procurement of goods and services",
      "Manage supplier relationships and performance",
      "Oversee inventory levels and stock management",
      "Handle import/export documentation",
      "Identify and implement cost-saving opportunities",
    ],
    benefits: [
      "Contract with potential for permanency",
      "Housing allowance",
      "Medical insurance",
      "Transport allowance",
    ],
    category: "Operations",
    deadline: "2025-04-01",
    postedAt: "2025-02-05T10:00:00Z",
    updatedAt: "2025-02-05T10:00:00Z",
    applicantsCount: 13,
  },
];

const seedApplications: Application[] = [
  {
    id: "a1",
    jobId: "j1",
    jobTitle: "Senior Finance Manager",
    company: "DFCU Bank Tanzania",
    applicantId: "u4",
    applicantName: "Grace Kioko",
    applicantEmail: "grace@gmail.com",
    status: "shortlisted",
    coverLetter:
      "I am excited to apply for the Senior Finance Manager position at DFCU Bank. With over 8 years of experience in financial management across East Africa, I am confident in my ability to contribute significantly to your team...",
    appliedAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-01-22T09:00:00Z",
    notes: "Strong candidate — shortlisted for panel interview",
  },
  {
    id: "a2",
    jobId: "j2",
    jobTitle: "HR Business Partner",
    company: "Acacia Mining",
    applicantId: "u6",
    applicantName: "Faith Nyamwaya",
    applicantEmail: "faith.nyamwaya@gmail.com",
    status: "reviewing",
    coverLetter:
      "Dear Hiring Manager, I am writing to express my strong interest in the HR Business Partner role at Acacia Mining. My 6-year tenure in HR across the mining and resources sector has equipped me...",
    appliedAt: "2025-01-20T14:30:00Z",
    updatedAt: "2025-01-20T14:30:00Z",
  },
  {
    id: "a3",
    jobId: "j1",
    jobTitle: "Senior Finance Manager",
    company: "DFCU Bank Tanzania",
    applicantId: "u6",
    applicantName: "Faith Nyamwaya",
    applicantEmail: "faith.nyamwaya@gmail.com",
    status: "pending",
    appliedAt: "2025-01-28T09:15:00Z",
    updatedAt: "2025-01-28T09:15:00Z",
  },
];

const seedCV: CVProfile = {
  id: "cv1",
  userId: "u4",
  summary:
    "Results-driven Finance professional with 8+ years of experience in financial management, reporting, and business partnering across East Africa. Proven ability to drive cost efficiencies and deliver accurate, timely financial insights to senior leadership.",
  phone: "+255 712 345 678",
  location: "Dar es Salaam, Tanzania",
  linkedin: "linkedin.com/in/gracekioko",
  experience: [
    {
      id: "exp1",
      company: "Standard Chartered Bank Tanzania",
      role: "Finance Manager",
      startDate: "2019-03",
      endDate: "2024-12",
      current: false,
      description:
        "Led financial planning and analysis for the retail banking division, managing a team of 5 analysts. Delivered monthly management accounts, quarterly forecasts, and annual budgets. Implemented a new financial reporting system that reduced close time by 30%.",
    },
    {
      id: "exp2",
      company: "Ernst & Young Tanzania",
      role: "Senior Auditor",
      startDate: "2016-06",
      endDate: "2019-02",
      current: false,
      description:
        "Conducted financial statement audits for clients across banking, manufacturing and NGO sectors. Supervised junior staff and coordinated with client finance teams.",
    },
  ],
  education: [
    {
      id: "edu1",
      institution: "University of Dar es Salaam",
      degree: "Bachelor of Commerce",
      field: "Accounting & Finance",
      startDate: "2012-09",
      endDate: "2016-05",
      current: false,
    },
  ],
  skills: [
    "Financial Modelling",
    "IFRS Reporting",
    "SAP ERP",
    "Excel Advanced",
    "Power BI",
    "Budget Management",
    "Team Leadership",
    "Audit & Compliance",
  ],
  languages: ["English (Fluent)", "Swahili (Native)", "French (Basic)"],
  updatedAt: "2025-01-10T12:00:00Z",
};

const seedContacts: ContactMessage[] = [];

// ─── In-Memory Store ──────────────────────────────────────────────────────────

class Store {
  users: User[] = [...seedUsers];
  passwords: Record<string, string> = { ...seedPasswords };
  jobs: Job[] = [...seedJobs];
  applications: Application[] = [...seedApplications];
  cvProfiles: CVProfile[] = [seedCV];
  contacts: ContactMessage[] = [...seedContacts];
  private _idCounter = 1000;

  nextId() {
    return `id_${++this._idCounter}_${Date.now()}`;
  }

  // Users
  findUserByEmail(email: string) {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }
  findUserById(id: string) {
    return this.users.find((u) => u.id === id);
  }
  addUser(user: User, passwordHash: string) {
    this.users.push(user);
    this.passwords[user.email] = passwordHash;
  }

  // Jobs
  getJobs(filters?: { status?: string; category?: string; search?: string; companyId?: string }) {
    let jobs = [...this.jobs];
    if (filters?.status) jobs = jobs.filter((j) => j.status === filters.status);
    if (filters?.category) jobs = jobs.filter((j) => j.category === filters.category);
    if (filters?.companyId) jobs = jobs.filter((j) => j.companyId === filters.companyId);
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      jobs = jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q) ||
          j.category.toLowerCase().includes(q)
      );
    }
    return jobs.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
  }
  findJobById(id: string) {
    return this.jobs.find((j) => j.id === id);
  }
  addJob(job: Job) {
    this.jobs.push(job);
  }
  updateJob(id: string, updates: Partial<Job>) {
    const idx = this.jobs.findIndex((j) => j.id === id);
    if (idx > -1) this.jobs[idx] = { ...this.jobs[idx], ...updates };
  }

  // Applications
  getApplications(filters?: { applicantId?: string; jobId?: string; companyId?: string }) {
    let apps = [...this.applications];
    if (filters?.applicantId) apps = apps.filter((a) => a.applicantId === filters.applicantId);
    if (filters?.jobId) apps = apps.filter((a) => a.jobId === filters.jobId);
    if (filters?.companyId) {
      const companyJobs = this.jobs.filter((j) => j.companyId === filters.companyId).map((j) => j.id);
      apps = apps.filter((a) => companyJobs.includes(a.jobId));
    }
    return apps.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
  }
  addApplication(app: Application) {
    this.applications.push(app);
    // Increment applicant count
    this.updateJob(app.jobId, {
      applicantsCount: (this.findJobById(app.jobId)?.applicantsCount ?? 0) + 1,
    });
  }
  updateApplication(id: string, updates: Partial<Application>) {
    const idx = this.applications.findIndex((a) => a.id === id);
    if (idx > -1) this.applications[idx] = { ...this.applications[idx], ...updates };
  }

  // CV
  findCV(userId: string) {
    return this.cvProfiles.find((c) => c.userId === userId);
  }
  upsertCV(cv: CVProfile) {
    const idx = this.cvProfiles.findIndex((c) => c.userId === cv.userId);
    if (idx > -1) this.cvProfiles[idx] = cv;
    else this.cvProfiles.push(cv);
  }

  // Contact
  addContact(msg: ContactMessage) {
    this.contacts.push(msg);
  }
}

// Singleton — persists across hot-reloads in dev
const globalForStore = globalThis as unknown as { store?: Store };
export const db = globalForStore.store ?? new Store();
if (process.env.NODE_ENV !== "production") globalForStore.store = db;

import Link from "next/link";
import { Shield, Search, Building2, UserCircle, FileText, BarChart3, ArrowRight, CheckCircle } from "lucide-react";

// ─── Platform Overview ────────────────────────────────────────────────────────
const platformCards = [
  {
    icon: Shield,
    title: "Admin Panel",
    tag: "Control Center",
    desc: "Full platform management — users, permissions, analytics, and compliance reporting in one secure hub.",
  },
  {
    icon: Search,
    title: "Recruiter Tools",
    tag: "Source & Screen",
    desc: "AI-assisted candidate sourcing, bulk CV screening, pipeline stages, and interview coordination tools.",
  },
  {
    icon: Building2,
    title: "Employer Dashboard",
    tag: "Hire Smarter",
    desc: "Post jobs, manage approvals, track time-to-hire, and collaborate with your recruiting partners.",
  },
  {
    icon: UserCircle,
    title: "Job Seeker Profile",
    tag: "Stand Out",
    desc: "Build a structured professional profile visible to top employers across all industries in Tanzania.",
  },
  {
    icon: FileText,
    title: "CV Builder",
    tag: "Get Noticed",
    desc: "Create ATS-optimized CVs with guided templates designed for the East African job market.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    tag: "Data-Driven HR",
    desc: "Track hiring metrics, pipeline velocity, and workforce planning data with exportable dashboards.",
  },
];

export function PlatformOverview() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="section-eyebrow">Platform Capabilities</span>
          <h2 className="section-title mb-4">One Platform. <em className="text-amber not-italic">Every Role.</em></h2>
          <p className="section-sub max-w-xl mx-auto">
            Built for all stakeholders — from the Admin who manages the ecosystem to the Job Seeker landing their next role.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {platformCards.map(({ icon: Icon, title, tag, desc }) => (
            <div
              key={title}
              className="bg-white border border-gray-100 rounded-lg p-7 group hover:-translate-y-1 hover:shadow-md hover:border-gray-200 transition-all duration-200 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-amber scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              <div className="w-11 h-11 rounded-lg bg-amber/10 flex items-center justify-center mb-5">
                <Icon className="w-5 h-5 text-amber" />
              </div>
              <h3 className="font-semibold text-navy mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              <span className="inline-block mt-5 text-xs font-bold uppercase tracking-wider text-amber border-b border-amber pb-0.5">
                {tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────
const services = [
  {
    emoji: "🎯",
    title: "Talent Acquisition & Placement",
    desc: "End-to-end recruitment for permanent and contract roles across all sectors — oil & gas, finance, NGOs, manufacturing, and technology.",
    features: ["Executive & mid-level search", "Volume recruitment campaigns", "Sector-specific talent pools"],
    id: "talent",
  },
  {
    emoji: "📚",
    title: "Training & Development",
    desc: "Customised learning programs that address competency gaps and prepare teams for evolving business demands.",
    features: ["Leadership & management", "Sales and customer service", "Performance & soft skills"],
    id: "training",
  },
  {
    emoji: "📋",
    title: "HR Advisory Services",
    desc: "Strategic HR consulting covering compliance, compensation, policy development, and organisational design.",
    features: ["HR policy review & development", "Compensation benchmarking", "Change management support"],
    id: "advisory",
  },
  {
    emoji: "🔄",
    title: "HR Outsourcing",
    desc: "Flexible outsourcing solutions so you can focus on your core business while we manage your HR operations.",
    features: ["Payroll management", "Contract staff management", "Employee relations support"],
    id: "outsourcing",
  },
];

export function Services() {
  return (
    <section className="py-20" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14">
          <span className="section-eyebrow">Our Services</span>
          <h2 className="section-title mb-4">Real Solutions for <em className="text-amber not-italic">Real Needs</em></h2>
          <p className="section-sub">
            Over a decade delivering value-adding HR services to Tanzanian businesses — now powered by a modern digital platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((s) => (
            <div
              key={s.id}
              id={s.id}
              className="border border-gray-100 rounded-lg p-8 flex gap-6 hover:border-amber hover:shadow-md transition-all duration-200 group"
            >
              <div className="w-12 h-12 rounded-lg bg-navy flex items-center justify-center text-xl shrink-0 group-hover:bg-amber transition-colors duration-200">
                {s.emoji}
              </div>
              <div>
                <h3 className="font-display text-lg text-navy mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{s.desc}</p>
                <ul className="space-y-1.5">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
                      <CheckCircle className="w-3.5 h-3.5 text-amber shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/services" className="btn-secondary inline-flex">
            View All Services <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
const steps = [
  {
    n: "01",
    title: "Create Your Profile",
    desc: "Register as an Employer, Recruiter, or Job Seeker. Set up your profile in minutes with our guided onboarding.",
  },
  {
    n: "02",
    title: "Post or Apply for Jobs",
    desc: "Employers post roles directly. Job Seekers browse curated listings matched to their skills and location.",
  },
  {
    n: "03",
    title: "Manage Candidates",
    desc: "Recruiters and Employers screen, shortlist, and progress candidates through configurable hiring stages.",
  },
  {
    n: "04",
    title: "Build Your Career",
    desc: "Job Seekers use our CV Builder and career resources to present their best professional identity.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-navy py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="section-eyebrow text-amber-light">How It Works</span>
          <h2 className="font-display text-4xl text-white mb-4">
            From Sign-up to <em className="text-amber-light not-italic">Success</em>
          </h2>
          <p className="text-white/50 max-w-md mx-auto text-sm leading-relaxed">
            Four simple steps to connect the right talent with the right opportunity — every time.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-9 left-[15%] right-[15%] h-px bg-amber/20" />

          {steps.map((s) => (
            <div key={s.n} className="text-center group">
              <div className="w-[72px] h-[72px] rounded-full bg-amber/10 border-2 border-amber/30 text-amber-light font-display text-2xl flex items-center justify-center mx-auto mb-6 relative z-10 group-hover:bg-amber group-hover:text-white group-hover:border-amber group-hover:shadow-lg group-hover:shadow-amber/25 transition-all duration-300">
                {s.n}
              </div>
              <h3 className="text-white font-semibold mb-3">{s.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── About / Trust ────────────────────────────────────────────────────────────
const trustStats = [
  { v: "10+", l: "Years Operating" },
  { v: "500+", l: "Clients Served" },
  { v: "12K+", l: "Candidates Placed" },
  { v: "4", l: "Service Lines" },
];

const values = [
  { icon: "🤝", title: "Customer Focus", desc: "Your business goals are our priority. We listen, understand, and deliver solutions aligned to your needs." },
  { icon: "🔗", title: "Strategic Partnership", desc: "We build long-term relationships, not transactional engagements." },
  { icon: "💡", title: "Innovation", desc: "Continuously evolving our methods and platform to stay ahead of HR market demands." },
  { icon: "⚡", title: "Commitment", desc: "Passionate, skilled professionals dedicated to delivering results on time, every time." },
];

export function About() {
  return (
    <section className="py-20 bg-gray-50" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Copy side */}
          <div>
            <span className="section-eyebrow">About EPIC BR</span>
            <h2 className="section-title mb-5">
              Tanzania's Most Trusted <em className="text-amber not-italic">HR Partner</em>
            </h2>
            <p className="text-gray-500 leading-relaxed mb-4">
              Founded in Dar es Salaam, Epic Business Resources Ltd has been the preferred HR partner for organisations across Tanzania since our inception. We serve clients from every sector — from lean MSEs to large corporates — with the same dedication and expertise.
            </p>
            <p className="text-gray-500 leading-relaxed mb-8">
              Our vision: to become the <strong className="text-navy">preferred business partner</strong> in the markets we operate. Our mission: real partnerships, real solutions, addressing real needs through a passionate and skilled team.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {trustStats.map(({ v, l }) => (
                <div key={l} className="bg-white border-l-[3px] border-amber rounded-r-lg p-4 shadow-sm">
                  <div className="font-display text-3xl text-navy">{v}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-widest mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Values card */}
          <div className="bg-navy rounded-xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-amber/10 -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
            <span className="text-xs uppercase tracking-widest text-white/40 font-semibold">Our Core Values</span>
            <h3 className="font-display text-2xl text-white mt-3 mb-6">
              Guided by Principles.<br />
              <em className="text-amber-light not-italic">Driven by Impact.</em>
            </h3>
            <div className="space-y-5">
              {values.map((v) => (
                <div key={v.title} className="flex gap-4">
                  <div className="w-9 h-9 rounded-lg bg-amber/15 flex items-center justify-center text-lg shrink-0">
                    {v.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm mb-1">{v.title}</h4>
                    <p className="text-white/45 text-xs leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
export function CTA() {
  return (
    <section className="bg-amber py-20">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="font-display text-4xl text-white mb-4">
          Ready to Transform Your Hiring Process?
        </h2>
        <p className="text-white/80 text-base mb-8 leading-relaxed">
          Join hundreds of organisations and thousands of professionals already building their future with EPIC BR Platform.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/auth/register?role=employer" className="btn-white inline-flex items-center gap-2 font-bold bg-white text-amber px-7 py-3 rounded hover:-translate-y-0.5 hover:shadow-lg transition-all">
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/contact" className="inline-flex items-center gap-2 text-white border-2 border-white/50 px-7 py-3 rounded font-medium hover:border-white hover:bg-white/10 transition-all">
            Schedule a Demo
          </Link>
        </div>
      </div>
    </section>
  );
}

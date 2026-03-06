import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";

const services = [
  {
    id: "talent",
    emoji: "🎯",
    title: "Talent Acquisition & Placement",
    tagline: "The right person, for the right role",
    desc: "End-to-end recruitment solutions for permanent, contract, and temporary roles across all industry sectors in Tanzania and the East Africa region. Our consultants combine deep market knowledge with a rigorously maintained talent database to accelerate your time-to-hire.",
    features: ["Executive & senior management search", "Volume recruitment campaigns", "Sector-specialist talent pools", "Background screening & reference checks", "Onboarding support"],
  },
  {
    id: "advisory",
    emoji: "📋",
    title: "HR Advisory Services",
    tagline: "Strategic HR, simplified",
    desc: "Our HR Advisory practice supports CEOs, HR Directors, and business owners in building HR systems that enable their organisations to grow. From policy design to compensation strategy, we help you build an HR function that works.",
    features: ["HR policy development & review", "Compensation benchmarking & job grading", "Organisational design & restructuring", "HR compliance (Tanzania Labour Laws)", "Change management support"],
  },
  {
    id: "training",
    emoji: "📚",
    title: "Training & Development",
    tagline: "Grow your people, grow your business",
    desc: "Customised training programmes designed to address skill gaps and prepare your people for the demands of a dynamic business environment. We deliver both open and bespoke in-house programmes.",
    features: ["Leadership & management development", "Sales effectiveness & customer service", "Performance management training", "Soft skills & communication", "HR professional workshops"],
  },
  {
    id: "outsourcing",
    emoji: "🔄",
    title: "HR Outsourcing",
    tagline: "Focus on your core. We handle the rest.",
    desc: "Flexible HR outsourcing that gives you access to professional HR expertise without the overhead of a full in-house team. Ideal for growing businesses, startups, and organisations during transition periods.",
    features: ["Payroll processing & management", "Contract staff management", "Leave & attendance administration", "Employee relations support", "Statutory compliance (NSSF, NHIF, HESLB)"],
  },
  {
    id: "executive",
    emoji: "👔",
    title: "Executive Search",
    tagline: "C-suite talent. Confidential. Precise.",
    desc: "A discreet, research-led executive search service for organisations looking to appoint exceptional leaders. We combine systematic market mapping with senior network access to identify candidates who aren't visible through traditional channels.",
    features: ["CEO, CFO, COO & C-suite appointments", "Board-level and NED roles", "Country and regional director searches", "Confidential transition mandates", "Comprehensive candidate assessment"],
  },
];

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      {/* Hero */}
      <div className="bg-navy py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="section-eyebrow">Our Services</span>
          <h1 className="font-display text-5xl text-white mt-3 mb-5">
            Real Solutions for <em className="text-amber-light not-italic">Real Needs</em>
          </h1>
          <p className="text-white/55 text-lg leading-relaxed">
            Over a decade of delivering value-adding HR services to Tanzanian businesses — now powered by a modern digital platform.
          </p>
        </div>
      </div>

      {/* Services */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        {services.map((s, i) => (
          <div key={s.id} id={s.id} className={`card p-8 flex flex-col md:flex-row gap-8 ${i % 2 !== 0 ? "md:flex-row-reverse" : ""}`}>
            <div className="w-16 h-16 rounded-xl bg-navy flex items-center justify-center text-3xl shrink-0">{s.emoji}</div>
            <div className="flex-1">
              <div className="text-amber text-xs font-bold uppercase tracking-widest mb-1">{s.tagline}</div>
              <h2 className="font-display text-2xl text-navy mb-3">{s.title}</h2>
              <p className="text-gray-500 leading-relaxed mb-5">{s.desc}</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {s.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-amber shrink-0" />{f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-navy py-16 px-4 text-center">
        <h2 className="font-display text-3xl text-white mb-3">Ready to work with us?</h2>
        <p className="text-white/50 mb-8 max-w-md mx-auto">Contact our team to discuss how we can support your HR and recruitment objectives.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/contact" className="btn-primary">Get in Touch <ArrowRight className="w-4 h-4" /></Link>
          <Link href="/auth/register?role=employer" className="btn-outline-white">Start Hiring</Link>
        </div>
      </div>
      <Footer />
    </>
  );
}

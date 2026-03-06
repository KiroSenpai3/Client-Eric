import Link from "next/link";
import { MapPin, Mail, Phone, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  const columns = [
    {
      title: "Platform",
      links: [
        { label: "Browse Jobs", href: "/jobs" },
        { label: "For Employers", href: "/auth/register?role=employer" },
        { label: "For Recruiters", href: "/auth/register?role=recruiter" },
        { label: "CV Builder", href: "/dashboard/jobseeker" },
        { label: "Admin Panel", href: "/dashboard/admin" },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "Talent Acquisition", href: "/services#talent" },
        { label: "HR Advisory", href: "/services#advisory" },
        { label: "Training & Development", href: "/services#training" },
        { label: "HR Outsourcing", href: "/services#outsourcing" },
        { label: "Executive Search", href: "/services#executive" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About EPIC BR", href: "/about" },
        { label: "Our Team", href: "/about#team" },
        { label: "Blog & Insights", href: "/blog" },
        { label: "Careers at EPIC BR", href: "/careers" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
  ];

  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-14 border-b border-white/10">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-display text-2xl">EPIC <span className="text-amber">BR</span></span>
              <span className="bg-amber text-white text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded">
                Platform
              </span>
            </div>
            <p className="text-white/55 text-sm leading-relaxed mb-5">
              Tanzania's leading HR technology platform — connecting employers, recruiters, and job seekers with 10+ years of excellence.
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2.5 text-xs text-white/50">
                <MapPin className="w-3.5 h-3.5 mt-0.5 text-amber shrink-0" />
                <span>Sam Nujoma Road, Mwenge Tower Unit 2A1,<br />Ubungo, Dar es Salaam, Tanzania</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-white/50">
                <Mail className="w-3.5 h-3.5 text-amber shrink-0" />
                <a href="mailto:info@epicbr.co.tz" className="hover:text-amber-light transition-colors">info@epicbr.co.tz</a>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-white/50">
                <Phone className="w-3.5 h-3.5 text-amber shrink-0" />
                <span>+255 22 277 XXXX</span>
              </div>
            </div>
          </div>

          {/* Navigation columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-5">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-white/50 hover:text-amber-light transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between py-6 gap-4">
          <p className="text-xs text-white/35">
            © {year} Epic Business Resources Ltd. All rights reserved. Dar es Salaam, Tanzania.
          </p>
          <div className="flex items-center gap-5">
            {[
              { href: "#", label: "Privacy Policy" },
              { href: "#", label: "Terms of Service" },
              { href: "#", label: "Cookie Policy" },
            ].map((l) => (
              <Link key={l.label} href={l.href} className="text-xs text-white/35 hover:text-white/70 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

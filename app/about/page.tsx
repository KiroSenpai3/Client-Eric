import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";

const team = [
  { name: "Fatuma Hassan", title: "Chief Executive Officer", bio: "20+ years in HR across East Africa. Former HR Director at a leading Tanzanian bank." },
  { name: "Peter Mwangi", title: "Head of Recruitment", bio: "Specialist in executive search and talent acquisition. Placed 500+ professionals across the region." },
  { name: "Amara Diallo", title: "HR Advisory Lead", bio: "Labour law expert and organisational development consultant with a background in manufacturing." },
  { name: "Zawadi Osei", title: "Head of Technology Platform", bio: "Product manager with 10 years building HR tech across Africa." },
];

const milestones = [
  { year: "2014", event: "EPIC BR founded in Dar es Salaam" },
  { year: "2016", event: "First major corporate client — 50+ placements" },
  { year: "2018", event: "Expanded to Arusha, Mwanza & Mombasa" },
  { year: "2020", event: "Launched HR Advisory practice" },
  { year: "2022", event: "500+ client companies milestone" },
  { year: "2024", event: "Launched EPIC BR Digital Platform" },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <div className="bg-navy py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="section-eyebrow">About EPIC BR</span>
          <h1 className="font-display text-5xl text-white mt-3 mb-5">
            Tanzania's Most Trusted <em className="text-amber-light not-italic">HR Partner</em>
          </h1>
          <p className="text-white/55 text-lg leading-relaxed max-w-xl mx-auto">
            Founded in Dar es Salaam, we've built a reputation for connecting great talent with great organisations — one placement at a time.
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card p-8">
          <div className="text-3xl mb-4">🎯</div>
          <h2 className="font-display text-2xl text-navy mb-3">Our Mission</h2>
          <p className="text-gray-500 leading-relaxed">
            To provide real partnerships, real solutions and address real needs through a passionate and skilled team — delivering exceptional HR and recruitment services that make a measurable difference to our clients' businesses and candidates' careers.
          </p>
        </div>
        <div className="card p-8">
          <div className="text-3xl mb-4">🔭</div>
          <h2 className="font-display text-2xl text-navy mb-3">Our Vision</h2>
          <p className="text-gray-500 leading-relaxed">
            To become the preferred business partner for HR and recruitment solutions in the markets we operate — known for integrity, innovation, and an unwavering commitment to the success of our clients and candidates.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-amber py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[["10+","Years Operating"],["500+","Client Companies"],["12K+","Candidates Placed"],["4","Service Lines"]].map(([v, l]) => (
            <div key={l}>
              <div className="font-display text-4xl text-white">{v}</div>
              <div className="text-white/70 text-sm mt-1 uppercase tracking-wider">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <span className="section-eyebrow">Our Journey</span>
          <h2 className="font-display text-3xl text-navy mt-2">A Decade of Excellence</h2>
        </div>
        <div className="relative">
          <div className="absolute left-[76px] top-0 bottom-0 w-px bg-gray-100" />
          <div className="space-y-8">
            {milestones.map(m => (
              <div key={m.year} className="flex gap-6 items-start">
                <div className="w-16 text-right shrink-0 pt-0.5">
                  <span className="font-display text-amber text-lg">{m.year}</span>
                </div>
                <div className="w-3 h-3 rounded-full bg-amber shrink-0 mt-1.5 relative z-10" />
                <p className="text-gray-600 pt-0.5">{m.event}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div id="team" className="bg-gray-50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-eyebrow">Our Team</span>
            <h2 className="font-display text-3xl text-navy mt-2">The People Behind the Platform</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(p => (
              <div key={p.name} className="card p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-navy-faint border-2 border-amber/20 flex items-center justify-center mx-auto mb-4">
                  <span className="font-display text-xl text-navy">{p.name.charAt(0)}</span>
                </div>
                <h3 className="font-semibold text-navy text-sm">{p.name}</h3>
                <div className="text-amber text-xs font-medium mt-1 mb-2">{p.title}</div>
                <p className="text-xs text-gray-400 leading-relaxed">{p.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="card p-8 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <span className="section-eyebrow">Find Us</span>
            <h2 className="font-display text-2xl text-navy mt-2 mb-3">Visit Our Office</h2>
            <div className="flex items-start gap-2 text-gray-500 mb-4">
              <MapPin className="w-4 h-4 text-amber mt-0.5 shrink-0" />
              <p>Sam Nujoma Road, Mwenge Tower Unit 2A1,<br />Ubungo, Dar es Salaam, Tanzania</p>
            </div>
            <Link href="/contact" className="btn-primary text-sm inline-flex">
              Get in Touch <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="w-full md:w-64 h-40 bg-navy-faint rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">📍</div>
              <div className="text-xs text-navy font-medium">Dar es Salaam, Tanzania</div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

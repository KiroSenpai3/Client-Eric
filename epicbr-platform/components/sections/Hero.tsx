"use client";

import Link from "next/link";
import { ArrowRight, Play, Users, Briefcase, TrendingUp } from "lucide-react";

const stats = [
  { value: "500+", label: "Client Companies", icon: Briefcase },
  { value: "12K+", label: "Active Candidates", icon: Users },
  { value: "98%", label: "Placement Rate", icon: TrendingUp },
];

const demoJobs = [
  { title: "Senior Finance Manager", company: "DFCU Bank", location: "Dar es Salaam", status: "active", apps: 34 },
  { title: "HR Business Partner", company: "Acacia Mining", location: "Arusha", status: "review", apps: 21 },
  { title: "Sales Director – EA", company: "Acacia Mining", location: "Dar es Salaam", status: "active", apps: 9 },
  { title: "IT Systems Analyst", company: "DFCU Bank", location: "Hybrid", status: "active", apps: 18 },
];

export default function Hero() {
  return (
    <section className="bg-navy min-h-[calc(100vh-64px)] flex items-center relative overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-amber/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-navy-light/30 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
        {/* Left: Copy */}
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-amber/10 border border-amber/25 text-amber-light text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-amber" />
            Tanzania's Leading HR Platform
          </div>

          <h1 className="font-display text-5xl md:text-6xl text-white leading-[1.08] mb-6">
            Where <em className="text-amber-light not-italic">Talent</em><br />
            Meets Opportunity<br />
            at Scale
          </h1>

          <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-lg">
            EPIC BR Platform connects Employers, Recruiters, and Job Seekers in one unified workspace — built on 10+ years of Tanzanian HR excellence.
          </p>

          <div className="flex flex-wrap gap-3 mb-12">
            <Link href="/auth/register?role=employer" className="btn-primary">
              Start Hiring <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/jobs" className="btn-outline-white">
              Browse Jobs
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 pt-8 border-t border-white/10">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label}>
                <div className="font-display text-3xl text-amber-light">{value}</div>
                <div className="text-xs text-white/45 uppercase tracking-widest mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Dashboard mockup */}
        <div className="hidden lg:block relative">
          {/* Floating notification: CV match */}
          <div className="absolute -left-8 bottom-4 bg-white rounded-lg shadow-xl p-3 z-10 min-w-[180px]">
            <div className="text-base mb-1">🎯</div>
            <div className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">New Match</div>
            <div className="font-semibold text-navy text-sm mt-0.5">CV Matched</div>
            <div className="text-[10px] text-gray-400 mt-0.5">Finance Manager • 96% fit</div>
          </div>

          {/* Floating notification: Hired */}
          <div className="absolute -right-4 -top-4 bg-white rounded-lg shadow-xl p-3 z-10 min-w-[150px]">
            <div className="text-base mb-1">✅</div>
            <div className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Offer Accepted</div>
            <div className="font-semibold text-green-600 text-sm mt-0.5">Hired!</div>
            <div className="text-[10px] text-gray-400 mt-0.5">3 mins ago</div>
          </div>

          {/* Dashboard card */}
          <div className="bg-white/[0.04] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.04] border-b border-white/[0.06]">
              <span className="w-2.5 h-2.5 rounded-full bg-amber" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="ml-2 text-xs text-white/40 font-medium">Employer Dashboard — Dar es Salaam</span>
            </div>

            <div className="p-5">
              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[["34", "Open Roles", "↑ 12%"], ["218", "Applicants", "↑ 8%"], ["7", "Interviews", "Today"]].map(
                  ([v, l, t]) => (
                    <div key={l} className="bg-white/[0.05] border border-white/[0.08] rounded-lg p-3">
                      <div className="text-white font-bold text-xl">{v}</div>
                      <div className="text-white/40 text-[10px] uppercase tracking-widest mt-0.5">{l}</div>
                      <div className="text-green-400 text-xs mt-1.5">{t}</div>
                    </div>
                  )
                )}
              </div>

              {/* Job rows */}
              <div className="space-y-2">
                {demoJobs.map((job) => (
                  <div key={job.title} className="flex items-center justify-between bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2.5">
                    <div>
                      <div className="text-white text-xs font-semibold">{job.title}</div>
                      <div className="text-white/35 text-[10px] mt-0.5">{job.company} · {job.location}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white/30 text-[10px]">{job.apps} applicants</span>
                      <span className={`badge text-[10px] ${job.status === "active" ? "badge-green" : "badge-amber"}`}>
                        {job.status === "active" ? "Active" : "In Review"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

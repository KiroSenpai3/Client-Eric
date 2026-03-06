"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Users, Briefcase, Search, TrendingUp } from "lucide-react";
import { Job, Application } from "@/types";

export default function RecruiterDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const statusColor: Record<string, string> = {
    pending: "badge-gray", reviewing: "badge-navy",
    shortlisted: "badge-amber", interview: "badge-amber",
    offered: "badge-green", hired: "badge-green", rejected: "badge-red",
  };

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d.success || d.data.role !== "recruiter") { router.push("/auth/login"); return; }
        setUser(d.data);
        return Promise.all([
          fetch("/api/jobs?status=active&pageSize=20").then((r) => r.json()),
          fetch("/api/applications").then((r) => r.json()),
        ]);
      })
      .then((results) => {
        if (!results) return;
        const [j, a] = results;
        if (j?.success) setJobs(j.data.items);
        if (a?.success) setApplications(a.data);
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-amber border-t-transparent rounded-full animate-spin" />
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="bg-navy px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            <p className="text-white/50 text-sm mb-1">Recruiter Dashboard</p>
            <h1 className="font-display text-3xl text-white">
              Welcome back, <span className="text-amber-light">{user?.name?.split(" ")[0]}</span>
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Open Roles", value: jobs.length, icon: Briefcase },
              { label: "Total Candidates", value: applications.length, icon: Users },
              { label: "In Review", value: applications.filter((a) => a.status === "reviewing").length, icon: Search },
              { label: "Shortlisted", value: applications.filter((a) => ["shortlisted","interview","offered"].includes(a.status)).length, icon: TrendingUp },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="card p-5">
                <Icon className="w-5 h-5 text-amber mb-3" />
                <div className="font-display text-3xl text-navy">{value}</div>
                <div className="text-xs text-gray-400 uppercase tracking-widest mt-1">{label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pipeline */}
            <div className="lg:col-span-2 card overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h2 className="font-semibold text-navy">Candidate Pipeline</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {["Candidate", "Role", "Status", "Actions"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-gray-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="text-sm font-semibold text-navy">{app.applicantName}</div>
                          <div className="text-xs text-gray-400">{app.applicantEmail}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{app.jobTitle}</td>
                        <td className="px-4 py-3">
                          <span className={`badge ${statusColor[app.status]} capitalize`}>{app.status}</span>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            defaultValue={app.status}
                            onChange={async (e) => {
                              await fetch(`/api/applications/${app.id}`, {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ status: e.target.value }),
                              });
                              setApplications((prev) =>
                                prev.map((a) => a.id === app.id ? { ...a, status: e.target.value as Application["status"] } : a)
                              );
                            }}
                            className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-600 outline-none focus:border-amber"
                          >
                            {["pending","reviewing","shortlisted","interview","offered","hired","rejected"].map((s) => (
                              <option key={s} value={s} className="capitalize">{s}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Active jobs */}
            <div className="card">
              <div className="p-5 border-b border-gray-100">
                <h2 className="font-semibold text-navy">Active Roles</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {jobs.slice(0, 6).map((job) => (
                  <Link key={job.id} href={`/jobs/${job.id}`} className="block p-4 hover:bg-gray-50 transition-colors">
                    <div className="text-sm font-semibold text-navy">{job.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{job.company} · {job.applicantsCount} applicants</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

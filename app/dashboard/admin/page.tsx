"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Users, Briefcase, FileText, TrendingUp, Shield, Eye, Trash2, ChevronRight, Activity } from "lucide-react";

type Tab = "overview" | "users" | "jobs" | "applications";

const roleBadge: Record<string, string> = {
  admin: "badge-navy", employer: "badge-amber", recruiter: "badge-green", jobseeker: "badge-gray",
};
const statusConfig: Record<string, { cls: string; label: string }> = {
  pending: { cls: "badge-gray", label: "Pending" }, reviewing: { cls: "badge-navy", label: "In Review" },
  shortlisted: { cls: "badge-amber", label: "Shortlisted" }, interview: { cls: "badge-amber", label: "Interview" },
  offered: { cls: "badge-green", label: "Offered" }, hired: { cls: "badge-green", label: "Hired" },
  rejected: { cls: "badge-red", label: "Rejected" },
};

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [users, setUsers] = useState<{ id: string; name: string; email: string; role: string; createdAt: string }[]>([]);
  const [jobs, setJobs] = useState<{ id: string; title: string; company: string; status: string; applicantsCount: number; location: string; category: string }[]>([]);
  const [applications, setApplications] = useState<{ id: string; applicantName: string; jobTitle: string; company: string; status: string; appliedAt: string }[]>([]);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.json())
      .then(d => {
        if (!d.success || d.data.role !== "admin") { router.push("/auth/login"); return; }
        return Promise.all([
          fetch("/api/users").then(r => r.json()),
          fetch("/api/jobs?pageSize=100").then(r => r.json()),
          fetch("/api/applications").then(r => r.json()),
        ]);
      })
      .then(results => {
        if (!results) return;
        const [u, j, a] = results;
        if (u?.success) setUsers(u.data);
        if (j?.success) setJobs(j.data.items);
        if (a?.success) setApplications(a.data);
      })
      .finally(() => setLoading(false));
  }, [router]);

  const roleCount = (role: string) => users.filter(u => u.role === role).length;
  const updateAppStatus = async (id: string, status: string) => {
    await fetch(`/api/applications/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setApplications(p => p.map(a => a.id === id ? { ...a, status } : a));
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-amber border-t-transparent rounded-full animate-spin" />
      </div>
    </>
  );

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "users", label: `Users (${users.length})`, icon: Users },
    { id: "jobs", label: `Jobs (${jobs.length})`, icon: Briefcase },
    { id: "applications", label: `Applications (${applications.length})`, icon: FileText },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-navy px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-1">
              <Shield className="w-5 h-5 text-amber" />
              <p className="text-white/50 text-sm">Administrator Panel</p>
            </div>
            <h1 className="font-display text-3xl text-white mb-8">Platform Control Centre</h1>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Total Users", value: users.length, icon: Users },
                { label: "Active Jobs", value: jobs.filter(j => j.status === "active").length, icon: Briefcase },
                { label: "Applications", value: applications.length, icon: FileText },
                { label: "Placements", value: applications.filter(a => a.status === "hired").length, icon: TrendingUp },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-white/[0.07] border border-white/10 rounded-lg p-4">
                  <Icon className="w-4 h-4 text-amber mb-2" />
                  <div className="font-display text-2xl text-white">{value}</div>
                  <div className="text-[11px] text-white/40 uppercase tracking-wider mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-0 overflow-x-auto">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === t.id ? "border-amber text-amber" : "border-transparent text-gray-500 hover:text-navy"
                }`}>
                <t.icon className="w-4 h-4" />{t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* User breakdown */}
              <div className="card p-6">
                <h3 className="font-semibold text-navy mb-4">User Breakdown</h3>
                {[
                  { role: "employer", label: "Employers" },
                  { role: "recruiter", label: "Recruiters" },
                  { role: "jobseeker", label: "Job Seekers" },
                  { role: "admin", label: "Admins" },
                ].map(({ role, label }) => (
                  <div key={role} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className={`badge ${roleBadge[role]} capitalize`}>{label}</span>
                    </div>
                    <span className="font-semibold text-navy text-sm">{roleCount(role)}</span>
                  </div>
                ))}
                <button onClick={() => setActiveTab("users")} className="btn-primary w-full text-sm mt-4 justify-center">
                  Manage Users <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Recent apps */}
              <div className="lg:col-span-2 card overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-navy">Recent Applications</h3>
                  <button onClick={() => setActiveTab("applications")} className="text-xs text-amber hover:underline">View all</button>
                </div>
                <div className="divide-y divide-gray-50">
                  {applications.slice(0, 7).map(app => (
                    <div key={app.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50">
                      <div>
                        <div className="text-sm font-medium text-navy">{app.applicantName}</div>
                        <div className="text-xs text-gray-400">{app.jobTitle} — {app.company}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`badge ${statusConfig[app.status]?.cls ?? "badge-gray"}`}>
                          {statusConfig[app.status]?.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* USERS */}
          {activeTab === "users" && (
            <div className="card overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h2 className="font-semibold text-navy">All Users</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {["Name","Email","Role","Joined"].map(h => (
                        <th key={h} className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-5 py-4 font-medium text-navy text-sm">{u.name}</td>
                        <td className="px-5 py-4 text-sm text-gray-500">{u.email}</td>
                        <td className="px-5 py-4"><span className={`badge ${roleBadge[u.role] ?? "badge-gray"} capitalize`}>{u.role}</span></td>
                        <td className="px-5 py-4 text-xs text-gray-400">
                          {new Date(u.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* JOBS */}
          {activeTab === "jobs" && (
            <div className="card overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h2 className="font-semibold text-navy">All Job Listings</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {["Title","Company","Location","Category","Applicants","Status",""].map(h => (
                        <th key={h} className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {jobs.map(job => (
                      <tr key={job.id} className="hover:bg-gray-50">
                        <td className="px-5 py-4 font-medium text-navy text-sm">{job.title}</td>
                        <td className="px-5 py-4 text-sm text-gray-500">{job.company}</td>
                        <td className="px-5 py-4 text-sm text-gray-500">{job.location}</td>
                        <td className="px-5 py-4 text-sm text-gray-500">{job.category}</td>
                        <td className="px-5 py-4 text-sm text-gray-600">{job.applicantsCount}</td>
                        <td className="px-5 py-4">
                          <span className={`badge ${job.status === "active" ? "badge-green" : "badge-gray"} capitalize`}>{job.status}</span>
                        </td>
                        <td className="px-5 py-4">
                          <Link href={`/jobs/${job.id}`} className="text-xs text-amber hover:underline">View</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* APPLICATIONS */}
          {activeTab === "applications" && (
            <div className="card overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h2 className="font-semibold text-navy">All Applications</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {["Candidate","Position","Company","Applied","Status","Update"].map(h => (
                        <th key={h} className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {applications.map(app => (
                      <tr key={app.id} className="hover:bg-gray-50">
                        <td className="px-5 py-4 font-medium text-navy text-sm">{app.applicantName}</td>
                        <td className="px-5 py-4 text-sm text-gray-600">{app.jobTitle}</td>
                        <td className="px-5 py-4 text-sm text-gray-500">{app.company}</td>
                        <td className="px-5 py-4 text-xs text-gray-400">
                          {new Date(app.appliedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`badge ${statusConfig[app.status]?.cls ?? "badge-gray"}`}>
                            {statusConfig[app.status]?.label}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <select value={app.status} onChange={e => updateAppStatus(app.id, e.target.value)}
                            className="text-xs border border-gray-200 rounded px-2 py-1.5 outline-none focus:border-amber text-gray-600">
                            {Object.entries(statusConfig).map(([v, { label }]) => (
                              <option key={v} value={v}>{label}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

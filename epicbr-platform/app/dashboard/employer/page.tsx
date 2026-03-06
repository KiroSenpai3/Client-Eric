"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Briefcase, Users, TrendingUp, Plus, Eye, ChevronRight, BarChart2, Clock, CheckCircle, X } from "lucide-react";
import { Job, Application } from "@/types";

type Tab = "overview" | "jobs" | "applicants" | "post";

const statusConfig: Record<string, { cls: string; label: string }> = {
  pending:     { cls: "badge-gray",  label: "Pending" },
  reviewing:   { cls: "badge-navy",  label: "In Review" },
  shortlisted: { cls: "badge-amber", label: "Shortlisted" },
  interview:   { cls: "badge-amber", label: "Interview" },
  offered:     { cls: "badge-green", label: "Offered" },
  hired:       { cls: "badge-green", label: "Hired" },
  rejected:    { cls: "badge-red",   label: "Rejected" },
};

const jobTypes = ["full-time", "part-time", "contract", "internship"] as const;
const categories = ["Finance","Human Resources","Technology","Sales","Marketing","Operations","Legal","Engineering","Other"];

export default function EmployerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  // Post job form
  const [form, setForm] = useState({
    title: "", location: "", type: "full-time" as typeof jobTypes[number],
    salary: "", description: "", category: "Finance", deadline: "",
    requirements: [""], responsibilities: [""], benefits: [""],
  });
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState("");
  const [postSuccess, setPostSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.json())
      .then(d => {
        if (!d.success || d.data.role !== "employer") { router.push("/auth/login"); return; }
        setUser(d.data);
        return Promise.all([
          fetch("/api/jobs?pageSize=50").then(r => r.json()),
          fetch("/api/applications").then(r => r.json()),
        ]);
      })
      .then(results => {
        if (!results) return;
        const [jobsData, appsData] = results;
        if (jobsData?.success) setJobs(jobsData.data.items);
        if (appsData?.success) setApplications(appsData.data);
      })
      .finally(() => setLoading(false));
  }, [router]);

  const updateList = (listKey: "requirements" | "responsibilities" | "benefits", idx: number, val: string) => {
    setForm(p => ({ ...p, [listKey]: p[listKey].map((v, i) => i === idx ? val : v) }));
  };
  const addListItem = (listKey: "requirements" | "responsibilities" | "benefits") =>
    setForm(p => ({ ...p, [listKey]: [...p[listKey], ""] }));
  const removeListItem = (listKey: "requirements" | "responsibilities" | "benefits", idx: number) =>
    setForm(p => ({ ...p, [listKey]: p[listKey].filter((_, i) => i !== idx) }));

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true); setPostError(""); setPostSuccess(false);
    try {
      const body = {
        ...form,
        requirements: form.requirements.filter(Boolean),
        responsibilities: form.responsibilities.filter(Boolean),
        benefits: form.benefits.filter(Boolean),
      };
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setJobs(p => [data.data, ...p]);
        setPostSuccess(true);
        setActiveTab("jobs");
      } else {
        setPostError(data.message ?? "Failed to post job");
      }
    } finally {
      setPosting(false);
    }
  };

  const updateAppStatus = async (appId: string, status: string) => {
    await fetch(`/api/applications/${appId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setApplications(p => p.map(a => a.id === appId ? { ...a, status: status as Application["status"] } : a));
  };

  const activeJobs = jobs.filter(j => j.status === "active");
  const totalApplicants = applications.length;
  const shortlisted = applications.filter(a => ["shortlisted","interview","offered"].includes(a.status)).length;

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-amber border-t-transparent rounded-full animate-spin" />
      </div>
    </>
  );

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: BarChart2 },
    { id: "jobs", label: `My Jobs (${jobs.length})`, icon: Briefcase },
    { id: "applicants", label: `Applicants (${applications.length})`, icon: Users },
    { id: "post", label: "Post a Job", icon: Plus },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-navy px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-7xl mx-auto">
            <p className="text-white/50 text-sm mb-1">Employer Dashboard</p>
            <h1 className="font-display text-3xl text-white">
              Welcome back, <span className="text-amber-light">{user?.name?.split(" ")[0]}</span>
            </h1>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
              {[
                { label: "Active Jobs", value: activeJobs.length, icon: Briefcase },
                { label: "Total Applicants", value: totalApplicants, icon: Users },
                { label: "Shortlisted", value: shortlisted, icon: CheckCircle },
                { label: "All Roles", value: jobs.length, icon: TrendingUp },
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
              <div className="lg:col-span-2 card overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-semibold text-navy">Recent Applications</h2>
                  <button onClick={() => setActiveTab("applicants")} className="text-xs text-amber hover:underline">View all</button>
                </div>
                {applications.length === 0 ? (
                  <div className="p-10 text-center text-gray-400 text-sm">No applications yet</div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {applications.slice(0, 6).map(app => (
                      <div key={app.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50">
                        <div>
                          <div className="font-medium text-navy text-sm">{app.applicantName}</div>
                          <div className="text-xs text-gray-400">{app.jobTitle}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`badge ${statusConfig[app.status]?.cls ?? "badge-gray"}`}>
                            {statusConfig[app.status]?.label}
                          </span>
                          <select value={app.status} onChange={e => updateAppStatus(app.id, e.target.value)}
                            className="text-xs border border-gray-200 rounded px-2 py-1 outline-none focus:border-amber text-gray-600">
                            {Object.entries(statusConfig).map(([v, { label }]) => (
                              <option key={v} value={v}>{label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="card p-5">
                  <h3 className="font-semibold text-navy text-sm mb-3">Active Jobs</h3>
                  {activeJobs.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-gray-400 text-sm mb-3">No active jobs posted</p>
                      <button onClick={() => setActiveTab("post")} className="btn-primary text-xs py-2 px-4">Post a Job</button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {activeJobs.slice(0, 5).map(job => (
                        <Link key={job.id} href={`/jobs/${job.id}`} className="flex items-center justify-between p-3 rounded border border-gray-100 hover:border-amber hover:bg-amber/5 transition-colors">
                          <div>
                            <div className="text-sm font-medium text-navy">{job.title}</div>
                            <div className="text-xs text-gray-400 mt-0.5">{job.applicantsCount} applicants</div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-300" />
                        </Link>
                      ))}
                    </div>
                  )}
                  <button onClick={() => setActiveTab("post")} className="btn-primary w-full text-sm mt-3 justify-center">
                    <Plus className="w-4 h-4" /> Post New Job
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* JOBS TAB */}
          {activeTab === "jobs" && (
            <div className="card overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-navy">Posted Jobs</h2>
                <button onClick={() => setActiveTab("post")} className="btn-primary text-xs py-2 px-4">
                  <Plus className="w-3.5 h-3.5" /> Post Job
                </button>
              </div>
              {jobs.length === 0 ? (
                <div className="p-16 text-center">
                  <Briefcase className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 mb-2">No jobs posted yet</p>
                  <button onClick={() => setActiveTab("post")} className="btn-primary text-sm inline-flex">Post Your First Job</button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        {["Title","Location","Type","Applicants","Status",""].map(h => (
                          <th key={h} className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-400">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {jobs.map(job => (
                        <tr key={job.id} className="hover:bg-gray-50">
                          <td className="px-5 py-4">
                            <div className="font-medium text-navy text-sm">{job.title}</div>
                            <div className="text-xs text-gray-400">{job.category}</div>
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-600">{job.location}</td>
                          <td className="px-5 py-4"><span className="badge badge-navy capitalize">{job.type.replace("-", " ")}</span></td>
                          <td className="px-5 py-4 text-sm text-gray-600">{job.applicantsCount}</td>
                          <td className="px-5 py-4"><span className={`badge ${job.status === "active" ? "badge-green" : "badge-gray"} capitalize`}>{job.status}</span></td>
                          <td className="px-5 py-4"><Link href={`/jobs/${job.id}`} className="text-xs text-amber hover:underline">View</Link></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* APPLICANTS TAB */}
          {activeTab === "applicants" && (
            <div className="card overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h2 className="font-semibold text-navy">All Applicants</h2>
              </div>
              {applications.length === 0 ? (
                <div className="p-16 text-center text-gray-400 text-sm">No applications received yet</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        {["Candidate","Position","Applied","Status","Update Status"].map(h => (
                          <th key={h} className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-400">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {applications.map(app => (
                        <tr key={app.id} className="hover:bg-gray-50">
                          <td className="px-5 py-4">
                            <div className="font-medium text-navy text-sm">{app.applicantName}</div>
                            <div className="text-xs text-gray-400">{app.applicantEmail}</div>
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-600">{app.jobTitle}</td>
                          <td className="px-5 py-4 text-xs text-gray-400">
                            {new Date(app.appliedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
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
              )}
            </div>
          )}

          {/* POST JOB TAB */}
          {activeTab === "post" && (
            <div className="max-w-3xl">
              {postSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 mb-5 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Job posted successfully!</p>
                    <p className="text-xs mt-0.5">Your job listing is now live and visible to candidates.</p>
                  </div>
                </div>
              )}
              {postError && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-5 text-sm">{postError}</div>
              )}
              <form onSubmit={handlePost} className="space-y-5">
                <div className="card p-6">
                  <h3 className="font-semibold text-navy mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="label">Job Title *</label>
                      <input required className="input-field" placeholder="e.g. Senior Finance Manager" value={form.title}
                        onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
                    </div>
                    <div>
                      <label className="label">Location *</label>
                      <input required className="input-field" placeholder="e.g. Dar es Salaam" value={form.location}
                        onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
                    </div>
                    <div>
                      <label className="label">Job Type *</label>
                      <select required className="input-field" value={form.type}
                        onChange={e => setForm(p => ({ ...p, type: e.target.value as typeof jobTypes[number] }))}>
                        {jobTypes.map(t => <option key={t} value={t} className="capitalize">{t.replace("-", " ")}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Category *</label>
                      <select required className="input-field" value={form.category}
                        onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Salary Range</label>
                      <input className="input-field" placeholder="e.g. TZS 2,000,000 – 3,000,000/month" value={form.salary}
                        onChange={e => setForm(p => ({ ...p, salary: e.target.value }))} />
                    </div>
                    <div>
                      <label className="label">Application Deadline</label>
                      <input className="input-field" type="date" value={form.deadline}
                        onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="label">Job Description *</label>
                      <textarea required className="input-field min-h-[140px] resize-y" placeholder="Describe the role, context and what makes it a great opportunity..."
                        value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                    </div>
                  </div>
                </div>

                {(["requirements", "responsibilities", "benefits"] as const).map(listKey => (
                  <div key={listKey} className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-navy capitalize">{listKey}</h3>
                      <button type="button" onClick={() => addListItem(listKey)} className="text-xs text-amber hover:underline flex items-center gap-1">
                        <Plus className="w-3.5 h-3.5" /> Add
                      </button>
                    </div>
                    <div className="space-y-2">
                      {form[listKey].map((item, i) => (
                        <div key={i} className="flex gap-2">
                          <input className="input-field flex-1" placeholder={`${listKey.slice(0, -1)} ${i + 1}`} value={item}
                            onChange={e => updateList(listKey, i, e.target.value)} />
                          {form[listKey].length > 1 && (
                            <button type="button" onClick={() => removeListItem(listKey, i)}
                              className="text-gray-300 hover:text-red-400 transition-colors px-2">
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <button type="submit" disabled={posting} className="btn-primary w-full justify-center py-3 text-base">
                  {posting ? "Posting..." : "Publish Job Listing"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

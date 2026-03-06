"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import {
  FileText, Briefcase, CheckCircle, Clock, Plus, X,
  TrendingUp, User, Download, Save, Trash2, ChevronRight,
  Star, MapPin, AlertCircle
} from "lucide-react";
import { Application, CVProfile, WorkExperience, Education } from "@/types";

type Tab = "overview" | "applications" | "cv";

const statusConfig: Record<string, { cls: string; label: string }> = {
  pending:     { cls: "badge-gray",  label: "Pending" },
  reviewing:   { cls: "badge-navy",  label: "In Review" },
  shortlisted: { cls: "badge-amber", label: "Shortlisted" },
  interview:   { cls: "badge-amber", label: "Interview" },
  offered:     { cls: "badge-green", label: "Offered" },
  hired:       { cls: "badge-green", label: "Hired 🎉" },
  rejected:    { cls: "badge-red",   label: "Not Selected" },
};

const emptyCV: Omit<CVProfile, "id" | "userId" | "updatedAt"> = {
  summary: "", phone: "", location: "Dar es Salaam, Tanzania",
  linkedin: "", experience: [], education: [], skills: [], languages: [],
};

export default function JobSeekerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  // CV state
  const [cv, setCV] = useState<Omit<CVProfile, "id" | "userId" | "updatedAt">>(emptyCV);
  const [cvSaving, setCVSaving] = useState(false);
  const [cvSaved, setCVSaved] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [langInput, setLangInput] = useState("");

  // Experience form
  const [expForm, setExpForm] = useState<Omit<WorkExperience, "id">>({
    company: "", role: "", startDate: "", endDate: "", current: false, description: ""
  });
  const [showExpForm, setShowExpForm] = useState(false);

  // Education form
  const [eduForm, setEduForm] = useState<Omit<Education, "id">>({
    institution: "", degree: "", field: "", startDate: "", endDate: "", current: false
  });
  const [showEduForm, setShowEduForm] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.json())
      .then(d => {
        if (!d.success || d.data.role !== "jobseeker") { router.push("/auth/login"); return; }
        setUser(d.data);
        return Promise.all([
          fetch("/api/applications").then(r => r.json()),
          fetch("/api/cv").then(r => r.json()),
        ]);
      })
      .then(results => {
        if (!results) return;
        const [appsData, cvData] = results;
        if (appsData?.success) setApplications(appsData.data);
        if (cvData?.success && cvData.data) {
          const { id, userId, updatedAt, ...rest } = cvData.data;
          setCV(rest);
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  const saveCV = async () => {
    setCVSaving(true);
    try {
      await fetch("/api/cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cv),
      });
      setCVSaved(true);
      setTimeout(() => setCVSaved(false), 3000);
    } finally {
      setCVSaving(false);
    }
  };

  const addExperience = () => {
    if (!expForm.company || !expForm.role) return;
    setCV(prev => ({
      ...prev,
      experience: [...prev.experience, { ...expForm, id: `exp_${Date.now()}` }]
    }));
    setExpForm({ company: "", role: "", startDate: "", endDate: "", current: false, description: "" });
    setShowExpForm(false);
  };

  const addEducation = () => {
    if (!eduForm.institution || !eduForm.degree) return;
    setCV(prev => ({
      ...prev,
      education: [...prev.education, { ...eduForm, id: `edu_${Date.now()}` }]
    }));
    setEduForm({ institution: "", degree: "", field: "", startDate: "", endDate: "", current: false });
    setShowEduForm(false);
  };

  const addSkill = () => {
    if (!skillInput.trim() || cv.skills.includes(skillInput.trim())) return;
    setCV(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
    setSkillInput("");
  };

  const addLang = () => {
    if (!langInput.trim() || cv.languages.includes(langInput.trim())) return;
    setCV(prev => ({ ...prev, languages: [...prev.languages, langInput.trim()] }));
    setLangInput("");
  };

  const activeApps = applications.filter(a => !["hired","rejected"].includes(a.status));
  const successApps = applications.filter(a => ["hired","offered"].includes(a.status));
  const cvComplete = cv.summary && cv.phone && cv.experience.length > 0 && cv.skills.length > 0;

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-amber border-t-transparent rounded-full animate-spin" />
      </div>
    </>
  );

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "applications", label: `Applications (${applications.length})`, icon: Briefcase },
    { id: "cv", label: "CV Builder", icon: FileText },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-navy px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-white/50 text-sm mb-1">Job Seeker Dashboard</p>
                <h1 className="font-display text-3xl text-white">
                  Welcome, <span className="text-amber-light">{user?.name?.split(" ")[0]}</span>
                </h1>
                <p className="text-white/40 text-sm mt-1">{user?.email}</p>
              </div>
              <Link href="/jobs" className="btn-primary text-sm py-2 px-5 shrink-0">
                Browse Jobs <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
              {[
                { label: "Total Applied", value: applications.length, icon: Briefcase },
                { label: "Active", value: activeApps.length, icon: Clock },
                { label: "Successful", value: successApps.length, icon: CheckCircle },
                { label: "CV Complete", value: cvComplete ? "Yes ✓" : "No", icon: FileText },
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-0">
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === t.id
                      ? "border-amber text-amber"
                      : "border-transparent text-gray-500 hover:text-navy"
                  }`}
                >
                  <t.icon className="w-4 h-4" />
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* ── OVERVIEW TAB ── */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Applications */}
              <div className="lg:col-span-2 card overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-semibold text-navy">Recent Applications</h2>
                  <button onClick={() => setActiveTab("applications")} className="text-xs text-amber hover:underline">View all</button>
                </div>
                {applications.length === 0 ? (
                  <div className="p-10 text-center">
                    <Briefcase className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">No applications yet</p>
                    <Link href="/jobs" className="btn-primary text-sm mt-4 inline-flex">Browse Jobs</Link>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {applications.slice(0, 5).map(app => (
                      <div key={app.id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50">
                        <div>
                          <div className="font-semibold text-navy text-sm">{app.jobTitle}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{app.company}</div>
                        </div>
                        <div className="text-right">
                          <span className={`badge ${statusConfig[app.status]?.cls ?? "badge-gray"}`}>
                            {statusConfig[app.status]?.label ?? app.status}
                          </span>
                          <div className="text-[10px] text-gray-400 mt-1">
                            {new Date(app.appliedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Profile strength + quick actions */}
              <div className="space-y-4">
                <div className="card p-5">
                  <h3 className="font-semibold text-navy text-sm mb-4">Profile Strength</h3>
                  {[
                    { label: "Summary", done: !!cv.summary },
                    { label: "Contact Info", done: !!cv.phone },
                    { label: "Work Experience", done: cv.experience.length > 0 },
                    { label: "Education", done: cv.education.length > 0 },
                    { label: "Skills", done: cv.skills.length > 0 },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <span className="text-sm text-gray-600">{item.label}</span>
                      {item.done
                        ? <CheckCircle className="w-4 h-4 text-green-500" />
                        : <AlertCircle className="w-4 h-4 text-gray-300" />
                      }
                    </div>
                  ))}
                  <button onClick={() => setActiveTab("cv")} className="btn-primary w-full text-sm mt-4 justify-center">
                    {cvComplete ? "Edit CV" : "Complete Your CV"}
                  </button>
                </div>

                <div className="card p-5">
                  <h3 className="font-semibold text-navy text-sm mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <Link href="/jobs" className="flex items-center gap-3 p-3 rounded border border-gray-100 hover:border-amber hover:bg-amber/5 transition-colors text-sm text-navy">
                      <Briefcase className="w-4 h-4 text-amber" /> Browse Open Roles
                    </Link>
                    <button onClick={() => setActiveTab("cv")} className="w-full flex items-center gap-3 p-3 rounded border border-gray-100 hover:border-amber hover:bg-amber/5 transition-colors text-sm text-navy text-left">
                      <FileText className="w-4 h-4 text-amber" /> Build / Update CV
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── APPLICATIONS TAB ── */}
          {activeTab === "applications" && (
            <div className="card overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h2 className="font-semibold text-navy">My Applications</h2>
              </div>
              {applications.length === 0 ? (
                <div className="p-16 text-center">
                  <Briefcase className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 mb-2">You haven&apos;t applied to any jobs yet</p>
                  <Link href="/jobs" className="btn-primary text-sm inline-flex">Find Jobs Now</Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        {["Position", "Company", "Status", "Applied", ""].map(h => (
                          <th key={h} className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-400">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {applications.map(app => (
                        <tr key={app.id} className="hover:bg-gray-50">
                          <td className="px-5 py-4">
                            <div className="font-semibold text-navy text-sm">{app.jobTitle}</div>
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-600">{app.company}</td>
                          <td className="px-5 py-4">
                            <span className={`badge ${statusConfig[app.status]?.cls ?? "badge-gray"}`}>
                              {statusConfig[app.status]?.label ?? app.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-xs text-gray-400">
                            {new Date(app.appliedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          </td>
                          <td className="px-5 py-4">
                            <Link href={`/jobs/${app.jobId}`} className="text-xs text-amber hover:underline">View Job</Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── CV BUILDER TAB ── */}
          {activeTab === "cv" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-5">

                {/* Personal Info */}
                <div className="card p-6">
                  <h3 className="font-semibold text-navy mb-4 flex items-center gap-2">
                    <User className="w-4 h-4 text-amber" /> Personal Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Phone Number</label>
                      <input className="input-field" placeholder="+255 7XX XXX XXX" value={cv.phone}
                        onChange={e => setCV(p => ({ ...p, phone: e.target.value }))} />
                    </div>
                    <div>
                      <label className="label">Location</label>
                      <input className="input-field" placeholder="Dar es Salaam, Tanzania" value={cv.location}
                        onChange={e => setCV(p => ({ ...p, location: e.target.value }))} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="label">LinkedIn Profile</label>
                      <input className="input-field" placeholder="linkedin.com/in/yourname" value={cv.linkedin ?? ""}
                        onChange={e => setCV(p => ({ ...p, linkedin: e.target.value }))} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="label">Professional Summary</label>
                      <textarea className="input-field min-h-[100px] resize-y" placeholder="Briefly describe your professional background, key strengths and career goals..."
                        value={cv.summary} onChange={e => setCV(p => ({ ...p, summary: e.target.value }))} />
                    </div>
                  </div>
                </div>

                {/* Experience */}
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-navy flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-amber" /> Work Experience
                    </h3>
                    <button onClick={() => setShowExpForm(true)} className="text-xs flex items-center gap-1 text-amber hover:underline">
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>

                  {showExpForm && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="label">Company</label>
                          <input className="input-field" placeholder="Company name" value={expForm.company}
                            onChange={e => setExpForm(p => ({ ...p, company: e.target.value }))} />
                        </div>
                        <div>
                          <label className="label">Job Title</label>
                          <input className="input-field" placeholder="Your role" value={expForm.role}
                            onChange={e => setExpForm(p => ({ ...p, role: e.target.value }))} />
                        </div>
                        <div>
                          <label className="label">Start Date</label>
                          <input className="input-field" type="month" value={expForm.startDate}
                            onChange={e => setExpForm(p => ({ ...p, startDate: e.target.value }))} />
                        </div>
                        <div>
                          <label className="label">End Date</label>
                          <input className="input-field" type="month" value={expForm.endDate ?? ""} disabled={expForm.current}
                            onChange={e => setExpForm(p => ({ ...p, endDate: e.target.value }))} />
                          <label className="flex items-center gap-2 mt-1.5 text-xs text-gray-500 cursor-pointer">
                            <input type="checkbox" checked={expForm.current}
                              onChange={e => setExpForm(p => ({ ...p, current: e.target.checked, endDate: "" }))} />
                            Current role
                          </label>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="label">Description</label>
                          <textarea className="input-field resize-y min-h-[80px]" placeholder="Key responsibilities and achievements..."
                            value={expForm.description} onChange={e => setExpForm(p => ({ ...p, description: e.target.value }))} />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={addExperience} className="btn-primary text-xs py-2 px-4">Save</button>
                        <button onClick={() => setShowExpForm(false)} className="btn-secondary text-xs py-2 px-4">Cancel</button>
                      </div>
                    </div>
                  )}

                  {cv.experience.length === 0 && !showExpForm && (
                    <p className="text-sm text-gray-400 text-center py-4">No experience added yet</p>
                  )}
                  <div className="space-y-3">
                    {cv.experience.map((exp, i) => (
                      <div key={exp.id} className="border border-gray-100 rounded-lg p-4 flex justify-between items-start gap-3">
                        <div className="flex-1">
                          <div className="font-semibold text-navy text-sm">{exp.role}</div>
                          <div className="text-amber text-xs font-medium mt-0.5">{exp.company}</div>
                          <div className="text-gray-400 text-xs mt-0.5">
                            {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                          </div>
                          {exp.description && <p className="text-xs text-gray-500 mt-2 leading-relaxed">{exp.description}</p>}
                        </div>
                        <button onClick={() => setCV(p => ({ ...p, experience: p.experience.filter((_, j) => j !== i) }))}
                          className="text-gray-300 hover:text-red-400 transition-colors shrink-0">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-navy flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber" /> Education
                    </h3>
                    <button onClick={() => setShowEduForm(true)} className="text-xs flex items-center gap-1 text-amber hover:underline">
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>

                  {showEduForm && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="label">Institution</label>
                          <input className="input-field" placeholder="University / College" value={eduForm.institution}
                            onChange={e => setEduForm(p => ({ ...p, institution: e.target.value }))} />
                        </div>
                        <div>
                          <label className="label">Degree</label>
                          <input className="input-field" placeholder="e.g. Bachelor of Commerce" value={eduForm.degree}
                            onChange={e => setEduForm(p => ({ ...p, degree: e.target.value }))} />
                        </div>
                        <div>
                          <label className="label">Field of Study</label>
                          <input className="input-field" placeholder="e.g. Accounting & Finance" value={eduForm.field}
                            onChange={e => setEduForm(p => ({ ...p, field: e.target.value }))} />
                        </div>
                        <div>
                          <label className="label">Graduation Year</label>
                          <input className="input-field" type="month" value={eduForm.endDate ?? ""}
                            onChange={e => setEduForm(p => ({ ...p, endDate: e.target.value }))} />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={addEducation} className="btn-primary text-xs py-2 px-4">Save</button>
                        <button onClick={() => setShowEduForm(false)} className="btn-secondary text-xs py-2 px-4">Cancel</button>
                      </div>
                    </div>
                  )}

                  {cv.education.length === 0 && !showEduForm && (
                    <p className="text-sm text-gray-400 text-center py-4">No education added yet</p>
                  )}
                  <div className="space-y-3">
                    {cv.education.map((edu, i) => (
                      <div key={edu.id} className="border border-gray-100 rounded-lg p-4 flex justify-between items-start gap-3">
                        <div>
                          <div className="font-semibold text-navy text-sm">{edu.degree} in {edu.field}</div>
                          <div className="text-amber text-xs font-medium mt-0.5">{edu.institution}</div>
                          {edu.endDate && <div className="text-gray-400 text-xs mt-0.5">Graduated {edu.endDate}</div>}
                        </div>
                        <button onClick={() => setCV(p => ({ ...p, education: p.education.filter((_, j) => j !== i) }))}
                          className="text-gray-300 hover:text-red-400 transition-colors shrink-0">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills & Languages */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="card p-6">
                    <h3 className="font-semibold text-navy mb-4 text-sm">Skills</h3>
                    <div className="flex gap-2 mb-3">
                      <input className="input-field text-sm py-2" placeholder="Add a skill..." value={skillInput}
                        onChange={e => setSkillInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && addSkill()} />
                      <button onClick={addSkill} className="bg-amber text-white rounded px-3 py-2 text-sm hover:bg-amber-light transition-colors shrink-0">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cv.skills.map(s => (
                        <span key={s} className="inline-flex items-center gap-1 bg-navy-faint text-navy text-xs font-medium px-2.5 py-1 rounded-full">
                          {s}
                          <button onClick={() => setCV(p => ({ ...p, skills: p.skills.filter(x => x !== s) }))}
                            className="text-navy/40 hover:text-red-400 transition-colors">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="card p-6">
                    <h3 className="font-semibold text-navy mb-4 text-sm">Languages</h3>
                    <div className="flex gap-2 mb-3">
                      <input className="input-field text-sm py-2" placeholder="e.g. English (Fluent)" value={langInput}
                        onChange={e => setLangInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && addLang()} />
                      <button onClick={addLang} className="bg-amber text-white rounded px-3 py-2 text-sm hover:bg-amber-light transition-colors shrink-0">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cv.languages.map(l => (
                        <span key={l} className="inline-flex items-center gap-1 bg-amber-faint text-amber text-xs font-medium px-2.5 py-1 rounded-full">
                          {l}
                          <button onClick={() => setCV(p => ({ ...p, languages: p.languages.filter(x => x !== l) }))}
                            className="text-amber/50 hover:text-red-400 transition-colors">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex gap-3">
                  <button onClick={saveCV} disabled={cvSaving} className="btn-primary flex-1 justify-center">
                    <Save className="w-4 h-4" />
                    {cvSaving ? "Saving..." : cvSaved ? "Saved! ✓" : "Save CV"}
                  </button>
                </div>
              </div>

              {/* CV Preview */}
              <div className="space-y-4">
                <div className="card p-5 bg-navy text-white">
                  <h3 className="font-display text-lg mb-1">{user?.name}</h3>
                  {cv.location && <div className="flex items-center gap-1.5 text-white/50 text-xs mb-1"><MapPin className="w-3 h-3" />{cv.location}</div>}
                  {cv.phone && <div className="text-white/50 text-xs">{cv.phone}</div>}
                  {cv.summary && <p className="text-white/60 text-xs leading-relaxed mt-3 border-t border-white/10 pt-3">{cv.summary}</p>}
                  {cv.skills.length > 0 && (
                    <div className="mt-3 border-t border-white/10 pt-3">
                      <div className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Skills</div>
                      <div className="flex flex-wrap gap-1">
                        {cv.skills.slice(0, 6).map(s => (
                          <span key={s} className="bg-white/10 text-white/70 text-[10px] px-2 py-0.5 rounded">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mt-4 pt-3 border-t border-white/10 text-center">
                    <p className="text-[10px] text-white/30">CV Preview • {cv.experience.length} roles • {cv.skills.length} skills</p>
                  </div>
                </div>
                <div className="card p-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">CV Tips</h4>
                  <ul className="space-y-2 text-xs text-gray-500">
                    <li className="flex gap-2"><CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />Use action verbs in descriptions</li>
                    <li className="flex gap-2"><CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />Quantify achievements where possible</li>
                    <li className="flex gap-2"><CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />Keep summary to 3-4 sentences</li>
                    <li className="flex gap-2"><CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />List 5-10 relevant skills</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

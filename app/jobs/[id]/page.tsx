"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { MapPin, Briefcase, Clock, Users, ArrowLeft, CheckCircle, Calendar, ChevronRight, DollarSign, AlertCircle } from "lucide-react";
import { Job } from "@/types";

const typeColors: Record<string, string> = {
  "full-time": "badge-navy", "contract": "badge-amber", "part-time": "badge-green", "internship": "badge-gray",
};

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [user, setUser] = useState<{ role: string } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/jobs/${id}`).then(r => r.json()),
      fetch("/api/auth/me").then(r => r.json()).catch(() => ({ success: false })),
    ]).then(([jobData, userData]) => {
      if (jobData.success) setJob(jobData.data);
      if (userData.success) setUser(userData.data);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    if (!user) { router.push("/auth/login"); return; }
    if (user.role !== "jobseeker") return;
    setApplying(true); setApplyError("");
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: id, coverLetter }),
      });
      const data = await res.json();
      if (data.success) { setApplied(true); setShowApplyForm(false); }
      else setApplyError(data.message ?? "Something went wrong. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse">
        <div className="h-8 bg-gray-100 rounded w-2/3 mb-4" />
        <div className="h-4 bg-gray-100 rounded w-1/3 mb-8" />
        <div className="h-48 bg-gray-100 rounded" />
      </div>
    </>
  );

  if (!job) return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="font-display text-2xl text-navy mb-3">Job not found</h2>
        <p className="text-gray-400 mb-6">This job listing may have been removed or closed.</p>
        <Link href="/jobs" className="btn-primary">Browse All Jobs</Link>
      </div>
      <Footer />
    </>
  );

  const daysAgo = Math.floor((Date.now() - new Date(job.postedAt).getTime()) / 86400000);
  const canApply = user?.role === "jobseeker" && !applied && job.status === "active";

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100 px-4 py-3">
          <div className="max-w-5xl mx-auto flex items-center gap-2 text-xs text-gray-400">
            <Link href="/" className="hover:text-amber transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/jobs" className="hover:text-amber transition-colors">Jobs</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-navy">{job.title}</span>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-5">
              {/* Header Card */}
              <div className="card p-7">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="font-display text-3xl text-navy mb-1">{job.title}</h1>
                    <p className="text-lg text-amber font-medium">{job.company}</p>
                  </div>
                  <span className={`badge ${typeColors[job.type] ?? "badge-gray"} capitalize shrink-0 text-xs`}>
                    {job.type.replace("-", " ")}
                  </span>
                </div>
                <div className="flex flex-wrap gap-5 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-amber" />{job.location}</span>
                  <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-amber" />{job.category}</span>
                  <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-amber" />{job.applicantsCount} applicants</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber" />{daysAgo === 0 ? "Today" : `${daysAgo} days ago`}
                  </span>
                </div>
                {job.salary && (
                  <div className="mt-4 flex items-center gap-2 font-semibold text-navy">
                    <DollarSign className="w-4 h-4 text-amber" />{job.salary}
                  </div>
                )}
              </div>

              {/* About */}
              <div className="card p-7">
                <h2 className="font-display text-xl text-navy mb-4">About the Role</h2>
                <p className="text-gray-600 leading-relaxed">{job.description}</p>
              </div>

              {job.responsibilities.length > 0 && (
                <div className="card p-7">
                  <h2 className="font-display text-xl text-navy mb-4">Key Responsibilities</h2>
                  <ul className="space-y-3">
                    {job.responsibilities.map((r, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber mt-2 shrink-0" />{r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {job.requirements.length > 0 && (
                <div className="card p-7">
                  <h2 className="font-display text-xl text-navy mb-4">Requirements</h2>
                  <ul className="space-y-3">
                    {job.requirements.map((r, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600 text-sm">
                        <CheckCircle className="w-4 h-4 text-amber shrink-0 mt-0.5" />{r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {job.benefits.length > 0 && (
                <div className="card p-7">
                  <h2 className="font-display text-xl text-navy mb-4">What We Offer</h2>
                  <ul className="space-y-3">
                    {job.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600 text-sm">
                        <span className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="w-2 h-2 rounded-full bg-green-400" />
                        </span>{b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar / Apply */}
            <div className="space-y-4">
              {/* Apply Card */}
              <div className="card p-6 sticky top-24">
                {applied ? (
                  <div className="text-center py-4">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <h3 className="font-semibold text-navy mb-1">Application Submitted!</h3>
                    <p className="text-xs text-gray-400 mb-4">We'll notify you of any updates via email.</p>
                    <Link href="/dashboard/jobseeker" className="btn-secondary text-sm w-full justify-center">
                      View My Applications
                    </Link>
                  </div>
                ) : !user ? (
                  <div>
                    <h3 className="font-semibold text-navy mb-1">Ready to Apply?</h3>
                    <p className="text-xs text-gray-400 mb-4">Sign in or create an account to apply for this position.</p>
                    <Link href="/auth/login" className="btn-primary w-full justify-center mb-2">Sign In to Apply</Link>
                    <Link href="/auth/register" className="btn-secondary w-full justify-center text-sm">Create Account</Link>
                  </div>
                ) : user.role !== "jobseeker" ? (
                  <div className="text-center py-2">
                    <AlertCircle className="w-8 h-8 text-amber mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Only Job Seekers can apply for positions.</p>
                  </div>
                ) : job.status !== "active" ? (
                  <div className="text-center py-2">
                    <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">This role is no longer accepting applications.</p>
                  </div>
                ) : !showApplyForm ? (
                  <div>
                    <h3 className="font-semibold text-navy mb-1">{job.title}</h3>
                    <p className="text-sm text-gray-400 mb-4">{job.company}</p>
                    <button onClick={() => setShowApplyForm(true)} className="btn-primary w-full justify-center">
                      Apply Now
                    </button>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-semibold text-navy mb-3">Your Application</h3>
                    {applyError && (
                      <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded p-3 mb-3">{applyError}</div>
                    )}
                    <label className="label">Cover Letter (optional)</label>
                    <textarea
                      className="input-field min-h-[120px] resize-y text-sm mb-4"
                      placeholder="Briefly explain why you're a great fit for this role..."
                      value={coverLetter}
                      onChange={e => setCoverLetter(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button onClick={handleApply} disabled={applying} className="btn-primary flex-1 justify-center text-sm py-2.5">
                        {applying ? "Submitting..." : "Submit Application"}
                      </button>
                      <button onClick={() => setShowApplyForm(false)} className="btn-secondary px-4 py-2.5 text-sm">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {job.deadline && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
                    <Calendar className="w-3.5 h-3.5 text-amber" />
                    Deadline: {new Date(job.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  </div>
                )}
              </div>

              <div className="card p-5">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">About the Platform</h4>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">
                  This role is posted on EPIC BR Platform — Tanzania's most trusted HR recruitment platform.
                </p>
                <Link href="/about" className="text-xs text-amber hover:underline">Learn about EPIC BR →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

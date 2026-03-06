"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Search, MapPin, Briefcase, Clock, Filter, X, ChevronRight, Users } from "lucide-react";
import { Job } from "@/types";

const categories = ["All", "Finance", "Human Resources", "Technology", "Sales", "Marketing", "Operations"];
const jobTypes = ["All", "full-time", "part-time", "contract", "internship"];

const typeColors: Record<string, string> = {
  "full-time": "badge-navy", "contract": "badge-amber", "part-time": "badge-green", "internship": "badge-gray",
};

function JobCard({ job }: { job: Job }) {
  const daysAgo = Math.floor((Date.now() - new Date(job.postedAt).getTime()) / 86400000);
  return (
    <Link href={`/jobs/${job.id}`} className="card-hover block p-6 group">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-navy text-base mb-1 group-hover:text-amber transition-colors">{job.title}</h3>
          <div className="text-sm text-gray-500 font-medium">{job.company}</div>
        </div>
        <span className={`badge ${typeColors[job.type] ?? "badge-gray"} capitalize shrink-0`}>
          {job.type.replace("-", " ")}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mb-4">
        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
        <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" />{job.category}</span>
        {job.salary && <span className="font-medium text-navy-light">{job.salary}</span>}
      </div>
      <p className="text-sm text-gray-400 leading-relaxed line-clamp-2 mb-5">{job.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />{job.applicantsCount} applicants</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />{daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
          </span>
          {job.deadline && (
            <span className="text-amber font-medium">Deadline: {new Date(job.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
          )}
        </div>
        <span className="text-xs font-semibold text-amber flex items-center gap-1">
          Apply <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [jobType, setJobType] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ status: "active", pageSize: "20" });
      if (search) params.set("search", search);
      if (category !== "All") params.set("category", category);
      const res = await fetch(`/api/jobs?${params}`);
      const data = await res.json();
      if (data.success) {
        let items = data.data.items as Job[];
        if (jobType !== "All") items = items.filter(j => j.type === jobType);
        setJobs(items);
        setTotal(data.data.total);
      }
    } finally {
      setLoading(false);
    }
  }, [search, category, jobType]);

  useEffect(() => {
    const t = setTimeout(fetchJobs, 300);
    return () => clearTimeout(t);
  }, [fetchJobs]);

  const hasFilters = category !== "All" || jobType !== "All";

  return (
    <>
      <Navbar />
      {/* Search Hero */}
      <div className="bg-navy py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-5xl text-white mb-3">
            Find Your Next <em className="text-amber-light not-italic">Opportunity</em>
          </h1>
          <p className="text-white/50 mb-8">Browse {total}+ roles across Tanzania's top employers</p>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              className="w-full pl-12 pr-4 py-4 rounded-lg text-navy text-sm outline-none focus:ring-2 focus:ring-amber shadow-lg"
              placeholder="Search job title, company or keyword..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-2 mr-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500 font-medium">{jobs.length} roles</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                  category === c ? "bg-navy text-white border-navy" : "bg-white text-gray-500 border-gray-200 hover:border-navy hover:text-navy"
                }`}>{c}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 ml-auto">
            {jobTypes.map(t => (
              <button key={t} onClick={() => setJobType(t)}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors capitalize ${
                  jobType === t ? "bg-amber text-white border-amber" : "bg-white text-gray-500 border-gray-200 hover:border-amber hover:text-amber"
                }`}>{t.replace("-", " ")}</button>
            ))}
          </div>
          {hasFilters && (
            <button onClick={() => { setCategory("All"); setJobType("All"); }}
              className="text-xs text-red-500 hover:underline flex items-center gap-1 ml-2">
              <X className="w-3.5 h-3.5" /> Clear filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-1/2 mb-5" />
                <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                <div className="h-3 bg-gray-100 rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No jobs found</p>
            <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
            <button onClick={() => { setSearch(""); setCategory("All"); setJobType("All"); }}
              className="btn-primary text-sm mt-5 inline-flex">Clear All Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {jobs.map(job => <JobCard key={job.id} job={job} />)}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

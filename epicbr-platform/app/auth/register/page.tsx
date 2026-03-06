"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, UserPlus, Building2, UserSearch, User } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { Suspense } from "react";

type Role = "employer" | "recruiter" | "jobseeker";

const roles: { value: Role; label: string; desc: string; icon: React.ElementType }[] = [
  { value: "employer", label: "Employer", desc: "Post jobs and manage hiring", icon: Building2 },
  { value: "recruiter", label: "Recruiter", desc: "Source and screen candidates", icon: UserSearch },
  { value: "jobseeker", label: "Job Seeker", desc: "Find your next opportunity", icon: User },
];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = (searchParams.get("role") as Role) ?? "jobseeker";

  const [form, setForm] = useState({ name: "", email: "", password: "", role: defaultRole });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErrors({}); setServerError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        const role = data.data.user.role;
        const routes: Record<string, string> = {
          admin: "/dashboard/admin", employer: "/dashboard/employer",
          recruiter: "/dashboard/recruiter", jobseeker: "/dashboard/jobseeker",
        };
        router.push(routes[role] ?? "/");
      } else if (data.errors) {
        setErrors(data.errors);
      } else {
        setServerError(data.message ?? "Registration failed. Please try again.");
      }
    } catch { setServerError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="font-display text-2xl text-navy mb-1">EPIC <span className="text-amber">BR</span></div>
            <h1 className="font-display text-2xl text-navy mt-4 mb-1">Create an Account</h1>
            <p className="text-sm text-gray-400">Join Tanzania's leading HR platform</p>
          </div>

          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-5">{serverError}</div>
          )}

          {/* Role selector */}
          <div className="mb-6">
            <label className="label">I am a...</label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map(r => (
                <button type="button" key={r.value} onClick={() => setForm(p => ({ ...p, role: r.value }))}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    form.role === r.value ? "border-amber bg-amber-faint" : "border-gray-200 hover:border-gray-300"
                  }`}>
                  <r.icon className={`w-5 h-5 mb-1.5 ${form.role === r.value ? "text-amber" : "text-gray-400"}`} />
                  <div className={`text-xs font-semibold ${form.role === r.value ? "text-amber" : "text-navy"}`}>{r.label}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handle} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input type="text" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Your full name" className={`input-field ${errors.name ? "border-red-300" : ""}`} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="label">Email Address</label>
              <input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="you@company.com" className={`input-field ${errors.email ? "border-red-300" : ""}`} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} required value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="Min. 8 characters" className={`input-field pr-10 ${errors.password ? "border-red-300" : ""}`} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2">
              <UserPlus className="w-4 h-4" />
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-amber font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 border-2 border-amber border-t-transparent rounded-full animate-spin" /></div>}>
        <RegisterForm />
      </Suspense>
    </>
  );
}

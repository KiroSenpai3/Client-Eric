"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        const role = data.data.user.role;
        const routes: Record<string, string> = {
          admin: "/dashboard/admin",
          employer: "/dashboard/employer",
          recruiter: "/dashboard/recruiter",
          jobseeker: "/dashboard/jobseeker",
        };
        router.push(routes[role] ?? "/");
      } else {
        setError(data.message ?? "Invalid credentials");
      }
    } catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  const demoAccounts = [
    { role: "Admin", email: "admin@epicbr.co.tz" },
    { role: "Employer", email: "amina@dfcubank.co.tz" },
    { role: "Recruiter", email: "james@epicbr.co.tz" },
    { role: "Job Seeker", email: "grace@gmail.com" },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="card p-8">
            <div className="text-center mb-8">
              <div className="font-display text-2xl text-navy mb-1">
                EPIC <span className="text-amber">BR</span>
              </div>
              <h1 className="font-display text-2xl text-navy mt-4 mb-1">Welcome Back</h1>
              <p className="text-sm text-gray-400">Sign in to your account to continue</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-5">
                {error}
              </div>
            )}

            <form onSubmit={handle} className="space-y-5">
              <div>
                <label className="label">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@company.com"
                  className="input-field"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="label mb-0">Password</label>
                  <Link href="#" className="text-xs text-amber hover:underline">Forgot password?</Link>
                </div>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Enter your password"
                    className="input-field pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
                <LogIn className="w-4 h-4" />
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-400 mt-6">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-amber font-semibold hover:underline">Create one</Link>
            </p>
          </div>

          {/* Demo accounts */}
          <div className="mt-6 card p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Demo Accounts (password: Password123!)</p>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((a) => (
                <button
                  key={a.email}
                  onClick={() => setForm({ email: a.email, password: "Password123!" })}
                  className="text-left p-2.5 rounded border border-gray-100 hover:border-amber hover:bg-amber/5 transition-colors"
                >
                  <div className="text-xs font-semibold text-navy">{a.role}</div>
                  <div className="text-[10px] text-gray-400 truncate">{a.email}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

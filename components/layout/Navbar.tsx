"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard, Briefcase } from "lucide-react";

interface NavUser {
  name: string;
  email: string;
  role: string;
}

const dashboardRoute: Record<string, string> = {
  admin: "/dashboard/admin",
  employer: "/dashboard/employer",
  recruiter: "/dashboard/recruiter",
  jobseeker: "/dashboard/jobseeker",
};

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<NavUser | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const isLandingPage = pathname === "/";

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => { if (d.success) setUser(d.data); })
      .catch(() => {});
  }, [pathname]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  };

  const navLinks = [
    { href: "/jobs", label: "Browse Jobs" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const navBg = isLandingPage && !scrolled
    ? "bg-navy/95 backdrop-blur-sm"
    : "bg-navy shadow-lg";

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${navBg}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="font-display text-2xl text-white leading-none">EPIC</span>
              <span className="font-display text-2xl text-amber leading-none">BR</span>
            </div>
            <span className="bg-amber text-white text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded hidden sm:block">
              Platform
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm font-medium transition-colors ${
                  pathname.startsWith(l.href)
                    ? "text-amber-light"
                    : "text-white/75 hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Auth area */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((o) => !o)}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium"
                >
                  <div className="w-8 h-8 rounded-full bg-amber/20 border border-amber/40 flex items-center justify-center text-amber text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">{user.name}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs font-semibold text-navy truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                    <Link
                      href={dashboardRoute[user.role] ?? "/"}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-navy transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4 text-amber" />
                      My Dashboard
                    </Link>
                    <Link
                      href="/jobs"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Briefcase className="w-4 h-4 text-amber" />
                      Browse Jobs
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm text-white/75 hover:text-white font-medium transition-colors">
                  Sign In
                </Link>
                <Link href="/auth/register" className="btn-primary text-sm py-2 px-5">
                  Get Started →
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-white p-1.5"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 py-4 space-y-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2 px-3">
              {user ? (
                <>
                  <Link href={dashboardRoute[user.role] ?? "/"} className="btn-primary text-center text-sm">
                    My Dashboard
                  </Link>
                  <button onClick={handleLogout} className="text-sm text-red-400 text-center py-2">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="btn-outline-white text-center text-sm">Sign In</Link>
                  <Link href="/auth/register" className="btn-primary text-center text-sm">Get Started</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

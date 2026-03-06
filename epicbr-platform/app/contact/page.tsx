"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, Phone, MapPin, Clock, CheckCircle, Send } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErrors({}); setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) { setSuccess(true); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }
      else if (data.errors) setErrors(data.errors);
      else setServerError(data.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contactDetails = [
    { icon: Mail, label: "Email", value: "info@epicbr.co.tz" },
    { icon: Phone, label: "Phone", value: "+255 22 277 XXXX" },
    { icon: MapPin, label: "Address", value: "Sam Nujoma Road, Mwenge Tower Unit 2A1, Ubungo, Dar es Salaam" },
    { icon: Clock, label: "Office Hours", value: "Mon – Fri: 8:00am – 5:30pm EAT" },
  ];

  return (
    <>
      <Navbar />
      <div className="bg-navy py-16 px-4 text-center">
        <span className="section-eyebrow">Contact Us</span>
        <h1 className="font-display text-4xl text-white mt-3 mb-3">
          Let&apos;s Start a <em className="text-amber-light not-italic">Conversation</em>
        </h1>
        <p className="text-white/50 max-w-md mx-auto">Have a question, a requirement, or just want to explore how we can work together? We'd love to hear from you.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="space-y-4">
          {contactDetails.map(({ icon: Icon, label, value }) => (
            <div key={label} className="card p-5 flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-navy flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-amber" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</div>
                <div className="text-sm text-navy font-medium">{value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="lg:col-span-2 card p-8">
          {success ? (
            <div className="text-center py-8">
              <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
              <h2 className="font-display text-2xl text-navy mb-2">Message Sent!</h2>
              <p className="text-gray-400 text-sm max-w-xs mx-auto">
                Thank you for reaching out. A member of our team will get back to you within 1 business day.
              </p>
              <button onClick={() => setSuccess(false)} className="btn-secondary text-sm mt-6 inline-flex">Send Another Message</button>
            </div>
          ) : (
            <>
              <h2 className="font-display text-2xl text-navy mb-6">Send Us a Message</h2>
              {serverError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-5">{serverError}</div>
              )}
              <form onSubmit={handle} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Full Name *</label>
                    <input required className={`input-field ${errors.name ? "border-red-300" : ""}`} placeholder="Your name" value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="label">Email Address *</label>
                    <input required type="email" className={`input-field ${errors.email ? "border-red-300" : ""}`} placeholder="you@company.com" value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <label className="label">Phone Number</label>
                  <input className="input-field" placeholder="+255 7XX XXX XXX" value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Subject *</label>
                  <input required className={`input-field ${errors.subject ? "border-red-300" : ""}`} placeholder="How can we help?" value={form.subject}
                    onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} />
                  {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                </div>
                <div>
                  <label className="label">Message *</label>
                  <textarea required className={`input-field min-h-[140px] resize-y ${errors.message ? "border-red-300" : ""}`}
                    placeholder="Tell us about your requirements or enquiry..."
                    value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
                  <Send className="w-4 h-4" />{loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

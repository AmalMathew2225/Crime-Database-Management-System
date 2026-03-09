"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, BadgeCheck, ArrowRight, AlertCircle } from "lucide-react";

export default function OfficerLoginPage() {
  const [badge, setBadge] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = badge.trim();
    if (!trimmed) {
      setError("Please enter your Identity Badge Number.");
      return;
    }

    if (!/^[A-Z0-9]{4,12}$/i.test(trimmed)) {
      setError("Invalid badge number. Must be 4–12 alphanumeric characters.");
      return;
    }

    setLoading(true);
    localStorage.setItem("officer_badge", trimmed.toUpperCase());
    router.replace("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Decorative blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-500 opacity-10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-500 opacity-10 blur-3xl" />
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-16 relative z-10">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-2xl shadow-blue-600/40">
              <ShieldCheck className="h-9 w-9 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Kerala Police
            </h1>
            <p className="mt-1 text-sm text-blue-300">Officer Access — Crime Management System</p>
          </div>

          {/* Card */}
          <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">Officer Verification</h2>
              <p className="mt-1 text-sm text-slate-400">
                Enter your Identity Badge Number to access the officer dashboard.
              </p>
            </div>

            {error && (
              <div className="mb-4 flex items-start gap-2 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="badge" className="block text-sm font-semibold text-slate-300 mb-1.5">
                  Identity Badge Number
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <BadgeCheck className="h-5 w-5" />
                  </div>
                  <input
                    id="badge"
                    type="text"
                    autoFocus
                    autoComplete="off"
                    placeholder="e.g. KP1234567"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value.toUpperCase())}
                    className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-white placeholder-slate-500 text-sm font-medium tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <p className="mt-1.5 text-xs text-slate-500">
                  Format: Alphanumeric, 4–12 characters (e.g., KP1001 or KP1234567)
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 active:scale-95 transition-all disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Access Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 flex items-center gap-2 text-xs text-slate-500 justify-center">
              <ShieldCheck className="h-3.5 w-3.5" />
              Authorized Kerala Police Personnel Only
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-600">
            &copy; 2026 Kerala Police · Crime Management System
          </p>
        </div>
      </div>
    </div>
  );
}

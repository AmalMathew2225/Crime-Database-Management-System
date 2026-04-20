import Link from "next/link";
import { mockDashboardData } from "@/lib/mock-data";
import {
  ShieldCheck,
  Eye,
  BarChart2,
  MapPin,
  ArrowRight,
  Lock,
} from "lucide-react";

async function getStats() {
  const { firs } = mockDashboardData;
  return {
    total: firs.length,
    active: firs.filter((f) => f.status !== "Closed").length,
    closed: firs.filter((f) => f.status === "Closed").length,
    chargeSheeted: firs.filter((f) => f.status === "Charge Sheet Filed").length,
  };
}

export default async function LandingPage() {
  const stats = await getStats();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* Top nav */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700 text-white shadow">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Kerala Police <span className="font-normal text-blue-600">Crime Portal</span>
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Features</a>
            <a href="#stats" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Statistics</a>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full bg-blue-700 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-blue-800 transition-all active:scale-95"
            >
              <Eye className="h-4 w-4" />
              View Portal
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex-1 overflow-hidden">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-blue-100 opacity-40 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-indigo-100 opacity-40 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-16">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
            {/* Left content */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                Live Crime Transparency Initiative
              </div>
              <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-6xl">
                Kerala Police<br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Crime Transparency
                </span>
                <br />Portal
              </h1>
              <p className="mt-6 text-lg text-slate-500 leading-relaxed max-w-xl">
                Access real-time information on registered FIRs, active investigations,
                and case statuses across Kerala. Transparent, open, and accountable policing.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-blue-800 hover:shadow-xl transition-all active:scale-95"
                >
                  <Eye className="h-5 w-5" />
                  View Crime Portal
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#stats"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all"
                >
                  <BarChart2 className="h-5 w-5" />
                  View Statistics
                </a>
              </div>
            </div>

            {/* Right — Stats Summary Card */}
            <div className="relative">
              <div className="rounded-3xl bg-gradient-to-br from-blue-700 to-indigo-800 p-8 shadow-2xl text-white">
                <h3 className="text-lg font-bold uppercase tracking-wider text-blue-200 mb-6">
                  Current Statistics
                </h3>
                <div className="grid grid-cols-2 gap-6" id="stats">
                  {[
                    { label: "Total FIRs", value: stats.total },
                    { label: "Active Cases", value: stats.active },
                    { label: "Closed Cases", value: stats.closed },
                    { label: "Charge Sheeted", value: stats.chargeSheeted },
                  ].map((s) => (
                    <div key={s.label} className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                      <p className="text-3xl font-extrabold">{s.value}</p>
                      <p className="mt-1 text-sm text-blue-200">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center gap-2 text-sm text-blue-200">
                  <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  Data updated in real-time · Kerala Cyber Dome
                </div>
              </div>
              {/* Decorative shadow blob */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 h-12 w-4/5 rounded-full bg-blue-300 opacity-30 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-3xl font-extrabold text-slate-900 mb-4">
            Why Use This Portal?
          </h2>
          <p className="text-center text-slate-500 mb-12 max-w-xl mx-auto">
            A single source of truth for crime data, accessible to all citizens of Kerala.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { icon: Eye, title: "Full Transparency", desc: "All registered FIRs are publicly accessible with case statuses updated in real-time." },
              { icon: BarChart2, title: "Crime Analytics", desc: "Visual statistics, heatmaps, and trend analysis to understand crime patterns across districts." },
              { icon: MapPin, title: "Station Finder", desc: "Locate the nearest police station, view their contact details, and reach out instantly." },
            ].map((f) => (
              <div key={f.title} className="group rounded-2xl border border-slate-100 bg-slate-50 p-8 hover:bg-blue-50 hover:border-blue-200 transition-all">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700 group-hover:bg-blue-200 transition-colors">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-slate-500">
            &copy; 2026 Kerala Police · Crime Transparency Portal
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
            >
              <Eye className="h-4 w-4" />
              Open Portal
            </Link>
            <span className="text-slate-300">|</span>
            <span className="text-sm text-slate-400">Powered by Kerala Cyber Dome</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

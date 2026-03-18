import { FIRTable } from "../components/fir-table";
import { PublicPortalShell } from "../components/public-portal-shell";
import { FileWarning, AlertCircle, CheckCircle, Clock } from "lucide-react";

export const revalidate = 60; // Revalidate every minute

async function getFirs() {
  try {
    const base = process.env.NEXT_PUBLIC_OFFICER_URL || '';
    if (base) {
      const res = await fetch(`${base}/api/firs`, { next: { revalidate: 60 } });
      if (res.ok) {
        const json = await res.json();
        if (json.firs && json.firs.length > 0) return json.firs;
      }
    }
  } catch (err) {
    console.error("Failed to fetch FIRs from officer app:", err);
  }
  // Fallback if API fails or isn't configured
  const { mockPublicFirs } = await import("../lib/mock-data");
  return mockPublicFirs;
}

export default async function Home() {
  const firs = await getFirs();

  // Extract unique stations and crime types for the filter dropdowns
  const stationsMap = new Map();
  const crimeTypesMap = new Map();
  
  firs.forEach((f: any) => {
    if (f.police_stations) {
      stationsMap.set(f.police_stations.id, f.police_stations);
    }
    if (f.crime_types) {
      crimeTypesMap.set(f.crime_types.id, f.crime_types);
    }
  });

  const stations = Array.from(stationsMap.values());
  const crimeTypes = Array.from(crimeTypesMap.values());

  // Calculate high-level stats
  const totalCases = firs.length;
  const activeCases = firs.filter((f: any) => f.status !== "Closed").length;
  const closedCases = firs.filter((f: any) => f.status === "Closed").length;
  const recentCases = firs.filter((f: any) => {
    const filed = new Date(f.date_filed);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return filed >= thirtyDaysAgo;
  }).length;

  return (
    <PublicPortalShell>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Public Information Portal
        </h2>
        <p className="mt-4 text-lg text-slate-600 max-w-3xl">
          Access transparent, up-to-date information on registered cases across the
          district. Use the filters below to find specific incidents or track case
          statuses.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="mb-10 grid gap-4 grid-cols-2 lg:grid-cols-4">
        {/* Total Cases */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-200/60 ring-1 ring-slate-900/5">
          <div className="flex items-center gap-4">
            <div className="rounded-xl p-2.5 bg-blue-50 text-blue-600">
              <FileWarning className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Cases</p>
              <p className="text-3xl font-bold text-slate-900">{totalCases}</p>
            </div>
          </div>
        </div>

        {/* Active Cases */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-200/60 ring-1 ring-slate-900/5">
          <div className="flex items-center gap-4">
            <div className="rounded-xl p-2.5 bg-amber-50 text-amber-600">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Active Cases</p>
              <p className="text-3xl font-bold text-slate-900">{activeCases}</p>
            </div>
          </div>
        </div>

        {/* Closed Cases */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-200/60 ring-1 ring-slate-900/5">
          <div className="flex items-center gap-4">
            <div className="rounded-xl p-2.5 bg-emerald-50 text-emerald-600">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Closed Cases</p>
              <p className="text-3xl font-bold text-slate-900">{closedCases}</p>
            </div>
          </div>
        </div>

        {/* Recent Cases */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-200/60 ring-1 ring-slate-900/5">
          <div className="flex items-center gap-4">
            <div className="rounded-xl p-2.5 bg-purple-50 text-purple-600">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Recent (30d)</p>
              <p className="text-3xl font-bold text-slate-900">{recentCases}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="rounded-2xl bg-white shadow-xl shadow-slate-200/20 border border-slate-200/60 overflow-hidden">
        <FIRTable firs={firs} stations={stations} crimeTypes={crimeTypes} />
      </div>
    </PublicPortalShell>
  );
}

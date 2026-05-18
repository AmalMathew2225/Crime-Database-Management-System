"use client";

import { useEffect, useState, Suspense, lazy } from "react";
import { useRouter } from "next/navigation";
import { FIRTable } from "@/components/fir-table";
import { FIRForm } from "@/components/fir-form";
import type { FIRWithRelations, PoliceStation, CrimeType } from "@/lib/types";
import { createClient as createBrowserSupabaseClient } from "@/lib/supabase/client";
import { ShieldCheck, LogOut, Map, Shield } from "lucide-react";
import Link from "next/link";

// Lazy-load heatmap (Leaflet is client-only)
const CrimeHeatmap = lazy(() => import("@/components/crime-heatmap"));

export default function DashboardPage() {
  const [firs, setFirs]           = useState<FIRWithRelations[]>([]);
  const [stations, setStations]   = useState<PoliceStation[]>([]);
  const [crimeTypes, setCrimeTypes] = useState<CrimeType[]>([]);
  const [stats, setStats] = useState({ handled: 0, avgResolution: 0, active: 0, closed: 0 });
  const [filterId, setFilterId]           = useState("");
  const [filterCrime, setFilterCrime]     = useState("");
  const [filterStatus, setFilterStatus]   = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterFrom, setFilterFrom]       = useState("");
  const [filterTo, setFilterTo]           = useState("");
  const [officerBadge, setOfficerBadge]   = useState<string | null>(null);
  const [heatmapCrimeFilter, setHeatmapCrimeFilter] = useState("");
  const [activeTab, setActiveTab]         = useState<"table" | "heatmap">("table");
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("officer_badge");
    if (!stored) { router.replace("/login"); return; }
    setOfficerBadge(stored);
  }, [router]);

  const logout = () => { localStorage.removeItem("officer_badge"); router.replace("/login"); };

  useEffect(() => {
    let mounted = true;
    async function load() {
      await fetchFirs();
      try {
        const supabase = createBrowserSupabaseClient();
        const channel = supabase.channel("public:firs")
          .on("postgres_changes", { event: "INSERT", schema: "public", table: "firs" }, () => { fetchFirs(); })
          .subscribe();
        return () => { try { channel.unsubscribe(); } catch {} };
      } catch {
        const id = setInterval(fetchFirs, 5000);
        return () => clearInterval(id);
      }
    }
    load();
    return () => { mounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterId, filterCrime, filterStatus, filterLocation, filterFrom, filterTo]);

  async function fetchFirs() {
    const params = new URLSearchParams();
    if (filterId)       params.set("id", filterId);
    if (filterCrime)    params.set("crime_type", filterCrime);
    if (filterStatus)   params.set("status", filterStatus);
    if (filterLocation) params.set("location", filterLocation);
    if (filterFrom)     params.set("date_from", filterFrom);
    if (filterTo)       params.set("date_to", filterTo);

    const url = "/api/firs" + (params.toString() ? `?${params.toString()}` : "");
    const res = await fetch(url);
    if (!res.ok) return;
    const json = await res.json();
    const data: FIRWithRelations[] = json.firs || [];
    setFirs(data);

    const closed = data.filter(f => f.status === "Closed");
    const active = data.filter(f => f.status !== "Closed").length;
    let avgRes = 0;
    if (closed.length > 0) {
      const totalMs = closed.reduce((s, f) => s + (new Date(f.updated_at).getTime() - new Date(f.date_filed).getTime()), 0);
      avgRes = totalMs / closed.length / (1000 * 60 * 60 * 24);
    }
    setStats({ handled: data.length, avgResolution: avgRes, active, closed: closed.length });

    const sm: Record<string, PoliceStation> = {};
    const cm: Record<string, CrimeType>     = {};
    data.forEach(f => {
      if (f.police_stations) sm[f.police_stations.id] = f.police_stations;
      if (f.crime_types)     cm[f.crime_types.id]     = f.crime_types;
    });
    setStations(Object.values(sm));
    setCrimeTypes(Object.values(cm));
  }

  const statCards = [
    { label: "Cases handled", value: stats.handled, color: "#001e40" },
    { label: "Active cases",  value: stats.active,  color: "#d97706" },
    { label: "Closed cases",  value: stats.closed,  color: "#16a34a" },
    { label: "Avg resolution (days)", value: stats.avgResolution.toFixed(1), color: "#7c3aed" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Officer Dashboard</h2>
          <div className="flex items-center gap-3">
            {officerBadge && (
              <div className="flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700">
                <ShieldCheck className="h-3 w-3" /> Officer {officerBadge}
              </div>
            )}
            <Link href="/criminals">
              <button className="flex items-center gap-1.5 text-xs bg-red-50 border border-red-200 text-red-700 px-3 py-1.5 rounded-full font-semibold hover:bg-red-100 transition-colors">
                <Shield className="h-3 w-3" /> Criminal DB
              </button>
            </Link>
            <button onClick={logout}
              className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors">
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="mb-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(s => (
            <div key={s.label} className="p-4 bg-white rounded-lg shadow-sm border text-center">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Main grid: sidebar | content */}
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">

          {/* Left sidebar — FIR form */}
          <aside className="bg-white p-6 rounded-lg shadow-sm border self-start">
            <h3 className="text-lg font-bold mb-4">Actions</h3>
            <div>
              <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wider">Register New FIR</h4>
              <FIRForm onSuccess={(fir) => setFirs(s => [fir, ...s])} />
            </div>
          </aside>

          {/* Right — tabs: Table | Heatmap */}
          <main>
            {/* Tab switcher */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setActiveTab("table")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "table" ? "bg-primary text-white shadow" : "bg-white border text-muted-foreground hover:text-primary"}`}>
                📋 Records & Analytics
              </button>
              <button
                onClick={() => setActiveTab("heatmap")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "heatmap" ? "bg-primary text-white shadow" : "bg-white border text-muted-foreground hover:text-primary"}`}>
                <Map className="h-4 w-4" /> Crime Heatmap
              </button>
            </div>

            {activeTab === "table" && (
              <>
                {/* Filters */}
                <div className="mb-4 space-y-3 p-4 bg-white rounded-lg shadow-sm border">
                  <h3 className="text-sm font-semibold">Search & Filters</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <input placeholder="Case ID" value={filterId} onChange={e => setFilterId(e.target.value)} className="border rounded px-2 py-1.5 text-sm w-full" />
                    <select value={filterCrime} onChange={e => setFilterCrime(e.target.value)} className="border rounded px-2 py-1.5 text-sm w-full">
                      <option value="">Crime type</option>
                      {crimeTypes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border rounded px-2 py-1.5 text-sm w-full">
                      <option value="">Status</option>
                      <option>Registered</option>
                      <option>Under Investigation</option>
                      <option>Charge Sheet Filed</option>
                      <option>Court Proceedings</option>
                      <option>Closed</option>
                    </select>
                    <input placeholder="Location" value={filterLocation} onChange={e => setFilterLocation(e.target.value)} className="border rounded px-2 py-1.5 text-sm w-full" />
                    <input type="date" value={filterFrom} onChange={e => setFilterFrom(e.target.value)} className="border rounded px-2 py-1.5 text-sm w-full" />
                    <input type="date" value={filterTo}   onChange={e => setFilterTo(e.target.value)}   className="border rounded px-2 py-1.5 text-sm w-full" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={fetchFirs} className="px-3 py-1.5 bg-primary text-white rounded text-sm">Apply</button>
                    <button onClick={() => { setFilterId(""); setFilterCrime(""); setFilterStatus(""); setFilterLocation(""); setFilterFrom(""); setFilterTo(""); fetchFirs(); }} className="px-3 py-1.5 border rounded text-sm">Reset</button>
                  </div>
                </div>
                <Suspense fallback={<div className="py-8 text-center text-muted-foreground">Loading cases…</div>}>
                  <FIRTable firs={firs} stations={stations} crimeTypes={crimeTypes} />
                </Suspense>
              </>
            )}

            {activeTab === "heatmap" && (
              <div className="bg-white rounded-lg shadow-sm border p-4" style={{ minHeight: 520 }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold flex items-center gap-2"><Map className="h-4 w-4 text-primary" /> Crime Heatmap</h3>
                  <select
                    value={heatmapCrimeFilter}
                    onChange={e => setHeatmapCrimeFilter(e.target.value)}
                    className="text-xs border rounded px-2 py-1">
                    <option value="">All Crime Types</option>
                    {crimeTypes.map(ct => <option key={ct.id} value={ct.id}>{ct.name}</option>)}
                  </select>
                </div>
                <Suspense fallback={<div className="h-96 flex items-center justify-center text-muted-foreground text-sm">Loading map…</div>}>
                  <CrimeHeatmap firs={firs} crimeTypes={crimeTypes} filterCrimeTypeId={heatmapCrimeFilter || undefined} />
                </Suspense>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

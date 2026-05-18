"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { FIRTable } from "@/components/fir-table";
import { FIRForm } from "@/components/fir-form";
import type { FIRWithRelations, PoliceStation, CrimeType } from "@/lib/types";
import { createClient as createBrowserSupabaseClient } from "@/lib/supabase/client";
import { ShieldCheck, LogOut, LayoutDashboard, FilePlus2, Search, Filter } from "lucide-react";

// Kerala Police Theme Colors
const C = {
  primary: "#001e40",
  gold: "#e9c349",
  bg: "#f8f9fc",
};

export default function DashboardPage() {
  const [firs, setFirs] = useState<FIRWithRelations[]>([]);
  const [stations, setStations] = useState<PoliceStation[]>([]);
  const [crimeTypes, setCrimeTypes] = useState<CrimeType[]>([]);
  const [stats, setStats] = useState({ handled: 0, avgResolution: 0, active: 0, closed: 0 });

  const [activeTab, setActiveTab] = useState<"dashboard" | "register">("dashboard");

  // filter state
  const [filterId, setFilterId] = useState("");
  const [filterCrime, setFilterCrime] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [officer, setOfficer] = useState<any | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (!res.ok) {
        router.replace("/login");
        return;
      }
      const json = await res.json();
      setOfficer(json.officer);
      setAuthChecked(true);
    }
    checkAuth();
  }, [router]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  };

  useEffect(() => {
    let mounted = true;
    async function load() {
      await fetchFirs();
      try {
        const supabase = createBrowserSupabaseClient();
        const channel = supabase.channel('public:firs')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'firs' }, () => {
            fetchFirs();
          })
          .subscribe();

        return () => {
          try { channel.unsubscribe(); } catch { /* ignore */ }
        };
      } catch (err) {
        const id = setInterval(fetchFirs, 5000);
        return () => clearInterval(id);
      }
    }

    if (authChecked) load();
    return () => {
      mounted = false;
    };
  }, [authChecked, filterId, filterCrime, filterStatus, filterLocation, filterFrom, filterTo]);

  async function fetchFirs() {
    const params = new URLSearchParams();
    if (filterId) params.set('id', filterId);
    if (filterCrime) params.set('crime_type', filterCrime);
    if (filterStatus) params.set('status', filterStatus);
    if (filterLocation) params.set('location', filterLocation);
    if (filterFrom) params.set('date_from', filterFrom);
    if (filterTo) params.set('date_to', filterTo);

    const url = "/api/firs" + (params.toString() ? `?${params.toString()}` : "");
    const res = await fetch(url);
    if (!res.ok) return;
    const json = await res.json();
    const data: FIRWithRelations[] = json.firs || [];
    setFirs(data);
    
    const closedFirs = data.filter(f => f.status === 'Closed');
    const handled = data.length;
    const active = data.filter(f => f.status !== 'Closed').length;
    let avgRes = 0;
    if (closedFirs.length > 0) {
      const totalMs = closedFirs.reduce((sum, f) => {
        const filed = new Date(f.date_filed).getTime();
        const closed = new Date(f.updated_at).getTime();
        return sum + (closed - filed);
      }, 0);
      avgRes = totalMs / closedFirs.length / (1000 * 60 * 60 * 24); // days
    }
    setStats({ handled, avgResolution: avgRes, active, closed: closedFirs.length });

    const stationsMap: Record<string, PoliceStation> = {};
    const crimeMap: Record<string, CrimeType> = {};
    data.forEach((f) => {
      if (f.police_stations) stationsMap[f.police_stations.id] = f.police_stations;
      if (f.crime_types) crimeMap[f.crime_types.id] = f.crime_types;
    });
    setStations(Object.values(stationsMap));
    setCrimeTypes(Object.values(crimeMap));
  }

  if (!authChecked) return null;

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ background: C.bg }}>
      
      {/* Top Header */}
      <header className="w-full shadow-sm z-40 border-b border-white/10" style={{ background: C.primary }}>
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              alt="Kerala Police Logo"
              className="h-8 w-8 object-contain"
              src="https://lh3.googleusercontent.com/aida/ADBb0ugaXps9Q2RB5JyTNAQmEK3Uv2VauFOi7MCAoRHg9cZ8_wTlHjeerduV5lQ_xkmSm_gSdUevuLs1bt7vgQit1YuQjRuBQrAYOzGBE0gedAQg54XDp6gumlUwqqR2p2xtLxLM2SDL8tzRF6ddVR2w3AcGAq8OT2ffq53vbOLICwbG2PHZrg5EzyLHBcIDPULRauHApkzzjdGOknA38mF11JKpbQPknMcLJy0lFcCTVubqUm_2-2hApF7YeS0"
            />
            <h1 className="text-lg font-bold tracking-wide" style={{ color: C.gold }}>
              THUNA <span className="opacity-80 font-medium">| Command Dashboard</span>
            </h1>
          </div>
          
          {officer && (
            <div className="flex items-center gap-6">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-white/90 text-sm">
                <ShieldCheck className="h-4 w-4" style={{ color: C.gold }} />
                <span className="font-medium">{officer.name}</span>
                <span className="opacity-60 text-xs">({officer.badge_number})</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors font-medium"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Secure Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="w-full bg-white border-b shadow-sm sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-6 flex gap-8">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-2 py-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === "dashboard" 
                ? "border-blue-900 text-blue-900" 
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Records & Analytics
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`flex items-center gap-2 py-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === "register" 
                ? "border-blue-900 text-blue-900" 
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <FilePlus2 className="h-4 w-4" />
            Register New FIR
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-grow max-w-[1600px] mx-auto w-full px-6 py-8">
        
        {activeTab === "dashboard" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            
            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Cases Handled", value: stats.handled },
                { label: "Active Investigations", value: stats.active },
                { label: "Cases Closed", value: stats.closed },
                { label: "Avg Resolution Time", value: `${stats.avgResolution.toFixed(1)} Days` },
              ].map((stat, i) => (
                <div key={i} className="p-6 bg-white rounded-xl border shadow-sm flex flex-col justify-center">
                  <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-3xl font-extrabold text-blue-950">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Filters Section */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <h3 className="font-bold text-gray-700 uppercase tracking-wide text-sm">Search & Filter Directory</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                  <input
                    placeholder="Case ID / FIR No."
                    value={filterId}
                    onChange={(e) => setFilterId(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm w-full focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 outline-none transition-all"
                  />
                  <select
                    value={filterCrime}
                    onChange={(e) => setFilterCrime(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm w-full bg-white focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 outline-none transition-all"
                  >
                    <option value="">All Crime Types</option>
                    {crimeTypes.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm w-full bg-white focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 outline-none transition-all"
                  >
                    <option value="">All Statuses</option>
                    <option>Registered</option>
                    <option>Under Investigation</option>
                    <option>Charge Sheet Filed</option>
                    <option>Court Proceedings</option>
                    <option>Closed</option>
                  </select>
                  <input
                    placeholder="Location contains"
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm w-full focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 outline-none transition-all"
                  />
                  <input
                    type="date"
                    value={filterFrom}
                    onChange={(e) => setFilterFrom(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm w-full text-gray-600 focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 outline-none transition-all"
                  />
                  <input
                    type="date"
                    value={filterTo}
                    onChange={(e) => setFilterTo(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm w-full text-gray-600 focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 outline-none transition-all"
                  />
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={fetchFirs}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-950 hover:bg-blue-900 text-white font-medium rounded-lg shadow-sm transition-colors"
                  >
                    <Search className="h-4 w-4" />
                    Apply Filters
                  </button>
                  <button
                    onClick={() => {
                      setFilterId("");
                      setFilterCrime("");
                      setFilterStatus("");
                      setFilterLocation("");
                      setFilterFrom("");
                      setFilterTo("");
                      fetchFirs();
                    }}
                    className="px-6 py-2 border hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* FIR Table */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <Suspense fallback={<div className="py-12 text-center text-gray-500 font-medium animate-pulse">Loading secure database records...</div>}>
                <FIRTable firs={firs} stations={stations} crimeTypes={crimeTypes} />
              </Suspense>
            </div>
          </div>
        )}

        {activeTab === "register" && (
          <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="bg-white rounded-2xl border shadow-lg overflow-hidden">
              <div className="bg-blue-950 px-8 py-6 text-white">
                <h2 className="text-2xl font-bold mb-2 text-yellow-500">First Information Report (FIR)</h2>
                <p className="opacity-80 text-sm">Please fill out all mandatory fields accurately. This document is legally binding.</p>
              </div>
              <div className="p-8">
                <FIRForm onSuccess={(fir) => {
                  setFirs((s) => [fir, ...s]);
                  setActiveTab("dashboard");
                }} />
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

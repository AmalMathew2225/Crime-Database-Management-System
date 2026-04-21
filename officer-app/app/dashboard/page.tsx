"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { FIRTable } from "@/components/fir-table";
import { FIRForm } from "@/components/fir-form";
import type { FIRWithRelations, PoliceStation, CrimeType } from "@/lib/types";
import { createClient as createBrowserSupabaseClient } from "@/lib/supabase/client";
import { ShieldCheck, LogOut } from "lucide-react";

export default function DashboardPage() {
  const [firs, setFirs] = useState<FIRWithRelations[]>([]);
  const [stations, setStations] = useState<PoliceStation[]>([]);
  const [crimeTypes, setCrimeTypes] = useState<CrimeType[]>([]);
  const [stats, setStats] = useState({ handled: 0, avgResolution: 0, active: 0, closed: 0 });

  // filter state
  const [filterId, setFilterId] = useState("");
  const [filterCrime, setFilterCrime] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [officerBadge, setOfficerBadge] = useState<string | null>(null);
  const router = useRouter();

  // Check badge auth on mount
  useEffect(() => {
    const stored = localStorage.getItem("officer_badge");
    if (!stored) {
      router.replace("/login");
      return;
    }
    setOfficerBadge(stored);
  }, [router]);

  const logout = () => {
    localStorage.removeItem("officer_badge");
    router.replace("/login");
  };

  useEffect(() => {
    let mounted = true;
    async function load() {
      // FIR data is now fetched directly without auth check
      await fetchFirs();

      // Setup Supabase realtime subscription to FIR inserts (refetch on insert)
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
        // fallback to polling if subscription not available
        const id = setInterval(fetchFirs, 5000);
        return () => clearInterval(id);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [filterId, filterCrime, filterStatus, filterLocation, filterFrom, filterTo]);

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
    // compute performance summary
    const closedFirs = data.filter(f => f.status === 'Closed');
    const handled = data.length;
    const active = data.filter(f => f.status !== 'Closed').length;
    let avgRes = 0;
    if (closedFirs.length > 0) {
      const totalMs = closedFirs.reduce((sum, f) => {
        const filed = new Date(f.date_filed).getTime();
        // assume there's a closed_at field? use updated_at as approximation
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

  return (
    <div className="min-h-screen bg-background">
      <div className="app-container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px] py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
          <aside className="bg-white p-6 rounded shadow">
            {/* Officer Badge */}
            {officerBadge && (
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700">
                  <ShieldCheck className="h-3 w-3" />
                  Officer {officerBadge}
                </div>
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </div>
            )}
            <h3 className="text-lg font-bold">Actions</h3>
            <div className="mt-4">
              <h4 className="font-medium">Register New FIR</h4>
              <FIRForm onSuccess={(fir) => setFirs((s) => [fir, ...s])} />
            </div>
          </aside>

          <main>
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-white rounded shadow text-center">
                <p className="text-sm text-muted-foreground">Cases handled</p>
                <p className="text-2xl font-semibold">{stats.handled}</p>
              </div>
              <div className="p-4 bg-white rounded shadow text-center">
                <p className="text-sm text-muted-foreground">Active cases</p>
                <p className="text-2xl font-semibold">{stats.active}</p>
              </div>
              <div className="p-4 bg-white rounded shadow text-center">
                <p className="text-sm text-muted-foreground">Closed cases</p>
                <p className="text-2xl font-semibold">{stats.closed}</p>
              </div>
              <div className="p-4 bg-white rounded shadow text-center">
                <p className="text-sm text-muted-foreground">Avg resolution (days)</p>
                <p className="text-2xl font-semibold">{stats.avgResolution.toFixed(1)}</p>
              </div>
            </div>
            <div className="mb-6 space-y-4 p-4 bg-white rounded shadow">
              <h3 className="text-lg font-semibold">Search & Filters</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <input
                  placeholder="Case ID"
                  value={filterId}
                  onChange={(e) => setFilterId(e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                />
                <select
                  value={filterCrime}
                  onChange={(e) => setFilterCrime(e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                >
                  <option value="">Crime type</option>
                  {crimeTypes.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                >
                  <option value="">Status</option>
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
                  className="border rounded px-2 py-1 w-full"
                />
                <input
                  type="date"
                  placeholder="From"
                  value={filterFrom}
                  onChange={(e) => setFilterFrom(e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                />
                <input
                  type="date"
                  placeholder="To"
                  value={filterTo}
                  onChange={(e) => setFilterTo(e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={fetchFirs}
                  className="px-3 py-1 bg-primary text-white rounded"
                >
                  Apply
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
                  className="px-3 py-1 border rounded"
                >
                  Reset
                </button>
              </div>
            </div>
            <Suspense fallback={<div className="py-8 text-center text-muted-foreground">Loading cases...</div>}>
              <FIRTable firs={firs} stations={stations} crimeTypes={crimeTypes} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}

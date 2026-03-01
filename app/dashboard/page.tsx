"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FIRTable } from "@/components/fir-table";
import { FIRForm } from "@/components/fir-form";
import type { FIRWithRelations, PoliceStation, CrimeType } from "@/lib/types";
import { createClient as createBrowserSupabaseClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const [officer, setOfficer] = useState<any>(null);
  const [firs, setFirs] = useState<FIRWithRelations[]>([]);
  const [stations, setStations] = useState<PoliceStation[]>([]);
  const [crimeTypes, setCrimeTypes] = useState<CrimeType[]>([]);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    async function load() {
      const meRes = await fetch("/api/auth/me");
      if (meRes.status === 401) return router.push("/login");
      const meJson = await meRes.json();
      if (!mounted) return;
      setOfficer(meJson.officer);

      await fetchFirs();

      // Setup Supabase realtime subscription to FIR inserts (refetch on insert)
      try {
        const supabase = createBrowserSupabaseClient();
        // subscribe using channel API for v2 client
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
  }, [router]);

  async function fetchFirs() {
    const res = await fetch("/api/firs");
    if (!res.ok) return;
    const json = await res.json();
    const data: FIRWithRelations[] = json.firs || [];
    setFirs(data);

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
            <h3 className="text-lg font-bold">Actions</h3>
            <div className="mt-4">
              <h4 className="font-medium">Register New FIR</h4>
              <FIRForm onSuccess={(fir) => setFirs((s) => [fir, ...s])} />
            </div>
            <div className="mt-6">
              <button
                onClick={async () => {
                  await fetch('/api/auth/logout', { method: 'POST' });
                  router.push('/login');
                }}
                className="px-3 py-2 bg-muted text-white rounded"
              >
                Logout
              </button>
            </div>
          </aside>

          <main>
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            <FIRTable firs={firs} stations={stations} crimeTypes={crimeTypes} />
          </main>
        </div>
      </div>
    </div>
  );
}

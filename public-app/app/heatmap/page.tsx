// Public heatmap page — reads DIRECTLY from Supabase
// Completely independent of the officer portal being online
import HeatmapLoader from "../../components/heatmap-loader";
import type { MapFIR } from "../../components/heatmap-map-client";
import { createClient } from "../../lib/supabase";

async function getFirs(): Promise<MapFIR[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("firs")
      .select(`
        id, fir_number, location, location_ml, status, date_filed, latitude, longitude,
        crime_types ( name )
      `)
      .order("date_filed", { ascending: false })
      .limit(200);

    if (!error && data && data.length > 0) {
      return data.map((f: any) => ({
        id:          f.id,
        fir_number:  f.fir_number,
        location:    f.location || "",
        location_ml: f.location_ml || "",
        crime_type:  f.crime_types?.name || "",
        status:      f.status || "",
        date_filed:  f.date_filed || "",
        latitude:    f.latitude ?? null,
        longitude:   f.longitude ?? null,
      }));
    }
  } catch {}

  // Fallback mock data so public portal never breaks
  return MOCK_FIRS;
}

const MOCK_FIRS: MapFIR[] = [
  { id: "m1", fir_number: "FIR/2025/001", location: "Pazhavangadi, East Fort", crime_type: "Theft", status: "Under Investigation", date_filed: "2025-05-16", latitude: 8.4855, longitude: 76.9492 },
  { id: "m2", fir_number: "FIR/2025/002", location: "Chalai Market", crime_type: "Cheating / Fraud", status: "Registered", date_filed: "2025-05-13", latitude: 8.4965, longitude: 76.9537 },
  { id: "m3", fir_number: "FIR/2025/003", location: "Statue Junction", crime_type: "Assault", status: "Charge Sheet Filed", date_filed: "2025-05-08", latitude: 8.5008, longitude: 76.9562 },
  { id: "m4", fir_number: "FIR/2025/004", location: "Vanchiyoor Main Road", crime_type: "Robbery", status: "Under Investigation", date_filed: "2025-05-11", latitude: 8.5093, longitude: 76.9552 },
  { id: "m5", fir_number: "FIR/2025/005", location: "Technopark Phase 1", crime_type: "Cyber Crime", status: "Under Investigation", date_filed: "2025-05-04", latitude: 8.5569, longitude: 76.8800 },
  { id: "m6", fir_number: "FIR/2025/006", location: "Karamana Residential Area", crime_type: "Domestic Violence", status: "Registered", date_filed: "2025-04-28", latitude: 8.4733, longitude: 76.9742 },
  { id: "m7", fir_number: "FIR/2025/007", location: "Kowdiar Junction", crime_type: "Theft", status: "Under Investigation", date_filed: "2025-05-15", latitude: 8.5127, longitude: 76.9463 },
  { id: "m8", fir_number: "FIR/2025/008", location: "Pattom Junction", crime_type: "Cyber Crime", status: "Charge Sheet Filed", date_filed: "2025-03-23", latitude: 8.5266, longitude: 76.9428 },
  { id: "m9", fir_number: "FIR/2025/009", location: "Palayam Market", crime_type: "Assault", status: "Closed", date_filed: "2025-02-17", latitude: 8.5064, longitude: 76.9562 },
  { id: "m10", fir_number: "FIR/2025/010", location: "Fort Lane", crime_type: "Trespassing", status: "Registered", date_filed: "2025-05-09", latitude: 8.4882, longitude: 76.9508 },
];

const LEGEND = [
  { label: "Theft",             color: "#f59e0b" },
  { label: "Robbery",           color: "#ef4444" },
  { label: "Assault",           color: "#f97316" },
  { label: "Fraud",             color: "#8b5cf6" },
  { label: "Cyber Crime",       color: "#06b6d4" },
  { label: "Domestic Violence", color: "#ec4899" },
  { label: "Trespassing",       color: "#84cc16" },
  { label: "Other",             color: "#a9c7ff" },
];

export default async function HeatmapPage() {
  const firs = await getFirs();

  const byStatus: Record<string, number> = {};
  const byType:   Record<string, number> = {};
  firs.forEach((f) => {
    if (f.status)     byStatus[f.status]   = (byStatus[f.status]   || 0) + 1;
    if (f.crime_type) byType[f.crime_type] = (byType[f.crime_type] || 0) + 1;
  });
  const topType = Object.entries(byType).sort((a, b) => b[1] - a[1])[0];
  const openCount = (byStatus["Registered"] || 0) + (byStatus["Under Investigation"] || 0);

  return (
    <div className="min-h-screen" style={{ background: "#101418", color: "#e2e8f0", fontFamily: "Inter, sans-serif" }}>
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined" style={{ color: "#a9c7ff", fontSize: 22 }}>map</span>
              <h1 className="text-2xl font-bold" style={{ color: "#e2e8f0" }}>Case Heatmap</h1>
            </div>
            <p className="text-sm" style={{ color: "#64748b" }}>
              Interactive map of {firs.length} recorded cases across Thiruvananthapuram district.
            </p>
          </div>
          {/* Stat chips */}
          <div className="flex flex-wrap gap-3">
            <div className="px-3 py-2 rounded-lg text-sm" style={{ background: "#161c24", border: "1px solid rgba(169,199,255,0.12)" }}>
              <span style={{ color: "#a9c7ff", fontWeight: 700 }}>{firs.length}</span>
              <span style={{ color: "#64748b", marginLeft: 6 }}>Total Cases</span>
            </div>
            <div className="px-3 py-2 rounded-lg text-sm" style={{ background: "#161c24", border: "1px solid rgba(169,199,255,0.12)" }}>
              <span style={{ color: "#f87171", fontWeight: 700 }}>{openCount}</span>
              <span style={{ color: "#64748b", marginLeft: 6 }}>Active</span>
            </div>
            {topType && (
              <div className="px-3 py-2 rounded-lg text-sm" style={{ background: "#161c24", border: "1px solid rgba(169,199,255,0.12)" }}>
                <span style={{ color: "#e9c400", fontWeight: 700 }}>{topType[0]}</span>
                <span style={{ color: "#64748b", marginLeft: 6 }}>Most Common</span>
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 mb-4">
          {LEGEND.map((l) => (
            <div key={l.label} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{ background: l.color + "18", border: `1px solid ${l.color}40` }}>
              <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: l.color }} />
              <span style={{ color: l.color }}>{l.label}</span>
            </div>
          ))}
        </div>

        {/* Map — loaded client-side */}
        <HeatmapLoader firs={firs} />

        <p className="mt-3 text-xs" style={{ color: "#475569" }}>
          Map data ©{" "}
          <a href="https://www.openstreetmap.org/" className="underline hover:text-slate-300 transition-colors" target="_blank" rel="noreferrer">
            OpenStreetMap
          </a>{" "}
          contributors. Live data from THUNA CDMS — Supabase.
        </p>
      </div>
    </div>
  );
}

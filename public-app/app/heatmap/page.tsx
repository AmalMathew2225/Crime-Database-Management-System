import HeatmapLoader from "../../components/heatmap-loader";
import { mockPublicFirs } from "../../lib/mock-data";
import type { MapFIR } from "../../components/heatmap-map-client";

// ── Data fetch ─────────────────────────────────────────────────────────────────
async function getFirs(): Promise<MapFIR[]> {
  try {
    const base = process.env.NEXT_PUBLIC_OFFICER_URL || "";
    if (base) {
      const res = await fetch(`${base}/api/firs`, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        const data = (json.firs || []) as any[];
        if (data.length > 0) {
          return data.map((f) => ({
            id:          f.id,
            fir_number:  f.fir_number || f.id,
            location:    f.location || "",
            location_ml: f.location_ml || "",
            crime_type:  f.crime_types?.name || f.crime_type || "",
            status:      f.status || "",
            date_filed:  f.date_filed || "",
          }));
        }
      }
    }
  } catch {}

  return mockPublicFirs.map((f: any) => ({
    id:          f.id,
    fir_number:  f.fir_number || f.id,
    location:    f.location || "",
    location_ml: f.location_ml || "",
    crime_type:  f.crime_type || f.crime_types?.name || "",
    status:      f.status || "",
    date_filed:  f.date_filed || "",
  }));
}

// ── Legend ─────────────────────────────────────────────────────────────────────
const LEGEND = [
  { label: "Theft",             color: "#f59e0b" },
  { label: "Robbery",           color: "#ef4444" },
  { label: "Assault",           color: "#f97316" },
  { label: "Murder",            color: "#dc2626" },
  { label: "Fraud",             color: "#8b5cf6" },
  { label: "Cybercrime",        color: "#06b6d4" },
  { label: "Drugs",             color: "#84cc16" },
  { label: "Domestic Violence", color: "#ec4899" },
  { label: "Other",             color: "#a9c7ff" },
];

// ── Page ───────────────────────────────────────────────────────────────────────
export default async function HeatmapPage() {
  const firs = await getFirs();

  const byStatus: Record<string, number> = {};
  const byType:   Record<string, number> = {};
  firs.forEach((f) => {
    if (f.status)     byStatus[f.status]     = (byStatus[f.status]     || 0) + 1;
    if (f.crime_type) byType[f.crime_type]   = (byType[f.crime_type]   || 0) + 1;
  });
  const topType = Object.entries(byType).sort((a, b) => b[1] - a[1])[0];
  const openCount = (byStatus["open"] || 0) + (byStatus["Registered"] || 0) + (byStatus["Active"] || 0);

  return (
    <div
      className="min-h-screen"
      style={{ background: "#101418", color: "#e2e8f0", fontFamily: "Inter, sans-serif" }}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">

        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined" style={{ color: "#a9c7ff", fontSize: 22 }}>map</span>
              <h1 className="text-2xl font-bold" style={{ color: "#e2e8f0" }}>Case Heatmap</h1>
            </div>
            <p className="text-sm" style={{ color: "#64748b" }}>
              Interactive map of {firs.length} recorded cases. Locations geocoded via OpenStreetMap — no API key required.
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
              <span style={{ color: "#64748b", marginLeft: 6 }}>Open</span>
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
            <div
              key={l.label}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{ background: l.color + "18", border: `1px solid ${l.color}40` }}
            >
              <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: l.color }} />
              <span style={{ color: l.color }}>{l.label}</span>
            </div>
          ))}
        </div>

        {/* Map — loaded client-side via HeatmapLoader */}
        <HeatmapLoader firs={firs} />

        {/* Attribution */}
        <p className="mt-3 text-xs" style={{ color: "#475569" }}>
          Map data ©{" "}
          <a href="https://www.openstreetmap.org/" className="underline hover:text-slate-300 transition-colors" target="_blank" rel="noreferrer">
            OpenStreetMap
          </a>{" "}
          contributors. Geocoding via{" "}
          <a href="https://nominatim.org/" className="underline hover:text-slate-300 transition-colors" target="_blank" rel="noreferrer">
            Nominatim
          </a>
          . Up to 40 locations plotted per load due to geocoding rate limits.
        </p>
      </div>
    </div>
  );
}

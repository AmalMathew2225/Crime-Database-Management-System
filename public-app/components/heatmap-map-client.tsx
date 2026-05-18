"use client";

import { useEffect, useRef, useState } from "react";

const CRIME_COLORS: Record<string, string> = {
  "Theft":              "#f59e0b",
  "Robbery":            "#ef4444",
  "Assault":            "#f97316",
  "Murder":             "#dc2626",
  "Fraud":              "#8b5cf6",
  "Cheating":           "#8b5cf6",
  "Cyber Crime":        "#06b6d4",
  "Cybercrime":         "#06b6d4",
  "Drugs":              "#84cc16",
  "Domestic Violence":  "#ec4899",
  "Trespassing":        "#84cc16",
  "default":            "#a9c7ff",
};

function crimeColor(crimeType?: string) {
  if (!crimeType) return CRIME_COLORS.default;
  for (const [key, val] of Object.entries(CRIME_COLORS)) {
    if (crimeType.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return CRIME_COLORS.default;
}

export interface MapFIR {
  id: string;
  fir_number: string;
  location: string;
  location_ml?: string;
  crime_type?: string;
  status?: string;
  date_filed?: string;
  latitude?: number | null;
  longitude?: number | null;
}

interface Props { firs: MapFIR[]; }

async function geocode(query: string): Promise<[number, number] | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ", Kerala, India")}&format=json&limit=1`;
    const res = await fetch(url, { headers: { "Accept-Language": "en", "User-Agent": "THUNA-CDMS/1.0" } });
    const json = await res.json();
    if (json[0]) return [parseFloat(json[0].lat), parseFloat(json[0].lon)];
  } catch {}
  return null;
}

function markerSvg(color: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
    <circle cx="14" cy="14" r="10" fill="${color}" fill-opacity="0.85" stroke="#101418" stroke-width="2.5"/>
    <circle cx="14" cy="14" r="4" fill="white" fill-opacity="0.9"/>
  </svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

export default function HeatmapMapClient({ firs }: Props) {
  const mapRef     = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);
  const [resolved, setResolved] = useState(0);
  const [total, setTotal]       = useState(0);
  const [status, setStatus]     = useState<"idle" | "geocoding" | "done">("idle");

  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    import("leaflet").then((L) => {
      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (!mapRef.current) return;

      const map = L.map(mapRef.current, {
        center: [8.5241, 76.9366], // Thiruvananthapuram
        zoom: 12,
        zoomControl: true,
      });
      leafletMap.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      // Split firs: those with coords (instant) vs those needing geocoding
      const withCoords = firs.filter(f => f.latitude != null && f.longitude != null);
      const needsGeocode = firs.filter(f => f.latitude == null || f.longitude == null).slice(0, 40);

      const addMarker = (lat: number, lng: number, fir: MapFIR) => {
        const color = crimeColor(fir.crime_type);
        const icon = L.icon({ iconUrl: markerSvg(color), iconSize: [28, 28], iconAnchor: [14, 14], popupAnchor: [0, -16] });
        const date = fir.date_filed ? new Date(fir.date_filed).toLocaleDateString("en-IN") : "—";
        const loc = fir.location_ml || fir.location;
        L.marker([lat, lng], { icon }).addTo(map).bindPopup(`
          <div style="font-family:Inter,sans-serif;min-width:180px">
            <div style="font-weight:700;font-size:13px;color:#001e40;margin-bottom:4px">${fir.fir_number || "FIR"}</div>
            <div style="font-size:11px;margin-bottom:2px"><span style="font-weight:600;color:${color}">${fir.crime_type || "Unknown"}</span></div>
            <div style="font-size:11px;color:#43474f;margin-bottom:2px">📍 ${loc}</div>
            <div style="font-size:11px;color:#43474f">📅 ${date} &nbsp;·&nbsp; <span style="font-weight:600">${fir.status || ""}</span></div>
          </div>
        `);
      };

      // Plot pre-coded markers instantly
      withCoords.forEach(f => addMarker(f.latitude!, f.longitude!, f));

      // Geocode the rest
      if (needsGeocode.length === 0) {
        setStatus("done");
        setResolved(withCoords.length);
        setTotal(withCoords.length);
        return;
      }

      setTotal(withCoords.length + needsGeocode.length);
      setResolved(withCoords.length);
      setStatus("geocoding");

      let i = 0;
      const plotNext = () => {
        if (i >= needsGeocode.length) { setStatus("done"); return; }
        const fir = needsGeocode[i++];
        const loc = fir.location_ml || fir.location;
        if (!loc) { setResolved(r => r + 1); setTimeout(plotNext, 300); return; }
        geocode(loc).then(coords => {
          if (coords && leafletMap.current) addMarker(coords[0], coords[1], fir);
          setResolved(r => r + 1);
          setTimeout(plotNext, 1100);
        });
      };
      setTimeout(plotNext, 400);
    });

    return () => {
      if (leafletMap.current) { leafletMap.current.remove(); leafletMap.current = null; }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full" style={{ height: "calc(100vh - 200px)", minHeight: 520 }}>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={mapRef} className="w-full h-full rounded-xl overflow-hidden border border-white/10" />
      {status === "geocoding" && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[500] flex items-center gap-3 px-4 py-2.5 rounded-xl shadow-lg"
          style={{ background: "rgba(16,20,24,0.92)", border: "1px solid rgba(169,199,255,0.15)" }}>
          <div className="h-4 w-4 border-2 rounded-full animate-spin"
            style={{ borderTopColor: "#a9c7ff", borderColor: "rgba(169,199,255,0.25)" }} />
          <span style={{ color: "#a9c7ff", fontSize: 12, fontWeight: 600 }}>
            Plotting {resolved} / {total} locations…
          </span>
        </div>
      )}
      {status === "done" && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[500] flex items-center gap-2 px-4 py-2 rounded-xl shadow"
          style={{ background: "rgba(16,20,24,0.88)", border: "1px solid rgba(169,199,255,0.12)" }}>
          <span style={{ color: "#4ade80", fontSize: 12 }}>✓</span>
          <span style={{ color: "#a9c7ff", fontSize: 12, fontWeight: 600 }}>{resolved} case{resolved !== 1 ? "s" : ""} plotted</span>
        </div>
      )}
    </div>
  );
}

"use client";
// Crime heatmap for the officer dashboard
// Uses Leaflet + pre-stored lat/lng or Nominatim geocoding fallback

import { useEffect, useRef, useState } from "react";
import type { FIRWithRelations, CrimeType } from "@/lib/types";

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
  "Trespassing":        "#22d3ee",
  "default":            "#a9c7ff",
};

export function crimeColor(name?: string) {
  if (!name) return CRIME_COLORS.default;
  for (const [k, v] of Object.entries(CRIME_COLORS)) {
    if (name.toLowerCase().includes(k.toLowerCase())) return v;
  }
  return CRIME_COLORS.default;
}

async function geocode(q: string): Promise<[number, number] | null> {
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q + ", Thiruvananthapuram, Kerala, India")}&format=json&limit=1`,
      { headers: { "Accept-Language": "en", "User-Agent": "THUNA-CDMS-Officer/1.0" } }
    );
    const j = await r.json();
    if (j[0]) return [parseFloat(j[0].lat), parseFloat(j[0].lon)];
  } catch {}
  return null;
}

function makeSvgIcon(color: string, size = 26) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <circle cx="${size/2}" cy="${size/2}" r="${size/2-2}" fill="${color}" fill-opacity="0.85" stroke="#0d1c32" stroke-width="2"/>
    <circle cx="${size/2}" cy="${size/2}" r="${size/4}" fill="white" fill-opacity="0.9"/>
  </svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

interface Props {
  firs: FIRWithRelations[];
  crimeTypes: CrimeType[];
  filterCrimeTypeId?: string;
}

export default function CrimeHeatmap({ firs, crimeTypes, filterCrimeTypeId }: Props) {
  const mapRef     = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);
  const layerGroup = useRef<any>(null);
  const [geocoding, setGeocoding] = useState(false);
  const [plotted, setPlotted]     = useState(0);

  // Re-plot whenever firs or filter changes
  useEffect(() => {
    if (!mapRef.current) return;

    import("leaflet").then((L) => {
      if (!leafletMap.current) {
        // @ts-ignore
        delete L.Icon.Default.prototype._getIconUrl;
        const map = L.map(mapRef.current!, {
          center: [8.5241, 76.9366],
          zoom: 12,
          zoomControl: true,
        });
        leafletMap.current = map;
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '© <a href="https://www.openstreetmap.org/">OSM</a>',
          maxZoom: 19,
        }).addTo(map);
        layerGroup.current = L.layerGroup().addTo(map);
      }

      // Clear existing markers
      layerGroup.current.clearLayers();
      setPlotted(0);

      const filtered = filterCrimeTypeId
        ? firs.filter(f => f.crime_type_id === filterCrimeTypeId)
        : firs;

      const withCoords = filtered.filter(f => f.latitude != null && f.longitude != null);
      const noCoords   = filtered.filter(f => f.latitude == null || f.longitude == null).slice(0, 30);

      const addMarker = (lat: number, lng: number, fir: FIRWithRelations) => {
        const color = crimeColor(fir.crime_types?.name);
        const icon = (L as any).icon({ iconUrl: makeSvgIcon(color), iconSize: [26, 26], iconAnchor: [13, 13], popupAnchor: [0, -15] });
        const popup = `
          <div style="font-family:Inter,sans-serif;min-width:200px;font-size:12px">
            <div style="font-weight:700;font-size:13px;color:#001e40;margin-bottom:6px">${fir.fir_number}</div>
            <div style="margin-bottom:3px"><span style="font-weight:600;color:${color}">${fir.crime_types?.name || "Unknown"}</span> · ${fir.crime_types?.ipc_section || ""}</div>
            <div style="color:#43474f;margin-bottom:3px">📍 ${fir.location}</div>
            <div style="color:#43474f;margin-bottom:3px">👤 ${fir.complainant_name}</div>
            <div style="color:#43474f">📅 ${new Date(fir.date_filed).toLocaleDateString("en-IN")} · <strong>${fir.status}</strong></div>
          </div>`;
        (L as any).marker([lat, lng], { icon }).addTo(layerGroup.current).bindPopup(popup);
      };

      withCoords.forEach(f => { addMarker(f.latitude!, f.longitude!, f); setPlotted(p => p + 1); });

      if (noCoords.length === 0) { setGeocoding(false); return; }
      setGeocoding(true);
      let i = 0;
      const next = () => {
        if (i >= noCoords.length) { setGeocoding(false); return; }
        const f = noCoords[i++];
        geocode(f.location).then(coords => {
          if (coords) { addMarker(coords[0], coords[1], f); setPlotted(p => p + 1); }
          setTimeout(next, 1100);
        });
      };
      setTimeout(next, 500);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firs, filterCrimeTypeId]);

  useEffect(() => () => { if (leafletMap.current) { leafletMap.current.remove(); leafletMap.current = null; } }, []);

  return (
    <div className="flex flex-col gap-2 h-full">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

      {/* Crime type filter pills */}
      <div className="flex flex-wrap gap-1.5">
        {crimeTypes.slice(0, 7).map(ct => {
          const col = crimeColor(ct.name);
          const active = filterCrimeTypeId === ct.id;
          return (
            <button
              key={ct.id}
              onClick={() => {/* handled by parent */}}
              className="px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all"
              style={{
                background: active ? col : col + "22",
                color: active ? "#fff" : col,
                border: `1px solid ${col}50`,
              }}
            >
              {ct.name}
            </button>
          );
        })}
      </div>

      <div className="relative flex-1" style={{ minHeight: 380 }}>
        <div ref={mapRef} className="w-full h-full rounded-xl overflow-hidden border border-slate-200" style={{ minHeight: 380 }} />
        {geocoding && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[500] flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
            style={{ background: "rgba(13,28,50,0.9)", color: "#a9c7ff", border: "1px solid rgba(169,199,255,0.2)" }}>
            <div className="h-3 w-3 border-2 rounded-full animate-spin" style={{ borderTopColor: "#a9c7ff", borderColor: "rgba(169,199,255,0.2)" }} />
            Plotting locations… {plotted}/{firs.length}
          </div>
        )}
      </div>
    </div>
  );
}

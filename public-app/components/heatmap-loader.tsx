"use client";

import dynamic from "next/dynamic";
import type { MapFIR } from "./heatmap-map-client";

const HeatmapMapClient = dynamic(() => import("./heatmap-map-client"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full rounded-xl border border-white/10 animate-pulse flex items-center justify-center"
      style={{ height: "calc(100vh - 200px)", minHeight: 520, background: "#161c24" }}
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className="h-8 w-8 border-4 rounded-full animate-spin"
          style={{ borderColor: "rgba(169,199,255,0.2)", borderTopColor: "#a9c7ff" }}
        />
        <span style={{ color: "#a9c7ff", fontSize: 13, fontWeight: 600 }}>Loading map…</span>
      </div>
    </div>
  ),
});

export default function HeatmapLoader({ firs }: { firs: MapFIR[] }) {
  return <HeatmapMapClient firs={firs} />;
}

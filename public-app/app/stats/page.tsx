import { use } from "react";
import { StatsCharts } from "../../components/stats-charts";
import { mockPublicFirs } from "../../lib/mock-data";

async function getFirs() {
  try {
    const base = process.env.NEXT_PUBLIC_OFFICER_URL || '';
    if (base) {
      const res = await fetch(`${base}/api/firs`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.firs && json.firs.length > 0) return json.firs;
      }
    }
  } catch {
    // fall through to mock data
  }
  return mockPublicFirs;
}

export default async function StatsPage() {
  const firs = await getFirs();
  const byStatus: Record<string, number> = {};
  const byCrime: Record<string, number> = {};

  firs.forEach((f: any) => {
    byStatus[f.status] = (byStatus[f.status] || 0) + 1;
    const ct = f.crime_types?.name || 'Unknown';
    byCrime[ct] = (byCrime[ct] || 0) + 1;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Statistics</h1>
      <StatsCharts byStatus={byStatus} byCrime={byCrime} />
    </div>
  );
}

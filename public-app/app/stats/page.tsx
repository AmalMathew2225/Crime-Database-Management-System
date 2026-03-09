import { use } from "react";
import { StatsCharts } from "../../components/stats-charts";

async function getFirs() {
  const base = process.env.NEXT_PUBLIC_OFFICER_URL || '';
  const res = await fetch(`${base}/api/firs`, { cache: 'no-store' });
  if (!res.ok) return [];
  const json = await res.json();
  return json.firs || [];
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

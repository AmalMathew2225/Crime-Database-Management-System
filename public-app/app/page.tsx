import { FIRTable } from "../components/fir-table";
import { mockPublicFirs } from "../lib/mock-data";

async function getPublicFirs() {
  // Try fetching from the officer-app API first; fall back to local mock data
  try {
    const base = process.env.NEXT_PUBLIC_OFFICER_URL || '';
    if (base) {
      const res = await fetch(`${base}/api/firs`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.firs?.length) return json.firs;
      }
    }
  } catch {
    // fall through to mock data
  }
  return mockPublicFirs;
}


export default async function HomePage() {
  const firs = await getPublicFirs();
  const stations = firs.map((f: any) => f.police_stations).filter(Boolean);
  const crimeTypes = firs.map((f: any) => f.crime_types).filter(Boolean);

  // compute simple stats
  const closed = firs.filter((f: any) => f.status === 'Closed').length;
  const active = firs.length - closed;
  const avgResolution = closed
    ? closed
      ? (
        firs
          .filter((f: any) => f.status === 'Closed')
          .reduce((sum: number, f: any) => {
            const filed = new Date(f.date_filed).getTime();
            const closedAt = new Date(f.updated_at || f.date_filed).getTime();
            return sum + (closedAt - filed);
          }, 0) /
        closed /
        (1000 * 60 * 60 * 24)
      ).toFixed(1)
      : 0
    : 0;

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-blue-700 py-16 px-6 text-white shadow-2xl mb-12">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-blue-600 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-blue-400 opacity-20 blur-3xl"></div>

        <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
            Crime Transparency <span className="text-blue-200 underline decoration-blue-300/30">Portal</span>
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-xl">
            Providing real-time access to crime statistics and FIR reports for the citizens of Kerala. Stay informed and help us build a safer community.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#recent-firs" className="rounded-full bg-white px-6 py-3 text-sm font-bold text-blue-700 shadow-lg transition-transform hover:scale-105 active:scale-95">
              Browse FIRs
            </a>
            <div className="flex items-center gap-1 text-sm text-blue-100">
              <span className="inline-block h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
              Live Data from Cyber Dome
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Premium Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total FIRs", value: firs.length, icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", color: "blue" },
          { label: "Active Cases", value: active, icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", color: "amber" },
          { label: "Closed Cases", value: closed, icon: "M5 13l4 4L19 7", color: "green" },
          { label: "Avg Resolution", value: `${avgResolution} Days`, icon: "M13 10V3L4 14h7v7l9-11h-7z", color: "indigo" }
        ].map((stat, i) => (
          <div key={i} className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-md transition-all hover:shadow-xl hover:-translate-y-1">
            <div className={`absolute top-0 right-0 h-24 w-24 -mt-8 -mr-8 rounded-full bg-${stat.color}-50 transition-colors group-hover:bg-${stat.color}-100 opacity-50`}></div>
            <div className="relative z-10">
              <div className={`p-2 rounded-lg bg-${stat.color}-100 text-${stat.color}-600 inline-block mb-4`}>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} /></svg>
              </div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-8">
        <FIRTable firs={firs} stations={stations} crimeTypes={crimeTypes} />
      </div>
    </div>
  );
}

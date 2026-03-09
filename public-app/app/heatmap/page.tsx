import { use } from "react";

async function getFirs() {
  const base = process.env.NEXT_PUBLIC_OFFICER_URL || '';
  const res = await fetch(`${base}/api/firs`, { cache: 'no-store' });
  if (!res.ok) return [];
  const json = await res.json();
  return json.firs || [];
}

export default async function HeatmapPage() {
  const firs = await getFirs();
  const locations = firs
    .map((f: any) => f.location_ml || f.location)
    .filter(Boolean)
    .slice(0, 50); // limit to 50 markers

  const baseUrl = "https://maps.googleapis.com/maps/api/staticmap";
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const markersParam = locations.map((loc) => `markers=${encodeURIComponent(loc)}`).join("&");
  const mapUrl = `${baseUrl}?size=800x600&${markersParam}&key=${key}`;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Case Heatmap</h1>
      <p className="mb-4">
        The map below shows the locations of recent cases. If you need more
        detail, export the data and load into your own GIS tool.
      </p>
      {key ? (
        <div className="w-full overflow-auto">
          <img src={mapUrl} alt="Heatmap of cases" className="w-full h-auto rounded shadow" />
        </div>
      ) : (
        <p className="text-red-600">Google Maps API key not configured.</p>
      )}
    </div>
  );
}

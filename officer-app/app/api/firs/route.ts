import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { mockDashboardData } from "@/lib/mock-data";

const FIR_SELECT = `
  *,
  police_stations ( id, name, district, code ),
  crime_types     ( id, name, ipc_section ),
  officers        ( id, name, rank, badge_number )
`;

// ── Supabase fetch ─────────────────────────────────────────────────────────────
async function getFirsFromDB(filters: Record<string, string | null>) {
  const supabase = createServiceClient();

  let query = supabase
    .from("firs")
    .select(FIR_SELECT)
    .order("date_filed", { ascending: false });

  if (filters.id)        query = query.eq("id", filters.id);
  if (filters.status)    query = query.eq("status", filters.status);
  if (filters.location)  query = query.ilike("location", `%${filters.location}%`);
  if (filters.date_from) query = query.gte("date_filed", filters.date_from);
  if (filters.date_to)   query = query.lte("date_filed", filters.date_to);
  if (filters.crime_type) {
    // crime_type param can be an ID or a name — try both
    query = query.eq("crime_type_id", filters.crime_type);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

// ── Shape a Supabase row to match the format both portals expect ───────────────
function shapeRow(row: any) {
  return {
    id:                        row.id,
    fir_number:                row.fir_number,
    date_filed:                row.date_filed,
    status:                    row.status,
    location:                  row.location,
    location_ml:               row.location_ml ?? row.location,
    description:               row.description,
    act:                       row.act,
    sections:                  row.sections,
    occurrence_date:           row.occurrence_date,
    occurrence_time:           row.occurrence_time,
    complainant_name:          row.complainant_name,
    accused_details:           row.accused_details,
    crime_type_id:             row.crime_type_id,
    police_station_id:         row.police_station_id,
    investigating_officer_id:  row.investigating_officer_id,
    created_at:                row.created_at,
    updated_at:                row.updated_at,
    // joined relations — same shape as mock data
    police_stations: row.police_stations ?? null,
    crime_types:     row.crime_types     ?? null,
    officers:        row.officers        ?? null,
  };
}

// ── GET ────────────────────────────────────────────────────────────────────────
export async function GET(request: Request) {
  const url = new URL(request.url);
  const filters = {
    id:         url.searchParams.get("id"),
    crime_type: url.searchParams.get("crime_type"),
    status:     url.searchParams.get("status"),
    location:   url.searchParams.get("location"),
    date_from:  url.searchParams.get("date_from"),
    date_to:    url.searchParams.get("date_to"),
  };

  // ── Try Supabase first ───────────────────────────────────────────────────────
  try {
    const rows = await getFirsFromDB(filters);
    if (rows.length > 0) {
      const firs = rows.map(shapeRow);

      // Also surface crime types for public portal dropdowns
      const crimeTypesMap = new Map<string, any>();
      firs.forEach((f) => {
        if (f.crime_types) crimeTypesMap.set(f.crime_types.id, f.crime_types);
      });

      return NextResponse.json(
        { firs, crimeTypes: Array.from(crimeTypesMap.values()) },
        { headers: { "Cache-Control": "no-store" } }
      );
    }
  } catch (err) {
    console.warn("[/api/firs] Supabase error, falling back to mock:", err);
  }

  // ── Fallback: mock data ──────────────────────────────────────────────────────
  let firs: any[] = [...mockDashboardData.firs];
  if (filters.id)         firs = firs.filter((f) => f.id === filters.id);
  if (filters.crime_type) firs = firs.filter((f) => f.crime_type_id === filters.crime_type);
  if (filters.status)     firs = firs.filter((f) => f.status === filters.status);
  if (filters.location)   firs = firs.filter((f) => f.location?.toLowerCase().includes((filters.location ?? "").toLowerCase()));
  if (filters.date_from)  firs = firs.filter((f) => f.date_filed >= (filters.date_from ?? ""));
  if (filters.date_to)    firs = firs.filter((f) => f.date_filed <= (filters.date_to ?? ""));

  return NextResponse.json({ firs, _source: "mock" });
}

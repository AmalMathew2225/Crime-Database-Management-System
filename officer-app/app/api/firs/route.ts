import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { mockDashboardData } from "@/lib/mock-data";
import { verifyToken } from "@/lib/auth";
import { z } from "zod";
import { cookies } from "next/headers";

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

  if (filters.id)         query = query.eq("id", filters.id);
  if (filters.status)     query = query.eq("status", filters.status);
  if (filters.location)   query = query.ilike("location", `%${filters.location}%`);
  if (filters.date_from)  query = query.gte("date_filed", filters.date_from);
  if (filters.date_to)    query = query.lte("date_filed", filters.date_to);
  if (filters.crime_type) query = query.eq("crime_type_id", filters.crime_type);

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
    police_station_id:         row.police_station_id ?? row.station_id,
    investigating_officer_id:  row.investigating_officer_id,
    created_at:                row.created_at,
    updated_at:                row.updated_at,
    police_stations:           row.police_stations ?? null,
    crime_types:               row.crime_types     ?? null,
    officers:                  row.officers        ?? null,
  };
}

// ── GET /api/firs ──────────────────────────────────────────────────────────────
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

  try {
    const rows = await getFirsFromDB(filters);
    if (rows.length > 0) {
      const firs = rows.map(shapeRow);
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
    console.warn("[GET /api/firs] Supabase error, falling back to mock:", err);
  }

  // Fallback to mock data
  let firs: any[] = [...mockDashboardData.firs];
  if (filters.id)         firs = firs.filter((f) => f.id === filters.id);
  if (filters.crime_type) firs = firs.filter((f) => f.crime_type_id === filters.crime_type);
  if (filters.status)     firs = firs.filter((f) => f.status === filters.status);
  if (filters.location)   firs = firs.filter((f) => f.location?.toLowerCase().includes((filters.location ?? "").toLowerCase()));
  if (filters.date_from)  firs = firs.filter((f) => f.date_filed >= (filters.date_from ?? ""));
  if (filters.date_to)    firs = firs.filter((f) => f.date_filed <= (filters.date_to ?? ""));
  return NextResponse.json({ firs, _source: "mock" });
}

// ── POST /api/firs — File a new FIR ───────────────────────────────────────────
const FirPostSchema = z.object({
  complainant_name:   z.string().min(1),
  location:           z.string().min(1),
  crime_type_id:      z.string().min(1),
  description:        z.string().min(1),
  date_of_occurrence: z.string().nullable().optional(),
  time_of_occurrence: z.string().nullable().optional(),
  ipc_sections:       z.string().nullable().optional(),
  accused:            z.any().optional(),
  property_items:     z.any().optional(),
});

export async function POST(request: Request) {
  // Auth via JWT cookie
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value ?? "";
  const payload = token ? verifyToken(token) : null;
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = FirPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const supabase = createServiceClient();

    // Resolve officer → get their station_id
    const { data: officer, error: offErr } = await supabase
      .from("officers")
      .select("id, name, rank, badge_number, station_id")
      .eq("uid", payload.uid)
      .single();

    if (offErr || !officer) {
      return NextResponse.json({ error: "Officer not found" }, { status: 403 });
    }

    // Generate sequential FIR number: KP-{CODE}-{YYYY}-{seq}
    const year = new Date().getFullYear();
    const { count } = await supabase
      .from("firs")
      .select("id", { count: "exact", head: true })
      .eq("station_id", officer.station_id);
    const seq = String((count ?? 0) + 1).padStart(4, "0");

    const { data: station } = await supabase
      .from("police_stations")
      .select("code, name")
      .eq("id", officer.station_id)
      .single();

    const stationCode = station?.code ?? "KP";
    const fir_number  = `KP-${stationCode}-${year}-${seq}`;

    const { data: newFir, error: insertErr } = await supabase
      .from("firs")
      .insert({
        fir_number,
        date_filed:               new Date().toISOString().slice(0, 10),
        time_filed:               new Date().toTimeString().split(" ")[0],
        station_id:               officer.station_id,
        crime_type_id:            parsed.data.crime_type_id,
        investigating_officer_id: officer.id,
        location:                 parsed.data.location,
        location_ml:              parsed.data.location,
        description:              parsed.data.description,
        complainant_name:         parsed.data.complainant_name,
        status:                   "Under Investigation",
      })
      .select(FIR_SELECT)
      .single();

    if (insertErr) throw insertErr;
    return NextResponse.json({ ok: true, fir: shapeRow(newFir) }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/firs]", err);
    return NextResponse.json({ error: "Failed to file FIR" }, { status: 500 });
  }
}

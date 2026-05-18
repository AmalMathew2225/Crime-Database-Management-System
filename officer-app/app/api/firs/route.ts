import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { z } from "zod";
import { getAuthenticatedOfficer } from "@/lib/session";

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
  const officer = await getAuthenticatedOfficer(request);
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
    const firs = rows.map(shapeRow);
    const crimeTypesMap = new Map<string, any>();
    firs.forEach((f) => {
      if (f.crime_types) crimeTypesMap.set(f.crime_types.id, f.crime_types);
    });
    return NextResponse.json(
      { firs, crimeTypes: Array.from(crimeTypesMap.values()) },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("[GET /api/firs] Supabase error:", err);
    return NextResponse.json({ error: "Failed to load FIRs" }, { status: 500 });
  }
}

// ── POST /api/firs — File a new FIR ───────────────────────────────────────────
const FirPostSchema = z.object({
  complainant_name:   z.string().min(1),
  location:           z.string().min(1),
  crime_type_id:      z.string().min(1),
  description:        z.string().min(1),
  guardian_name:      z.string().nullable().optional(),
  gender:             z.string().nullable().optional(),
  age:                z.number().nullable().optional(),
  dob:                z.string().nullable().optional(),
  address:            z.string().nullable().optional(),
  phone:              z.string().nullable().optional(),
  date_of_occurrence: z.string().nullable().optional(),
  time_of_occurrence: z.string().nullable().optional(),
  ipc_sections:       z.string().nullable().optional(),
  accused:            z.array(z.object({
    name: z.string().optional(),
    address: z.string().optional(),
    description: z.string().optional(),
  })).optional(),
  property_items:     z.array(z.object({
    item_name: z.string().min(1),
    quantity: z.number().optional(),
    estimated_value: z.number().optional(),
  })).optional(),
});

export async function POST(request: Request) {
  const officer = await getAuthenticatedOfficer(request);
  if (!officer) {
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

    if (!officer.station_id) {
      return NextResponse.json({ error: "Officer has no assigned station" }, { status: 403 });
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
        guardian_name:            parsed.data.guardian_name ?? null,
        gender:                   parsed.data.gender ?? null,
        age:                      parsed.data.age ?? null,
        dob:                      parsed.data.dob ?? null,
        address:                  parsed.data.address ?? null,
        phone:                    parsed.data.phone ?? null,
        occurrence_date:          parsed.data.date_of_occurrence ?? null,
        occurrence_time:          parsed.data.time_of_occurrence ?? null,
        sections:                 parsed.data.ipc_sections ?? null,
        status:                   "Under Investigation",
      })
      .select(FIR_SELECT)
      .single();

    if (insertErr) throw insertErr;

    if (parsed.data.accused?.length) {
      const accusedRows = parsed.data.accused.map((item) => ({
        fir_id: newFir.id,
        name: item.name ?? null,
        address: item.address ?? null,
        description: item.description ?? null,
      }));
      const { error } = await supabase.from("accused").insert(accusedRows);
      if (error) throw error;
    }

    if (parsed.data.property_items?.length) {
      const propertyRows = parsed.data.property_items.map((item) => ({
        fir_id: newFir.id,
        item_name: item.item_name,
        quantity: item.quantity ?? 1,
        estimated_value: item.estimated_value ?? null,
      }));
      const { error } = await supabase.from("property_items").insert(propertyRows);
      if (error) throw error;
    }

    return NextResponse.json({ ok: true, fir: shapeRow(newFir) }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/firs]", err);
    return NextResponse.json({ error: "Failed to file FIR" }, { status: 500 });
  }
}

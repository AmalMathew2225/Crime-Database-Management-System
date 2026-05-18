import { NextResponse, NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { z } from "zod";
import { getAuthenticatedOfficer } from "@/lib/session";

const FIR_SELECT = `
  *,
  police_stations ( id, name, district, code, phone, email, address ),
  crime_types     ( id, name, ipc_section, description ),
  officers        ( id, name, rank, badge_number ),
  accused         ( * ),
  property_items  ( * )
`;

function shapeRow(row: any) {
  return {
    id:                        row.id,
    fir_number:                row.fir_number,
    date_filed:                row.date_filed,
    time_filed:                row.time_filed,
    status:                    row.status,
    location:                  row.location,
    location_ml:               row.location_ml ?? row.location,
    description:               row.description,
    act:                       row.act,
    sections:                  row.sections,
    occurrence_date:           row.occurrence_date,
    occurrence_time:           row.occurrence_time,
    complainant_name:          row.complainant_name,
    guardian_name:             row.guardian_name,
    gender:                    row.gender,
    age:                       row.age,
    dob:                       row.dob,
    address:                   row.address,
    phone:                     row.phone,
    accused_details:           row.accused_details,
    crime_type_id:             row.crime_type_id,
    police_station_id:         row.police_station_id,
    investigating_officer_id:  row.investigating_officer_id,
    created_at:                row.created_at,
    updated_at:                row.updated_at,
    police_stations:           row.police_stations ?? null,
    crime_types:               row.crime_types     ?? null,
    officers:                  row.officers        ?? null,
    accused:                   row.accused         ?? [],
    property_items:            row.property_items  ?? [],
    case_notes:                row.case_notes      ?? [],
    evidence:                  row.evidence        ?? [],
  };
}

// ── GET /api/firs/[id] ─────────────────────────────────────────────────────────
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("firs")
      .select(FIR_SELECT)
      .eq("id", id)
      .single();

    if (!error && data) {
      return NextResponse.json({ fir: shapeRow(data) });
    }
  } catch (err) {
    console.error(`[/api/firs/${id}] Supabase error:`, err);
    return NextResponse.json({ error: "Failed to load case" }, { status: 500 });
  }

  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

// ── PATCH /api/firs/[id] ──────────────────────────────────────────────────────
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const officer = await getAuthenticatedOfficer(request);
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const updateSchema = z.object({
    status:      z.string().optional(),
    description: z.string().optional(),
    location:    z.string().optional(),
  });

  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  try {
    const supabase = createServiceClient();

    // Check the FIR exists in DB
    const { data: existing } = await supabase
      .from("firs")
      .select("id")
      .eq("id", id)
      .single();

    if (existing) {
      const { data: updated, error } = await supabase
        .from("firs")
        .update({ ...parsed.data, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select(FIR_SELECT)
        .single();

      if (error) throw error;
      return NextResponse.json({ fir: shapeRow(updated) });
    }
  } catch (err) {
    console.warn(`[PATCH /api/firs/${id}] Supabase error:`, err);
    return NextResponse.json({ error: "Failed to update case" }, { status: 500 });
  }

  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

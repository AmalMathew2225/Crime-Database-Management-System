import { NextResponse, NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { mockDashboardData } from "@/lib/mock-data";
import { z } from "zod";

const FIR_SELECT = `
  *,
  police_stations ( id, name, district, code ),
  crime_types     ( id, name, ipc_section ),
  officers        ( id, name, rank, badge_number )
`;

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
    police_stations:           row.police_stations ?? null,
    crime_types:               row.crime_types     ?? null,
    officers:                  row.officers        ?? null,
    // extended fields for case detail page
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

  // ── Try Supabase ─────────────────────────────────────────────────────────────
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
    console.warn(`[/api/firs/${id}] Supabase error, trying mock:`, err);
  }

  // ── Fallback: mock data ───────────────────────────────────────────────────────
  const fir = mockDashboardData.firs.find((f: any) => f.id === id) ?? null;
  if (!fir) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ fir });
}

// ── PATCH /api/firs/[id] ──────────────────────────────────────────────────────
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

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

  // ── Try Supabase first ────────────────────────────────────────────────────────
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

  // ── FIR not in Supabase — it's a mock entry ───────────────────────────────────
  const mockFir = mockDashboardData.firs.find((f: any) => f.id === id);
  if (!mockFir) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = { ...mockFir, ...parsed.data, updated_at: new Date().toISOString() };
  return NextResponse.json({ fir: updated, _source: "mock" });
}

import { NextResponse, NextRequest } from "next/server";
import { mockDashboardData } from "@/lib/mock-data";
import { runtimeFirs } from "@/lib/fir-store";
import { z } from "zod";

// Find a FIR by id — runtime store shadows mock data (runtime entries take priority)
function findFir(id: string) {
  return (
    runtimeFirs.find((f) => f.id === id) ??
    mockDashboardData.firs.find((f) => f.id === id) ??
    null
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const fir = findFir(id);
    if (!fir) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ fir });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateSchema = z.object({
      status: z.string().optional(),
      description: z.string().optional(),
      location: z.string().optional(),
    });

    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Case 1: FIR is already in runtimeFirs — update in place
    const runtimeIdx = runtimeFirs.findIndex((f) => f.id === id);
    if (runtimeIdx !== -1) {
      runtimeFirs[runtimeIdx] = {
        ...runtimeFirs[runtimeIdx],
        ...parsed.data,
        updated_at: new Date().toISOString(),
      };
      return NextResponse.json({ fir: runtimeFirs[runtimeIdx] });
    }

    // Case 2: FIR is a mock entry — promote to runtimeFirs with updates applied
    // Note: this update only persists for the lifetime of the server process.
    // On server restart, mock FIRs revert to their original values.
    const mockFir = mockDashboardData.firs.find((f) => f.id === id);
    if (!mockFir) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = {
      ...mockFir,
      ...parsed.data,
      updated_at: new Date().toISOString(),
      // Preserve resolved relations
      police_stations: mockFir.police_stations,
      crime_types: mockFir.crime_types,
      officers: mockFir.officers,
    };

    // Promote to runtimeFirs so subsequent GETs return the updated version
    // (runtimeFirs is checked before mockDashboardData in findFir)
    runtimeFirs.unshift(updated);

    return NextResponse.json({
      fir: updated,
      _warning:
        process.env.NODE_ENV !== "production"
          ? "This update is stored in memory only and will be lost on server restart. Connect Supabase for persistent storage."
          : undefined,
    });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

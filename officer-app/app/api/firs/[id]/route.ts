import { NextResponse, NextRequest } from "next/server";
import { mockDashboardData } from "@/lib/mock-data";
import { runtimeFirs } from "@/lib/fir-store";
import { z } from "zod";

// Find a FIR by id from runtime store first, then mock data
function findFir(id: string) {
  return runtimeFirs.find((f) => f.id === id) ?? mockDashboardData.firs.find((f) => f.id === id) ?? null;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const fir = findFir(id);
    if (!fir) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ fir });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateSchema = z.object({
      status: z.string().optional(),
      description: z.string().optional(),
      location: z.string().optional(),
    });

    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

    // Try to update in runtimeFirs first
    const runtimeIdx = runtimeFirs.findIndex((f) => f.id === id);
    if (runtimeIdx !== -1) {
      runtimeFirs[runtimeIdx] = {
        ...runtimeFirs[runtimeIdx],
        ...parsed.data,
        updated_at: new Date().toISOString(),
      };
      return NextResponse.json({ fir: runtimeFirs[runtimeIdx] });
    }

    // For mock FIRs, find and update in-place by pushing a mutated copy to runtimeFirs
    const mockFir = mockDashboardData.firs.find((f) => f.id === id);
    if (!mockFir) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updated = {
      ...mockFir,
      ...parsed.data,
      updated_at: new Date().toISOString(),
      // keep resolved relations
      police_stations: mockFir.police_stations,
      crime_types: mockFir.crime_types,
      officers: mockFir.officers,
    };
    // Store the updated version in runtimeFirs so GET picks it up
    runtimeFirs.unshift(updated);
    // Remove the original mock entry from future results by filtering it out via the runtime store shadowing
    return NextResponse.json({ fir: updated });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

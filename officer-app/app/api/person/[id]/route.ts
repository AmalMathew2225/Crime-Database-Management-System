import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getAuthenticatedOfficer } from "@/lib/session";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const officer = await getAuthenticatedOfficer(request);
    if (!officer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { data: personData, error } = await createServiceClient()
      .from("persons")
      .select("*, person_involvements(*, firs(id, fir_number, status, date_filed, location, description, police_stations(name), crime_types(name, ipc_section)))")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    if (!personData) {
      return NextResponse.json({ error: "Person not found" }, { status: 404 });
    }

    return NextResponse.json({
      person: {
        ...personData,
        involvements: (personData.person_involvements || []).map((inv: any) => ({
          ...inv,
          fir: inv.firs,
        })),
      },
    });
  } catch (err) {
    console.error("Error fetching person:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

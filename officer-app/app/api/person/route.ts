import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getAuthenticatedOfficer } from "@/lib/session";

export async function GET(request: Request) {
  try {
    const officer = await getAuthenticatedOfficer(request);
    if (!officer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(request.url);
    const query = (url.searchParams.get("query") || "").trim().toLowerCase();

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("persons")
      .select("*, person_involvements(*, firs(id, fir_number, status, date_filed))")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const persons = (data || []).filter((person: any) => {
      const involvements = person.person_involvements || [];
      const isCriminal = involvements.some((inv: any) =>
        ["Accused", "Suspect"].includes(inv.involvement_type)
      );
      if (!query) return isCriminal;
      return (
        person.name?.toLowerCase().includes(query) ||
        person.phone?.toLowerCase().includes(query) ||
        person.id?.toLowerCase().includes(query)
      );
    }).map((person: any) => ({
      ...person,
      involvements: (person.person_involvements || []).map((inv: any) => ({
        ...inv,
        fir: inv.firs,
      })),
    }));

    return NextResponse.json({ persons });
  } catch (err) {
    console.error("Error searching persons:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getAuthenticatedOfficer } from "@/lib/session";

export async function GET(request: Request) {
  const officer = await getAuthenticatedOfficer(request);
  if (!officer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await createServiceClient()
    .from("crime_types")
    .select("id, name, name_ml, ipc_section, description")
    .order("name", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Failed to load crime types" }, { status: 500 });
  }

  return NextResponse.json({ crimeTypes: data ?? [] });
}

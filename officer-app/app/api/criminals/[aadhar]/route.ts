import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ aadhar: string }> }
) {
  const { aadhar } = await params;
  try {
    const supabase = createServiceClient();
    const { data: criminal, error } = await supabase
      .from("criminals")
      .select("*")
      .eq("aadhar_number", aadhar)
      .single();
    if (error || !criminal) throw error || new Error("Not found");

    const { data: links } = await supabase
      .from("criminal_fir_links")
      .select(`*, fir:firs(*, crime_types(*), police_stations(*), officers(*))`)
      .eq("criminal_aadhar", aadhar);

    return NextResponse.json({ criminal, links: links || [] });
  } catch {
    return NextResponse.json({ error: "Criminal not found" }, { status: 404 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ aadhar: string }> }
) {
  const { aadhar } = await params;
  const body = await request.json();
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("criminals")
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq("aadhar_number", aadhar)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ criminal: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

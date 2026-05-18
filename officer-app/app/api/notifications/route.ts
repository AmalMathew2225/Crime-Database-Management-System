import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { z } from "zod";
import { getAuthenticatedOfficer } from "@/lib/session";

export async function GET(request: Request) {
  try {
    const officer = await getAuthenticatedOfficer(request);
    if (!officer) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("officer_id", officer.id)
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ notifications: data });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const officer = await getAuthenticatedOfficer(request);
    if (!officer) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const body = await request.json();
    const schema = z.object({ id: z.string(), is_read: z.boolean() });
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

    const { data, error } = await createServiceClient()
      .from("notifications")
      .update({ is_read: parsed.data.is_read })
      .eq("id", parsed.data.id)
      .eq("officer_id", officer.id)
      .select()
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ notification: data });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

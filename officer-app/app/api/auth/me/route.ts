import { NextResponse } from "next/server";
import { parse } from "cookie";
import { verifyToken } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = parse(cookieHeader || "");
    const token = cookies.token;
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const payload = verifyToken(token as string);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const supabase = await createClient();
    const { data: officer, error } = await supabase
      .from("officers")
      .select("id, name, rank, badge_number, station_id, uid, role")
      .eq("id", payload.id)
      .single();

    if (error || !officer) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ officer });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

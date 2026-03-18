import { NextResponse } from "next/server";
import { parse } from "cookie";
import { verifyToken } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = parse(cookieHeader || "");
    const token = cookies.token;
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const payload = verifyToken(token as string);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("officer_id", payload.id)
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ notifications: data });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = parse(cookieHeader || "");
    const token = cookies.token;
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    const payload = verifyToken(token as string);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const body = await request.json();
    const schema = z.object({ id: z.string(), is_read: z.boolean() });
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

    const { data, error } = await (await createClient())
      .from("notifications")
      .update({ is_read: parsed.data.is_read })
      .eq("id", parsed.data.id)
      .eq("officer_id", payload.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ notification: data ? data[0] : null });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

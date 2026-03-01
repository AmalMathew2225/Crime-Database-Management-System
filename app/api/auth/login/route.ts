import { NextResponse } from "next/server";
import { parse } from "cookie";
import { serialize } from "cookie";
import { createClient } from "@/lib/supabase/server";
import { verifyPassword, signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { uid, password } = body;

    if (!uid || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: officer, error } = await supabase
      .from("officers")
      .select("id, name, rank, badge_number, station_id, uid, role, password_hash")
      .eq("uid", uid)
      .single();

    if (error || !officer) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const ok = await verifyPassword(password, officer.password_hash || "");
    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken({ id: officer.id, name: officer.name, station_id: officer.station_id, role: officer.role });

    const cookie = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json(
      { ok: true, officer: { id: officer.id, name: officer.name, station_id: officer.station_id, role: officer.role } },
      { status: 200, headers: { "Set-Cookie": cookie } }
    );
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

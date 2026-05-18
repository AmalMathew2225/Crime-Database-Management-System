import { NextResponse } from "next/server";
import { serialize } from "cookie";
import { createServiceClient } from "@/lib/supabase/server";
import { verifyPassword, signToken } from "@/lib/auth";
import { AUTH_COOKIE_NAME, getClientIp } from "@/lib/session";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 5;

function normalizeIdentifier(value: string) {
  return value.trim().toUpperCase();
}

async function isLockedOut(supabase: ReturnType<typeof createServiceClient>, identifier: string, ip: string) {
  const since = new Date(Date.now() - LOCKOUT_MINUTES * 60 * 1000).toISOString();
  const { count, error } = await supabase
    .from("login_attempts")
    .select("id", { count: "exact", head: true })
    .eq("success", false)
    .gte("created_at", since)
    .or(`identifier.eq.${identifier},ip_address.eq.${ip}`);

  if (error) {
    console.warn("[auth] Failed to check login attempts:", error.message);
    return false;
  }
  return (count ?? 0) >= MAX_FAILED_ATTEMPTS;
}

async function recordAttempt(
  supabase: ReturnType<typeof createServiceClient>,
  identifier: string,
  ip: string,
  success: boolean,
) {
  await supabase.from("login_attempts").insert({ identifier, ip_address: ip, success });
  if (success) {
    await supabase
      .from("login_attempts")
      .delete()
      .eq("identifier", identifier)
      .eq("success", false);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const identifier = normalizeIdentifier(String(body.uid || body.badge || ""));
    const password = String(body.password || "");

    if (!identifier || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const ip = getClientIp(request);

    if (await isLockedOut(supabase, identifier, ip)) {
      return NextResponse.json(
        { error: "Too many failed attempts. Try again in 5 minutes." },
        { status: 429 },
      );
    }

    const { data: officer, error } = await supabase
      .from("officers")
      .select("id, name, rank, badge_number, station_id, uid, role, password_hash, is_active")
      .or(`uid.ilike.${identifier},badge_number.ilike.${identifier}`)
      .maybeSingle();

    if (error || !officer || !officer.is_active) {
      await recordAttempt(supabase, identifier, ip, false);
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const ok = await verifyPassword(password, officer.password_hash || "");
    if (!ok) {
      await recordAttempt(supabase, identifier, ip, false);
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    await recordAttempt(supabase, identifier, ip, true);

    const token = signToken({
      id: officer.id,
      uid: officer.uid,
      badge_number: officer.badge_number,
      name: officer.name,
      station_id: officer.station_id,
      role: officer.role,
    });

    const cookie = serialize(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json(
      {
        ok: true,
        officer: {
          id: officer.id,
          name: officer.name,
          badge_number: officer.badge_number,
          station_id: officer.station_id,
          role: officer.role,
        },
      },
      { status: 200, headers: { "Set-Cookie": cookie } }
    );
  } catch (err) {
    console.error("[POST /api/auth/login]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

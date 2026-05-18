import { NextResponse } from "next/server";
import { parse } from "cookie";
import { verifyToken } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";

const OFFICER_SELECT =
  "id, name, rank, badge_number, station_id, uid, role";

async function findOfficerByBadge(badge: string) {
  const supabase = createServiceClient();
  const normalized = badge.trim().toUpperCase();

  const { data, error } = await supabase
    .from("officers")
    .select(OFFICER_SELECT)
    .ilike("badge_number", normalized)
    .maybeSingle();

  if (error) throw error;
  if (data) return data;

  // Allow login without hyphen when DB stores KP-2341
  const compact = normalized.replace(/-/g, "");
  if (compact !== normalized) {
    const { data: rows } = await supabase.from("officers").select(OFFICER_SELECT);
    return (
      rows?.find(
        (o) => (o.badge_number ?? "").replace(/-/g, "").toUpperCase() === compact,
      ) ?? null
    );
  }
  return null;
}

export async function GET(request: Request) {
  try {
    const badgeHeader = request.headers.get("x-officer-badge")?.trim();
    if (badgeHeader) {
      const officer = await findOfficerByBadge(badgeHeader);
      if (!officer) {
        return NextResponse.json({ error: "Badge not recognised" }, { status: 401 });
      }
      return NextResponse.json({ officer });
    }

    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = parse(cookieHeader || "");
    const token = cookies.token;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const payload = verifyToken(token as string);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const supabase = createServiceClient();
    const { data: officer, error } = await supabase
      .from("officers")
      .select(OFFICER_SELECT)
      .eq("id", payload.id)
      .single();

    if (error || !officer) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ officer });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

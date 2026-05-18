import { parse } from "cookie";
import { verifyToken } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";

export const AUTH_COOKIE_NAME = "token";

export type AuthenticatedOfficer = {
  id: string;
  name: string;
  rank: string;
  badge_number: string;
  uid: string;
  role: string;
  station_id: string | null;
};

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

export function getTokenFromRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = parse(cookieHeader);
  return cookies[AUTH_COOKIE_NAME] || "";
}

export async function getAuthenticatedOfficer(request: Request): Promise<AuthenticatedOfficer | null> {
  const token = getTokenFromRequest(request);
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload?.id) return null;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("officers")
    .select("id, name, rank, badge_number, uid, role, station_id, is_active")
    .eq("id", payload.id)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    name: data.name,
    rank: data.rank,
    badge_number: data.badge_number,
    uid: data.uid,
    role: data.role,
    station_id: data.station_id,
  };
}

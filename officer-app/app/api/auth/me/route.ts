import { NextResponse } from "next/server";
import { getAuthenticatedOfficer } from "@/lib/session";

export async function GET(request: Request) {
  try {
    const officer = await getAuthenticatedOfficer(request);
    if (!officer) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    return NextResponse.json({ officer });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

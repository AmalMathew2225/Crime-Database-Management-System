import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getPersonWithCases } from "@/lib/mock-data";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const personData = getPersonWithCases(id);

    if (!personData) {
      return NextResponse.json({ error: "Person not found" }, { status: 404 });
    }

    return NextResponse.json({ person: personData });
  } catch (err) {
    console.error("Error fetching person:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

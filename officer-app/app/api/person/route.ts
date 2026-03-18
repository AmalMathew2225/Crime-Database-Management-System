import { NextResponse } from "next/server";
import { searchPersons } from "@/lib/mock-data";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("query");

    if (!query || query.trim() === "") {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    const results = searchPersons(query.trim());

    return NextResponse.json({ persons: results });
  } catch (err) {
    console.error("Error searching persons:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { runtimeNotes } from "@/lib/fir-store";
import { mockDashboardData } from "@/lib/mock-data";

function getOfficerFromBadge(badge: string) {
  const officer = mockDashboardData.officers.find(
    (o) => o.badge_number.replace("-", "").toUpperCase() === badge.replace("-", "").toUpperCase()
  ) ?? mockDashboardData.officers[0];
  return officer;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const notes = runtimeNotes[id] ?? [];
    return NextResponse.json({ notes });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

const noteSchema = z.object({ note: z.string().min(1) });

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const badge = request.headers.get("x-officer-badge") || "";
    const officer = getOfficerFromBadge(badge);
    const body = await request.json();
    const parsed = noteSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });

    const note = {
      id: `note-${Date.now()}`,
      fir_id: id,
      officer_id: officer.id,
      note: parsed.data.note,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      officers: officer,
    };

    if (!runtimeNotes[id]) runtimeNotes[id] = [];
    runtimeNotes[id].push(note);
    return NextResponse.json({ note }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const editSchema = z.object({ id: z.string(), note: z.string().min(1) });
    const parsed = editSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

    const notes = runtimeNotes[id] ?? [];
    const idx = notes.findIndex((n) => n.id === parsed.data.id);
    if (idx === -1) return NextResponse.json({ error: "Note not found" }, { status: 404 });
    notes[idx] = { ...notes[idx], note: parsed.data.note, updated_at: new Date().toISOString() };
    return NextResponse.json({ note: notes[idx] });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const noteId = body.id;
    if (!noteId) return NextResponse.json({ error: "Missing note id" }, { status: 400 });

    if (runtimeNotes[id]) {
      runtimeNotes[id] = runtimeNotes[id].filter((n) => n.id !== noteId);
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

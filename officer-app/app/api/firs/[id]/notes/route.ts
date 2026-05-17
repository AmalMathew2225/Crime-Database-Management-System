import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { verifyToken } from "@/lib/auth";

// ── GET /api/firs/[id]/notes ───────────────────────────────────────────────────
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("case_notes")
      .select("*, officers(id, name, rank, badge_number)")
      .eq("fir_id", id)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return NextResponse.json({ notes: data ?? [] });
  } catch (err) {
    console.error("[GET notes]", err);
    return NextResponse.json({ notes: [] });
  }
}

const noteSchema = z.object({ note: z.string().min(1) });

// ── POST /api/firs/[id]/notes ─────────────────────────────────────────────────
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Resolve officer from JWT cookie
  const token = request.cookies.get("auth_token")?.value ?? "";
  const payload = token ? verifyToken(token) : null;
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = noteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  try {
    const supabase = createServiceClient();

    // Look up the officer row to get their UUID
    const { data: officer } = await supabase
      .from("officers")
      .select("id, name, rank, badge_number")
      .eq("uid", payload.uid)
      .single();

    const { data, error } = await supabase
      .from("case_notes")
      .insert({
        fir_id:     id,
        officer_id: officer?.id ?? null,
        note:       parsed.data.note,
      })
      .select("*, officers(id, name, rank, badge_number)")
      .single();

    if (error) throw error;
    return NextResponse.json({ note: data }, { status: 201 });
  } catch (err) {
    console.error("[POST notes]", err);
    return NextResponse.json({ error: "Failed to save note" }, { status: 500 });
  }
}

const editSchema = z.object({ id: z.string(), note: z.string().min(1) });

// ── PATCH /api/firs/[id]/notes ────────────────────────────────────────────────
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const parsed = editSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("case_notes")
      .update({ note: parsed.data.note, updated_at: new Date().toISOString() })
      .eq("id", parsed.data.id)
      .eq("fir_id", id)
      .select("*, officers(id, name, rank, badge_number)")
      .single();

    if (error) throw error;
    return NextResponse.json({ note: data });
  } catch (err) {
    console.error("[PATCH notes]", err);
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
  }
}

// ── DELETE /api/firs/[id]/notes ───────────────────────────────────────────────
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const noteId = body.id;
  if (!noteId) {
    return NextResponse.json({ error: "Missing note id" }, { status: 400 });
  }

  try {
    const supabase = createServiceClient();
    const { error } = await supabase
      .from("case_notes")
      .delete()
      .eq("id", noteId)
      .eq("fir_id", id);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE notes]", err);
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }
}

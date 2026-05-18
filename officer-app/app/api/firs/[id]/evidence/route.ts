import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { getAuthenticatedOfficer } from "@/lib/session";

// ── GET /api/firs/[id]/evidence ───────────────────────────────────────────────
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const officer = await getAuthenticatedOfficer(request);
  if (!officer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("evidence")
      .select("*, officers(id, name, rank, badge_number)")
      .eq("fir_id", id)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return NextResponse.json({
      evidence: (data ?? []).map((item: any) => ({
        ...item,
        filename: item.filename || "evidence-file",
        dataUrl: item.url,
        mimeType: item.mime_type,
      })),
    });
  } catch (err) {
    console.error("[GET evidence]", err);
    return NextResponse.json({ evidence: [] });
  }
}

const evidenceSchema = z.object({
  filename:    z.string().min(1),
  type:        z.string().min(1),       // image | video | document | etc.
  description: z.string().nullable().optional(),
  url:         z.string().optional(),   // Supabase Storage public URL (preferred)
  dataUrl:     z.string().optional(),   // base64 fallback (stored as text)
  mimeType:    z.string().optional(),
});

// ── POST /api/firs/[id]/evidence ──────────────────────────────────────────────
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const officer = await getAuthenticatedOfficer(request);
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = evidenceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  try {
    const supabase = createServiceClient();

    // Use Storage URL if provided, otherwise fall back to dataUrl
    const url = parsed.data.url || parsed.data.dataUrl || "";

    const { data, error } = await supabase
      .from("evidence")
      .insert({
        fir_id:      id,
        officer_id:  officer.id,
        filename:    parsed.data.filename,
        url,
        type:        parsed.data.type,
        mime_type:   parsed.data.mimeType ?? null,
        description: parsed.data.description ?? null,
      })
      .select("*, officers(id, name, rank, badge_number)")
      .single();

    if (error) throw error;

    // Return in the shape the dashboard expects
    return NextResponse.json({
      evidence: {
        ...data,
        filename: parsed.data.filename,
        dataUrl:  url,
        mimeType: parsed.data.mimeType ?? "application/octet-stream",
      },
    }, { status: 201 });
  } catch (err) {
    console.error("[POST evidence]", err);
    return NextResponse.json({ error: "Failed to save evidence" }, { status: 500 });
  }
}

// ── DELETE /api/firs/[id]/evidence ────────────────────────────────────────────
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const officer = await getAuthenticatedOfficer(request);
  if (!officer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const evidenceId = body.id;
  if (!evidenceId) {
    return NextResponse.json({ error: "Missing evidence id" }, { status: 400 });
  }

  try {
    const supabase = createServiceClient();
    const { error } = await supabase
      .from("evidence")
      .delete()
      .eq("id", evidenceId)
      .eq("fir_id", id);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE evidence]", err);
    return NextResponse.json({ error: "Failed to delete evidence" }, { status: 500 });
  }
}

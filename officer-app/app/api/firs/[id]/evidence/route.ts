import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { runtimeEvidence } from "@/lib/fir-store";
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
    const evidence = runtimeEvidence[id] ?? [];
    return NextResponse.json({ evidence });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

const evidenceSchema = z.object({
  filename: z.string().min(1),
  type: z.string().min(1),
  description: z.string().nullable().optional(),
  dataUrl: z.string().min(1),
  mimeType: z.string().optional(),
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const badge = request.headers.get("x-officer-badge") || "";
    const officer = getOfficerFromBadge(badge);
    const body = await request.json();
    const parsed = evidenceSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });

    const evidenceItem = {
      id: `ev-${Date.now()}`,
      fir_id: id,
      officer_id: officer.id,
      filename: parsed.data.filename,
      type: parsed.data.type,
      description: parsed.data.description ?? null,
      dataUrl: parsed.data.dataUrl,
      mimeType: parsed.data.mimeType ?? "application/octet-stream",
      created_at: new Date().toISOString(),
      officers: officer,
    };

    if (!runtimeEvidence[id]) runtimeEvidence[id] = [];
    runtimeEvidence[id].push(evidenceItem);
    return NextResponse.json({ evidence: evidenceItem }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const evidenceId = body.id;
    if (!evidenceId) return NextResponse.json({ error: "Missing evidence id" }, { status: 400 });

    if (runtimeEvidence[id]) {
      runtimeEvidence[id] = runtimeEvidence[id].filter((e) => e.id !== evidenceId);
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

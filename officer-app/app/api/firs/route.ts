import { NextResponse } from "next/server";
import { z } from "zod";
import { mockDashboardData } from "@/lib/mock-data";
import { runtimeFirs } from "@/lib/fir-store";

function sanitizeString(v: any) {
  if (v === null || v === undefined) return null;
  return String(v).trim();
}

function toNullableNumber(v: any) {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function generateFirNumber() {
  const d = new Date();
  const date = d.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `FIR-${date}-${rand}`;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    // Merge mock data + runtime (newly registered) FIRs, newest first
    let firs: any[] = [...runtimeFirs, ...mockDashboardData.firs];

    // apply filters
    const id = url.searchParams.get("id");
    const crime_type = url.searchParams.get("crime_type");
    const status = url.searchParams.get("status");
    const location = url.searchParams.get("location");
    const date_from = url.searchParams.get("date_from");
    const date_to = url.searchParams.get("date_to");

    if (id) firs = firs.filter((f) => f.id === id);
    if (crime_type) firs = firs.filter((f) => f.crime_type_id === crime_type);
    if (status) firs = firs.filter((f) => f.status === status);
    if (location) firs = firs.filter((f) => f.location?.toLowerCase().includes(location.toLowerCase()));
    if (date_from) firs = firs.filter((f) => f.date_filed >= date_from);
    if (date_to) firs = firs.filter((f) => f.date_filed <= date_to);

    return NextResponse.json({ firs });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Auth: read the officer badge from the request header (set by the FIR form)
    const badgeHeader = request.headers.get("x-officer-badge") || "";

    // Look up officer from mock data by badge number (case-insensitive)
    const officer = mockDashboardData.officers.find(
      (o) => o.badge_number.replace("-", "").toUpperCase() === badgeHeader.replace("-", "").toUpperCase()
    ) ?? mockDashboardData.officers[0]; // fallback to first officer

    const station_id = officer.station_id;
    const officer_id = officer.id;

    const body = await request.json();

    const FirPayloadSchema = z.object({
      complainant_name: z.preprocess((v) => sanitizeString(v), z.string().min(1)),
      guardian_name: z.preprocess((v) => sanitizeString(v), z.string().nullable().optional()),
      gender: z.preprocess((v) => sanitizeString(v), z.enum(["Male", "Female", "Other"]).optional()),
      age: z.preprocess((v) => toNullableNumber(v), z.number().int().nonnegative().nullable().optional()),
      dob: z.preprocess((v) => sanitizeString(v), z.string().nullable().optional()),
      address: z.preprocess((v) => sanitizeString(v), z.string().nullable().optional()),
      phone: z.preprocess((v) => sanitizeString(v), z.string().nullable().optional()),
      date_of_occurrence: z.preprocess((v) => sanitizeString(v), z.string().nullable().optional()),
      time_of_occurrence: z.preprocess((v) => sanitizeString(v), z.string().nullable().optional()),
      location: z.preprocess((v) => sanitizeString(v), z.string().min(1)),
      crime_type_id: z.preprocess((v) => sanitizeString(v), z.string().min(1)),
      ipc_sections: z.preprocess((v) => sanitizeString(v), z.string().nullable().optional()),
      description: z.preprocess((v) => sanitizeString(v), z.string().min(1)),
      accused: z
        .preprocess((v) => (Array.isArray(v) ? v : []), z.array(z.object({ name: z.preprocess(sanitizeString, z.string().nullable().optional()), address: z.preprocess(sanitizeString, z.string().nullable().optional()), description: z.preprocess(sanitizeString, z.string().nullable().optional()) })))
        .optional(),
      property_items: z
        .preprocess((v) => (Array.isArray(v) ? v : []), z.array(z.object({ item_name: z.preprocess(sanitizeString, z.string().min(1)), quantity: z.preprocess((q) => toNullableNumber(q) ?? 1, z.number().int().min(1).optional()), estimated_value: z.preprocess((n) => toNullableNumber(n), z.number().optional()) })))
        .optional(),
    });

    const parsed = FirPayloadSchema.safeParse(body);
    if (!parsed.success) {
      // Flatten field errors for client-friendly format
      const flattened = parsed.error.flatten();
      const fieldErrors = flattened.fieldErrors || {};
      return NextResponse.json({ error: "Validation failed", fieldErrors }, { status: 400 });
    }

    const {
      complainant_name,
      location,
      crime_type_id,
      description,
    } = parsed.data;

    const fir_number = generateFirNumber();
    const date_filed = new Date().toISOString().slice(0, 10);
    const time_filed = new Date().toTimeString().split(" ")[0];

    // Use mock data to resolve relations (avoids Supabase foreign key issues with mock IDs like "ct-1")
    const crimeType = mockDashboardData.crimeTypes.find((c) => c.id === crime_type_id) ?? null;
    const station = mockDashboardData.stations.find((s) => s.id === station_id) ?? null;

    const newFir = {
      id: `fir-new-${Date.now()}`,
      fir_number,
      date_filed,
      time_filed,
      station_id,
      crime_type_id,
      investigating_officer_id: officer_id,
      location,
      description,
      complainant_name,
      status: "Registered",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      police_stations: station,
      crime_types: crimeType,
      officers: officer,
    };

    // Persist in memory so GET /api/firs returns it for both portals
    runtimeFirs.unshift(newFir);

    return NextResponse.json({ ok: true, fir: newFir }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

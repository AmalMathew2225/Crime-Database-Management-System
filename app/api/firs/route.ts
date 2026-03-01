import { NextResponse } from "next/server";
import { parse } from "cookie";
import { verifyToken } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

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

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("firs")
      .select("*, police_stations(*), crime_types(*)")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ firs: data });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = parse(cookieHeader || "");
    const token = cookies.token;
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const payload = verifyToken(token as string);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

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
      guardian_name,
      gender,
      age,
      dob,
      address,
      phone,
      date_of_occurrence,
      time_of_occurrence,
      location,
      crime_type_id,
      ipc_sections,
      description,
      accused,
      property_items,
    } = parsed.data;

    const fir_number = generateFirNumber();
    const date_filed = new Date().toISOString().slice(0, 10);
    const time_filed = new Date().toTimeString().split(" ")[0];

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("firs")
      .insert([
        {
          fir_number,
          date_filed,
          time_filed,
          station_id: payload.station_id,
          crime_type_id,
          investigating_officer_id: payload.id,
          location,
          description,
          complainant_name,
          status: "Registered",
        },
      ])
      .select("*, police_stations(*), crime_types(*)")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Insert accused entries if provided
    if (Array.isArray(accused) && accused.length > 0) {
      const accusedPayload = accused
        .filter((a: any) => a.name || a.address || a.description)
        .map((a: any) => ({
          fir_id: data.id,
          name: a.name || null,
          address: a.address || null,
          description: a.description || null,
        }));
      if (accusedPayload.length > 0) await supabase.from('accused').insert(accusedPayload);
    }

    // Insert property items if provided
    if (Array.isArray(property_items) && property_items.length > 0) {
      const propPayload = property_items
        .filter((p: any) => p.item_name)
        .map((p: any) => ({
          fir_id: data.id,
          item_name: p.item_name,
          quantity: p.quantity || 1,
          estimated_value: p.estimated_value ?? null,
        }));
      if (propPayload.length > 0) await supabase.from('property_items').insert(propPayload);
    }

    return NextResponse.json({ ok: true, fir: data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

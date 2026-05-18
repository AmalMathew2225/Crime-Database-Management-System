import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import type { Criminal } from "@/lib/types";

// Mock fallback criminals
const MOCK_CRIMINALS: Criminal[] = [
  { id:"c-1", aadhar_number:"1234-5678-9001", name:"Ravi Kumar", alias:"Chain Ravi", age:34, gender:"Male", address:"23/B MG Road, Thampanoor", phone:"9876543210", threat_level:"High", is_absconding:false, is_convicted:true, notes:"Convicted for chain snatching 2023.", created_at:new Date().toISOString(), updated_at:new Date().toISOString() },
  { id:"c-2", aadhar_number:"1234-5678-9002", name:"Suresh Babu", alias:"Online Suresh", age:45, gender:"Male", address:"12 Park Avenue, Peroorkada", phone:"9876543211", threat_level:"High", is_absconding:false, is_convicted:false, notes:"Multiple cyber fraud cases.", created_at:new Date().toISOString(), updated_at:new Date().toISOString() },
  { id:"c-3", aadhar_number:"1234-5678-9003", name:"Jibin Joseph", alias:"Jibu", age:22, gender:"Male", address:"5A Vanchiyoor Colony", phone:"9876543213", threat_level:"Medium", is_absconding:true, is_convicted:false, notes:"Absconding since robbery attempt.", created_at:new Date().toISOString(), updated_at:new Date().toISOString() },
  { id:"c-4", aadhar_number:"1234-5678-9004", name:"Pradeep Nambiar", alias:"Tech Pradeep", age:38, gender:"Male", address:"Flat 4C Technopark Road", phone:"9876543214", threat_level:"High", is_absconding:false, is_convicted:false, notes:"Phishing and SIM swap fraudster.", created_at:new Date().toISOString(), updated_at:new Date().toISOString() },
  { id:"c-5", aadhar_number:"1234-5678-9005", name:"Aneesh Krishnan", alias:"Black Aneesh", age:31, gender:"Male", address:"88 Fort Lane, East Fort", phone:"9844567890", threat_level:"Extreme", is_absconding:true, is_convicted:true, notes:"Convicted for armed robbery. Escaped custody.", created_at:new Date().toISOString(), updated_at:new Date().toISOString() },
  { id:"c-6", aadhar_number:"1234-5678-9006", name:"Sajan Thomas", age:28, gender:"Male", address:"14/2 Karamana Bridge Road", phone:"9812345678", threat_level:"Medium", is_absconding:false, is_convicted:false, notes:"Criminal trespass pattern.", created_at:new Date().toISOString(), updated_at:new Date().toISOString() },
  { id:"c-7", aadhar_number:"1234-5678-9007", name:"Muhammed Ashraf", alias:"Ashu", age:41, gender:"Male", address:"67 Chalai Market Road", phone:"9899887766", threat_level:"High", is_absconding:false, is_convicted:true, notes:"Cheque bounce and financial fraud.", created_at:new Date().toISOString(), updated_at:new Date().toISOString() },
  { id:"c-8", aadhar_number:"1234-5678-9008", name:"Vinod Pillai", alias:"Vinod Chor", age:35, gender:"Male", address:"201 Kowdiar Junction", phone:"9765432109", threat_level:"Medium", is_absconding:false, is_convicted:false, notes:"Mobile theft near ATMs.", created_at:new Date().toISOString(), updated_at:new Date().toISOString() },
  { id:"c-9", aadhar_number:"1234-5678-9009", name:"Biju Varghese", alias:"Bar Biju", age:27, gender:"Male", address:"9 Vanchiyoor Main Road", phone:"9654321098", threat_level:"Medium", is_absconding:false, is_convicted:false, notes:"Assault and bar fight incidents.", created_at:new Date().toISOString(), updated_at:new Date().toISOString() },
  { id:"c-10", aadhar_number:"1234-5678-9010", name:"Rajmohan S", alias:"Raja", age:52, gender:"Male", address:"33 Statue Junction", phone:"9543210987", threat_level:"Low", is_absconding:false, is_convicted:true, notes:"Domestic violence. On bail.", created_at:new Date().toISOString(), updated_at:new Date().toISOString() },
  { id:"c-11", aadhar_number:"1234-5678-9011", name:"Sreejith Menon", alias:"Sreji", age:29, gender:"Male", address:"Plot 15 Pattom Junction", phone:"9432109876", threat_level:"High", is_absconding:false, is_convicted:false, notes:"SIM swap and identity theft.", created_at:new Date().toISOString(), updated_at:new Date().toISOString() },
  { id:"c-12", aadhar_number:"1234-5678-9012", name:"Arun Dev", alias:"Dev", age:24, gender:"Male", address:"42 East Fort Bus Stand Area", phone:"9321098765", threat_level:"Medium", is_absconding:false, is_convicted:false, notes:"Investment scam targeting seniors.", created_at:new Date().toISOString(), updated_at:new Date().toISOString() },
  { id:"c-13", aadhar_number:"1234-5678-9013", name:"Krishnadas P", alias:"KD", age:46, gender:"Male", address:"Fort Lane Back Street", phone:"9210987654", threat_level:"Low", is_absconding:false, is_convicted:false, notes:"Trespassing dispute.", created_at:new Date().toISOString(), updated_at:new Date().toISOString() },
  { id:"c-14", aadhar_number:"1234-5678-9014", name:"Shyam Lal", age:39, gender:"Male", address:"78 Museum Road", phone:"9109876543", threat_level:"High", is_absconding:true, is_convicted:false, notes:"Cyber crime - unauthorized server access. Absconding.", created_at:new Date().toISOString(), updated_at:new Date().toISOString() },
  { id:"c-15", aadhar_number:"1234-5678-9015", name:"Rameshan K", alias:"Ram", age:33, gender:"Male", address:"Karamana River Bank Area", phone:"9098765432", threat_level:"Medium", is_absconding:false, is_convicted:false, notes:"Construction equipment theft.", created_at:new Date().toISOString(), updated_at:new Date().toISOString() },
];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";
  const threat = url.searchParams.get("threat_level") || "";

  try {
    const supabase = createServiceClient();
    let query = supabase.from("criminals").select("*").order("name");
    if (search)  query = query.ilike("name", `%${search}%`);
    if (threat)  query = query.eq("threat_level", threat);
    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return NextResponse.json({ criminals: data, _source: "supabase" });
    }
  } catch (err) {
    console.warn("[GET /api/criminals] Supabase error, using mock:", err);
  }

  // Mock fallback
  let criminals = [...MOCK_CRIMINALS];
  if (search) criminals = criminals.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || (c.alias || "").toLowerCase().includes(search.toLowerCase()));
  if (threat)  criminals = criminals.filter(c => c.threat_level === threat);
  return NextResponse.json({ criminals, _source: "mock" });
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.aadhar_number || !body.name) {
    return NextResponse.json({ error: "aadhar_number and name are required" }, { status: 400 });
  }
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase.from("criminals").insert(body).select().single();
    if (error) throw error;
    return NextResponse.json({ criminal: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to add criminal" }, { status: 500 });
  }
}

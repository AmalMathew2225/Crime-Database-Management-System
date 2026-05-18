import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    ArrowLeft,
    FileText,
    MapPin,
    Clock,
    Shield,
    User,
    AlertCircle,
    Users,
    Box,
    Phone,
    Map
} from "lucide-react";
import { CaseNotes } from "@/components/case-notes";
import { EvidenceList } from "@/components/evidence-list";
import { EvidenceUploader } from "@/components/evidence-uploader";
import { StatusUpdater } from "@/components/status-updater";

// fetch real FIR from API
async function getFIR(id: string) {
    const base = process.env.OFFICER_INTERNAL_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/firs/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json.fir;
}

export default async function CasePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const fir = await getFIR(id);

    if (!fir) {
        notFound();
    }

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
            <Navbar />
            <main className="flex-1 py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                    <div className="mb-6">
                        <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-blue-700" asChild>
                            <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground font-medium">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Dashboard
                            </Link>
                        </Button>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {/* Main Content Column */}
                        <div className="md:col-span-2 space-y-6">
                            
                            {/* Header & Main Info Card */}
                            <Card className="border-t-4 border-t-blue-900 shadow-sm overflow-hidden">
                                <div className="bg-white px-6 py-5 border-b flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">Official Record</Badge>
                                            <span className="text-sm text-gray-500 font-medium">Filed {new Date(fir.date_filed).toLocaleDateString()}</span>
                                        </div>
                                        <h1 className="text-3xl font-extrabold text-blue-950 flex items-center gap-2">
                                            <FileText className="h-7 w-7 text-yellow-500" />
                                            {fir.fir_number}
                                        </h1>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <StatusUpdater firId={fir.id} initialStatus={fir.status} />
                                    </div>
                                </div>
                                <CardContent className="p-0">
                                    <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x border-b">
                                        <div className="p-6">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Complainant / Reporter</p>
                                            <p className="text-lg font-bold text-gray-900">{fir.complainant_name}</p>
                                            {fir.phone && <p className="text-sm text-gray-600 mt-1 flex items-center gap-1.5"><Phone className="h-3 w-3"/> {fir.phone}</p>}
                                            {fir.address && <p className="text-sm text-gray-600 mt-1 flex items-center gap-1.5"><Map className="h-3 w-3"/> {fir.address}</p>}
                                        </div>
                                        <div className="p-6">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Incident Location</p>
                                            <div className="flex items-start gap-2">
                                                <MapPin className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{fir.location}</p>
                                                    {fir.location_ml && <p className="text-xs text-gray-500 font-malayalam mt-0.5">{fir.location_ml}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 bg-gray-50/50">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Narrative Description</p>
                                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{fir.description}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Crime & Legal Details */}
                            <Card className="shadow-sm">
                                <CardHeader className="bg-gray-50/50 border-b pb-4">
                                    <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
                                        <AlertCircle className="h-5 w-5 text-red-600" />
                                        Legal Classifications
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div>
                                            <span className="text-xs font-semibold text-gray-500 uppercase">Primary Offence</span>
                                            <p className="font-bold text-gray-900 mt-1">{fir.crime_types?.name}</p>
                                            {fir.crime_types?.name_ml && <p className="text-xs text-gray-500 font-malayalam">{fir.crime_types?.name_ml}</p>}
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold text-gray-500 uppercase">Applicable Sections</span>
                                            <div className="mt-1 flex flex-wrap gap-2">
                                                {fir.sections ? (
                                                    <Badge variant="outline" className="font-mono bg-blue-50 text-blue-900 border-blue-200">{fir.sections}</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="font-mono bg-blue-50 text-blue-900 border-blue-200">{fir.crime_types?.ipc_section}</Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Accused Persons */}
                            <Card className="shadow-sm">
                                <CardHeader className="bg-gray-50/50 border-b pb-4">
                                    <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
                                        <Users className="h-5 w-5 text-blue-700" />
                                        Accused Persons
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {fir.accused && fir.accused.length > 0 ? (
                                        <div className="divide-y">
                                            {fir.accused.map((a: any, i: number) => (
                                                <div key={i} className="p-6 grid sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <span className="text-xs font-semibold text-gray-500 uppercase">Name / Alias</span>
                                                        <p className="font-medium text-gray-900">{a.name || "Unknown"}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-semibold text-gray-500 uppercase">Address</span>
                                                        <p className="text-sm text-gray-600">{a.address || "Not specified"}</p>
                                                    </div>
                                                    <div className="sm:col-span-2">
                                                        <span className="text-xs font-semibold text-gray-500 uppercase">Physical Description</span>
                                                        <p className="text-sm text-gray-600">{a.description || "None"}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center text-gray-500 text-sm">
                                            No accused persons have been logged for this FIR.
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Property Involved */}
                            <Card className="shadow-sm">
                                <CardHeader className="bg-gray-50/50 border-b pb-4">
                                    <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
                                        <Box className="h-5 w-5 text-amber-600" />
                                        Property Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {fir.property_items && fir.property_items.length > 0 ? (
                                        <div className="divide-y">
                                            {fir.property_items.map((p: any, i: number) => (
                                                <div key={i} className="p-6 grid sm:grid-cols-3 gap-4">
                                                    <div className="sm:col-span-2">
                                                        <span className="text-xs font-semibold text-gray-500 uppercase">Item Description</span>
                                                        <p className="font-medium text-gray-900">{p.item_name}</p>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <span className="text-xs font-semibold text-gray-500 uppercase">Qty</span>
                                                            <p className="font-medium text-gray-900">{p.quantity}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs font-semibold text-gray-500 uppercase">Value (₹)</span>
                                                            <p className="font-medium text-gray-900">{p.estimated_value || "N/A"}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center text-gray-500 text-sm">
                                            No property items logged for this FIR.
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Investigation Notes & Evidence */}
                            <div className="space-y-6 pt-4">
                                <h2 className="text-xl font-bold text-gray-900">Investigation Workspace</h2>
                                <CaseNotes firId={fir.id} />
                                <div className="space-y-4">
                                    <EvidenceUploader firId={fir.id} />
                                    <EvidenceList firId={fir.id} />
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Column */}
                        <div className="space-y-6">
                            {/* Station Info */}
                            <Card className="shadow-sm border-t-4 border-t-gray-800">
                                <CardHeader className="pb-3 bg-gray-50/50">
                                    <CardTitle className="text-sm font-bold uppercase tracking-wide flex items-center gap-2 text-gray-600">
                                        <Shield className="h-4 w-4" />
                                        Jurisdiction
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-4">
                                    <div>
                                        <p className="font-bold text-gray-900">{fir.police_stations?.name}</p>
                                        {fir.police_stations?.name_ml && <p className="text-xs text-gray-500 font-malayalam mt-1">{fir.police_stations?.name_ml}</p>}
                                    </div>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p>{fir.police_stations?.address}</p>
                                        <p className="font-medium text-gray-800">{fir.police_stations?.district} District</p>
                                    </div>
                                    <Separator />
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Station Contact</p>
                                        <p className="text-sm font-medium text-blue-700">{fir.police_stations?.phone}</p>
                                        <p className="text-sm text-blue-600 truncate">{fir.police_stations?.email}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Investigating Officer */}
                            <Card className="shadow-sm">
                                <CardHeader className="pb-3 bg-gray-50/50">
                                    <CardTitle className="text-sm font-bold uppercase tracking-wide flex items-center gap-2 text-gray-600">
                                        <User className="h-4 w-4" />
                                        Assigned Officer
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700">
                                            <User className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{fir.officers?.name}</p>
                                            <p className="text-xs font-medium text-gray-600">{fir.officers?.rank}</p>
                                            <Badge variant="secondary" className="mt-1 h-5 bg-gray-100 text-gray-600 border-gray-200">
                                                ID: {fir.officers?.badge_number}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

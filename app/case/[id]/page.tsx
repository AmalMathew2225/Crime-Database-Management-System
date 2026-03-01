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
    Calendar,
    Shield,
    User,
    Clock,
    AlertCircle
} from "lucide-react";
import { mockDashboardData } from "@/lib/mock-data";

// Helper to simulate data fetching
async function getFIR(id: string) {
    const fir = mockDashboardData.firs.find((f) => f.id === id);
    return fir;
}

const statusColors: Record<string, string> = {
    Registered: "bg-blue-100 text-blue-800 border-blue-200",
    "Under Investigation": "bg-amber-100 text-amber-800 border-amber-200",
    "Charge Sheet Filed": "bg-green-100 text-green-800 border-green-200",
    "Court Proceedings": "bg-purple-100 text-purple-800 border-purple-200",
    Closed: "bg-gray-100 text-gray-800 border-gray-200",
};

export default async function CasePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params
    const fir = await getFIR(id);

    if (!fir) {
        notFound();
    }

    return (
        <div className="flex min-h-screen flex-col bg-background font-sans">
            <Navbar />
            <main className="flex-1 py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                    <div className="mb-6">
                        <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-blue-700" asChild>
                            <Link href="/" className="flex items-center gap-2 text-muted-foreground">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Dashboard
                            </Link>
                        </Button>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Main Content Column */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Header Card */}
                            <Card className="border-t-4 border-t-primary shadow-md">
                                <CardHeader className="pb-4">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                        <div>
                                            <h1 className="text-2xl font-bold text-[#112047] flex items-center gap-2">
                                                <FileText className="h-6 w-6" />
                                                {fir.fir_number}
                                            </h1>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Filed on {new Date(fir.date_filed).toLocaleDateString("en-IN", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })} at {fir.time_filed}
                                            </p>
                                        </div>
                                        <Badge className={`${statusColors[fir.status]} text-sm px-3 py-1 font-semibold rounded-full`}>
                                            {fir.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <Separator />
                                <CardContent className="pt-6 space-y-4">
                                    <div>
                                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                                            Complainant
                                        </h3>
                                        <p className="text-lg font-medium">{fir.complainant_name}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                            Incident Description
                                        </h3>
                                        <div className="bg-muted/30 p-4 rounded-md border text-sm leading-relaxed">
                                            {fir.description}
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4 pt-2">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                            <div>
                                                <h4 className="text-sm font-medium">Location</h4>
                                                <p className="text-sm text-muted-foreground">{fir.location}</p>
                                                {fir.location_ml && <p className="text-xs text-muted-foreground/70 font-malayalam">{fir.location_ml}</p>}
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                                            <div>
                                                <h4 className="text-sm font-medium">Last Updated</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {new Date(fir.updated_at).toLocaleDateString("en-IN")}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Crime Details Card */}
                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <AlertCircle className="h-5 w-5 text-red-600" />
                                        Crime Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div>
                                            <span className="text-xs font-semibold text-muted-foreground uppercase">Type</span>
                                            <p className="font-medium mt-1">{fir.crime_types?.name}</p>
                                            {fir.crime_types?.name_ml && <p className="text-xs text-muted-foreground font-malayalam">{fir.crime_types?.name_ml}</p>}
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold text-muted-foreground uppercase">IPC Section</span>
                                            <Badge variant="outline" className="mt-1 font-mono bg-slate-100">
                                                {fir.crime_types?.ipc_section}
                                            </Badge>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <span className="text-xs font-semibold text-muted-foreground uppercase">Legal Definition</span>
                                            <p className="text-sm text-muted-foreground mt-1">{fir.crime_types?.description}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar Column */}
                        <div className="space-y-6">
                            {/* Station Info */}
                            <Card className="shadow-sm border-l-4 border-l-blue-600">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-md flex items-center gap-2">
                                        <Shield className="h-4 w-4" />
                                        Police Station
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <div>
                                        <p className="font-bold text-base">{fir.police_stations?.name}</p>
                                        {fir.police_stations?.name_ml && <p className="text-xs text-muted-foreground font-malayalam">{fir.police_stations?.name_ml}</p>}
                                    </div>
                                    <div className="text-muted-foreground space-y-1">
                                        <p>{fir.police_stations?.address}</p>
                                        <p className="font-medium text-foreground">{fir.police_stations?.district} District</p>
                                    </div>
                                    <Separator />
                                    <div className="pt-1">
                                        <p className="text-xs text-muted-foreground">Contact</p>
                                        <p className="font-mono text-blue-700">{fir.police_stations?.phone}</p>
                                        <p className="text-xs text-blue-600 truncate">{fir.police_stations?.email}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Investigating Officer */}
                            <Card className="shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-md flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Investigating Officer
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                                        <User className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{fir.officers?.name}</p>
                                        <p className="text-xs text-muted-foreground">{fir.officers?.rank}</p>
                                        <Badge variant="secondary" className="text-[10px] mt-1 h-5">
                                            Badge: {fir.officers?.badge_number}
                                        </Badge>
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

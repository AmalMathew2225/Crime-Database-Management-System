import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Phone, User, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

async function getPersonData(id: string) {
    try {
        // Construct API URL for server-side fetch
        // Use environment variable if available, otherwise default to localhost
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                       process.env.VERCEL_URL 
                       ? `https://${process.env.VERCEL_URL}`
                       : 'http://localhost:3000';
        
        const response = await fetch(`${baseUrl}/api/person/${id}`, {
            cache: 'no-store', // Always fetch fresh data
        });

        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return data.person;
    } catch (error) {
        console.error('Error fetching person from API:', error);
        // Fallback to direct function call if API fails (useful during development)
        try {
            const { getPersonWithCases } = await import('@/lib/mock-data');
            return getPersonWithCases(id);
        } catch (fallbackError) {
            console.error('Fallback also failed:', fallbackError);
            return null;
        }
    }
}

export default async function PersonDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const personData = await getPersonData(id);

    if (!personData) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Dashboard
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Person Profile */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Person Profile</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-center mb-6">
                                    <div className="h-32 w-32 rounded-full bg-secondary flex items-center justify-center">
                                        <User className="h-16 w-16 text-muted-foreground" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground uppercase">Name</label>
                                        <p className="font-semibold text-lg">{personData.name}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground uppercase">Age</label>
                                            <p>{personData.age}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground uppercase">Gender</label>
                                            <p>{personData.gender}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground mt-1" />
                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground uppercase">Phone</label>
                                            <p>{personData.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground uppercase">Address</label>
                                            <p className="text-sm">{personData.address}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Involved Cases */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold mb-6 text-primary">Involved Cases</h2>

                        <div className="space-y-4">
                            {personData.involvements.length > 0 ? (
                                personData.involvements.map((involvement) => (
                                    <Card key={involvement.id} className="overflow-hidden border-l-4 border-l-primary hover:shadow-md transition-shadow">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge variant={
                                                            involvement.involvement_type === 'Accused' ? 'destructive' :
                                                                involvement.involvement_type === 'Suspect' ? 'default' : // default is roughly primary usually
                                                                    'secondary'
                                                        }>
                                                            {involvement.involvement_type}
                                                        </Badge>
                                                        <span className="text-sm text-muted-foreground">
                                                            {new Date(involvement.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-xl font-bold mb-1">
                                                        {involvement.fir?.fir_number || "Unknown FIR"}
                                                    </h3>
                                                    <p className="text-sm font-medium text-muted-foreground">
                                                        {involvement.fir?.crime_types?.name} - {involvement.fir?.crime_types?.ipc_section}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <Badge variant="outline" className="capitalize">
                                                        {involvement.fir?.status}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className="bg-muted/50 p-4 rounded-md mb-4">
                                                <p className="text-sm text-foreground">
                                                    <span className="font-semibold">Case Details: </span>
                                                    {involvement.fir?.description}
                                                </p>
                                                {involvement.details && (
                                                    <p className="text-sm text-foreground mt-2">
                                                        <span className="font-semibold">Involvement Notes: </span>
                                                        {involvement.details}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {involvement.fir?.police_stations?.name}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    Filed: {new Date(involvement.fir?.date_filed || "").toLocaleDateString()}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
                                    <p className="text-muted-foreground">No cases found for this person.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

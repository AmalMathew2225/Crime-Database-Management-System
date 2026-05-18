"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, User, Shield, MapPin, Phone, AlertTriangle, FileText, Skull, Zap, Calendar } from "lucide-react";
import type { Criminal, CriminalFirLink } from "@/lib/types";

const THREAT_COLORS: Record<string, { bg: string; text: string; border: string; dark: string }> = {
  Low:     { bg: "#dcfce7", text: "#166534", border: "#86efac", dark: "#16a34a" },
  Medium:  { bg: "#fef9c3", text: "#713f12", border: "#fde047", dark: "#ca8a04" },
  High:    { bg: "#fee2e2", text: "#991b1b", border: "#fca5a5", dark: "#dc2626" },
  Extreme: { bg: "#fdf2f8", text: "#86198f", border: "#f0abfc", dark: "#a21caf" },
};

export default function CriminalProfilePage() {
  const params = useParams();
  const aadhar = decodeURIComponent(params.aadhar as string);
  const [criminal, setCriminal] = useState<Criminal | null>(null);
  const [links, setLinks]       = useState<CriminalFirLink[]>([]);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/criminals/${encodeURIComponent(aadhar)}`)
      .then(r => { if (!r.ok) { setNotFound(true); setLoading(false); return null; } return r.json(); })
      .then(d => { if (d) { setCriminal(d.criminal); setLinks(d.links || []); } setLoading(false); })
      .catch(() => { setLoading(false); setNotFound(true); });
  }, [aadhar]);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading criminal profile…</div>
    </div>
  );

  if (notFound || !criminal) return (
    <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4">
      <AlertTriangle className="h-12 w-12 text-destructive" />
      <h2 className="text-xl font-bold">Criminal record not found</h2>
      <Link href="/criminals"><Button variant="secondary"><ArrowLeft className="mr-2 h-4 w-4" />Back to Database</Button></Link>
    </div>
  );

  const tc = THREAT_COLORS[criminal.threat_level] || THREAT_COLORS.Medium;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Back */}
        <Button variant="ghost" className="pl-0 mb-6" asChild>
          <Link href="/criminals" className="flex items-center gap-2 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Criminal Database
          </Link>
        </Button>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left sidebar — identity */}
          <div className="space-y-4">
            {/* Photo / Avatar */}
            <Card className="text-center overflow-hidden" style={{ borderTop: `4px solid ${tc.dark}` }}>
              <CardContent className="pt-8 pb-6">
                <div className="h-24 w-24 rounded-full mx-auto flex items-center justify-center mb-4"
                  style={{ background: tc.bg, border: `3px solid ${tc.border}` }}>
                  {criminal.threat_level === "Extreme"
                    ? <Skull className="h-12 w-12" style={{ color: tc.text }} />
                    : criminal.is_absconding
                    ? <Zap className="h-12 w-12" style={{ color: tc.text }} />
                    : <User className="h-12 w-12" style={{ color: tc.text }} />}
                </div>
                <h1 className="text-xl font-bold">{criminal.name}</h1>
                {criminal.alias && <p className="text-sm text-muted-foreground">aka "{criminal.alias}"</p>}
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase"
                    style={{ background: tc.bg, color: tc.text, border: `1px solid ${tc.border}` }}>
                    {criminal.threat_level} Threat
                  </span>
                  {criminal.is_convicted && <Badge variant="destructive" className="text-xs">Convicted</Badge>}
                  {criminal.is_absconding && <Badge className="text-xs bg-orange-500">Absconding</Badge>}
                </div>
              </CardContent>
            </Card>

            {/* Personal details */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4" /> Identity Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Aadhar Number</p>
                  <p className="font-mono font-bold text-primary">{criminal.aadhar_number}</p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-xs text-muted-foreground">Age</p><p className="font-medium">{criminal.age ?? "—"}</p></div>
                  <div><p className="text-xs text-muted-foreground">Gender</p><p className="font-medium">{criminal.gender ?? "—"}</p></div>
                </div>
                {criminal.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-mono text-sm">{criminal.phone}</span>
                  </div>
                )}
                {criminal.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                    <span className="text-sm">{criminal.address}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes */}
            {criminal.notes && (
              <Card className="border-amber-200 bg-amber-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-amber-800 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" /> Intelligence Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-amber-900">{criminal.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right — case history */}
          <div className="md:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Case History
                  <Badge variant="outline" className="ml-auto">{links.length} FIR{links.length !== 1 ? "s" : ""}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {links.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">No linked FIRs found in database.</div>
                ) : (
                  <div className="divide-y">
                    {links.map(link => {
                      const fir = link.fir as any;
                      return (
                        <div key={link.id} className="p-4 hover:bg-muted/30 transition-colors">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-primary text-sm">{fir?.fir_number || link.fir_id}</span>
                                <Badge variant="outline" className="text-[10px] capitalize">{link.involvement_type}</Badge>
                                {fir?.status && (
                                  <Badge variant="outline" className="text-[10px]">{fir.status}</Badge>
                                )}
                              </div>
                              {fir?.crime_types?.name && (
                                <p className="text-sm font-medium text-foreground">{fir.crime_types.name}</p>
                              )}
                              {fir?.location && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                  <MapPin className="h-3 w-3" /> {fir.location}
                                </p>
                              )}
                              {fir?.date_filed && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                  <Calendar className="h-3 w-3" /> {new Date(fir.date_filed).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                                </p>
                              )}
                              {link.details && (
                                <p className="text-xs bg-muted/40 rounded px-2 py-1 mt-2">{link.details}</p>
                              )}
                            </div>
                            {fir?.id && (
                              <Link href={`/case/${fir.id}`}>
                                <Button variant="ghost" size="sm" className="shrink-0">View Case</Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

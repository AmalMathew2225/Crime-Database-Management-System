"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, User, AlertTriangle, FileText, Search, Filter, Skull, Zap } from "lucide-react";
import type { Criminal } from "@/lib/types";

const THREAT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Low:     { bg: "#dcfce7", text: "#166534", border: "#86efac" },
  Medium:  { bg: "#fef9c3", text: "#713f12", border: "#fde047" },
  High:    { bg: "#fee2e2", text: "#991b1b", border: "#fca5a5" },
  Extreme: { bg: "#fdf2f8", text: "#86198f", border: "#f0abfc" },
};

export default function CriminalsPage() {
  const [criminals, setCriminals] = useState<Criminal[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [threat, setThreat]       = useState("All");

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (threat !== "All") params.set("threat_level", threat);
    fetch(`/api/criminals?${params}`)
      .then(r => r.json())
      .then(d => { setCriminals(d.criminals || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [search, threat]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
              <Shield className="h-8 w-8 text-red-600" /> Criminal Database
            </h1>
            <p className="text-muted-foreground mt-1">
              {criminals.length} registered criminals · Identified by Aadhar Card Number
            </p>
          </div>
          <div className="flex gap-2 text-xs flex-wrap">
            {Object.entries(THREAT_COLORS).map(([level, c]) => (
              <span key={level} className="px-2 py-1 rounded-full font-semibold"
                style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
                {level}
              </span>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card p-4 rounded-lg border shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name or alias…" className="pl-9" value={search}
                onChange={e => { setSearch(e.target.value); setLoading(true); }} />
            </div>
            <div className="w-full md:w-[200px]">
              <Select value={threat} onValueChange={v => { setThreat(v); setLoading(true); }}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Threat Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Levels</SelectItem>
                  <SelectItem value="Extreme">Extreme</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-20 text-muted-foreground animate-pulse">Loading criminal records…</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {criminals.length > 0 ? criminals.map((c) => {
              const tc = THREAT_COLORS[c.threat_level] || THREAT_COLORS.Medium;
              return (
                <Card key={c.aadhar_number} className="overflow-hidden hover:shadow-lg transition-all duration-200 border-l-4"
                  style={{ borderLeftColor: tc.border }}>
                  <CardHeader className="pb-3" style={{ background: tc.bg + "55" }}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full flex items-center justify-center"
                          style={{ background: tc.bg, border: `2px solid ${tc.border}` }}>
                          {c.threat_level === "Extreme" ? <Skull className="h-6 w-6" style={{ color: tc.text }} />
                            : c.is_absconding ? <Zap className="h-6 w-6" style={{ color: tc.text }} />
                            : <User className="h-6 w-6" style={{ color: tc.text }} />}
                        </div>
                        <div>
                          <CardTitle className="text-base">{c.name}</CardTitle>
                          {c.alias && <p className="text-xs text-muted-foreground">aka "{c.alias}"</p>}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                        style={{ background: tc.bg, color: tc.text, border: `1px solid ${tc.border}` }}>
                        {c.threat_level}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-xs text-muted-foreground block">Aadhar</span>
                        <span className="font-mono font-medium text-xs">{c.aadhar_number}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block">Age / Gender</span>
                        <span className="font-medium">{c.age ?? "—"} / {c.gender ?? "—"}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {c.is_convicted && (
                        <Badge variant="destructive" className="text-[10px]">Convicted</Badge>
                      )}
                      {c.is_absconding && (
                        <Badge className="text-[10px] bg-orange-500">Absconding</Badge>
                      )}
                    </div>
                    {c.notes && (
                      <p className="text-xs text-muted-foreground line-clamp-2 bg-muted/40 p-2 rounded">{c.notes}</p>
                    )}
                    <Link href={`/criminals/${encodeURIComponent(c.aadhar_number)}`} className="block">
                      <Button className="w-full gap-2" variant="secondary" size="sm">
                        <FileText className="h-4 w-4" /> View Full Profile
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            }) : (
              <div className="col-span-full text-center py-12 text-muted-foreground border border-dashed rounded-lg">
                No criminal records match your search.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

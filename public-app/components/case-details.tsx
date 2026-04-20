"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { MapPin, User, UserCircle, FileText } from "lucide-react";
import { useLanguage } from "../lib/language";

interface FIRWithRelations {
  id: string;
  fir_number: string;
  date_filed: string;
  time_filed: string;
  location: string;
  location_ml?: string;
  description: string;
  complainant_name: string;
  status: string;
  police_stations?: { name: string; name_ml?: string };
  crime_types?: { name: string; name_ml?: string; ipc_section: string; description: string };
  officers?: { name: string; rank: string; badge_number: string };
}

interface CaseDetailsProps {
  fir: FIRWithRelations;
}

export function CaseDetails({ fir }: CaseDetailsProps) {
  const { lang } = useLanguage();
  return (
    <Card>
      <CardHeader className="border-b bg-muted/30">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Case Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Description
          </h3>
          <p className="text-foreground leading-relaxed">{fir.description}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-medium">Location</span>
            </div>
            <p className="text-foreground">
              {lang === "ml" && fir.location_ml ? fir.location_ml : fir.location}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">Complainant</span>
            </div>
            <p className="text-foreground">{fir.complainant_name}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <UserCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Investigating Officer</span>
          </div>
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="font-medium text-foreground">{fir.officers?.name}</p>
            <p className="text-sm text-muted-foreground">
              {fir.officers?.rank} - {fir.officers?.badge_number}
            </p>
            {fir.police_stations && (
              <p className="mt-1 text-sm text-muted-foreground">
                {lang === "ml" && fir.police_stations.name_ml
                  ? fir.police_stations.name_ml
                  : fir.police_stations.name}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

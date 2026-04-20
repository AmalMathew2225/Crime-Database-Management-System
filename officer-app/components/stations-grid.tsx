import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Phone, Mail, MapPin } from "lucide-react";
import type { PoliceStation } from "@/lib/types";

interface StationsGridProps {
  stations: PoliceStation[];
}

export function StationsGrid({ stations }: StationsGridProps) {
  return (
    <section id="stations" className="space-y-4">
      <div className="flex items-center gap-2">
        <Building2 className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">
          Police Stations
        </h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stations.map((station) => (
          <Card key={station.id} className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{station.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{station.name_ml}</p>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{station.address}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" />
                <a
                  href={`tel:${station.phone}`}
                  className="hover:text-primary hover:underline"
                >
                  {station.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <a
                  href={`mailto:${station.email}`}
                  className="truncate hover:text-primary hover:underline"
                >
                  {station.email}
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}



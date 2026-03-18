"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "../lib/language";
import Link from "next/link";
import Fuse from "fuse.js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Search, FileText, ChevronRight } from "lucide-react";

interface FIR {
  id: string;
  fir_number: string;
  date_filed: string;
  station_id: string;
  crime_type_id: string;
  location: string;
  location_ml?: string;
  status: string;
  police_stations?: { id: string; name: string; name_ml?: string; district: string };
  crime_types?: { id: string; name: string; ipc_section: string };
}

interface FIRTableProps {
  firs: FIR[];
  stations: { id: string; name: string }[];
  crimeTypes: { id: string; name: string; ipc_section: string }[];
}

const statusColors: Record<string, string> = {
  Registered: "bg-blue-100 text-blue-800 border-blue-200",
  "Under Investigation": "bg-amber-100 text-amber-800 border-amber-200",
  "Charge Sheet Filed": "bg-green-100 text-green-800 border-green-200",
  "Court Proceedings": "bg-purple-100 text-purple-800 border-purple-200",
  Closed: "bg-gray-100 text-gray-800 border-gray-200",
};

export function FIRTable({ firs, stations, crimeTypes }: FIRTableProps) {
  const [search, setSearch] = useState("");
  const [stationFilter, setStationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [crimeTypeFilter, setCrimeTypeFilter] = useState("all");

  const [filteredFirs, setFilteredFirs] = useState<FIR[]>(firs);
  const [fuse] = useState(
    new Fuse(firs, {
      keys: [
        "fir_number",
        "location",
        "crime_types.name",
        "police_stations.name",
        "status",
      ],
      threshold: 0.4,
      includeScore: true,
    })
  );

  useEffect(() => {
    let result = firs;
    if (search.trim() !== "") {
      const fuseResults = fuse.search(search);
      result = fuseResults.map((res) => res.item);
    }
    result = result.filter((fir) => {
      const matchesStation = stationFilter === "all" || fir.station_id === stationFilter;
      const matchesStatus = statusFilter === "all" || fir.status === statusFilter;
      const matchesCrimeType = crimeTypeFilter === "all" || fir.crime_type_id === crimeTypeFilter;
      return matchesStation && matchesStatus && matchesCrimeType;
    });
    setFilteredFirs(result);
  }, [search, stationFilter, statusFilter, crimeTypeFilter, firs, fuse]);

  const { lang } = useLanguage();

  return (
    <Card id="recent-firs">
      <CardHeader className="border-b bg-muted/30">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Registered FIRs
          </CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search FIR, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Select value={stationFilter} onValueChange={setStationFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Stations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stations</SelectItem>
              {stations.map((station) => (
                <SelectItem key={station.id} value={station.id}>
                  {station.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={crimeTypeFilter} onValueChange={setCrimeTypeFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Crime Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Crime Types</SelectItem>
              {crimeTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name} ({type.ipc_section})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Registered">Registered</SelectItem>
              <SelectItem value="Under Investigation">Under Investigation</SelectItem>
              <SelectItem value="Charge Sheet Filed">Charge Sheet Filed</SelectItem>
              <SelectItem value="Court Proceedings">Court Proceedings</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary hover:bg-primary/90">
                <TableHead className="font-bold text-primary-foreground">FIR Number</TableHead>
                <TableHead className="font-bold text-primary-foreground">Date</TableHead>
                <TableHead className="font-bold text-primary-foreground">Station</TableHead>
                <TableHead className="font-bold text-primary-foreground">Crime Type</TableHead>
                <TableHead className="font-bold text-primary-foreground">Location</TableHead>
                <TableHead className="font-bold text-primary-foreground">Status</TableHead>
                <TableHead className="font-bold text-primary-foreground">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFirs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No FIRs found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredFirs.map((fir) => (
                  <TableRow key={fir.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium text-primary">
                      {fir.fir_number}
                    </TableCell>
                    <TableCell>
                      {new Date(fir.date_filed).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {lang === "ml" && fir.police_stations?.name_ml
                            ? fir.police_stations.name_ml
                            : fir.police_stations?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {fir.police_stations?.district}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{fir.crime_types?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {fir.crime_types?.ipc_section}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <p className="truncate">
                        {lang === "ml" && fir.location_ml
                          ? fir.location_ml
                          : fir.location}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={statusColors[fir.status]}
                      >
                        {fir.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/case/${fir.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="border-t bg-muted/20 px-6 py-3">
          <p className="text-sm text-muted-foreground">
            Showing {filteredFirs.length} of {firs.length} FIRs
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

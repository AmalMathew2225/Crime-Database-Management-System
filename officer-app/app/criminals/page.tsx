"use client";

import { useState } from "react";
import { getCriminals } from "@/lib/mock-data";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, User, AlertTriangle, FileText, Search, Filter } from "lucide-react";
import Link from "next/link";
import { InvolvementType } from "@/lib/types";

export default function CriminalsPage() {
    const allCriminals = getCriminals();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("All");

    const filteredCriminals = allCriminals.filter((criminal) => {
        const matchesSearch =
            criminal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            criminal.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            criminal.phone.includes(searchTerm);

        const matchesRole =
            filterRole === "All" ||
            criminal.involvements.some((inv) => inv.involvement_type === filterRole);

        return matchesSearch && matchesRole;
    });

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
                            <Shield className="h-8 w-8" />
                            Criminal Database
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Registry of individuals involved in registered cases as Accused or Suspects.
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-card p-4 rounded-lg border shadow-sm mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, ID, or phone..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="w-full md:w-[200px]">
                            <Select value={filterRole} onValueChange={setFilterRole}>
                                <SelectTrigger>
                                    <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <SelectValue placeholder="Filter by Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Roles</SelectItem>
                                    <SelectItem value={InvolvementType.ACCUSED}>Accused</SelectItem>
                                    <SelectItem value={InvolvementType.SUSPECT}>Suspect</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCriminals.length > 0 ? (
                        filteredCriminals.map((criminal) => (
                            <Card key={criminal.id} className="overflow-hidden hover:shadow-lg transition-all duration-200 border-l-4 border-l-destructive">
                                <CardHeader className="bg-secondary/20 pb-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                                                <User className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">{criminal.name}</CardTitle>
                                                <p className="text-xs text-muted-foreground">ID: {criminal.id}</p>
                                            </div>
                                        </div>
                                        <Badge variant="destructive" className="uppercase text-[10px]">
                                            Record Found
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div>
                                                <span className="text-xs text-muted-foreground block">Age/Gender</span>
                                                <span className="font-medium">{criminal.age} / {criminal.gender}</span>
                                            </div>
                                            <div>
                                                <span className="text-xs text-muted-foreground block">Phone</span>
                                                <span className="font-medium">{criminal.phone}</span>
                                            </div>
                                        </div>

                                        <div className="bg-muted p-3 rounded-md">
                                            <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-primary">
                                                <AlertTriangle className="h-4 w-4" />
                                                Recent Involvements
                                            </div>
                                            <div className="space-y-2">
                                                {criminal.involvements.slice(0, 2).map((inv) => (
                                                    <div key={inv.id} className="text-xs flex justify-between items-center bg-background p-2 rounded border">
                                                        <span className="font-medium truncate max-w-[120px]">
                                                            {inv.fir?.fir_number}
                                                        </span>
                                                        <Badge variant="outline" className="text-[10px] h-5">
                                                            {inv.involvement_type}
                                                        </Badge>
                                                    </div>
                                                ))}
                                                {criminal.involvements.length > 2 && (
                                                    <p className="text-[10px] text-center text-muted-foreground">
                                                        +{criminal.involvements.length - 2} more cases
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <Link href={`/person/${criminal.id}`} className="block">
                                            <Button className="w-full gap-2" variant="secondary">
                                                <FileText className="h-4 w-4" />
                                                View Full Record
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 bg-muted/20 rounded-lg border border-dashed text-muted-foreground">
                            No criminal records found matching your filters.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

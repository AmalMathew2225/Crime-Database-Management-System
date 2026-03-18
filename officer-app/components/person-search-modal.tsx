"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserCircle, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Person } from "@/lib/types";

export function PersonSearchModal() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Person[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!query.trim()) return;
        
        setLoading(true);
        setError(null);
        setResults([]);

        try {
            const response = await fetch(`/api/person?query=${encodeURIComponent(query.trim())}`);
            
            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.error || "Failed to search persons");
            }

            const data = await response.json();
            setResults(data.persons || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-primary gap-2">
                    <Search className="h-4 w-4" />
                    Person Search
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Search Persons Involved in Cases</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="Search by name or phone..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        />
                        <Button onClick={handleSearch} disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                        </Button>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                            <AlertCircle className="h-4 w-4" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="max-h-[300px] overflow-y-auto space-y-2">
                        {results.length > 0 ? (
                            results.map((person) => (
                                <Link
                                    key={person.id}
                                    href={`/person/${person.id}`}
                                    onClick={() => setOpen(false)}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors border"
                                >
                                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                                        <UserCircle className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">{person.name}</p>
                                        <p className="text-xs text-muted-foreground">Ph: {person.phone}</p>
                                    </div>
                                </Link>
                            ))
                        ) : query && !loading && !error ? (
                            <p className="text-center text-sm text-muted-foreground py-4">No persons found.</p>
                        ) : null}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

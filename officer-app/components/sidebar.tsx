
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Filter, Search } from "lucide-react";

export function Sidebar() {
    return (
        <aside className="h-fit sticky top-5 rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2 text-lg font-semibold text-primary">
                <Filter className="h-5 w-5" />
                <h3>Filters</h3>
            </div>

            <div className="space-y-5">
                <div className="space-y-2">
                    <label htmlFor="search" className="text-sm font-semibold text-muted-foreground">
                        Search cases
                    </label>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="search"
                            placeholder="FIR No, Location, IPC..."
                            className="pl-9"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="station-filter" className="text-sm font-semibold text-muted-foreground">
                        Police Station
                    </label>
                    <Select>
                        <SelectTrigger id="station-filter">
                            <SelectValue placeholder="All Stations" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Stations</SelectItem>
                            {/* Mock data for now, should be dynamic later */}
                            <SelectItem value="central">Central Police Station</SelectItem>
                            <SelectItem value="fort">Fort Police Station</SelectItem>
                            <SelectItem value="museum">Museum Police Station</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="type-filter" className="text-sm font-semibold text-muted-foreground">
                        Crime Type
                    </label>
                    <Select>
                        <SelectTrigger id="type-filter">
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="Assault">Assault</SelectItem>
                            <SelectItem value="Accident">Accident</SelectItem>
                            <SelectItem value="Murder">Murder</SelectItem>
                            <SelectItem value="Robbery">Robbery</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="status-filter" className="text-sm font-semibold text-muted-foreground">
                        Status
                    </label>
                    <Select>
                        <SelectTrigger id="status-filter">
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="Open">Open</SelectItem>
                            <SelectItem value="Under Investigation">Under Investigation</SelectItem>
                            <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">
                        Date Range
                    </label>
                    <div className="grid gap-2">
                        <Input type="date" className="block" />
                        <Input type="date" className="block" />
                    </div>
                </div>

                <div className="pt-2 space-y-2">
                    <Button className="w-full bg-primary hover:bg-primary/90">Apply Filters</Button>
                    <Button variant="outline" className="w-full text-primary border-primary hover:bg-primary hover:text-white">
                        Reset
                    </Button>
                </div>
            </div>
        </aside>
    );
}

import Link from "next/link";
import { Search, Globe, UserCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PersonSearchModal } from "@/components/person-search-modal";

export function Navbar() {
    return (
        <header className="main-header border-b-2 border-secondary bg-white py-5 mb-8">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-3 decoration-0">
                    <Shield className="h-8 w-8 text-primary" />
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold text-primary leading-tight">
                            Crime Transparency <span className="text-accent">Portal</span>
                        </h1>
                    </div>
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/criminals" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Criminal Database
                    </Link>
                </nav>

                {/* Tagline - Hidden on small screens if needed, or styled as badge */}
                <div className="hidden sm:inline-block rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                    RTI Public Information System
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <PersonSearchModal />
                    <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-primary gap-2">
                        <UserCircle className="h-4 w-4" />
                        Login
                    </Button>
                    <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-primary gap-2">
                        <Globe className="h-4 w-4" />
                        Malayalam
                    </Button>
                </div>
            </div>

            {/* Secondary Nav Line - Optional if we want to mimic the reference exactly, 
                but reference has links in header. Let's keep it simple for now. 
            */}
        </header>
    );
}

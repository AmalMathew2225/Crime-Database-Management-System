import Link from "next/link";
import { Search, Globe, UserCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PersonSearchModal } from "@/components/person-search-modal";
import { NotificationsDropdown } from "@/components/notifications-dropdown";

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

                {/* Removed non-functional buttons as requested */}
                <div className="flex items-center gap-4">
                    {/* Empty for now, can add officer profile later */}
                </div>
            </div>

            {/* Secondary Nav Line - Optional if we want to mimic the reference exactly, 
                but reference has links in header. Let's keep it simple for now. 
            */}
        </header>
    );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HeroSection() {
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();

    const handleSearch = () => {
        if (searchTerm.trim()) {
            router.push(`/?search=${encodeURIComponent(searchTerm)}#recent-firs`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <section className="relative w-full bg-[#001f3f] py-24 md:py-32 overflow-hidden">
            {/* Background Image Overlay - Simulating the police imagery */}
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-950 to-blue-900" />
                {/* In a real app, we would put an <Image /> here with object-cover */}
            </div>

            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="mx-auto max-w-4xl space-y-6">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-lg">
                        THUNA
                    </h1>
                    <p className="text-xl sm:text-2xl font-light text-blue-100 italic">
                        "The Hand yOu Need for Assistance"
                    </p>
                    <div className="h-1 w-24 bg-red-600 mx-auto rounded-full my-6"></div>
                    <p className="text-lg text-blue-200">
                        Official Crime Transparency Portal of Kerala Police
                    </p>

                    {/* Search Bar */}
                    <div className="mx-auto mt-10 max-w-xl">
                        <div className="flex w-full items-center space-x-2 bg-white/10 rounded-lg p-2 backdrop-blur-sm border border-white/20">
                            <Input
                                type="text"
                                placeholder="Search for FIR, Services, or Information..."
                                className="bg-transparent border-none text-white placeholder:text-blue-300 focus-visible:ring-0 focus-visible:ring-offset-0"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <Button
                                size="icon"
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                                onClick={handleSearch}
                            >
                                <Search className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Wave/Shape at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-background custom-shape-divider">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="h-full w-full fill-background">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
                </svg>
            </div>
        </section>
    );
}

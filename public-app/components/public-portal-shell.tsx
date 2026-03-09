"use client";

import type { ReactNode } from "react";
import { LanguageProvider } from "../lib/language";
import { LanguageToggle } from "../components/language-toggle";
import { ShieldCheck } from "lucide-react";

export function PublicPortalShell({ children }: { children: ReactNode }) {
    return (
        <LanguageProvider>
            <div className="relative min-h-screen flex flex-col bg-slate-50">
                {/* Glassmorphism Header */}
                <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
                    <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
                        <div className="flex items-center gap-2">
                            <div className="rounded-lg bg-blue-600 p-1.5 text-white">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900">
                                Kerala Police <span className="text-blue-600 text-sm font-medium">Crime Watch</span>
                            </h1>
                        </div>

                        <nav className="hidden items-center gap-6 md:flex">
                            <a href="/" className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600">Home</a>
                            <a href="/stats" className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600">Statistics</a>
                            <a href="/heatmap" className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600">Heatmap</a>
                            <div className="h-4 w-px bg-slate-200" />
                            <LanguageToggle />
                        </nav>

                        <div className="md:hidden flex items-center gap-2">
                            <LanguageToggle />
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1">
                    <div className="container mx-auto px-4 py-8 sm:px-6">
                        {children}
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-slate-200 bg-white py-8">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                            <p className="text-sm text-slate-500">
                                &copy; 2026 Kerala Police Crime Watch · Open for all citizens
                            </p>
                            <div className="flex items-center gap-4">
                                <a href="/rss.xml" className="text-sm text-slate-500 hover:text-blue-600">RSS Feed</a>
                                <span className="text-xs text-slate-300">|</span>
                                <span className="text-sm text-slate-400">Powered by Kerala Cyber Dome</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </LanguageProvider>
    );
}

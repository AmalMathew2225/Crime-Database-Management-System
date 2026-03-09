"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShieldCheck, LogOut } from "lucide-react";
import { LanguageProvider } from "../lib/language";
import { LanguageToggle } from "../components/language-toggle";

export function AuthGuard({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [badge, setBadge] = useState<string | null>(null);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("officer_badge");
        setBadge(stored);
        setChecked(true);
        if (!stored && pathname !== "/login") {
            router.replace("/login");
        }
    }, [pathname, router]);

    const logout = () => {
        localStorage.removeItem("officer_badge");
        router.replace("/login");
    };

    // Show nothing while checking auth to avoid flash
    if (!checked) return null;

    // On login page, render without the portal layout
    if (pathname === "/login") return <>{children}</>;

    // Render full portal layout for authenticated users
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
                                Crime Portal <span className="text-blue-600 text-sm font-medium">Public</span>
                            </h1>
                        </div>

                        <nav className="hidden items-center gap-6 md:flex">
                            <a href="/" className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600">Home</a>
                            <a href="/stats" className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600">Statistics</a>
                            <a href="/heatmap" className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600">Heatmap</a>
                            <div className="h-4 w-px bg-slate-200" />
                            <LanguageToggle />

                            {/* Officer Badge Display */}
                            {badge && (
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700">
                                        <ShieldCheck className="h-3 w-3" />
                                        Officer {badge}
                                    </div>
                                    <button
                                        onClick={logout}
                                        title="Logout"
                                        className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
                                    >
                                        <LogOut className="h-3 w-3" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </nav>

                        {/* Mobile */}
                        <div className="md:hidden flex items-center gap-2">
                            <LanguageToggle />
                            {badge && (
                                <button onClick={logout} className="text-xs text-red-500 p-1">
                                    <LogOut className="h-4 w-4" />
                                </button>
                            )}
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
                                &copy; 2026 Crime Portal · Transparency for all citizens
                            </p>
                            <div className="flex items-center gap-6">
                                <a href="/rss.xml" className="text-sm text-slate-500 hover:text-blue-600">
                                    RSS Feed
                                </a>
                                <span className="text-xs text-slate-300">|</span>
                                <span className="text-sm text-slate-400">Powered by Kerala Police Cyber Dome</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </LanguageProvider>
    );
}

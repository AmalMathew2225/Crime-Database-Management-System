"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShieldCheck, LogOut } from "lucide-react";

export function OfficerAuthGuard({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [badge, setBadge] = useState<string | null>(null);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("officer_badge");
        setBadge(stored);
        setChecked(true);
        // Protect /dashboard from unauthenticated access
        if (!stored && pathname === "/dashboard") {
            router.replace("/login");
        }
    }, [pathname, router]);

    const logout = () => {
        localStorage.removeItem("officer_badge");
        router.replace("/login");
    };

    if (!checked) return null;

    return <>{children}</>;
}

"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

export function OfficerAuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (!res.ok) {
        router.replace("/login");
        return;
      }
      setChecked(true);
    }
    checkAuth();
  }, [router]);

  if (!checked) return null;
  return <>{children}</>;
}

import type { Metadata } from "next";
import { PublicPortalShell } from "../components/public-portal-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "THUNA — Crime Transparency Portal",
  description:
    "Public crime transparency portal. View FIRs, active cases, and police activity.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="h-full font-sans antialiased" suppressHydrationWarning>
        <PublicPortalShell>{children}</PublicPortalShell>
      </body>
    </html>
  );
}

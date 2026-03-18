import type { Metadata } from "next";
import { PublicPortalShell } from "../components/public-portal-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kerala Police Crime Watch - Public Portal",
  description:
    "Public crime transparency portal for Kerala. View FIRs, active cases, and police activity across Kerala.",
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

import type { Metadata } from "next";
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
        {children}
      </body>
    </html>
  );
}

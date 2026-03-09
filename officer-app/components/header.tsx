import Link from "next/link";
import { Shield } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-primary text-primary-foreground shadow-md">
      {/* Top Bar for Government Branding if needed, keeping it simple for now */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition-transform group-hover:scale-105">
              <Shield className="h-7 w-7 text-accent" />
            </div>
            <div className="flex flex-col">
              <h1 className="font-heading text-xl font-bold leading-tight tracking-wide sm:text-2xl">
                KERALA POLICE
              </h1>
              <p className="text-xs font-medium text-primary-foreground/80 sm:text-sm">
                Crime Transparency Portal (Thuna)
              </p>
            </div>
          </Link>

          {/* Desktop Navigation - Icon above Text */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/"
              className="group flex flex-col items-center gap-1 text-primary-foreground/90 transition-colors hover:text-accent"
            >
              <div className="rounded-md p-1 group-hover:bg-white/10">
                <Shield className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider">Home</span>
            </Link>
            <Link
              href="/#firs"
              className="group flex flex-col items-center gap-1 text-primary-foreground/90 transition-colors hover:text-accent"
            >
              <div className="rounded-md p-1 group-hover:bg-white/10">
                <Shield className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider">View FIRs</span>
            </Link>
            <Link
              href="/#stations"
              className="group flex flex-col items-center gap-1 text-primary-foreground/90 transition-colors hover:text-accent"
            >
              <div className="rounded-md p-1 group-hover:bg-white/10">
                <Shield className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider">Stations</span>
            </Link>
          </nav>

          {/* Mobile Menu Button place holder - can be added if needed */}
        </div>
      </div>
      {/* Blue/Accent Strip */}
      <div className="h-1 w-full bg-accent"></div>
    </header>
  );
}



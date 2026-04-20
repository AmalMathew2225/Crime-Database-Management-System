import { Shield, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="bg-black/20 py-1">
        <div className="mx-auto max-w-7xl px-4 text-center text-xs opacity-70">
          Official Website of Kerala Police - Government of Kerala
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-accent" />
              <span className="font-heading text-lg font-bold tracking-wide">KERALA POLICE</span>
            </div>
            <p className="text-sm leading-relaxed text-primary-foreground/80">
              Crime Transparency Portal - Ensuring public access to information regarding reported crimes and police activities under the RTI Act 2005.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-bold tracking-wide">Quick Links</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <a href="/" className="hover:text-accent hover:underline">
                  Home
                </a>
              </li>
              <li>
                <a href="/#firs" className="hover:text-accent hover:underline">
                  View FIRs
                </a>
              </li>
              <li>
                <a href="/#stations" className="hover:text-accent hover:underline">
                  Police Stations
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-bold tracking-wide">Emergency</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <div className="rounded-full bg-accent/10 p-1.5 text-accent">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="font-semibold">Police: 100</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="rounded-full bg-accent/10 p-1.5 text-accent">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="font-semibold">Women Helpline: 1091</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="rounded-full bg-accent/10 p-1.5 text-accent">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="font-semibold">Cyber Crime: 1930</span>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-bold tracking-wide">Contact Us</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-accent" />
                <span>info@keralapolice.gov.in</span>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="mt-0.5 h-4 w-4 text-accent" />
                <span>
                  State Police Media Centre,<br />
                  Police Headquarters,<br />
                  Thiruvananthapuram, Kerala - 695010
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-primary-foreground/10 pt-8 text-center text-sm text-primary-foreground/60">
          <p>
            &copy; {new Date().getFullYear()} Government of Kerala. All Rights Reserved.
          </p>
          <p className="mt-2 text-xs">
            Powered by Kerala Police Cyber Dome
          </p>
        </div>
      </div>
    </footer>
  );
}


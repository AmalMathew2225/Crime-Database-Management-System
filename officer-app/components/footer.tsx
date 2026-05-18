import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#001e40] text-white border-t border-white/10 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-yellow-500" />
            <div>
              <span className="text-sm font-bold tracking-wide">KERALA POLICE</span>
              <p className="text-xs text-white/60">Crime Transparency Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-white/60">
            <span className="hidden sm:inline">Official Website of Kerala Police - Government of Kerala</span>
            <div className="h-4 w-px bg-white/20 hidden sm:block"></div>
            <span>&copy; {new Date().getFullYear()} All Rights Reserved.</span>
          </div>

          <div className="text-xs text-white/50">
            Powered by <span className="font-semibold text-white/80">Kerala Police Cyber Dome</span>
          </div>

        </div>
      </div>
    </footer>
  );
}

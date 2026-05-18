"use client";

import Link from "next/link";

const LOGIN_URL = "/login";

// Color constants from the design system reference
const C = {
  primary:        "#001e40",
  primaryCont:    "#003366",
  secContainer:   "#fed65b",
  secContainerFg: "#745c00",
  secFixed:       "#e9c349",       // gold text
  secondary:      "#735c00",
  surfContHigh:   "#dfe8ff",
  surfContLowest: "#ffffff",
  surfCont:       "#e8eeff",
  outlineVar:     "#c3c6d1",
  onSurface:      "#0d1c32",
  onSurfVar:      "#43474f",
  green:          "#2e7d32",
};

export default function HomePage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#f9f9ff", color: C.onSurface }}
    >

      {/* ── Top Nav ── */}
      <header
        className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 h-16 shadow-md"
        style={{ background: C.primary, color: "#ffffff" }}
      >
        {/* Brand */}
        <div className="flex items-center gap-4">
          <img
            alt="Kerala Police Logo"
            className="h-10 w-10 object-contain"
            src="https://lh3.googleusercontent.com/aida/ADBb0ugaXps9Q2RB5JyTNAQmEK3Uv2VauFOi7MCAoRHg9cZ8_wTlHjeerduV5lQ_xkmSm_gSdUevuLs1bt7vgQit1YuQjRuBQrAYOzGBE0gedAQg54XDp6gumlUwqqR2p2xtLxLM2SDL8tzRF6ddVR2w3AcGAq8OT2ffq53vbOLICwbG2PHZrg5EzyLHBcIDPULRauHApkzzjdGOknA38mF11JKpbQPknMcLJy0lFcCTVubqUm_2-2hApF7YeS0"
          />
          <span className="text-lg sm:text-xl font-bold tracking-tight" style={{ color: C.secFixed }}>THUNA CDMS</span>
        </div>

        {/* Center nav */}
        <nav className="hidden md:flex gap-8 text-sm">
          {["Dashboard", "Analytics", "Directory"].map((l) => (
            <a key={l} href="#" className="transition-colors" style={{ color: "rgba(255,255,255,0.8)" }}
              onMouseOver={(e) => ((e.target as HTMLElement).style.color = "#fff")}
              onMouseOut={(e)  => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.8)")}
            >{l}</a>
          ))}
          <a href="#" style={{ color: C.secFixed, borderBottom: `2px solid ${C.secFixed}`, paddingBottom: 4 }}>Help</a>
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined cursor-pointer p-2 rounded-full hover:bg-white/10 transition-colors">notifications</span>
          <span className="material-symbols-outlined cursor-pointer p-2 rounded-full hover:bg-white/10 transition-colors">settings</span>

          {/* Officer Login */}
          <a
            href={LOGIN_URL}
            className="px-4 py-1.5 rounded-full text-sm font-semibold transition-colors hover:bg-white/10"
            style={{ border: `1px solid ${C.secFixed}`, color: C.secFixed }}
          >
            Officer Login
          </a>

          <div className="flex items-center gap-2 pl-4" style={{ borderLeft: "1px solid rgba(255,255,255,0.2)" }}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
            <span className="text-xs hidden lg:inline">Guest Officer</span>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-grow pt-24 pb-16 px-4 md:px-8 mx-auto w-full" style={{ maxWidth: 1280 }}>

        {/* Hero */}
        <section className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full mb-6"
            style={{ background: C.secContainer, color: C.secContainerFg }}
          >
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
            <span className="text-xs font-medium tracking-widest uppercase">Secure Gateway Access</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4" style={{ color: C.primary, letterSpacing: "-0.02em" }}>
            Officer Command Center
          </h1>

          <p className="text-sm sm:text-base leading-relaxed max-w-2xl mx-auto" style={{ color: C.onSurfVar }}>
            Welcome to the THUNA Intelligence Network. Please confirm your department to proceed to secure verification.
          </p>

          <div className="mt-8 flex justify-center">
            <a
              href={LOGIN_URL}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold shadow-lg transition-colors group"
              style={{ background: C.secContainer, color: C.secContainerFg }}
              onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.background = C.secondary)}
              onMouseOut={(e)  => ((e.currentTarget as HTMLElement).style.background = C.secContainer)}
            >
              <span>Login to Dashboard</span>
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
            </a>
          </div>
        </section>

        {/* 12-col grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* Department cards — 8 cols */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Law & Order */}
            <DeptCard
              href={LOGIN_URL}
              icon="local_police"
              title="Law & Order"
              desc="General policing, district operations, and field personnel management."
            />

            {/* Intelligence & Vigilance */}
            <DeptCard
              href={LOGIN_URL}
              icon="visibility"
              title="Intelligence & Vigilance"
              desc="Sensitive data analysis, surveillance coordination, and internal affairs."
            />

            {/* Technical & Forensic — full width */}
            <a
              href={LOGIN_URL}
              className="md:col-span-2 group relative overflow-hidden rounded-xl p-8 flex flex-col md:flex-row md:items-center justify-between cursor-pointer transition-all shadow-sm"
              style={{
                background: C.surfContHigh,
                border: `1px solid ${C.outlineVar}`,
                minHeight: 200,
              }}
              onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.borderColor = C.secondary)}
              onMouseOut={(e)  => ((e.currentTarget as HTMLElement).style.borderColor = C.outlineVar)}
            >
              <span
                className="absolute top-0 right-0 p-4 material-symbols-outlined hidden md:block pointer-events-none select-none"
                style={{ fontSize: 180, opacity: 0.05, lineHeight: 1 }}
              >biotech</span>
              <div className="md:w-2/3">
                <div className="h-12 w-12 rounded-lg flex items-center justify-center mb-6" style={{ background: C.primaryCont }}>
                  <span className="material-symbols-outlined" style={{ color: C.secFixed }}>biotech</span>
                </div>
                <h3 className="font-semibold text-xl mb-2" style={{ color: C.primary }}>Technical &amp; Forensic</h3>
                <p className="text-sm" style={{ color: C.onSurfVar }}>Cybercrime units, DNA analysis, and digital forensics laboratories.</p>
              </div>
              <div className="mt-8 md:mt-0 shrink-0">
                <span
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold"
                  style={{ background: C.secContainer, color: C.secContainerFg }}
                >
                  Proceed to Login →
                </span>
              </div>
            </a>
          </div>

          {/* Security Briefing Sidebar — 4 cols */}
          <aside className="lg:col-span-4">
            <div
              className="rounded-xl p-6 h-full shadow-sm"
              style={{ background: C.surfContLowest, border: `1px solid ${C.outlineVar}` }}
            >
              {/* Header */}
              <div className="flex items-center gap-2 mb-6 pb-4" style={{ borderBottom: `1px solid ${C.outlineVar}` }}>
                <span className="material-symbols-outlined font-bold" style={{ color: C.secondary }}>security</span>
                <h4 className="text-sm font-semibold uppercase tracking-wider" style={{ color: C.primary }}>Security Protocols</h4>
              </div>

              {/* Checklist */}
              <ul className="space-y-6">
                {[
                  { title: "End-to-End Encryption Active", desc: "AES-256 bit tunnel established for this session data." },
                  { title: "Terminal ID Logged",           desc: "Your hardware signature (TH-992-K) is verified for access." },
                  { title: "Geofencing Enabled",           desc: "Verified location within authorized state jurisdiction." },
                ].map((item) => (
                  <li key={item.title} className="flex gap-4">
                    <span
                      className="material-symbols-outlined text-[20px] shrink-0 mt-0.5"
                      style={{ color: C.green, fontVariationSettings: "'FILL' 1" }}
                    >check_circle</span>
                    <div>
                      <p className="text-sm font-semibold mb-1" style={{ color: C.onSurface }}>{item.title}</p>
                      <p className="text-xs leading-4" style={{ color: C.onSurfVar }}>{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Quote */}
              <div
                className="mt-12 p-4 rounded-lg"
                style={{ background: C.surfCont, borderLeft: `4px solid ${C.secondary}` }}
              >
                <p className="text-xs italic mb-2 leading-4" style={{ color: C.onSurfVar }}>
                  &ldquo;Unauthorized access attempts are strictly monitored and reported to the Cyber Intelligence Wing immediately.&rdquo;
                </p>
                <p className="text-[11px] font-bold" style={{ color: C.primary }}>— Protocol 09-CDMS</p>
              </div>

              {/* Kerala map */}
              <div
                className="mt-8 rounded-lg overflow-hidden relative"
                style={{ border: `1px solid ${C.outlineVar}`, aspectRatio: "16/9" }}
              >
                <div
                  className="absolute inset-0 flex items-center justify-center z-10"
                  style={{ background: "rgba(0,30,64,0.2)" }}
                >
                  <span className="material-symbols-outlined text-white" style={{ fontSize: 48 }}>location_on</span>
                </div>
                <img
                  className="w-full h-full object-cover"
                  style={{ filter: "grayscale(1)", opacity: 0.5 }}
                  alt="Kerala satellite map"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuClHfknmpNhGEg5sS-HkCttVFBrPQF0HNEAhb_GhKNLIs86g0_scFHIKHdET-ij9eTNZ2NgnXoIGxgHo2985Hlq__BKrBUndxVJpqaFcZsIAdXC3pBstqxZm6LB0IrRwRgB9XypXnJh3GXDQrjnLizXWKSvPvX4bQ0snqnnlHab7ZsoXLcDOohaP6pLlTATELVMmLSUK2S_zimKVyJBBfrZTUQ2W2O2PMWrBoMJBIdybN7s8S4kVvTwlIsv5su8v-EoN1x9rIgIHIs"
                />
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer
        className="w-full py-4 px-8 flex flex-col md:flex-row justify-between items-center gap-4"
        style={{ background: C.primary, color: "#ffffff", borderTop: `1px solid ${C.outlineVar}` }}
      >
        <div className="flex flex-col md:flex-row items-center gap-4">
          <span className="font-bold">Kerala Police</span>
          <span className="text-xs" style={{ opacity: 0.7 }}>
            © {new Date().getFullYear()} THUNA CDMS. Secured with 256-bit AES Encryption.
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-xs">
          {["Privacy Policy", "Terms of Service", "Security Certification", "Contact Admin"].map((l) => (
            <a
              key={l} href="#"
              className="transition-colors"
              style={{ color: "rgba(255,255,255,0.7)" }}
              onMouseOver={(e) => ((e.target as HTMLElement).style.color = C.secFixed)}
              onMouseOut={(e)  => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.7)")}
            >{l}</a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div
            className="px-2 py-1 rounded text-[10px] font-bold"
            style={{ background: C.secondary, color: C.secContainer }}
          >
            LEVEL 4 SECURE
          </div>
          <span className="material-symbols-outlined text-[20px]">shield_with_heart</span>
        </div>
      </footer>
    </div>
  );
}

// ── Department card component ──────────────────────────────────────────────────
function DeptCard({ href, icon, title, desc }: {
  href: string; icon: string; title: string; desc: string;
}) {
  const C_local = {
    surfContHigh: "#dfe8ff",
    outlineVar:   "#c3c6d1",
    secondary:    "#735c00",
    primaryCont:  "#003366",
    secFixed:     "#e9c349",
    primary:      "#001e40",
    onSurfVar:    "#43474f",
  };
  return (
    <a
      href={href}
      className="group relative overflow-hidden rounded-xl p-8 flex flex-col justify-between cursor-pointer shadow-sm transition-all"
      style={{
        background: C_local.surfContHigh,
        border: `1px solid ${C_local.outlineVar}`,
        minHeight: 280,
      }}
      onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.borderColor = C_local.secondary)}
      onMouseOut={(e)  => ((e.currentTarget as HTMLElement).style.borderColor = C_local.outlineVar)}
    >
      <span
        className="absolute top-0 right-0 p-4 material-symbols-outlined pointer-events-none select-none group-hover:opacity-[0.20] transition-opacity"
        style={{ fontSize: 120, opacity: 0.10, lineHeight: 1, color: C_local.primary }}
      >{icon}</span>
      <div>
        <div
          className="h-12 w-12 rounded-lg flex items-center justify-center mb-6"
          style={{ background: C_local.primaryCont }}
        >
          <span className="material-symbols-outlined" style={{ color: C_local.secFixed }}>{icon}</span>
        </div>
        <h3 className="font-semibold text-lg sm:text-xl mb-2" style={{ color: C_local.primary }}>{title}</h3>
        <p className="text-sm leading-relaxed" style={{ color: C_local.onSurfVar }}>{desc}</p>
      </div>
    </a>
  );
}

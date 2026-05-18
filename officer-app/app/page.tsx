"use client";

import Link from "next/link";
import { ShieldCheck, Lock, MapPin, ArrowRight } from "lucide-react";

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
      className="min-h-screen flex flex-col font-sans"
      style={{ background: "#f8f9fc", color: C.onSurface }}
    >
      {/* ── Minimal Top Nav ── */}
      <header
        className="w-full z-50 flex justify-center sm:justify-start items-center px-8 h-20 shadow-sm border-b"
        style={{ background: C.primary, borderColor: "rgba(255,255,255,0.1)" }}
      >
        <div className="flex items-center gap-4">
          <img
            alt="Kerala Police Logo"
            className="h-12 w-12 object-contain"
            src="https://lh3.googleusercontent.com/aida/ADBb0ugaXps9Q2RB5JyTNAQmEK3Uv2VauFOi7MCAoRHg9cZ8_wTlHjeerduV5lQ_xkmSm_gSdUevuLs1bt7vgQit1YuQjRuBQrAYOzGBE0gedAQg54XDp6gumlUwqqR2p2xtLxLM2SDL8tzRF6ddVR2w3AcGAq8OT2ffq53vbOLICwbG2PHZrg5EzyLHBcIDPULRauHApkzzjdGOknA38mF11JKpbQPknMcLJy0lFcCTVubqUm_2-2hApF7YeS0"
          />
          <span className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: C.secFixed }}>THUNA CDMS</span>
        </div>
      </header>

      {/* ── Main Hero Section ── */}
      <main className="flex-grow flex flex-col items-center justify-center relative px-6 py-12 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-[10%] left-[-5%] w-96 h-96 bg-blue-900/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="z-10 max-w-3xl w-full text-center flex flex-col items-center mt-8">
          
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8 shadow-sm backdrop-blur-sm border"
            style={{ 
              background: "rgba(254, 214, 91, 0.15)", 
              borderColor: "rgba(254, 214, 91, 0.3)",
              color: C.secContainerFg 
            }}
          >
            <ShieldCheck className="w-5 h-5" />
            <span className="text-sm font-bold tracking-widest uppercase">Secure Gateway Access</span>
          </div>

          <h1 
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight mb-6 tracking-tight" 
            style={{ color: C.primary }}
          >
            Officer Command Center
          </h1>

          <p className="text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-12" style={{ color: C.onSurfVar }}>
            Welcome to the THUNA Intelligence Network. Access is strictly restricted to authorized Kerala Police personnel. 
            All activities are monitored and logged.
          </p>

          <Link
            href={LOGIN_URL}
            className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-xl text-lg font-bold shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl overflow-hidden"
            style={{ background: C.primary, color: C.secFixed }}
          >
            <div className="absolute inset-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Lock className="w-5 h-5" />
            <span>Secure Login</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>

        </div>

        {/* Security Features Bottom Row */}
        <div className="w-full max-w-5xl mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 z-10">
          {[
            { icon: Lock, title: "End-to-End Encryption", desc: "AES-256 bit tunnel established for this session." },
            { icon: ShieldCheck, title: "Terminal ID Logged", desc: "Hardware signatures are verified for access." },
            { icon: MapPin, title: "Geofencing Enabled", desc: "Verified location within authorized state jurisdiction." },
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="flex items-start gap-4 p-6 rounded-2xl bg-white border shadow-sm hover:shadow-md transition-shadow"
              style={{ borderColor: C.outlineVar }}
            >
              <div className="p-3 rounded-lg" style={{ background: "rgba(0,30,64,0.05)", color: C.primary }}>
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold mb-1" style={{ color: C.primary }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: C.onSurfVar }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ── Minimal Footer ── */}
      <footer
        className="w-full py-6 px-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t"
        style={{ background: C.surfContLowest, borderColor: C.outlineVar }}
      >
        <div className="flex items-center gap-3">
          <img
            alt="Kerala Police Logo"
            className="h-8 w-8 object-contain opacity-80"
            src="https://lh3.googleusercontent.com/aida/ADBb0ugaXps9Q2RB5JyTNAQmEK3Uv2VauFOi7MCAoRHg9cZ8_wTlHjeerduV5lQ_xkmSm_gSdUevuLs1bt7vgQit1YuQjRuBQrAYOzGBE0gedAQg54XDp6gumlUwqqR2p2xtLxLM2SDL8tzRF6ddVR2w3AcGAq8OT2ffq53vbOLICwbG2PHZrg5EzyLHBcIDPULRauHApkzzjdGOknA38mF11JKpbQPknMcLJy0lFcCTVubqUm_2-2hApF7YeS0"
          />
          <span className="text-sm font-semibold" style={{ color: C.primary }}>
            Kerala Police © {new Date().getFullYear()}
          </span>
        </div>
        <div className="text-xs font-bold tracking-widest text-red-700/80">
          UNAUTHORIZED ACCESS IS PROHIBITED
        </div>
      </footer>
    </div>
  );
}

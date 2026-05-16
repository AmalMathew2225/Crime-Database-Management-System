import Link from "next/link";
import { mockDashboardData } from "@/lib/mock-data";

async function getStats() {
  const { firs } = mockDashboardData;
  return {
    total: firs.length,
    active: firs.filter((f) => f.status !== "Closed").length,
    closed: firs.filter((f) => f.status === "Closed").length,
    chargeSheeted: firs.filter((f) => f.status === "Charge Sheet Filed").length,
  };
}

export default async function LandingPage() {
  await getStats(); // preload stats (used in dashboard)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; }
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          font-family: 'Material Symbols Outlined';
          font-style: normal;
          display: inline-block;
          line-height: 1;
          vertical-align: middle;
        }
        .glass-panel {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .dept-card {
          position: relative;
          overflow: hidden;
          background: #dfe8ff;
          border-radius: 12px;
          padding: 32px;
          border: 1px solid #c3c6d1;
          transition: all 0.25s;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 280px;
          cursor: pointer;
          text-decoration: none;
        }
        .dept-card:hover { border-color: #735c00; box-shadow: 0 10px 30px rgba(0,0,0,0.1); transform: translateY(-2px); }
        .dept-card .bg-icon {
          position: absolute; top: 0; right: 0;
          padding: 16px; opacity: 0.1; pointer-events: none;
          font-size: 120px; line-height: 1;
          transition: opacity 0.25s;
        }
        .dept-card:hover .bg-icon { opacity: 0.2; }
        .dept-icon-wrap {
          width: 48px; height: 48px;
          background: #003366;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 24px;
          color: #ffe088;
        }
        .dept-card h3 { font-size: 20px; font-weight: 600; color: #001e40; margin-bottom: 8px; }
        .dept-card p  { font-size: 14px; color: #43474f; line-height: 20px; }
        .sidebar-card {
          background: #ffffff;
          border: 1px solid #c3c6d1;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        }
        .check-icon { color: #2e7d32; font-size: 20px; }
        .nav-link { color: rgba(255,255,255,0.8); text-decoration: none; font-size: 14px; transition: color 0.2s; }
        .nav-link:hover { color: #ffe088; }
        .nav-link.active { color: #ffe088; border-bottom: 2px solid #ffe088; padding-bottom: 4px; }
      `}</style>

      <div style={{ background: "#f9f9ff", minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Inter', sans-serif" }}>

        {/* Top Nav */}
        <header style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 32px", height: 64,
          background: "#001e40", boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <img
              alt="Kerala Police Logo"
              src="https://lh3.googleusercontent.com/aida/ADBb0ugaXps9Q2RB5JyTNAQmEK3Uv2VauFOi7MCAoRHg9cZ8_wTlHjeerduV5lQ_xkmSm_gSdUevuLs1bt7vgQit1YuQjRuBQrAYOzGBE0gedAQg54XDp6gumlUwqqR2p2xtLxLM2SDL8tzRF6ddVR2w3AcGAq8OT2ffq53vbOLICwbG2PHZrg5EzyLHBcIDPULRauHApkzzjdGOknA38mF11JKpbQPknMcLJy0lFcCTVubqUm_2-2hApF7YeS0"
              style={{ height: 40, width: 40, objectFit: "contain" }}
            />
            <span style={{ fontSize: 24, fontWeight: 600, color: "#ffe088" }}>THUNA CDMS</span>
          </div>
          <nav style={{ display: "flex", gap: 32, alignItems: "center" }}>
            <a className="nav-link" href="/dashboard">Dashboard</a>
            <a className="nav-link" href="/dashboard/cases">Cases</a>
            <a className="nav-link" href="/dashboard/intel">Analytics</a>
            <a className="nav-link active" href="#">Access</a>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 16, color: "white" }}>
            <span className="material-symbols-outlined" style={{ cursor: "pointer", padding: 8, borderRadius: "50%" }}>notifications</span>
            <span className="material-symbols-outlined" style={{ cursor: "pointer", padding: 8, borderRadius: "50%" }}>settings</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 16, borderLeft: "1px solid rgba(255,255,255,0.2)" }}>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
              <span style={{ fontSize: 12, letterSpacing: "0.02em" }}>Guest Officer</span>
            </div>
          </div>
        </header>

        {/* Main */}
        <main style={{ flexGrow: 1, paddingTop: 96, paddingBottom: 64, paddingLeft: 32, paddingRight: 32, maxWidth: 1280, margin: "0 auto", width: "100%" }}>

          {/* Hero */}
          <section style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "4px 16px", borderRadius: 9999,
              background: "#fed65b", color: "#745c00",
              marginBottom: 24,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" }}>Secure Gateway Access</span>
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: "#001e40", marginBottom: 16, letterSpacing: "-0.02em" }}>
              Officer Command Center
            </h2>
            <p style={{ fontSize: 16, color: "#43474f", maxWidth: 640, margin: "0 auto", lineHeight: "24px" }}>
              Welcome to the THUNA Intelligence Network. Please confirm your department to proceed to secure verification.
            </p>
          </section>

          {/* Bento Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 380px", gap: 16 }}>

            {/* Department cards — left 3 cols */}
            <div style={{ gridColumn: "1 / 4", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

              {/* Law & Order */}
              <Link href="/login" className="dept-card" style={{ display: "flex", flexDirection: "column" }}>
                <span className="material-symbols-outlined bg-icon">local_police</span>
                <div>
                  <div className="dept-icon-wrap">
                    <span className="material-symbols-outlined">local_police</span>
                  </div>
                  <h3>Law &amp; Order</h3>
                  <p>General policing, district operations, and field personnel management.</p>
                </div>
              </Link>

              {/* Intelligence & Vigilance */}
              <Link href="/login" className="dept-card" style={{ display: "flex", flexDirection: "column" }}>
                <span className="material-symbols-outlined bg-icon">visibility</span>
                <div>
                  <div className="dept-icon-wrap">
                    <span className="material-symbols-outlined">visibility</span>
                  </div>
                  <h3>Intelligence &amp; Vigilance</h3>
                  <p>Sensitive data analysis, surveillance coordination, and internal affairs.</p>
                </div>
              </Link>

              {/* Technical & Forensic — spans 2 cols */}
              <Link href="/login" className="dept-card" style={{ gridColumn: "span 2", flexDirection: "row", alignItems: "center", justifyContent: "space-between", minHeight: 200 }}>
                <span className="material-symbols-outlined bg-icon" style={{ fontSize: 180 }}>biotech</span>
                <div style={{ maxWidth: "60%" }}>
                  <div className="dept-icon-wrap">
                    <span className="material-symbols-outlined">biotech</span>
                  </div>
                  <h3>Technical &amp; Forensic</h3>
                  <p>Cybercrime units, DNA analysis, and digital forensics laboratories.</p>
                </div>
              </Link>
            </div>

            {/* Security Briefing Sidebar */}
            <aside className="sidebar-card" style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #c3c6d1" }}>
                <span className="material-symbols-outlined" style={{ color: "#735c00", fontWeight: 700 }}>security</span>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: "#001e40", textTransform: "uppercase", letterSpacing: "0.08em" }}>Security Protocols</h4>
              </div>
              <ul style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {[
                  { title: "End-to-End Encryption Active", desc: "AES-256 bit tunnel established for this session data." },
                  { title: "Terminal ID Logged", desc: "Your hardware signature (TH-992-K) is verified for access." },
                  { title: "Geofencing Enabled", desc: "Verified location within authorized state jurisdiction." },
                ].map((item) => (
                  <li key={item.title} style={{ display: "flex", gap: 16 }}>
                    <span className="material-symbols-outlined check-icon" style={{ flexShrink: 0, marginTop: 2, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "#0d1c32", marginBottom: 4 }}>{item.title}</p>
                      <p style={{ fontSize: 12, color: "#43474f", lineHeight: "16px" }}>{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div style={{
                marginTop: 32, padding: 16,
                background: "#e8eeff", borderRadius: 8,
                borderLeft: "4px solid #735c00",
              }}>
                <p style={{ fontSize: 12, color: "#43474f", fontStyle: "italic", marginBottom: 8, lineHeight: "16px" }}>
                  "Unauthorized access attempts are strictly monitored and reported to the Cyber Intelligence Wing immediately."
                </p>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#001e40", letterSpacing: "0.03em" }}>— Protocol 09-CDMS</p>
              </div>
              <div style={{ marginTop: 24, borderRadius: 8, overflow: "hidden", border: "1px solid #c3c6d1", aspectRatio: "16/9", position: "relative" }}>
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,30,64,0.2)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
                  <span className="material-symbols-outlined" style={{ color: "white", fontSize: 48 }}>location_on</span>
                </div>
                <img
                  style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1)", opacity: 0.5 }}
                  alt="Kerala satellite map"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuClHfknmpNhGEg5sS-HkCttVFBrPQF0HNEAhb_GhKNLIs86g0_scFHIKHdET-ij9eTNZ2NgnXoIGxgHo2985Hlq__BKrBUndxVJpqaFcZsIAdXC3pBstqxZm6LB0IrRwRgB9XypXnJh3GXDQrjnLizXWKSvPvX4bQ0snqnnlHab7ZsoXLcDOohaP6pLlTATELVMmLSUK2S_zimKVyJBBfrZTUQ2W2O2PMWrBoMJBIdybN7s8S4kVvTwlIsv5su8v-EoN1x9rIgIHIs"
                />
              </div>
            </aside>
          </div>
        </main>

        {/* Footer */}
        <footer style={{
          width: "100%", padding: "16px 32px",
          display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 16,
          background: "#001e40", color: "white",
          borderTop: "1px solid #c3c6d1",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <span style={{ fontWeight: 700 }}>Kerala Police</span>
            <span style={{ fontSize: 12, opacity: 0.7 }}>© {new Date().getFullYear()} THUNA CDMS. Secured with 256-bit AES Encryption.</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
            {["Privacy Policy", "Terms of Service", "Security Certification", "Contact Admin"].map((l) => (
              <a key={l} href="#" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: 12, transition: "color 0.2s" }}
                onMouseOver={(e) => (e.currentTarget.style.color = "#ffe088")}
                onMouseOut={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}>{l}</a>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ background: "#735c00", padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, color: "#003366" }}>LEVEL 4 SECURE</div>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>shield_with_heart</span>
          </div>
        </footer>
      </div>
    </>
  );
}

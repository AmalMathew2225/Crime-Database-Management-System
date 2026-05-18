"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OfficerLoginPage() {
  const [badge, setBadge] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = badge.trim().toUpperCase();
    if (!trimmed) {
      setError("Please enter your Identity Badge Number.");
      return;
    }
    if (!/^[A-Z0-9-]{4,12}$/.test(trimmed)) {
      setError("Invalid badge number. Use 4–12 letters, numbers, or hyphens (e.g. B1234 or KP-2341).");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: trimmed, password }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        setError(json?.error || "Invalid credentials.");
        return;
      }
      router.replace("/dashboard");
    } catch {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Inject Tailwind CDN + fonts inline for this page */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          font-family: 'Material Symbols Outlined';
          font-style: normal;
          display: inline-block;
          line-height: 1;
          vertical-align: middle;
        }
        .glass-panel {
          background: rgba(0, 30, 64, 0.6);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .deep-gradient {
          background: radial-gradient(circle at center, #003366 0%, #001e40 100%);
        }
        .login-input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          background: rgba(0, 30, 64, 0.4);
          border: 1px solid rgba(195, 198, 209, 0.3);
          border-radius: 0.5rem;
          color: white;
          font-size: 16px;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: all 0.2s;
        }
        .login-input::placeholder { color: rgba(121, 157, 214, 0.4); }
        .login-input:focus { ring: 2px solid #ffe088; border-color: transparent; box-shadow: 0 0 0 2px #ffe088; }
        .login-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          background: #fed65b;
          color: #241a00;
          font-weight: 600;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          border-radius: 0.5rem;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.2);
        }
        .login-btn:hover { background: #e9c349; transform: scale(1.01); }
        .login-btn:active { transform: scale(0.98); }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="deep-gradient" style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', sans-serif",
        color: "white",
        padding: "0 16px",
      }}>

        {/* Background accents */}
        <div style={{
          position: "fixed", top: "-10%", right: "-5%",
          width: 400, height: 400,
          background: "rgba(0, 51, 102, 0.2)",
          borderRadius: "50%", filter: "blur(120px)", zIndex: 0, pointerEvents: "none",
        }} />
        <div style={{
          position: "fixed", bottom: "-10%", left: "-5%",
          width: 400, height: 400,
          background: "rgba(254, 214, 91, 0.1)",
          borderRadius: "50%", filter: "blur(120px)", zIndex: 0, pointerEvents: "none",
        }} />

        <main style={{ width: "100%", maxWidth: 480, display: "flex", flexDirection: "column", alignItems: "center", gap: 32, position: "relative", zIndex: 1 }}>

          {/* Brand Header */}
          <header style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <div style={{ width: 128, height: 128, display: "flex", alignItems: "center", justifyContent: "center", padding: 8, borderRadius: 12, marginBottom: 8 }}>
              <img
                alt="Kerala Police Logo"
                src="https://lh3.googleusercontent.com/aida/ADBb0ugaXps9Q2RB5JyTNAQmEK3Uv2VauFOi7MCAoRHg9cZ8_wTlHjeerduV5lQ_xkmSm_gSdUevuLs1bt7vgQit1YuQjRuBQrAYOzGBE0gedAQg54XDp6gumlUwqqR2p2xtLxLM2SDL8tzRF6ddVR2w3AcGAq8OT2ffq53vbOLICwbG2PHZrg5EzyLHBcIDPULRauHApkzzjdGOknA38mF11JKpbQPknMcLJy0lFcCTVubqUm_2-2hApF7YeS0"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <h1 style={{ fontSize: 32, lineHeight: "40px", letterSpacing: "-0.02em", fontWeight: 700, textTransform: "uppercase" }}>Kerala Police</h1>
              <p style={{ fontSize: 14, letterSpacing: "0.15em", textTransform: "uppercase", color: "#799dd6", fontWeight: 600 }}>
                Officer Access — Crime Management System
              </p>
            </div>
          </header>

          {/* Login Card */}
          <section className="glass-panel" style={{ width: "100%", padding: 32, borderRadius: 12, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}>
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 24, fontWeight: 600, color: "white", marginBottom: 8 }}>Officer Verification</h2>
              <p style={{ fontSize: 14, color: "rgba(121, 157, 214, 0.8)", lineHeight: "20px" }}>
                Enter your badge number and password to access the officer dashboard.
              </p>
            </div>

            {error && (
              <div style={{
                marginBottom: 16,
                display: "flex", alignItems: "flex-start", gap: 8,
                background: "rgba(186, 26, 26, 0.15)", border: "1px solid rgba(186,26,26,0.4)",
                borderRadius: 8, padding: "12px 16px",
                color: "#fca5a5", fontSize: 13,
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, marginTop: 1, flexShrink: 0, fontVariationSettings: "'FILL' 1" }}>error</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label htmlFor="badge-number" style={{ fontSize: 14, fontWeight: 600, color: "#ffe088", letterSpacing: "0.01em" }}>
                  Identity Badge Number
                </label>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, paddingLeft: 16, display: "flex", alignItems: "center", pointerEvents: "none" }}>
                    <span className="material-symbols-outlined" style={{ color: "#799dd6", fontSize: 22 }}>badge</span>
                  </div>
                  <input
                    className="login-input"
                    id="badge-number"
                    name="badge-number"
                    type="text"
                    autoFocus
                    autoComplete="off"
                    placeholder="e.g. KP1234567"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value.toUpperCase())}
                  />
                </div>
                <p style={{ fontSize: 11, color: "rgba(121, 157, 214, 0.6)", letterSpacing: "0.03em" }}>
                  Format: Alphanumeric, 4–12 characters (e.g., KP1001 or KP1234567)
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label htmlFor="password" style={{ fontSize: 14, fontWeight: 600, color: "#ffe088", letterSpacing: "0.01em" }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, paddingLeft: 16, display: "flex", alignItems: "center", pointerEvents: "none" }}>
                    <span className="material-symbols-outlined" style={{ color: "#799dd6", fontSize: 22 }}>lock</span>
                  </div>
                  <input
                    className="login-input"
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="login-btn">
                {loading ? (
                  <>
                    <div className="spin" style={{ width: 16, height: 16, border: "2px solid rgba(36,26,0,0.3)", borderTopColor: "#241a00", borderRadius: "50%" }} />
                    Verifying...
                  </>
                ) : (
                  <>
                    Access Dashboard
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>
                  </>
                )}
              </button>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, paddingTop: 16, borderTop: "1px solid rgba(195, 198, 209, 0.1)" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#ffe088", fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                <p style={{ fontSize: 11, color: "rgba(121, 157, 214, 0.7)", letterSpacing: "0.03em" }}>Authorized Kerala Police Personnel Only</p>
              </div>
            </form>
          </section>

          {/* Footer */}
          <footer style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, color: "rgba(121, 157, 214, 0.6)", fontSize: 11 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>lock</span>
                256-bit AES Encryption
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, color: "rgba(121, 157, 214, 0.6)", fontSize: 11 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>gpp_maybe</span>
                End-to-End Secure
              </div>
            </div>
            <div style={{ paddingTop: 8, borderTop: "1px solid rgba(121, 157, 214, 0.1)", width: "100%", maxWidth: 300 }}>
              <p style={{ fontSize: 11, color: "rgba(121, 157, 214, 0.4)" }}>
                © {new Date().getFullYear()} Kerala Police. THUNA CDMS. Secured with 256-bit AES Encryption.
              </p>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}

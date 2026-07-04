import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import type { Session } from "@supabase/supabase-js";

type Review = {
  id: string;
  name: string;
  rating: number;
  body: string;
  created_at: string;
  approved: boolean | null;
};

const gold = "#C4A45A";
const green = "#1E3D0E";

function Stars({ n }: { n: number }) {
  return (
    <span style={{ color: gold, fontSize: "1rem" }}>
      {"★".repeat(n)}{"☆".repeat(5 - n)}
    </span>
  );
}

function LoginForm({ onLogin: _ }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: "https://mobile-massage.uk/auth-confirm.html" },
    });
    if (error) setError(error.message || "Something went wrong — please try again.");
    else setSent(true);
    setLoading(false);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 16px", border: "1px solid rgba(196,164,90,0.35)",
    borderRadius: "4px", fontSize: "1rem", background: "#fafaf7",
    color: green, outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ background: "#fff", borderRadius: "6px", padding: "48px 40px", width: "100%", maxWidth: "380px", boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <img src="/phoenix-logo.png" width={56} height={56} alt="Restore & Relax" style={{ display: "block", margin: "0 auto 16px" }} />
          <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 300, fontSize: "1.4rem", color: green, margin: 0 }}>Admin</h1>
          <p style={{ fontSize: "0.8rem", color: "#999", marginTop: "6px", letterSpacing: "2px", textTransform: "uppercase" }}>Restore & Relax</p>
        </div>
        {sent ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", color: gold, marginBottom: "16px" }}>✉</div>
            <p style={{ fontFamily: "Georgia, serif", color: green, fontSize: "1.05rem", marginBottom: "8px" }}>Check your email</p>
            <p style={{ fontSize: "0.875rem", color: "#999", lineHeight: 1.6 }}>A sign-in link has been sent to <strong>{email}</strong>. Click it to access the admin panel.</p>
            <button onClick={() => setSent(false)} style={{ marginTop: "20px", background: "none", border: "none", color: "#8B6914", cursor: "pointer", fontSize: "0.85rem", textDecoration: "underline", fontFamily: "Georgia, serif" }}>
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <p style={{ fontSize: "0.875rem", color: "#999", margin: 0, lineHeight: 1.6 }}>Enter your email and we'll send you a sign-in link — no password needed.</p>
            <input type="email" required placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
            {error && <p style={{ color: "#c0392b", fontSize: "0.9rem", margin: 0 }}>{error}</p>}
            <button
              type="submit" disabled={loading}
              style={{ background: green, color: "#fff", border: "none", padding: "13px", borderRadius: "4px", fontSize: "1rem", cursor: "pointer", fontFamily: "Georgia, serif", opacity: loading ? 0.6 : 1 }}
            >
              {loading ? "Sending…" : "Send sign-in link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "approved" | "all">("pending");
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    let q = supabase.from("reviews").select("*").order("created_at", { ascending: false });
    if (filter === "pending") q = q.not("approved", "eq", true);
    else if (filter === "approved") q = q.eq("approved", true);
    const { data } = await q;
    setReviews(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter]);

  const approve = async (id: string) => {
    setBusy(id);
    await supabase.from("reviews").update({ approved: true }).eq("id", id);
    setBusy(null);
    load();
  };

  const reject = async (id: string) => {
    if (!confirm("Delete this review permanently?")) return;
    setBusy(id);
    await supabase.from("reviews").delete().eq("id", id);
    setBusy(null);
    load();
  };

  const pendingCount = reviews.filter(r => !r.approved).length;

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: "8px 20px", borderRadius: "50px", border: "1px solid",
    borderColor: active ? green : "rgba(0,0,0,0.15)",
    background: active ? green : "transparent",
    color: active ? "#fff" : "#666",
    cursor: "pointer", fontSize: "0.85rem", fontFamily: "Georgia, serif",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f5f0e8" }}>
      {/* Header */}
      <div style={{ background: green, padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img src="/phoenix-logo.png" width={32} height={32} alt="" />
          <span style={{ color: gold, fontFamily: "Georgia, serif", fontSize: "1.1rem" }}>Restore & Relax — Reviews</span>
        </div>
        <button onClick={onLogout} style={{ background: "none", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", padding: "6px 16px", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem" }}>
          Sign out
        </button>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Filter tabs */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "28px", flexWrap: "wrap" }}>
          <button style={tabStyle(filter === "pending")} onClick={() => setFilter("pending")}>
            Pending {filter === "pending" && pendingCount > 0 ? `(${pendingCount})` : ""}
          </button>
          <button style={tabStyle(filter === "approved")} onClick={() => setFilter("approved")}>Approved</button>
          <button style={tabStyle(filter === "all")} onClick={() => setFilter("all")}>All</button>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", color: "#999", fontStyle: "italic" }}>Loading…</p>
        ) : reviews.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#999" }}>
            <p style={{ fontSize: "2rem", margin: "0 0 12px" }}>✓</p>
            <p style={{ fontFamily: "Georgia, serif" }}>No {filter === "all" ? "" : filter} reviews</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {reviews.map(r => (
              <div key={r.id} style={{ background: "#fff", borderRadius: "6px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", borderLeft: `4px solid ${r.approved ? "#4A6741" : gold}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                      <strong style={{ fontFamily: "Georgia, serif", color: green }}>{r.name}</strong>
                      <Stars n={r.rating} />
                      <span style={{ fontSize: "0.75rem", color: "#aaa" }}>
                        {new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <p style={{ color: "#5C3D1E", fontStyle: "italic", margin: 0, lineHeight: 1.6 }}>"{r.body}"</p>
                  </div>
                  {!r.approved && (
                    <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                      <button
                        onClick={() => approve(r.id)}
                        disabled={busy === r.id}
                        style={{ background: "#4A6741", color: "#fff", border: "none", padding: "8px 18px", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem", opacity: busy === r.id ? 0.5 : 1 }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => reject(r.id)}
                        disabled={busy === r.id}
                        style={{ background: "#fff", color: "#c0392b", border: "1px solid #c0392b", padding: "8px 18px", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem", opacity: busy === r.id ? 0.5 : 1 }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                  {r.approved && (
                    <span style={{ fontSize: "0.75rem", color: "#4A6741", background: "#EEF4EC", padding: "4px 12px", borderRadius: "50px", whiteSpace: "nowrap" }}>✓ Live</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (checking) return null;
  if (!session) return <LoginForm onLogin={() => supabase.auth.getSession().then(({ data }) => setSession(data.session))} />;
  return <AdminDashboard onLogout={logout} />;
}

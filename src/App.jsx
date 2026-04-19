
import { useState, useEffect, useRef, useContext, createContext, useCallback } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart
} from "recharts";

// ─── Theme Context ───────────────────────────────────────────────────────────
const ThemeContext = createContext();
const useTheme = () => useContext(ThemeContext);

// ─── App Context ─────────────────────────────────────────────────────────────
const AppContext = createContext();
const useApp = () => useContext(AppContext);

// ─── Mock Data ───────────────────────────────────────────────────────────────
const revenueData = [
  { month: "Jan", revenue: 42000, users: 1200, growth: 8 },
  { month: "Feb", revenue: 51000, users: 1450, growth: 12 },
  { month: "Mar", revenue: 47000, users: 1380, growth: -8 },
  { month: "Apr", revenue: 63000, users: 1720, growth: 34 },
  { month: "May", revenue: 71000, users: 1950, growth: 13 },
  { month: "Jun", revenue: 68000, users: 1880, growth: -4 },
  { month: "Jul", revenue: 84000, users: 2240, growth: 24 },
  { month: "Aug", revenue: 91000, users: 2490, growth: 8 },
  { month: "Sep", revenue: 88000, users: 2380, growth: -3 },
  { month: "Oct", revenue: 102000, users: 2760, growth: 16 },
  { month: "Nov", revenue: 118000, users: 3100, growth: 16 },
  { month: "Dec", revenue: 134000, users: 3480, growth: 14 },
];

const pieData = [
  { name: "Enterprise", value: 45, color: "#6366f1" },
  { name: "Pro", value: 30, color: "#8b5cf6" },
  { name: "Starter", value: 18, color: "#a78bfa" },
  { name: "Free", value: 7, color: "#c4b5fd" },
];

const users = Array.from({ length: 48 }, (_, i) => ({
  id: i + 1,
  name: ["Alex Chen", "wahabx32", "Marcus Rivera", "Priya Patel", "James Liu", "Emma Wilson", "Noah Garcia", "Olivia Martinez", "Liam Johnson", "Ava Thompson", "Ethan Davis", "Isabella Moore", "Mason Taylor", "Sophia Anderson", "Logan White", "Mia Harris"][i % 16],
  email: `user${i + 1}@company.io`,
  role: ["Admin", "Editor", "Viewer", "Developer"][i % 4],
  status: i % 7 === 0 ? "Inactive" : i % 5 === 0 ? "Pending" : "Active",
  plan: ["Enterprise", "Pro", "Starter", "Free"][i % 4],
  joined: new Date(2024, i % 12, (i % 28) + 1).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  revenue: `$${(Math.random() * 500 + 50).toFixed(0)}`,
}));

const notifications = [
  { id: 1, type: "success", title: "Payment received", desc: "Invoice #1042 paid — $2,400", time: "2m ago", read: false },
  { id: 2, type: "info", title: "New user signup", desc: "priya.patel@acme.com joined Enterprise plan", time: "14m ago", read: false },
  { id: 3, type: "warning", title: "Usage limit approaching", desc: "API usage at 87% of monthly quota", time: "1h ago", read: false },
  { id: 4, type: "error", title: "Webhook failed", desc: "3 retries failed on endpoint /api/events", time: "2h ago", read: true },
  { id: 5, type: "success", title: "Deployment complete", desc: "v2.4.1 deployed to production", time: "3h ago", read: true },
  { id: 6, type: "info", title: "Report ready", desc: "Monthly analytics report is ready to download", time: "5h ago", read: true },
  { id: 7, type: "warning", title: "Scheduled maintenance", desc: "Maintenance window: Sun 2–4 AM UTC", time: "1d ago", read: true },
];

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18, className = "" }) => {
  const icons = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    chart: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    ai: <><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/><path d="M18 2l4 4-4 4"/><path d="M22 2l-4 4"/></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    sun: <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>,
    moon: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>,
    search: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    menu: <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    chevronLeft: <polyline points="15 18 9 12 15 6"/>,
    chevronRight: <polyline points="9 18 15 12 9 6"/>,
    arrowUp: <><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></>,
    arrowDown: <><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></>,
    filter: <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></>,
    send: <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
    bot: <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M9 11V7a3 3 0 0 1 6 0v4"/><circle cx="9" cy="16" r="1"/><circle cx="15" cy="16" r="1"/></>,
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    check: <polyline points="20 6 9 17 4 12"/>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    zap: <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
    dollar: <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
    trendingUp: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {icons[name]}
    </svg>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = ({ w = "100%", h = 16, rounded = 8 }) => {
  const { dark } = useTheme();
  return <div style={{ width: w, height: h, borderRadius: rounded, background: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)", animation: "pulse 1.5s ease-in-out infinite" }} />;
};

// ─── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, change, icon, color, loading }) => {
  const { dark } = useTheme();
  const up = change >= 0;
  const colors = {
    indigo: { bg: dark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.1)", icon: "#6366f1", text: "#6366f1" },
    violet: { bg: dark ? "rgba(139,92,246,0.15)" : "rgba(139,92,246,0.1)", icon: "#8b5cf6", text: "#8b5cf6" },
    emerald: { bg: dark ? "rgba(16,185,129,0.15)" : "rgba(16,185,129,0.1)", icon: "#10b981", text: "#10b981" },
    amber: { bg: dark ? "rgba(245,158,11,0.15)" : "rgba(245,158,11,0.1)", icon: "#f59e0b", text: "#f59e0b" },
  };
  const c = colors[color];
  return (
    <div style={{
      background: dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.9)",
      border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
      borderRadius: 16,
      padding: "20px 22px",
      backdropFilter: "blur(20px)",
      transition: "all 0.2s",
      cursor: "default",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = dark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.08)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
    >
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Skeleton w={80} h={12} /><Skeleton w={120} h={28} /><Skeleton w={60} h={12} />
        </div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)", fontWeight: 500, letterSpacing: "0.02em" }}>{title}</span>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", color: c.icon }}>
              <Icon name={icon} size={17} />
            </div>
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, color: dark ? "#fff" : "#0f0f10", letterSpacing: "-0.02em", marginBottom: 8 }}>{value}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: up ? "#10b981" : "#ef4444" }}>
            <Icon name={up ? "arrowUp" : "arrowDown"} size={12} />
            <span style={{ fontWeight: 600 }}>{Math.abs(change)}%</span>
            <span style={{ color: dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)", fontWeight: 400 }}>vs last month</span>
          </div>
        </>
      )}
    </div>
  );
};

// ─── Custom Tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, dark }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: dark ? "#1e1e2e" : "#fff", border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`, borderRadius: 10, padding: "10px 14px", fontSize: 13, boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>
      <p style={{ color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)", marginBottom: 6, fontWeight: 500 }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, color: dark ? "#fff" : "#0f0f10", fontWeight: 600 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color }} />
          {p.name}: {typeof p.value === "number" && p.name === "revenue" ? `$${p.value.toLocaleString()}` : p.value}
        </div>
      ))}
    </div>
  );
};

// ─── Badge ─────────────────────────────────────────────────────────────────────
const Badge = ({ text }) => {
  const colors = {
    Active: { bg: "rgba(16,185,129,0.1)", color: "#059669" },
    Inactive: { bg: "rgba(156,163,175,0.15)", color: "#6b7280" },
    Pending: { bg: "rgba(245,158,11,0.1)", color: "#d97706" },
    Enterprise: { bg: "rgba(99,102,241,0.12)", color: "#6366f1" },
    Pro: { bg: "rgba(139,92,246,0.12)", color: "#8b5cf6" },
    Starter: { bg: "rgba(59,130,246,0.12)", color: "#3b82f6" },
    Free: { bg: "rgba(156,163,175,0.12)", color: "#6b7280" },
    Admin: { bg: "rgba(239,68,68,0.1)", color: "#ef4444" },
    Editor: { bg: "rgba(245,158,11,0.1)", color: "#d97706" },
    Viewer: { bg: "rgba(59,130,246,0.1)", color: "#3b82f6" },
    Developer: { bg: "rgba(16,185,129,0.1)", color: "#059669" },
  };
  const c = colors[text] || { bg: "rgba(0,0,0,0.07)", color: "#555" };
  return <span style={{ fontSize: 11.5, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: c.bg, color: c.color, letterSpacing: "0.01em" }}>{text}</span>;
};

// ─── Auth Pages ────────────────────────────────────────────────────────────────
const AuthPage = ({ mode, onSwitch, onAuth }) => {
  const { dark } = useTheme();
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onAuth(); }, 1200);
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px", borderRadius: 10, fontSize: 14, outline: "none", fontFamily: "inherit",
    background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
    border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
    color: dark ? "#fff" : "#0f0f10",
    transition: "border-color 0.15s",
    boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: dark ? "#0d0d14" : "#f8f8fc", padding: 20 }}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "20%", left: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: "20%", right: "10%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)", filter: "blur(40px)" }} />
      </div>
      <div style={{ width: "100%", maxWidth: 420, position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 8px 24px rgba(99,102,241,0.35)" }}>
            <Icon name="zap" size={22} style={{ color: "#fff" }} />
            <svg width={22} height={22} viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: dark ? "#fff" : "#0f0f10", margin: "0 0 6px", letterSpacing: "-0.025em" }}>
            {mode === "login" ? "Welcome back" : "Create account"}
          </h1>
          <p style={{ fontSize: 14, color: dark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)", margin: 0 }}>
            {mode === "login" ? "Sign in to your VELORIUMSX dashboard" : "Start your 14-day free trial"}
          </p>
        </div>

        <div style={{ background: dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.9)", border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`, borderRadius: 20, padding: "28px 28px", backdropFilter: "blur(24px)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {mode === "signup" && (
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)", marginBottom: 6 }}>Full name</label>
                <input style={inputStyle} placeholder="wahabx32" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} />
              </div>
            )}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)", marginBottom: 6 }}>Email address</label>
              <input style={inputStyle} type="email" placeholder="you@company.io" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} />
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)" }}>Password</label>
                {mode === "login" && <span style={{ fontSize: 12, color: "#6366f1", cursor: "pointer" }}>Forgot?</span>}
              </div>
              <div style={{ position: "relative" }}>
                <input style={{ ...inputStyle, paddingRight: 42 }} type={showPass ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} />
                <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.3)", padding: 0 }}>
                  <Icon name="eye" size={16} />
                </button>
              </div>
            </div>
            <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", cursor: loading ? "wait" : "pointer", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontSize: 14, fontWeight: 600, marginTop: 6, transition: "opacity 0.15s, transform 0.15s", opacity: loading ? 0.7 : 1, fontFamily: "inherit" }}
              onMouseEnter={e => !loading && (e.target.style.transform = "scale(1.01)")}
              onMouseLeave={e => (e.target.style.transform = "")}>
              {loading ? "Signing in…" : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </div>
          <div style={{ marginTop: 20, textAlign: "center", fontSize: 13, color: dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <span onClick={onSwitch} style={{ color: "#6366f1", cursor: "pointer", fontWeight: 500 }}>
              {mode === "login" ? "Sign up" : "Sign in"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const Sidebar = ({ page, setPage, collapsed, setCollapsed }) => {
  const { dark } = useTheme();
  const nav = [
    { id: "dashboard", label: "Overview", icon: "dashboard" },
    { id: "users", label: "Users", icon: "users" },
    { id: "analytics", label: "Analytics", icon: "chart" },
    { id: "ai", label: "AI Assistant", icon: "ai" },
    { id: "notifications", label: "Notifications", icon: "bell" },
    { id: "settings", label: "Settings", icon: "settings" },
  ];

  return (
    <div style={{
      width: collapsed ? 64 : 220, minHeight: "100vh", flexShrink: 0,
      background: dark ? "rgba(13,13,20,0.95)" : "rgba(255,255,255,0.95)",
      borderRight: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
      backdropFilter: "blur(20px)",
      transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
      display: "flex", flexDirection: "column",
      overflow: "hidden", zIndex: 40,
    }}>
      <div style={{ padding: "20px 16px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {!collapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: dark ? "#fff" : "#0f0f10", letterSpacing: "-0.02em" }}>VELORIUMSX</span>
          </div>
        )}
        {collapsed && <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
        </div>}
        {!collapsed && <button onClick={() => setCollapsed(true)} style={{ background: "none", border: "none", cursor: "pointer", color: dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)", padding: 4, borderRadius: 6, display: "flex" }}>
          <Icon name="chevronLeft" size={16} />
        </button>}
      </div>

      <nav style={{ flex: 1, padding: "8px 8px" }}>
        {nav.map(item => {
          const active = page === item.id;
          return (
            <button key={item.id} onClick={() => setPage(item.id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10, padding: collapsed ? "10px" : "10px 12px",
              justifyContent: collapsed ? "center" : "flex-start",
              borderRadius: 10, border: "none", cursor: "pointer", marginBottom: 2,
              background: active ? (dark ? "rgba(99,102,241,0.18)" : "rgba(99,102,241,0.1)") : "transparent",
              color: active ? "#6366f1" : (dark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)"),
              fontSize: 13.5, fontWeight: active ? 600 : 400, transition: "all 0.15s",
              fontFamily: "inherit",
            }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"; e.currentTarget.style.color = dark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)"; } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = dark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)"; } }}
              title={collapsed ? item.label : ""}
            >
              <Icon name={item.icon} size={18} />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.id === "notifications" && <span style={{ marginLeft: "auto", background: "#ef4444", color: "#fff", borderRadius: 20, fontSize: 10, fontWeight: 700, padding: "1px 6px" }}>3</span>}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: "12px 8px 20px" }}>
        {collapsed && <button onClick={() => setCollapsed(false)} style={{ width: "100%", display: "flex", justifyContent: "center", padding: 10, background: "none", border: "none", cursor: "pointer", color: dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)", borderRadius: 8 }}>
          <Icon name="chevronRight" size={16} />
        </button>}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: collapsed ? "10px 0" : "10px 12px", borderRadius: 10, background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)" }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12, fontWeight: 700, color: "#fff" }}>WX</div>
          {!collapsed && <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: dark ? "#fff" : "#0f0f10", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>wahabx32</div>
            <div style={{ fontSize: 11, color: dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>Admin</div>
          </div>}
        </div>
      </div>
    </div>
  );
};

// ─── Topbar ────────────────────────────────────────────────────────────────────
const Topbar = ({ page, mobileMenuOpen, setMobileMenuOpen }) => {
  const { dark, toggle } = useTheme();
  const { notifOpen, setNotifOpen } = useApp();
  const titles = { dashboard: "Overview", users: "User Management", analytics: "Analytics", ai: "AI Assistant", notifications: "Notifications", settings: "Settings" };

  return (
    <div style={{ height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", background: dark ? "rgba(13,13,20,0.8)" : "rgba(255,255,255,0.8)", borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`, backdropFilter: "blur(20px)", flexShrink: 0, gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)", display: "flex", padding: 6, borderRadius: 8 }} className="mobile-menu-btn">
          <Icon name="menu" size={18} />
        </button>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: dark ? "#fff" : "#0f0f10", margin: 0, letterSpacing: "-0.01em" }}>{titles[page]}</h2>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)", borderRadius: 10, padding: "7px 12px", border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`, flex: 1, maxWidth: 220 }}>
          <Icon name="search" size={14} style={{ color: dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }} />
          <input placeholder="Search…" style={{ background: "none", border: "none", outline: "none", fontSize: 13, color: dark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)", fontFamily: "inherit", width: "100%", minWidth: 0 }} />
        </div>
        <button onClick={toggle} style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`, background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)", transition: "all 0.15s" }}>
          <Icon name={dark ? "sun" : "moon"} size={15} />
        </button>
        <button onClick={() => setNotifOpen(!notifOpen)} style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`, background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)", position: "relative", transition: "all 0.15s" }}>
          <Icon name="bell" size={15} />
          <div style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", background: "#ef4444", border: `2px solid ${dark ? "#0d0d14" : "#fff"}` }} />
        </button>
      </div>
    </div>
  );
};

// ─── Notifications Panel ──────────────────────────────────────────────────────
const NotifPanel = () => {
  const { dark } = useTheme();
  const { notifOpen, setNotifOpen } = useApp();
  const [notifs, setNotifs] = useState(notifications);
  if (!notifOpen) return null;
  const typeStyle = { success: "#10b981", info: "#6366f1", warning: "#f59e0b", error: "#ef4444" };
  return (
    <>
      <div onClick={() => setNotifOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 49 }} />
      <div style={{ position: "fixed", top: 68, right: 16, width: 360, maxHeight: "80vh", zIndex: 50, background: dark ? "#1a1a26" : "#fff", border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`, borderRadius: 16, boxShadow: dark ? "0 20px 60px rgba(0,0,0,0.5)" : "0 20px 60px rgba(0,0,0,0.12)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 18px", borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: dark ? "#fff" : "#0f0f10" }}>Notifications</span>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: "#ef4444", color: "#fff" }}>{notifs.filter(n => !n.read).length}</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setNotifs(notifs.map(n => ({ ...n, read: true })))} style={{ fontSize: 12, background: "none", border: "none", cursor: "pointer", color: "#6366f1", fontFamily: "inherit" }}>Mark all read</button>
            <button onClick={() => setNotifOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)", display: "flex", padding: 2 }}>
              <Icon name="x" size={16} />
            </button>
          </div>
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          {notifs.map(n => (
            <div key={n.id} onClick={() => setNotifs(notifs.map(x => x.id === n.id ? { ...x, read: true } : x))} style={{ padding: "13px 18px", borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`, cursor: "pointer", background: !n.read ? (dark ? "rgba(99,102,241,0.06)" : "rgba(99,102,241,0.04)") : "transparent", transition: "background 0.15s", display: "flex", gap: 12, alignItems: "flex-start" }}
              onMouseEnter={e => e.currentTarget.style.background = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)"}
              onMouseLeave={e => e.currentTarget.style.background = !n.read ? (dark ? "rgba(99,102,241,0.06)" : "rgba(99,102,241,0.04)") : "transparent"}
            >
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: typeStyle[n.type], marginTop: 5, flexShrink: 0, opacity: n.read ? 0.3 : 1 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: dark ? "#fff" : "#0f0f10", marginBottom: 2 }}>{n.title}</div>
                <div style={{ fontSize: 12, color: dark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)", marginBottom: 4, lineHeight: 1.4 }}>{n.desc}</div>
                <div style={{ fontSize: 11, color: dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.3)" }}>{n.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

// ─── Dashboard Page ────────────────────────────────────────────────────────────
const DashboardPage = () => {
  const { dark } = useTheme();
  const [loading, setLoading] = useState(true);
  useEffect(() => { setTimeout(() => setLoading(false), 1200); }, []);
  const gridColor = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const axisColor = dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div className="stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
        <StatCard title="Total Revenue" value="$1.04M" change={14.2} icon="dollar" color="indigo" loading={loading} />
        <StatCard title="Active Users" value="3,480" change={8.7} icon="users" color="violet" loading={loading} />
        <StatCard title="MRR Growth" value="+18.4%" change={3.1} icon="trendingUp" color="emerald" loading={loading} />
        <StatCard title="Avg. Session" value="4m 32s" change={-2.4} icon="zap" color="amber" loading={loading} />
      </div>

      <div className="chart-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        <div style={{ background: dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.9)", border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`, borderRadius: 16, padding: "22px 22px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: dark ? "#fff" : "#0f0f10" }}>Revenue over time</div>
              <div style={{ fontSize: 12, color: dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)", marginTop: 2 }}>12 months · 2024</div>
            </div>
            <select style={{ fontSize: 12, background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`, borderRadius: 8, padding: "5px 10px", color: dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)", outline: "none", fontFamily: "inherit", cursor: "pointer" }}>
              <option>2024</option><option>2023</option>
            </select>
          </div>
          {loading ? <Skeleton h={200} rounded={12} /> : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
                <Tooltip content={<CustomTooltip dark={dark} />} />
                <Area type="monotone" dataKey="revenue" name="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#revGrad)" dot={false} activeDot={{ r: 4, fill: "#6366f1" }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div style={{ background: dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.9)", border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`, borderRadius: 16, padding: "22px" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: dark ? "#fff" : "#0f0f10", marginBottom: 4 }}>Plan distribution</div>
          <div style={{ fontSize: 12, color: dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)", marginBottom: 16 }}>By account type</div>
          {loading ? <Skeleton h={160} rounded={12} /> : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v}%`, ""]} contentStyle={{ background: dark ? "#1e1e2e" : "#fff", border: "none", borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                {pieData.map(d => (
                  <div key={d.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color }} />
                      <span style={{ fontSize: 12, color: dark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.5)" }}>{d.name}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: dark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.7)" }}>{d.value}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ background: dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.9)", border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`, borderRadius: 16, padding: "22px 22px 16px" }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: dark ? "#fff" : "#0f0f10", marginBottom: 4 }}>Monthly signups</div>
        <div style={{ fontSize: 12, color: dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)", marginBottom: 20 }}>New users per month</div>
        {loading ? <Skeleton h={160} rounded={12} /> : (
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={revenueData} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip dark={dark} />} />
              <Bar dataKey="users" name="users" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

// ─── Users Page ────────────────────────────────────────────────────────────────
const UsersPage = () => {
  const { dark } = useTheme();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filtered = users.filter(u =>
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())) &&
    (roleFilter === "All" || u.role === roleFilter) &&
    (statusFilter === "All" || u.status === statusFilter)
  );
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const inputStyle = { background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)", border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`, borderRadius: 9, padding: "8px 12px", color: dark ? "#fff" : "#0f0f10", fontSize: 13, outline: "none", fontFamily: "inherit", cursor: "pointer" };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 180, display: "flex", alignItems: "center", gap: 8, ...inputStyle, cursor: "text" }}>
          <Icon name="search" size={14} style={{ color: dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)", flexShrink: 0 }} />
          <input placeholder="Search users…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ background: "none", border: "none", outline: "none", fontSize: 13, color: dark ? "#fff" : "#0f0f10", fontFamily: "inherit", width: "100%" }} />
        </div>
        <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }} style={inputStyle}>
          {["All", "Admin", "Editor", "Viewer", "Developer"].map(r => <option key={r}>{r}</option>)}
        </select>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} style={inputStyle}>
          {["All", "Active", "Inactive", "Pending"].map(s => <option key={s}>{s}</option>)}
        </select>
        <button style={{ ...inputStyle, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", color: "#fff", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name="plus" size={14} /> Invite user
        </button>
      </div>

      <div style={{ background: dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.9)", border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`, borderRadius: 16, overflow: "hidden" }}>
        {paginated.length === 0 ? (
          <div style={{ padding: "60px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)", marginBottom: 6 }}>No users found</div>
            <div style={{ fontSize: 13, color: dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>Try adjusting your search or filters</div>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
              <thead>
                <tr style={{ background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}` }}>
                  {["User", "Role", "Status", "Plan", "Joined", "Revenue"].map(h => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11.5, fontWeight: 600, color: dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)", letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((u, i) => (
                  <tr key={u.id} style={{ borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`, transition: "background 0.1s" }}
                    onMouseEnter={e => e.currentTarget.style.background = dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.015)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: `hsl(${(u.id * 37) % 360}, 60%, 55%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11.5, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                          {u.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: dark ? "#fff" : "#0f0f10" }}>{u.name}</div>
                          <div style={{ fontSize: 11.5, color: dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}><Badge text={u.role} /></td>
                    <td style={{ padding: "12px 16px" }}><Badge text={u.status} /></td>
                    <td style={{ padding: "12px 16px" }}><Badge text={u.plan} /></td>
                    <td style={{ padding: "12px 16px", fontSize: 12.5, color: dark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)" }}>{u.joined}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: dark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.65)" }}>{u.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
          <span style={{ fontSize: 12.5, color: dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>{filtered.length} users · page {page} of {totalPages}</span>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, background: "transparent", color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)", cursor: page === 1 ? "not-allowed" : "pointer", fontSize: 12, opacity: page === 1 ? 0.4 : 1, fontFamily: "inherit" }}>Prev</button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = i + 1;
              return <button key={p} onClick={() => setPage(p)} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${page === p ? "#6366f1" : (dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)")}`, background: page === p ? "rgba(99,102,241,0.15)" : "transparent", color: page === p ? "#6366f1" : (dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)"), cursor: "pointer", fontSize: 12, fontWeight: page === p ? 600 : 400, fontFamily: "inherit" }}>{p}</button>;
            })}
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, background: "transparent", color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)", cursor: page === totalPages ? "not-allowed" : "pointer", fontSize: 12, opacity: page === totalPages ? 0.4 : 1, fontFamily: "inherit" }}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Analytics Page ────────────────────────────────────────────────────────────
const AnalyticsPage = () => {
  const { dark } = useTheme();
  const gridColor = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const axisColor = dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)";
  const card = { background: dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.9)", border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`, borderRadius: 16, padding: "22px 22px 16px" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={card}>
          <div style={{ fontSize: 14, fontWeight: 600, color: dark ? "#fff" : "#0f0f10", marginBottom: 4 }}>Revenue vs Users</div>
          <div style={{ fontSize: 12, color: dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)", marginBottom: 16 }}>Dual axis comparison</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: axisColor }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 10, fill: axisColor }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: axisColor }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip dark={dark} />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line yAxisId="left" type="monotone" dataKey="revenue" name="revenue" stroke="#6366f1" strokeWidth={2} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="users" name="users" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={card}>
          <div style={{ fontSize: 14, fontWeight: 600, color: dark ? "#fff" : "#0f0f10", marginBottom: 4 }}>Monthly growth %</div>
          <div style={{ fontSize: 12, color: dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)", marginBottom: 16 }}>MoM change rate</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: axisColor }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: axisColor }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip formatter={(v) => [`${v}%`, "Growth"]} contentStyle={{ background: dark ? "#1e1e2e" : "#fff", border: "none", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="growth" name="Growth %" fill="#8b5cf6" radius={[4, 4, 0, 0]}
                label={false}
                // Positive/negative coloring via Cell
              >
                {revenueData.map((e, i) => <Cell key={i} fill={e.growth >= 0 ? "#8b5cf6" : "#ef4444"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={card}>
        <div style={{ fontSize: 14, fontWeight: 600, color: dark ? "#fff" : "#0f0f10", marginBottom: 4 }}>Cumulative revenue</div>
        <div style={{ fontSize: 12, color: dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)", marginBottom: 16 }}>Running total across the year</div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={revenueData.map((d, i) => ({ ...d, cumulative: revenueData.slice(0, i + 1).reduce((sum, x) => sum + x.revenue, 0) }))}>
            <defs>
              <linearGradient id="cumGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: axisColor }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: axisColor }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v) => [`$${v.toLocaleString()}`, "Cumulative"]} contentStyle={{ background: dark ? "#1e1e2e" : "#fff", border: "none", borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="cumulative" stroke="#10b981" strokeWidth={2} fill="url(#cumGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ─── AI Page ──────────────────────────────────────────────────────────────────
const AIPage = () => {
  const { dark } = useTheme();
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your VELORIUMSX AI assistant. I can help you summarize data, answer questions about your dashboard, or analyze trends. What would you like to explore?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("chat");
  const [summary, setSummary] = useState("");
  const [summaryInput, setSummaryInput] = useState("");
  const [summarizing, setSummarizing] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are VELORIUMSX AI, a helpful SaaS dashboard assistant. Be concise, helpful, and professional. The dashboard shows revenue of $1.04M, 3,480 active users, and 18.4% MRR growth. You can answer questions about business metrics, data trends, and provide insights.",
          messages: newMsgs.map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "I couldn't process that request.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting right now. Please try again." }]);
    }
    setLoading(false);
  };

  const summarize = async () => {
    if (!summaryInput.trim() || summarizing) return;
    setSummarizing(true);
    setSummary("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: `Please provide a concise, professional summary of the following text in 3-5 sentences:\n\n${summaryInput}` }]
        })
      });
      const data = await res.json();
      setSummary(data.content?.[0]?.text || "Could not generate summary.");
    } catch {
      setSummary("Error connecting to AI. Please try again.");
    }
    setSummarizing(false);
  };

  const cardStyle = { background: dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.9)", border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`, borderRadius: 16, overflow: "hidden" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 8 }}>
        {["chat", "summarize"].map(m => (
          <button key={m} onClick={() => setMode(m)} style={{ padding: "8px 18px", borderRadius: 10, border: `1px solid ${mode === m ? "#6366f1" : (dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)")}`, background: mode === m ? "rgba(99,102,241,0.15)" : "transparent", color: mode === m ? "#6366f1" : (dark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)"), fontSize: 13, fontWeight: mode === m ? 600 : 400, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
            {m === "chat" ? "Chatbot" : "Text Summarizer"}
          </button>
        ))}
      </div>

      {mode === "chat" ? (
        <div style={{ ...cardStyle, display: "flex", flexDirection: "column", height: 520 }}>
          <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: 10 }}>
                {m.role === "assistant" && (
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                  </div>
                )}
                <div style={{ maxWidth: "70%", padding: "10px 14px", borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px", background: m.role === "user" ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : (dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"), color: m.role === "user" ? "#fff" : (dark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.75)"), fontSize: 13.5, lineHeight: 1.55 }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                </div>
                <div style={{ padding: "12px 16px", borderRadius: "14px 14px 14px 4px", background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", display: "flex", gap: 4, alignItems: "center" }}>
                  {[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#6366f1", animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div style={{ padding: "14px 16px", borderTop: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`, display: "flex", gap: 10 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask about your dashboard…" style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`, background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)", color: dark ? "#fff" : "#0f0f10", fontSize: 13.5, outline: "none", fontFamily: "inherit" }} />
            <button onClick={send} disabled={loading || !input.trim()} style={{ width: 40, height: 40, borderRadius: 10, border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", cursor: loading ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: !input.trim() ? 0.5 : 1 }}>
              <Icon name="send" size={15} />
            </button>
          </div>
        </div>
      ) : (
        <div style={cardStyle}>
          <div style={{ padding: 20 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)", marginBottom: 8 }}>Text to summarize</label>
            <textarea value={summaryInput} onChange={e => setSummaryInput(e.target.value)} placeholder="Paste any text here — articles, reports, meeting notes, documents…" style={{ width: "100%", minHeight: 160, padding: "12px 14px", borderRadius: 10, border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`, background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)", color: dark ? "#fff" : "#0f0f10", fontSize: 13.5, outline: "none", fontFamily: "inherit", resize: "vertical", lineHeight: 1.6, boxSizing: "border-box" }} />
            <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>{summaryInput.length} characters</span>
              <button onClick={summarize} disabled={summarizing || !summaryInput.trim()} style={{ padding: "9px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: summarizing ? "wait" : "pointer", opacity: !summaryInput.trim() ? 0.5 : 1, fontFamily: "inherit" }}>
                {summarizing ? "Summarizing…" : "Summarize"}
              </button>
            </div>
          </div>
          {(summary || summarizing) && (
            <div style={{ margin: "0 20px 20px", padding: 16, borderRadius: 12, background: dark ? "rgba(99,102,241,0.1)" : "rgba(99,102,241,0.06)", border: `1px solid ${dark ? "rgba(99,102,241,0.3)" : "rgba(99,102,241,0.15)"}` }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#6366f1", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="#6366f1" stroke="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                AI Summary
              </div>
              {summarizing ? <Skeleton h={60} rounded={8} /> : <p style={{ fontSize: 13.5, color: dark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.65)", lineHeight: 1.65, margin: 0 }}>{summary}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Settings Page ────────────────────────────────────────────────────────────
const SettingsPage = () => {
  const { dark, toggle } = useTheme();
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSMS, setNotifSMS] = useState(false);
  const [notifSlack, setNotifSlack] = useState(true);
  const [saved, setSaved] = useState(false);

  const card = { background: dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.9)", border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`, borderRadius: 16, padding: "22px" };
  const inputStyle = { width: "100%", padding: "10px 13px", borderRadius: 9, border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.09)"}`, background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)", color: dark ? "#fff" : "#0f0f10", fontSize: 13.5, outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
  const label = { fontSize: 12.5, fontWeight: 600, color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)", marginBottom: 5, display: "block", letterSpacing: "0.01em" };
  const Toggle = ({ on, set }) => (
    <div onClick={() => set(!on)} style={{ width: 42, height: 24, borderRadius: 12, background: on ? "#6366f1" : (dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"), cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: on ? 21 : 3, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 640 }}>
      <div style={card}>
        <div style={{ fontSize: 14, fontWeight: 600, color: dark ? "#fff" : "#0f0f10", marginBottom: 18 }}>Profile</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "#fff" }}>WX</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: dark ? "#fff" : "#0f0f10" }}>wahabx32</div>
            <div style={{ fontSize: 12.5, color: dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", marginBottom: 6 }}>wahabx32@veloriumsx.io · Admin</div>
            <button style={{ fontSize: 12, padding: "4px 12px", borderRadius: 7, border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.09)"}`, background: "transparent", color: dark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.45)", cursor: "pointer", fontFamily: "inherit" }}>Change photo</button>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div><span style={label}>First name</span><input style={inputStyle} defaultValue="Sarah" /></div>
          <div><span style={label}>Last name</span><input style={inputStyle} defaultValue="Kim" /></div>
          <div style={{ gridColumn: "1/-1" }}><span style={label}>Email</span><input style={inputStyle} defaultValue="wahabx32@veloriumsx.io" /></div>
          <div style={{ gridColumn: "1/-1" }}><span style={label}>Company</span><input style={inputStyle} defaultValue="VELORIUMSX" /></div>
        </div>
      </div>

      <div style={card}>
        <div style={{ fontSize: 14, fontWeight: 600, color: dark ? "#fff" : "#0f0f10", marginBottom: 18 }}>Preferences</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 500, color: dark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.75)" }}>Dark mode</div>
              <div style={{ fontSize: 12, color: dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)", marginTop: 2 }}>Switch between light and dark theme</div>
            </div>
            <Toggle on={dark} set={toggle} />
          </div>
          {[["Email notifications", "Receive updates via email", notifEmail, setNotifEmail], ["SMS alerts", "Get critical alerts via SMS", notifSMS, setNotifSMS], ["Slack integration", "Send notifications to Slack", notifSlack, setNotifSlack]].map(([t, d, on, set]) => (
            <div key={t} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 500, color: dark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.75)" }}>{t}</div>
                <div style={{ fontSize: 12, color: dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)", marginTop: 2 }}>{d}</div>
              </div>
              <Toggle on={on} set={set} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }} style={{ padding: "11px 28px", borderRadius: 10, border: "none", background: saved ? "#10b981" : "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 7, transition: "all 0.2s" }}>
          {saved && <Icon name="check" size={15} />}
          {saved ? "Changes saved!" : "Save changes"}
        </button>
      </div>
    </div>
  );
};

// ─── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const pageComponents = { dashboard: <DashboardPage />, users: <UsersPage />, analytics: <AnalyticsPage />, ai: <AIPage />, notifications: <NotifPanel standalone />, settings: <SettingsPage /> };

  const bg = dark ? "#0d0d14" : "#f5f5fa";

  return (
    <ThemeContext.Provider value={{ dark, toggle: () => setDark(d => !d) }}>
      <AppContext.Provider value={{ notifOpen, setNotifOpen }}>
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; width: 100%; overflow-x: hidden; }
          @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.4 } }
          @keyframes bounce { 0%,80%,100% { transform: scale(0) } 40% { transform: scale(1) } }
          ::-webkit-scrollbar { width: 5px; height: 5px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.2); border-radius: 3px; }
          .mobile-menu-btn { display: none !important; }
          @media (max-width: 700px) {
            .mobile-menu-btn { display: flex !important; }
            .sidebar-desktop { display: none !important; }
          }
          select option { background: #1e1e2e; color: #fff; }
          
          /* Responsive container fixes */
          .dashboard-container {
            width: 100%;
            max-width: 100%;
            overflow-x: hidden;
          }
          
          /* Responsive grid for stat cards */
          @media (max-width: 1200px) {
            .stat-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
          @media (max-width: 600px) {
            .stat-grid { grid-template-columns: 1fr !important; }
          }
          
          /* Responsive chart containers */
          @media (max-width: 900px) {
            .chart-grid { grid-template-columns: 1fr !important; }
          }
          
          /* Responsive main content */
          @media (max-width: 768px) {
            main { padding: 16px !important; }
          }
          @media (max-width: 480px) {
            main { padding: 12px !important; }
          }
        `}</style>

        {!authed ? (
          <AuthPage mode={authMode} onSwitch={() => setAuthMode(m => m === "login" ? "signup" : "login")} onAuth={() => setAuthed(true)} />
        ) : (
          <div className="dashboard-container" style={{ display: "flex", width: "100%", background: bg, transition: "background 0.3s" }}>
            {/* Mobile overlay sidebar */}
            {mobileMenuOpen && (
              <>
                <div onClick={() => setMobileMenuOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 38 }} />
                <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 39 }}>
                  <Sidebar page={page} setPage={p => { setPage(p); setMobileMenuOpen(false); }} collapsed={false} setCollapsed={() => {}} />
                </div>
              </>
            )}

            {/* Desktop sidebar */}
            <div className="sidebar-desktop">
              <Sidebar page={page} setPage={setPage} collapsed={collapsed} setCollapsed={setCollapsed} />
            </div>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, minHeight: "100vh", width: "100%" }}>
              <Topbar page={page} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
              <main style={{ flex: 1, padding: "28px 28px", overflowY: "auto", width: "100%" }}>
                {page === "notifications" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 640 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontSize: 13, color: dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>{notifications.filter(n => !n.read).length} unread</span>
                    </div>
                    {notifications.map(n => {
                      const typeStyle = { success: "#10b981", info: "#6366f1", warning: "#f59e0b", error: "#ef4444" };
                      return (
                        <div key={n.id} style={{ background: dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.9)", border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`, borderRadius: 14, padding: "14px 18px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                          <div style={{ width: 10, height: 10, borderRadius: "50%", background: typeStyle[n.type], marginTop: 4, flexShrink: 0, opacity: n.read ? 0.3 : 1 }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                              <div style={{ fontSize: 13.5, fontWeight: 600, color: dark ? "#fff" : "#0f0f10" }}>{n.title}</div>
                              <span style={{ fontSize: 11.5, color: dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)", whiteSpace: "nowrap" }}>{n.time}</span>
                            </div>
                            <div style={{ fontSize: 13, color: dark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)", marginTop: 3 }}>{n.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : pageComponents[page]}
              </main>
            </div>

            <NotifPanel />
          </div>
        )}
      </AppContext.Provider>
    </ThemeContext.Provider>
  );
}

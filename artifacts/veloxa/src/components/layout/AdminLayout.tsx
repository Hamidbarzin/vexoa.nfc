import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, UserCircle, Briefcase, CreditCard, ContactRound } from "lucide-react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/admin/leads", label: "Leads", icon: LayoutDashboard, color: "#00e5ff", glow: "rgba(0,229,255,0.25)" },
    { href: "/admin/owners", label: "Owners", icon: Users, color: "#a855f7", glow: "rgba(168,85,247,0.25)" },
    { href: "/admin/cards", label: "Cards", icon: CreditCard, color: "#f97316", glow: "rgba(249,115,22,0.25)" },
    { href: "/admin/sponsors", label: "Sponsors", icon: Briefcase, color: "#ec4899", glow: "rgba(236,72,153,0.25)" },
    { href: "/admin/crm", label: "CRM", icon: ContactRound, color: "#34d399", glow: "rgba(52,211,153,0.25)" },
    { href: "/profile/settings", label: "My Profile", icon: UserCircle, color: "#a78bfa", glow: "rgba(167,139,250,0.25)" },
  ];

  function getColorComponents(hex: string): string {
    const map: Record<string, string> = {
      "#00e5ff": "0,229,255",
      "#a855f7": "168,85,247",
      "#f97316": "249,115,22",
      "#ec4899": "236,72,153",
      "#34d399": "52,211,153",
      "#a78bfa": "167,139,250",
    };
    return map[hex] ?? "168,85,247";
  }

  return (
    <div className="flex h-screen w-full overflow-hidden relative" style={{ background: "linear-gradient(135deg, #060010 0%, #03000c 35%, #000812 65%, #000510 100%)" }}>
      {/* Ambient background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #7c3aed, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute top-1/2 -right-32 w-80 h-80 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #00e5ff, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute -bottom-32 left-1/3 w-72 h-72 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #ec4899, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      {/* Sidebar */}
      <aside
        className="w-56 hidden md:flex flex-col shrink-0 relative z-10"
        style={{
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(24px)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #a855f7, #00e5ff)" }}>
              <span className="text-xs font-black text-white">V</span>
            </div>
            <span className="text-base font-bold tracking-[0.2em]" style={{ background: "linear-gradient(90deg, #a855f7, #00e5ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>VELOXA</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location === item.href || location.startsWith(item.href);
            const Icon = item.icon;
            const rgb = getColorComponents(item.color);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative group"
                style={
                  isActive
                    ? {
                        background: `rgba(${rgb},0.08)`,
                        border: `1px solid ${item.color}35`,
                        boxShadow: `0 0 16px ${item.glow}`,
                      }
                    : {
                        background: "transparent",
                        border: "1px solid transparent",
                      }
                }
              >
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                    style={{ background: item.color, boxShadow: `0 0 8px ${item.glow}` }}
                  />
                )}
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200"
                  style={isActive ? { background: `${item.color}15`, boxShadow: `0 0 10px ${item.glow}` } : { background: "rgba(255,255,255,0.04)" }}
                >
                  <Icon className="h-3.5 w-3.5" style={{ color: isActive ? item.color : "rgba(255,255,255,0.3)" }} />
                </div>
                <span
                  className="text-sm font-medium"
                  style={{ color: isActive ? item.color : "rgba(255,255,255,0.4)" }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <p className="text-[10px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.12)" }}>
            VELOXA CRM v1.5
          </p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Mobile header */}
        <header
          className="h-14 flex items-center justify-between px-4 md:hidden shrink-0"
          style={{
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "linear-gradient(135deg, #a855f7, #00e5ff)" }}>
              <span className="text-[10px] font-black text-white">V</span>
            </div>
            <span className="text-sm font-bold tracking-widest" style={{ background: "linear-gradient(90deg, #a855f7, #00e5ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>VELOXA</span>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-5 md:p-8">
          {children}
        </div>

        {/* Mobile bottom nav — show 5 key items */}
        <nav
          className="flex md:hidden justify-around p-2 shrink-0"
          style={{
            background: "rgba(10,0,20,0.85)",
            backdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {navItems.map((item) => {
            const isActive = location === item.href || location.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1 p-2 rounded-lg transition-all"
              >
                <Icon className="h-5 w-5" style={{ color: isActive ? item.color : "rgba(255,255,255,0.3)" }} />
                <span className="text-[9px] font-medium" style={{ color: isActive ? item.color : "rgba(255,255,255,0.3)" }}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </main>
    </div>
  );
}

import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, UserCircle, Briefcase, CreditCard } from "lucide-react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/admin/leads", label: "Leads", icon: LayoutDashboard },
    { href: "/admin/owners", label: "Owners", icon: Users },
    { href: "/admin/cards", label: "Cards", icon: CreditCard },
    { href: "/admin/sponsors", label: "Sponsors", icon: Briefcase },
    { href: "/profile/settings", label: "My Profile", icon: UserCircle },
  ];

  return (
    <div className="flex h-screen w-full" style={{ background: "linear-gradient(160deg, #051a18 0%, #020d0d 60%, #020808 100%)" }}>
      {/* Sidebar */}
      <aside
        className="w-60 hidden md:flex flex-col shrink-0"
        style={{
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="text-lg font-bold tracking-widest" style={{ color: "#00e5ff" }}>VELOXA</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location === item.href || location.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group"
                style={
                  isActive
                    ? {
                        background: "rgba(0,229,255,0.08)",
                        border: "1px solid rgba(0,229,255,0.2)",
                        boxShadow: "0 0 16px rgba(0,229,255,0.06)",
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
                    style={{ background: "#00e5ff", boxShadow: "0 0 8px rgba(0,229,255,0.8)" }}
                  />
                )}
                <Icon
                  className="h-4 w-4 shrink-0"
                  style={{ color: isActive ? "#00e5ff" : "rgba(255,255,255,0.35)" }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: isActive ? "#00e5ff" : "rgba(255,255,255,0.45)" }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-[10px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.15)" }}>
            VELOXA CRM v1.0
          </p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <header
          className="h-14 flex items-center justify-between px-4 md:hidden shrink-0"
          style={{
            background: "rgba(255,255,255,0.03)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <span className="text-base font-bold tracking-widest" style={{ color: "#00e5ff" }}>VELOXA</span>
        </header>

        <div className="flex-1 overflow-auto p-6 md:p-8">
          {children}
        </div>

        {/* Mobile bottom nav */}
        <nav
          className="flex md:hidden justify-around p-2 shrink-0"
          style={{
            background: "rgba(255,255,255,0.03)",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {navItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1 p-2 rounded-lg transition-all"
              >
                <Icon className="h-5 w-5" style={{ color: isActive ? "#00e5ff" : "rgba(255,255,255,0.3)" }} />
                <span className="text-[10px] font-medium" style={{ color: isActive ? "#00e5ff" : "rgba(255,255,255,0.3)" }}>
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

import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, UserCircle, Briefcase } from "lucide-react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/admin/leads", label: "Leads", icon: LayoutDashboard },
    { href: "/admin/owners", label: "Owners", icon: Users },
    { href: "/admin/sponsors", label: "Sponsors", icon: Briefcase },
    { href: "/profile/settings", label: "My Profile", icon: UserCircle },
  ];

  return (
    <div className="flex h-screen bg-background w-full">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <h1 className="text-xl font-bold tracking-widest text-primary">VELOXA</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 border-b border-border bg-card flex items-center px-4 md:hidden">
          <h1 className="text-xl font-bold tracking-widest text-primary">VELOXA</h1>
        </header>
        
        <div className="flex-1 overflow-auto">
          {children}
        </div>
        
        {/* Mobile Nav */}
        <nav className="border-t border-border bg-card flex md:hidden p-2 justify-around">
          {navItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 p-2 rounded-md ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </main>
    </div>
  );
}

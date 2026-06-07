import { useState } from "react";
import { useAdminGetCrmContacts } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Search, Users, MapPin, Briefcase, Phone, Mail, Tag } from "lucide-react";
import { QueryErrorState } from "@/components/admin/QueryErrorState";

export default function AdminCrm() {
  const [search, setSearch] = useState("");
  const { data: contacts, isLoading, isError, refetch } = useAdminGetCrmContacts();

  const filtered = contacts?.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.company && c.company.toLowerCase().includes(q)) ||
      (c.nfcToken && c.nfcToken.toLowerCase().includes(q))
    );
  });

  const initials = (name: string) =>
    name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  const colorFor = (name: string) => {
    const colors = [
      ["#a855f7", "#7c3aed"],
      ["#00e5ff", "#0891b2"],
      ["#ec4899", "#be185d"],
      ["#f97316", "#c2410c"],
      ["#34d399", "#059669"],
    ];
    const idx = name.charCodeAt(0) % colors.length;
    return colors[idx]!;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">CRM Contacts</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
          Customers who activated their NFC cards
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: "Total Contacts", value: contacts?.length ?? 0, color: "#a855f7", icon: Users },
          { label: "This Month", value: contacts?.filter(c => new Date(c.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length ?? 0, color: "#00e5ff", icon: Tag },
          { label: "NFC Activations", value: contacts?.filter(c => c.source === "NFC Activation").length ?? 0, color: "#34d399", icon: Briefcase },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="rounded-2xl p-4 flex items-center gap-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}18` }}>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{value}</p>
              <p className="text-[10px] text-white/30 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, company or token..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-white/20 outline-none"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
        />
      </div>

      {/* List */}
      {isError ? (
        <QueryErrorState title="Failed to load CRM contacts" onRetry={() => refetch()} />
      ) : isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 rounded-full border-t-2 border-purple-500 animate-spin" />
        </div>
      ) : !filtered?.length ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.15)" }}>
            <Users className="w-6 h-6 text-purple-400/60" />
          </div>
          <p className="text-white/30 text-sm">{search ? "No contacts match your search" : "No CRM contacts yet"}</p>
          <p className="text-white/15 text-xs mt-1">Contacts appear when customers activate NFC cards</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((c) => {
            const [c1, c2] = colorFor(c.name);
            return (
              <div
                key={c.id}
                className="rounded-2xl p-4 flex items-start gap-3 transition-all"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                {/* Avatar */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                  style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
                >
                  {initials(c.name)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className="font-semibold text-white text-sm">{c.name}</p>
                      {c.company && <p className="text-white/40 text-xs">{c.company}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span
                        className="text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(52,211,153,0.12)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" }}
                      >
                        {c.source}
                      </span>
                      <span className="text-[10px] text-white/20">
                        {format(new Date(c.createdAt), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                    {c.email && (
                      <span className="flex items-center gap-1 text-xs text-white/35">
                        <Mail className="w-3 h-3" /> {c.email}
                      </span>
                    )}
                    {c.phone && (
                      <span className="flex items-center gap-1 text-xs text-white/35">
                        <Phone className="w-3 h-3" /> {c.phone}
                      </span>
                    )}
                    {c.city && (
                      <span className="flex items-center gap-1 text-xs text-white/35">
                        <MapPin className="w-3 h-3" /> {c.city}
                      </span>
                    )}
                    {c.industry && (
                      <span className="flex items-center gap-1 text-xs text-white/35">
                        <Briefcase className="w-3 h-3" /> {c.industry}
                      </span>
                    )}
                    {c.nfcToken && (
                      <span className="flex items-center gap-1 text-xs font-mono" style={{ color: "#a855f7" }}>
                        {c.nfcToken}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { useAdminGetLeads, useAdminUpdateLeadStatus, getAdminGetLeadsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Users, TrendingUp, Star, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { QueryErrorState } from "@/components/admin/QueryErrorState";

export default function AdminLeads() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const { data: leads, isLoading, isError, refetch } = useAdminGetLeads();
  const updateStatus = useAdminUpdateLeadStatus();

  const handleStatusChange = (id: number, newStatus: string) => {
    updateStatus.mutate(
      { id, data: { status: newStatus } },
      {
        onSuccess: (updatedLead) => {
          queryClient.setQueryData(getAdminGetLeadsQueryKey(), (old: any) => {
            if (!old) return old;
            return old.map((lead: any) =>
              lead.id === id ? { ...lead, status: updatedLead.status } : lead
            );
          });
        },
        onError: () => {
          toast({ title: "Failed to update lead status", variant: "destructive" });
        },
      }
    );
  };

  const filteredLeads = leads?.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.sponsorName && lead.sponsorName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const stats = {
    total: leads?.length || 0,
    new: leads?.filter(l => l.status === "new").length || 0,
    qualified: leads?.filter(l => l.status === "qualified").length || 0,
    closed: leads?.filter(l => l.status === "closed").length || 0,
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "new": return { color: "#00e5ff", bg: "rgba(0,229,255,0.1)", border: "rgba(0,229,255,0.3)", glow: "rgba(0,229,255,0.15)", label: "New" };
      case "contacted": return { color: "#f97316", bg: "rgba(249,115,22,0.1)", border: "rgba(249,115,22,0.3)", glow: "rgba(249,115,22,0.15)", label: "Contacted" };
      case "qualified": return { color: "#a855f7", bg: "rgba(168,85,247,0.1)", border: "rgba(168,85,247,0.3)", glow: "rgba(168,85,247,0.15)", label: "Qualified" };
      case "closed": return { color: "#34d399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.3)", glow: "rgba(52,211,153,0.15)", label: "Closed" };
      default: return { color: "#6b7280", bg: "rgba(107,114,128,0.1)", border: "rgba(107,114,128,0.3)", glow: "rgba(107,114,128,0.15)", label: status };
    }
  };

  const statCards = [
    { label: "Total Leads", value: stats.total, icon: Users, color: "#00e5ff", glow: "rgba(0,229,255,0.2)" },
    { label: "New", value: stats.new, icon: Star, color: "#a855f7", glow: "rgba(168,85,247,0.2)" },
    { label: "Qualified", value: stats.qualified, icon: TrendingUp, color: "#f97316", glow: "rgba(249,115,22,0.2)" },
    { label: "Closed", value: stats.closed, icon: CheckCircle, color: "#34d399", glow: "rgba(52,211,153,0.2)" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Leads</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>Manage captured leads and track conversion</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-2xl p-4 relative overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-20 -translate-y-4 translate-x-4" style={{ background: `radial-gradient(circle, ${s.color}, transparent 70%)`, filter: "blur(16px)" }} />
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>{s.label}</p>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${s.color}18`, boxShadow: `0 0 12px ${s.glow}` }}>
                  <Icon className="h-4 w-4" style={{ color: s.color }} />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "rgba(255,255,255,0.3)" }} />
        <Input
          placeholder="Search by name, email or sponsor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 h-10 text-sm text-white placeholder:text-white/25 border-white/10 focus:border-purple-500/50"
          style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(12px)" }}
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.07)" }}>
        {isError ? (
          <QueryErrorState title="Failed to load leads" onRetry={() => refetch()} />
        ) : isLoading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" style={{ color: "rgba(168,85,247,0.7)" }} />
          </div>
        ) : filteredLeads && filteredLeads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  {["Lead", "Contact", "Source", "Date", "Status"].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-[10px] font-semibold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.25)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead, i) => (
                  <tr
                    key={lead.id}
                    className="transition-all duration-150 group"
                    style={{ borderBottom: i < filteredLeads.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white" style={{ background: "linear-gradient(135deg, #a855f7, #00e5ff)" }}>
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-white">{lead.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="text-white/70">{lead.email}</div>
                      {lead.phone && <div className="text-white/30 text-xs mt-0.5">{lead.phone}</div>}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="text-white/70">{lead.sponsorName || "Direct"}</div>
                      <div className="text-white/30 text-xs mt-0.5">via {lead.ownerName || "Unknown"}</div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-white/30 text-xs">
                      {format(new Date(lead.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {(() => {
                        const cfg = getStatusConfig(lead.status);
                        return (
                          <Select value={lead.status} onValueChange={(v) => handleStatusChange(lead.id, v)}>
                            <SelectTrigger
                              className="w-[120px] h-7 text-xs font-semibold border-0 focus:ring-0"
                              style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, boxShadow: `0 0 10px ${cfg.glow}` }}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent style={{ background: "#0d0020", border: "1px solid rgba(255,255,255,0.1)" }}>
                              {["new", "contacted", "qualified", "closed"].map(s => {
                                const c = getStatusConfig(s);
                                return <SelectItem key={s} value={s} style={{ color: c.color }}>{c.label}</SelectItem>;
                              })}
                            </SelectContent>
                          </Select>
                        );
                      })()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center" style={{ color: "rgba(255,255,255,0.2)" }}>
            <Users className="h-8 w-8 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No leads found</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { useAdminGetCards, useAdminUpdateCardStatus, getAdminGetCardsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Loader2, CreditCard, CheckCircle, AlertTriangle, XCircle, CircleDashed } from "lucide-react";
import { CARD_STATUSES, CARD_STATUS_LABELS, type CardStatus } from "@/lib/card-status";
import { useToast } from "@/hooks/use-toast";
import { QueryErrorState } from "@/components/admin/QueryErrorState";

export default function AdminCards() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const { data: cards, isLoading, isError, refetch } = useAdminGetCards();
  const updateStatus = useAdminUpdateCardStatus();

  const handleStatusChange = (id: number, newStatus: CardStatus) => {
    updateStatus.mutate(
      { id, data: { status: newStatus } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getAdminGetCardsQueryKey() });
        },
        onError: () => {
          toast({ title: "Failed to update card status", variant: "destructive" });
        },
      }
    );
  };

  const filteredCards = cards?.filter(
    (card) =>
      card.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.ownerUsername?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "blank":
        return { color: "#6b7280", bg: "rgba(107,114,128,0.1)", border: "rgba(107,114,128,0.3)", glow: "rgba(107,114,128,0.1)", label: CARD_STATUS_LABELS.blank, Icon: CircleDashed };
      case "active":
        return { color: "#34d399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.3)", glow: "rgba(52,211,153,0.15)", label: CARD_STATUS_LABELS.active, Icon: CheckCircle };
      case "lost":
        return { color: "#f97316", bg: "rgba(249,115,22,0.1)", border: "rgba(249,115,22,0.3)", glow: "rgba(249,115,22,0.15)", label: CARD_STATUS_LABELS.lost, Icon: AlertTriangle };
      case "suspended":
        return { color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.3)", glow: "rgba(239,68,68,0.15)", label: CARD_STATUS_LABELS.suspended, Icon: XCircle };
      default:
        return { color: "#6b7280", bg: "rgba(107,114,128,0.1)", border: "rgba(107,114,128,0.3)", glow: "rgba(107,114,128,0.1)", label: status, Icon: CircleDashed };
    }
  };

  const statCards = [
    { label: "Total", value: cards?.length || 0, color: "#00e5ff", glow: "rgba(0,229,255,0.2)" },
    { label: "Blank", value: cards?.filter((c) => c.status === "blank").length || 0, color: "#6b7280", glow: "rgba(107,114,128,0.2)" },
    { label: "Active", value: cards?.filter((c) => c.status === "active").length || 0, color: "#34d399", glow: "rgba(52,211,153,0.2)" },
    { label: "Lost", value: cards?.filter((c) => c.status === "lost").length || 0, color: "#f97316", glow: "rgba(249,115,22,0.2)" },
    { label: "Suspended", value: cards?.filter((c) => c.status === "suspended").length || 0, color: "#ef4444", glow: "rgba(239,68,68,0.2)" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">NFC Cards</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>Manage smart business card statuses and assignments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-2xl p-4 relative overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-20 -translate-y-4 translate-x-4" style={{ background: `radial-gradient(circle, ${s.color}, transparent 70%)`, filter: "blur(16px)" }} />
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full" style={{ background: s.color, boxShadow: `0 0 8px ${s.glow}` }} />
              <p className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>{s.label}</p>
            </div>
            <p className="text-3xl font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "rgba(255,255,255,0.3)" }} />
        <Input
          placeholder="Search by token or owner..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 h-10 text-sm text-white placeholder:text-white/25 border-white/10 focus:border-orange-500/50"
          style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(12px)" }}
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.07)" }}>
        {isError ? (
          <QueryErrorState title="Failed to load cards" onRetry={() => refetch()} />
        ) : isLoading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" style={{ color: "rgba(249,115,22,0.7)" }} />
          </div>
        ) : filteredCards && filteredCards.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  {["Token", "Owner", "Status", "Date Created"].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-[10px] font-semibold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.25)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCards.map((card, i) => {
                  const cfg = getStatusConfig(card.status);
                  const StatusIcon = cfg.Icon;
                  return (
                    <tr
                      key={card.id}
                      className="transition-all duration-150"
                      style={{ borderBottom: i < filteredCards.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 shrink-0" style={{ color: "rgba(249,115,22,0.6)" }} />
                          <span className="font-mono text-xs px-2.5 py-1 rounded-lg" style={{ background: "rgba(249,115,22,0.08)", color: "#f97316", border: "1px solid rgba(249,115,22,0.2)" }}>
                            {card.token}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="text-white/70">{card.ownerName || "Unassigned"}</div>
                        {card.ownerUsername && <div className="text-white/30 text-xs mt-0.5">@{card.ownerUsername}</div>}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <Select
                          value={card.status}
                          onValueChange={(value: CardStatus) => handleStatusChange(card.id, value)}
                          disabled={updateStatus.isPending}
                        >
                          <SelectTrigger
                            className="w-[128px] h-7 text-xs font-semibold border-0 gap-1.5 focus:ring-0"
                            style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, boxShadow: `0 0 10px ${cfg.glow}` }}
                          >
                            <StatusIcon className="h-3 w-3 shrink-0" />
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent style={{ background: "#0d0020", border: "1px solid rgba(255,255,255,0.1)" }}>
                            {CARD_STATUSES.map((s) => {
                              const c = getStatusConfig(s);
                              const SI = c.Icon;
                              return (
                                <SelectItem key={s} value={s}>
                                  <span className="flex items-center gap-2" style={{ color: c.color }}>
                                    <SI className="h-3 w-3" />
                                    {c.label}
                                  </span>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-white/30 text-xs">
                        {format(new Date(card.createdAt), "MMM d, yyyy")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <CreditCard className="h-8 w-8 mx-auto mb-3" style={{ color: "rgba(255,255,255,0.12)" }} />
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.2)" }}>No cards found</p>
          </div>
        )}
      </div>
    </div>
  );
}

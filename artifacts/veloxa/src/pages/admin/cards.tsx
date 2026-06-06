import { useState } from "react";
import { useAdminGetCards, useAdminUpdateCardStatus, getAdminGetCardsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";

export default function AdminCards() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const { data: cards, isLoading } = useAdminGetCards();
  const updateStatus = useAdminUpdateCardStatus();

  const handleStatusChange = (id: number, newStatus: "active" | "inactive" | "lost" | "suspended") => {
    updateStatus.mutate(
      { id, data: { status: newStatus } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getAdminGetCardsQueryKey() });
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "inactive":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      case "lost":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "suspended":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-light tracking-tight">NFC Cards</h1>
        <p className="text-muted-foreground mt-2">Manage smart business card statuses and assignments.</p>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by token or owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="border border-border rounded-lg bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredCards && filteredCards.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">Token</th>
                  <th className="px-6 py-4 font-medium">Owner</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCards.map((card) => (
                  <tr key={card.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-mono text-foreground bg-muted/30 px-2 py-1 rounded inline-block">
                        {card.token}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-foreground">{card.ownerName || "Unassigned"}</div>
                      {card.ownerUsername && <div className="text-muted-foreground text-xs mt-1">@{card.ownerUsername}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Select
                        value={card.status}
                        onValueChange={(value: "active" | "inactive" | "lost" | "suspended") => handleStatusChange(card.id, value)}
                        disabled={updateStatus.isPending}
                      >
                        <SelectTrigger className={`w-[130px] h-8 text-xs ${getStatusColor(card.status)}`}>
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="lost">Lost</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                      {format(new Date(card.createdAt), "MMM d, yyyy")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            No cards found.
          </div>
        )}
      </div>
    </div>
  );
}
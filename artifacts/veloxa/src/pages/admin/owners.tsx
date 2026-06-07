import { useState } from "react";
import { useAdminGetOwners, useAdminCreateOwner, getAdminGetOwnersQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Copy, CheckCircle2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { QueryErrorState } from "@/components/admin/QueryErrorState";

export default function AdminOwners() {
  const { data: owners, isLoading, isError, refetch } = useAdminGetOwners();
  const createOwner = useAdminCreateOwner();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    title: "",
    company: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOwner.mutate(
      { data: formData },
      {
        onSuccess: (newOwner) => {
          queryClient.setQueryData(getAdminGetOwnersQueryKey(), (old: any) => {
            if (!old) return [newOwner];
            return [...old, newOwner];
          });
          setOpen(false);
          setFormData({ name: "", username: "", email: "", title: "", company: "" });
          toast({ title: "Owner created", description: "NFC token generated successfully." });
        },
        onError: () => {
          toast({ title: "Failed to create owner", variant: "destructive" });
        },
      }
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(text);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const avatarColors = [
    "linear-gradient(135deg, #a855f7, #00e5ff)",
    "linear-gradient(135deg, #ec4899, #f97316)",
    "linear-gradient(135deg, #00e5ff, #34d399)",
    "linear-gradient(135deg, #f97316, #a855f7)",
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Owners</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>Manage platform users and NFC cards</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 shrink-0"
              style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)", boxShadow: "0 0 20px rgba(168,85,247,0.35)" }}
            >
              <Plus className="h-4 w-4" />
              Add Owner
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]" style={{ background: "#0d0020", border: "1px solid rgba(168,85,247,0.2)", backdropFilter: "blur(24px)" }}>
            <DialogHeader>
              <DialogTitle className="text-white">Create New Owner</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {[
                { id: "name", label: "Full Name", key: "name" as const, required: true },
                { id: "username", label: "Username (URL slug)", key: "username" as const, required: true },
                { id: "email", label: "Email", key: "email" as const, required: false },
                { id: "title", label: "Title", key: "title" as const, required: false },
                { id: "company", label: "Company", key: "company" as const, required: false },
              ].map(({ id, label, key, required }) => (
                <div key={id} className="space-y-1.5">
                  <Label htmlFor={id} className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</Label>
                  <Input
                    id={id}
                    required={required}
                    value={formData[key]}
                    onChange={(e) => setFormData(prev => ({ ...prev, [key]: e.target.value }))}
                    className="text-white border-white/10 focus:border-purple-500/50 h-9"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  />
                </div>
              ))}
              <button
                type="submit"
                disabled={createOwner.isPending}
                className="w-full h-10 rounded-xl text-sm font-semibold text-white mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)", boxShadow: "0 0 16px rgba(168,85,247,0.3)" }}
              >
                {createOwner.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create & Generate NFC Token"}
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {isError ? (
          <div className="col-span-full">
            <QueryErrorState title="Failed to load owners" onRetry={() => refetch()} />
          </div>
        ) : isLoading ? (
          <div className="col-span-full py-16 flex justify-center">
            <Loader2 className="h-7 w-7 animate-spin" style={{ color: "rgba(168,85,247,0.7)" }} />
          </div>
        ) : owners && owners.length > 0 ? (
          owners.map((owner, i) => (
            <div
              key={owner.id}
              className="rounded-2xl overflow-hidden transition-all duration-300 group"
              style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.07)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(168,85,247,0.3)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 30px rgba(168,85,247,0.1)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(255,255,255,0.07)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
            >
              {/* Card top gradient strip */}
              <div className="h-1 w-full" style={{ background: avatarColors[i % avatarColors.length] }} />

              <div className="p-5">
                {/* Avatar + name */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white shrink-0"
                    style={{ background: avatarColors[i % avatarColors.length] }}
                  >
                    {owner.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white leading-tight">{owner.name}</h3>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                      {owner.title}{owner.company ? ` · ${owner.company}` : ""}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* NFC Token */}
                  <div>
                    <p className="text-[10px] font-semibold tracking-widest uppercase mb-1.5" style={{ color: "rgba(255,255,255,0.25)" }}>NFC Token</p>
                    <div
                      className="flex items-center justify-between px-3 py-2 rounded-xl font-mono text-xs"
                      style={{ background: "rgba(0,229,255,0.05)", border: "1px solid rgba(0,229,255,0.15)" }}
                    >
                      <span className="truncate mr-2" style={{ color: "#00e5ff" }}>{owner.nfcToken}</span>
                      <button onClick={() => copyToClipboard(owner.nfcToken)} className="shrink-0 transition-opacity hover:opacity-70">
                        {copiedToken === owner.nfcToken
                          ? <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
                          : <Copy className="h-3.5 w-3.5" style={{ color: "rgba(0,229,255,0.5)" }} />}
                      </button>
                    </div>
                  </div>

                  {/* Profile URL */}
                  <div>
                    <p className="text-[10px] font-semibold tracking-widest uppercase mb-1.5" style={{ color: "rgba(255,255,255,0.25)" }}>Profile URL</p>
                    <div
                      className="flex items-center justify-between px-3 py-2 rounded-xl font-mono text-xs"
                      style={{ background: "rgba(168,85,247,0.05)", border: "1px solid rgba(168,85,247,0.15)" }}
                    >
                      <span className="truncate mr-2" style={{ color: "#a855f7" }}>{owner.profileUrl}</span>
                      <button onClick={() => copyToClipboard(`https://veloxa.app${owner.profileUrl}`)} className="shrink-0 transition-opacity hover:opacity-70">
                        {copiedToken === `https://veloxa.app${owner.profileUrl}`
                          ? <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
                          : <Copy className="h-3.5 w-3.5" style={{ color: "rgba(168,85,247,0.5)" }} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center rounded-2xl" style={{ border: "1px dashed rgba(255,255,255,0.1)" }}>
            <Users className="h-8 w-8 mx-auto mb-3" style={{ color: "rgba(255,255,255,0.15)" }} />
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.2)" }}>No owners created yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

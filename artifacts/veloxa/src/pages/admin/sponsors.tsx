import { useState } from "react";
import { useAdminGetSponsors, useAdminCreateSponsor, getAdminGetSponsorsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Image as ImageIcon, ExternalLink, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sanitizeHttpUrl, isSafeHttpUrl } from "@/lib/safe-url";
import { QueryErrorState } from "@/components/admin/QueryErrorState";

export default function AdminSponsors() {
  const { data: sponsors, isLoading, isError, refetch } = useAdminGetSponsors();
  const createSponsor = useAdminCreateSponsor();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    ctaText: "Learn More",
    ctaUrl: "",
    logoUrl: "",
    bgImageUrl: "",
    teaserImageUrl: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.ctaUrl && !isSafeHttpUrl(formData.ctaUrl)) {
      toast({
        title: "Invalid CTA URL",
        description: "Use a valid http or https link.",
        variant: "destructive",
      });
      return;
    }
    if (formData.logoUrl && !isSafeHttpUrl(formData.logoUrl)) {
      toast({
        title: "Invalid logo URL",
        description: "Use a valid http or https link.",
        variant: "destructive",
      });
      return;
    }
    if (formData.bgImageUrl && !isSafeHttpUrl(formData.bgImageUrl)) {
      toast({
        title: "Invalid background image URL",
        description: "Use a valid http or https link.",
        variant: "destructive",
      });
      return;
    }
    if (formData.teaserImageUrl && !isSafeHttpUrl(formData.teaserImageUrl)) {
      toast({
        title: "Invalid teaser image URL",
        description: "Use a valid http or https link.",
        variant: "destructive",
      });
      return;
    }
    createSponsor.mutate(
      { data: formData },
      {
        onSuccess: (newSponsor) => {
          queryClient.setQueryData(getAdminGetSponsorsQueryKey(), (old: any) => {
            if (!old) return [newSponsor];
            return [...old, newSponsor];
          });
          setOpen(false);
          setFormData({ name: "", tagline: "", ctaText: "Learn More", ctaUrl: "", logoUrl: "", bgImageUrl: "", teaserImageUrl: "" });
          toast({ title: "Sponsor created successfully" });
        },
        onError: () => {
          toast({ title: "Failed to create sponsor", variant: "destructive" });
        },
      }
    );
  };

  const cardGradients = [
    "linear-gradient(135deg, #ec4899 0%, #f97316 100%)",
    "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
    "linear-gradient(135deg, #00e5ff 0%, #a855f7 100%)",
    "linear-gradient(135deg, #34d399 0%, #00e5ff 100%)",
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Sponsors</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>Manage brand partners and campaign assets</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 shrink-0"
              style={{ background: "linear-gradient(135deg, #ec4899, #f97316)", boxShadow: "0 0 20px rgba(236,72,153,0.35)" }}
            >
              <Plus className="h-4 w-4" />
              Add Sponsor
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]" style={{ background: "#0d0020", border: "1px solid rgba(236,72,153,0.2)", backdropFilter: "blur(24px)" }}>
            <DialogHeader>
              <DialogTitle className="text-white">Add New Sponsor</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4 max-h-[65vh] overflow-y-auto pr-1">
              {[
                { id: "name", label: "Brand Name", key: "name" as const, required: true, type: "text", multi: false },
                { id: "ctaText", label: "CTA Text", key: "ctaText" as const, required: true, type: "text", multi: false },
                { id: "ctaUrl", label: "CTA URL", key: "ctaUrl" as const, required: true, type: "url", multi: false },
                { id: "logoUrl", label: "Logo URL (Optional)", key: "logoUrl" as const, required: false, type: "url", multi: false },
                { id: "bgImageUrl", label: "Background Image URL (Optional)", key: "bgImageUrl" as const, required: false, type: "url", multi: false },
                { id: "teaserImageUrl", label: "Teaser Image URL (Optional)", key: "teaserImageUrl" as const, required: false, type: "url", multi: false },
              ].map(({ id, label, key, required, type }) => (
                <div key={id} className="space-y-1.5">
                  <Label htmlFor={id} className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</Label>
                  <Input
                    id={id} type={type} required={required}
                    value={formData[key]}
                    onChange={(e) => setFormData(prev => ({ ...prev, [key]: e.target.value }))}
                    className="text-white border-white/10 focus:border-pink-500/50 h-9"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  />
                </div>
              ))}
              <div className="space-y-1.5">
                <Label htmlFor="tagline" className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>Tagline</Label>
                <Textarea
                  id="tagline" required rows={2}
                  value={formData.tagline}
                  onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                  className="text-white border-white/10 focus:border-pink-500/50 resize-none"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                />
              </div>
              <button
                type="submit"
                disabled={createSponsor.isPending}
                className="w-full h-10 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                style={{ background: "linear-gradient(135deg, #ec4899, #f97316)", boxShadow: "0 0 16px rgba(236,72,153,0.3)" }}
              >
                {createSponsor.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Sponsor"}
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {isError ? (
          <div className="col-span-full">
            <QueryErrorState title="Failed to load sponsors" onRetry={() => refetch()} />
          </div>
        ) : isLoading ? (
          <div className="col-span-full py-16 flex justify-center">
            <Loader2 className="h-7 w-7 animate-spin" style={{ color: "rgba(236,72,153,0.7)" }} />
          </div>
        ) : sponsors && sponsors.length > 0 ? (
          sponsors.map((sponsor, i) => {
            const safeCtaUrl = sanitizeHttpUrl(sponsor.ctaUrl);
            return (
            <div
              key={sponsor.id}
              className="rounded-2xl overflow-hidden flex flex-col transition-all duration-300 group"
              style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.07)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(236,72,153,0.25)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 30px rgba(236,72,153,0.08)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(255,255,255,0.07)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
            >
              {/* Banner */}
              <div className="h-28 relative overflow-hidden flex items-center justify-center">
                {sponsor.bgImageUrl ? (
                  <img src={sponsor.bgImageUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="absolute inset-0 opacity-30" style={{ background: cardGradients[i % cardGradients.length] }} />
                )}
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(13,0,32,0.9) 0%, transparent 100%)" }} />

                {sponsor.logoUrl ? (
                  <img src={sponsor.logoUrl} alt={sponsor.name} className="h-14 w-14 object-contain relative z-10 drop-shadow-xl" />
                ) : (
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center relative z-10"
                    style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.15)" }}
                  >
                    <Briefcase className="h-5 w-5 text-white/60" />
                  </div>
                )}

                {/* Gradient top strip */}
                <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: cardGradients[i % cardGradients.length] }} />
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-semibold text-white text-base leading-tight">{sponsor.name}</h3>
                <p className="text-sm mt-2 flex-1 line-clamp-3" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {sponsor.tagline}
                </p>

                <div className="mt-4 pt-3 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <span className="text-xs font-mono truncate max-w-[160px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                    {sponsor.ctaUrl}
                  </span>
                  {safeCtaUrl ? (
                    <a
                      href={safeCtaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                      style={{ background: "rgba(236,72,153,0.1)", color: "#ec4899", border: "1px solid rgba(236,72,153,0.25)" }}
                    >
                      <ExternalLink className="h-3 w-3" />
                      {sponsor.ctaText}
                    </a>
                  ) : (
                    <span className="text-xs text-white/30">Invalid URL</span>
                  )}
                </div>
              </div>
            </div>
          );
          })
        ) : (
          <div className="col-span-full py-16 text-center rounded-2xl" style={{ border: "1px dashed rgba(255,255,255,0.1)" }}>
            <Briefcase className="h-8 w-8 mx-auto mb-3" style={{ color: "rgba(255,255,255,0.12)" }} />
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.2)" }}>No sponsors added yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

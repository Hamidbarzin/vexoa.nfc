import { useState } from "react";
import { useAdminGetSponsors, useAdminCreateSponsor, getAdminGetSponsorsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Image as ImageIcon, Badge } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminSponsors() {
  const { data: sponsors, isLoading } = useAdminGetSponsors();
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
        }
      }
    );
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light tracking-tight">Sponsors</h1>
          <p className="text-muted-foreground mt-2">Manage brand partners and campaign assets.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="shrink-0 gap-2">
              <Plus className="h-4 w-4" />
              Add Sponsor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Sponsor</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4 h-[60vh] overflow-y-auto pr-2">
              <div className="space-y-2">
                <Label htmlFor="name">Brand Name</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Textarea
                  id="tagline"
                  required
                  rows={2}
                  value={formData.tagline}
                  onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ctaText">CTA Text</Label>
                  <Input
                    id="ctaText"
                    required
                    value={formData.ctaText}
                    onChange={(e) => setFormData(prev => ({ ...prev, ctaText: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ctaUrl">CTA URL</Label>
                  <Input
                    id="ctaUrl"
                    type="url"
                    required
                    value={formData.ctaUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, ctaUrl: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logoUrl">Logo URL (Optional)</Label>
                <Input
                  id="logoUrl"
                  type="url"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bgImageUrl">Background Image URL (Optional)</Label>
                <Input
                  id="bgImageUrl"
                  type="url"
                  value={formData.bgImageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, bgImageUrl: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teaserImageUrl">Teaser Image URL (Optional)</Label>
                <Input
                  id="teaserImageUrl"
                  type="url"
                  value={formData.teaserImageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, teaserImageUrl: e.target.value }))}
                />
              </div>
              
              <Button type="submit" className="w-full mt-4" disabled={createSponsor.isPending}>
                {createSponsor.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Sponsor"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-12 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : sponsors && sponsors.length > 0 ? (
          sponsors.map((sponsor) => (
            <div key={sponsor.id} className="group border border-border bg-card rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 flex flex-col">
              <div className="h-32 bg-muted relative overflow-hidden flex items-center justify-center">
                {sponsor.bgImageUrl ? (
                  <img src={sponsor.bgImageUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                )}
                {sponsor.logoUrl && (
                  <img src={sponsor.logoUrl} alt={sponsor.name} className="h-16 w-16 object-contain relative z-10 drop-shadow-lg" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-80" />
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-medium text-foreground">{sponsor.name}</h3>
                <p className="text-sm text-muted-foreground mt-2 flex-1 line-clamp-3">
                  {sponsor.tagline}
                </p>
                
                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">{sponsor.ctaUrl}</span>
                  <Badge variant="outline">{sponsor.ctaText}</Badge>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed border-border rounded-xl">
            No sponsors found.
          </div>
        )}
      </div>
    </div>
  );
}

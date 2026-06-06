import { useState, useEffect } from "react";
import { useAdminGetOwners, useUpdateOwnerProfile, getAdminGetOwnersQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProfileSettings() {
  const { data: owners, isLoading } = useAdminGetOwners();
  const updateProfile = useUpdateOwnerProfile();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Since there's no auth, we'll just edit the first owner for demonstration purposes
  const currentOwner = owners?.[0];

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    company: "",
    bio: "",
    phone: "",
    email: "",
    website: "",
    city: "",
    industry: ""
  });

  useEffect(() => {
    if (currentOwner) {
      setFormData({
        name: currentOwner.name || "",
        title: currentOwner.title || "",
        company: currentOwner.company || "",
        bio: currentOwner.bio || "",
        phone: currentOwner.phone || "",
        email: currentOwner.email || "",
        website: currentOwner.website || "",
        city: currentOwner.city || "",
        industry: currentOwner.industry || ""
      });
    }
  }, [currentOwner]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOwner) return;

    updateProfile.mutate(
      { id: currentOwner.id, data: formData },
      {
        onSuccess: (updatedOwner) => {
          queryClient.invalidateQueries({ queryKey: getAdminGetOwnersQueryKey() });
          toast({ title: "Profile updated successfully" });
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!currentOwner) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Please create an owner first in the Owners tab.
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-light tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your public NFC profile information.</p>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border bg-muted/20">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
              {currentOwner.name.charAt(0)}
            </div>
            <div>
              <div className="font-medium text-lg">{currentOwner.username}</div>
              <div className="text-sm font-mono text-muted-foreground mt-1 bg-muted px-2 py-1 rounded inline-block">
                NFC: {currentOwner.nfcToken}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Contact</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Professional Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="A brief description of who you are and what you do."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City / Location</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={formData.industry}
                onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="pt-4 border-t border-border flex justify-end">
            <Button type="submit" disabled={updateProfile.isPending} className="w-full sm:w-auto min-w-[150px]">
              {updateProfile.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

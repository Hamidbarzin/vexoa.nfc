import { useState, useEffect } from "react";
import { useAdminGetOwners, useUpdateOwnerProfile, getAdminGetOwnersQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Save, User, Mail, Briefcase, Phone, Globe, MapPin, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProfileSettings() {
  const { data: owners, isLoading } = useAdminGetOwners();
  const updateProfile = useUpdateOwnerProfile();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const currentOwner = owners?.[0];

  const [formData, setFormData] = useState({
    name: "", title: "", company: "", bio: "",
    phone: "", email: "", website: "", city: "", industry: ""
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
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getAdminGetOwnersQueryKey() });
          toast({ title: "Profile updated successfully" });
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin" style={{ color: "rgba(52,211,153,0.7)" }} />
      </div>
    );
  }

  if (!currentOwner) {
    return (
      <div className="p-8 text-center" style={{ color: "rgba(255,255,255,0.3)" }}>
        Please create an owner first in the Owners tab.
      </div>
    );
  }

  const fields = [
    { id: "name",     label: "Full Name",           key: "name" as const,     type: "text",  icon: User,      span: 1 },
    { id: "email",    label: "Email Contact",        key: "email" as const,    type: "email", icon: Mail,      span: 1 },
    { id: "title",    label: "Professional Title",   key: "title" as const,    type: "text",  icon: Briefcase, span: 1 },
    { id: "company",  label: "Company",              key: "company" as const,  type: "text",  icon: Building2, span: 1 },
    { id: "phone",    label: "Phone Number",         key: "phone" as const,    type: "tel",   icon: Phone,     span: 1 },
    { id: "website",  label: "Website",              key: "website" as const,  type: "url",   icon: Globe,     span: 1 },
    { id: "city",     label: "City / Location",      key: "city" as const,     type: "text",  icon: MapPin,    span: 1 },
    { id: "industry", label: "Industry",             key: "industry" as const, type: "text",  icon: Briefcase, span: 1 },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">My Profile</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>Manage your public NFC profile information</p>
      </div>

      {/* Profile card */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.07)" }}>
        {/* Top banner */}
        <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #34d399, #00e5ff, #a855f7)" }} />

        {/* Identity section */}
        <div className="px-6 py-5 flex items-center gap-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white shrink-0"
            style={{ background: "linear-gradient(135deg, #34d399, #00e5ff)" }}
          >
            {currentOwner.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-white">{currentOwner.name}</p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>@{currentOwner.username}</p>
            <div
              className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-lg font-mono text-[10px]"
              style={{ background: "rgba(52,211,153,0.08)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" }}
            >
              NFC: {currentOwner.nfcToken}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {fields.map(({ id, label, key, type, icon: Icon }) => (
              <div key={id} className="space-y-1.5">
                <Label htmlFor={id} className="text-xs font-medium flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                  <Icon className="h-3 w-3" />
                  {label}
                </Label>
                <Input
                  id={id} type={type}
                  value={formData[key]}
                  onChange={(e) => setFormData(prev => ({ ...prev, [key]: e.target.value }))}
                  placeholder={type === "url" ? "https://" : ""}
                  className="text-white border-white/10 focus:border-teal-500/50 h-9 text-sm"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                />
              </div>
            ))}
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <Label htmlFor="bio" className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>Bio</Label>
            <Textarea
              id="bio" rows={3}
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="A brief description of who you are and what you do."
              className="text-white border-white/10 focus:border-teal-500/50 text-sm resize-none"
              style={{ background: "rgba(255,255,255,0.05)" }}
            />
          </div>

          <div className="pt-2 flex justify-end" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <button
              type="submit"
              disabled={updateProfile.isPending}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #34d399, #00e5ff)", boxShadow: "0 0 20px rgba(52,211,153,0.3)" }}
            >
              {updateProfile.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

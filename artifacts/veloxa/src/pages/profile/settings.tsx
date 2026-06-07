import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useGetMe, useUpdateMyProfile, getGetMeQueryKey } from "@workspace/api-client-react";
import { isSafeHttpUrl } from "@/lib/safe-url";
import { useQueryClient } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, User, Mail, Briefcase, Phone, Globe, MapPin, Building2, Instagram, Linkedin, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { logoutUser } from "@/hooks/use-auth";

export default function ProfileSettings() {
  const [, setLocation] = useLocation();
  const { data: owner, isLoading, isError } = useGetMe();
  const updateProfile = useUpdateMyProfile();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "", title: "", company: "", bio: "",
    phone: "", email: "", website: "",
    instagram: "", linkedin: "", city: "", industry: "",
  });

  useEffect(() => {
    if (owner) {
      setFormData({
        name: owner.name || "",
        title: owner.title || "",
        company: owner.company || "",
        bio: owner.bio || "",
        phone: owner.phone || "",
        email: owner.email || "",
        website: owner.website || "",
        instagram: owner.instagram || "",
        linkedin: owner.linkedin || "",
        city: owner.city || "",
        industry: owner.industry || "",
      });
    }
  }, [owner]);

  const handleChange = (field: string, value: string) => setFormData((p) => ({ ...p, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.website && !isSafeHttpUrl(formData.website)) {
      toast({
        title: "Invalid website URL",
        description: "Use a valid http or https link.",
        variant: "destructive",
      });
      return;
    }
    updateProfile.mutate(
      { data: formData },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
          toast({ title: "Profile updated successfully" });
        },
        onError: () => {
          toast({ title: "Update failed", variant: "destructive" });
        },
      }
    );
  };

  const handleLogout = async () => {
    await logoutUser();
    setLocation("/login");
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin" style={{ color: "rgba(52,211,153,0.7)" }} />
      </div>
    );
  }

  if (isError || !owner) {
    return (
      <div className="flex flex-col h-full items-center justify-center gap-4">
        <p className="text-white/40 text-sm">You are not signed in.</p>
        <button
          onClick={() => setLocation("/login")}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #a855f7, #00e5ff)" }}
        >
          Sign In
        </button>
      </div>
    );
  }

  const inputCls = "w-full rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:ring-1 focus:ring-green-500/30 transition-all";
  const boxCls = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12 };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">My Profile</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
            Manage your public NFC profile information
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", color: "rgba(239,68,68,0.7)" }}
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>

      {/* Card */}
      <div
        className="rounded-2xl p-5 flex items-center gap-4"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white shrink-0"
          style={{ background: "linear-gradient(135deg, #34d399, #0891b2)" }}
        >
          {owner.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-white">{owner.name}</p>
          <p className="text-sm text-white/40">@{owner.username}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div
          className="rounded-2xl p-5 space-y-4"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          {/* Row helper */}
          {[
            { icon: User, label: "Full Name", field: "name", placeholder: "Your full name" },
            { icon: Mail, label: "Email Contact", field: "email", placeholder: "your@email.com" },
            { icon: Briefcase, label: "Professional Title", field: "title", placeholder: "CEO, Designer, Developer..." },
            { icon: Building2, label: "Company", field: "company", placeholder: "Company name" },
            { icon: Phone, label: "Phone Number", field: "phone", placeholder: "+1 555 000 0000" },
            { icon: Globe, label: "Website", field: "website", placeholder: "https://yoursite.com" },
          ].map(({ icon: Icon, label, field, placeholder }) => (
            <div key={field}>
              <label className="flex items-center gap-1.5 text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                <Icon className="h-3.5 w-3.5" />
                {label}
              </label>
              <div style={boxCls}>
                <input
                  value={formData[field as keyof typeof formData]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  placeholder={placeholder}
                  className={inputCls}
                />
              </div>
            </div>
          ))}

          {/* Social */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Instagram, label: "Instagram", field: "instagram", placeholder: "@username" },
              { icon: Linkedin, label: "LinkedIn", field: "linkedin", placeholder: "linkedin.com/in/..." },
            ].map(({ icon: Icon, label, field, placeholder }) => (
              <div key={field}>
                <label className="flex items-center gap-1.5 text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </label>
                <div style={boxCls}>
                  <input
                    value={formData[field as keyof typeof formData]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    placeholder={placeholder}
                    className={inputCls}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: MapPin, label: "City", field: "city", placeholder: "New York" },
              { icon: Briefcase, label: "Industry", field: "industry", placeholder: "Technology" },
            ].map(({ icon: Icon, label, field, placeholder }) => (
              <div key={field}>
                <label className="flex items-center gap-1.5 text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </label>
                <div style={boxCls}>
                  <input
                    value={formData[field as keyof typeof formData]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    placeholder={placeholder}
                    className={inputCls}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Bio */}
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: "rgba(255,255,255,0.35)" }}>Bio</label>
            <div style={boxCls}>
              <Textarea
                value={formData.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                placeholder="A short introduction about yourself..."
                rows={4}
                className="w-full px-3.5 py-2.5 text-sm text-white placeholder-white/20 bg-transparent border-0 outline-none focus-visible:ring-0 resize-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={updateProfile.isPending}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-opacity disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #34d399, #0891b2)" }}
        >
          {updateProfile.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </button>
      </form>
    </div>
  );
}

import { useParams } from "wouter";
import { useState } from "react";
import { useGetOwnerByToken, useMatchSponsor, useCreateSponsorLead } from "@workspace/api-client-react";
import { Loader2, ArrowRight, MoreHorizontal, Globe, Mail, Lock, Download, Phone, MapPin, Briefcase } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const leadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
});

type LeadFormValues = z.infer<typeof leadSchema>;

export default function NfcFlow() {
  const { token } = useParams<{ token: string }>();
  const [step, setStep] = useState<"teaser" | "form" | "profile">("teaser");
  const { toast } = useToast();

  const { data: owner, isLoading: ownerLoading, isError: ownerError } = useGetOwnerByToken(token || "");

  const { data: sponsor, isLoading: sponsorLoading } = useMatchSponsor(
    { ownerId: owner?.id as number },
    { query: { enabled: !!owner?.id } }
  );

  const createLead = useCreateSponsorLead();

  const { register, handleSubmit, formState: { errors } } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
  });

  const onSubmit = (data: LeadFormValues) => {
    if (!sponsor || !owner) {
      setStep("profile");
      return;
    }
    createLead.mutate({
      data: {
        sponsorId: sponsor.id,
        ownerId: owner.id,
        nfcToken: token,
        name: data.name,
        email: data.email,
        phone: data.phone,
      }
    }, {
      onSuccess: () => {
        setStep("profile");
        toast({ title: "Connected!", description: "You can now view the full profile." });
      },
      onError: () => setStep("profile"),
    });
  };

  const saveContact = () => {
    if (!owner) return;
    const lines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${owner.name}`,
      owner.title ? `TITLE:${owner.title}` : "",
      owner.company ? `ORG:${owner.company}` : "",
      owner.email ? `EMAIL:${owner.email}` : "",
      owner.phone ? `TEL:${owner.phone}` : "",
      owner.website ? `URL:${owner.website}` : "",
      "END:VCARD",
    ].filter(Boolean).join("\n");
    const blob = new Blob([lines], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${owner.name.replace(/\s+/g, "_")}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (ownerLoading || sponsorLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "linear-gradient(160deg, #051a18 0%, #020808 100%)" }}>
        <div className="w-14 h-14 rounded-full border-t-2 border-cyan-400 animate-spin mb-6" />
        <p className="text-white/40 tracking-widest text-xs uppercase">Connecting</p>
      </div>
    );
  }

  if (ownerError || !owner) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6" style={{ background: "linear-gradient(160deg, #051a18 0%, #020808 100%)" }}>
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
          <span className="text-2xl font-bold text-white">V</span>
        </div>
        <h1 className="text-xl font-light text-white mb-2">Card Not Found</h1>
        <p className="text-white/40 text-sm">This NFC card is inactive or invalid.</p>
      </div>
    );
  }

  const joinYear = owner.createdAt ? new Date(owner.createdAt).getFullYear() : new Date().getFullYear();

  return (
    <div className="min-h-[100dvh] overflow-x-hidden" style={{ background: "linear-gradient(160deg, #051a18 0%, #020d0d 60%, #020808 100%)" }}>
      <AnimatePresence mode="wait">

        {/* ─── STEP 1: TEASER ─── */}
        {step === "teaser" && sponsor && (
          <motion.div
            key="teaser"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-[100dvh] flex flex-col relative"
          >
            <div className="absolute inset-0 z-0">
              {sponsor.bgImageUrl ? (
                <img src={sponsor.bgImageUrl} alt="" className="w-full h-full object-cover opacity-30" />
              ) : (
                <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 60% 20%, rgba(0,229,255,0.08) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(224,64,251,0.08) 0%, transparent 60%)" }} />
              )}
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #020808 40%, transparent 100%)" }} />
            </div>

            <div className="flex-1 relative z-10 flex flex-col justify-end p-8 pb-28 max-w-lg mx-auto w-full">
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                {sponsor.logoUrl && (
                  <img src={sponsor.logoUrl} alt={sponsor.name} className="h-10 w-auto mb-8 object-contain" />
                )}
                <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">Exclusive Invitation</p>
                <h1 className="text-5xl font-light text-white leading-tight mb-4">{sponsor.name}</h1>
                <p className="text-base text-white/50 mb-10 font-light">{sponsor.tagline}</p>

                <button
                  onClick={() => setStep("form")}
                  className="w-full h-14 flex items-center justify-between px-6 rounded-xl text-base font-medium text-black transition-all"
                  style={{ background: "linear-gradient(135deg, #00e5ff, #00b4d8)" }}
                >
                  <span>{sponsor.ctaText || "Learn More"}</span>
                  <ArrowRight className="h-5 w-5" />
                </button>

                <button
                  onClick={() => setStep("profile")}
                  className="w-full mt-5 text-xs text-white/30 hover:text-white/60 transition-colors tracking-widest uppercase"
                >
                  Skip to {owner.name}'s Profile
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Auto-skip teaser if no sponsor */}
        {step === "teaser" && !sponsor && (
          <motion.div key="auto-skip" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onAnimationComplete={() => setStep("profile")} className="min-h-[100dvh] flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border-t border-cyan-400 animate-spin" />
          </motion.div>
        )}

        {/* ─── STEP 2: FORM ─── */}
        {step === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="min-h-[100dvh] flex flex-col justify-center px-6 py-12"
          >
            <div className="max-w-sm w-full mx-auto">
              <div className="flex justify-center mb-8">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.3)" }}>
                  <span className="text-lg font-bold text-cyan-400">V</span>
                </div>
              </div>
              <h2 className="text-2xl font-light text-white text-center mb-2">Unlock Access</h2>
              <p className="text-sm text-white/40 text-center mb-10">
                Share your details to connect with {sponsor?.name || "the network"} and view {owner.name}'s profile.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {[
                  { placeholder: "Full Name", field: "name" as const, type: "text", error: errors.name?.message },
                  { placeholder: "Email Address", field: "email" as const, type: "email", error: errors.email?.message },
                  { placeholder: "Phone Number (Optional)", field: "phone" as const, type: "tel", error: undefined },
                ].map(({ placeholder, field, type, error }) => (
                  <div key={field}>
                    <input
                      {...register(field)}
                      type={type}
                      placeholder={placeholder}
                      className="w-full h-13 px-4 py-4 rounded-xl text-white text-sm placeholder:text-white/30 outline-none transition-all"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                      onFocus={e => (e.currentTarget.style.borderColor = "rgba(0,229,255,0.5)")}
                      onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                    />
                    {error && <p className="text-red-400 text-xs mt-1 px-1">{error}</p>}
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={createLead.isPending}
                  className="w-full h-13 py-4 rounded-xl text-sm font-medium text-black flex items-center justify-center gap-2 mt-2 transition-opacity disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, #00e5ff, #00b4d8)" }}
                >
                  {createLead.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue"}
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* ─── STEP 3: PROFILE ─── */}
        {step === "profile" && (
          <motion.div
            key="profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-[100dvh] flex flex-col px-5 pt-10 pb-8 relative"
          >
            {/* Top bar */}
            <div className="flex items-start justify-between mb-6">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                <span className="text-base font-bold text-white">V</span>
              </div>
              <button
                className="w-11 h-11 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                <MoreHorizontal className="h-5 w-5 text-white/60" />
              </button>
            </div>

            {/* ① Avatar with gradient border */}
            <div className="flex flex-col items-center mb-6">
              <div className="p-[2px] rounded-full mb-4" style={{ background: "linear-gradient(135deg, #e040fb, #00e5ff)" }}>
                {owner.avatarUrl ? (
                  <img
                    src={owner.avatarUrl}
                    alt={owner.name}
                    className="w-24 h-24 rounded-full object-cover"
                    style={{ background: "#051a18" }}
                  />
                ) : (
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #051a18, #0a2a28)" }}
                  >
                    {owner.name.charAt(0)}
                  </div>
                )}
              </div>
              <h1 className="text-2xl font-bold text-white leading-tight text-center">{owner.name}</h1>
              <p className="text-sm text-white/40 mt-0.5">Loyal since {joinYear}</p>
            </div>

            {/* ③ Ambient glow + Glass Card */}
            <div className="relative mb-4">
              {/* glow behind card */}
              <div
                className="absolute inset-0 rounded-3xl blur-2xl opacity-30 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 30% 50%, #e040fb 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, #00e5ff 0%, transparent 60%)" }}
              />
              <div
                className="relative rounded-2xl p-5"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(24px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <p className="text-xs text-white/40 font-medium tracking-wider uppercase mb-1">VELOXA Network</p>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-white">{owner.title || "Member"}</span>
                  {owner.company && <span className="text-white/40 text-sm ml-2">@ {owner.company}</span>}
                </div>

                {/* Gradient bar */}
                <div className="h-[2px] rounded-full mb-5" style={{ background: "linear-gradient(90deg, #e040fb 0%, #00e5ff 100%)" }} />

                {/* ② Phone + Website + Email — 3 buttons */}
                <div className={`grid gap-3 mb-3 ${[owner.phone, owner.website, owner.email].filter(Boolean).length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
                  {owner.phone && (
                    <a
                      href={`tel:${owner.phone}`}
                      className="h-12 flex flex-col items-center justify-center gap-1 rounded-xl text-xs font-medium text-cyan-300 transition-all"
                      style={{
                        background: "rgba(0,229,255,0.05)",
                        border: "1px solid #00e5ff",
                        boxShadow: "0 0 12px rgba(0,229,255,0.2), inset 0 0 8px rgba(0,229,255,0.04)",
                      }}
                    >
                      <Phone className="h-4 w-4" />
                      Phone
                    </a>
                  )}
                  {owner.website && (
                    <a
                      href={owner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-12 flex flex-col items-center justify-center gap-1 rounded-xl text-xs font-medium text-cyan-300 transition-all"
                      style={{
                        background: "rgba(0,229,255,0.05)",
                        border: "1px solid #00e5ff",
                        boxShadow: "0 0 12px rgba(0,229,255,0.2), inset 0 0 8px rgba(0,229,255,0.04)",
                      }}
                    >
                      <Globe className="h-4 w-4" />
                      Website
                    </a>
                  )}
                  {owner.email && (
                    <a
                      href={`mailto:${owner.email}`}
                      className="h-12 flex flex-col items-center justify-center gap-1 rounded-xl text-xs font-medium text-cyan-300 transition-all"
                      style={{
                        background: "rgba(0,229,255,0.05)",
                        border: "1px solid #00e5ff",
                        boxShadow: "0 0 12px rgba(0,229,255,0.2), inset 0 0 8px rgba(0,229,255,0.04)",
                      }}
                    >
                      <Mail className="h-4 w-4" />
                      Email
                    </a>
                  )}
                </div>

                {/* Save Contact */}
                <button
                  onClick={saveContact}
                  className="w-full h-12 flex items-center justify-center gap-2 rounded-xl text-sm font-medium text-pink-300 transition-all"
                  style={{
                    background: "rgba(224,64,251,0.05)",
                    border: "1px solid #e040fb",
                    boxShadow: "0 0 12px rgba(224,64,251,0.25), inset 0 0 12px rgba(224,64,251,0.05)",
                  }}
                >
                  <Download className="h-4 w-4" />
                  Save Contact
                </button>
              </div>
            </div>

            {/* Bio */}
            {owner.bio && (
              <div className="px-1 mb-4">
                <p className="text-sm text-white/35 font-light leading-relaxed text-center italic">"{owner.bio}"</p>
              </div>
            )}

            {/* ④ City + Industry chips */}
            {(owner.city || owner.industry) && (
              <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
                {owner.city && (
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-white/50"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <MapPin className="h-3 w-3" />
                    {owner.city}
                  </div>
                )}
                {owner.industry && (
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-white/50"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <Briefcase className="h-3 w-3" />
                    {owner.industry}
                  </div>
                )}
              </div>
            )}

            {/* Sponsored banner */}
            {sponsor && (
              <button
                onClick={() => setStep("teaser")}
                className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all mt-auto"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <Lock className="h-4 w-4 text-white/30 shrink-0" />
                <span className="text-sm text-white/40">Sponsored · </span>
                <span className="text-sm text-cyan-400">{sponsor.ctaText || "Learn more"}</span>
              </button>
            )}

            <p className="text-center text-xs text-white/15 tracking-widest uppercase mt-6">Powered by VELOXA</p>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

import { useParams } from "wouter";
import { useState, useEffect } from "react";
import { useGetOwnerByToken, useMatchSponsor, useCreateSponsorLead } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, User, Briefcase, MapPin, Mail, Phone, Globe } from "lucide-react";
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

  // If there's no sponsor matched after loading, skip to profile directly
  useEffect(() => {
    if (owner && !sponsorLoading && !sponsor && step === "teaser") {
      setStep("profile");
    }
  }, [owner, sponsor, sponsorLoading, step]);

  const onSubmit = (data: LeadFormValues) => {
    if (!sponsor || !owner) return;

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
        toast({ title: "Connected successfully", description: "You now have access to the profile." });
      },
      onError: () => {
        // Even if lead creation fails, we should let them see the profile
        // but maybe show a generic error
        setStep("profile");
      }
    });
  };

  if (ownerLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 rounded-full border-t-2 border-primary animate-spin mb-8"></div>
        <p className="text-muted-foreground tracking-widest text-sm uppercase">Connecting</p>
      </div>
    );
  }

  if (ownerError || !owner) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-light mb-2">Card Not Found</h1>
        <p className="text-muted-foreground">This NFC card appears to be inactive or invalid.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background text-foreground overflow-x-hidden">
      <AnimatePresence mode="wait">
        
        {step === "teaser" && sponsor && (
          <motion.div
            key="teaser"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-[100dvh] flex flex-col relative"
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              {sponsor.bgImageUrl ? (
                <img src={sponsor.bgImageUrl} alt="" className="w-full h-full object-cover opacity-40" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-background via-background to-primary/10" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
            </div>

            <div className="flex-1 relative z-10 flex flex-col justify-end p-8 pb-24 max-w-lg mx-auto w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {sponsor.logoUrl && (
                  <img src={sponsor.logoUrl} alt={sponsor.name} className="h-12 w-auto mb-8 object-contain" />
                )}
                
                <h2 className="text-sm font-semibold tracking-widest text-primary uppercase mb-2">Exclusive Invitation</h2>
                <h1 className="text-4xl sm:text-5xl font-light leading-tight mb-4">
                  {sponsor.name}
                </h1>
                <p className="text-lg text-muted-foreground mb-12 font-light">
                  {sponsor.tagline}
                </p>

                <Button 
                  size="lg" 
                  className="w-full h-14 text-lg rounded-none bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-between px-6 group transition-all"
                  onClick={() => setStep("form")}
                >
                  <span>{sponsor.ctaText}</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <button 
                  onClick={() => setStep("profile")}
                  className="w-full mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors tracking-widest uppercase"
                >
                  Skip to {owner.name}'s Profile
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {step === "form" && sponsor && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="min-h-[100dvh] flex flex-col justify-center p-6 relative"
          >
            <div className="max-w-md w-full mx-auto relative z-10">
              <div className="mb-10 text-center">
                <h2 className="text-2xl font-light mb-2">Unlock Access</h2>
                <p className="text-muted-foreground">Share your details to connect with {sponsor.name} and view {owner.name}'s profile.</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Input
                    placeholder="Full Name"
                    {...register("name")}
                    className="h-14 bg-card/50 border-border text-lg px-4 rounded-none focus-visible:ring-primary"
                  />
                  {errors.name && <p className="text-destructive text-sm px-1">{errors.name.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Input
                    placeholder="Email Address"
                    type="email"
                    {...register("email")}
                    className="h-14 bg-card/50 border-border text-lg px-4 rounded-none focus-visible:ring-primary"
                  />
                  {errors.email && <p className="text-destructive text-sm px-1">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Input
                    placeholder="Phone Number (Optional)"
                    type="tel"
                    {...register("phone")}
                    className="h-14 bg-card/50 border-border text-lg px-4 rounded-none focus-visible:ring-primary"
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full h-14 text-lg rounded-none mt-4"
                  disabled={createLead.isPending}
                >
                  {createLead.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Continue"}
                </Button>
              </form>
            </div>
          </motion.div>
        )}

        {step === "profile" && (
          <motion.div
            key="profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-[100dvh] pb-24"
          >
            {/* Header/Hero Area */}
            <div className="h-[40vh] relative bg-card flex flex-col justify-end items-center pb-12 border-b border-border/50">
              <div className="absolute inset-0 bg-gradient-to-b from-background to-card opacity-50" />
              
              <div className="relative z-10 flex flex-col items-center">
                {owner.avatarUrl ? (
                  <img src={owner.avatarUrl} alt={owner.name} className="w-24 h-24 rounded-full object-cover border-2 border-background shadow-xl mb-6" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-background shadow-xl mb-6 flex items-center justify-center text-3xl font-light text-primary">
                    {owner.name.charAt(0)}
                  </div>
                )}
                <h1 className="text-3xl font-light tracking-wide text-center px-4">{owner.name}</h1>
                {(owner.title || owner.company) && (
                  <p className="text-muted-foreground mt-2 font-medium tracking-wide">
                    {owner.title} {owner.company && <span className="text-primary/70">@ {owner.company}</span>}
                  </p>
                )}
              </div>
            </div>

            {/* Profile Content */}
            <div className="max-w-xl mx-auto px-6 pt-12 space-y-12">
              
              {owner.bio && (
                <div className="text-center">
                  <p className="text-lg font-light leading-relaxed text-foreground/90 italic">
                    "{owner.bio}"
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-6 border-b border-border pb-2">Contact Info</h3>
                
                {owner.email && (
                  <a href={`mailto:${owner.email}`} className="flex items-center p-4 bg-card border border-border/50 hover:border-primary/50 transition-colors group">
                    <Mail className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors mr-4" />
                    <span className="font-light">{owner.email}</span>
                  </a>
                )}
                
                {owner.phone && (
                  <a href={`tel:${owner.phone}`} className="flex items-center p-4 bg-card border border-border/50 hover:border-primary/50 transition-colors group">
                    <Phone className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors mr-4" />
                    <span className="font-light">{owner.phone}</span>
                  </a>
                )}
                
                {owner.website && (
                  <a href={owner.website} target="_blank" rel="norenoopener noreferrer" className="flex items-center p-4 bg-card border border-border/50 hover:border-primary/50 transition-colors group">
                    <Globe className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors mr-4" />
                    <span className="font-light truncate">{owner.website.replace(/^https?:\/\//, '')}</span>
                  </a>
                )}
              </div>

              {(owner.city || owner.industry) && (
                <div className="grid grid-cols-2 gap-4">
                  {owner.city && (
                    <div className="p-4 border border-border/50 bg-card/50 flex flex-col items-center justify-center text-center">
                      <MapPin className="h-5 w-5 text-muted-foreground mb-2" />
                      <span className="text-sm font-medium">{owner.city}</span>
                    </div>
                  )}
                  {owner.industry && (
                    <div className="p-4 border border-border/50 bg-card/50 flex flex-col items-center justify-center text-center">
                      <Briefcase className="h-5 w-5 text-muted-foreground mb-2" />
                      <span className="text-sm font-medium truncate w-full">{owner.industry}</span>
                    </div>
                  )}
                </div>
              )}
              
            </div>

            <div className="mt-24 pb-8 text-center">
              <p className="text-xs text-muted-foreground tracking-widest uppercase">Powered by VELOXA</p>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

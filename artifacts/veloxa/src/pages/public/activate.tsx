import { useParams, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { useGetCardStatus, useActivateCard } from "@workspace/api-client-react";
import { setAuthFromSession } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

const schema = z
  .object({
    name: z.string().min(2, "Full name required"),
    email: z.string().email("Valid email required"),
    password: z.string().min(8, "Min 8 characters"),
    confirm: z.string(),
    company: z.string().optional(),
    title: z.string().optional(),
    phone: z.string().optional(),
    website: z.string().optional(),
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
    city: z.string().optional(),
    industry: z.string().optional(),
    bio: z.string().optional(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

type FormValues = z.infer<typeof schema>;

const BG = "linear-gradient(135deg, #060010 0%, #000812 100%)";
const GLASS = { background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)" };

export default function ActivatePage() {
  const { token } = useParams<{ token: string }>();
  const [, setLocation] = useLocation();
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { toast } = useToast();

  const { data: cardStatus, isLoading: statusLoading, isError: statusError } = useGetCardStatus(token || "");
  const activate = useActivateCard();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (statusLoading || statusError || !cardStatus) return;
    if (cardStatus.status === "active") {
      setLocation(`/u/${token}`);
    }
  }, [cardStatus, statusLoading, statusError, token, setLocation]);

  const onSubmit = async (data: FormValues) => {
    const { confirm, ...payload } = data;
    activate.mutate(
      { token: token!, data: { ...payload, password: data.password } as any },
      {
        onSuccess: (result) => {
          setAuthFromSession({
            userId: result.userId,
            ownerId: result.ownerId,
            email: result.email,
            name: result.name,
            role: result.role,
          });
          toast({
            title: "Account created!",
            description: "Your card is active. Set up your profile now.",
          });
          setLocation("/profile/settings");
        },
        onError: (error: any) => {
          toast({
            title: "Activation failed",
            description: error?.data?.error || "Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

  if (statusLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: BG }}>
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    );
  }

  if (statusError || !cardStatus) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: BG }}>
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <h1 className="text-xl font-semibold text-white mb-2">Card Not Found</h1>
        <p className="text-sm text-white/40">This NFC card token is invalid or has expired.</p>
      </div>
    );
  }

  if (cardStatus.status === "lost" || cardStatus.status === "suspended") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: BG }}>
        <AlertCircle className="w-12 h-12 text-orange-400 mb-4" />
        <h1 className="text-xl font-semibold text-white mb-2">Card Unavailable</h1>
        <p className="text-sm text-white/40">
          This NFC card is marked as {cardStatus.status} and cannot be activated.
        </p>
      </div>
    );
  }

  if (cardStatus.status !== "blank") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: BG }}>
        <AlertCircle className="w-12 h-12 text-orange-400 mb-4" />
        <h1 className="text-xl font-semibold text-white mb-2">Cannot Activate</h1>
        <p className="text-sm text-white/40">This card is not eligible for activation.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 px-4" style={{ background: BG }}>
      {/* ambient orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #7c3aed, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #00e5ff, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #a855f7, #00e5ff)" }}>
            <span className="text-lg font-black text-white">V</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Activate Your Card</h1>
          <p className="text-white/40 text-sm">Token: <span className="text-purple-400 font-mono">{token}</span></p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl p-6 space-y-5" style={GLASS}>
          {/* Required */}
          <p className="text-xs tracking-widest uppercase text-white/30 mb-1">Account Info</p>

          <Field label="Full Name *" error={errors.name?.message}>
            <input {...register("name")} placeholder="Alex Johnson" className={inputCls} />
          </Field>
          <Field label="Email *" error={errors.email?.message}>
            <input {...register("email")} type="email" placeholder="alex@company.com" className={inputCls} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Password *" error={errors.password?.message}>
              <div className="relative">
                <input {...register("password")} type={showPw ? "text" : "password"} placeholder="••••••••" className={inputCls + " pr-10"} />
                <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>
            <Field label="Confirm Password *" error={errors.confirm?.message}>
              <div className="relative">
                <input {...register("confirm")} type={showConfirm ? "text" : "password"} placeholder="••••••••" className={inputCls + " pr-10"} />
                <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>
          </div>

          {/* Optional */}
          <p className="text-xs tracking-widest uppercase text-white/30 pt-2">Profile Info (Optional)</p>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Company" error={undefined}>
              <input {...register("company")} placeholder="ACME Corp" className={inputCls} />
            </Field>
            <Field label="Title" error={undefined}>
              <input {...register("title")} placeholder="CEO" className={inputCls} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Phone" error={undefined}>
              <input {...register("phone")} placeholder="+1 555 000 0000" className={inputCls} />
            </Field>
            <Field label="City" error={undefined}>
              <input {...register("city")} placeholder="New York" className={inputCls} />
            </Field>
          </div>

          <Field label="Website" error={undefined}>
            <input {...register("website")} placeholder="https://yoursite.com" className={inputCls} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Instagram" error={undefined}>
              <input {...register("instagram")} placeholder="@username" className={inputCls} />
            </Field>
            <Field label="LinkedIn" error={undefined}>
              <input {...register("linkedin")} placeholder="linkedin.com/in/..." className={inputCls} />
            </Field>
          </div>

          <Field label="Industry" error={undefined}>
            <input {...register("industry")} placeholder="Technology, Finance, ..." className={inputCls} />
          </Field>

          <Field label="Bio" error={undefined}>
            <textarea {...register("bio")} rows={3} placeholder="A short intro about yourself..." className={inputCls + " resize-none"} />
          </Field>

          {activate.isError && (
            <p className="text-red-400 text-sm text-center">{(activate.error as any)?.data?.error || "Activation failed. Please try again."}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || activate.isPending}
            className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-opacity disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #a855f7, #00e5ff)" }}
          >
            {(isSubmitting || activate.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Activate Card & Create Account
          </button>
        </form>
      </motion.div>
    </div>
  );
}

const inputCls = "w-full rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:ring-1 focus:ring-purple-500/50 transition-all";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-white/40">{label}</label>
      <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }}>
        {children}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { loginUser, useAuth } from "@/hooks/use-auth";

const schema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(1, "Password required"),
});

type FormValues = z.infer<typeof schema>;

const BG = "linear-gradient(135deg, #060010 0%, #000812 100%)";

function getRedirectPath(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get("redirect");
}

function getQueryError(): string | null {
  const params = new URLSearchParams(window.location.search);
  const error = params.get("error");
  if (error === "forbidden") return "Admin access required";
  if (error === "no-owner") return "No owner profile linked to this account";
  return null;
}

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const auth = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [serverError, setServerError] = useState(getQueryError() ?? "");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (auth.isLoading || !auth.isAuthenticated) return;

    const redirect = getRedirectPath();
    if (redirect) {
      setLocation(redirect);
      return;
    }

    if (auth.role === "admin") {
      setLocation("/admin/leads");
    } else if (auth.ownerId) {
      setLocation("/profile/settings");
    }
  }, [auth.isLoading, auth.isAuthenticated, auth.role, auth.ownerId, setLocation]);

  const onSubmit = async (data: FormValues) => {
    setServerError("");
    const result = await loginUser(data.email, data.password);
    if (result.ok) {
      const redirect = getRedirectPath();
      if (redirect) {
        setLocation(redirect);
      } else if (result.role === "admin") {
        setLocation("/admin/leads");
      } else {
        setLocation("/profile/settings");
      }
    } else {
      setServerError(result.error || "Login failed");
    }
  };

  const inputBase = "w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:ring-1 focus:ring-purple-500/50";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: BG }}>
      {/* ambient */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-25" style={{ background: "radial-gradient(circle, #7c3aed, transparent 70%)", filter: "blur(70px)" }} />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #00e5ff, transparent 70%)", filter: "blur(70px)" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #a855f7, #00e5ff)" }}>
            <span className="text-xl font-black text-white">V</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-white/40 text-sm">Sign in to manage your VELOXA profile</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-2xl p-6 space-y-4"
          style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/40">Email</label>
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }}>
              <input
                {...register("email")}
                type="email"
                placeholder="you@company.com"
                className={inputBase}
              />
            </div>
            {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/40">Password</label>
            <div className="relative" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }}>
              <input
                {...register("password")}
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                className={inputBase + " pr-11"}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
          </div>

          {serverError && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-xs text-red-300">{serverError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-opacity disabled:opacity-50 mt-2"
            style={{ background: "linear-gradient(135deg, #a855f7, #00e5ff)" }}
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Sign In
          </button>
        </form>

        <p className="text-center text-white/20 text-xs mt-6">
          Don't have an account? Tap your NFC card to activate it.
        </p>
      </motion.div>
    </div>
  );
}

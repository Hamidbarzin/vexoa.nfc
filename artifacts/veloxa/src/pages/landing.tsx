import { Link } from "wouter";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CreditCard,
  Smartphone,
  Zap,
  ShieldCheck,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Users,
  TrendingUp,
} from "lucide-react";

export default function Landing() {
  return (
    <div
      className="min-h-screen text-white font-sans overflow-x-hidden"
      style={{ background: "linear-gradient(135deg, #060010 0%, #03000c 35%, #000812 65%, #000510 100%)" }}
    >
      {/* Ambient orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-60 -left-60 w-[600px] h-[600px] rounded-full opacity-20" style={{ background: "radial-gradient(circle, #7c3aed, transparent 65%)", filter: "blur(80px)" }} />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full opacity-15" style={{ background: "radial-gradient(circle, #00e5ff, transparent 65%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, #ec4899, transparent 65%)", filter: "blur(80px)" }} />
      </div>

      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{ background: "rgba(6,0,16,0.7)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #a855f7, #00e5ff)" }}>
              <span className="text-xs font-black text-white">V</span>
            </div>
            <span className="text-base font-bold tracking-[0.2em]" style={{ background: "linear-gradient(90deg, #a855f7, #00e5ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              VELOXA
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/leads">
              <span className="text-sm text-white/50 hover:text-white/80 transition-colors cursor-pointer px-3 py-1.5">Dashboard</span>
            </Link>
            <Link href="/admin/owners">
              <button
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
                style={{ background: "linear-gradient(135deg, #a855f7, #00e5ff)", boxShadow: "0 0 20px rgba(168,85,247,0.35)" }}
              >
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-16">
        {/* ── HERO ── */}
        <section className="relative pt-32 pb-28 md:pt-48 md:pb-40 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold" style={{ background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.3)", color: "#c084fc" }}>
                <Sparkles className="h-3.5 w-3.5" />
                Premium NFC Business Cards
              </div>

              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white max-w-5xl mx-auto leading-[1.08]">
                The modern standard for{" "}
                <span
                  className="inline-block"
                  style={{ background: "linear-gradient(90deg, #a855f7, #00e5ff, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                >
                  smart networking.
                </span>
              </h1>

              <p className="text-lg md:text-xl max-w-2xl mx-auto font-light" style={{ color: "rgba(255,255,255,0.45)" }}>
                Premium NFC business cards seamlessly integrated with a powerful lead capture CRM. Elevate your first impression.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/u/VX-DEMO001">
                  <button
                    className="group flex items-center gap-2 h-13 px-8 py-3.5 rounded-2xl text-base font-semibold text-white transition-all"
                    style={{ background: "linear-gradient(135deg, #a855f7, #00e5ff)", boxShadow: "0 0 30px rgba(168,85,247,0.4)" }}
                  >
                    Try the Demo
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <a href="#pricing">
                  <button
                    className="h-13 px-8 py-3.5 rounded-2xl text-base font-semibold transition-all"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                  >
                    View Pricing
                  </button>
                </a>
              </div>
            </motion.div>

            {/* Hero stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="mt-20 grid grid-cols-3 max-w-2xl mx-auto gap-4"
            >
              {[
                { label: "Active Cards", value: "10K+", color: "#a855f7" },
                { label: "Leads Captured", value: "250K+", color: "#00e5ff" },
                { label: "Sponsors", value: "500+", color: "#ec4899" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl p-4 text-center"
                  style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#00e5ff" }}>Simple Process</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">How it works</h2>
              <p className="mt-4 max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.4)" }}>Three simple steps to transform your networking.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: CreditCard, title: "1. Admin Provisions", desc: "Cards are registered and assigned to owners instantly in the VELOXA dashboard.", color: "#a855f7", glow: "rgba(168,85,247,0.2)" },
                { icon: Smartphone, title: "2. Owner Taps", desc: "Tap the premium NFC card to any smartphone to share a stunning digital profile.", color: "#00e5ff", glow: "rgba(0,229,255,0.2)" },
                { icon: Zap, title: "3. Sponsor Captures", desc: "New connections submit their details, flowing directly into the sponsor CRM.", color: "#ec4899", glow: "rgba(236,72,153,0.2)" },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="rounded-2xl p-7 relative overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${step.color}, transparent)` }} />
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: `${step.color}18`, boxShadow: `0 0 20px ${step.glow}` }}>
                    <step.icon className="h-6 w-6" style={{ color: step.color }} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOR OWNERS & SPONSORS ── */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8">
            {[
              {
                icon: ShieldCheck, label: "For Owners", color: "#a855f7", glow: "rgba(168,85,247,0.2)",
                gradient: "linear-gradient(135deg, rgba(168,85,247,0.08), rgba(168,85,247,0.02))",
                border: "rgba(168,85,247,0.2)",
                items: ["Sleek digital profile with social links", "No app required for recipients", "Update information instantly", "Premium metal or matte card options"],
              },
              {
                icon: BarChart3, label: "For Sponsors", color: "#ec4899", glow: "rgba(236,72,153,0.2)",
                gradient: "linear-gradient(135deg, rgba(236,72,153,0.08), rgba(236,72,153,0.02))",
                border: "rgba(236,72,153,0.2)",
                items: ["Direct lead flow from owner interactions", "Categorize and qualify leads instantly", "Measure ROI of networking events", "Export to existing CRM systems"],
              },
            ].map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl p-8"
                style={{ background: section.gradient, backdropFilter: "blur(16px)", border: `1px solid ${section.border}` }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: `${section.color}18`, boxShadow: `0 0 20px ${section.glow}` }}>
                  <section.icon className="h-6 w-6" style={{ color: section.color }} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-5">{section.label}</h3>
                <ul className="space-y-3">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                      <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: section.color }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── LEAD ENGINE MOCKUP ── */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#ec4899" }}>Dashboard</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Powerful Lead Engine</h2>
              <p className="max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.4)" }}>Manage connections with an intuitive, glass-first dashboard.</p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative mx-auto max-w-5xl rounded-2xl overflow-hidden"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}
            >
              {/* Glow behind mockup */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 opacity-20" style={{ background: "radial-gradient(ellipse, #a855f7, transparent 70%)", filter: "blur(40px)" }} />
              </div>

              {/* Browser bar */}
              <div className="h-10 flex items-center px-4 gap-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                <div className="flex-1 mx-4 h-5 rounded-md" style={{ background: "rgba(255,255,255,0.05)" }} />
              </div>

              <div className="flex" style={{ minHeight: "360px" }}>
                {/* Fake sidebar */}
                <div className="w-44 p-4 space-y-2 shrink-0" style={{ borderRight: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}>
                  <div className="h-6 w-20 rounded-lg mb-4" style={{ background: "linear-gradient(90deg, #a855f7, #00e5ff)" }} />
                  {[["#00e5ff", "Leads"], ["#a855f7", "Owners"], ["#f97316", "Cards"], ["#ec4899", "Sponsors"]].map(([c, l]) => (
                    <div key={l} className="flex items-center gap-2 px-2 py-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <div className="w-2 h-2 rounded-full" style={{ background: c }} />
                      <div className="h-2.5 rounded flex-1" style={{ background: `${c}30` }} />
                    </div>
                  ))}
                </div>

                {/* Fake content */}
                <div className="flex-1 p-6">
                  <div className="grid grid-cols-4 gap-3 mb-6">
                    {[["#00e5ff", "3"], ["#a855f7", "1"], ["#f97316", "0"], ["#34d399", "0"]].map(([c, v], i) => (
                      <div key={i} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${c}20` }}>
                        <div className="w-4 h-4 rounded-md mb-2" style={{ background: `${c}30` }} />
                        <div className="text-xl font-bold" style={{ color: c }}>{v}</div>
                        <div className="h-2 w-12 rounded mt-1" style={{ background: "rgba(255,255,255,0.08)" }} />
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="grid grid-cols-4 gap-4 px-4 py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      {["LEAD", "CONTACT", "SOURCE", "STATUS"].map(h => (
                        <div key={h} className="h-2 rounded" style={{ background: "rgba(255,255,255,0.1)", width: "70%" }} />
                      ))}
                    </div>
                    {[["#a855f7", "#00e5ff"], ["#ec4899", "#f97316"], ["#34d399", "#a855f7"]].map(([c1, c2], i) => (
                      <div key={i} className="grid grid-cols-4 gap-4 px-4 py-3" style={{ borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full shrink-0" style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }} />
                          <div className="h-2 rounded flex-1" style={{ background: "rgba(255,255,255,0.1)" }} />
                        </div>
                        <div className="h-2 rounded self-center" style={{ background: "rgba(255,255,255,0.07)" }} />
                        <div className="h-2 rounded self-center" style={{ background: "rgba(255,255,255,0.07)" }} />
                        <div className="h-5 w-16 rounded-lg self-center" style={{ background: `${c1}20`, border: `1px solid ${c1}40` }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="pricing" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#34d399" }}>Pricing</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Simple, transparent pricing</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { name: "Starter", price: "$19", features: ["1 Premium NFC Card", "Digital Profile", "Basic Analytics"], color: "#00e5ff", glow: "rgba(0,229,255,0.15)", highlight: false },
                { name: "Pro", price: "$49", features: ["5 Premium NFC Cards", "Lead Capture CRM", "Custom Branding", "Export to CSV"], color: "#a855f7", glow: "rgba(168,85,247,0.25)", highlight: true },
                { name: "Enterprise", price: "Custom", features: ["Unlimited Cards", "API Access", "Dedicated Manager", "SSO"], color: "#ec4899", glow: "rgba(236,72,153,0.15)", highlight: false },
              ].map((tier, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl p-7 flex flex-col relative overflow-hidden"
                  style={{
                    background: tier.highlight ? `rgba(168,85,247,0.1)` : "rgba(255,255,255,0.04)",
                    backdropFilter: "blur(16px)",
                    border: `1px solid ${tier.highlight ? "rgba(168,85,247,0.4)" : "rgba(255,255,255,0.07)"}`,
                    boxShadow: tier.highlight ? `0 0 40px rgba(168,85,247,0.15)` : "none",
                  }}
                >
                  {tier.highlight && (
                    <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(90deg, transparent, #a855f7, #00e5ff, transparent)" }} />
                  )}
                  {tier.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold" style={{ background: "linear-gradient(90deg, #a855f7, #00e5ff)", color: "#fff" }}>
                      POPULAR
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-white mb-2">{tier.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold" style={{ color: tier.color }}>{tier.price}</span>
                    {tier.price !== "Custom" && <span className="text-sm ml-1" style={{ color: "rgba(255,255,255,0.3)" }}>/mo</span>}
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {tier.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2.5 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                        <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: tier.color }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/admin/owners">
                    <button
                      className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                      style={tier.highlight
                        ? { background: "linear-gradient(135deg, #a855f7, #00e5ff)", boxShadow: `0 0 20px ${tier.glow}` }
                        : { background: "rgba(255,255,255,0.06)", border: `1px solid ${tier.color}30` }
                      }
                    >
                      {tier.price === "Custom" ? "Contact Sales" : "Get Started"}
                    </button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section className="py-24" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="max-w-lg mx-auto px-6">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#f97316" }}>Contact</p>
              <h2 className="text-3xl font-bold text-white">Ready to upgrade?</h2>
            </div>
            <div className="rounded-2xl p-7" style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                  {["First Name", "Last Name"].map((l) => (
                    <div key={l} className="space-y-1.5">
                      <label className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>{l}</label>
                      <Input className="text-white border-white/10 focus:border-orange-500/50 h-9" style={{ background: "rgba(255,255,255,0.05)" }} />
                    </div>
                  ))}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>Email</label>
                  <Input type="email" className="text-white border-white/10 focus:border-orange-500/50 h-9" style={{ background: "rgba(255,255,255,0.05)" }} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>Message</label>
                  <Textarea className="text-white border-white/10 focus:border-orange-500/50 resize-none" rows={3} style={{ background: "rgba(255,255,255,0.05)" }} />
                </div>
                <button
                  type="button"
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-white mt-2"
                  style={{ background: "linear-gradient(135deg, #f97316, #ec4899)", boxShadow: "0 0 20px rgba(249,115,22,0.3)" }}
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-12" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.3)" }}>
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #a855f7, #00e5ff)" }}>
                <span className="text-xs font-black text-white">V</span>
              </div>
              <span className="text-base font-bold tracking-[0.2em]" style={{ background: "linear-gradient(90deg, #a855f7, #00e5ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>VELOXA</span>
            </div>
            <p className="text-sm max-w-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
              Premium NFC business cards and intelligent lead capture software for modern professionals.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-2 text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
              <li><Link href="/admin/leads" className="hover:text-white transition-colors">Admin CRM</Link></li>
              <li><Link href="/admin/owners" className="hover:text-white transition-colors">Manage Owners</Link></li>
              <li><Link href="/admin/sponsors" className="hover:text-white transition-colors">Sponsors</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
              <li><span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-10 pt-6 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>© 2026 VELOXA. All rights reserved.</p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.15)" }}>Built with ✦</p>
        </div>
      </footer>
    </div>
  );
}

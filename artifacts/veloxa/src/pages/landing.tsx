import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  CreditCard, 
  Smartphone, 
  Zap, 
  ShieldCheck, 
  BarChart3, 
  Layers, 
  ArrowRight,
  CheckCircle2
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-foreground selection:bg-primary selection:text-primary-foreground font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold tracking-widest text-white">VELOXA</div>
          <Link href="/admin/owners">
            <Button variant="secondary" className="bg-white text-black hover:bg-white/90">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,_var(--tw-gradient-stops))] from-zinc-800/40 via-[#0a0a0a] to-[#0a0a0a] -z-10" />
          
          <div className="max-w-7xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="space-y-8"
            >
              <h1 className="text-5xl md:text-7xl font-light tracking-tight text-white max-w-4xl mx-auto leading-tight">
                The modern standard for <br />
                <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-500">
                  smart networking.
                </span>
              </h1>
              
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto font-light">
                Premium NFC business cards seamlessly integrated with a powerful lead capture CRM. Elevate your first impression.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/u/VX-DEMO001">
                  <Button size="lg" className="h-14 px-8 text-base bg-white text-black hover:bg-white/90 rounded-full group">
                    Try the Demo
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="#pricing">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-base border-white/10 hover:bg-white/5 rounded-full">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 bg-zinc-950">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-light tracking-tight text-white">How it works</h2>
              <p className="text-zinc-400 mt-4 max-w-xl mx-auto">Three simple steps to transform your networking.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12 relative">
              <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
              
              {[
                {
                  icon: CreditCard,
                  title: "1. Admin Provisions",
                  desc: "Cards are registered and assigned to owners instantly in the VELOXA dashboard."
                },
                {
                  icon: Smartphone,
                  title: "2. Owner Taps",
                  desc: "Tap the premium NFC card to any smartphone to share a digital profile."
                },
                {
                  icon: Zap,
                  title: "3. Sponsor Captures",
                  desc: "New connections submit their details, flowing directly into the sponsor CRM."
                }
              ].map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="relative z-10 bg-zinc-950 p-6 rounded-2xl border border-white/5 text-center"
                >
                  <div className="w-16 h-16 mx-auto bg-zinc-900 rounded-full flex items-center justify-center border border-white/10 mb-6">
                    <step.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">{step.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Value Props - Split */}
        <section className="py-24 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <ShieldCheck className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-3xl font-light text-white mb-4">For Owners</h3>
                <ul className="space-y-4">
                  {[
                    "Sleek digital profile with social links",
                    "No app required for recipients",
                    "Update information instantly",
                    "Premium metal or matte card options"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center text-zinc-300">
                      <CheckCircle2 className="h-5 w-5 mr-3 text-blue-400/70" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                <BarChart3 className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-3xl font-light text-white mb-4">For Sponsors</h3>
                <ul className="space-y-4">
                  {[
                    "Direct lead flow from owner interactions",
                    "Categorize and qualify leads instantly",
                    "Measure ROI of networking events",
                    "Export to existing CRM systems"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center text-zinc-300">
                      <CheckCircle2 className="h-5 w-5 mr-3 text-purple-400/70" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Dashboard Mockup */}
        <section className="py-32 overflow-hidden bg-zinc-950">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light tracking-tight text-white mb-4">Powerful Lead Engine</h2>
              <p className="text-xl text-zinc-400">Manage connections with an intuitive, dark-mode first dashboard.</p>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative mx-auto max-w-5xl rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl overflow-hidden aspect-[16/9] flex items-center justify-center"
            >
              {/* Minimalist abstract mockup of the CRM */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
              <div className="absolute top-0 w-full h-12 border-b border-white/5 bg-zinc-950/50 flex items-center px-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
                  <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
                  <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
                </div>
              </div>
              <div className="absolute left-0 top-12 bottom-0 w-48 border-r border-white/5 bg-zinc-950/30 p-4 space-y-4">
                <div className="h-4 w-24 bg-zinc-800 rounded"></div>
                <div className="h-4 w-32 bg-zinc-800 rounded"></div>
                <div className="h-4 w-20 bg-zinc-800 rounded"></div>
              </div>
              <div className="absolute left-48 top-12 right-0 bottom-0 p-8">
                <div className="h-8 w-48 bg-zinc-800 rounded mb-8"></div>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="h-24 bg-zinc-900 border border-white/5 rounded-lg"></div>
                  <div className="h-24 bg-zinc-900 border border-white/5 rounded-lg"></div>
                  <div className="h-24 bg-zinc-900 border border-white/5 rounded-lg"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-12 bg-zinc-900 border border-white/5 rounded-lg w-full"></div>
                  <div className="h-12 bg-zinc-900 border border-white/5 rounded-lg w-full"></div>
                  <div className="h-12 bg-zinc-900 border border-white/5 rounded-lg w-full"></div>
                </div>
              </div>
              
              <div className="relative z-10 bg-black/60 backdrop-blur-sm p-6 rounded-xl border border-white/10 flex items-center gap-4">
                <Layers className="h-8 w-8 text-white" />
                <span className="text-xl font-medium tracking-widest text-white">VELOXA CRM</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-light tracking-tight text-white">Simple, transparent pricing</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  name: "Starter",
                  price: "$19",
                  features: ["1 Premium NFC Card", "Digital Profile", "Basic Analytics"],
                },
                {
                  name: "Pro",
                  price: "$49",
                  highlight: true,
                  features: ["5 Premium NFC Cards", "Lead Capture CRM", "Custom Branding", "Export to CSV"],
                },
                {
                  name: "Enterprise",
                  price: "Custom",
                  features: ["Unlimited Cards", "API Access", "Dedicated Success Manager", "SSO"],
                }
              ].map((tier, i) => (
                <div key={i} className={`rounded-2xl p-8 border ${tier.highlight ? 'border-zinc-400 bg-zinc-900' : 'border-white/10 bg-[#0a0a0a]'} flex flex-col`}>
                  <h3 className="text-xl font-medium text-white mb-2">{tier.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-light text-white">{tier.price}</span>
                    {tier.price !== "Custom" && <span className="text-zinc-500">/mo</span>}
                  </div>
                  <ul className="space-y-4 mb-8 flex-1">
                    {tier.features.map((feature, j) => (
                      <li key={j} className="flex items-center text-sm text-zinc-300">
                        <CheckCircle2 className="h-4 w-4 mr-3 text-zinc-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button variant={tier.highlight ? "default" : "outline"} className={tier.highlight ? "bg-white text-black hover:bg-white/90" : "border-white/20 text-white hover:bg-white/5"}>
                    {tier.price === "Custom" ? "Contact Sales" : "Get Started"}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-24 bg-zinc-950 border-t border-white/5">
          <div className="max-w-xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-light tracking-tight text-white mb-8">Ready to upgrade?</h2>
            <form className="space-y-4 text-left" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-zinc-400">First Name</label>
                  <Input className="bg-[#0a0a0a] border-white/10 text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-zinc-400">Last Name</label>
                  <Input className="bg-[#0a0a0a] border-white/10 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Email</label>
                <Input type="email" className="bg-[#0a0a0a] border-white/10 text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Message</label>
                <Textarea className="bg-[#0a0a0a] border-white/10 text-white min-h-[120px]" />
              </div>
              <Button type="button" className="w-full h-12 mt-4 bg-white text-black hover:bg-white/90">
                Send Message
              </Button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0a0a0a] py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="text-2xl font-bold tracking-widest text-white mb-4">VELOXA</div>
            <p className="text-zinc-500 text-sm max-w-xs">
              Premium NFC business cards and intelligent lead capture software for modern professionals.
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link href="/admin/leads" className="hover:text-white transition-colors">Admin CRM</Link></li>
              <li><Link href="/admin/owners" className="hover:text-white transition-colors">Manage Owners</Link></li>
              <li><Link href="/admin/sponsors" className="hover:text-white transition-colors">Sponsor Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
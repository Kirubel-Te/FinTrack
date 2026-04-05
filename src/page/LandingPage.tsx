import { 
  TrendingUp, 
  ReceiptText, 
  Wallet, 
  CheckCircle, 
  Sparkles, 
  ShieldCheck, 
  Bot,
  Share2,
  Globe,
  Play
} from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin?: () => void;
}

export function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-emerald-zenith-bg text-emerald-zenith-text selection:bg-emerald-zenith-primary/30 font-body overflow-x-hidden">
      {/* TopAppBar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-emerald-zenith-bg/80 backdrop-blur-xl border-b border-emerald-900/30">
        <div className="flex justify-between items-center w-full px-8 h-16 max-w-7xl mx-auto">
          <div className="flex flex-col">
            <div className="text-2xl font-black text-emerald-zenith-primary tracking-tighter leading-none">FinTrack</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-100/40">Financial Sanctuary</div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
            <a className="text-emerald-zenith-primary border-b-2 border-emerald-zenith-primary pb-1" href="#features">Features</a>
            <a className="text-emerald-zenith-text-muted hover:text-emerald-zenith-primary transition-colors" href="#how-it-works">How it Works</a>
            <a className="text-emerald-zenith-text-muted hover:text-emerald-zenith-primary transition-colors" href="#benefits">Benefits</a>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onLogin ?? onGetStarted}
              className="px-5 py-2 rounded-lg font-bold text-emerald-zenith-text-muted hover:text-emerald-zenith-primary transition-all text-sm"
            >
              Login
            </button>
            <button 
              onClick={onGetStarted}
              className="bg-emerald-zenith-primary text-emerald-zenith-accent px-6 py-2 rounded-xl font-bold transition-all hover:brightness-110 active:scale-95 shadow-lg shadow-emerald-500/20 text-sm"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative px-8 pt-20 pb-24 max-w-7xl mx-auto overflow-hidden">
          {/* Atmospheric Depth Background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.15)_0%,transparent_70%)] -z-10" />
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="text-xs font-black tracking-[0.3em] uppercase text-emerald-zenith-primary mb-6 block">The Financial Sanctuary</span>
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-6 leading-[0.98] text-emerald-zenith-text">
                Master Your Money with <span className="text-emerald-400">Editorial Precision.</span>
              </h1>
              <p className="text-lg text-emerald-zenith-text-muted max-w-xl mb-9 leading-relaxed font-medium">
                The sanctuary for modern wealth tracking. Monitor income, manage budgets, and grow your stability with FinTrack.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={onGetStarted}
                  className="bg-emerald-zenith-primary text-emerald-zenith-accent px-8 py-3.5 rounded-xl font-black text-base hover:brightness-110 active:scale-95 transition-all shadow-2xl shadow-emerald-500/30"
                >
                  Get Started
                </button>
                <button className="border border-emerald-900/20 px-8 py-3.5 rounded-xl font-black text-base hover:bg-emerald-zenith-surface-high transition-all text-emerald-zenith-text flex items-center gap-2">
                  <Play className="w-5 h-5 fill-current" />
                  Watch Demo
                </button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative group"
            >
              <div className="relative aspect-[1.05/1] flex items-center justify-center">
                <div className="absolute inset-0 bg-emerald-zenith-primary/20 blur-[90px] rounded-full animate-pulse" />
                <div className="relative w-full h-full bg-emerald-zenith-surface/65 backdrop-blur-3xl rounded-[2.2rem] overflow-hidden shadow-2xl p-5 flex flex-col justify-between border border-emerald-900/30">
                  <img
                    alt="Modern finance workspace with analytics dashboards"
                    className="h-full w-full rounded-2xl object-cover"
                    src="https://images.unsplash.com/photo-1551281044-8b2d7c99ff4f?auto=format&fit=crop&w=1400&q=80"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute left-8 right-8 bottom-7 rounded-xl border border-emerald-900/30 bg-emerald-zenith-bg/70 backdrop-blur-md px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-zenith-text-muted">Live balance</p>
                      <p className="text-2xl font-black tracking-tight text-emerald-zenith-text">$124,592.00</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-emerald-zenith-primary flex items-center justify-center shadow-lg shadow-emerald-500/30">
                      <TrendingUp className="text-emerald-zenith-accent w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Bento Features */}
        <section id="features" className="px-8 py-32 bg-emerald-zenith-bg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-900/30 to-transparent" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-6 text-emerald-zenith-text">Crafted for Clarity</h2>
              <p className="text-emerald-zenith-text-muted max-w-2xl mx-auto text-lg font-medium leading-relaxed">
                Sophisticated tools designed to turn complex financial data into a peaceful landscape of wealth management.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[250px]">
              {/* Feature 1: Insightful Tracking */}
              <div className="md:col-span-8 rounded-3xl p-7 border border-emerald-900/10 flex flex-col justify-between group hover:border-emerald-zenith-primary/40 transition-all duration-500 overflow-hidden relative bg-emerald-zenith-surface">
                <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_82%_25%,rgba(52,211,153,0.16),transparent_52%)]" />
                <div className="max-w-md relative z-10">
                  <div className="w-12 h-12 bg-emerald-400/10 rounded-xl flex items-center justify-center mb-5">
                    <ReceiptText className="text-emerald-zenith-primary w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight mb-3 text-emerald-zenith-text">Insightful Tracking</h3>
                  <p className="text-sm text-emerald-zenith-text-muted font-medium leading-relaxed">Track spending by merchant, category, and account in one timeline so patterns are obvious at a glance.</p>
                </div>
                <div className="relative z-10 grid grid-cols-3 gap-3 max-w-md mt-4">
                  <div className="rounded-xl border border-emerald-900/25 bg-emerald-zenith-surface-high/70 p-3">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-emerald-zenith-text-muted">Food</p>
                    <p className="mt-1 text-sm font-bold text-emerald-zenith-text">$842</p>
                  </div>
                  <div className="rounded-xl border border-emerald-900/25 bg-emerald-zenith-surface-high/70 p-3">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-emerald-zenith-text-muted">Travel</p>
                    <p className="mt-1 text-sm font-bold text-emerald-zenith-text">$290</p>
                  </div>
                  <div className="rounded-xl border border-emerald-900/25 bg-emerald-zenith-surface-high/70 p-3">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-emerald-zenith-text-muted">Bills</p>
                    <p className="mt-1 text-sm font-bold text-emerald-zenith-text">$1,120</p>
                  </div>
                </div>
              </div>

              {/* Feature 2: Visual Wealth */}
              <div className="md:col-span-4 bg-emerald-zenith-primary rounded-3xl p-7 flex flex-col justify-between text-emerald-zenith-accent group hover:brightness-110 transition-all duration-500 shadow-2xl shadow-emerald-500/10">
                <div className="w-12 h-12 bg-emerald-zenith-accent/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="text-emerald-zenith-accent w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold tracking-tight mb-3 leading-none">Visual Wealth</h3>
                  <p className="text-emerald-zenith-accent/70 font-medium text-sm">Cinematic charts and graphs that make your progress undeniable and beautiful.</p>
                </div>
              </div>

              {/* Feature 3: Strategic Budgets */}
              <div className="md:col-span-5 bg-emerald-zenith-surface-high rounded-3xl p-7 border border-emerald-900/10 flex flex-col justify-center group hover:bg-emerald-zenith-surface-highest transition-all duration-300">
                <div className="w-12 h-12 bg-emerald-400/10 rounded-xl flex items-center justify-center mb-5">
                  <Wallet className="text-emerald-zenith-primary w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight mb-3 text-emerald-zenith-text">Strategic Budgets</h3>
                <p className="text-sm text-emerald-zenith-text-muted font-medium leading-relaxed">Define your boundaries. Grow your sanctuary. Master your spending with granular control.</p>
              </div>

              {/* Feature 4: Actionable Analytics */}
              <div className="md:col-span-7 rounded-3xl p-7 flex items-center gap-6 group border border-emerald-900/30 bg-emerald-zenith-surface/75 backdrop-blur-3xl overflow-hidden relative">
                <div className="absolute inset-0 opacity-55 bg-[radial-gradient(circle_at_90%_18%,rgba(47,184,223,0.22),transparent_46%)]" />
                <div className="flex-1">
                  <div className="w-12 h-12 bg-emerald-400/10 rounded-xl flex items-center justify-center mb-5">
                    <TrendingUp className="text-emerald-zenith-primary w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight mb-3 text-emerald-zenith-text relative z-10">Actionable Analytics</h3>
                  <p className="text-sm text-emerald-zenith-text-muted font-medium relative z-10 leading-relaxed">Get trend alerts and concrete actions like reduce category overspend, shift saving targets, and rebalance monthly budgets.</p>
                </div>
                <div className="hidden sm:flex flex-col justify-center gap-2 w-44 rounded-2xl border border-emerald-400/15 bg-emerald-zenith-bg/45 p-3 relative z-10">
                  <div className="h-2 rounded-full bg-emerald-zenith-primary/25 w-[72%]" />
                  <div className="h-2 rounded-full bg-emerald-zenith-secondary/30 w-[54%]" />
                  <div className="h-2 rounded-full bg-emerald-zenith-primary/20 w-[84%]" />
                  <div className="mt-2 rounded-lg border border-emerald-900/25 bg-emerald-zenith-surface-high/70 p-2">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-emerald-zenith-text-muted">Forecast</p>
                    <p className="text-sm font-bold text-emerald-zenith-text">+8.2% cash flow</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works (Steps) */}
        <section id="how-it-works" className="px-8 py-32 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-20 items-start">
            <div className="md:w-1/3">
              <h2 className="text-5xl font-extrabold tracking-tighter mb-8 leading-none text-emerald-zenith-text">A Journey to Stability.</h2>
              <p className="text-emerald-zenith-text-muted text-lg font-medium leading-relaxed">We've distilled wealth management into three effortless, cinematic movements.</p>
            </div>
            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-12">
              {[
                { step: "01", title: "Record activity", desc: "Connect your accounts or log manually with our intuitive sidebar interface." },
                { step: "02", title: "Monitor flow", desc: "Watch as your financial ecosystem comes to life in real-time with bento analytics." },
                { step: "03", title: "Optimize wealth", desc: "Use precision tools to refine your budget and accelerate your growth exponentially." }
              ].map((item, i) => (
                <div key={i} className="relative group">
                  <div className="text-6xl font-black text-emerald-zenith-primary/10 mb-8 transition-colors group-hover:text-emerald-zenith-primary/20">{item.step}</div>
                  <h4 className="text-2xl font-bold mb-4 text-emerald-zenith-text tracking-tight">{item.title}</h4>
                  <p className="text-emerald-zenith-text-muted font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dashboard Preview Section */}
        <section className="px-8 py-32 bg-emerald-zenith-bg">
          <div className="max-w-7xl mx-auto rounded-[3rem] border border-emerald-900/30 bg-emerald-zenith-surface p-8 md:p-16 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-zenith-primary to-transparent" />
            <div className="grid lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-5 space-y-10">
                <h2 className="text-5xl font-extrabold tracking-tighter text-emerald-zenith-text leading-none">The Dashboard Experience</h2>
                <div className="p-10 bg-emerald-zenith-surface-high rounded-3xl border border-emerald-900/20 shadow-xl">
                  <p className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-2">Current Sanctuary Balance</p>
                  <p className="text-5xl font-black tracking-tighter text-emerald-zenith-text">$142,850.42</p>
                  <div className="mt-6 flex items-center gap-3 text-emerald-zenith-primary bg-emerald-zenith-primary/10 w-fit px-4 py-1.5 rounded-full">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-sm font-black">+12.4% this month</span>
                  </div>
                </div>
                <ul className="space-y-6">
                  {[
                    "High-fidelity chart visualization",
                    "Multi-currency support",
                    "Real-time transaction feed"
                  ].map((text, i) => (
                    <li key={i} className="flex items-center gap-4 text-emerald-zenith-text-muted text-lg font-semibold">
                      <CheckCircle className="text-emerald-zenith-primary w-6 h-6" />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:col-span-7">
                <div className="bg-emerald-zenith-surface-high rounded-3xl border border-emerald-900/30 p-6 shadow-2xl relative">
                  <div className="flex gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <img 
                    alt="Dashboard Core UI" 
                    className="rounded-2xl w-full h-auto shadow-inner" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVkriHBkRtCifozYpZobn83F5nBfVPLjvYM8mxyuaH7x8ceRyv7J1sRYUozev_UTuDTVo23VHWy6krWGnj_SatPKrTe5UT7svO4sdPj1JlkOcBMwIf0HfKucMLe-k4dzLga9sIFptIpYHXjt-LNE-UtodOrGNuQg6rqtolkc2FILDBkbnNwleEkW4KmED1tE0Dz_iw-BfefOrV1CaZDQFAOwR4vuOkgemcHb8Ofe-7862jHIRqEyGdILs3ovt24yAE6HsP1x1IguE" 
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="px-8 py-32 max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-24 text-emerald-zenith-text">Why FinTrack?</h2>
          <div className="grid md:grid-cols-3 gap-16">
            {[
              { icon: Sparkles, title: "Stay organized", desc: "Centralize every account, card, and investment into one cohesive, peaceful sanctuary." },
              { icon: ShieldCheck, title: "Avoid overspending", desc: "Intelligent alerts and real-time spending limits keep your financial health on track effortlessly." },
              { icon: Bot, title: "Smarter decisions", desc: "Leverage deep data to understand exactly where your wealth can grow the most for the future." }
            ].map((item, i) => (
              <div key={i} className="p-10 rounded-3xl bg-emerald-zenith-surface-low border border-emerald-900/10 group hover:border-emerald-zenith-primary/40 transition-all">
                <div className="w-20 h-20 bg-emerald-zenith-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-10 group-hover:scale-110 transition-transform">
                  <item.icon className="text-emerald-zenith-primary w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-emerald-zenith-text tracking-tight">{item.title}</h3>
                <p className="text-emerald-zenith-text-muted font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-8 pb-32">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-emerald-900/80 to-emerald-zenith-surface-high rounded-[4rem] p-16 md:p-24 text-center relative overflow-hidden border border-emerald-900/20 shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent)]" />
            <div className="relative z-10">
              <h2 className="text-5xl md:text-6xl font-extrabold mb-8 tracking-tighter leading-tight text-emerald-zenith-text">Start managing your finances today</h2>
              <p className="text-xl text-emerald-100/60 mb-12 max-w-2xl mx-auto font-medium">Join thousands of curators who have found their financial peace within the sanctuary.</p>
              <button 
                onClick={onGetStarted}
                className="bg-emerald-zenith-primary text-emerald-zenith-accent px-12 py-6 rounded-2xl font-black text-2xl hover:brightness-110 active:scale-95 transition-all shadow-2xl shadow-emerald-500/40"
              >
                Create Free Account
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-emerald-zenith-bg border-t border-emerald-900/10">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-8 py-16 max-w-7xl mx-auto gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="text-2xl font-black text-emerald-zenith-primary tracking-tighter">FinTrack</div>
            <p className="text-sm font-medium text-emerald-zenith-text-muted">© 2024 FinTrack. The Financial Sanctuary.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-10 text-sm font-bold">
            <a className="text-emerald-zenith-text-muted hover:text-emerald-zenith-primary transition-colors" href="#">Privacy Policy</a>
            <a className="text-emerald-zenith-text-muted hover:text-emerald-zenith-primary transition-colors" href="#">Terms of Service</a>
            <a className="text-emerald-zenith-text-muted hover:text-emerald-zenith-primary transition-colors" href="#">Security</a>
            <a className="text-emerald-zenith-text-muted hover:text-emerald-zenith-primary transition-colors" href="#">Contact Us</a>
          </div>
          <div className="flex gap-8">
            <a className="text-emerald-400/50 hover:text-emerald-400 transition-all" href="#"><Share2 className="w-6 h-6" /></a>
            <a className="text-emerald-400/50 hover:text-emerald-400 transition-all" href="#"><Globe className="w-6 h-6" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

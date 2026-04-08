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
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

const navItems = [
  { label: 'Features', icon: ReceiptText, href: '#hero', sectionId: 'hero' },
  { label: 'How it Works', icon: TrendingUp, href: '#how-it-works', sectionId: 'how-it-works' },
  { label: 'Benefits', icon: CheckCircle, href: '#benefits', sectionId: 'benefits' },
];

const NAV_SCROLL_OFFSET = 96;
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const sectionReveal = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: EASE_OUT },
};

const staggerReveal = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const cardReveal = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE_OUT },
  },
};

const footerReveal = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.5, ease: EASE_OUT },
};

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin?: () => void;
}

export function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  const [activeSection, setActiveSection] = useState<string>(navItems[0].sectionId);

  useEffect(() => {
    const sectionElements = navItems
      .map((item) => document.getElementById(item.sectionId))
      .filter((element): element is HTMLElement => element !== null);

    if (sectionElements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

        if (visibleEntry?.target.id) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        rootMargin: '-35% 0px -45% 0px',
        threshold: [0.15, 0.3, 0.45, 0.6],
      }
    );

    sectionElements.forEach((element) => observer.observe(element));

    const firstSectionId = navItems[0].sectionId;
    const firstSectionTop = sectionElements[0].offsetTop - NAV_SCROLL_OFFSET;
    const handleWindowScroll = () => {
      if (window.scrollY < firstSectionTop - 8) {
        setActiveSection(firstSectionId);
      }
    };

    const currentHash = window.location.hash.replace('#', '');
    if (navItems.some((item) => item.sectionId === currentHash)) {
      setActiveSection(currentHash);
    } else {
      setActiveSection(firstSectionId);
    }

    window.addEventListener('scroll', handleWindowScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleWindowScroll);
    };
  }, []);

  const handleNavClick = (sectionId: string) => {
    const sectionElement = document.getElementById(sectionId);

    if (!sectionElement) {
      return;
    }

    const scrollTarget = sectionElement.getBoundingClientRect().top + window.scrollY - NAV_SCROLL_OFFSET;
    window.scrollTo({ top: Math.max(scrollTarget, 0), behavior: 'smooth' });
    window.history.replaceState(null, '', `#${sectionId}`);
    setActiveSection(sectionId);
  };

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
            {navItems.map((item) => {
              const isActive = activeSection === item.sectionId;

              return (
                <a
                  key={item.sectionId}
                  href={item.href}
                  aria-current={isActive ? 'location' : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    handleNavClick(item.sectionId);
                  }}
                  className={[
                    'rounded-full px-4 py-2 transition-all duration-300',
                    isActive
                      ? 'bg-emerald-zenith-primary/10 text-emerald-zenith-primary shadow-[0_0_0_1px_rgba(52,211,153,0.18)]'
                      : 'text-emerald-zenith-text-muted hover:bg-white/5 hover:text-emerald-zenith-text',
                  ].join(' ')}
                >
                  <span className="inline-flex items-center gap-2">
                    <item.icon className="h-3.5 w-3.5" />
                    <span>{item.label}</span>
                  </span>
                </a>
              );
            })}
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
        <section id="hero" className="scroll-mt-24 relative mx-auto max-w-7xl overflow-hidden px-8 pb-24 pt-20">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_14%_10%,rgba(52,211,153,0.14),transparent_36%),radial-gradient(circle_at_86%_80%,rgba(47,184,223,0.11),transparent_34%)]" />

          <div className="grid items-center gap-12 lg:grid-cols-[1.04fr_0.96fr]">
            <motion.div
              initial={{ opacity: 0, x: -36 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75, ease: 'easeOut' }}
              className="space-y-7"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-zenith-primary/25 bg-emerald-zenith-surface/45 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-zenith-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Meet FinTrack
              </div>

              <h1 className="max-w-2xl text-5xl font-black tracking-tighter leading-[0.96] text-emerald-zenith-text md:text-6xl">
                Your calm command center for daily money decisions.
              </h1>

              <p className="max-w-xl text-base md:text-lg leading-relaxed font-medium text-emerald-zenith-text-muted">
                FinTrack turns income, expenses, and budgets into a guided flow you can read in seconds. Start with clarity, stay consistent, and scale your financial confidence.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={onGetStarted}
                  className="inline-flex items-center justify-center rounded-2xl bg-emerald-zenith-primary px-8 py-3.5 text-base font-black text-emerald-zenith-accent transition-all hover:brightness-110 active:scale-95 shadow-2xl shadow-emerald-500/35"
                >
                  Get Started
                </button>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 rounded-2xl border border-emerald-900/25 bg-emerald-zenith-surface/55 px-7 py-3.5 text-base font-bold text-emerald-zenith-text transition-all hover:border-emerald-zenith-primary/45 hover:bg-emerald-zenith-surface-high"
                >
                  <Play className="h-5 w-5 fill-current" />
                  Watch Product Tour
                </a>
              </div>

              <div className="grid max-w-2xl gap-3 sm:grid-cols-3">
                {[
                  { label: 'Setup Time', value: '3 min' },
                  { label: 'Focus Score', value: 'Clean UI' },
                  { label: 'Flow', value: 'Real-time' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-emerald-900/20 bg-emerald-zenith-surface/55 px-4 py-3 backdrop-blur-sm">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-zenith-text-muted">{item.label}</p>
                    <p className="mt-1 text-sm font-black text-emerald-zenith-text">{item.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
              className="relative"
            >
              <div className="absolute -top-14 -right-12 h-56 w-56 rounded-full bg-emerald-zenith-primary/20 blur-[110px]" />
              <div className="absolute -bottom-16 -left-14 h-64 w-64 rounded-full bg-emerald-zenith-secondary/16 blur-[120px]" />

              <div className="relative overflow-hidden rounded-4xl border border-emerald-900/25 bg-emerald-zenith-surface/75 p-4 shadow-2xl backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between rounded-2xl border border-emerald-900/20 bg-emerald-zenith-bg/55 px-4 py-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-zenith-text-muted">Live balance</p>
                    <p className="text-xl font-black tracking-tight text-emerald-zenith-text">$124,592.00</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-zenith-primary text-emerald-zenith-accent shadow-lg shadow-emerald-500/30">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>

                <img
                  alt="Modern finance workspace with analytics dashboards"
                  className="h-full w-full rounded-3xl border border-emerald-900/20 object-cover shadow-inner"
                  src="https://images.pexels.com/photos/6693655/pexels-photo-6693655.jpeg?auto=compress&cs=tinysrgb&w=1600"
                  referrerPolicy="no-referrer"
                />

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-emerald-900/20 bg-emerald-zenith-bg/60 p-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-zenith-text-muted">Weekly Review</p>
                    <p className="mt-1 text-sm font-bold text-emerald-zenith-text">Budget health: Stable</p>
                  </div>
                  <div className="rounded-2xl border border-emerald-900/20 bg-emerald-zenith-bg/60 p-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-zenith-text-muted">Top Category</p>
                    <p className="mt-1 text-sm font-bold text-emerald-zenith-text">Food and Dining</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Bento Features */}
        <motion.section
          id="features"
          className="scroll-mt-24 px-8 py-32 bg-emerald-zenith-bg relative overflow-hidden"
          {...sectionReveal}
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-emerald-900/30 to-transparent" />
          <div className="absolute -top-16 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-emerald-zenith-primary/10 blur-[100px]" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="mb-14 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-zenith-primary/20 bg-emerald-zenith-surface/45 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-zenith-primary">
                  <ReceiptText className="h-3.5 w-3.5" />
                  Crafted for Clarity
                </span>
                <h2 className="mt-5 text-4xl md:text-5xl font-black tracking-tighter leading-[0.95] text-emerald-zenith-text">
                  Financial control, presented as a clean visual narrative.
                </h2>
              </div>

              <div className="rounded-3xl border border-emerald-900/20 bg-emerald-zenith-surface/70 p-6 backdrop-blur-xl">
                <p className="text-base md:text-lg font-medium leading-relaxed text-emerald-zenith-text-muted">
                  FinTrack transforms busy financial logs into signals you can act on instantly. Less noise, clearer context, and smarter next moves.
                </p>
              </div>
            </div>

            <motion.div
              className="grid grid-cols-1 gap-6 md:grid-cols-12 auto-rows-[230px]"
              variants={staggerReveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.16 }}
            >
              <motion.div variants={cardReveal} className="relative overflow-hidden rounded-3xl border border-emerald-900/20 bg-emerald-zenith-surface p-7 md:col-span-7 md:row-span-2">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(52,211,153,0.16),transparent_50%)]" />
                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-zenith-primary/10">
                      <ReceiptText className="h-6 w-6 text-emerald-zenith-primary" />
                    </div>
                    <h3 className="mt-5 text-3xl font-black tracking-tight text-emerald-zenith-text">Insightful Tracking</h3>
                    <p className="mt-3 max-w-lg text-sm leading-relaxed font-medium text-emerald-zenith-text-muted">
                      Follow every transaction across categories, accounts, and merchants in one timeline designed for quick interpretation.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 max-w-md">
                    {[
                      { label: 'Food', value: '$842', tone: 'bg-emerald-zenith-primary/20' },
                      { label: 'Travel', value: '$290', tone: 'bg-emerald-zenith-secondary/30' },
                      { label: 'Bills', value: '$1,120', tone: 'bg-emerald-zenith-warning/35' },
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl border border-emerald-900/25 bg-emerald-zenith-bg/55 p-3">
                        <div className="mb-2 h-1.5 rounded-full bg-emerald-zenith-surface-high overflow-hidden">
                          <div className={['h-full rounded-full', item.tone].join(' ')} />
                        </div>
                        <p className="text-[10px] uppercase tracking-[0.14em] text-emerald-zenith-text-muted">{item.label}</p>
                        <p className="mt-1 text-sm font-black text-emerald-zenith-text">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div variants={cardReveal} className="rounded-3xl bg-emerald-zenith-primary p-7 text-emerald-zenith-accent md:col-span-5">
                <div className="flex h-full flex-col justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-zenith-accent/10">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight">Visual Wealth</h3>
                    <p className="mt-3 text-sm font-semibold leading-relaxed text-emerald-zenith-accent/75">
                      Cinematic charts and KPI cards that make momentum obvious at first glance.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={cardReveal} className="rounded-3xl border border-emerald-900/20 bg-emerald-zenith-surface-high p-7 md:col-span-5">
                <div className="flex h-full flex-col justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-zenith-primary/12">
                    <Wallet className="h-6 w-6 text-emerald-zenith-primary" />
                  </div>
                  <h3 className="mt-5 text-2xl font-black tracking-tight text-emerald-zenith-text">Strategic Budgets</h3>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-emerald-zenith-text-muted">
                    Shape spending boundaries with intention and keep each category accountable.
                  </p>
                </div>
              </motion.div>

              <motion.div variants={cardReveal} className="relative overflow-hidden rounded-3xl border border-emerald-900/25 bg-emerald-zenith-surface/80 p-7 md:col-span-12">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_16%,rgba(47,184,223,0.22),transparent_48%)]" />
                <div className="relative z-10 grid h-full gap-5 sm:grid-cols-[1fr_auto] sm:items-center lg:grid-cols-[1.2fr_0.8fr]">
                  <div className="max-w-none">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-zenith-primary/10">
                      <TrendingUp className="h-6 w-6 text-emerald-zenith-primary" />
                    </div>
                    <h3 className="mt-4 text-2xl font-black tracking-tight text-emerald-zenith-text">Actionable Analytics</h3>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-emerald-zenith-text-muted">
                      Instant guidance highlights overspending risk, savings opportunities, and rebalance suggestions.
                    </p>
                  </div>

                  <div className="h-full w-full rounded-2xl border border-emerald-900/20 bg-emerald-zenith-bg/50 p-3 sm:max-w-55 lg:max-w-none">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-emerald-zenith-text-muted">Forecast Engine</p>
                    <p className="mt-1 text-sm font-black text-emerald-zenith-text">+8.2% cash flow</p>
                    <div className="mt-3 space-y-2">
                      <div className="h-2 rounded-full bg-emerald-zenith-primary/25 w-[72%]" />
                      <div className="h-2 rounded-full bg-emerald-zenith-secondary/30 w-[54%]" />
                      <div className="h-2 rounded-full bg-emerald-zenith-primary/20 w-[84%]" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* How It Works (Steps) */}
        <motion.section
          id="how-it-works"
          className="scroll-mt-24 px-8 py-32 max-w-7xl mx-auto"
          {...sectionReveal}
        >
          <div className="flex flex-col md:flex-row gap-20 items-start">
            <div className="md:w-1/3">
              <h2 className="text-5xl font-extrabold tracking-tighter mb-8 leading-none text-emerald-zenith-text">A Journey to Stability.</h2>
              <p className="text-emerald-zenith-text-muted text-lg font-medium leading-relaxed">We've distilled wealth management into three effortless, cinematic movements.</p>
            </div>
            <motion.div
              className="md:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-12"
              variants={staggerReveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {[
                { step: "01", title: "Record activity", desc: "Connect your accounts or log manually with our intuitive sidebar interface." },
                { step: "02", title: "Monitor flow", desc: "Watch as your financial ecosystem comes to life in real-time with bento analytics." },
                { step: "03", title: "Optimize wealth", desc: "Use precision tools to refine your budget and accelerate your growth exponentially." }
              ].map((item, i) => (
                <motion.div key={i} variants={cardReveal} className="relative group">
                  <div className="text-6xl font-black text-emerald-zenith-primary/10 mb-8 transition-colors group-hover:text-emerald-zenith-primary/20">{item.step}</div>
                  <h4 className="text-2xl font-bold mb-4 text-emerald-zenith-text tracking-tight">{item.title}</h4>
                  <p className="text-emerald-zenith-text-muted font-medium leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Dashboard Preview Section */}
        <motion.section className="px-8 py-20 bg-emerald-zenith-bg" {...sectionReveal}>
          <div className="max-w-7xl mx-auto relative overflow-hidden rounded-[2.6rem] border border-emerald-900/25 bg-emerald-zenith-surface p-6 md:p-10 shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(52,211,153,0.14),transparent_36%),radial-gradient(circle_at_92%_88%,rgba(47,184,223,0.1),transparent_34%)]" />
            <div className="absolute top-0 left-0 h-1 w-full bg-linear-to-r from-transparent via-emerald-zenith-primary/85 to-transparent" />

            <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1fr_1.08fr]">
              <div className="space-y-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-zenith-primary/20 bg-emerald-zenith-bg/35 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-zenith-primary">
                  <ReceiptText className="h-3.5 w-3.5" />
                  Dashboard Experience
                </div>

                <h2 className="max-w-xl text-4xl md:text-[2.7rem] font-black tracking-tighter leading-[0.95] text-emerald-zenith-text">
                  A financial command center that feels calm and instantly actionable.
                </h2>

                <p className="max-w-xl text-base md:text-lg font-medium leading-relaxed text-emerald-zenith-text-muted">
                  Every metric, trend, and transaction is arranged for quick understanding. No noisy clutter, only clear signals to help you move money with confidence.
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { label: 'Sanctuary balance', value: '$142,850.42', icon: Wallet },
                    { label: 'Monthly momentum', value: '+12.4%', icon: TrendingUp },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-emerald-900/20 bg-emerald-zenith-bg/45 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-emerald-zenith-text-muted">{item.label}</p>
                          <p className="mt-2 text-xl font-black tracking-tight text-emerald-zenith-text">{item.value}</p>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-zenith-primary/12 text-emerald-zenith-primary">
                          <item.icon className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <ul className="space-y-3">
                  {[
                    'Precision analytics with real-time balance changes',
                    'Smart category signals for faster decisions',
                    'Clear budgeting lanes with less cognitive load',
                  ].map((text) => (
                    <li key={text} className="flex items-center gap-3 text-sm md:text-base font-semibold text-emerald-zenith-text-muted">
                      <CheckCircle className="h-5 w-5 text-emerald-zenith-primary" />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative">
                <div className="absolute -inset-6 rounded-[2.1rem] bg-emerald-zenith-primary/8 blur-3xl" />
                <div className="relative rounded-[2.1rem] border border-emerald-900/30 bg-emerald-zenith-bg/55 p-4 backdrop-blur-xl shadow-2xl">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-400/60" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                    </div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-zenith-text-muted">Live preview</p>
                  </div>

                  <img
                    alt="Modern dashboard analytics interface"
                    className="w-full rounded-2xl border border-emerald-900/20 shadow-inner"
                    src="https://images.pexels.com/photos/7947709/pexels-photo-7947709.jpeg?auto=compress&cs=tinysrgb&w=1600"
                    referrerPolicy="no-referrer"
                  />

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {[
                      { label: 'Income Flow', value: '+$8,420' },
                      { label: 'Expenses', value: '$3,115' },
                      { label: 'Savings', value: '$2,240' },
                    ].map((stat) => (
                      <div key={stat.label} className="rounded-xl border border-emerald-900/20 bg-emerald-zenith-surface-high/60 p-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-emerald-zenith-text-muted">{stat.label}</p>
                        <p className="mt-1 text-sm font-black text-emerald-zenith-text">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Benefits Section */}
        <motion.section
          id="benefits"
          className="scroll-mt-24 px-8 py-20 max-w-7xl mx-auto text-center"
          {...sectionReveal}
        >
          <h2 className="text-4xl md:text-[2.6rem] font-extrabold tracking-tighter mb-14 text-emerald-zenith-text">Why FinTrack?</h2>
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={staggerReveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {[
              { icon: Sparkles, title: "Stay organized", desc: "Centralize every account, card, and investment into one cohesive, peaceful sanctuary." },
              { icon: ShieldCheck, title: "Avoid overspending", desc: "Intelligent alerts and real-time spending limits keep your financial health on track effortlessly." },
              { icon: Bot, title: "Smarter decisions", desc: "Leverage deep data to understand exactly where your wealth can grow the most for the future." }
            ].map((item, i) => (
              <motion.div key={i} variants={cardReveal} className="p-7 rounded-3xl bg-emerald-zenith-surface-low border border-emerald-900/10 group hover:border-emerald-zenith-primary/40 transition-all">
                <div className="w-14 h-14 bg-emerald-zenith-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <item.icon className="text-emerald-zenith-primary w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-emerald-zenith-text tracking-tight">{item.title}</h3>
                <p className="text-sm text-emerald-zenith-text-muted font-medium leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Final CTA */}
        <motion.section className="px-8 pb-24 pt-8" {...sectionReveal}>
          <div className="max-w-7xl mx-auto relative overflow-hidden rounded-[2.4rem] border border-emerald-900/25 bg-emerald-zenith-surface/85 shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.18),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(47,184,223,0.12),transparent_36%)]" />
            <div className="absolute -top-24 -right-12 h-64 w-64 rounded-full bg-emerald-zenith-primary/20 blur-[120px]" />
            <div className="absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-emerald-zenith-secondary/15 blur-[130px]" />

            <div className="relative z-10 grid gap-10 p-8 md:p-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-zenith-primary/20 bg-emerald-zenith-bg/50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-zenith-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  Ready when you are
                </div>
                <h2 className="mt-5 text-4xl md:text-5xl font-black tracking-tighter leading-[0.96] text-emerald-zenith-text">
                  Start managing your finances today
                </h2>
                <p className="mt-5 max-w-xl text-base md:text-lg leading-relaxed text-emerald-zenith-text-muted font-medium">
                  Set up your money system in a space that feels calm, polished, and built for momentum. Track spending, shape budgets, and move with more clarity from day one.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <button 
                    onClick={onGetStarted}
                    className="inline-flex items-center justify-center rounded-2xl bg-emerald-zenith-primary px-7 py-4 text-sm font-black text-emerald-zenith-accent transition-all hover:brightness-110 active:scale-95 shadow-2xl shadow-emerald-500/35"
                  >
                    Create Free Account
                  </button>
                  <a
                    href="#features"
                    className="inline-flex items-center justify-center rounded-2xl border border-emerald-zenith-text/15 bg-emerald-zenith-bg/35 px-7 py-4 text-sm font-bold text-emerald-zenith-text transition-all hover:border-emerald-zenith-primary/40 hover:bg-emerald-zenith-primary/10 hover:text-emerald-zenith-primary"
                  >
                    Explore Features
                  </a>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {[
                    { title: '3 min setup', desc: 'Create your space without friction.' },
                    { title: 'Live visibility', desc: 'See money movement as it happens.' },
                    { title: 'Private by design', desc: 'Designed to feel secure and focused.' },
                  ].map((item) => (
                    <div key={item.title} className="rounded-2xl border border-emerald-900/20 bg-emerald-zenith-bg/45 px-4 py-4 backdrop-blur-sm">
                      <p className="text-sm font-black tracking-tight text-emerald-zenith-text">{item.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-emerald-zenith-text-muted">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 rounded-4xl bg-emerald-zenith-primary/10 blur-3xl" />
                <div className="relative rounded-4xl border border-emerald-900/25 bg-emerald-zenith-bg/60 p-5 shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center justify-between border-b border-emerald-900/20 pb-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-zenith-text-muted">Momentum snapshot</p>
                      <p className="mt-2 text-2xl font-black tracking-tight text-emerald-zenith-text">$12,480.22</p>
                    </div>
                    <div className="rounded-full border border-emerald-zenith-primary/20 bg-emerald-zenith-primary/10 px-3 py-1.5 text-xs font-bold text-emerald-zenith-primary">
                      +12.4% this month
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {[
                      { label: 'Budget pacing', value: '72%' },
                      { label: 'Savings goal', value: '91%' },
                      { label: 'Spending control', value: 'Excellent' },
                    ].map((item, index) => (
                      <div key={item.label} className="rounded-2xl border border-emerald-900/20 bg-emerald-zenith-surface/60 p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-emerald-zenith-text">{item.label}</p>
                            <p className="mt-1 text-xs text-emerald-zenith-text-muted">Weekly financial health update</p>
                          </div>
                          <p className="text-sm font-black text-emerald-zenith-primary">{item.value}</p>
                        </div>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-emerald-zenith-bg">
                          <div
                            className="h-full rounded-full bg-emerald-zenith-primary"
                            style={{ width: index === 0 ? '72%' : index === 1 ? '91%' : '100%' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-900/20 bg-emerald-zenith-surface-high/70 px-4 py-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-zenith-primary/10 text-emerald-zenith-primary">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-emerald-zenith-text">Everything ready for launch</p>
                      <p className="text-xs text-emerald-zenith-text-muted">Start with a clean dashboard and a focused workflow.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <motion.footer
        className="bg-emerald-zenith-bg border-t border-emerald-900/10"
        {...footerReveal}
      >
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
      </motion.footer>
    </div>
  );
}

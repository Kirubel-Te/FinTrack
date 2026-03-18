import { Wallet, ArrowRight, LogIn, UserPlus } from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useLocation } from 'react-router';

type HeroLocationState = {
  notice?: string;
};

export default function HeroPage() {
  const location = useLocation();
  const notice = (location.state as HeroLocationState | null)?.notice ?? null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-emerald-500/25 blur-[140px]" />
        <div className="absolute -bottom-32 -left-16 h-[22rem] w-[22rem] rounded-full bg-teal-400/20 blur-[120px]" />
        <div className="absolute -bottom-20 -right-10 h-[20rem] w-[20rem] rounded-full bg-cyan-300/15 blur-[110px]" />
      </div>

      <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-10">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-emerald-300/30 bg-emerald-500/10 px-4 py-2 backdrop-blur">
            <Wallet className="h-5 w-5 text-emerald-300" />
            <span className="text-sm font-semibold tracking-wide text-emerald-100">FinTrack</span>
          </div>

          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/90 transition hover:border-emerald-300/40 hover:text-emerald-200"
          >
            <LogIn className="h-4 w-4" />
            Log In
          </Link>
        </motion.header>

        <section className="my-auto grid gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center rounded-full border border-emerald-300/30 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
              Hero Placeholder
            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              A clean home base for your next FinTrack dashboard iteration.
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-slate-200/80 sm:text-lg">
              This is a temporary hero home page route. You can now keep auth flow pages isolated by URL while using this screen as the post-login landing point.
            </p>

            {notice && (
              <div className="max-w-2xl rounded-xl border border-emerald-300/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                {notice}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
              >
                <UserPlus className="h-4 w-4" />
                Create Account
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:border-emerald-300/40 hover:text-emerald-200"
              >
                Continue to Login
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="rounded-3xl border border-white/15 bg-white/[0.06] p-6 shadow-2xl backdrop-blur"
          >
            <h2 className="text-lg font-bold text-emerald-100">Route map</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-200/90">
              <li className="rounded-lg border border-white/10 bg-slate-900/40 px-3 py-2">/ - Hero placeholder (home)</li>
              <li className="rounded-lg border border-white/10 bg-slate-900/40 px-3 py-2">/login - Sign in page</li>
              <li className="rounded-lg border border-white/10 bg-slate-900/40 px-3 py-2">/register - Create account page</li>
            </ul>
          </motion.aside>
        </section>
      </main>
    </div>
  );
}

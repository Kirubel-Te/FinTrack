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
    <div className="relative min-h-screen overflow-hidden bg-emerald-zenith-bg text-emerald-zenith-text">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-120 w-120 -translate-x-1/2 rounded-full bg-emerald-zenith-primary/25 blur-[140px]" />
        <div className="absolute -bottom-32 -left-16 h-88 w-88 rounded-full bg-emerald-zenith-secondary/20 blur-[120px]" />
        <div className="absolute -bottom-20 -right-10 h-80 w-80 rounded-full bg-emerald-zenith-primary/15 blur-[110px]" />
      </div>

      <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-10">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-emerald-zenith-primary/30 bg-emerald-zenith-primary/10 px-4 py-2 backdrop-blur">
            <Wallet className="h-5 w-5 text-emerald-zenith-primary" />
            <span className="text-sm font-semibold tracking-wide text-emerald-zenith-text">FinTrack</span>
          </div>

          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-zenith-text/20 px-4 py-2 text-sm font-semibold text-emerald-zenith-text/90 transition hover:border-emerald-zenith-primary/40 hover:text-emerald-zenith-primary"
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
            <div className="inline-flex items-center rounded-full border border-emerald-zenith-primary/30 bg-emerald-zenith-surface/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-zenith-primary">
              Your Finance Starter
            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Build your money system before you even sign in.
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-emerald-zenith-text-muted sm:text-lg">
              Review how FinTrack works, then create your account or log in. Once authenticated, your dashboard lives under a dedicated app route.
            </p>

            {notice && (
              <div className="max-w-2xl rounded-xl border border-emerald-zenith-primary/40 bg-emerald-zenith-primary/10 px-4 py-3 text-sm text-emerald-zenith-text">
                {notice}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-zenith-primary px-5 py-3 text-sm font-bold text-emerald-zenith-accent transition hover:brightness-110"
              >
                <UserPlus className="h-4 w-4" />
                Create Account
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-zenith-text/25 px-5 py-3 text-sm font-semibold text-emerald-zenith-text transition hover:border-emerald-zenith-primary/40 hover:text-emerald-zenith-primary"
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
            className="rounded-3xl border border-emerald-zenith-text/15 bg-emerald-zenith-surface/75 p-6 shadow-2xl backdrop-blur"
          >
            <h2 className="text-lg font-bold text-emerald-zenith-text">Route map</h2>
            <ul className="mt-4 space-y-3 text-sm text-emerald-zenith-text-muted">
              <li className="rounded-lg border border-emerald-zenith-text/10 bg-emerald-zenith-bg/45 px-3 py-2">/ - Landing page</li>
              <li className="rounded-lg border border-emerald-zenith-text/10 bg-emerald-zenith-bg/45 px-3 py-2">/hero - Hero overview page</li>
              <li className="rounded-lg border border-emerald-zenith-text/10 bg-emerald-zenith-bg/45 px-3 py-2">/login - Sign in page</li>
              <li className="rounded-lg border border-emerald-zenith-text/10 bg-emerald-zenith-bg/45 px-3 py-2">/register - Create account page</li>
              <li className="rounded-lg border border-emerald-zenith-text/10 bg-emerald-zenith-bg/45 px-3 py-2">/app - Dashboard (post-login)</li>
            </ul>
          </motion.aside>
        </section>
      </main>
    </div>
  );
}

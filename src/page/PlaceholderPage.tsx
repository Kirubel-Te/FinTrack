import { Wallet } from 'lucide-react';
import { motion } from 'motion/react';

type PlaceholderPageProps = {
  notice?: string | null;
  onBackToLogin: () => void;
};

export default function PlaceholderPage({ notice, onBackToLogin }: PlaceholderPageProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background-light px-6 py-12 dark:bg-background-dark">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-emerald-300 blur-3xl"></div>
        <div className="absolute -bottom-20 -right-12 h-72 w-72 rounded-full bg-emerald-500 blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-xl rounded-2xl border border-emerald-200/70 bg-white/90 p-8 text-center shadow-xl backdrop-blur dark:border-primary/50 dark:bg-primary/20"
      >
        <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white">
          <Wallet className="h-7 w-7" />
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">FinTrack</h1>
        <p className="mt-3 text-slate-600 dark:text-emerald-100/80">We will design the page later.</p>

        {notice && (
          <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
            {notice}
          </p>
        )}

        <button
          type="button"
          onClick={onBackToLogin}
          className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-primary/90"
        >
          Back to Login
        </button>
      </motion.div>
    </div>
  );
}
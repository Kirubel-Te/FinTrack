import { CheckCircle2, CircleHelp, LayoutDashboard, PlusCircle, RefreshCw, Shield, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type HelpCenterModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const guidanceCards = [
  {
    icon: PlusCircle,
    title: 'Add your money fast',
    text: 'Use Add Income and Add Expense to log each transaction in seconds. Keep it simple and current.',
  },
  {
    icon: LayoutDashboard,
    title: 'Read the dashboard',
    text: 'Your balance, trends, and charts update as you add records, so you can see where money goes at a glance.',
  },
  {
    icon: RefreshCw,
    title: 'Stay in sync',
    text: 'The app refreshes automatically after each entry, making your reports and recent activity accurate.',
  },
];

const advantages = [
  'Simple tracking without spreadsheets',
  'Clear charts for spending habits',
  'Faster decisions with live updates',
  'A calmer way to stay organized',
];

export function HelpCenterModal({ isOpen, onClose }: HelpCenterModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-start justify-center overflow-y-auto p-3 md:items-center md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-emerald-zenith-bg/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative my-4 w-full max-w-5xl grid grid-cols-1 xl:grid-cols-12 gap-6 pointer-events-none md:my-0"
          >
            <div className="xl:col-span-8 bg-emerald-zenith-surface rounded-3xl overflow-hidden shadow-2xl border border-emerald-zenith-text-muted/15 relative pointer-events-auto max-h-[calc(100vh-1.5rem)] overflow-y-auto md:max-h-[calc(100vh-3rem)]">
              <div className="absolute top-0 left-0 h-1.5 w-full bg-linear-to-r from-emerald-zenith-secondary to-emerald-zenith-primary" />

              <div className="p-6 md:p-8">
                <header className="mb-8 text-center relative">
                  <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-0 top-0 rounded-full border border-emerald-900/20 bg-emerald-zenith-surface-high/70 p-2 text-emerald-zenith-text-muted hover:text-emerald-zenith-text transition-colors"
                    aria-label="Close help"
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>

                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-zenith-primary/25 bg-emerald-zenith-primary/10 text-emerald-zenith-primary">
                    <CircleHelp className="h-8 w-8" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight text-emerald-zenith-text mb-2">How FinTrack Works</h2>
                  <p className="text-emerald-zenith-text-muted font-medium text-sm md:text-base max-w-2xl mx-auto">
                    FinTrack keeps your money clear, organized, and easy to act on. Add income, record expenses, and let the dashboard show you the story.
                  </p>
                </header>

                <div className="grid gap-4 md:grid-cols-3">
                  {guidanceCards.map((card) => {
                    const Icon = card.icon;

                    return (
                      <div
                        key={card.title}
                        className="rounded-2xl border border-emerald-900/20 bg-emerald-zenith-surface-high/35 p-5 shadow-lg shadow-emerald-950/5"
                      >
                        <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-zenith-primary/10 text-emerald-zenith-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="text-base font-black text-emerald-zenith-text">{card.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-emerald-zenith-text-muted">{card.text}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 rounded-2xl border border-emerald-900/20 bg-emerald-zenith-surface-high/30 p-5 md:p-6">
                  <h3 className="text-sm font-black uppercase tracking-[0.18em] text-emerald-zenith-text-muted">Why it helps</h3>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {advantages.map((item) => (
                      <div key={item} className="flex items-start gap-3 rounded-xl border border-emerald-900/15 bg-emerald-zenith-surface/45 px-4 py-3">
                        <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 text-emerald-zenith-primary" />
                        <p className="text-sm text-emerald-zenith-text">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <div className="flex flex-1 items-center gap-3 rounded-2xl border border-emerald-900/20 bg-emerald-zenith-primary/10 px-4 py-3">
                    <Sparkles className="h-5 w-5 text-emerald-zenith-primary" />
                    <p className="text-sm text-emerald-zenith-text">
                      Start with one income and one expense. The dashboard becomes useful the moment your first records are added.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl bg-emerald-zenith-primary px-5 py-3 text-sm font-black text-emerald-zenith-accent shadow-md shadow-emerald-950/10 transition-all hover:brightness-110"
                  >
                    Got it
                  </button>
                </div>
              </div>
            </div>

            <div className="hidden xl:flex xl:col-span-4 flex-col gap-5 pointer-events-auto max-h-[calc(100vh-3rem)] overflow-y-auto pr-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="rounded-2xl border border-emerald-zenith-primary/20 bg-emerald-zenith-primary/10 p-5"
              >
                <Shield className="h-6 w-6 text-emerald-zenith-primary" />
                <h4 className="mt-3 text-base font-black text-emerald-zenith-text">Safe by design</h4>
                <p className="mt-2 text-sm leading-relaxed text-emerald-zenith-text-muted">
                  Your data stays tied to your account, and the UI keeps sensitive actions separate from everyday tracking.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.22 }}
                className="rounded-2xl border border-emerald-900/20 bg-emerald-zenith-surface p-5 shadow-xl"
              >
                <h4 className="text-sm font-black uppercase tracking-widest text-emerald-zenith-text-muted">Quick Flow</h4>
                <div className="mt-4 space-y-4">
                  {[
                    'Open Add Income or Add Expense',
                    'Enter the amount and category',
                    'Save and watch the dashboard update',
                  ].map((item, index) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-zenith-primary/10 text-xs font-black text-emerald-zenith-primary">
                        {index + 1}
                      </div>
                      <p className="text-sm text-emerald-zenith-text">{item}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

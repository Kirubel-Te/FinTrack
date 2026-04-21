import { CheckCircle2, CircleHelp, LayoutDashboard, PlusCircle, RefreshCw, Shield, Sparkles } from 'lucide-react';
import { Reveal } from '../components/Reveal';

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

export function HelpCenterPage() {
  return (
    <div className="p-5 lg:p-6 space-y-6 max-w-7xl mx-auto w-full">
      <section className="dashboard-page-header">
        <h2 className="dashboard-page-title">Help Center</h2>
        <p className="dashboard-page-subtitle">
          Learn how to use FinTrack quickly and keep your money workflow smooth.
        </p>
      </section>

      <Reveal delay={0.06}>
        <section className="rounded-2xl border border-emerald-zenith-text-muted/15 bg-emerald-zenith-surface p-5 md:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-zenith-primary/25 bg-emerald-zenith-primary/10 text-emerald-zenith-primary">
              <CircleHelp className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-emerald-zenith-text">How FinTrack Works</h3>
              <p className="text-sm text-emerald-zenith-text-muted">
                Add income, record expenses, and read your dashboard in one consistent flow.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {guidanceCards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.title}
                  className="rounded-2xl border border-emerald-900/20 bg-emerald-zenith-surface-high/35 p-5 shadow-lg shadow-emerald-950/5"
                >
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-zenith-primary/10 text-emerald-zenith-primary">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <h4 className="text-base font-black text-emerald-zenith-text">{card.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-emerald-zenith-text-muted">{card.text}</p>
                </article>
              );
            })}
          </div>
        </section>
      </Reveal>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Reveal delay={0.1} className="xl:col-span-8">
          <section className="rounded-2xl border border-emerald-900/20 bg-emerald-zenith-surface p-5 md:p-6">
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-emerald-zenith-text-muted">Why It Helps</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {advantages.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl border border-emerald-900/15 bg-emerald-zenith-surface-high/25 px-4 py-3">
                  <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 text-emerald-zenith-primary" />
                  <p className="text-sm text-emerald-zenith-text">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-900/20 bg-emerald-zenith-primary/10 px-4 py-3">
              <Sparkles className="mt-0.5 h-5 w-5 text-emerald-zenith-primary" />
              <p className="text-sm text-emerald-zenith-text">
                Start with one income and one expense entry. Your dashboard insights become useful immediately.
              </p>
            </div>
          </section>
        </Reveal>

        <Reveal delay={0.14} className="xl:col-span-4">
          <aside className="rounded-2xl border border-emerald-900/20 bg-emerald-zenith-surface p-5 shadow-xl">
            <div className="rounded-2xl border border-emerald-zenith-primary/20 bg-emerald-zenith-primary/10 p-4">
              <Shield className="h-6 w-6 text-emerald-zenith-primary" />
              <h4 className="mt-3 text-base font-black text-emerald-zenith-text">Safe by design</h4>
              <p className="mt-2 text-sm leading-relaxed text-emerald-zenith-text-muted">
                Sensitive actions are separated from daily tracking to reduce accidental mistakes.
              </p>
            </div>

            <div className="mt-4 rounded-2xl border border-emerald-900/15 bg-emerald-zenith-surface-high/25 p-4">
              <h4 className="text-sm font-black uppercase tracking-widest text-emerald-zenith-text-muted">Quick Flow</h4>
              <div className="mt-3 space-y-3">
                {[
                  'Open Add Income or Add Expense',
                  'Enter amount and category',
                  'Save and review updated charts',
                ].map((item, index) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-zenith-primary/10 text-xs font-black text-emerald-zenith-primary">
                      {index + 1}
                    </div>
                    <p className="text-sm text-emerald-zenith-text">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </Reveal>
      </div>
    </div>
  );
}

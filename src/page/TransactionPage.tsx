import { 
  Filter, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  Calendar as CalendarIcon,
  CreditCard,
  Home,
  Utensils,
  TrendingUp,
  ShoppingBag,
  Car
} from 'lucide-react';
import { cn } from '../lib/utils';

const transactions = [
  {
    id: 1,
    name: 'Monthly Salary - Q4',
    category: 'Earnings',
    icon: CreditCard,
    iconBg: 'bg-emerald-zenith-primary/10',
    iconColor: 'text-emerald-zenith-primary',
    date: 'Oct 28, 2023',
    type: 'Income',
    amount: 8450.00
  },
  {
    id: 2,
    name: 'Premium Residence Rent',
    category: 'Housing',
    icon: Home,
    iconBg: 'bg-emerald-zenith-error/10',
    iconColor: 'text-emerald-zenith-error',
    date: 'Oct 25, 2023',
    type: 'Expense',
    amount: -2100.00
  },
  {
    id: 3,
    name: 'The Emerald Grill',
    category: 'Dining',
    icon: Utensils,
    iconBg: 'bg-emerald-zenith-warning/10',
    iconColor: 'text-emerald-zenith-warning',
    date: 'Oct 22, 2023',
    type: 'Expense',
    amount: -342.50
  },
  {
    id: 4,
    name: 'Stock Dividends - Portfolio A',
    category: 'Investment',
    icon: TrendingUp,
    iconBg: 'bg-emerald-zenith-primary/10',
    iconColor: 'text-emerald-zenith-primary',
    date: 'Oct 20, 2023',
    type: 'Income',
    amount: 1280.00
  },
  {
    id: 5,
    name: 'Tech Gear - New Monitor',
    category: 'Shopping',
    icon: ShoppingBag,
    iconBg: 'bg-emerald-zenith-secondary/10',
    iconColor: 'text-emerald-zenith-secondary',
    date: 'Oct 18, 2023',
    type: 'Expense',
    amount: -899.99
  },
  {
    id: 6,
    name: 'Uber - Corporate Meeting',
    category: 'Transport',
    icon: Car,
    iconBg: 'bg-emerald-zenith-text-muted/10',
    iconColor: 'text-emerald-zenith-text-muted',
    date: 'Oct 15, 2023',
    type: 'Expense',
    amount: -45.20
  }
];

export function TransactionsPage() {
  return (
    <div className="p-4 lg:p-5 space-y-7 lg:space-y-8 max-w-7xl mx-auto w-full">
      {/* Header Section */}
      <div className="space-y-2">
        <h2 className="text-3xl md:text-4xl xl:text-5xl font-black tracking-tight text-emerald-zenith-text">
          Transactions
        </h2>
        <p className="text-emerald-zenith-text-muted text-sm md:text-base font-medium max-w-2xl">
          Your financial story, curated and detailed. Monitor every inflow and outflow within your sanctuary.
        </p>
      </div>

      {/* Filter Bar */}
      <section className="bg-emerald-zenith-surface rounded-xl p-3.5 md:p-4 flex flex-wrap items-stretch md:items-center justify-between gap-4 border border-emerald-zenith-text-muted/15 shadow-sm">
        <div className="flex w-full lg:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-zenith-text-muted font-black px-1">Category</span>
            <select className="bg-emerald-zenith-surface-high border-none rounded-lg text-sm font-bold text-emerald-zenith-text px-4 py-2 focus:ring-2 focus:ring-emerald-zenith-primary/20 min-w-41.25 appearance-none cursor-pointer">
              <option>All Categories</option>
              <option>Housing</option>
              <option>Utilities</option>
              <option>Investment</option>
              <option>Salary</option>
              <option>Entertainment</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-zenith-text-muted font-black px-1">Date Range</span>
            <div className="flex items-center gap-2.5 bg-emerald-zenith-surface-high rounded-lg px-4 py-2 cursor-pointer hover:bg-emerald-zenith-surface-high/80 transition-colors">
              <CalendarIcon className="w-4 h-4 text-emerald-zenith-primary" />
              <span className="text-sm font-bold text-emerald-zenith-text">Oct 01 - Oct 31, 2023</span>
            </div>
          </div>
        </div>
        <div className="flex w-full sm:w-auto items-center justify-end sm:justify-start gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-bold text-emerald-zenith-text-muted hover:text-emerald-zenith-primary transition-all bg-emerald-zenith-surface-high/50 rounded-lg hover:bg-emerald-zenith-surface-high">
            <Filter className="w-4 h-4" />
            <span>Advanced Filters</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-bold text-emerald-zenith-text-muted hover:text-emerald-zenith-primary transition-all bg-emerald-zenith-surface-high/50 rounded-lg hover:bg-emerald-zenith-surface-high">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </section>

      {/* Transactions Table */}
      <div className="bg-emerald-zenith-surface rounded-2xl overflow-hidden border border-emerald-zenith-text-muted/15 shadow-2xl relative">
        {/* Decorative atmospheric glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-zenith-primary/5 blur-[100px] -z-10" />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left border-collapse">
          <thead>
            <tr className="bg-emerald-zenith-surface-high/30 border-b border-emerald-zenith-text-muted/15">
              <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-black text-emerald-zenith-text-muted">Transaction Name</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-black text-emerald-zenith-text-muted">Category</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-black text-emerald-zenith-text-muted">Date</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-black text-emerald-zenith-text-muted">Type</th>
              <th className="px-6 py-4 text-right text-[10px] uppercase tracking-[0.2em] font-black text-emerald-zenith-text-muted">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-zenith-text-muted/15">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-emerald-zenith-primary/5 transition-colors group cursor-pointer">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110", t.iconBg)}>
                      <t.icon className={cn("w-4 h-4", t.iconColor)} />
                    </div>
                    <span className="text-sm font-bold text-emerald-zenith-text group-hover:text-emerald-zenith-primary transition-colors">
                      {t.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                    <span className="text-xs font-bold text-emerald-zenith-text-muted bg-emerald-zenith-surface-high px-3 py-1 rounded-full border border-emerald-zenith-text-muted/15">
                    {t.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-emerald-zenith-text-muted">
                    {t.date}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md",
                    t.type === 'Income' ? "text-emerald-zenith-primary bg-emerald-zenith-primary/10" : "text-emerald-zenith-error bg-emerald-zenith-error/10"
                  )}>
                    {t.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className={cn(
                    "text-sm md:text-base font-black",
                    t.amount > 0 ? "text-emerald-zenith-primary" : "text-emerald-zenith-error"
                  )}>
                    {t.amount > 0 ? `+$${t.amount.toLocaleString()}` : `-$${Math.abs(t.amount).toLocaleString()}`}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="px-6 py-4 bg-emerald-zenith-surface-high/20 border-t border-emerald-zenith-text-muted/15 flex items-center justify-between">
          <span className="text-[10px] font-black text-emerald-zenith-text-muted uppercase tracking-[0.2em]">
            SHOWING 1-6 OF 124 TRANSACTIONS
          </span>
          <div className="flex items-center gap-2">
            <button className="flex items-center justify-center w-8 h-8 rounded-lg text-emerald-zenith-text-muted hover:text-emerald-zenith-primary hover:bg-emerald-zenith-primary/10 transition-all border border-transparent hover:border-emerald-zenith-primary/20">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="flex items-center justify-center w-8 h-8 rounded-lg text-xs font-black bg-emerald-zenith-primary text-emerald-zenith-accent shadow-lg shadow-emerald-zenith-primary/20">1</button>
            <button className="flex items-center justify-center w-8 h-8 rounded-lg text-xs font-black text-emerald-zenith-text-muted hover:bg-emerald-zenith-surface-high transition-all">2</button>
            <button className="flex items-center justify-center w-8 h-8 rounded-lg text-xs font-black text-emerald-zenith-text-muted hover:bg-emerald-zenith-surface-high transition-all">3</button>
            <span className="text-emerald-zenith-text-muted px-1 font-bold">...</span>
            <button className="flex items-center justify-center w-8 h-8 rounded-lg text-xs font-black text-emerald-zenith-text-muted hover:bg-emerald-zenith-surface-high transition-all">21</button>
            <button className="flex items-center justify-center w-8 h-8 rounded-lg text-emerald-zenith-text-muted hover:text-emerald-zenith-primary hover:bg-emerald-zenith-primary/10 transition-all border border-transparent hover:border-emerald-zenith-primary/20">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="mt-10 pt-8 border-t border-emerald-zenith-text-muted/15 flex flex-col md:flex-row justify-between items-start gap-10 opacity-60">
        <div className="max-w-sm space-y-3">
          <h4 className="text-sm font-black text-emerald-zenith-text uppercase tracking-widest">FinTrack Systems</h4>
          <p className="text-xs text-emerald-zenith-text-muted leading-relaxed font-medium">
            Your financial data is encrypted with state-of-the-art cryptographic protocols, ensuring your sanctuary remains private and impenetrable.
          </p>
        </div>
        <div className="flex gap-16">
          <div className="flex flex-col gap-3">
            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-emerald-zenith-text-muted">Resources</span>
            <a href="#" className="text-xs font-bold hover:text-emerald-zenith-primary transition-colors">API Documentation</a>
            <a href="#" className="text-xs font-bold hover:text-emerald-zenith-primary transition-colors">Security Audits</a>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-emerald-zenith-text-muted">Support</span>
            <a href="#" className="text-xs font-bold hover:text-emerald-zenith-primary transition-colors">Concierge Service</a>
            <a href="#" className="text-xs font-bold hover:text-emerald-zenith-primary transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

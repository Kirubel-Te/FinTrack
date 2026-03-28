
import { Smartphone, Briefcase, ShoppingBasket } from 'lucide-react';
import { Link } from 'react-router';
import { cn } from '../lib/utils';

const transactions = [
  {
    id: 1,
    name: 'Apple Store Subscription',
    description: 'iCloud Storage (2TB)',
    category: 'Entertainment',
    icon: Smartphone,
    date: 'Oct 24, 2023',
    amount: -9.99,
    type: 'Expense'
  },
  {
    id: 2,
    name: 'Stripe Payout',
    description: 'Consulting Fees #482',
    category: 'Consulting',
    icon: Briefcase,
    date: 'Oct 22, 2023',
    amount: 4250.00,
    type: 'Income'
  },
  {
    id: 3,
    name: 'Whole Foods Market',
    description: 'Weekly Groceries',
    category: 'Shopping',
    icon: ShoppingBasket,
    date: 'Oct 21, 2023',
    amount: -285.42,
    type: 'Expense'
  }
];

export function TransactionTable() {
  return (
    <div className="bg-emerald-zenith-surface rounded-2xl border border-emerald-900/10 overflow-hidden">
      <div className="p-5 md:p-6 flex justify-between items-center border-b border-emerald-900/10">
        <div>
          <h4 className="text-lg md:text-xl font-bold">Recent Transactions</h4>
          <p className="text-xs md:text-sm text-emerald-zenith-text-muted">Your latest financial activity</p>
        </div>
        <Link
          to="/transactions"
          className="text-emerald-zenith-primary text-xs md:text-sm font-bold hover:underline transition-all whitespace-nowrap"
        >
          View All History
        </Link>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] uppercase font-black tracking-[0.16em] text-emerald-zenith-text-muted bg-emerald-zenith-surface-high/30">
              <th className="px-5 md:px-6 py-4">Transaction Name</th>
              <th className="px-5 md:px-6 py-4">Category</th>
              <th className="px-5 md:px-6 py-4">Date</th>
              <th className="px-5 md:px-6 py-4 text-right">Amount</th>
              <th className="px-5 md:px-6 py-4 text-center">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-900/10">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-white/5 transition-colors group cursor-pointer">
                <td className="px-5 md:px-6 py-4.5 md:py-5">
                  <div className="flex flex-col">
                    <span className="text-sm md:text-base font-bold text-emerald-zenith-text group-hover:text-emerald-zenith-primary transition-colors">{t.name}</span>
                    <span className="text-xs text-emerald-zenith-text-muted mt-0.5">{t.description}</span>
                  </div>
                </td>
                <td className="px-5 md:px-6 py-4.5 md:py-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-zenith-surface-high rounded-lg">
                      <t.icon className="w-3.5 h-3.5 text-emerald-zenith-text-muted" />
                    </div>
                    <span className="text-xs md:text-sm font-semibold text-emerald-zenith-text-muted">{t.category}</span>
                  </div>
                </td>
                <td className="px-5 md:px-6 py-4.5 md:py-5 text-xs md:text-sm text-emerald-zenith-text-muted font-medium whitespace-nowrap">
                  {t.date}
                </td>
                <td className={cn(
                  "px-5 md:px-6 py-4.5 md:py-5 text-right font-black text-base md:text-lg whitespace-nowrap",
                  t.amount > 0 ? "text-emerald-zenith-primary" : "text-emerald-zenith-error"
                )}>
                  {t.amount > 0 ? `+$${t.amount.toLocaleString()}` : `-$${Math.abs(t.amount).toLocaleString()}`}
                </td>
                <td className="px-5 md:px-6 py-4.5 md:py-5 text-center">
                  <span className={cn(
                    "px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-[0.14em]",
                    t.type === 'Income' ? "bg-emerald-zenith-primary/10 text-emerald-zenith-primary" : "bg-emerald-zenith-error/10 text-emerald-zenith-error"
                  )}>
                    {t.type}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

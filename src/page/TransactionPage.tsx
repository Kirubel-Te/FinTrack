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
import { Reveal } from '../components/Reveal';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { listExpenses, listIncomes, type TransactionRecord } from '../api/finance';

type TransactionRow = {
  id: string;
  name: string;
  category: string;
  date: string;
  sortAt: number;
  type: 'Income' | 'Expense';
  amount: number;
  icon: typeof CreditCard;
  iconBg: string;
  iconColor: string;
};

const iconForCategory = (category: string) => {
  const normalized = category.toLowerCase();

  if (normalized.includes('house') || normalized.includes('rent')) {
    return { icon: Home, iconBg: 'bg-emerald-zenith-error/10', iconColor: 'text-emerald-zenith-error' };
  }

  if (normalized.includes('food') || normalized.includes('dining')) {
    return { icon: Utensils, iconBg: 'bg-emerald-zenith-warning/10', iconColor: 'text-emerald-zenith-warning' };
  }

  if (normalized.includes('shop') || normalized.includes('luxury')) {
    return { icon: ShoppingBag, iconBg: 'bg-emerald-zenith-secondary/10', iconColor: 'text-emerald-zenith-secondary' };
  }

  if (normalized.includes('transport') || normalized.includes('car')) {
    return { icon: Car, iconBg: 'bg-emerald-zenith-text-muted/10', iconColor: 'text-emerald-zenith-text-muted' };
  }

  if (normalized.includes('salary') || normalized.includes('investment') || normalized.includes('business')) {
    return { icon: TrendingUp, iconBg: 'bg-emerald-zenith-primary/10', iconColor: 'text-emerald-zenith-primary' };
  }

  return { icon: CreditCard, iconBg: 'bg-emerald-zenith-primary/10', iconColor: 'text-emerald-zenith-primary' };
};

const mapRecordToRow = (record: TransactionRecord, type: 'Income' | 'Expense'): TransactionRow => {
  const iconInfo = iconForCategory(record.category);

  return {
    id: `${type.toLowerCase()}-${record.id}`,
    name: record.description?.trim() || `${record.category} ${type.toLowerCase()}`,
    category: record.category,
    date: new Date(record.date).toLocaleDateString(undefined, {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }),
    sortAt: new Date(record.date).getTime(),
    type,
    amount: type === 'Income' ? Math.abs(record.amount) : -Math.abs(record.amount),
    ...iconInfo,
  };
};

export function TransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);

  const pageSize = 10;

  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const query = {
        page: 1,
        limit: 100,
        category: selectedCategory || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      };

      const [incomes, expenses] = await Promise.all([
        listIncomes(query),
        listExpenses(query),
      ]);

      const rows = [
        ...incomes.data.map((record) => mapRecordToRow(record, 'Income')),
        ...expenses.data.map((record) => mapRecordToRow(record, 'Expense')),
      ].sort((a, b) => b.sortAt - a.sortAt);

      setTransactions(rows);
      setPage(1);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to load transactions.');
    } finally {
      setIsLoading(false);
    }
  }, [endDate, selectedCategory, startDate]);

  useEffect(() => {
    void loadTransactions();
  }, [loadTransactions]);

  useEffect(() => {
    const onTransactionUpdated = () => {
      void loadTransactions();
    };

    window.addEventListener('fintrack:transaction-updated', onTransactionUpdated);

    return () => {
      window.removeEventListener('fintrack:transaction-updated', onTransactionUpdated);
    };
  }, [loadTransactions]);

  const categoryOptions = useMemo(() => (
    Array.from(new Set(transactions.map((item) => item.category))).sort((a, b) => a.localeCompare(b))
  ), [transactions]);

  const totalPages = Math.max(1, Math.ceil(transactions.length / pageSize));
  const clampedPage = Math.min(page, totalPages);
  const paginatedTransactions = useMemo(() => {
    const start = (clampedPage - 1) * pageSize;
    return transactions.slice(start, start + pageSize);
  }, [clampedPage, transactions]);

  const downloadCsv = () => {
    if (!transactions.length) {
      return;
    }

    const header = ['Name', 'Category', 'Date', 'Type', 'Amount'];
    const rows = transactions.map((item) => [
      item.name,
      item.category,
      item.date,
      item.type,
      item.amount.toFixed(2),
    ]);

    const csvContent = [header, ...rows]
      .map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'transactions.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  };

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
      <Reveal delay={0.04}>
        <section className="bg-emerald-zenith-surface rounded-xl p-3.5 md:p-4 flex flex-wrap items-stretch md:items-center justify-between gap-4 border border-emerald-zenith-text-muted/15 shadow-sm">
        <div className="flex w-full lg:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-zenith-text-muted font-black px-1">Category</span>
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="bg-emerald-zenith-surface-high border-none rounded-lg text-sm font-bold text-emerald-zenith-text px-4 py-2 focus:ring-2 focus:ring-emerald-zenith-primary/20 min-w-41.25 appearance-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-zenith-text-muted font-black px-1">Date Range</span>
            <div className="flex items-center gap-2.5 bg-emerald-zenith-surface-high rounded-lg px-4 py-2 hover:bg-emerald-zenith-surface-high/80 transition-colors">
              <CalendarIcon className="w-4 h-4 text-emerald-zenith-primary" />
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="bg-transparent text-sm font-bold text-emerald-zenith-text outline-none"
              />
              <span className="text-sm font-bold text-emerald-zenith-text">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="bg-transparent text-sm font-bold text-emerald-zenith-text outline-none"
              />
            </div>
          </div>
        </div>
        <div className="flex w-full sm:w-auto items-center justify-end sm:justify-start gap-3">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('');
              setStartDate('');
              setEndDate('');
            }}
            className="flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-bold text-emerald-zenith-text-muted hover:text-emerald-zenith-primary transition-all bg-emerald-zenith-surface-high/50 rounded-lg hover:bg-emerald-zenith-surface-high"
          >
            <Filter className="w-4 h-4" />
            <span>Reset Filters</span>
          </button>
          <button
            type="button"
            onClick={downloadCsv}
            className="flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-bold text-emerald-zenith-text-muted hover:text-emerald-zenith-primary transition-all bg-emerald-zenith-surface-high/50 rounded-lg hover:bg-emerald-zenith-surface-high"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
        </section>
      </Reveal>

      {/* Transactions Table */}
      <Reveal delay={0.1}>
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
            {isLoading && (
              <tr>
                <td className="px-6 py-10 text-center text-sm text-emerald-zenith-text-muted" colSpan={5}>
                  Loading transactions...
                </td>
              </tr>
            )}
            {!isLoading && errorMessage && (
              <tr>
                <td className="px-6 py-10 text-center text-sm text-emerald-zenith-error" colSpan={5}>
                  {errorMessage}
                </td>
              </tr>
            )}
            {!isLoading && !errorMessage && paginatedTransactions.map((t) => (
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
            {!isLoading && !errorMessage && paginatedTransactions.length === 0 && (
              <tr>
                <td className="px-6 py-10 text-center text-sm text-emerald-zenith-text-muted" colSpan={5}>
                  No transactions matched your filters.
                </td>
              </tr>
            )}
          </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="px-6 py-4 bg-emerald-zenith-surface-high/20 border-t border-emerald-zenith-text-muted/15 flex items-center justify-between">
          <span className="text-[10px] font-black text-emerald-zenith-text-muted uppercase tracking-[0.2em]">
            SHOWING {transactions.length === 0 ? 0 : (clampedPage - 1) * pageSize + 1}-{Math.min(clampedPage * pageSize, transactions.length)} OF {transactions.length} TRANSACTIONS
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={clampedPage <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-emerald-zenith-text-muted hover:text-emerald-zenith-primary hover:bg-emerald-zenith-primary/10 transition-all border border-transparent hover:border-emerald-zenith-primary/20 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="flex items-center justify-center w-8 h-8 rounded-lg text-xs font-black bg-emerald-zenith-primary text-emerald-zenith-accent shadow-lg shadow-emerald-zenith-primary/20">
              {clampedPage}
            </button>
            <span className="text-emerald-zenith-text-muted px-1 text-xs font-bold">/ {totalPages}</span>
            <button
              type="button"
              disabled={clampedPage >= totalPages}
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-emerald-zenith-text-muted hover:text-emerald-zenith-primary hover:bg-emerald-zenith-primary/10 transition-all border border-transparent hover:border-emerald-zenith-primary/20 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        </div>
      </Reveal>

      {/* Footer Section */}
      <footer className="mt-10 pt-8 border-t border-emerald-zenith-text-muted/15 flex flex-col md:flex-row justify-between items-start gap-10 opacity-60">
        <Reveal className="max-w-sm space-y-3" delay={0.05}>
          <h4 className="text-sm font-black text-emerald-zenith-text uppercase tracking-widest">FinTrack Systems</h4>
          <p className="text-xs text-emerald-zenith-text-muted leading-relaxed font-medium">
            Your financial data is encrypted with state-of-the-art cryptographic protocols, ensuring your sanctuary remains private and impenetrable.
          </p>
        </Reveal>
        <Reveal className="flex gap-16" delay={0.12}>
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
        </Reveal>
      </footer>
    </div>
  );
}

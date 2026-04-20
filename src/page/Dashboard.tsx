import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { StatCard } from '../components/StatCard';
import { ExpenseChart } from '../components/ExpenseChart';
import { ComparisonChart } from '../components/ComparisionChart';
import { TransactionTable, type RecentTransaction } from '../components/Transaction';
import { Landmark, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Outlet } from 'react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AddExpenseModal } from './AddExpense';
import { AddIncomeModal } from './AddIncome';
import { HelpCenterModal } from './HelpCenter';
import { Reveal } from '../components/Reveal';
import {
  getCategoryReport,
  getMonthlyReport,
  getReportSummary,
  listExpenses,
  listIncomes,
  type CategoryReport,
  type MonthlyReport,
  type ReportSummary,
  type TransactionRecord,
} from '../api/finance';

const chartPalette = ['#34d399', '#60e2b1', '#1f8f72', '#f38b82', '#2fb8df', '#81e6d9'];

const toMonthKey = (date: Date) => (
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
);

const toMonthLabel = (monthKey: string) => {
  const [year, month] = monthKey.split('-').map(Number);
  return new Date(year, month - 1, 1)
    .toLocaleDateString(undefined, { month: 'short' })
    .toUpperCase();
};

const getRecentMonthKeys = (count: number) => {
  const result: string[] = [];
  const current = new Date();

  for (let index = count - 1; index >= 0; index -= 1) {
    const next = new Date(current.getFullYear(), current.getMonth() - index, 1);
    result.push(toMonthKey(next));
  }

  return result;
};

const formatCurrency = (amount: number) => (
  amount.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
);

const buildRecentTransaction = (record: TransactionRecord, type: 'Income' | 'Expense'): RecentTransaction => ({
  id: `${type.toLowerCase()}-${record.id}`,
  name: record.description?.trim() || `${record.category} ${type.toLowerCase()}`,
  description: record.description ?? undefined,
  category: record.category,
  date: new Date(record.date).toLocaleDateString(undefined, {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }),
  amount: type === 'Income' ? Math.abs(record.amount) : -Math.abs(record.amount),
  type,
});

const toPercentTrend = (current: number, previous: number) => {
  if (previous === 0) {
    return 0;
  }

  return ((current - previous) / Math.abs(previous)) * 100;
};

const formatTrendLabel = (value: number) => `${Math.abs(value).toFixed(1)}% vs last month`;

export function DashboardLayout() {
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-emerald-zenith-bg text-emerald-zenith-text">
      <Sidebar />
      
      <main className="ml-16 md:ml-64 flex min-w-0 flex-1 flex-col">
        <TopBar
          onAddIncomeClick={() => setIsAddIncomeOpen(true)}
          onAddExpenseClick={() => setIsAddExpenseOpen(true)}
          onHelpClick={() => setIsHelpOpen(true)}
        />
        <Outlet />
      </main>

      <AddIncomeModal
        isOpen={isAddIncomeOpen}
        onClose={() => setIsAddIncomeOpen(false)}
      />

      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
      />

      <HelpCenterModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}

export default function Dashboard() {
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [categories, setCategories] = useState<CategoryReport[]>([]);
  const [monthlyReports, setMonthlyReports] = useState<MonthlyReport[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const monthKeys = getRecentMonthKeys(6);

      const [summaryResponse, categoryResponse, monthlyResponse, incomesResponse, expensesResponse] = await Promise.all([
        getReportSummary(),
        getCategoryReport(),
        Promise.all(monthKeys.map((month) => getMonthlyReport(month))),
        listIncomes({ page: 1, limit: 8 }),
        listExpenses({ page: 1, limit: 8 }),
      ]);

      setSummary(summaryResponse);
      setCategories(categoryResponse);
      setMonthlyReports(monthlyResponse);

      const combined = [
        ...incomesResponse.data.map((item) => ({ item, type: 'Income' as const })),
        ...expensesResponse.data.map((item) => ({ item, type: 'Expense' as const })),
      ]
        .sort((a, b) => new Date(b.item.date).getTime() - new Date(a.item.date).getTime())
        .slice(0, 8)
        .map(({ item, type }) => buildRecentTransaction(item, type));

      setRecentTransactions(combined);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load dashboard data.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboardData();
  }, [loadDashboardData]);

  useEffect(() => {
    const onTransactionUpdated = () => {
      void loadDashboardData();
    };

    window.addEventListener('fintrack:transaction-updated', onTransactionUpdated);
    return () => {
      window.removeEventListener('fintrack:transaction-updated', onTransactionUpdated);
    };
  }, [loadDashboardData]);

  const expenseTotal = summary?.totalExpense ?? 0;
  const pieData = useMemo(() => {
    const total = categories.reduce((sum, item) => sum + item.total, 0);

    if (!total) {
      return [];
    }

    return categories.map((item, index) => ({
      name: item.category,
      value: Number(((item.total / total) * 100).toFixed(1)),
      color: chartPalette[index % chartPalette.length],
    }));
  }, [categories]);

  const barData = useMemo(() => (
    monthlyReports.map((entry) => ({
      month: toMonthLabel(entry.month),
      income: entry.totalIncome,
      expenses: entry.totalExpense,
    }))
  ), [monthlyReports]);

  const latestMonth = monthlyReports[monthlyReports.length - 1];
  const previousMonth = monthlyReports[monthlyReports.length - 2];

  const balanceTrend = latestMonth && previousMonth
    ? toPercentTrend(latestMonth.balance, previousMonth.balance)
    : 0;
  const incomeTrend = latestMonth && previousMonth
    ? toPercentTrend(latestMonth.totalIncome, previousMonth.totalIncome)
    : 0;
  const expenseTrend = latestMonth && previousMonth
    ? toPercentTrend(latestMonth.totalExpense, previousMonth.totalExpense)
    : 0;

  return (
    <div className="p-5 lg:p-6 space-y-7 lg:space-y-8 max-w-7xl mx-auto w-full">
      {/* Hero Section */}
      <section className="dashboard-page-header">
        <h2 className="dashboard-page-title">
          Portfolio Overview
        </h2>
        <p className="dashboard-page-subtitle">
          Track your live finances from incomes, expenses, and reports.
        </p>
        {errorMessage && (
          <p className="text-sm text-emerald-zenith-error">{errorMessage}</p>
        )}
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 xl:gap-5">
        <Reveal delay={0.05}>
          <StatCard 
            label="Total Balance"
            value={formatCurrency(summary?.balance ?? 0)}
            trend={formatTrendLabel(balanceTrend)}
            trendUp={balanceTrend >= 0}
            icon={Landmark}
            variant="primary"
          />
        </Reveal>
        <Reveal delay={0.12}>
          <StatCard 
            label="Total Income"
            value={formatCurrency(summary?.totalIncome ?? 0)}
            trend={formatTrendLabel(incomeTrend)}
            trendUp={incomeTrend >= 0}
            icon={ArrowDownLeft}
          />
        </Reveal>
        <Reveal delay={0.2}>
          <StatCard 
            label="Total Expenses"
            value={formatCurrency(summary?.totalExpense ?? 0)}
            trend={formatTrendLabel(expenseTrend)}
            trendUp={expenseTrend <= 0}
            icon={ArrowUpRight}
          />
        </Reveal>
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 xl:gap-5">
        <Reveal className="lg:col-span-5" delay={0.08}>
          <ExpenseChart data={pieData} totalAmount={expenseTotal} />
        </Reveal>
        <Reveal className="lg:col-span-7" delay={0.14}>
          <ComparisonChart data={barData} />
        </Reveal>
      </section>

      {/* Transactions Section */}
      <section className="pb-6 lg:pb-8">
        <Reveal delay={0.1}>
          <TransactionTable transactions={recentTransactions} isLoading={isLoading} />
        </Reveal>
      </section>
    </div>
  );
}

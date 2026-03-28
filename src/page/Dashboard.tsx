import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { StatCard } from '../components/StatCard';
import { ExpenseChart } from '../components/ExpenseChart';
import { ComparisonChart } from '../components/ComparisionChart';
import { TransactionTable } from '../components/Transaction';
import { Landmark, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Outlet } from 'react-router';
import { useState } from 'react';
import { AddExpenseModal } from './AddExpense';
import { AddIncomeModal } from './AddIncome';

export function DashboardLayout() {
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-emerald-zenith-bg text-emerald-zenith-text">
      <Sidebar />
      
      <main className="flex-1 ml-64 flex flex-col">
        <TopBar
          onAddIncomeClick={() => setIsAddIncomeOpen(true)}
          onAddExpenseClick={() => setIsAddExpenseOpen(true)}
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
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="p-5 lg:p-6 space-y-7 lg:space-y-8 max-w-7xl mx-auto w-full">
      {/* Hero Section */}
      <section className="space-y-1.5">
        <h2 className="text-3xl md:text-4xl xl:text-5xl font-black tracking-tight text-emerald-zenith-text">
          Portfolio Overview
        </h2>
        <p className="text-emerald-zenith-text-muted text-sm md:text-base font-medium">
          Welcome back, your sanctuary is looking stable today.
        </p>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 xl:gap-5">
        <StatCard 
          label="Total Balance"
          value="$124,592.00"
          trend="+12.5% vs last month"
          trendUp={true}
          icon={Landmark}
          variant="primary"
        />
        <StatCard 
          label="Total Income"
          value="$18,240.50"
          trend="5% increase"
          trendUp={true}
          icon={ArrowDownLeft}
        />
        <StatCard 
          label="Total Expenses"
          value="$6,450.20"
          trend="2% decrease"
          trendUp={false}
          icon={ArrowUpRight}
        />
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 xl:gap-5">
        <div className="lg:col-span-5">
          <ExpenseChart />
        </div>
        <div className="lg:col-span-7">
          <ComparisonChart />
        </div>
      </section>

      {/* Transactions Section */}
      <section className="pb-6 lg:pb-8">
        <TransactionTable />
      </section>
    </div>
  );
}

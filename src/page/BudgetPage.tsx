import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Home,
  Utensils,
  ShoppingBag,
  Car,
  PlusCircle,
  ArrowRight,
  Edit2,
  Trash2,
  HeartPulse,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Reveal } from '../components/Reveal';
import {
  createBudget,
  deleteBudget,
  getBudgetSummary,
  listBudgets,
  updateBudget,
  type Budget,
  type BudgetCategory,
  type BudgetSummary,
  type BudgetSummaryResponse,
} from '../api/finance';

type BudgetCardProps = {
  title: string;
  category: BudgetCategory;
  summary: BudgetSummary;
  large?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
};

const FIXED_CATEGORIES: BudgetCategory[] = ['food', 'health', 'leisure', 'transport', 'housing'];

const CATEGORY_LABELS: Record<BudgetCategory, string> = {
  food: 'Food',
  health: 'Health',
  leisure: 'Leisure',
  transport: 'Transport',
  housing: 'Housing',
};

const categoryIcon = (category: BudgetCategory) => {
  switch (category) {
    case 'food':
      return Utensils;
    case 'health':
      return HeartPulse;
    case 'leisure':
      return ShoppingBag;
    case 'transport':
      return Car;
    case 'housing':
    default:
      return Home;
  }
};

const defaultSummaryForCategory = (category: BudgetCategory): BudgetSummary => ({
  budget: 0,
  spent: 0,
  remaining: 0,
  usage: 0,
  status: 'within_budget',
  period: 'monthly',
  category,
});

const currentMonth = new Date().getMonth() + 1;
const currentYear = new Date().getFullYear();

function BudgetCard({ title, category, summary, large, onEdit, onDelete }: BudgetCardProps) {
  const Icon = categoryIcon(category);
  const percentage = Math.min(Math.max(summary.usage, 0), 100);
  const remaining = summary.remaining;

  const statusColors = {
    within_budget: 'text-emerald-zenith-primary bg-emerald-zenith-primary/10 border-emerald-zenith-primary/20',
    warning: 'text-emerald-zenith-warning bg-emerald-zenith-warning/10 border-emerald-zenith-warning/20',
    overspent: 'text-emerald-zenith-error bg-emerald-zenith-error/10 border-emerald-zenith-error/20',
  };

  const barColors = {
    within_budget: 'bg-emerald-zenith-primary',
    warning: 'bg-emerald-zenith-warning',
    overspent: 'bg-emerald-zenith-error',
  };

  return (
    <div className={cn(
      'bg-emerald-zenith-surface rounded-2xl p-5 border border-emerald-zenith-text-muted/15 hover:shadow-xl hover:shadow-emerald-zenith-primary/10 transition-all group flex flex-col',
      large ? 'md:col-span-2 lg:col-span-2' : 'col-span-1',
    )}>
      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center',
            summary.status === 'within_budget' ? 'bg-emerald-zenith-primary/20 text-emerald-zenith-primary' :
            summary.status === 'warning' ? 'bg-emerald-zenith-warning/20 text-emerald-zenith-warning' :
            'bg-emerald-zenith-error/20 text-emerald-zenith-error',
          )}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-emerald-zenith-text">{title}</h3>
            <span className={cn(
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest mt-1 border',
              statusColors[summary.status],
            )}>
              {summary.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        {(onEdit || onDelete) && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button type="button" onClick={onEdit} className="p-2 text-emerald-zenith-text-muted hover:text-emerald-zenith-text transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button type="button" onClick={onDelete} className="p-2 text-emerald-zenith-text-muted hover:text-emerald-zenith-error transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {large ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <div>
            <p className="text-[10px] font-black text-emerald-zenith-text-muted uppercase tracking-widest mb-2">Budget Amount</p>
            <p className="text-xl font-black text-emerald-zenith-text">${summary.budget.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] font-black text-emerald-zenith-text-muted uppercase tracking-widest mb-2">Spent Amount</p>
            <p className={cn('text-xl font-black', summary.spent > summary.budget ? 'text-emerald-zenith-error' : 'text-emerald-zenith-primary')}>
              ${summary.spent.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-black text-emerald-zenith-text-muted uppercase tracking-widest mb-2">Remaining</p>
            <p className={cn('text-xl font-black', remaining < 0 ? 'text-emerald-zenith-error' : 'text-emerald-zenith-text')}>
              ${remaining.toLocaleString()}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3 mb-5 flex-1">
          <div className="flex justify-between items-end">
            <span className="text-xs font-bold text-emerald-zenith-text-muted uppercase tracking-wider">Spent</span>
            <span className={cn('text-base font-black', summary.spent > summary.budget ? 'text-emerald-zenith-error' : 'text-emerald-zenith-text')}>
              ${summary.spent.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-end">
            <span className="text-xs font-bold text-emerald-zenith-text-muted uppercase tracking-wider">Total Budget</span>
            <span className="text-sm font-bold text-emerald-zenith-text-muted/60">${summary.budget.toLocaleString()}</span>
          </div>
        </div>
      )}

      <div>
        <div className="w-full bg-emerald-zenith-surface-high rounded-full h-2 mb-2 overflow-hidden">
          <div className={cn('h-full rounded-full transition-all duration-1000 ease-out', barColors[summary.status])} style={{ width: `${percentage}%` }} />
        </div>
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
          <span className="text-emerald-zenith-text-muted">{Math.round(summary.usage)}% utilized</span>
          <span className={cn(
            summary.status === 'overspent' ? 'text-emerald-zenith-error' :
            summary.status === 'warning' ? 'text-emerald-zenith-warning' : 'text-emerald-zenith-primary',
          )}>
            ${remaining.toLocaleString()} Remaining
          </span>
        </div>
      </div>
    </div>
  );
}

export function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [summaryResponse, setSummaryResponse] = useState<BudgetSummaryResponse>({
    categories: [],
    totals: {
      budget: 0,
      spent: 0,
      remaining: 0,
      usage: 0,
      status: 'within_budget',
    },
    period: 'monthly',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formAmount, setFormAmount] = useState('');
  const [formCategory, setFormCategory] = useState<BudgetCategory>('food');
  const [formMonth, setFormMonth] = useState<number>(currentMonth);
  const [formYear, setFormYear] = useState<number>(currentYear);
  const [filterCategory, setFilterCategory] = useState<'' | BudgetCategory>('');
  const [filterMonth, setFilterMonth] = useState<number>(currentMonth);
  const [filterYear, setFilterYear] = useState<number>(currentYear);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadBudgetsData = useCallback(async () => {
    setIsLoading(true);

    try {
      const query = {
        period: 'monthly' as const,
        month: filterMonth,
        year: filterYear,
        category: filterCategory || undefined,
      };

      const [budgetList, summary] = await Promise.all([
        listBudgets(query),
        getBudgetSummary(query),
      ]);

      setBudgets(budgetList);
      setSummaryResponse(summary);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to load budgets.');
      setBudgets([]);
      setSummaryResponse({
        categories: [],
        totals: {
          budget: 0,
          spent: 0,
          remaining: 0,
          usage: 0,
          status: 'within_budget',
        },
        period: 'monthly',
        month: filterMonth,
        year: filterYear,
      });
    } finally {
      setIsLoading(false);
    }
  }, [filterCategory, filterMonth, filterYear]);

  useEffect(() => {
    void loadBudgetsData();
  }, [loadBudgetsData]);

  const handleCreateBudget = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedAmount = Number(formAmount);

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage('Please enter a valid budget amount greater than zero.');
      return;
    }

    setIsSaving(true);

    try {
      await createBudget({
        amount: parsedAmount,
        period: 'monthly',
        category: formCategory,
        month: formMonth,
        year: formYear,
      });

      setFormAmount('');
      setIsCreateOpen(false);
      setErrorMessage(null);
      await loadBudgetsData();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to create budget right now.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBudget = async (id: string) => {
    const shouldDelete = window.confirm('Delete this budget?');

    if (!shouldDelete) {
      return;
    }

    try {
      await deleteBudget(id);
      await loadBudgetsData();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to delete budget right now.');
    }
  };

  const handleEditBudget = async (budget: Budget) => {
    const nextAmount = window.prompt('Update budget amount', String(budget.amount));

    if (!nextAmount) {
      return;
    }

    const parsedAmount = Number(nextAmount);

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage('Please provide a valid budget amount.');
      return;
    }

    try {
      await updateBudget(budget.id, {
        amount: parsedAmount,
        period: 'monthly',
        category: (budget.category as BudgetCategory) ?? 'food',
        month: budget.month,
        year: budget.year,
      });
      setErrorMessage(null);
      await loadBudgetsData();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to update budget right now.');
    }
  };

  const summaryByCategory = useMemo(() => {
    const map = new Map<BudgetCategory, BudgetSummary>();

    for (const item of summaryResponse.categories) {
      if (item.category && FIXED_CATEGORIES.includes(item.category as BudgetCategory)) {
        map.set(item.category as BudgetCategory, item);
      }
    }

    return map;
  }, [summaryResponse.categories]);

  const cards = useMemo(() => {
    const sourceCategories = filterCategory ? [filterCategory] : FIXED_CATEGORIES;

    return sourceCategories.map((category) => {
      const budget = budgets.find((entry) => entry.category === category);
      const summary = summaryByCategory.get(category) ?? defaultSummaryForCategory(category);

      return {
        category,
        title: CATEGORY_LABELS[category],
        summary,
        budget,
      };
    }).sort((a, b) => b.summary.usage - a.summary.usage);
  }, [budgets, filterCategory, summaryByCategory]);

  return (
    <div className="p-5 lg:p-6 space-y-10 lg:space-y-12 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-6 md:flex-row md:justify-between md:items-end">
        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl xl:text-5xl font-black tracking-tight text-emerald-zenith-text">Budgets</h2>
          <p className="text-emerald-zenith-text-muted text-sm md:text-base font-medium max-w-lg">
            Set monthly budgets per fixed category and track remaining balances from real expenses.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateOpen((current) => !current)}
          disabled={isSaving}
          className="flex items-center gap-2 bg-emerald-zenith-primary/10 hover:bg-emerald-zenith-primary/20 text-emerald-zenith-primary border border-emerald-zenith-primary/30 px-8 py-4 rounded-2xl font-bold transition-all active:scale-[0.98] group"
        >
          <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span>{isCreateOpen ? 'Hide form' : isSaving ? 'Saving...' : 'Create budget'}</span>
        </button>
      </div>

      <section className="rounded-3xl border border-emerald-zenith-text-muted/15 bg-emerald-zenith-surface p-5 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-widest text-emerald-zenith-text-muted px-1">Month</label>
            <input
              type="number"
              min={1}
              max={12}
              value={filterMonth}
              onChange={(event) => setFilterMonth(Number(event.target.value))}
              className="w-full bg-emerald-zenith-surface-high/50 border border-emerald-zenith-text-muted/20 rounded-xl px-4 py-3 text-sm font-bold text-emerald-zenith-text"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-widest text-emerald-zenith-text-muted px-1">Year</label>
            <input
              type="number"
              min={2000}
              max={2100}
              value={filterYear}
              onChange={(event) => setFilterYear(Number(event.target.value))}
              className="w-full bg-emerald-zenith-surface-high/50 border border-emerald-zenith-text-muted/20 rounded-xl px-4 py-3 text-sm font-bold text-emerald-zenith-text"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-widest text-emerald-zenith-text-muted px-1">Category</label>
            <select
              value={filterCategory}
              onChange={(event) => setFilterCategory(event.target.value as '' | BudgetCategory)}
              className="w-full bg-emerald-zenith-surface-high/50 border border-emerald-zenith-text-muted/20 rounded-xl px-4 py-3 text-sm font-bold text-emerald-zenith-text"
            >
              <option value="">All Categories</option>
              {FIXED_CATEGORIES.map((category) => (
                <option key={category} value={category}>{CATEGORY_LABELS[category]}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {isCreateOpen && (
        <form onSubmit={handleCreateBudget} className="rounded-3xl border border-emerald-zenith-text-muted/15 bg-emerald-zenith-surface p-5 md:p-6 shadow-2xl shadow-emerald-950/10">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-widest text-emerald-zenith-text-muted px-1">Amount</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formAmount}
                onChange={(event) => setFormAmount(event.target.value)}
                placeholder="0.00"
                className="w-full bg-emerald-zenith-surface-high/50 border border-emerald-zenith-text-muted/20 rounded-xl px-4 py-3 text-sm font-bold text-emerald-zenith-text"
                disabled={isSaving}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-widest text-emerald-zenith-text-muted px-1">Category</label>
              <select
                value={formCategory}
                onChange={(event) => setFormCategory(event.target.value as BudgetCategory)}
                className="w-full bg-emerald-zenith-surface-high/50 border border-emerald-zenith-text-muted/20 rounded-xl px-4 py-3 text-sm font-bold text-emerald-zenith-text"
                disabled={isSaving}
              >
                {FIXED_CATEGORIES.map((category) => (
                  <option key={category} value={category}>{CATEGORY_LABELS[category]}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-widest text-emerald-zenith-text-muted px-1">Month</label>
              <input
                type="number"
                min={1}
                max={12}
                value={formMonth}
                onChange={(event) => setFormMonth(Number(event.target.value))}
                className="w-full bg-emerald-zenith-surface-high/50 border border-emerald-zenith-text-muted/20 rounded-xl px-4 py-3 text-sm font-bold text-emerald-zenith-text"
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-widest text-emerald-zenith-text-muted px-1">Year</label>
              <input
                type="number"
                min={2000}
                max={2100}
                value={formYear}
                onChange={(event) => setFormYear(Number(event.target.value))}
                className="w-full bg-emerald-zenith-surface-high/50 border border-emerald-zenith-text-muted/20 rounded-xl px-4 py-3 text-sm font-bold text-emerald-zenith-text"
                disabled={isSaving}
              />
            </div>

            <div className="flex gap-3 md:justify-end">
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="flex-1 md:flex-none rounded-xl border border-emerald-zenith-text-muted/25 px-5 py-3 text-xs font-black uppercase tracking-widest text-emerald-zenith-text-muted hover:bg-emerald-zenith-surface-high transition-all"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 md:flex-none rounded-xl bg-emerald-zenith-primary px-5 py-3 text-xs font-black uppercase tracking-widest text-emerald-zenith-accent hover:brightness-110 transition-all"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      )}

      {errorMessage && (
        <div className="rounded-xl border border-emerald-zenith-error/30 bg-emerald-zenith-error/10 px-4 py-3 text-sm text-emerald-zenith-error">
          {errorMessage}
        </div>
      )}

      {isLoading ? (
        <div className="text-sm text-emerald-zenith-text-muted">Loading budgets...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((item, index) => {
            const budgetEntry = item.budget;

            return (
              <Reveal key={item.category} className={index === 0 ? 'md:col-span-2 lg:col-span-2' : undefined} delay={0.03 * (index + 1)}>
                <BudgetCard
                  title={item.title}
                  category={item.category}
                  summary={item.summary}
                  large={index === 0}
                  onEdit={budgetEntry ? () => { void handleEditBudget(budgetEntry); } : undefined}
                  onDelete={budgetEntry ? () => { void handleDeleteBudget(budgetEntry.id); } : undefined}
                />
              </Reveal>
            );
          })}
        </div>
      )}

      <section className="mt-12 md:mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          <Reveal className="lg:col-span-1 space-y-6" delay={0.05}>
            <h4 className="text-2xl md:text-3xl font-black text-emerald-zenith-text tracking-tight">
              Monthly Allocation Analysis
            </h4>
            <p className="text-emerald-zenith-text-muted leading-relaxed text-base md:text-lg">
              Total usage is {summaryResponse.totals.usage.toFixed(1)}% with {summaryResponse.totals.status.replace('_', ' ')} status.
            </p>
            <button type="button" className="text-emerald-zenith-primary font-bold flex items-center gap-2 group text-lg">
              <span>View detailed forecast</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </Reveal>

          <Reveal className="lg:col-span-2" delay={0.12}>
            <div className="bg-emerald-zenith-surface-high rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden h-72 md:h-90 group">
              <div className="absolute inset-0 bg-linear-to-t from-emerald-zenith-surface-high via-transparent to-transparent" />

              <div className="absolute bottom-5 md:bottom-10 left-5 md:left-10 right-5 md:right-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-0">
                <div>
                  <p className="text-3xl md:text-[3rem] font-black text-emerald-zenith-text leading-none mb-2">
                    ${summaryResponse.totals.budget.toLocaleString()}
                  </p>
                  <p className="text-xs font-black text-emerald-zenith-primary uppercase tracking-[0.3em]">Total Monthly Capacity</p>
                </div>
                <div className="flex gap-2 items-end">
                  <div className="w-3 h-16 bg-emerald-zenith-primary rounded-full" />
                  <div className="w-3 h-24 bg-emerald-zenith-primary/60 rounded-full" />
                  <div className="w-3 h-12 bg-emerald-zenith-primary rounded-full" />
                  <div className="w-3 h-32 bg-emerald-zenith-primary/40 rounded-full" />
                  <div className="w-3 h-20 bg-emerald-zenith-primary/80 rounded-full" />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

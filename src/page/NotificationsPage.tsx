import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, BellRing, RefreshCw, Settings2, TriangleAlert } from 'lucide-react';
import { Link } from 'react-router';
import {
  getBudgetSummary,
  type BudgetCategory,
  type BudgetSummary,
} from '../api/finance';
import { Reveal } from '../components/Reveal';
import {
  NOTIFICATION_PREFERENCES_EVENT,
  getNotificationPreferences,
  type NotificationPreferences,
} from '../lib/notificationPreferences';

type BudgetAlertType = 'warning' | 'overspent';

type BudgetAlert = {
  id: string;
  category: BudgetCategory;
  type: BudgetAlertType;
  usage: number;
  spent: number;
  budget: number;
  remaining: number;
  month?: number;
  year?: number;
};

const FIXED_CATEGORIES: BudgetCategory[] = ['food', 'health', 'leisure', 'transport', 'housing'];

const CATEGORY_LABELS: Record<BudgetCategory, string> = {
  food: 'Food',
  health: 'Health',
  leisure: 'Leisure',
  transport: 'Transport',
  housing: 'Housing',
};

const currentMonth = new Date().getMonth() + 1;
const currentYear = new Date().getFullYear();
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

const isBudgetCategory = (value: BudgetSummary['category']): value is BudgetCategory => (
  typeof value === 'string' && FIXED_CATEGORIES.includes(value as BudgetCategory)
);

const toAlert = (summary: BudgetSummary, preferences: NotificationPreferences): BudgetAlert | null => {
  if (!isBudgetCategory(summary.category)) {
    return null;
  }

  if (summary.usage >= 100 && preferences.overspendingAlerts) {
    return {
      id: `${summary.category}-overspent-${summary.month ?? currentMonth}-${summary.year ?? currentYear}`,
      category: summary.category,
      type: 'overspent',
      usage: summary.usage,
      spent: summary.spent,
      budget: summary.budget,
      remaining: summary.remaining,
      month: summary.month,
      year: summary.year,
    };
  }

  if (summary.usage >= 80 && preferences.budgetWarnings) {
    return {
      id: `${summary.category}-warning-${summary.month ?? currentMonth}-${summary.year ?? currentYear}`,
      category: summary.category,
      type: 'warning',
      usage: summary.usage,
      spent: summary.spent,
      budget: summary.budget,
      remaining: summary.remaining,
      month: summary.month,
      year: summary.year,
    };
  }

  return null;
};

export function NotificationsPage() {
  const [alerts, setAlerts] = useState<BudgetAlert[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [month, setMonth] = useState<number>(currentMonth);
  const [year, setYear] = useState<number>(currentYear);
  const [preferences, setPreferences] = useState<NotificationPreferences>(() => getNotificationPreferences());

  const loadAlerts = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const summary = await getBudgetSummary({ period: 'monthly', month, year });

      const nextAlerts = summary.categories
        .map((item) => toAlert(item, preferences))
        .filter((item): item is BudgetAlert => item !== null)
        .sort((a, b) => {
          if (a.type !== b.type) {
            return a.type === 'overspent' ? -1 : 1;
          }

          return b.usage - a.usage;
        });

      setAlerts(nextAlerts);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to load notifications.');
      setAlerts([]);
    } finally {
      setIsLoading(false);
    }
  }, [month, year, preferences]);

  useEffect(() => {
    void loadAlerts();
  }, [loadAlerts]);

  useEffect(() => {
    const syncPreferences = () => {
      setPreferences(getNotificationPreferences());
    };

    window.addEventListener(NOTIFICATION_PREFERENCES_EVENT, syncPreferences);
    return () => {
      window.removeEventListener(NOTIFICATION_PREFERENCES_EVENT, syncPreferences);
    };
  }, []);

  const disabledMessage = useMemo(() => {
    if (preferences.budgetWarnings || preferences.overspendingAlerts) {
      return null;
    }

    return 'Both budget warning and overspending notifications are disabled in Settings.';
  }, [preferences]);

  return (
    <div className="p-5 lg:p-6 space-y-6 max-w-7xl mx-auto w-full">
      <section className="dashboard-page-header">
        <h2 className="dashboard-page-title">Notifications</h2>
        <p className="dashboard-page-subtitle">
          Budget alerts are generated when a category reaches at least 80% usage or goes over budget.
        </p>
      </section>

      <Reveal delay={0.08}>
        <section className="rounded-2xl border border-emerald-zenith-text-muted/20 bg-emerald-zenith-surface p-4 md:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="grid grid-cols-2 gap-3 sm:max-w-md">
              <label className="text-sm text-emerald-zenith-text-muted">
                Month
                <select
                  value={month}
                  onChange={(event) => setMonth(Number(event.target.value))}
                  className="mt-1 block w-full rounded-xl border border-emerald-zenith-text-muted/20 bg-emerald-zenith-surface-high/45 px-3 py-2 text-sm text-emerald-zenith-text"
                >
                  {MONTH_LABELS.map((label, index) => (
                    <option key={label} value={index + 1}>{label}</option>
                  ))}
                </select>
              </label>

              <label className="text-sm text-emerald-zenith-text-muted">
                Year
                <input
                  type="number"
                  min="2000"
                  max="2100"
                  value={year}
                  onChange={(event) => setYear(Number(event.target.value))}
                  className="mt-1 block w-full rounded-xl border border-emerald-zenith-text-muted/20 bg-emerald-zenith-surface-high/45 px-3 py-2 text-sm text-emerald-zenith-text"
                />
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/app/settings?section=notifications"
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-zenith-text-muted/25 bg-emerald-zenith-surface-high/35 px-3.5 py-2 text-sm font-semibold text-emerald-zenith-text hover:text-emerald-zenith-primary"
              >
                <Settings2 className="h-4 w-4" />
                Notification Settings
              </Link>
              <button
                type="button"
                onClick={() => void loadAlerts()}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-zenith-primary px-3.5 py-2 text-sm font-black text-emerald-zenith-accent hover:brightness-110"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>
        </section>
      </Reveal>

      {disabledMessage && (
        <p className="rounded-xl border border-emerald-zenith-warning/40 bg-emerald-zenith-warning/10 px-4 py-3 text-sm text-emerald-zenith-warning">
          {disabledMessage}
        </p>
      )}

      {errorMessage && (
        <p className="rounded-xl border border-emerald-zenith-error/40 bg-emerald-zenith-error/10 px-4 py-3 text-sm text-emerald-zenith-error">
          {errorMessage}
        </p>
      )}

      {isLoading ? (
        <div className="text-sm text-emerald-zenith-text-muted">Loading notifications...</div>
      ) : alerts.length === 0 ? (
        <Reveal delay={0.12}>
          <section className="rounded-2xl border border-emerald-zenith-text-muted/20 bg-emerald-zenith-surface p-6 text-center">
            <BellRing className="mx-auto h-10 w-10 text-emerald-zenith-text-muted/70" />
            <h3 className="mt-3 text-lg font-bold text-emerald-zenith-text">No budget alerts</h3>
            <p className="mt-1 text-sm text-emerald-zenith-text-muted">
              Nothing has crossed your configured threshold for {MONTH_LABELS[month - 1]} {year}.
            </p>
          </section>
        </Reveal>
      ) : (
        <section className="space-y-3">
          {alerts.map((alert, index) => {
            const isOverspent = alert.type === 'overspent';

            return (
              <Reveal key={alert.id} delay={0.07 + index * 0.04}>
                <article className={`rounded-2xl border p-4 md:p-5 ${isOverspent
                  ? 'border-emerald-zenith-error/35 bg-emerald-zenith-error/10'
                  : 'border-emerald-zenith-warning/35 bg-emerald-zenith-warning/10'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 rounded-xl p-2 ${isOverspent
                      ? 'bg-emerald-zenith-error/20 text-emerald-zenith-error'
                      : 'bg-emerald-zenith-warning/20 text-emerald-zenith-warning'
                    }`}>
                      {isOverspent ? <AlertTriangle className="h-5 w-5" /> : <TriangleAlert className="h-5 w-5" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-black uppercase tracking-widest text-emerald-zenith-text-muted">
                        {isOverspent ? 'Overspent Alert' : 'Budget Warning'}
                      </p>
                      <h4 className="mt-1 text-lg font-black text-emerald-zenith-text">
                        {CATEGORY_LABELS[alert.category]} budget is at {Math.round(alert.usage)}%
                      </h4>
                      <p className="mt-1 text-sm text-emerald-zenith-text-muted">
                        Spent ${alert.spent.toLocaleString()} of ${alert.budget.toLocaleString()}.
                        {isOverspent
                          ? ` You are over budget by $${Math.abs(alert.remaining).toLocaleString()}.`
                          : ` Remaining balance is $${alert.remaining.toLocaleString()}.`}
                      </p>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </section>
      )}
    </div>
  );
}

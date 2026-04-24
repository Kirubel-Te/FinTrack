import { ApiError, apiRequest } from './client';
import {
  clearAuthSession,
  getAuthApiBaseUrl,
  getStoredAccessToken,
  refreshSession,
  sanitizeErrorMessage,
} from './auth';

const API_BASE_URL = getAuthApiBaseUrl();

export type TransactionRecord = {
  id: string;
  amount: number;
  category: string;
  date: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ListQuery = {
  page?: number;
  limit?: number;
  category?: string;
  startDate?: string;
  endDate?: string;
};

export type TransactionSearchQuery = {
  keyword: string;
  page?: number;
  limit?: number;
  category?: string;
  startDate?: string;
  endDate?: string;
};

export type TransactionSearchRecord = {
  id: string;
  transactionType: 'income' | 'expense';
  amount: number;
  category: string;
  description: string | null;
  date: string;
};

export type TransactionSearchCategoryBreakdownItem = {
  category: string;
  totalCount: number;
  totalAmount: number;
};

export type TransactionSearchAnalytics = {
  totalCount: number;
  totalAmount: number;
  categoryBreakdown: TransactionSearchCategoryBreakdownItem[];
  dateRange: {
    startDate: string | null;
    endDate: string | null;
  };
};

export type TransactionSearchResponse = {
  records: TransactionSearchRecord[];
  analytics: TransactionSearchAnalytics;
  meta?: PaginatedResponse<TransactionSearchRecord>['meta'];
};

export type PaginatedResponse<TData> = {
  data: TData[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

const normalizePaginatedResponse = <TData>(payload: unknown): PaginatedResponse<TData> => {
  if (Array.isArray(payload)) {
    return { data: payload as TData[] };
  }

  if (typeof payload === 'object' && payload !== null) {
    const candidate = payload as {
      data?: unknown;
      meta?: PaginatedResponse<TData>['meta'];
    };

    if (Array.isArray(candidate.data)) {
      return {
        data: candidate.data as TData[],
        meta: candidate.meta,
      };
    }

    if (typeof candidate.data === 'object' && candidate.data !== null) {
      const nested = candidate.data as {
        data?: unknown;
        items?: unknown;
        results?: unknown;
        meta?: PaginatedResponse<TData>['meta'];
      };

      const nestedArray = [nested.data, nested.items, nested.results].find((entry) => Array.isArray(entry));
      if (Array.isArray(nestedArray)) {
        return {
          data: nestedArray as TData[],
          meta: nested.meta,
        };
      }
    }
  }

  return { data: [] };
};

const normalizeArrayResponse = <TData>(payload: unknown, alternateArrayKeys: string[] = []): TData[] => {
  if (Array.isArray(payload)) {
    return payload as TData[];
  }

  if (typeof payload === 'object' && payload !== null) {
    const candidate = payload as Record<string, unknown>;

    if (Array.isArray(candidate.data)) {
      return candidate.data as TData[];
    }

    if (typeof candidate.data === 'object' && candidate.data !== null) {
      const nestedData = candidate.data as Record<string, unknown>;

      if (Array.isArray(nestedData.data)) {
        return nestedData.data as TData[];
      }

      for (const key of alternateArrayKeys) {
        if (Array.isArray(nestedData[key])) {
          return nestedData[key] as TData[];
        }
      }
    }

    for (const key of alternateArrayKeys) {
      if (Array.isArray(candidate[key])) {
        return candidate[key] as TData[];
      }
    }
  }

  return [];
};

const buildUrl = (path: string, query?: Record<string, string | number | boolean | null | undefined>) => {
  const url = new URL(`${API_BASE_URL}${path}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === '') {
        continue;
      }

      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
};

const parseResponse = async (response: Response): Promise<unknown> => {
  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();
  return text ? { message: text } : {};
};

const extractMessage = (payload: unknown, fallback: string): string => {
  if (typeof payload === 'object' && payload !== null) {
    const candidate = payload as { message?: unknown };

    if (typeof candidate.message === 'string') {
      return sanitizeErrorMessage(candidate.message, fallback);
    }
  }

  return fallback;
};

const fetchAuthenticatedPayload = async (path: string, query?: TransactionSearchQuery): Promise<unknown> => {
  const headers: Record<string, string> = {};
  const accessToken = getStoredAccessToken();

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(buildUrl(path, query), {
    method: 'GET',
    cache: 'no-store',
    headers,
  });

  const payload = await parseResponse(response);

  if (response.status === 401) {
    try {
      await refreshSession();
      return fetchAuthenticatedPayload(path, query);
    } catch {
      clearAuthSession();
    }
  }

  if (!response.ok) {
    throw new ApiError(
      extractMessage(payload, `Request failed with status ${response.status}.`),
      response.status,
    );
  }

  return payload;
};

const normalizeSearchRecord = (value: unknown): TransactionSearchRecord | null => {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const candidate = value as Record<string, unknown>;

  if (typeof candidate.id !== 'string') {
    return null;
  }

  const transactionType = candidate.transactionType === 'expense' ? 'expense' : 'income';

  return {
    id: candidate.id,
    transactionType,
    amount: toNumber(candidate.amount),
    category: typeof candidate.category === 'string' ? candidate.category : '',
    description: typeof candidate.description === 'string' ? candidate.description : null,
    date: typeof candidate.date === 'string' ? candidate.date : new Date().toISOString(),
  };
};

const normalizeSearchResponse = (payload: unknown): TransactionSearchResponse => {
  if (typeof payload !== 'object' || payload === null) {
    return {
      records: [],
      analytics: {
        totalCount: 0,
        totalAmount: 0,
        categoryBreakdown: [],
        dateRange: {
          startDate: null,
          endDate: null,
        },
      },
    };
  }

  const candidate = payload as {
    data?: {
      records?: unknown;
      analytics?: unknown;
    };
    meta?: PaginatedResponse<TransactionSearchRecord>['meta'];
  };

  const data = candidate.data ?? payload;
  const searchData = data as {
    records?: unknown;
    analytics?: unknown;
  };

  const records = Array.isArray(searchData.records)
    ? searchData.records.map((item) => normalizeSearchRecord(item)).filter((item): item is TransactionSearchRecord => item !== null)
    : [];

  const analyticsSource = typeof searchData.analytics === 'object' && searchData.analytics !== null
    ? searchData.analytics as Record<string, unknown>
    : {};

  const dateRangeSource = typeof analyticsSource.dateRange === 'object' && analyticsSource.dateRange !== null
    ? analyticsSource.dateRange as Record<string, unknown>
    : {};

  const categoryBreakdown = Array.isArray(analyticsSource.categoryBreakdown)
    ? analyticsSource.categoryBreakdown
        .map((item) => {
          if (typeof item !== 'object' || item === null) {
            return null;
          }

          const breakdownItem = item as Record<string, unknown>;

          return {
            category: typeof breakdownItem.category === 'string' ? breakdownItem.category : '',
            totalCount: toNumber(breakdownItem.totalCount),
            totalAmount: toNumber(breakdownItem.totalAmount),
          };
        })
        .filter((item): item is TransactionSearchCategoryBreakdownItem => item !== null && item.category.length > 0)
    : [];

  return {
    records,
    analytics: {
      totalCount: toNumber(analyticsSource.totalCount),
      totalAmount: toNumber(analyticsSource.totalAmount),
      categoryBreakdown,
      dateRange: {
        startDate: typeof dateRangeSource.startDate === 'string' ? dateRangeSource.startDate : null,
        endDate: typeof dateRangeSource.endDate === 'string' ? dateRangeSource.endDate : null,
      },
    },
    meta: candidate.meta,
  };
};

export type ReportSummary = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
};

export type MonthlyReport = {
  month: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
};

export type CategoryReport = {
  category: string;
  total: number;
};

export type BudgetPeriod = 'monthly';

export type BudgetCategory = 'food' | 'health' | 'leisure' | 'transport' | 'housing';

export type BudgetStatus = 'within_budget' | 'warning' | 'overspent';

export type Budget = {
  id: string;
  amount: number;
  period: BudgetPeriod;
  category?: BudgetCategory | string | null;
  month?: number;
  year?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type BudgetSummary = {
  budget: number;
  spent: number;
  remaining: number;
  usage: number;
  status: BudgetStatus;
  period: BudgetPeriod;
  category: BudgetCategory | string | null;
  month?: number;
  year?: number;
};

export type BudgetSummaryResponse = {
  categories: BudgetSummary[];
  totals: {
    budget: number;
    spent: number;
    remaining: number;
    usage: number;
    status: BudgetStatus;
  };
  period: BudgetPeriod;
  month?: number;
  year?: number;
};

export type CreateTransactionPayload = {
  amount: number;
  category: string;
  date: string;
  description?: string | null;
};

export type CreateBudgetPayload = {
  amount: number;
  period: BudgetPeriod;
  category: BudgetCategory | string;
  month?: number;
  year?: number;
};

export type BudgetQuery = {
  period?: BudgetPeriod;
  category?: BudgetCategory | string;
  month?: number;
  year?: number;
};

const normalizeBudgetCategory = (value?: string | null): BudgetCategory | null => {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();

  if (normalized === 'lesiure') {
    return 'leisure';
  }

  if (
    normalized === 'food'
    || normalized === 'health'
    || normalized === 'leisure'
    || normalized === 'transport'
    || normalized === 'housing'
  ) {
    return normalized;
  }

  return null;
};

const toNumber = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeBudget = (value: unknown): Budget | null => {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const candidate = value as Record<string, unknown>;

  if (typeof candidate.id !== 'string') {
    return null;
  }

  return {
    id: candidate.id,
    amount: toNumber(candidate.amount),
    period: 'monthly',
    category: normalizeBudgetCategory(typeof candidate.category === 'string' ? candidate.category : null),
    month: toNumber(candidate.month) || undefined,
    year: toNumber(candidate.year) || undefined,
    createdAt: typeof candidate.createdAt === 'string' ? candidate.createdAt : undefined,
    updatedAt: typeof candidate.updatedAt === 'string' ? candidate.updatedAt : undefined,
  };
};

const normalizeBudgetSummary = (value: unknown, fallbackCategory?: BudgetCategory | null): BudgetSummary | null => {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const candidate = value as Record<string, unknown>;

  const category = normalizeBudgetCategory(
    typeof candidate.category === 'string' ? candidate.category : fallbackCategory ?? null,
  );

  return {
    budget: toNumber(candidate.budget),
    spent: toNumber(candidate.spent),
    remaining: toNumber(candidate.remaining),
    usage: toNumber(candidate.usage),
    status: (candidate.status === 'warning' || candidate.status === 'overspent') ? candidate.status : 'within_budget',
    period: 'monthly',
    category,
    month: toNumber(candidate.month) || undefined,
    year: toNumber(candidate.year) || undefined,
  };
};

const resolveBudgetStatus = (usage: number): BudgetStatus => {
  if (usage >= 100) {
    return 'overspent';
  }

  if (usage >= 80) {
    return 'warning';
  }

  return 'within_budget';
};

const normalizeBudgetSummaryResponse = (payload: unknown, query?: BudgetQuery): BudgetSummaryResponse => {
  const period: BudgetPeriod = 'monthly';

  if (typeof payload === 'object' && payload !== null) {
    const candidate = payload as Record<string, unknown>;

    const candidateCategories = Array.isArray(candidate.categories)
      ? candidate.categories
      : (typeof candidate.data === 'object' && candidate.data !== null && Array.isArray((candidate.data as Record<string, unknown>).categories)
        ? (candidate.data as Record<string, unknown>).categories as unknown[]
        : []);

    if (candidateCategories.length > 0) {
      const categories = candidateCategories
        .map((item) => normalizeBudgetSummary(item))
        .filter((item): item is BudgetSummary => item !== null);

      const totalsSource = (typeof candidate.totals === 'object' && candidate.totals !== null)
        ? candidate.totals
        : (typeof candidate.data === 'object' && candidate.data !== null && typeof (candidate.data as Record<string, unknown>).totals === 'object'
          ? (candidate.data as Record<string, unknown>).totals as Record<string, unknown>
          : null);

      const totalBudget = totalsSource ? toNumber((totalsSource as Record<string, unknown>).budget) : categories.reduce((sum, item) => sum + item.budget, 0);
      const totalSpent = totalsSource ? toNumber((totalsSource as Record<string, unknown>).spent) : categories.reduce((sum, item) => sum + item.spent, 0);
      const totalRemaining = totalsSource ? toNumber((totalsSource as Record<string, unknown>).remaining) : totalBudget - totalSpent;
      const totalUsage = totalsSource ? toNumber((totalsSource as Record<string, unknown>).usage) : (totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0);

      return {
        categories,
        totals: {
          budget: totalBudget,
          spent: totalSpent,
          remaining: totalRemaining,
          usage: totalUsage,
          status: resolveBudgetStatus(totalUsage),
        },
        period,
        month: query?.month,
        year: query?.year,
      };
    }

    const singleSummary = normalizeBudgetSummary(candidate, normalizeBudgetCategory(query?.category ?? null) ?? undefined);
    if (singleSummary) {
      const usage = toNumber(singleSummary.usage);

      return {
        categories: [singleSummary],
        totals: {
          budget: singleSummary.budget,
          spent: singleSummary.spent,
          remaining: singleSummary.remaining,
          usage,
          status: resolveBudgetStatus(usage),
        },
        period,
        month: singleSummary.month ?? query?.month,
        year: singleSummary.year ?? query?.year,
      };
    }
  }

  return {
    categories: [],
    totals: {
      budget: 0,
      spent: 0,
      remaining: 0,
      usage: 0,
      status: 'within_budget',
    },
    period,
    month: query?.month,
    year: query?.year,
  };
};

export const createIncome = (payload: CreateTransactionPayload) => (
  apiRequest<TransactionRecord>({
    path: '/api/v1/incomes',
    method: 'POST',
    body: payload,
  })
);

export const listIncomes = async (query?: ListQuery): Promise<PaginatedResponse<TransactionRecord>> => {
  const payload = await apiRequest<unknown>({
    path: '/api/v1/incomes',
    query,
  });

  return normalizePaginatedResponse<TransactionRecord>(payload);
};

export const createExpense = (payload: CreateTransactionPayload) => (
  apiRequest<TransactionRecord>({
    path: '/api/v1/expenses',
    method: 'POST',
    body: payload,
  })
);

export const listExpenses = async (query?: ListQuery): Promise<PaginatedResponse<TransactionRecord>> => {
  const payload = await apiRequest<unknown>({
    path: '/api/v1/expenses',
    query,
  });

  return normalizePaginatedResponse<TransactionRecord>(payload);
};

export const getReportSummary = () => (
  apiRequest<ReportSummary>({
    path: '/api/v1/reports/summary',
  })
);

export const getMonthlyReport = (month: string) => (
  apiRequest<MonthlyReport>({
    path: '/api/v1/reports/monthly',
    query: { month },
  })
);

export const getCategoryReport = () => (
  apiRequest<CategoryReport[]>({
    path: '/api/v1/reports/categories',
  })
);

export const searchTransactions = async (query: TransactionSearchQuery): Promise<TransactionSearchResponse> => {
  const payload = await fetchAuthenticatedPayload('/api/v1/reports/transactions/search', query);
  return normalizeSearchResponse(payload);
};

export const createBudget = (payload: CreateBudgetPayload) => (
  apiRequest<unknown>({
    path: '/api/v1/budgets',
    method: 'POST',
    body: {
      ...payload,
      period: 'monthly',
      category: normalizeBudgetCategory(payload.category) ?? 'leisure',
    },
  })
).then((payload) => normalizeBudget(payload) as Budget);

export const listBudgets = async (query?: BudgetQuery): Promise<Budget[]> => {
  const payload = await apiRequest<unknown>({
    path: '/api/v1/budgets',
    query: {
      ...query,
      category: normalizeBudgetCategory(query?.category ?? null) ?? undefined,
      period: 'monthly',
    },
  });

  return normalizeArrayResponse<unknown>(payload, ['budgets', 'items'])
    .map((item) => normalizeBudget(item))
    .filter((item): item is Budget => item !== null);
};

export const updateBudget = (id: string, payload: Partial<CreateBudgetPayload>) => (
  apiRequest<unknown>({
    path: `/api/v1/budgets/${id}`,
    method: 'PATCH',
    body: {
      ...payload,
      period: 'monthly',
      ...(payload.category !== undefined ? { category: normalizeBudgetCategory(payload.category) } : {}),
    },
  })
).then((result) => normalizeBudget(result) as Budget);

export const deleteBudget = (id: string) => (
  apiRequest<unknown>({
    path: `/api/v1/budgets/${id}`,
    method: 'DELETE',
  })
);

export const getBudgetSummary = async (query?: BudgetQuery): Promise<BudgetSummaryResponse> => {
  const payload = await apiRequest<unknown>({
    path: '/api/v1/budgets/summary',
    query: {
      ...query,
      category: normalizeBudgetCategory(query?.category ?? null) ?? undefined,
      period: 'monthly',
    },
  });

  return normalizeBudgetSummaryResponse(payload, query);
};

# FinTrack Frontend - Project Status

Last updated: 2026-04-19

## Current Snapshot
FinTrack is now a production-shaped React + TypeScript + Vite frontend with a public landing experience, authenticated `/app` shell, guarded routes, and backend-connected finance data flows. Core dashboard, transactions, budgets, and add-income/add-expense actions are integrated with API endpoints. Settings is implemented as a full screen with working logout and delete-account actions, while profile/security/preferences persistence is still mostly local-state scaffolding pending dedicated backend endpoints.

## Recent Work (Since 2026-04-10)
- Added auth route guards for protected pages via `RequireAuth` and guest redirects via `RedirectIfAuthenticated`, including session bootstrap checks against `/api/v1/auth/me`.
- Implemented token refresh lifecycle with shared in-flight refresh protection to prevent duplicate refresh calls/races.
- Added centralized API client (`apiRequest`) with auth header injection, 401 refresh-retry behavior, normalized error handling, and typed request helpers.
- Integrated dashboard metrics with backend reports endpoints (`summary`, `monthly`, `categories`) and real recent transactions from incomes + expenses.
- Integrated transactions page with real API-backed list/filter behavior and CSV export from loaded rows.
- Integrated budgets page with API-backed create/list/update/delete and summary retrieval.
- Replaced budget edit/delete browser dialogs with in-app themed modals.
- Wired Add Income/Add Expense modals to create endpoints and added data-refresh events after successful submission.
- Built full settings experience at `/app/settings` with section navigation, form validation, logout, and delete-account confirmation modal.
- Standardized dashboard page heading typography via shared title/subtitle classes and display font token.

## What Is Implemented

### Foundation and Tooling
- Vite + React + TypeScript project is configured and running.
- ESLint + TypeScript configs are in place.
- Scripts available:
  - `npm run dev`
  - `npm run build`
  - `npm run lint`
  - `npm run preview`
- Core dependencies include:
  - `react`, `react-dom`, `react-router`
  - `tailwindcss` + `@tailwindcss/vite`
  - `motion`
  - `lucide-react`
  - `recharts`

### Routing and App Structure
- BrowserRouter + nested route tree is implemented:
  - `/` -> `LandingPage`
  - `/app` -> `DashboardLayout` + index dashboard
  - `/app/transactions` -> `TransactionsPage`
  - `/app/budgets` -> `BudgetsPage`
  - `/app/settings` -> `SettingsPage`
  - `/login` -> `LoginPage`
  - `/register` -> `RegisterPage`
  - `*` -> redirect to `/`
- `/app` routes are protected and verify session validity before rendering.
- `/login` and `/register` redirect authenticated users to `/app`.
- Shared dashboard shell is provided by `DashboardLayout` (`Sidebar`, `TopBar`, nested `Outlet`, global add-income/add-expense modals).

### Authentication and Session Management
- Auth endpoints integrated under `/api/v1/auth/*` for login, register, refresh, me, logout, and delete account.
- Auth session persistence uses localStorage keys for session + access token + refresh token.
- Refresh flow is serialized (`refreshSessionInFlight`) to avoid race conditions.
- Protected requests retry once after refresh on 401 and clear session on unrecoverable auth failures.
- Error messages are sanitized and normalized for user-friendly display.

### API Layer and Domain Integration
- `src/api/client.ts` provides typed request wrapper with:
  - query serialization
  - JSON/text response parsing
  - envelope extraction
  - normalized `ApiError`
  - optional 401 refresh retry
- `src/api/finance.ts` provides typed domain helpers for:
  - incomes (create/list)
  - expenses (create/list)
  - reports (summary/monthly/categories)
  - budgets (create/list/update/delete/summary)
- Includes normalization helpers for flexible backend payload shapes and budget category normalization.

### Dashboard, Transactions, and Budgets
- Dashboard is API-driven:
  - KPI cards from summary endpoint
  - comparison chart from recent monthly reports
  - category chart from category report endpoint
  - recent transactions combined from incomes + expenses
- Transactions page is API-driven:
  - category/date filtering sent to list endpoints
  - merged income/expense rows with client pagination
  - CSV export for current loaded dataset
- Budgets page is API-driven:
  - category/month/year filters
  - create budget flow
  - edit/delete actions via in-page modals
  - summary/total computations from backend response normalization

### Add Income and Add Expense Flows
- Both modals submit to backend (`createIncome`, `createExpense`).
- Includes client-side validation, loading/success/error states, and auto-close on success.
- Emits `fintrack:transaction-updated` event to trigger dashboard/transactions refresh.

### Settings and UX System
- `/app/settings` is a complete multi-section page (Profile, Security, Budget, Notifications, Danger Zone).
- Working account actions:
  - logout
  - delete account with explicit `DELETE` confirmation modal
- Form UX includes field-level validation and status messaging.
- Design system is consistent across app surfaces using emerald tokens and shared typography utilities (`dashboard-page-title`, `dashboard-page-subtitle`).

## Current Gaps and Incomplete Areas
- Settings profile/security/preferences/notifications save flows are mostly local-state confirmations and are not fully wired to dedicated backend update endpoints yet.
- Transaction pagination is client-side after fetching up to a fixed list size; not fully server-driven pagination.
- CSV export is local dataset export only (no backend export job/download endpoint).
- Some presentation copy and side panels still include static helper/demo content.
- Automated tests are not yet present for auth guards, API integration flows, and key dashboard page behaviors.

## Suggested Next Steps (Priority Order)
1. Add backend profile/security/preferences endpoints integration for settings save actions.
2. Implement server-driven transaction pagination/sorting and align filters with backend query capabilities.
3. Add optimistic UI updates or cache strategy for transaction and budget mutations.
4. Introduce route-level and API integration tests for auth guard behavior and token refresh lifecycle.
5. Add end-to-end tests for login -> dashboard -> add transaction -> budgets/settings critical user journey.
6. Replace remaining static helper blocks with dynamic insights from backend analytics endpoints.

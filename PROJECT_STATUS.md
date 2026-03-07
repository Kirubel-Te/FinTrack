# FinTrack Frontend - Progress Status

Last updated: 2026-03-07

## Overview
The project is currently a React + TypeScript + Vite frontend with an implemented authentication UI flow (login and register screens) and shared styling foundations.

## What Is Done

### Project Setup
- Vite + React + TypeScript project initialized.
- ESLint and TypeScript configs are present (`eslint.config.js`, `tsconfig*.json`).
- Core scripts available in `package.json`:
  - `npm run dev`
  - `npm run build`
  - `npm run lint`
  - `npm run preview`

### Installed UI Dependencies
- `tailwindcss` and `@tailwindcss/vite`
- `motion` (for animations)
- `lucide-react` (icon set)

### Global Styling Foundation
- Tailwind is imported in `src/index.css`.
- Brand/design tokens are defined with theme variables:
  - `--color-primary`
  - `--color-background-dark`
  - `--color-background-light`
  - `--font-sans` (`Manrope`)
- Base body styles are configured for typography and dark/light backgrounds.

### App-Level Navigation Flow
- `src/App.tsx` has local state-based auth view switching:
  - Login view (default)
  - Register view
- No routing library is used yet; view transitions are handled in component state.

### Login Page (`src/page/LoginPage.tsx`)
- Fully designed responsive login screen:
  - Split layout on desktop (branding panel + form panel)
  - Mobile-friendly single-column behavior
- Motion animations added for entry and content reveals.
- Form includes:
  - Email field
  - Password field with show/hide toggle
  - "Forgot password" link placeholder
  - Submit button (UI only)
- Social sign-in UI buttons included (Google, Apple; UI-only placeholders).
- CTA to switch to register screen is wired.

### Register Page (`src/page/Register.tsx`)
- Fully designed responsive registration screen matching login visual language.
- Motion animations and branding section implemented.
- Form includes:
  - Full name
  - Email
  - Password with show/hide toggle
  - Confirm password with show/hide toggle
  - Submit button (UI only)
- CTA to switch back to login is wired.

### Reusable Components
- `src/components/Button.tsx`
  - Supports `primary` and `outline` variants.
  - Extends native button props.
- `src/components/Input.tsx`
  - Supports label and optional Lucide icon.
  - Extends native input props.
- Note: current login/register pages primarily use inline form elements and do not yet fully consume these shared components.

## Current Gaps / Not Done Yet
- No backend/API integration for authentication.
- No form validation logic beyond basic HTML `required` attributes.
- No user session handling or token storage.
- No React Router or URL-based navigation.
- No error/success feedback flows for auth actions.
- README is still the default Vite template and does not yet describe this project status.

## Suggested Next Steps
1. Add real form state handling and validation (e.g., React state + schema validation).
2. Connect login/register forms to backend auth endpoints.
3. Add routing (`/login`, `/register`, `/dashboard`) with route guards.
4. Refactor pages to use shared `Button` and `Input` components consistently.
5. Update `README.md` with setup instructions and product context.

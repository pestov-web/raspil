# Copilot Instructions for AI Coding Agents

## Overview

This is "Raspil" - a React expense calculator app built with Vite, TypeScript, and Tailwind CSS. Users can add people, track their expenses, automatically calculate who owes money to whom, and persist calculations as reusable sessions. The app follows **Feature-Sliced Design (FSD)** architecture with TypeScript types and Tailwind for styling.

## Application Logic & Data Flow

-   **Core Entities:**
    -   `Person` type with `id`, `name`, `expenses` (string input), and `duty` (calculated number)
    -   `Session` type with metadata (`id`, `name`, timestamps, people snapshot, totals, calculation flag)
-   **Main State:** Managed in `~pages/home/ui/HomePage.tsx` via `useState` for people list and active session snapshot
-   **Key Operations:**
    -   Add/remove people (minimum 1 person enforced)
    -   Update person fields (name, expenses)
    -   Calculate duties: `perPersonShare - actualExpenses = duty`
    -   Positive duty = person owes money, negative = person should receive money
    -   Auto-save current session to LocalStorage on every change
    -   Save/load/delete named sessions, import/export backups
    -   Generate shareable links encoded in query params; `/share` route decodes and restores the session

## FSD Architecture & Key Patterns

-   **Entry Point:** `src/main.jsx` → `~app/main.tsx` bootstraps React app with StrictMode
-   **FSD Layers:**
    ```
    src/
    ├── app/                    # 🏗 Application initialization
    │   ├── App.tsx            # Root component composition
    │   └── main.tsx           # Entry point
    ├── pages/                 # 📄 Route-level screens
    │   ├── home/              # Главный калькулятор + состояние
    │   └── share-session/     # Импорт расчета по ссылке
    ├── widgets/               # 🧩 Composite UI blocks
    │   ├── expense-calculator/ # Stats and totals
    │   ├── expense-summary/   # Results breakdown
    │   ├── people-manager/    # Add/calculate controls
    │   ├── people-table/      # Data input table
    │   ├── session-controls/  # Кнопки управления + mobile меню
    │   └── session-manager/   # Modal for saved sessions (load/delete/import/export)
    ├── features/              # 🚀 User interactions
    │   ├── add-person/        # Person creation
    │   ├── calculate-duties/  # Duty calculations
    │   ├── save-session/      # Persist calculation snapshot
    │   └── load-session/      # Restore saved snapshot
    ├── entities/              # 🎯 Business logic
    │   ├── person/            # Person model & utilities
    │   └── session/           # Session model, creation & metadata helpers
    └── shared/                # ⚡ Reusable resources
        ├── lib/               # Business calculations & storage helpers
        ├── ui/                # UI components (StatCard)
        ├── styles/            # Global CSS
        └── types/             # Global type declarations
    ```
-   **Import Rules:** Only downward - app → widgets → features → entities → shared
-   **Public APIs:** Each layer exports through `index.ts`

## Path Aliases

-   **Vite & TypeScript configured with FSD aliases:**
    ```typescript
    // Instead of: import { Person } from '../../../entities/person'
    import type { Person } from '~entities/person';
    import { StatCard } from '~shared/ui';
    import { AddPersonButton } from '~features/add-person';
    ```
-   **Available aliases:** `~app`, `~pages`, `~widgets`, `~features`, `~entities`, `~shared`

> When interacting with persistence, import storage helpers from `~shared/lib` and session types/utilities from `~entities/session`.

## Developer Workflows

-   **Package Manager:** Uses `pnpm` (see `pnpm-lock.yaml`)
-   **Development:** `pnpm dev` starts Vite dev server with HMR
-   **Build:** `pnpm build` creates optimized production build
-   **Linting:** `pnpm lint` runs ESLint (configured for React hooks and refresh)
-   **Testing:** `pnpm test` runs Vitest unit tests (see `src/tests` for examples)
-   **Coverage:** `pnpm test:coverage` generates coverage report
-   **Preview:** `pnpm preview` serves production build locally
-   **PWA Check:** `pnpm build && pnpm preview` validates service worker/manifest output

## Styling & UI Patterns

-   **Framework:** Tailwind CSS v4.1.12 with Vite plugin
-   **Design System:**
    -   Gradient backgrounds (`bg-gradient-to-br`)
    -   Rounded corners (`rounded-xl`, `rounded-2xl`)
    -   Shadow system (`shadow-xl`)
    -   Color-coded states (red for debt, green for credit)
-   **Icons:** Lucide React (`Plus`, `Calculator`, `Users`, `MinusCircle`, `Calendar`, `DollarSign`, etc.)
-   **Layout:** Responsive grid layouts, max-width containers
-   **Shared Components:** `~shared/ui/StatCard` for consistent cards

## Integration Points

-   **Vite Config:** React plugin + Tailwind CSS plugin + FSD path aliases + `vite-plugin-pwa`
-   **Routing:** `react-router-dom` powers `/` (Home) and `/share` (import shared session)
-   **ESLint:** Modern flat config with React hooks, refresh plugins
-   **TypeScript:** Full `.tsx` files with strict mode + FSD path aliases
-   **Vitest:** Unit testing configured with jsdom environment
-   **Persistence:** LocalStorage via shared storage helpers (no backend/API)

## Project-Specific Conventions

-   **FSD Layer Rules:**
    -   Keep entity logic in the appropriate `~entities/*/lib`
    -   UI interactions in `~features/*`
    -   Composite blocks in `~widgets/*`
    -   App routing configured in `~app/App.tsx` (RouterProvider for `/` и `/share`)
    -   Shared utilities (calculations, storage, sharing adapters) live in `~shared/lib`
-   **ID Generation:** Use `createPerson()` from `~entities/person` and `generateSessionId()` from `~entities/session`
-   **Type Safety:**
    -   Import types with `import type { Person } from '~entities/person'`
    -   Session types/utilities are re-exported from `~entities/session`
    -   Use proper FSD aliases for all imports
-   **Calculations:**
    -   All business calculations in `~shared/lib/calculations`
    -   Parse expenses with `parseFloat(person.expenses) || 0` for safety
    -   Round monetary values: `Math.round(value * 100) / 100`
-   **Persistence:**
    -   Leverage `storage` helpers from `~shared/lib/storage` (re-exported through `~shared/lib`)
    -   Convert `createdAt` / `updatedAt` fields back to `Date` when rehydrating sessions
    -   Avoid direct `localStorage` usage outside storage helper module
    -   Sharing helpers (`createShareUrl`, `decodeSessionFromShare`) live in `~shared/lib/share`
-   **PWA Assets:** Keep `public/icon.svg`, `public/favicon.svg`, and generated PNG variants in sync with `vite.config.js`

## Code Examples

-   **Adding new calculation feature:**

    ```typescript
    // Add to shared/lib/calculations.ts
    export const calculateTotalDebt = (people: Person[]) => {
        return people.filter((p) => p.duty > 0).reduce((sum, p) => sum + p.duty, 0);
    };
    ```

-   **Creating new widget:**

    ```typescript
    // src/widgets/expense-stats/ui/ExpenseStats.tsx
    import type { Person } from '~entities/person';
    import { StatCard } from '~shared/ui';
    import { calculateTotalExpenses } from '~shared/lib/calculations';

    interface ExpenseStatsProps {
        people: Person[];
    }

    export const ExpenseStats = ({ people }: ExpenseStatsProps) => {
        const total = calculateTotalExpenses(people);
        return <StatCard icon={<Calculator size={20} />} title='Total' value={`${total.toFixed(2)} ₽`} />;
    };
    ```

-   **Adding new feature:**

    ```
    src/features/calculate-duties/
    ├── ui/
    │   └── CalculateDutiesButton.tsx    // UI component
    ├── model/                           // Business logic (if needed)
    └── index.ts                         // Public API export
    ```

-   **Saving a named session:**

    ```typescript
    import type { Session } from '~entities/session';
    import type { Person } from '~entities/person';
    import { updateSession } from '~entities/session';
    import { storage } from '~shared/lib';

    const persistSession = (session: Session, people: Person[]) => {
        const payload = updateSession(session, {
            name: 'Отпуск на Алтае',
            people,
            isCalculated: people.some((person) => person.duty !== 0),
        });

        storage.saveNamedSession(payload);
    };
    ```

-   **Sharing a session link:**

    ```typescript
    import { createShareUrl } from '~shared/lib';

    const shareSession = (session: Session) => {
        const link = createShareUrl(session);
        void navigator.clipboard.writeText(link);
    };
    ```

## Key Files & Dependencies

-   **Entry Point:** `src/main.jsx` → `~app/main.tsx`
-   **Root Component:** `~app/App.tsx` — RouterProvider wiring для `/` и `/share`
-   **Home Screen:** `~pages/home/ui/HomePage.tsx` — Основная логика калькулятора и состояние
-   **Share Screen:** `~pages/share-session/ui/ShareSessionPage.tsx` — Импорт расчета по ссылке
-   **Core Entities:**
    -   `~entities/person/model/types.ts` — Person interface
    -   `~entities/session/model/types.ts` — Session interface & metadata helpers
-   **Calculations:** `~shared/lib/calculations.ts` — Business logic
-   **Persistence:** `~shared/lib/storage.ts` — LocalStorage helpers for sessions/backups
-   **Sharing:** `~shared/lib/share.ts` — Кодирование/декодирование расчетов и генерация ссылок
-   **Session UI:** `~widgets/session-controls/SessionControls.tsx` — Кнопки управления и мобильное меню
-   **Config:** `vite.config.js` — Build configuration with FSD aliases
-   **Dependencies:** React 19, React Router 7.9, Vite 7.1, TypeScript, Tailwind 4.1, Lucide icons

---

If any conventions or workflows are unclear or missing, please provide feedback to improve these instructions.

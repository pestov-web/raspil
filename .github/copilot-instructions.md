# Copilot Instructions for AI Coding Agents

## Overview

This is "Raspil" - a React expense calculator app built with Vite, TypeScript, and Tailwind CSS. Users can add people, track their expenses, and automatically calculate who owes money to whom. The app follows **Feature-Sliced Design (FSD)** architecture with TypeScript types and Tailwind for styling.

## Application Logic & Data Flow

-   **Core Entity:** `Person` type with `id`, `name`, `expenses` (string input), and `duty` (calculated number)
-   **Main State:** Array of people managed in `~app/App.tsx` with `useState`
-   **Key Operations:**
    -   Add/remove people (minimum 1 person enforced)
    -   Update person fields (name, expenses)
    -   Calculate duties: `perPersonShare - actualExpenses = duty`
    -   Positive duty = person owes money, negative = person should receive money

## FSD Architecture & Key Patterns

-   **Entry Point:** `src/main.jsx` → `~app/main.tsx` bootstraps React app with StrictMode
-   **FSD Layers:**
    ```
    src/
    ├── app/                    # 🏗 Application initialization
    │   ├── App.tsx            # Root component composition
    │   └── main.tsx           # Entry point
    ├── widgets/               # 🧩 Composite UI blocks
    │   ├── expense-calculator/ # Stats and totals
    │   ├── expense-summary/   # Results breakdown
    │   ├── people-manager/    # Add/calculate controls
    │   └── people-table/      # Data input table
    ├── features/              # 🚀 User interactions
    │   ├── add-person/        # Person creation
    │   └── calculate-duties/  # Duty calculations
    ├── entities/              # 🎯 Business logic
    │   └── person/            # Person model & utilities
    └── shared/                # ⚡ Reusable resources
        ├── lib/               # Business calculations
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
-   **Available aliases:** `~app`, `~widgets`, `~features`, `~entities`, `~shared`

## Developer Workflows

-   **Package Manager:** Uses `pnpm` (see `pnpm-lock.yaml`)
-   **Development:** `pnpm dev` starts Vite dev server with HMR
-   **Build:** `pnpm build` creates optimized production build
-   **Linting:** `pnpm lint` runs ESLint (configured for React hooks and refresh)
-   **Testing:** `pnpm test` runs Vitest unit tests
-   **Preview:** `pnpm preview` serves production build locally

## Styling & UI Patterns

-   **Framework:** Tailwind CSS v4.1.12 with Vite plugin
-   **Design System:**
    -   Gradient backgrounds (`bg-gradient-to-br`)
    -   Rounded corners (`rounded-xl`, `rounded-2xl`)
    -   Shadow system (`shadow-xl`)
    -   Color-coded states (red for debt, green for credit)
-   **Icons:** Lucide React (`Plus`, `Calculator`, `Users`, `MinusCircle`)
-   **Layout:** Responsive grid layouts, max-width containers
-   **Shared Components:** `~shared/ui/StatCard` for consistent cards

## Integration Points

-   **Vite Config:** React plugin + Tailwind CSS plugin + FSD path aliases
-   **ESLint:** Modern flat config with React hooks, refresh plugins
-   **TypeScript:** Full `.tsx` files with strict mode + FSD path aliases
-   **Vitest:** Unit testing configured with jsdom environment
-   **No backend/API:** Pure client-side calculation app

## Project-Specific Conventions

-   **FSD Layer Rules:**
    -   Keep business logic in `~entities/person/lib`
    -   UI interactions in `~features/*`
    -   Composite blocks in `~widgets/*`
    -   App composition only in `~app/App.tsx`
-   **ID Generation:** Use `createPerson()` from `~entities/person`
-   **Type Safety:**
    -   Import types with `import type { Person } from '~entities/person'`
    -   Use proper FSD aliases for all imports
-   **Calculations:**
    -   All business calculations in `~shared/lib/calculations`
    -   Parse expenses with `parseFloat(person.expenses) || 0` for safety
    -   Round monetary values: `Math.round(value * 100) / 100`

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
        return <StatCard icon={Calculator} label='Total' value={`$${total}`} />;
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

## Key Files & Dependencies

-   **Entry Point:** `src/main.jsx` → `~app/main.tsx`
-   **Root Component:** `~app/App.tsx` — Application composition and state
-   **Core Entity:** `~entities/person/model/types.ts` — Person interface
-   **Calculations:** `~shared/lib/calculations.ts` — Business logic
-   **Config:** `vite.config.js` — Build configuration with FSD aliases
-   **Dependencies:** React 19, Vite 7.1, TypeScript, Tailwind 4.1, Lucide icons

---

If any conventions or workflows are unclear or missing, please provide feedback to improve these instructions.

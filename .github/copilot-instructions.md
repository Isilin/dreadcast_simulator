# Dreadcast Simulator - AI Coding Instructions

## Project Overview

This is a French-language character build simulator for Dreadcast, a browser-based cyberpunk RPG. Users create characters by selecting race/gender, equipping items, kits, implants, a drug and titles, with automatic stat calculation and prerequisite checks. Builds are saved locally for guests (1 build) or in the database for signed-in users (5 builds, unlimited with a subscription), and subscribers can publish them to the Community.

**Tech Stack:** React 19 + TypeScript, Vite, TanStack Router, TanStack Query, Zustand, Base UI Components, CSS Modules, Vercel serverless functions (`api/`, shared code in `lib/`), Supabase

## Architecture Pattern: Feature-Sliced Design

Each feature follows a strict `model/services/ui` structure:

```
feature/
  <feature-name>/
    index.ts          # Public exports only
    model/            # State management
      *.types.ts      # TypeScript interfaces, const enums using "as const"
      *.store.ts      # Zustand store: state, actions, initialState, useXState()/useXActions()
      *.rules.ts      # Business logic functions (pure, unit tested)
      *.selectors.ts  # Derived state computations (hooks)
    services/         # Data fetching
      *.repo.ts       # fetchX() functions calling /api
      *.queries.ts    # TanStack Query hooks (useXs)
      *.schema.ts     # Zod schemas and inferred DTO types
      *.mapper.ts     # DTO → Domain transformations
      *.errors.ts     # Typed repository errors
    ui/               # React components (each in own folder with .tsx + .module.css + index.ts)
```

**Key Pattern:** Feature folders export through `index.ts` barrel files at root, model, services, and ui levels. Never import from internal subfolders across features.

## State Management Pattern

Feature state lives in module-level **Zustand** stores (no React provider):

1. **Types** define state shape using `const x = [...] as const` and `type X = (typeof x)[number]`
2. **Store** (`create<XStore>`) holds state, actions and an exported `initialState`
3. **Hooks** are thin wrappers: `useXState()` selects the state, `useXActions()` selects actions with `useShallow`
4. Outside React, use `useXStore.getState()` / `useXStore.subscribe()` (persistence, autosave)

Example from [implant.store.ts](src/feature/implant/model/implant.store.ts):

```ts
export const useImplantStore = create<ImplantStore>((set) => ({
  implants: initialState,
  setImplant: (name, level) => {
    set((s) => ({ implants: { ...s.implants, [name]: level } }));
  },
  replaceImplants: (implants) => set({ implants }),
}));

export const useImplantsActions = (): ImplantsActions =>
  useImplantStore(
    useShallow((s) => ({
      setImplant: s.setImplant,
      replaceImplants: s.replaceImplants,
    })),
  );
```

## Data Fetching Strategy

- **Repository Pattern:** `*.repo.ts` files contain `fetchX()` functions calling the `/api` serverless functions
- **Validation:** every payload is validated with the Zod schemas of `*.schema.ts`, then mapped with `*.mapper.ts`
- **TanStack Query:** Queries defined in `*.queries.ts` wrap repo functions
- **API:** handlers in `api/**`, shared server code (select queries, validation, handlers) in `lib/`, data in Supabase

## Domain Layer

`src/domain/` contains core types shared across features:

- `Stat` type and `StatValues` metadata (stat tags, labels in French)
- `ItemSpot` enums for equipment slots
- Core interfaces for `Skill`, `Suit`

**Never put feature-specific logic in domain** - keep it minimal and stable.

## CSS Module Conventions

- Every component folder has `ComponentName.module.css`
- Import as `styles` (or `style` in older components like Card)
- Use semantic class names: `.container`, `.header`, `.card`, `.button`
- Global styles in `src/styles/`: `theme.css` (CSS variables), `helpers.css` (utilities), `animations.module.css`

## Absolute Imports

Configured via Vite alias `@` → `./src`, used everywhere:

```typescript
import { Stat } from '@/domain';
import { useImplantsState } from '@/feature/implant';
import { Card } from '@/ui';
```

## UI Components Library

Located in `src/ui/` - reusable components following same folder structure (Component.tsx + Component.module.css + index.ts):

- `AppShell`, `Card`, `Modal`, `Popin`, `Spinner`, `IconButton`, `RemoveButton`, `StatusCounterBadge`, `StatEffects`
- `Icon/*` for SVG icon components
- `UiImage` with caching utility

## Build & Development

```bash
# From the repository root
yarn dev          # Vite dev server on :5173 (/api proxied to the Vercel deployment)
yarn build        # TypeScript check + Vite build
yarn test         # Vitest unit tests
yarn lint         # ESLint check
yarn lint:fix     # Auto-fix linting issues
yarn format       # Prettier format all files
```

## Persistence

- `src/feature/persistence/` manages build snapshots, autosave and remote builds
- Guests: 1 build in localStorage (key `'dreadcast.builds.v3'`)
- Signed in: builds stored through `/api/builds` (5 slots, unlimited with an active subscription)
- Snapshots store profile, items, kits, implants, drug and titles

## Important Notes

- **French Language:** All UI text and data labels are in French
- **Game Data:** Based on Dreadcast RPG mechanics (stats, implants, items from game), stored in Supabase
- **Tests:** Vitest unit tests co-located as `*.test.ts`
- **Vercel Deployment:** Auto-deploys to https://dreadcast-simulator-kappa.vercel.app/

## When Adding Features

1. Create feature folder with the model/services/ui structure it needs
2. Define types with `as const` pattern for enums
3. Add a Zustand store if the feature has state
4. Add the API handler (`api/`, `lib/`) and the repo function with its Zod schema
5. Add TanStack Query hooks for data fetching
6. Build UI components with CSS modules
7. Export through index.ts at each level

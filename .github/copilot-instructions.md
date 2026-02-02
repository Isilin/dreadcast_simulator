# Dreadcast Simulator - AI Coding Instructions

## Project Overview

This is a French-language character build simulator for Dreadcast, a browser-based cyberpunk RPG. Users create characters by selecting race/gender, equipping implants, items, and kits, with automatic stat calculation and local persistence for up to 10 builds.

**Tech Stack:** React 19 + TypeScript, Vite, TanStack Router, TanStack Query, Base UI Components, CSS Modules

## Architecture Pattern: Feature-Sliced Design

Each feature follows a strict `model/services/ui` structure:

```
feature/
  <feature-name>/
    index.ts          # Public exports only
    model/            # State management
      *.types.ts      # TypeScript interfaces, const enums using "as const"
      *.actions.ts    # Reducer, actions, initialState
      *.contexts.ts   # React contexts (StateCtx, DispatchCtx)
      *.provider.tsx  # Provider with useReducer + useMemo for actions
      *.hooks.ts      # useFeatureState(), useFeatureDispatch()
      *.rules.ts      # Business logic functions
      *.selectors.ts  # Derived state computations
    services/         # Data fetching
      *.repo.ts       # fetchX() functions, USE_MOCK branching
      *.repo.mock.ts  # Mock data + validation
      *.queries.ts    # TanStack Query hooks (useXQuery)
      *.dto.ts        # API response types
      *.schema.ts     # Zod schemas
      *.mapper.ts     # DTO → Domain transformations
    ui/               # React components (each in own folder with .tsx + .module.css + index.ts)
```

**Key Pattern:** Feature folders export through `index.ts` barrel files at root, model, services, and ui levels. Never import from internal subfolders across features.

## State Management Pattern

All features use **reducer + context** pattern (no external state library):

1. **Types** define state shape using `const x = [...] as const` and `type X = (typeof x)[number]`
2. **Actions** define `type Action = Union<ActionTypes>`, `reducer()`, and `createXActions(dispatch)`
3. **Contexts** split into `StateCtx` and `DispatchCtx` (separate contexts for optimization)
4. **Provider** uses `useReducer` + `useMemo` to wrap actions
5. **Hooks** validate context exists with guards: `if (!state) throw new Error('Missing XProvider')`

Example from [implant.provider.tsx](frontend/src/feature/implant/model/implant.provider.tsx):

```tsx
const [state, dispatch] = useReducer(reducer, initialState);
const actions = useMemo(() => createImplantsActions(dispatch), [dispatch]);
return (
  <DispatchCtx.Provider value={actions}>
    <StateCtx.Provider value={state}>{children}</StateCtx.Provider>
  </DispatchCtx.Provider>
);
```

## Data Fetching Strategy

- **Repository Pattern:** `*.repo.ts` files contain `fetchX()` functions that check `USE_MOCK` (from `VITE_USE_MOCK` env var)
- **Mocks First:** Development uses mock data in `*.repo.mock.ts` with Zod validation via `*.schema.ts`
- **TanStack Query:** Queries defined in `*.queries.ts` wrap repo functions
- **No Real API Yet:** All repos currently return mock data (real API commented out)

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

- `Card`, `Modal`, `Popin`, `Spinner`, `TechBadge`, `DeleteButton`, `EffectChip`
- `Icon/*` for SVG icon components
- `UiImage` with caching utility

## Build & Development

```bash
# In frontend/ directory
yarn dev          # Vite dev server on :5173
yarn build        # TypeScript check + Vite build
yarn lint         # ESLint check
yarn lint:fix     # Auto-fix linting issues
yarn format       # Prettier format all files
```

## Persistence

- LocalStorage only (no backend)
- `src/feature/persistence/` manages build snapshots
- Key: `'dreadcast.builds.v1'`
- Default 5 slots, stores: profile, implants, items, kits state

## Important Notes

- **French Language:** All UI text, comments, and data labels are in French
- **Game Data:** Based on Dreadcast RPG mechanics (stats, implants, items from game)
- **Roadmap:** Sharing builds, dark mode, mobile responsive, advanced formulas, weapons bonuses, drugs support planned
- **No Tests Yet:** Test infrastructure not set up
- **Vercel Deployment:** Auto-deploys to https://dreadcast-simulator-kappa.vercel.app/

## When Adding Features

1. Create feature folder with full model/services/ui structure
2. Define types with `as const` pattern for enums
3. Implement reducer pattern if state needed
4. Create mock data first, then repo functions
5. Add TanStack Query hooks for data fetching
6. Build UI components with CSS modules
7. Export through index.ts at each level
8. Update providers in route files if needed

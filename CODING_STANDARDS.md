# Coding Standards - Dreadcast Simulator

This document defines the coding standards and style guide for the Dreadcast Simulator project. All contributions should follow these rules to maintain consistency, quality, and maintainability.

## 1. Introduction

**Purpose:** Establish consistent coding standards to improve code quality, maintainability, and team collaboration for the Dreadcast Simulator character build simulator.

**Scope:** Applies to all TypeScript, React, CSS, and related files in the project.

## 2. Project Architecture

### Feature-Sliced Design

- Use strict feature folder structure: `model/services/ui`
- Each feature has its own isolated folder under `src/feature/`
- Export all public APIs through `index.ts` barrel files
- Never import from internal subfolders across features

### Directory Structure

```typescript
feature/
  <feature-name>/
    index.ts          # Public exports only
    model/            # State management
      *.types.ts      # TypeScript interfaces, const enums
      *.store.ts      # Zustand store: state + actions + initialState, useXState()/useXActions()
      *.rules.ts      # Business logic functions (pure, unit tested)
      *.selectors.ts  # Derived state computations (hooks)
    services/         # Data fetching
      *.repo.ts       # fetchX() functions calling the /api serverless functions
      *.queries.ts    # TanStack Query hooks (useXs)
      *.schema.ts     # Zod schemas and inferred DTO types
      *.mapper.ts     # DTO → Domain transformations
      *.errors.ts     # Typed repository errors
    ui/               # React components
      Component/      # Each component in own folder
        Component.tsx + Component.module.css + index.ts
```

## 3. Naming Conventions

| Item             | Convention                                  | Example                               |
| ---------------- | ------------------------------------------- | ------------------------------------- |
| Files            | `kebab-case` or `PascalCase` for components | `user-session.ts`, `Card.tsx`         |
| Variables        | `camelCase`                                 | `userName`, `isLoading`               |
| Functions        | `camelCase`                                 | `fetchUserData()`, `calculateStats()` |
| React Components | `PascalCase`                                | `UserCard`, `ImplantSelector`         |
| Types/Interfaces | `PascalCase`                                | `User`, `ImplantState`                |
| Enums (const)    | Array with `PascalCase` + `as const`        | `ImplantNameValues`                   |
| Type from const  | `PascalCase`                                | `type ImplantName = ...`              |
| Constants        | `UPPER_SNAKE_CASE`                          | `MAX_RETRIES`, `MAX_IMPLANTS`         |
| CSS Classes      | `camelCase` in modules                      | `.container`, `.headerTitle`          |

## 4. TypeScript Standards

### Type System Best Practices

- **Never use `any`** - prefer `unknown` with type guards
- Use `const` assertions for immutable data: `as const`
- Define discriminated unions for complex state (e.g. drag-and-drop payloads)
- Use proper type imports: `import type { ... }`
- Implement interfaces over type aliases for object shapes

### Const Assertion Pattern (Required)

```typescript
// ✅ Correct - Use const assertion for enums
export const ImplantNameValues = [
  'Génie',
  'Réplicateur',
  'Sain et sauf',
  // ...
] as const;
export type ImplantName = (typeof ImplantNameValues)[number];

// ❌ Wrong - Don't use traditional enums
enum ImplantName {
  GENIE = 'Génie',
  // ...
}
```

### Generic and Utility Types

- Use TypeScript utility types: `Partial<T>`, `Pick<T>`, `Omit<T>`
- Prefer `Record<string, T>` over `{ [key: string]: T }`
- Use `PropsWithChildren<T>` for React components with children

## 5. React Standards

### Component Patterns (Required)

- **Always use functional components** with hooks
- Use `PropsWithChildren` for components accepting children
- Separate concerns: presentation vs. logic components
- Extract complex logic into custom hooks

### Zustand Store Pattern (Required)

```typescript
// ✅ Correct - Zustand store with state + actions + initialState
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

interface ImplantStore {
  implants: ImplantsState;
  setImplant: (name: ImplantName, level: number) => void;
  replaceImplants: (state: ImplantsState) => void;
}

export const initialState: ImplantsState = {
  /* ... */
};

export const useImplantStore = create<ImplantStore>((set) => ({
  implants: initialState,
  setImplant: (name, level) =>
    set((s) => ({ implants: { ...s.implants, [name]: level } })),
  replaceImplants: (implants) => set({ implants }),
}));

// Thin hook wrappers over the store; actions use useShallow for stable references
export const useImplantsState = (): ImplantsState =>
  useImplantStore((s) => s.implants);

export const useImplantsActions = (): ImplantsActions =>
  useImplantStore(
    useShallow((s) => ({
      setImplant: s.setImplant,
      replaceImplants: s.replaceImplants,
    })),
  );
```

### CSS Modules Pattern (Required)

```typescript
// ✅ Correct - Import CSS modules as 'styles'
import styles from './Card.module.css';

export const Card = ({ children, className, ...others }) => {
  return (
    <article className={`${styles.card} ${className}`} {...others}>
      {children}
    </article>
  );
};
```

### Hook Dependencies

- Always specify complete dependency arrays in `useEffect`
- Wrap functions in `useCallback` if used in dependencies
- Use `useMemo` for expensive computations only

## 6. Formatting and Style

### Code Formatting

- **Indentation:** 2 spaces (enforced by Prettier)
- **Line length:** Max 100 characters
- **Quotes:** Single quotes for strings, double for JSX attributes
- **Semicolons:** Always required
- **Trailing commas:** Required in multiline structures

### Import Organization

```typescript
// ✅ Correct import order
import { useMemo } from 'react';

import styles from './ImplantsPanel.module.css';
import { computeImplantsCount } from '../../model/implant.rules';
import { useImplantsState } from '../../model/implant.store';

import type { Stat } from '@/domain';
import { StatusCounterBadge } from '@/ui';
```

1. React and external libraries
2. Internal relative imports
3. Absolute imports from `@/domain`, `@/feature`, `@/ui`
4. Type-only imports marked with `import type`

### File Structure

- End files with a newline
- Use UTF-8 encoding without BOM
- One blank line between top-level declarations
- Group related imports together

## 7. State Management Standards

### Zustand Store Pattern (Required)

- Use Zustand (`create<StoreType>`) for all feature state
- Define state fields and actions in the same store
- Export `initialState` as a named constant for use in persistence and tests
- Use `useShallow` from `zustand/react/shallow` for dispatch hooks that return objects
- Expose thin hook wrappers (`useXState`, `useXActions`) over the store

### Cross-Store Access

- Access store state imperatively outside React with `useXxxStore.getState()`
- Subscribe to store changes with `useXxxStore.subscribe(callback)` for side effects
- No React Provider wrapping required; stores are module-level singletons

### State Shape

- Use normalized state structures when appropriate
- Prefer immutable updates with spread operators inside `set()`
- Use `Record<K, V>` for key-value state mappings

## 8. Data Layer Standards

### Repository Pattern (Required)

```typescript
// ✅ Correct repository implementation
export const fetchItems = async (signal?: AbortSignal): Promise<Item[]> => {
  const response = await GET('/api/items', signal);

  if (!response.ok) {
    throw new ItemRepositoryError({
      code: ITEM_REPOSITORY_ERROR_CODE.FETCH_ITEMS_FAILED,
      message: 'Impossible de recuperer la liste des items.',
      status: response.status,
    });
  }

  const payload: unknown = await response.json();
  const { itemArrayResponseSchema } = await import('./item.schema');
  const items = validatePayload({
    schema: itemArrayResponseSchema,
    payload,
    errorCode: ITEM_REPOSITORY_ERROR_CODE.INVALID_ITEMS_PAYLOAD,
    errorMessage: 'Le format des items recus est invalide.',
  });

  return items.map(toDomain);
};
```

### API Data

- Every payload coming from `/api` is validated with a Zod schema before use
- DTOs are mapped to domain models in `*.mapper.ts`
- Serverless handlers live in `api/`, shared server code (queries, validation) in `lib/`

### TanStack Query Integration

- Define query hooks in separate `*.queries.ts` files
- Use proper error handling and loading states
- Implement appropriate cache invalidation strategies

## 9. French Language Standards

### Localization Requirements

- All user-facing text must be in French
- Use authentic French RPG terminology
- Maintain consistent translation of game mechanics
- Comments for business logic can be in French or English

### Game Terminology

- Use proper French terms for RPG concepts
- Maintain consistency in stat names and descriptions
- Ensure proper accent marks and special characters
- Use appropriate gender agreements in French text

## 10. Error Handling

### Error Boundaries

- Implement React Error Boundaries for component-level errors
- Provide meaningful fallback UIs
- Log errors appropriately for debugging

### Type Safety

- Use type guards for runtime type checking
- Validate external data with Zod schemas
- Handle async errors in effects and event handlers
- Provide user-friendly error messages in French

## 11. Testing Standards

### Test Structure

- Unit tests run with Vitest (`yarn test`), co-located as `*.test.ts`
- Focus on pure logic: `*.rules.ts`, helpers, handlers, schemas and mappers
- Test behavior, not implementation details
- UI flows are checked manually on desktop and mobile when the workbench changes

### Test Organization

- Co-locate tests with components when logical
- Use descriptive test names in English
- Test happy path and error scenarios
- Validate accessibility features

## 12. Performance Guidelines

### Optimization Strategies

- Use `React.memo` sparingly for expensive components
- Implement proper `useMemo` and `useCallback` usage
- Avoid unnecessary re-renders with narrow store selectors (`useShallow`)
- Use code splitting for large features

### Bundle Optimization

- Use dynamic imports for lazy loading
- Minimize external dependencies
- Implement proper tree shaking
- Monitor bundle size impact

## 13. Comments and Documentation

### Code Comments

- Explain **why**, not **what**
- Document complex business logic and game mechanics
- Use JSDoc for public APIs and exported functions
- Maintain French terminology explanations

### Documentation Standards

- Keep README files updated with current setup
- Document architectural decisions and trade-offs
- Explain feature-specific patterns and conventions
- Provide examples for complex implementations

## 14. Git and Version Control

### Commit Standards

- Use conventional commit messages
- Keep commits atomic and focused
- Write clear, descriptive commit messages
- Squash feature commits before merging

### Branch Naming

- Use `feature/description` for new features
- Use `fix/description` for bug fixes
- Use `refactor/description` for refactoring work

## 15. Development Workflow

### Build and Lint

```bash
# Required commands
yarn dev          # Start development server
yarn build        # TypeScript check + build
yarn test         # Vitest unit tests
yarn lint         # ESLint check
yarn lint:fix     # Auto-fix linting issues
yarn format       # Prettier format all files
```

### Code Quality

- All code must pass TypeScript strict checks
- ESLint must pass without warnings
- Prettier formatting must be applied
- Follow established architectural patterns

## 16. Contribution and Enforcement

### Code Review

- All changes require code review
- Review for architectural compliance
- Verify French language accuracy for UI elements
- Ensure type safety and performance considerations

### Standards Evolution

- Propose changes through GitHub issues
- Update documentation when patterns evolve
- Maintain consistency across the codebase
- Document new patterns and conventions

---

This document serves as the authoritative guide for code quality in the Dreadcast Simulator project. When in doubt, follow the existing patterns in the codebase and consult the team for clarification on edge cases.

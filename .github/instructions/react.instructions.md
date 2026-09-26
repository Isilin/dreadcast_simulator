---
applyTo: '**/*.jsx,**/*.tsx,**/*.js,**/*.ts,**/*.css,**/*.module.css'
description: 'React development best practices for Dreadcast Simulator'
---

<!-- Based on: https://github.com/github/awesome-copilot/blob/main/instructions/reactjs.instructions.md -->

# React Development Guidelines

## Project Context

- React 19+ with TypeScript for type safety
- Functional components with hooks as default
- Feature-sliced design architecture with model/services/ui structure
- CSS Modules for component styling
- TanStack Router and Query for routing and data fetching

## Architecture Patterns

- Use feature folders with strict index.ts barrel exports
- Keep feature state in Zustand stores (`*.store.ts`), no React provider
- Select narrowly (`useXState`, `useXActions` with `useShallow`) to limit re-renders
- Follow the repository's established patterns for new features

## Component Development

- Use functional components with hooks exclusively
- Create components in their own folders: Component.tsx + Component.module.css + index.ts
- Import CSS modules as `styles` variable consistently
- Implement proper TypeScript interfaces for all props and state

## State Management

- Use the Zustand store pattern as established in codebase (state + actions + `initialState`)
- Type actions explicitly (`XActions = Pick<XStore, ...>`)
- Access stores outside React with `getState()` / `subscribe()` (persistence, autosave)
- Keep business rules in pure `*.rules.ts` functions, not in components

## Styling

- Use CSS Modules with semantic class names (.container, .header, .card)
- Import as `styles` from './Component.module.css'
- Leverage global styles from src/styles/ for themes and utilities
- Follow mobile-first responsive design principles

## Data Fetching

- Use TanStack Query for all async operations
- Implement repository functions (`*.repo.ts`) calling the `/api` serverless functions
- Validate every payload with Zod schemas
- Map DTOs to domain models using dedicated mapper functions

## French Language Requirements

- All UI text, labels, and user-facing content must be in French
- Use French terminology for game mechanics and RPG concepts
- Maintain French naming in game data and labels

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
- Implement reducer + context pattern for state management (no external libraries)
- Separate StateCtx and DispatchCtx for performance optimization
- Follow the repository's established patterns for new features

## Component Development

- Use functional components with hooks exclusively
- Create components in their own folders: Component.tsx + Component.module.css + index.ts
- Import CSS modules as `styles` variable consistently
- Implement proper TypeScript interfaces for all props and state

## State Management

- Use useReducer + useContext pattern as established in codebase
- Define actions with discriminated unions and proper typing
- Wrap actions in useMemo within providers for performance
- Validate context exists with proper error guards in hooks

## Styling

- Use CSS Modules with semantic class names (.container, .header, .card)
- Import as `styles` from './Component.module.css'
- Leverage global styles from src/styles/ for themes and utilities
- Follow mobile-first responsive design principles

## Data Fetching

- Use TanStack Query for all async operations
- Implement repository pattern with USE_MOCK environment branching
- Create mock data with Zod schema validation
- Map DTOs to domain models using dedicated mapper functions

## French Language Requirements

- All UI text, labels, and user-facing content must be in French
- Use French terminology for game mechanics and RPG concepts
- Maintain French naming in data models and mock data

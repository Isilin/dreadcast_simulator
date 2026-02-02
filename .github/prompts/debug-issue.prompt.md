---
agent: 'agent'
tools: ['codebase', 'search/codebase', 'problems', 'web/fetch']
description: 'Debug issues and provide troubleshooting assistance'
---

# Debug Issue

Provide comprehensive debugging assistance for issues in the Dreadcast Simulator codebase.

## Debugging Process

### Issue Analysis

1. Identify the problem scope and affected components
2. Review related code in feature folders (model/services/ui)
3. Check for TypeScript errors and type mismatches
4. Analyze React component lifecycle and state management
5. Verify data flow from repository to UI

### Common Issue Categories

#### State Management Problems

- Context provider missing or incorrectly implemented
- Reducer actions not properly typed or handled
- Memory leaks from uncleared effect dependencies
- State synchronization issues between contexts

#### Data Fetching Issues

- TanStack Query hook configuration problems
- Repository function errors with mock data
- Zod schema validation failures
- DTO to domain mapping inconsistencies

#### TypeScript Errors

- Type mismatches in discriminated unions
- Missing type definitions for 'as const' patterns
- Incorrect interface implementations
- Generic type constraint issues

#### React Component Issues

- Infinite re-render loops from dependency arrays
- CSS Module class name conflicts
- Component composition and prop drilling problems
- French text rendering and localization issues

### Debugging Tools and Techniques

#### Browser DevTools

- React DevTools for component state inspection
- Network tab for TanStack Query debugging
- Console for error tracking and logging
- Performance tab for optimization issues

#### Code Analysis

- TypeScript compiler errors and warnings
- ESLint rule violations and code quality issues
- Bundle analyzer for performance problems
- Git history for regression analysis

### Solution Approach

1. Reproduce the issue with minimal test case
2. Identify root cause through systematic elimination
3. Propose fix that maintains existing patterns
4. Verify solution doesn't break related functionality
5. Document the fix and prevention strategies

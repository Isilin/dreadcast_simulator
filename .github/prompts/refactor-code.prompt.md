---
agent: 'agent'
tools: ['codebase', 'edit/editFiles', 'search/codebase']
description: 'Refactor existing code to improve maintainability and follow patterns'
---

# Refactor Code

Refactor existing code to improve maintainability while preserving functionality and following established patterns.

## Refactoring Guidelines

### Architecture Improvements

- Extract reusable logic into custom hooks
- Implement proper feature-sliced design structure
- Optimize context usage with separated StateCtx and DispatchCtx
- Improve component composition and reusability

### TypeScript Enhancements

- Replace `any` types with proper interfaces
- Implement discriminated unions for complex state
- Add proper type guards and error handling
- Use utility types (Partial, Pick, Omit) appropriately

### React Optimizations

- Implement proper memoization with useMemo/useCallback
- Extract complex logic into custom hooks
- Optimize re-render patterns with React.memo
- Improve component composition patterns

### Code Quality

- Break down large components into smaller, focused pieces
- Extract business logic from UI components
- Improve error boundaries and error handling
- Add comprehensive TypeScript documentation

## Refactoring Process

1. Identify code smells and improvement opportunities
2. Preserve existing functionality and tests
3. Maintain compatibility with existing patterns
4. Update related documentation and types
5. Ensure French language compliance is maintained

### Common Refactoring Patterns

- Extract complex state logic into useReducer
- Move data fetching to custom hooks with TanStack Query
- Separate presentation and container components
- Implement proper loading and error states
- Optimize CSS module usage and styling patterns

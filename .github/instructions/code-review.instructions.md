---
applyTo: '**/*'
description: 'Code review standards and GitHub review guidelines'
---

# Code Review Guidelines

## Architecture Review

- Verify adherence to feature-sliced design patterns
- Check proper index.ts barrel export usage
- Validate state management follows reducer + context pattern
- Ensure CSS modules are used consistently

## TypeScript Review

- Check for proper type definitions using 'as const' pattern
- Verify discriminated union usage for actions
- Ensure strict TypeScript configuration compliance
- Validate proper error handling and type guards

## React Patterns Review

- Verify functional components with hooks usage
- Check proper context provider implementation
- Validate useMemo usage for action creators
- Ensure proper dependency arrays in useEffect

## Performance Review

- Check for unnecessary re-renders and memoization opportunities
- Verify proper code splitting and lazy loading
- Review bundle size impact of new dependencies
- Validate proper cleanup in useEffect hooks

## French Language Review

- Verify all user-facing text is in French
- Check proper RPG and game terminology usage
- Validate French labels in data models and interfaces
- Ensure French comments for business logic

## Testing Review

- Ensure new features include appropriate test coverage
- Verify test behavior over implementation testing
- Check accessibility and responsive design testing
- Validate proper mock usage for external dependencies

---
applyTo: '**/*.test.ts,**/*.test.tsx,**/*.spec.ts,**/*.spec.tsx'
description: 'Testing standards and practices for Dreadcast Simulator'
---

# Testing Guidelines

## Current Status

- Test infrastructure is planned but not yet implemented
- When adding tests, follow these established patterns

## Testing Strategy

- Use React Testing Library for component testing
- Prefer testing behavior over implementation details
- Test user interactions and accessibility features
- Mock TanStack Query and repository functions appropriately

## Component Testing

- Test components through user interactions (clicks, typing, etc.)
- Verify proper French text rendering and labels
- Test responsive behavior and CSS module class application
- Validate proper context provider integration

## State Management Testing

- Test reducer functions in isolation with various action types
- Verify context providers supply correct state and actions
- Test custom hooks behavior with proper error handling
- Mock localStorage for persistence layer testing

## Data Layer Testing

- Test repository functions with both mock and real data scenarios
- Verify Zod schema validation with invalid data
- Test mapper functions for proper DTO to domain conversion
- Validate TanStack Query hook behavior and error states

## Accessibility Testing

- Verify proper ARIA attributes and semantic HTML
- Test keyboard navigation and screen reader compatibility
- Validate color contrast and responsive design
- Test French language screen reader compatibility

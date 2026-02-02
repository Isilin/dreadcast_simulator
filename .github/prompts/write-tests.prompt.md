---
agent: 'agent'
tools: ['codebase', 'edit/editFiles', 'search/codebase']
description: 'Generate tests for React components and features'
---

# Write Tests

Generate comprehensive tests for components and features in the Dreadcast Simulator codebase.

## Test Strategy

When generating tests, follow these patterns:

### Component Testing

- Use React Testing Library for component tests
- Test user interactions and behavior, not implementation
- Verify French text rendering and accessibility
- Mock context providers and TanStack Query appropriately

### State Management Testing

- Test reducer functions with various action types
- Verify context providers supply correct state and actions
- Test custom hooks with proper error scenarios
- Mock localStorage for persistence testing

### Data Layer Testing

- Test repository functions with mock and error scenarios
- Verify Zod schema validation with invalid data
- Test DTO to domain mapping functions
- Validate TanStack Query hook behavior

### Test Structure

```typescript
describe('ComponentName', () => {
  it('should render French labels correctly', () => {
    // Test French text rendering
  });

  it('should handle user interactions properly', () => {
    // Test clicks, form inputs, etc.
  });
});
```

### Mock Patterns

- Mock TanStack Query with proper loading/error states
- Mock context providers with test utilities
- Mock localStorage operations for persistence tests
- Use MSW for API mocking when applicable

Ensure tests cover:

- Happy path functionality
- Error scenarios and edge cases
- French language rendering
- Accessibility features
- Responsive behavior

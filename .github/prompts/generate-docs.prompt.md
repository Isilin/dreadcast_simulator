---
agent: 'agent'
tools: ['codebase', 'edit/editFiles', 'web/fetch']
description: 'Generate and update project documentation'
---

# Generate Documentation

Create comprehensive documentation for the Dreadcast Simulator project components and features.

## Documentation Types

### Component Documentation

- Generate JSDoc comments for React components
- Document props, state, and complex logic
- Explain game mechanics and RPG-specific functionality
- Include French terminology explanations

### Feature Documentation

- Document feature-sliced design structure
- Explain state management patterns and context usage
- Describe data flow from services to UI
- Document repository patterns and mock data structure

### Architecture Documentation

- Explain overall project structure and patterns
- Document TypeScript conventions and type system
- Describe CSS module usage and styling approach
- Explain TanStack Router and Query integration

### API Documentation

- Document repository function signatures
- Explain Zod schema validation patterns
- Document DTO to domain mapping strategies
- Describe mock data structure and validation

## Documentation Format

### Code Comments

```typescript
/**
 * Gère l'état des implants cybernétiques du personnage
 *
 * @param implants - État actuel des implants
 * @param action - Action de modification des implants
 * @returns Nouvel état des implants
 */
```

### README Sections

- Clear setup and installation instructions
- Feature overview with screenshots
- Architecture explanation
- Development workflow and commands
- Contribution guidelines in French

### Technical Documentation

- Document design decisions and trade-offs
- Explain French RPG terminology and game mechanics
- Provide code examples and usage patterns
- Include troubleshooting and debugging guides

Ensure all documentation maintains French language for user-facing content while keeping technical documentation in English for developer accessibility.

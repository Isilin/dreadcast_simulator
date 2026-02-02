---
agent: 'agent'
tools: ['codebase', 'edit/editFiles', 'search/codebase']
description: 'Generate a new React component following Dreadcast Simulator patterns'
---

# Setup React Component

Your goal is to create a new React component that follows the established patterns in the Dreadcast Simulator codebase.

## Requirements

Ask for the component name and purpose if not provided.

### Component Structure

- Create component folder with: Component.tsx + Component.module.css + index.ts
- Use TypeScript with proper interfaces for props
- Import CSS modules as `styles` variable
- Follow functional component with hooks pattern

### Feature Integration

- Place in appropriate feature folder following model/services/ui structure
- Export through index.ts barrel files at each level
- Use established context patterns for state management
- Integrate with TanStack Query for data fetching if needed

### Styling Guidelines

- Use CSS Modules with semantic class names
- Import from './ComponentName.module.css'
- Follow mobile-first responsive design
- Use global CSS variables from src/styles/theme.css

### French Language

- All UI text and labels must be in French
- Use appropriate RPG and game terminology
- Follow established naming conventions for game mechanics

### Code Quality

- Implement proper TypeScript types and interfaces
- Use discriminated unions for complex state
- Follow established error handling patterns
- Include JSDoc for complex logic or game mechanics

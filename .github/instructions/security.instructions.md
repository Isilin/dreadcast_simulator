---
applyTo: '**/*.ts,**/*.tsx,**/*.js,**/*.jsx'
description: 'Security best practices for frontend application'
---

# Security Guidelines

## Input Validation

- Use Zod schemas for all external data validation
- Sanitize user inputs before localStorage storage
- Validate all form inputs and user-generated content
- Implement proper TypeScript typing for type safety

## Data Storage

- Use localStorage only for non-sensitive character build data
- Avoid storing any personal or sensitive information locally
- Implement proper data serialization and parsing
- Consider data encryption for future backend integration

## Content Security

- Escape user-generated content before rendering
- Use TypeScript strict mode for compile-time safety
- Avoid dynamic code execution and eval() usage
- Implement proper error boundaries for runtime errors

## Dependency Management

- Keep all dependencies updated and audit regularly
- Use Dependabot for automated security updates
- Review third-party packages for security vulnerabilities
- Minimize external dependencies and use trusted sources

## Build Security

- Use secure build pipelines with proper environment variables
- Implement proper secrets management for future API keys
- Configure CSP headers for production deployment
- Enable security-focused ESLint rules and TypeScript strict mode

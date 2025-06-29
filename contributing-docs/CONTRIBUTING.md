# Contributing to Turbo Monorepo

Thank you for contributing to our monorepo! This document provides guidelines for contributing to our TypeScript, React Router v7, NestJS, and Tailwind CSS v4 codebase.

## Quick Start

1. **Fork the repository** and clone your fork
2. **Install dependencies**: `npm install`
3. **Start development servers**: `npm run dev`
4. **Create a feature branch**: `git checkout -b feature/your-feature-name`
5. **Make your changes** following our [coding standards](./coding-standards.md)
6. **Commit using conventional format**: See [commit message guidelines](./commit-message-guidelines.md)
7. **Run quality checks**: `npm run lint && npm run check-types && npm run build`
8. **Submit a pull request**

## 📋 Before You Start

- [ ] Read our [Coding Standards](./coding-standards.md)
- [ ] Read our [Commit Message Guidelines](./commit-message-guidelines.md)
- [ ] Ensure you can run the project locally
- [ ] Check existing issues and PRs to avoid duplicates
- [ ] Understand the project structure (see [README](../README.md))

## 🔧 Development Workflow

### Setting Up Your Environment

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/mono-site.git
cd mono-site

# Install dependencies
npm install

# Start all services
npm run dev
```

### Making Changes

1. **Follow our coding standards**: See [coding-standards.md](./coding-standards.md)
2. **Use proper commit messages**: See [commit-message-guidelines.md](./commit-message-guidelines.md)
3. **Write tests** for new functionality
4. **Update documentation** if needed
5. **Ensure type safety** with proper TypeScript annotations

### Quality Checks

Before submitting your PR, run:

```bash
# Format and lint code
npm run check

# Type check
npm run check-types

# Run tests
npm test

# Build to ensure no errors
npm run build
```

## 🎯 What We're Looking For

### Good Contributions

- **Bug fixes** with tests
- **New features** that align with project goals
- **Performance improvements** with benchmarks
- **Documentation improvements**
- **Test coverage improvements**

### Code Quality

- ✅ **Type-safe**: Proper TypeScript usage
- ✅ **Tested**: Unit tests for new functionality
- ✅ **Documented**: Clear comments and documentation
- ✅ **Performant**: Consider performance implications
- ✅ **Accessible**: Follow accessibility best practices

## 📝 Pull Request Guidelines

### PR Title Format

Follow our [Commit Message Guidelines](./commit-message-guidelines.md) and use [conventional commits](https://www.conventionalcommits.org/):

```
feat(api): add user authentication endpoint
fix(web): resolve hydration mismatch in date formatting
docs(readme): update API documentation
refactor(api): improve error handling in UserService
```

### PR Description Template

```markdown
## What does this PR do?

Brief description of the changes.

## Why?

Explain the motivation for these changes.

## How?

Describe the approach taken.

## Testing

- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] All tests pass

## Checklist

- [ ] Code follows our coding standards
- [ ] Tests pass locally
- [ ] Documentation updated (if applicable)
- [ ] TypeScript compilation passes
- [ ] Linting passes
```

### Review Process

1. **Automated checks** must pass (linting, type checking, tests)
2. **At least one maintainer approval** required
3. **All conversations resolved** before merging
4. **Squash and merge** preferred for clean history

## 🏗️ Project Structure

```
mono-site/
├── apps/
│   ├── api/          # NestJS backend
│   └── web/          # React Router frontend
├── packages/
│   ├── ui/           # Shared UI components
│   └── typescript-config/ # Shared TS config
├── contributing-docs/ # This directory
└── biome.json        # Linting/formatting config
```

## 🧪 Testing Guidelines

### Backend (NestJS)

```typescript
// Unit tests for services
describe('UserService', () => {
  // Test implementation
});

// Integration tests for controllers
describe('UserController (e2e)', () => {
  // E2E test implementation
});
```

### Frontend (React Router)

```typescript
// Component tests
import { render, screen } from '@testing-library/react';

describe('UserProfile', () => {
  // Component test implementation
});

// Hook tests
import { renderHook } from '@testing-library/react';

describe('useUser', () => {
  // Hook test implementation
});
```

## 🎨 Design Guidelines

### UI Components

- **Mobile-first**: Design for mobile, enhance for desktop
- **Accessible**: Follow WCAG 2.1 guidelines
- **Consistent**: Use design tokens and shared components
- **Performant**: Optimize for Core Web Vitals

### API Design

- **RESTful**: Follow REST conventions
- **Documented**: Use Swagger/OpenAPI
- **Validated**: Validate all inputs
- **Secure**: Implement proper authentication/authorization

## 🚨 Common Issues

### Hydration Mismatches

```typescript
// ❌ Causes hydration mismatch
<p>{new Date().toLocaleString()}</p>

// ✅ Use consistent formatting
<p>{new Date().toLocaleString('en-US', {
  year: 'numeric',
  month: '2-digit', 
  day: '2-digit'
})}</p>
```

### Import Issues

```typescript
// ❌ Wrong import path
import { Button } from '../../../packages/ui/src/button';

// ✅ Use workspace alias
import { Button } from '@repo/ui/button';
```

### Type Safety

```typescript
// ❌ Using any
function processData(data: any) {
  return data.someProperty;
}

// ✅ Proper typing
interface UserData {
  id: string;
  name: string;
}

function processData(data: UserData) {
  return data.name;
}
```

## 📞 Getting Help

- **Questions**: Open a GitHub Discussion
- **Bugs**: Open a GitHub Issue with reproduction steps
- **Features**: Open a GitHub Issue with detailed proposal
- **Code Review**: Tag maintainers in your PR

## 📖 Additional Resources

- [Coding Standards](./coding-standards.md) - Detailed coding guidelines
- [Commit Message Guidelines](./commit-message-guidelines.md) - Structured commit format
- [README](../README.md) - Project overview and setup
- [React Router v7 Docs](https://reactrouter.com/) - Framework documentation
- [NestJS Docs](https://nestjs.com/) - Backend framework docs
- [Tailwind CSS Docs](https://tailwindcss.com/) - CSS framework docs

---

**Remember**: These guidelines exist to maintain code quality and consistency. When in doubt, ask questions and prioritize readable, maintainable code.

Thank you for contributing! 🎉 

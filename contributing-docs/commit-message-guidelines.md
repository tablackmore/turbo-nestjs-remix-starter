# Commit Message Guidelines

This document outlines the commit message format and guidelines for this monorepo. We follow a structured commit message format based on [Conventional Commits](https://www.conventionalcommits.org/) to enable automated tooling and maintain a clear project history.

## Table of Contents

- [Commit Message Format](#commit-message-format)
- [Type](#type)
- [Scope](#scope)
- [Subject](#subject)
- [Body](#body)
- [Footer](#footer)
- [Examples](#examples)
- [Validation](#validation)
- [Automation Benefits](#automation-benefits)

## Commit Message Format

Each commit message consists of a **header**, a **body**, and a **footer**:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Header

The header is mandatory and must conform to the following format:

```
<type>(<scope>): <subject>
```

- **Type**: Must be one of the allowed types (see [Type](#type))
- **Scope**: Must be one of the allowed scopes (see [Scope](#scope))
- **Subject**: Brief description of the change (see [Subject](#subject))

## Type

The type must be one of the following:

| Type | Description |
|------|-------------|
| **feat** | A new feature |
| **fix** | A bug fix |
| **docs** | Documentation only changes |
| **style** | Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc) |
| **refactor** | A code change that neither fixes a bug nor adds a feature |
| **perf** | A code change that improves performance |
| **test** | Adding missing tests or correcting existing tests |
| **build** | Changes that affect the build system or external dependencies |
| **ci** | Changes to our CI configuration files and scripts |
| **chore** | Other changes that don't modify src or test files |
| **revert** | Reverts a previous commit |

### Breaking Changes

For commits that introduce breaking changes, use:
- **feat!** for breaking feature changes
- **fix!** for breaking bug fixes
- Any type followed by **!** to indicate breaking changes

## Scope

The scope should specify the area of the codebase affected by the change. Use one of the following scopes:

### Application Scopes

| Scope | Description | Example |
|-------|-------------|---------|
| **api** | NestJS backend API | `feat(api): add user authentication endpoint` |
| **web** | React Router v7 frontend | `fix(web): resolve hydration mismatch in date display` |

### Package Scopes

| Scope | Description | Example |
|-------|-------------|---------|
| **ui** | Shared UI components | `feat(ui): add new Button variant` |
| **typescript-config** | Shared TypeScript configuration | `fix(typescript-config): update base config paths` |

### Feature-Specific Scopes

| Scope | Description | Example |
|-------|-------------|---------|
| **auth** | Authentication related changes | `feat(auth): implement JWT token refresh` |
| **users** | User management features | `fix(users): validate email format in user creation` |
| **routing** | React Router configuration | `feat(routing): add protected route wrapper` |
| **database** | Database schema or queries | `refactor(database): optimize user lookup query` |
| **validation** | Input validation and DTOs | `feat(validation): add stronger password requirements` |

### Infrastructure Scopes

| Scope | Description | Example |
|-------|-------------|---------|
| **deps** | Dependency updates | `build(deps): upgrade React to v19.1.0` |
| **config** | Configuration changes | `chore(config): update Biome linting rules` |
| **scripts** | Package.json scripts | `build(scripts): add parallel dev script` |
| **docker** | Docker configuration | `build(docker): optimize build stages` |
| **ci** | Continuous integration | `ci: add automated dependency updates` |

### Global Scopes

| Scope | Description | Example |
|-------|-------------|---------|
| **monorepo** | Monorepo-wide changes | `chore(monorepo): update Turbo configuration` |
| **workspace** | Workspace configuration | `build(workspace): add new package to workspace` |
| **docs** | Documentation updates | `docs(contributing): add commit message examples` |

## Subject

The subject contains a succinct description of the change:

- Use the imperative, present tense: "change" not "changed" nor "changes"
- Don't capitalize the first letter
- No dot (.) at the end
- Maximum 50 characters

### Good Examples

```
feat(api): add user profile endpoint
fix(web): resolve infinite loading state
docs(readme): update installation instructions
refactor(ui): extract common button styles
```

### Bad Examples

```
feat(api): Added user profile endpoint     // ❌ Past tense
fix(web): Fix infinite loading state.      // ❌ Capitalized + period
docs: updated the readme file              // ❌ Past tense
refactor(ui): Extracted common button styles and updated the theme colors and fixed some issues with the spacing  // ❌ Too long
```

## Body

The body should include the motivation for the change and contrast this with previous behavior.

- Use the imperative, present tense: "change" not "changed" nor "changes"
- Wrap lines at 72 characters
- Explain **what** and **why** vs. **how**

### Example

```
feat(api): add user profile endpoint

Add GET /api/users/:id endpoint to retrieve user profile information.
This enables the frontend to display user details on the profile page.

The endpoint includes validation for user ID format and returns
appropriate error codes for invalid or non-existent users.
```

## Footer

The footer should contain any information about **breaking changes** and reference GitHub issues that this commit **closes**.

### Breaking Changes

Breaking changes should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.

### Closing Issues

If the commit closes or fixes GitHub issues, reference them in the footer:

```
Closes #123
Fixes #456
Resolves #789
```

### Example

```
feat(auth)!: implement new JWT authentication

Replace session-based auth with JWT tokens for better scalability.
This change affects all API endpoints and requires frontend updates.

BREAKING CHANGE: All API endpoints now require JWT token in Authorization header.
Session-based authentication is no longer supported.

Closes #234
```

## Examples

### Feature Examples

```bash
# New feature in API
feat(api): add password reset endpoint

# New feature in web app
feat(web): add dark mode toggle

# New UI component
feat(ui): add LoadingSpinner component

# New feature with breaking change
feat(auth)!: implement OAuth2 authentication

BREAKING CHANGE: Password-based login is no longer supported.
All users must authenticate via OAuth2 providers.
```

### Bug Fix Examples

```bash
# API bug fix
fix(api): prevent duplicate user registration

# Frontend bug fix  
fix(web): resolve hydration mismatch in user profile

# UI component fix
fix(ui): correct Button disabled state styling

# Cross-package fix
fix(validation): handle edge case in email validation
```

### Documentation Examples

```bash
# API documentation
docs(api): add OpenAPI schema for user endpoints

# General documentation
docs(readme): update development setup instructions

# Contributing guidelines
docs(contributing): add commit message examples
```

### Refactoring Examples

```bash
# API refactoring
refactor(api): extract user service logic

# Frontend refactoring
refactor(web): simplify route configuration

# UI component refactoring
refactor(ui): consolidate button variants
```

### Build and Configuration Examples

```bash
# Dependency updates
build(deps): upgrade TypeScript to v5.8.2

# Build configuration
build(vite): optimize bundle splitting

# Workspace changes
build(workspace): add new testing utilities package

# CI/CD changes
ci: add automated security scanning
```

### Chore Examples

```bash
# Code formatting
chore(config): update Biome formatting rules

# Package maintenance
chore(deps): update development dependencies

# Cleanup
chore(api): remove unused imports
```

## Validation

### Automated Validation

We enforce commit message format through:

1. **Git hooks**: Pre-commit validation
2. **CI/CD**: Pull request validation
3. **Commitlint**: Automated checking

### Manual Validation Checklist

Before committing, ensure:

- [ ] Type is one of the allowed types
- [ ] Scope matches the affected area
- [ ] Subject is in imperative mood
- [ ] Subject is under 50 characters
- [ ] No period at end of subject
- [ ] Body explains what and why (if needed)
- [ ] Breaking changes are documented
- [ ] Issues are referenced (if applicable)

### Validation Tools

```bash
# Install commitlint (optional)
npm install -D @commitlint/cli @commitlint/config-conventional

# Validate commit message
echo "feat(api): add user endpoint" | npx commitlint

# Setup git hook
npx husky add .husky/commit-msg 'npx commitlint --edit $1'
```

## Automation Benefits

Following these conventions enables:

### Automated Changelog Generation

```bash
# Generate changelog from commits
npx conventional-changelog -p angular -i CHANGELOG.md -s
```

### Semantic Versioning

- **fix**: PATCH version bump
- **feat**: MINOR version bump  
- **BREAKING CHANGE**: MAJOR version bump

### Release Automation

```bash
# Automated release based on commits
npx semantic-release
```

### Pull Request Validation

```yaml
# GitHub Action example
- name: Validate PR title
  uses: amannn/action-semantic-pull-request@v4
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Scope Guidelines by Package

### API Application (`apps/api`)

**Preferred scopes**: `api`, `auth`, `users`, `database`, `validation`

```bash
feat(api): add health check endpoint
fix(auth): resolve JWT token expiration handling  
refactor(users): optimize user query performance
test(api): add integration tests for user endpoints
```

### Web Application (`apps/web`)

**Preferred scopes**: `web`, `routing`, `auth`, `ui` (for app-specific UI)

```bash
feat(web): implement user profile page
fix(routing): resolve navigation state issues
style(web): update responsive design breakpoints
perf(web): optimize bundle size with code splitting
```

### UI Package (`packages/ui`)

**Preferred scopes**: `ui`, `components`, `themes`

```bash
feat(ui): add DatePicker component
fix(ui): resolve Button focus outline
refactor(ui): standardize component prop interfaces
docs(ui): add Storybook examples
```

### TypeScript Config (`packages/typescript-config`)

**Preferred scopes**: `typescript-config`, `config`

```bash
feat(typescript-config): add strict null checks
fix(typescript-config): resolve path mapping issues
refactor(config): consolidate shared compiler options
```

## Common Patterns

### Multi-scope Changes

For changes affecting multiple areas:

```bash
# Use the primary scope
feat(api): add user preferences endpoint

# Or use a broader scope
feat(auth): implement SSO across api and web

# For monorepo-wide changes
chore(monorepo): upgrade all dependencies to latest
```

### Incremental Features

```bash
feat(api): add user creation endpoint
feat(api): add user update endpoint  
feat(api): add user deletion endpoint
feat(web): integrate with user management API
```

### Bug Fixes with Tests

```bash
fix(api): prevent SQL injection in user queries

Add parameterized queries and input sanitization.
Includes regression tests to prevent future occurrences.

Fixes #123
```

---

## Enforcement

These guidelines are enforced through:

- **Git hooks**: Prevent invalid commit messages
- **PR validation**: Automated title checking
- **Code review**: Manual verification
- **CI/CD pipeline**: Automated validation

Remember: Good commit messages help teammates understand changes and enable powerful automation for releases and changelogs.

## Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Angular Commit Guidelines](https://github.com/angular/angular/blob/main/contributing-docs/commit-message-guidelines.md)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/) 
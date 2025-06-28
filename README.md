# Turbo Monorepo: NestJS + React Router + UI Library

A modern full-stack monorepo starter built with the latest technologies:

- **NestJS API** (`apps/api`) - Backend API server with TypeScript
- **React Router v7 Web App** (`apps/web`) - Frontend web application with React 19
- **Shared UI Library** (`packages/ui`) - Reusable React components
- **TypeScript Config** (`packages/typescript-config`) - Shared TypeScript configuration

## ✨ Features

- 🚀 **React Router v7** - Latest routing with server-side rendering
- ⚛️ **React 19** - Latest React with improved performance
- 🎯 **NestJS** - Scalable Node.js framework for APIs
- 🔧 **Turborepo** - High-performance build system
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 📏 **Biome** - Fast formatter and linter
- 🛠️ **Chrome DevTools Workspace** - Save changes directly from DevTools
- 📦 **TypeScript** - End-to-end type safety
- ⚡ **Vite** - Lightning-fast build tool

## Architecture

```
mono-site/
├── apps/
│   ├── api/          # NestJS backend API (port 3001)
│   └── web/          # React Router v7 frontend (port 5173)
├── packages/
│   ├── ui/           # Shared React components
│   └── typescript-config/ # Shared TypeScript configuration
├── biome.json        # Biome configuration
└── turbo.json        # Turbo configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm

### Installation

```bash
# Install dependencies
npm install
```

### Development

#### Run all applications
```bash
npm run dev
```

This starts:
- **API Server**: `http://localhost:3001`
- **Web Application**: `http://localhost:5173`

#### Run individual applications

**API Server (NestJS):**
```bash
cd apps/api
npm run dev
```

**Web Application (React Router v7):**
```bash
cd apps/web
npm run dev
```

### Building

```bash
# Build all packages and applications
npm run build
```

### Code Quality

```bash
# Format and lint with Biome
npm run lint

# Type check all packages
npm run check-types
```

## 🚀 **NestJS API** (`apps/api`)

Modern backend API with:
- RESTful endpoints with TypeScript
- CORS enabled for frontend consumption
- Hot reload development
- Built-in testing with Jest

**Available Endpoints:**
- `GET /` - Health check endpoint

### Example API Usage

```typescript
// Fetch data from API
const response = await fetch('http://localhost:3001');
const data = await response.json();
```

## 🎨 **React Router v7 Web App** (`apps/web`)

Modern frontend application featuring:
- **React 19** - Latest React with improved performance
- **Server-side rendering** - Fast initial page loads
- **Shared UI components** - From `@repo/ui` package
- **Tailwind CSS** - Utility-first styling
- **Chrome DevTools Workspace** - Save changes directly from DevTools
- **TypeScript** - Full type safety

### Chrome DevTools Workspace Integration

This starter includes Chrome DevTools workspace integration:

1. Start the dev server (`npm run dev`)
2. Open Chrome DevTools on `localhost:5173`
3. Go to **Sources** → **Workspace** tab
4. Click **"Connect"** next to your project folder
5. Grant file access permission
6. Edit CSS/JS in DevTools and save directly to source files!

### Example Component Usage

```tsx
import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';

export default function HomePage() {
  return (
    <Card>
      <h1>Welcome to React Router v7</h1>
      <Button appName="web">Get Started</Button>
    </Card>
  );
}
```

## 📦 **Shared UI Library** (`packages/ui`)

Reusable React components built with:
- **React 19** - Latest React features
- **TypeScript** - Full type definitions
- **Tailwind CSS** - Consistent styling

**Available Components:**
- `Button` - Interactive button with app name variants
- `Card` - Container component for content sections
- `Code` - Syntax-highlighted code display

### Using UI Components

```tsx
import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';
import { Code } from '@repo/ui/code';

export default function ExamplePage() {
  return (
    <Card>
      <h2>Example Components</h2>
      <Button appName="web">Click me!</Button>
      <Code children="console.log('Hello, World!');" />
    </Card>
  );
}
```

## 🔧 **Turborepo Configuration**

Optimized for development speed:
- **Dependency-aware builds** - Packages build in correct order
- **Intelligent caching** - Skip unchanged builds
- **Parallel execution** - Maximum CPU utilization
- **Remote caching** - Share cache across team (configurable)

## Scripts Reference

### Root Level Scripts
- `npm run dev` - Start all apps in development mode
- `npm run build` - Build all packages and applications  
- `npm run lint` - Format and lint with Biome
- `npm run check-types` - Type check all TypeScript

### API Scripts (`apps/api`)
- `npm run dev` - Development with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run test` - Run test suite

### Web Scripts (`apps/web`)
- `npm run dev` - Development server (Vite)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run typecheck` - Type check only

## Technology Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 19, React Router v7, Tailwind CSS |
| **Backend** | NestJS, Node.js, TypeScript |
| **Build Tools** | Turborepo, Vite, TypeScript |
| **Code Quality** | Biome (formatting + linting), TypeScript |
| **Development** | Chrome DevTools Workspace integration |

## Adding New Packages

To add a new package:

1. Create directory in `packages/` or `apps/`
2. Add package name to workspace in root `package.json`
3. Create `package.json` in new package
4. Update `turbo.json` for new build tasks (if needed)

Example new package structure:
```
packages/my-package/
├── package.json
├── src/
│   └── index.ts
└── tsconfig.json
```

## Deployment

### API Deployment
Deploy to any Node.js hosting service:

```bash
cd apps/api
npm run build
npm run start
```

### Web Deployment
Deploy to services supporting Node.js SSR:

```bash
cd apps/web  
npm run build
npm run start
```

Popular deployment platforms:
- **Vercel** - Zero-config React Router v7 support
- **Netlify** - Full-stack applications
- **Railway** - Simple Node.js deployment
- **Fly.io** - Global application deployment

## Development Tips

### Hot Reload
- API: Changes trigger automatic restart
- Web: Instant HMR with Vite
- UI Components: Hot reload across all consuming apps

### Type Safety
- Shared types between API and frontend
- Full IntelliSense support
- Catch errors at compile time

### Chrome DevTools Integration
- Edit styles in DevTools → Save to source files
- Debug with breakpoints in actual TypeScript
- Automatic source map support

## Contributing

We welcome contributions! Please read our contribution guidelines:

- **[Contributing Guide](./contributing-docs/CONTRIBUTING.md)** - Quick start and workflow
- **[Coding Standards](./contributing-docs/coding-standards.md)** - Detailed coding guidelines
- **[Commit Message Guidelines](./contributing-docs/commit-message-guidelines.md)** - Structured commit format

### Quick Start

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow our [coding standards](./contributing-docs/coding-standards.md)
4. Run quality checks: `npm run lint && npm run check-types && npm run build`
5. Submit a pull request

For detailed guidelines, see our [Contributing Guide](./contributing-docs/CONTRIBUTING.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

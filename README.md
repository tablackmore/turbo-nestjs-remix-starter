# Turbo Monorepo: NestJS + Remix + UI Library

This is a Turbo monorepo containing:

- **NestJS API** (`apps/api`) - Backend API server
- **Remix Web App** (`apps/web`) - Frontend web application
- **Shared UI Library** (`packages/ui`) - Reusable React components
- **ESLint Config** (`packages/eslint-config`) - Shared ESLint configuration
- **TypeScript Config** (`packages/typescript-config`) - Shared TypeScript configuration

## Architecture

```
mono-site/
├── apps/
│   ├── api/          # NestJS backend API
│   └── web/          # Remix frontend app
├── packages/
│   ├── ui/           # Shared React components
│   ├── eslint-config/# Shared ESLint configuration
│   └── typescript-config/ # Shared TypeScript configuration
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

#### Run individual applications

**API Server (NestJS):**
```bash
cd apps/api
npm run start:dev
```

**Web Application (Remix):**
```bash
cd apps/web
npm run dev
```

The API server runs on `http://localhost:3001` and the web application runs on `http://localhost:5173`.

### Building

```bash
# Build all packages and applications
npm run build
```

### Linting

```bash
# Lint all packages and applications
npm run lint
```

## Features

### 🚀 **NestJS API** (`apps/api`)
- RESTful API endpoints
- CORS enabled for frontend consumption
- TypeScript support
- Built-in testing with Jest

**Available Endpoints:**
- `GET /` - Health check
- `GET /api/data` - Sample data endpoint

### 🎨 **Remix Web App** (`apps/web`)
- Server-side rendering
- Uses shared UI components from `@repo/ui`
- Consumes NestJS API
- Tailwind CSS for styling
- TypeScript support

### 📦 **Shared UI Library** (`packages/ui`)
- Reusable React components
- TypeScript definitions
- Shared across all applications

**Available Components:**
- `Button` - Interactive button component
- `Card` - Container component for content
- `Code` - Code display component

### 🔧 **Turborepo Configuration**

The monorepo uses Turborepo for:
- **Build orchestration** - Builds packages in the correct order
- **Caching** - Speeds up subsequent builds and tests
- **Parallel execution** - Runs tasks across multiple packages simultaneously

## Usage Examples

### Using UI Components in Remix

```tsx
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";

export default function MyPage() {
  return (
    <Card>
      <h1>My Page</h1>
      <Button appName="web">Click me!</Button>
    </Card>
  );
}
```

### Consuming API in Remix

```tsx
import type { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const response = await fetch('http://localhost:3001/api/data');
  const data = await response.json();
  return { data };
}
```

## Scripts

### Root Level Scripts
- `npm run dev` - Start all applications in development mode
- `npm run build` - Build all packages and applications  
- `npm run lint` - Lint all packages and applications
- `npm run format` - Format code with Prettier
- `npm run check-types` - Type check all TypeScript code

### Application Scripts

**API (`apps/api`):**
- `npm run start:dev` - Start in development mode with hot reload
- `npm run build` - Build the application
- `npm run start:prod` - Start in production mode
- `npm run test` - Run tests

**Web (`apps/web`):**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run typecheck` - Type check the application

## Adding New Packages

To add a new package to the monorepo:

1. Create a new directory in `packages/` or `apps/`
2. Add the package name to the workspace in `package.json`
3. Create a `package.json` file in the new package
4. Update `turbo.json` if needed for new build tasks

## Deployment

### API Deployment
The NestJS API can be deployed to any Node.js hosting service:

```bash
cd apps/api
npm run build
npm run start:prod
```

### Web Deployment
The Remix app can be deployed to services that support Node.js:

```bash
cd apps/web  
npm run build
npm run start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run lint` and `npm run build` to ensure everything works
5. Submit a pull request

## License

This project is licensed under the MIT License.

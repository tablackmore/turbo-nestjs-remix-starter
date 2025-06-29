# Turbo Monorepo: NestJS REST API + React Router v7 + React 19

A production-ready full-stack monorepo built with modern technologies and industry best practices:

- **NestJS REST API** (`apps/api`) - Comprehensive backend API with versioning, pagination, and docs
- **React Router v7 + React 19 Web App** (`apps/web`) - Modern frontend with SSR and React 19 features
- **Shared UI Library** (`packages/ui`) - Reusable React components with design system
- **TypeScript Config** (`packages/typescript-config`) - Shared TypeScript configuration

## ✨ Key Features

### 🚀 **Modern Frontend Stack**

- **React Router v7** - Latest routing with server-side rendering
- **React 19** - Enhanced forms with `useActionState`, optimistic updates with `useOptimistic`
- **Enhanced Error Boundaries** - Smart error categorization and recovery strategies
- **Type-safe API Integration** - Full TypeScript integration with backend

### 🎯 **Production-Ready API**

- **URL-based Versioning** - `/v1/` prefixed endpoints for API evolution
- **Standard Response Format** - Consistent `success`, `data`, `meta` structure
- **Comprehensive CRUD** - Items resource with full create, read, update, delete operations
- **Pagination & Sorting** - Efficient data handling with metadata and navigation links
- **OpenAPI/Swagger Docs** - Interactive API documentation
- **Global Error Handling** - Standardized error responses with proper HTTP status codes

### 🛠️ **Developer Experience**

- **Turborepo** - High-performance build system with intelligent caching
- **Biome** - Fast formatting and linting with consistent code style
- **TypeScript** - End-to-end type safety across frontend and backend
- **Hot Reload** - Instant development feedback across all applications

## Architecture

```text
mono-site/
├── apps/
│   ├── api/                    # NestJS REST API (port 3001)
│   │   ├── src/
│   │   │   ├── common/         # Shared DTOs, interceptors, filters
│   │   │   ├── v1/             # Versioned API endpoints
│   │   │   │   ├── health/     # Health check endpoints
│   │   │   │   └── items/      # Items CRUD resource
│   │   │   └── main.ts
│   │   └── API_DOCUMENTATION.md
│   └── web/                    # React Router v7 + React 19 (port 5173)
│       ├── app/
│       │   ├── components/     # React 19 enhanced components
│       │   ├── hooks/          # Custom React 19 hooks
│       │   ├── lib/           # Type-safe API client
│       │   ├── routes/        # Application routes
│       │   └── types/         # TypeScript API types
│       └── package.json
├── packages/
│   ├── ui/                     # Shared React component library
│   └── typescript-config/      # Shared TypeScript configuration
└── contributing-docs/          # Development guidelines and standards
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

- **REST API Server**: `http://localhost:3001`
- **Interactive API Documentation**: `http://localhost:3001/api-docs`
- **React Router v7 Web App**: `http://localhost:5173`

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

## 🚀 **REST API** (`apps/api`)

Production-ready NestJS API with comprehensive features:

### **API Standards**

- **URL-based Versioning**: All endpoints prefixed with `/v1/`
- **Standard Response Format**: Consistent structure with success indicators
- **Global Error Handling**: Proper HTTP status codes and error messages
- **Request/Response Validation**: Type-safe with automatic validation
- **Interactive Documentation**: OpenAPI/Swagger at `/api-docs`

### **Available Endpoints**

#### Health Check

```bash
GET /v1/health              # Basic health status
GET /v1/health/detailed     # Detailed system information
```

#### Items Resource (Full CRUD)

```bash
GET    /v1/items           # List items with pagination & sorting
GET    /v1/items/:id       # Get single item
POST   /v1/items           # Create new item
PATCH  /v1/items/:id       # Update existing item
DELETE /v1/items/:id       # Delete item
```

#### Query Parameters

- **Pagination**: `?page=1&limit=10`
- **Sorting**: `?sort=name&order=asc`
- **Combined**: `?page=2&limit=5&sort=createdAt&order=desc`

### **Standard Response Format**

```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "meta": {
    "timestamp": "2024-01-01T12:00:00.000Z",
    "version": "1.0.0",
    "requestId": "uuid-here"
  }
}
```

### **Interactive API Documentation**

Comprehensive API documentation available at:
**<http://localhost:3001/api-docs>**

Features:

- Live endpoint testing
- Complete request/response schemas
- Example payloads
- Authentication documentation
- TypeScript type exports

## 🎨 **React Router v7 + React 19 Web App** (`apps/web`)

Modern frontend application showcasing React 19 features:

### **React 19 Features Implemented**

#### **Enhanced Forms with `useActionState`**

- Automatic form state management
- Built-in pending states and error handling
- No manual state management required

```tsx
const [state, formAction, isPending] = useActionState(createItemAction, initialState);

<form action={formAction}>
  <input name="name" disabled={isPending} />
  <SubmitButton />
</form>
```

#### **Optimistic UI Updates with `useOptimistic`**

- Immediate UI feedback for delete operations
- Automatic error recovery if server request fails
- Seamless user experience

```tsx
const [optimisticItems, deleteOptimistic] = useOptimistic(items, removeItem);

// UI updates instantly, reverts on error
const handleDelete = (id) => deleteOptimistic(id);
```

#### **Enhanced Error Boundaries**

- Smart error categorization (network, validation, render errors)
- Automatic retry mechanisms with exponential backoff
- Unique error IDs for debugging
- Session storage error logging

### **Type-Safe API Integration**

Complete TypeScript integration with the backend:

```typescript
// Generated types from API
interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta: ResponseMeta;
}

// Type-safe API client
const api = {
  items: {
    list: (params?: PaginationParams): Promise<ApiResponse<ItemsResponse>>,
    get: (id: string): Promise<ApiResponse<Item>>,
    create: (data: CreateItemDto): Promise<ApiResponse<Item>>,
    update: (id: string, data: UpdateItemDto): Promise<ApiResponse<Item>>,
    delete: (id: string): Promise<ApiResponse<void>>
  }
};
```

### **Key Features**

- **Server-side Rendering** - Fast initial page loads with React Router v7
- **Optimistic Updates** - Instant UI feedback with error recovery
- **Form Management** - React 19 `useActionState` patterns
- **Error Handling** - Comprehensive error boundaries with recovery
- **Real-time Health** - API status monitoring with health checks
- **Responsive Design** - Modern UI with Tailwind CSS

## 📦 **Shared UI Library** (`packages/ui`)

Design system components built with modern practices:

### **Component Library**

- **Button** - Interactive buttons with variants and loading states
- **Card** - Container components for content sections
- **Code** - Syntax-highlighted code display with proper formatting

### **Design System**

- **Tailwind CSS** - Utility-first styling with design tokens
- **tailwind-variants** - Type-safe component variants
- **Consistent Theming** - Shared design tokens across applications

```tsx
import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';

<Card>
  <h2>Modern Components</h2>
  <Button variant="primary" isLoading={isPending}>
    Save Changes
  </Button>
</Card>
```

## 🔧 **Development Workflow**

### **Turborepo Optimization**

- **Dependency-aware builds** - Packages build in correct order
- **Intelligent caching** - Skip unchanged builds across the team
- **Parallel execution** - Maximum CPU utilization
- **Remote caching** - Share build cache (configurable)

### **Code Quality Standards**

- **Biome Configuration** - Consistent formatting and linting
- **TypeScript Strict Mode** - Maximum type safety
- **React 19 Best Practices** - Modern patterns and hooks
- **Commit Message Guidelines** - Structured commit format
- **Automated Quality Checks** - Pre-commit hooks and CI integration

### **Scripts Reference**

#### Root Level

```bash
npm run dev          # Start all apps in development
npm run build        # Build all packages and applications  
npm run lint         # Format and lint with Biome
npm run check-types  # Type check all TypeScript
```

#### API Server (`apps/api`)

```bash
npm run dev          # Development with hot reload
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run comprehensive test suite
```

#### Web Application (`apps/web`)

```bash
npm run dev          # Development server with HMR
npm run build        # Build for production with SSR
npm run start        # Start production server
npm run typecheck    # TypeScript type checking
```

## Technology Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Frontend** | React 19, React Router v7 | Modern UI with SSR and enhanced patterns |
| **Styling** | Tailwind CSS, tailwind-variants | Utility-first CSS with design system |
| **Backend** | NestJS, Node.js | Scalable API server with TypeScript |
| **Database** | In-memory (demo) | Easily replaceable with any database |
| **Build** | Turborepo, Vite | High-performance monorepo builds |
| **Code Quality** | Biome, TypeScript | Formatting, linting, and type safety |
| **Documentation** | OpenAPI/Swagger | Interactive API documentation |

## Production Deployment

### **API Deployment**

The NestJS API is production-ready with:

- Environment-specific configuration
- Proper error handling and logging
- Health check endpoints for monitoring
- OpenAPI documentation generation

```bash
cd apps/api
npm run build
npm run start:prod
```

### **Web Application Deployment**

React Router v7 with SSR support:

- Server-side rendering for performance
- Static asset optimization
- Progressive enhancement

```bash
cd apps/web  
npm run build
npm run start
```

### **Recommended Platforms**

- **Vercel** - Zero-config React Router v7 deployment
- **Railway** - Simple full-stack deployment
- **Fly.io** - Global edge deployment
- **AWS/GCP/Azure** - Enterprise cloud platforms

## Development Guidelines

### **Contributing**

We maintain high code quality standards:

- **[Contributing Guide](./contributing-docs/CONTRIBUTING.md)** - Development workflow
- **[Coding Standards](./contributing-docs/coding-standards.md)** - React 19 patterns and TypeScript
- **[Commit Guidelines](./contributing-docs/commit-message-guidelines.md)** - Structured commits
- **[Styling Guidelines](./contributing-docs/styling-guidelines.md)** - Design system usage

### **React 19 Best Practices**

- **Forms**: Use `useActionState` for automatic state management
- **Optimistic Updates**: Use `useOptimistic` for immediate feedback
- **Error Handling**: Enhanced error boundaries with recovery strategies
- **Custom Hooks**: Wrap React 19 patterns for reusability

### **API Standards**

- **Versioning**: URL-based with `/v1/` prefix
- **Response Format**: Consistent success/error structure
- **Validation**: Input validation with proper error messages
- **Documentation**: Comprehensive OpenAPI specifications

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using the latest technologies for modern web development.**

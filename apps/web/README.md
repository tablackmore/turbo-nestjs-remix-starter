# React Router v7 Web Application

A modern React application built with React Router v7 and the latest web technologies.

- 📖 [React Router v7 docs](https://reactrouter.com/7.6.3/)
- ⚛️ [React 19 docs](https://react.dev/)

## Features

- **React Router v7** - Latest routing with server-side rendering
- **React 19** - Latest React with improved performance  
- **TypeScript** - Full type safety
- **Tailwind CSS v4** - Modern utility-first styling
- **Vite** - Lightning-fast build tool
- **Shared UI Components** - From `@repo/ui` package

## Development

Run the development server:

```sh
npm run dev
```

This will start the application at `http://localhost:5173`

## Building

Build the application for production:

```sh
npm run build
```

## Production

Start the production server:

```sh
npm run start
```

## Type Checking

Run TypeScript type checking:

```sh
npm run typecheck
```

## Deployment

React Router v7 applications can be deployed to various platforms:

### Vercel (Recommended)

Zero-config deployment with built-in React Router v7 support:

```sh
npm install -g vercel
vercel
```

### Other Platforms

- **Netlify** - Full-stack applications with serverless functions
- **Railway** - Simple Node.js deployment
- **Fly.io** - Global application deployment

Make sure to deploy the output of `npm run build`:

- `build/client` - Client-side assets
- `build/server` - Server-side code

## Styling

This application uses **Tailwind CSS v4** with a modern utility-first approach. The styling system includes:

- **Design tokens** - Consistent spacing, colors, and typography
- **Shared components** - From the `@repo/ui` package
- **CSS imports** - Using `@import "tailwindcss"` syntax
- **Component variants** - Type-safe styling with `tailwind-variants`

See the [Vite CSS documentation](https://vitejs.dev/guide/features.html#css) for more details.

## API Integration

This application connects to the NestJS API server running on `http://localhost:3001`.

Example API usage:

```tsx
// In a route loader
export async function loader() {
  const response = await fetch('http://localhost:3001/api/data');
  return await response.json();
}
```

## Chrome DevTools Integration

This application includes Chrome DevTools workspace integration for enhanced development:

1. Open Chrome DevTools while running the dev server
2. Go to **Sources** → **Workspace**
3. Add the project folder to save changes directly from DevTools

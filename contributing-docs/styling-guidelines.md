# Styling & Design System Guidelines

This document outlines the styling standards and design system approach for the UI library using modern Tailwind CSS best practices. Our design system prioritizes consistency, type safety, accessibility, and runtime customization.

## Table of Contents

- [Design Philosophy](#design-philosophy)
- [Tailwind CSS Architecture](#tailwind-css-architecture)
- [Design Tokens](#design-tokens)
- [Component Styling Patterns](#component-styling-patterns)
- [Theming System](#theming-system)
- [Dark Mode Support](#dark-mode-support)
- [Responsive Design](#responsive-design)
- [Animation Guidelines](#animation-guidelines)
- [Accessibility Considerations](#accessibility-considerations)

## Design Philosophy

### Core Principles

- **Consistency**: Unified visual language across all components
- **Flexibility**: Easy customization without breaking existing patterns
- **Performance**: Minimal CSS output with optimal tree-shaking
- **Type Safety**: Full TypeScript support for theme values
- **Accessibility**: WCAG 2.1 AA compliance by default
- **Developer Experience**: Intuitive API with excellent autocomplete

### Technology Stack

- **Tailwind CSS**: Utility-first CSS framework
- **tailwind-variants**: Modern class variance authority (CVA)
- **clsx**: Conditional class name utility
- **CSS Variables**: Runtime theme customization
- **TypeScript**: Full type safety for theme values

## Tailwind CSS Architecture

### File Structure

```
packages/ui/
├── src/
│   ├── components/           # Component implementations
│   ├── styles/
│   │   ├── globals.css      # Global styles and CSS variables
│   │   ├── components.css   # Component-specific styles
│   │   └── tokens.css       # Design token definitions
│   ├── theme/
│   │   ├── tokens.ts        # TypeScript design tokens
│   │   ├── variants.ts      # Component variant definitions
│   │   └── provider.tsx     # Theme provider component
│   └── utils/
│       ├── cn.ts           # Class name utility function
│       └── theme.ts        # Theme utility functions
```

### Modern Component Pattern

```tsx
// Modern approach using tailwind-variants
import { tv } from 'tailwind-variants';

const buttonVariants = tv({
  base: [
    'inline-flex items-center justify-center',
    'font-medium rounded-md transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ],
  variants: {
    variant: {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
    },
    size: {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 px-4 py-2',
      lg: 'h-11 px-8',
      icon: 'h-10 w-10',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});
```

## Design Tokens

### Color System

Our color system uses semantic naming that works with both light and dark themes:

```css
/* CSS Variables in globals.css */
:root {
  /* Brand Colors */
  --primary: 210 100% 50%;
  --primary-foreground: 0 0% 98%;
  
  /* Neutral Colors */
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  
  /* Semantic Colors */
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --success: 142.1 76.2% 36.3%;
  --success-foreground: 355.7 100% 97.3%;
  
  /* Component Colors */
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  /* ... other dark theme values */
}
```

### Tailwind Configuration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
```

### TypeScript Design Tokens

```typescript
// src/theme/tokens.ts
export const designTokens = {
  colors: {
    primary: 'hsl(var(--primary))',
    'primary-foreground': 'hsl(var(--primary-foreground))',
    secondary: 'hsl(var(--secondary))',
    'secondary-foreground': 'hsl(var(--secondary-foreground))',
    // ... other colors
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px',
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
  },
} as const;

export type DesignTokens = typeof designTokens;
```

## Component Styling Patterns

### Class Name Utility

```typescript
// src/utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Component Implementation Pattern

```tsx
// Example: Button component with modern patterns
import { forwardRef } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { cn } from '../utils/cn';

const buttonVariants = tv({
  base: [
    'inline-flex items-center justify-center',
    'whitespace-nowrap rounded-md text-sm font-medium',
    'ring-offset-background transition-colors',
    'focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  variants: {
    variant: {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      outline: [
        'border border-input bg-background hover:bg-accent',
        'hover:text-accent-foreground',
      ],
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
    },
    size: {
      sm: 'h-9 px-3',
      md: 'h-10 px-4 py-2',
      lg: 'h-11 px-8',
      icon: 'h-10 w-10',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
export type { ButtonProps };
```

## Theming System

### Theme Provider

```tsx
// src/theme/provider.tsx
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
```

### Runtime Theme Customization

```typescript
// src/theme/customization.ts
export interface ThemeCustomization {
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    destructive?: string;
    success?: string;
  };
  borderRadius?: string;
  fontFamily?: {
    sans?: string;
    mono?: string;
  };
}

export function applyThemeCustomization(customization: ThemeCustomization) {
  const root = document.documentElement;

  if (customization.colors) {
    Object.entries(customization.colors).forEach(([key, value]) => {
      if (value) {
        root.style.setProperty(`--${key}`, value);
      }
    });
  }

  if (customization.borderRadius) {
    root.style.setProperty('--radius', customization.borderRadius);
  }

  if (customization.fontFamily) {
    Object.entries(customization.fontFamily).forEach(([key, value]) => {
      if (value) {
        root.style.setProperty(`--font-${key}`, value);
      }
    });
  }
}
```

## Dark Mode Support

### Implementation Strategy

1. **CSS Variables**: Use HSL color space for easy lightness adjustments
2. **Class-based**: Use Tailwind's `dark:` prefix for dark mode variants
3. **System Preference**: Respect user's system preference by default
4. **Manual Override**: Allow manual theme switching

### Dark Mode Patterns

```tsx
// Component with dark mode support
<div className="bg-background text-foreground border border-border">
  <h1 className="text-foreground dark:text-foreground">Title</h1>
  <p className="text-muted-foreground">Description</p>
</div>
```

## Responsive Design

### Breakpoint Strategy

```typescript
// Tailwind breakpoints
const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px', // Extra large
} as const;
```

### Responsive Component Pattern

```tsx
// Responsive variants
const cardVariants = tv({
  base: 'p-4 rounded-lg',
  variants: {
    responsive: {
      true: 'p-4 md:p-6 lg:p-8',
    },
    columns: {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    },
  },
});
```

## Animation Guidelines

### Animation Principles

- **Subtle**: Enhance UX without being distracting
- **Fast**: Keep animations under 300ms for interactions
- **Purposeful**: Every animation should serve a function
- **Accessible**: Respect `prefers-reduced-motion`

### Animation Utilities

```css
/* Animation utilities */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Accessibility Considerations

### Color Contrast

- **Text**: Minimum 4.5:1 contrast ratio
- **Interactive elements**: Minimum 3:1 contrast ratio
- **Focus indicators**: Clearly visible and high contrast

### Keyboard Navigation

```tsx
// Focus management pattern
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        className={cn(
          'focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-ring focus-visible:ring-offset-2',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
```

### Screen Reader Support

```tsx
// ARIA attributes pattern
<button
  aria-label="Close dialog"
  aria-describedby="dialog-description"
  aria-expanded={isOpen}
>
  <span aria-hidden="true">×</span>
</button>
```

## Best Practices

### Do's ✅

- Use semantic color names (`primary`, `destructive`) over specific colors (`blue`, `red`)
- Implement consistent spacing using design tokens
- Use `tailwind-variants` for complex component variants
- Test dark mode for all components
- Include focus states for all interactive elements
- Use CSS variables for runtime theme customization
- Follow the compound component pattern for complex components

### Don'ts ❌

- Hardcode specific color values in component classes
- Use arbitrary values (`[#ff0000]`) without design token justification
- Ignore dark mode implementation
- Skip accessibility testing
- Create inconsistent spacing patterns
- Override Tailwind defaults without documentation
- Use `!important` to force styles

### Performance Optimization

- Use `clsx` and `tailwind-merge` for optimal class name handling
- Implement proper tree-shaking with precise imports
- Use CSS variables sparingly to avoid layout shifts
- Optimize bundle size with unused class purging

---

## Migration Guide

When updating existing components to this new system:

1. **Install dependencies**: `tailwind-variants`, `clsx`, `tailwind-merge`
2. **Update component patterns** to use `tv()` function
3. **Replace hardcoded colors** with semantic tokens
4. **Add dark mode support** using CSS variables
5. **Implement responsive variants** where applicable
6. **Test accessibility** with keyboard navigation and screen readers

This design system provides a solid foundation for building consistent, accessible, and customizable UI components while maintaining excellent developer experience and performance. 
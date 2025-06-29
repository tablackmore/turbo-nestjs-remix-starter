# Styling & Design System Guidelines

This document outlines the styling standards and design system approach for the UI library using
modern Tailwind CSS v4 best practices. Our design system prioritizes consistency, type safety,
accessibility, and runtime customization.

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

- **Tailwind CSS v4**: Latest utility-first CSS framework
- **tailwind-variants**: Modern class variance authority (CVA)
- **clsx**: Conditional class name utility
- **CSS Variables**: Runtime theme customization
- **TypeScript**: Full type safety for theme values

## Tailwind CSS Architecture

### File Structure

```text
packages/ui/
├── src/
│   ├── button.tsx          # Button component implementation
│   ├── card.tsx            # Card component implementation
│   ├── code.tsx            # Code component implementation
│   ├── theme/
│   │   └── tokens.ts       # TypeScript design tokens
│   └── utils/
│       └── cn.ts          # Class name utility function
└── package.json           # Package dependencies
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
/* CSS Variables and Tailwind imports in globals.css */
@import "tailwindcss";

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
  darkMode: 'class',
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

### PostCSS Configuration (Tailwind v4)

```javascript
// postcss.config.js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

### TypeScript Design Tokens

```typescript
// src/theme/tokens.ts
export const designTokens = {
  colors: {
    // Brand colors
    primary: 'hsl(var(--primary))',
    'primary-foreground': 'hsl(var(--primary-foreground))',
    secondary: 'hsl(var(--secondary))',
    'secondary-foreground': 'hsl(var(--secondary-foreground))',

    // Semantic colors
    destructive: 'hsl(var(--destructive))',
    'destructive-foreground': 'hsl(var(--destructive-foreground))',
    success: 'hsl(var(--success))',
    'success-foreground': 'hsl(var(--success-foreground))',
    warning: 'hsl(var(--warning))',
    'warning-foreground': 'hsl(var(--warning-foreground))',

    // Neutral colors
    background: 'hsl(var(--background))',
    foreground: 'hsl(var(--foreground))',
    muted: 'hsl(var(--muted))',
    'muted-foreground': 'hsl(var(--muted-foreground))',
    accent: 'hsl(var(--accent))',
    'accent-foreground': 'hsl(var(--accent-foreground))',

    // Component colors
    border: 'hsl(var(--border))',
    input: 'hsl(var(--input))',
    ring: 'hsl(var(--ring))',
    card: 'hsl(var(--card))',
    'card-foreground': 'hsl(var(--card-foreground))',
  },

  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },

  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },

  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
  },

  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
} as const;

export type DesignTokens = typeof designTokens;

/**
 * Semantic color mappings for component variants
 */
export const semanticColors = {
  primary: {
    bg: 'bg-primary',
    text: 'text-primary-foreground',
    hover: 'hover:bg-primary/90',
    focus: 'focus-visible:ring-primary',
  },
  secondary: {
    bg: 'bg-secondary',
    text: 'text-secondary-foreground',
    hover: 'hover:bg-secondary/80',
    focus: 'focus-visible:ring-secondary',
  },
  destructive: {
    bg: 'bg-destructive',
    text: 'text-destructive-foreground',
    hover: 'hover:bg-destructive/90',
    focus: 'focus-visible:ring-destructive',
  },
  success: {
    bg: 'bg-success',
    text: 'text-success-foreground',
    hover: 'hover:bg-success/90',
    focus: 'focus-visible:ring-success',
  },
} as const;
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
import { cn } from './utils/cn.js';

/**
 * Button component variants using tailwind-variants
 * Provides consistent styling with full type safety and customization
 */
const buttonVariants = tv({
  base: [
    // Layout & positioning
    'inline-flex items-center justify-center',
    'whitespace-nowrap rounded-md text-sm font-medium',

    // State management
    'ring-offset-background transition-colors',
    'focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',

    // Accessibility
    'cursor-pointer select-none',
  ],
  variants: {
    variant: {
      primary: [
        'bg-primary text-primary-foreground',
        'hover:bg-primary/90',
        'focus-visible:ring-primary',
      ],
      secondary: [
        'bg-secondary text-secondary-foreground',
        'hover:bg-secondary/80',
        'focus-visible:ring-secondary',
      ],
      destructive: [
        'bg-destructive text-destructive-foreground',
        'hover:bg-destructive/90',
        'focus-visible:ring-destructive',
      ],
      success: [
        'bg-success text-success-foreground',
        'hover:bg-success/90',
        'focus-visible:ring-success',
      ],
      outline: [
        'border border-input bg-background',
        'hover:bg-accent hover:text-accent-foreground',
        'focus-visible:ring-ring',
      ],
      ghost: ['hover:bg-accent hover:text-accent-foreground', 'focus-visible:ring-ring'],
      link: ['text-primary underline-offset-4 hover:underline', 'focus-visible:ring-ring'],
    },
    size: {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 px-4 py-2',
      lg: 'h-11 px-8',
      icon: 'h-10 w-10',
    },
    fullWidth: {
      true: 'w-full',
    },
    loading: {
      true: 'cursor-not-allowed',
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
  /**
   * Content to display inside the button
   */
  children: React.ReactNode;
  /**
   * Whether the button is in a loading state
   */
  loading?: boolean;
  /**
   * Icon to display before the text
   */
  icon?: React.ReactNode;
}

/**
 * A modern, flexible button component built with tailwind-variants.
 * Supports multiple variants, sizes, loading states, icons, and full customization.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      loading = false,
      icon,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        className={cn(
          buttonVariants({
            variant,
            size,
            fullWidth,
            loading,
          }),
          className,
        )}
        ref={ref}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        {...props}
      >
        {/* Loading spinner with accessibility support */}
        {loading && (
          <span aria-live="polite" className="mr-2">
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </span>
        )}
        
        {/* Optional icon */}
        {icon && !loading && <span className="mr-2">{icon}</span>}
        
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { buttonVariants };
export type { ButtonProps };
```

## Theming System

### CSS Variables Approach

The design system uses CSS variables for theming, allowing for easy customization and dark mode support:

```css
/* CSS Variables and Tailwind imports in globals.css */
@import "tailwindcss";

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

### Semantic Color Mappings

Use the semantic color mappings from the design tokens for consistent component styling:

```typescript
// From src/theme/tokens.ts
export const semanticColors = {
  primary: {
    bg: 'bg-primary',
    text: 'text-primary-foreground',
    hover: 'hover:bg-primary/90',
    focus: 'focus-visible:ring-primary',
  },
  secondary: {
    bg: 'bg-secondary',
    text: 'text-secondary-foreground',
    hover: 'hover:bg-secondary/80',
    focus: 'focus-visible:ring-secondary',
  },
  // ... other semantic mappings
} as const;
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

## Implementation Guide

When creating new components following this design system:

1. **Install dependencies**: `tailwind-variants`, `clsx`, `tailwind-merge` (already included)
2. **Use the `tv()` function** for component variants with type safety
3. **Use semantic color tokens** from the design system
4. **Implement dark mode support** using CSS variables
5. **Add responsive variants** where applicable
6. **Test accessibility** with keyboard navigation and screen readers

This design system provides a solid foundation for building consistent, accessible, and customizable
UI components while maintaining excellent developer experience and performance.

/**
 * Design tokens for the UI library
 * Provides type-safe access to theme values and semantic naming
 */

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

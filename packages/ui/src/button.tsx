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
  /**
   * Legacy prop for demo behavior - will show alert if no onClick provided
   */
  appName?: string;
}

/**
 * A modern, flexible button component built with tailwind-variants.
 * Supports multiple variants, sizes, loading states, icons, and full customization.
 *
 * Features:
 * - 7 semantic variants (primary, secondary, destructive, success, outline, ghost, link)
 * - 4 sizes (sm, md, lg, icon)
 * - Loading state with spinner
 * - Icon support
 * - Full width option
 * - Complete accessibility support
 * - Type-safe variant props
 * - Custom class name merging
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 *
 * // With loading state
 * <Button variant="destructive" loading disabled>
 *   Deleting...
 * </Button>
 *
 * // With icon and full width
 * <Button variant="secondary" icon={<PlusIcon />} fullWidth>
 *   Add Item
 * </Button>
 *
 * // Outline variant with custom classes
 * <Button variant="outline" className="border-2 border-dashed">
 *   Custom styling
 * </Button>
 * ```
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
      appName,
      onClick,
      ...props
    },
    ref,
  ) => {
    // Legacy demo behavior - backward compatibility
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onClick) {
        onClick(e);
      } else if (appName) {
        // Default demo behavior when no onClick is provided
        alert(`Hello from your ${appName} app!`);
      }
    };

    return (
      <button
        className={cn(
          buttonVariants({
            variant,
            size,
            fullWidth,
            loading,
            className,
          }),
        )}
        ref={ref}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        onClick={handleClick}
        {...props}
      >
        {/* Loading spinner */}
        {loading && (
          <svg
            className='mr-2 h-4 w-4 animate-spin'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            aria-hidden='true'
          >
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
            />
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            />
          </svg>
        )}

        {/* Icon (only when not loading) */}
        {!loading && icon && (
          <span className={cn('inline-flex items-center', children && 'mr-2')} aria-hidden='true'>
            {icon}
          </span>
        )}

        {/* Button content */}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

// Export the variants for external use (e.g., in compound components)
export { buttonVariants };

// Export types for external consumption
export type { ButtonProps };

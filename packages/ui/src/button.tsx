import type { ReactNode } from 'react';

// Define button variants with proper typing
const buttonVariants = {
  primary: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 focus:ring-gray-500 text-gray-900',
  danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white',
} as const;

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
} as const;

interface ButtonProps {
  children: ReactNode;
  className?: string;
  appName?: string;
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  'aria-label'?: string;
}

export function Button({
  children,
  className,
  appName,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  onClick,
  'aria-label': ariaLabel,
  ...props
}: ButtonProps) {
  const baseClasses = [
    'inline-flex items-center justify-center',
    'font-medium rounded-md',
    'transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    buttonSizes[size],
    buttonVariants[variant],
  ].join(' ');

  const combinedClasses = className ? `${baseClasses} ${className}` : baseClasses;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (appName) {
      // Default demo behavior when no onClick is provided
      alert(`Hello from your ${appName} app!`);
    } else {
      alert('Hello from the app!');
    }
  };

  return (
    <button
      type={type}
      className={combinedClasses}
      onClick={handleClick}
      disabled={disabled}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </button>
  );
}

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function for conditional class names with Tailwind CSS
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 *
 * @param inputs - Class values to be processed
 * @returns Merged and deduplicated class string
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-blue-500', className)
 * cn('text-red-500', 'text-blue-500') // Returns 'text-blue-500' (last wins)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

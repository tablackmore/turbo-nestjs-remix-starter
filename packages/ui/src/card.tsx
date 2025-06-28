import type { JSX, ReactNode } from 'react';

const cardVariants = {
  default: 'bg-white border-gray-200',
  elevated: 'bg-white border-gray-200 shadow-lg',
  outline: 'bg-transparent border-gray-300',
} as const;

interface CardProps {
  className?: string;
  title?: string;
  children: ReactNode;
  href?: string;
  variant?: keyof typeof cardVariants;
  'aria-label'?: string;
}

export function Card({
  className,
  title,
  children,
  href,
  variant = 'default',
  'aria-label': ariaLabel,
  ...props
}: CardProps): JSX.Element {
  const baseClasses = [
    'p-6 rounded-lg border transition-shadow duration-200',
    cardVariants[variant],
  ].join(' ');

  const combinedClasses = className ? `${baseClasses} ${className}` : baseClasses;

  const content = (
    <>
      {title && (
        <h2 className='text-lg font-semibold mb-2'>
          {title}
          {href && <span className='ml-1'>→</span>}
        </h2>
      )}
      <div>{children}</div>
    </>
  );

  if (href) {
    return (
      <a
        className={`${combinedClasses} hover:shadow-md block`}
        href={`${href}?utm_source=create-turbo&utm_medium=basic&utm_campaign=create-turbo`}
        rel='noopener noreferrer'
        target='_blank'
        aria-label={ariaLabel || `Navigate to ${title || 'external link'}`}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <div className={combinedClasses} {...props}>
      {content}
    </div>
  );
}

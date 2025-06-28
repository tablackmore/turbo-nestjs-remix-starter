import type { JSX, ReactNode } from 'react';

const codeVariants = {
  inline: 'px-1.5 py-0.5 text-sm bg-gray-100 border border-gray-200 rounded',
  block: 'block p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto',
} as const;

interface CodeProps {
  children: ReactNode;
  className?: string;
  variant?: keyof typeof codeVariants;
  language?: string;
}

export function Code({
  children,
  className,
  variant = 'inline',
  language,
  ...props
}: CodeProps): JSX.Element {
  const baseClasses = ['font-mono font-medium', codeVariants[variant]].join(' ');

  const combinedClasses = className ? `${baseClasses} ${className}` : baseClasses;

  return (
    <code className={combinedClasses} data-language={language} {...props}>
      {children}
    </code>
  );
}

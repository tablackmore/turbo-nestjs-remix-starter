import { type JSX, type ReactNode } from "react";

export function Card({
  className,
  title,
  children,
  href,
}: {
  className?: string;
  title?: string;
  children: ReactNode;
  href?: string;
}): JSX.Element {
  const baseClasses = "p-6 bg-white rounded-lg shadow-md border border-gray-200";
  const combinedClasses = className ? `${baseClasses} ${className}` : baseClasses;

  if (href) {
    return (
      <a
        className={combinedClasses}
        href={`${href}?utm_source=create-turbo&utm_medium=basic&utm_campaign=create-turbo"`}
        rel="noopener noreferrer"
        target="_blank"
      >
        {title && (
          <h2 className="text-lg font-semibold mb-2">
            {title} <span>-&gt;</span>
          </h2>
        )}
        <div>{children}</div>
      </a>
    );
  }

  return (
    <div className={combinedClasses}>
      {title && <h2 className="text-lg font-semibold mb-2">{title}</h2>}
      <div>{children}</div>
    </div>
  );
}

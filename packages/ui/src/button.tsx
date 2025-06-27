import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  appName?: string;
}

export const Button = ({ children, className, appName }: ButtonProps) => {
  const baseClasses =
    "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors";
  const combinedClasses = className ? `${baseClasses} ${className}` : baseClasses;

  return (
    <button
      type="button"
      className={combinedClasses}
      onClick={() => alert(appName ? `Hello from your ${appName} app!` : "Hello from the app!")}
    >
      {children}
    </button>
  );
};

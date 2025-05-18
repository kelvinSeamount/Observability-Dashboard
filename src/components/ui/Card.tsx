import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card = ({ children, className = "" }: CardProps) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = "" }: CardProps) => {
  return (
    <div
      className={`px-4 py-3 border-b border-gray-200 dark:border-gray-700 font-medium ${className}`}
    >
      {children}
    </div>
  );
};

export const CardContent = ({ children, className = "" }: CardProps) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

export const CardFooter = ({ children, className = "" }: CardProps) => {
  return (
    <div
      className={`px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;

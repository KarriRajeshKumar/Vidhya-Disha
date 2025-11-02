import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ContrastTextProps {
  children: ReactNode;
  variant?: "high" | "medium" | "low";
  className?: string;
}

/**
 * ContrastText component ensures proper text contrast against backgrounds
 * Use this component when you need guaranteed readable text
 */
export const ContrastText = ({ 
  children, 
  variant = "high", 
  className 
}: ContrastTextProps) => {
  const variantClasses = {
    high: "text-foreground", // Highest contrast
    medium: "text-muted-foreground", // Medium contrast, still readable
    low: "text-muted-foreground/80" // Lower contrast for subtle text
  };

  return (
    <span className={cn(variantClasses[variant], className)}>
      {children}
    </span>
  );
};
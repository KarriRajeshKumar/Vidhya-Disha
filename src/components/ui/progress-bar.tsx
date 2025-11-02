import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showPercentage?: boolean;
  variant?: "default" | "success" | "warning" | "danger";
}

export const ProgressBar = ({ 
  value, 
  max = 100, 
  className, 
  showPercentage = false,
  variant = "default" 
}: ProgressBarProps) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const variantStyles = {
    default: "bg-primary",
    success: "bg-success",
    warning: "bg-warning", 
    danger: "bg-destructive"
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="w-full bg-progress-bg rounded-full h-2">
        <div 
          className={cn("h-2 rounded-full transition-all duration-500", variantStyles[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentage && (
        <div className="text-sm text-muted-foreground mt-1">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
};
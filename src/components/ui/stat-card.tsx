import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  className?: string;
  valueColor?: string;
}

export const StatCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  className,
  valueColor = "text-foreground"
}: StatCardProps) => {
  return (
    <div className={cn(
      "bg-card border border-border rounded-lg p-6 shadow-card",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={cn("text-3xl font-bold mt-2", valueColor)}>{value}</p>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {Icon && (
          <Icon className="w-8 h-8 text-muted-foreground" />
        )}
      </div>
    </div>
  );
};
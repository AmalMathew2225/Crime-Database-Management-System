import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  description?: string;
  variant?: "default" | "primary" | "accent" | "warning";
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  variant = "default",
}: StatsCardProps) {
  // Thuna style: White cards with colored icons/accents
  const colors = {
    default: "text-primary",
    primary: "text-primary",
    accent: "text-accent",
    warning: "text-chart-4", // Yellow/Gold for warning
  };

  const colorClass = colors[variant] || colors.default;

  return (
    <Card className={`border-none shadow-sm rounded-lg border-l-4 ${variant === 'accent' ? 'border-accent' :
      variant === 'warning' ? 'border-warning' :
        variant === 'primary' ? 'border-primary' :
          'border-accent' // Default to accent if not specified or 'default'
      }`}>
      <CardContent className="p-5">
        <p className="text-sm font-semibold text-muted-foreground block mb-1">{title}</p>
        <div className="flex items-center gap-2">
          <h3 className="text-3xl font-bold text-primary">{value}</h3>
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1 hidden">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}



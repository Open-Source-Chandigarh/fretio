import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  iconClassName?: string;
  variant?: "default" | "search" | "error" | "success";
}

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  iconClassName,
  variant = "default",
}: EmptyStateProps) => {
  const variantStyles = {
    default: {
      container: "bg-gradient-to-br from-muted/30 to-muted/10",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      titleColor: "text-foreground",
    },
    search: {
      container: "bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      titleColor: "text-blue-900 dark:text-blue-100",
    },
    error: {
      container: "bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/20 dark:to-red-900/10",
      iconBg: "bg-red-100 dark:bg-red-900/30",
      iconColor: "text-red-600 dark:text-red-400",
      titleColor: "text-red-900 dark:text-red-100",
    },
    success: {
      container: "bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10",
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
      titleColor: "text-green-900 dark:text-green-100",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={cn("flex items-center justify-center py-16 px-4", className)}>
      <div className="max-w-md w-full text-center space-y-6">
        {/* Animated Icon Container */}
        <div className="relative inline-flex items-center justify-center">
          {/* Pulsing background circle */}
          <div className={cn(
            "absolute inset-0 rounded-full opacity-20 animate-ping",
            styles.iconBg
          )} />
          
          {/* Main icon container */}
          <div className={cn(
            "relative w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-110 duration-300",
            styles.iconBg,
            styles.container,
            iconClassName
          )}>
            <Icon className={cn("h-10 w-10", styles.iconColor)} strokeWidth={1.5} />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className={cn(
            "text-xl font-bold tracking-tight",
            styles.titleColor
          )}>
            {title}
          </h3>
          <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
            {description}
          </p>
        </div>

        {/* Actions */}
        {(action || secondaryAction) && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            {action && (
              <Button
                onClick={action.onClick}
                size="lg"
                className="shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                onClick={secondaryAction.onClick}
                variant="outline"
                size="lg"
                className="shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
              >
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}

        {/* Decorative Elements */}
        <div className="flex justify-center gap-1.5 pt-4 opacity-40">
          <div className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};

export default EmptyState;



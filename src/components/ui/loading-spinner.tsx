import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
}

export function LoadingSpinner({ 
  className,
  size = 16,
  ...props 
}: LoadingSpinnerProps) {
  return (
    <div 
      role="status"
      aria-label="Loading"
      className={cn("animate-spin", className)} 
      {...props}
    >
      <Loader2 size={size} />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

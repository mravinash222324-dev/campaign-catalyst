import { Check, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkflowStep {
  id: string;
  label: string;
  status: 'completed' | 'current' | 'pending' | 'blocked';
}

interface WorkflowProgressProps {
  steps: WorkflowStep[];
  className?: string;
}

export function WorkflowProgress({ steps, className }: WorkflowProgressProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          {/* Step indicator */}
          <div className="flex items-center gap-2">
            <div className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-all",
              step.status === 'completed' && "bg-emerald-500 text-white",
              step.status === 'current' && "bg-primary text-primary-foreground ring-4 ring-primary/20",
              step.status === 'pending' && "bg-muted text-muted-foreground",
              step.status === 'blocked' && "bg-red-500/20 text-red-500"
            )}>
              {step.status === 'completed' ? (
                <Check className="h-4 w-4" />
              ) : step.status === 'blocked' ? (
                <AlertCircle className="h-4 w-4" />
              ) : step.status === 'current' ? (
                <Clock className="h-3.5 w-3.5" />
              ) : (
                index + 1
              )}
            </div>
            <span className={cn(
              "text-sm font-medium hidden sm:inline",
              step.status === 'completed' && "text-emerald-500",
              step.status === 'current' && "text-primary",
              step.status === 'pending' && "text-muted-foreground",
              step.status === 'blocked' && "text-red-500"
            )}>
              {step.label}
            </span>
          </div>
          
          {/* Connector line */}
          {index < steps.length - 1 && (
            <div className={cn(
              "mx-3 h-0.5 w-8 rounded-full transition-all",
              step.status === 'completed' ? "bg-emerald-500" : "bg-border"
            )} />
          )}
        </div>
      ))}
    </div>
  );
}

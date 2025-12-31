import { Clock, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Database } from '@/integrations/supabase/types';

type TaskStatus = Database['public']['Enums']['task_status'];
type Priority = Database['public']['Enums']['priority_level'];
type TaskType = Database['public']['Enums']['task_type'];

interface TaskCardProps {
  task: {
    id: string;
    status: TaskStatus;
    priority: Priority;
    type: TaskType;
    deadline: string;
    briefs?: { title: string; clients?: { name: string } | null } | null;
  };
  onClick?: () => void;
}

const statusLabels: Record<TaskStatus, string> = {
  draft: 'Draft', pending: 'Pending', in_progress: 'In Progress', review: 'In Review',
  approved: 'Approved', rejected: 'Rejected', client_review: 'Client Review', published: 'Published',
};

const priorityLabels: Record<Priority, string> = { low: 'Low', normal: 'Normal', high: 'High', critical: 'Critical' };

const typeLabels: Record<TaskType, string> = {
  copy: 'Copywriting', design: 'Design', copy_qc: 'Copy QC', 
  design_qc: 'Design QC', client_review: 'Client Review', publishing: 'Publishing',
};

export function TaskCard({ task, onClick }: TaskCardProps) {
  const isOverdue = new Date(task.deadline) < new Date() && task.status !== 'approved' && task.status !== 'published';
  const timeLeft = formatDistanceToNow(new Date(task.deadline), { addSuffix: true });

  return (
    <div onClick={onClick} className={cn(
      "group cursor-pointer rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-md",
      isOverdue && "border-red-500/30 bg-red-500/5"
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
            {task.briefs?.title || 'Untitled Brief'}
          </h4>
          <p className="text-sm text-muted-foreground mt-0.5">{task.briefs?.clients?.name || 'No client'}</p>
        </div>
        <Badge variant={task.priority as any} className="shrink-0">{priorityLabels[task.priority]}</Badge>
      </div>

      <div className="mt-3">
        <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
          {typeLabels[task.type]}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-end text-sm">
        <div className={cn("flex items-center gap-1.5", isOverdue ? "text-red-500" : "text-muted-foreground")}>
          {isOverdue && <AlertCircle className="h-3.5 w-3.5" />}
          <Clock className="h-3.5 w-3.5" />
          <span className="text-xs">{timeLeft}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-border">
        <Badge variant={task.status.replace('_', '-') as any} className="text-xs">{statusLabels[task.status]}</Badge>
      </div>
    </div>
  );
}

import { CheckCircle, XCircle, Clock, MessageSquare, Upload, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  type: 'approved' | 'rejected' | 'comment' | 'upload' | 'assigned' | 'submitted';
  user: string;
  target: string;
  timestamp: Date;
}

const mockActivities: Activity[] = [
  { id: '1', type: 'approved', user: 'Emily Davis', target: 'TechStart Q1 Campaign Copy', timestamp: new Date(Date.now() - 1000 * 60 * 15) },
  { id: '2', type: 'comment', user: 'David Brown', target: 'Fashion Forward Winter Collection', timestamp: new Date(Date.now() - 1000 * 60 * 45) },
  { id: '3', type: 'upload', user: 'James Wilson', target: 'HealthPlus Awareness Designs', timestamp: new Date(Date.now() - 1000 * 60 * 90) },
  { id: '4', type: 'submitted', user: 'Mike Johnson', target: 'EcoLiving Brand Story', timestamp: new Date(Date.now() - 1000 * 60 * 120) },
  { id: '5', type: 'rejected', user: 'Lisa Park', target: 'FinanceHub Social Creatives', timestamp: new Date(Date.now() - 1000 * 60 * 180) },
];

const activityConfig = {
  approved: { icon: CheckCircle, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', label: 'approved' },
  rejected: { icon: XCircle, color: 'text-red-500', bgColor: 'bg-red-500/10', label: 'rejected' },
  comment: { icon: MessageSquare, color: 'text-blue-500', bgColor: 'bg-blue-500/10', label: 'commented on' },
  upload: { icon: Upload, color: 'text-purple-500', bgColor: 'bg-purple-500/10', label: 'uploaded to' },
  assigned: { icon: ArrowRight, color: 'text-amber-500', bgColor: 'bg-amber-500/10', label: 'assigned' },
  submitted: { icon: Clock, color: 'text-primary', bgColor: 'bg-primary/10', label: 'submitted' },
};

function formatTimeAgo(date: Date): string {
  const minutes = Math.floor((Date.now() - date.getTime()) / 1000 / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function RecentActivity() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border p-4">
        <h3 className="font-semibold text-foreground">Recent Activity</h3>
      </div>
      <div className="divide-y divide-border">
        {mockActivities.map((activity) => {
          const config = activityConfig[activity.type];
          const Icon = config.icon;
          
          return (
            <div key={activity.id} className="flex items-start gap-3 p-4 transition-colors hover:bg-muted/30">
              <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", config.bgColor)}>
                <Icon className={cn("h-4 w-4", config.color)} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{activity.user}</span>
                  {' '}
                  <span className="text-muted-foreground">{config.label}</span>
                  {' '}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatTimeAgo(activity.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

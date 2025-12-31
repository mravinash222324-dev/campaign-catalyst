import { 
  CheckCircle, 
  Clock, 
  Target,
  Wallet,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { KPICard } from '@/components/dashboard/KPICard';
import { TaskCard } from '@/components/dashboard/TaskCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { ClientOverview } from '@/components/dashboard/ClientOverview';
import { WorkflowProgress } from '@/components/dashboard/WorkflowProgress';
import { useBriefs } from '@/hooks/useBriefs';
import { useTasks } from '@/hooks/useTasks';
import { useAds } from '@/hooks/useAds';
import { Badge } from '@/components/ui/badge';

const roleLabels: Record<string, string> = {
  admin: 'Admin',
  dm_manager: 'DM Manager',
  copywriter: 'Copywriter',
  copy_qc: 'Copy QC',
  designer: 'Designer',
  design_qc: 'Design QC',
  client_coordinator: 'Client Coordinator',
  dm_team_lead: 'DM Team Lead',
};

const workflowSteps = [
  { id: 'copy', label: 'Copy', status: 'completed' as const },
  { id: 'copy_qc', label: 'Copy QC', status: 'completed' as const },
  { id: 'design', label: 'Design', status: 'current' as const },
  { id: 'design_qc', label: 'Design QC', status: 'pending' as const },
  { id: 'client', label: 'Client', status: 'pending' as const },
  { id: 'publish', label: 'Publish', status: 'pending' as const },
];

export default function Dashboard() {
  const { profile, role, isLoading: authLoading } = useAuth();
  const { briefs, isLoading: briefsLoading } = useBriefs();
  const { tasks, isLoading: tasksLoading } = useTasks();
  const { ads, isLoading: adsLoading } = useAds();

  const isLoading = authLoading || briefsLoading || tasksLoading || adsLoading;

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const pendingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'in_progress');
  const reviewTasks = tasks.filter(t => t.status === 'review');
  const completedTasks = tasks.filter(t => t.status === 'approved' || t.status === 'published');
  
  const totalSpent = ads.reduce((sum, ad) => sum + Number(ad.spent || 0), 0);
  const totalBudget = ads.reduce((sum, ad) => sum + Number(ad.budget || 0), 0);

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {profile?.name?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your campaigns today.
          </p>
        </div>
        <Badge variant="outline" className="h-8 px-3">
          {role ? roleLabels[role] : 'No Role'}
        </Badge>
      </div>

      {/* Workflow Overview */}
      {briefs.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground">
                Active Campaign: {briefs[0]?.title || 'No active campaigns'}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                {completedTasks.length} of {tasks.length} stages completed
              </p>
            </div>
            <Badge variant="in-progress">In Progress</Badge>
          </div>
          <WorkflowProgress steps={workflowSteps} />
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Active Campaigns"
          value={briefs.filter(b => b.status !== 'published').length}
          change={12}
          changeLabel="vs last month"
          icon={<Target className="h-5 w-5" />}
        />
        <KPICard
          title="Tasks Completed"
          value={completedTasks.length}
          change={8}
          changeLabel="this week"
          icon={<CheckCircle className="h-5 w-5" />}
        />
        <KPICard
          title="Pending Reviews"
          value={reviewTasks.length}
          icon={<Clock className="h-5 w-5" />}
        />
        <KPICard
          title="Budget Utilized"
          value={`₹${(totalSpent / 1000).toFixed(1)}K`}
          change={totalBudget > 0 ? -Math.round(((totalBudget - totalSpent) / totalBudget) * 100) : 0}
          changeLabel="under budget"
          icon={<Wallet className="h-5 w-5" />}
        />
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Tasks Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Tasks */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Your Tasks</h2>
              <span className="text-sm text-muted-foreground">{pendingTasks.length} active</span>
            </div>
            {pendingTasks.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {pendingTasks.slice(0, 4).map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border p-8 text-center">
                <p className="text-muted-foreground">No active tasks. Great job!</p>
              </div>
            )}
          </div>

          {/* Performance Chart */}
          <PerformanceChart />
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <ClientOverview />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}

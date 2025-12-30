import { 
  LayoutDashboard, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  Users,
  Target,
  Wallet
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { KPICard } from '@/components/dashboard/KPICard';
import { TaskCard } from '@/components/dashboard/TaskCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { ClientOverview } from '@/components/dashboard/ClientOverview';
import { WorkflowProgress } from '@/components/dashboard/WorkflowProgress';
import { mockTasks, mockBriefs, roleLabels } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';

const workflowSteps = [
  { id: 'copy', label: 'Copy', status: 'completed' as const },
  { id: 'copy_qc', label: 'Copy QC', status: 'completed' as const },
  { id: 'design', label: 'Design', status: 'current' as const },
  { id: 'design_qc', label: 'Design QC', status: 'pending' as const },
  { id: 'client', label: 'Client', status: 'pending' as const },
  { id: 'publish', label: 'Publish', status: 'pending' as const },
];

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  const pendingTasks = mockTasks.filter(t => t.status === 'pending' || t.status === 'in_progress');
  const reviewTasks = mockTasks.filter(t => t.status === 'review');

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {user.name.split(' ')[0]}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your campaigns today.
          </p>
        </div>
        <Badge variant="outline" className="h-8 px-3">
          {roleLabels[user.role]}
        </Badge>
      </div>

      {/* Workflow Overview */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground">Active Campaign: TechStart Q1 Launch</h3>
            <p className="text-sm text-muted-foreground mt-0.5">3 of 6 stages completed</p>
          </div>
          <Badge variant="in-progress">In Progress</Badge>
        </div>
        <WorkflowProgress steps={workflowSteps} />
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Active Campaigns"
          value={mockBriefs.length}
          change={12}
          changeLabel="vs last month"
          icon={<Target className="h-5 w-5" />}
        />
        <KPICard
          title="Tasks Completed"
          value={24}
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
          value="₹1.2L"
          change={-5}
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
            <div className="grid gap-4 md:grid-cols-2">
              {pendingTasks.slice(0, 4).map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
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

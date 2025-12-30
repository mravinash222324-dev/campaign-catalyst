import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Target, Users, MousePointer, DollarSign } from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';
import { Badge } from '@/components/ui/badge';

const performanceData = [
  { month: 'Jan', reach: 120000, leads: 450, spent: 45000 },
  { month: 'Feb', reach: 150000, leads: 520, spent: 52000 },
  { month: 'Mar', reach: 180000, leads: 680, spent: 58000 },
  { month: 'Apr', reach: 160000, leads: 590, spent: 55000 },
  { month: 'May', reach: 200000, leads: 750, spent: 62000 },
  { month: 'Jun', reach: 240000, leads: 890, spent: 70000 },
];

const platformData = [
  { name: 'Facebook', value: 35, color: '#4267B2' },
  { name: 'Instagram', value: 30, color: '#E1306C' },
  { name: 'LinkedIn', value: 20, color: '#0077B5' },
  { name: 'Google Ads', value: 15, color: '#DB4437' },
];

const topCreatives = [
  { id: 1, name: 'TechStart Product Launch Video', ctr: 4.5, engagement: 12500, platform: 'Instagram' },
  { id: 2, name: 'Fashion Forward Winter Sale Banner', ctr: 3.8, engagement: 9800, platform: 'Facebook' },
  { id: 3, name: 'HealthPlus Awareness Carousel', ctr: 3.5, engagement: 8200, platform: 'Instagram' },
  { id: 4, name: 'EcoLiving Brand Story', ctr: 3.2, engagement: 7500, platform: 'LinkedIn' },
];

export default function Analytics() {
  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Performance insights and trends</p>
        </div>
        <select className="rounded-lg border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          <option>Last 30 days</option>
          <option>Last 90 days</option>
          <option>This year</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Reach"
          value="1.05M"
          change={18}
          changeLabel="vs last month"
          icon={<Target className="h-5 w-5" />}
        />
        <KPICard
          title="Total Leads"
          value="3,880"
          change={24}
          changeLabel="vs last month"
          icon={<Users className="h-5 w-5" />}
        />
        <KPICard
          title="Avg CTR"
          value="3.2%"
          change={8}
          changeLabel="improvement"
          icon={<MousePointer className="h-5 w-5" />}
        />
        <KPICard
          title="Cost per Lead"
          value="₹85"
          change={-12}
          changeLabel="reduction"
          icon={<DollarSign className="h-5 w-5" />}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Performance Over Time */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground mb-6">Performance Over Time</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(252, 100%, 69%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(252, 100%, 69%)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(215, 20%, 65%)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(215, 20%, 65%)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(222, 47%, 7%)', 
                    border: '1px solid hsl(217, 33%, 17%)',
                    borderRadius: '8px'
                  }}
                />
                <Area type="monotone" dataKey="reach" stroke="hsl(252, 100%, 69%)" strokeWidth={2} fill="url(#colorReach)" />
                <Area type="monotone" dataKey="leads" stroke="hsl(160, 84%, 39%)" strokeWidth={2} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Distribution */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground mb-6">Platform Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(222, 47%, 7%)', 
                    border: '1px solid hsl(217, 33%, 17%)',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Performing Creatives */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border p-4">
          <h3 className="font-semibold text-foreground">Top Performing Creatives</h3>
        </div>
        <div className="divide-y divide-border">
          {topCreatives.map((creative, index) => (
            <div key={creative.id} className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors">
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-foreground">{creative.name}</p>
                  <p className="text-sm text-muted-foreground">{creative.platform}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="font-medium text-foreground">{creative.ctr}%</p>
                  <p className="text-xs text-muted-foreground">CTR</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">{creative.engagement.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Engagement</p>
                </div>
                <Badge variant="approved">Top Performer</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

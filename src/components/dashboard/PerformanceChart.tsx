import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', tasks: 12, approved: 10 },
  { name: 'Tue', tasks: 15, approved: 13 },
  { name: 'Wed', tasks: 18, approved: 15 },
  { name: 'Thu', tasks: 14, approved: 12 },
  { name: 'Fri', tasks: 20, approved: 18 },
  { name: 'Sat', tasks: 8, approved: 7 },
  { name: 'Sun', tasks: 5, approved: 5 },
];

export function PerformanceChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-6">
        <h3 className="font-semibold text-foreground">Weekly Performance</h3>
        <p className="text-sm text-muted-foreground mt-1">Tasks completed vs approved</p>
      </div>
      
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(252, 100%, 69%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(252, 100%, 69%)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="hsl(215, 20%, 65%)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(215, 20%, 65%)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(222, 47%, 7%)', 
                border: '1px solid hsl(217, 33%, 17%)',
                borderRadius: '8px',
                color: 'hsl(210, 40%, 98%)'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="tasks" 
              stroke="hsl(252, 100%, 69%)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorTasks)" 
            />
            <Area 
              type="monotone" 
              dataKey="approved" 
              stroke="hsl(160, 84%, 39%)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorApproved)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary" />
          <span className="text-sm text-muted-foreground">Tasks Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-emerald-500" />
          <span className="text-sm text-muted-foreground">Approved</span>
        </div>
      </div>
    </div>
  );
}

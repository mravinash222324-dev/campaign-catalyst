import { useState } from 'react';
import { Search, Filter, LayoutGrid, List, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TaskCard } from '@/components/dashboard/TaskCard';
import { mockTasks } from '@/lib/mock-data';
import { TaskStatus } from '@/types';
import { cn } from '@/lib/utils';

const columns: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'pending', label: 'To Do', color: 'bg-amber-500' },
  { id: 'in_progress', label: 'In Progress', color: 'bg-blue-500' },
  { id: 'review', label: 'In Review', color: 'bg-purple-500' },
  { id: 'approved', label: 'Approved', color: 'bg-emerald-500' },
];

export default function Tasks() {
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');

  const getTasksByStatus = (status: TaskStatus) => {
    return mockTasks.filter(task => task.status === status);
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage and track your assigned work</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
          <button
            onClick={() => setView('kanban')}
            className={cn(
              "p-2 rounded-md transition-colors",
              view === 'kanban' ? "bg-background shadow-sm" : "hover:bg-background/50"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView('list')}
            className={cn(
              "p-2 rounded-md transition-colors",
              view === 'list' ? "bg-background shadow-sm" : "hover:bg-background/50"
            )}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      {view === 'kanban' && (
        <div className="grid grid-cols-4 gap-4">
          {columns.map(column => {
            const tasks = getTasksByStatus(column.id);
            
            return (
              <div key={column.id} className="space-y-3">
                {/* Column Header */}
                <div className="flex items-center gap-2 p-2">
                  <div className={cn("h-2 w-2 rounded-full", column.color)} />
                  <h3 className="font-medium text-foreground">{column.label}</h3>
                  <Badge variant="secondary" className="ml-auto">
                    {tasks.length}
                  </Badge>
                </div>

                {/* Column Content */}
                <div className="space-y-3 min-h-[400px] rounded-xl bg-muted/30 p-3">
                  {tasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                  
                  {tasks.length === 0 && (
                    <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-border">
                      <p className="text-sm text-muted-foreground">No tasks</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Task</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Priority</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Deadline</th>
              </tr>
            </thead>
            <tbody>
              {mockTasks.map(task => (
                <tr key={task.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <p className="font-medium text-foreground">Task #{task.id}</p>
                    <p className="text-sm text-muted-foreground">Brief #{task.briefId}</p>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline">{task.type}</Badge>
                  </td>
                  <td className="p-4">
                    <Badge variant={task.status.replace('_', '-') as any}>
                      {task.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge variant={task.priority as any}>{task.priority}</Badge>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {new Date(task.deadline).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

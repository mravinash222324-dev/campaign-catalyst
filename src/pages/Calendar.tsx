import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Loader2 } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useClients } from '@/hooks/useClients';
import { useBriefs } from '@/hooks/useBriefs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type PriorityLevel = Database['public']['Enums']['priority_level'];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [clientId, setClientId] = useState('');
  const [title, setTitle] = useState('');
  const [objective, setObjective] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('normal');
  const [budget, setBudget] = useState('');

  const { clients, isLoading: clientsLoading } = useClients();
  const { briefs, isLoading: briefsLoading, createBrief } = useBriefs();
  const { toast } = useToast();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPadding = monthStart.getDay();
  const paddedDays = [...Array(startPadding).fill(null), ...days];

  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getBriefsForDay = (date: Date) => {
    return briefs.filter(brief => 
      isSameDay(new Date(brief.deadline), date)
    );
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setIsDialogOpen(true);
  };

  const handleCreateBrief = async () => {
    if (!clientId || !title || !objective || !selectedDate) {
      toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      await createBrief.mutateAsync({
        client_id: clientId,
        title,
        objective,
        priority,
        budget: budget ? parseFloat(budget) : null,
        deadline: selectedDate.toISOString(),
        platforms: [],
      });
      
      setIsDialogOpen(false);
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setClientId('');
    setTitle('');
    setObjective('');
    setPriority('normal');
    setBudget('');
  };

  if (clientsLoading || briefsLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Content Calendar</h1>
          <p className="text-muted-foreground mt-1">Plan and schedule your campaigns</p>
        </div>
        <Button className="gap-2" onClick={() => { setSelectedDate(new Date()); setIsDialogOpen(true); }}>
          <Plus className="h-4 w-4" />
          New Brief
        </Button>
      </div>

      {/* Calendar */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Calendar Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-semibold text-foreground">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-2">
            <button onClick={goToPrevMonth} className="p-2 rounded-lg hover:bg-muted transition-colors">
              <ChevronLeft className="h-5 w-5 text-muted-foreground" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              Today
            </button>
            <button onClick={goToNextMonth} className="p-2 rounded-lg hover:bg-muted transition-colors">
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 border-b border-border">
          {WEEKDAYS.map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {paddedDays.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="min-h-[120px] border-b border-r border-border bg-muted/20" />;
            }

            const briefsForDay = getBriefsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isCurrentDay = isToday(day);

            return (
              <div
                key={day.toISOString()}
                onClick={() => handleDayClick(day)}
                className={cn(
                  "min-h-[120px] border-b border-r border-border p-2 cursor-pointer transition-colors hover:bg-muted/30",
                  !isCurrentMonth && "bg-muted/10 text-muted-foreground",
                  isCurrentDay && "bg-primary/5"
                )}
              >
                <div className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium",
                  isCurrentDay && "bg-primary text-primary-foreground"
                )}>
                  {format(day, 'd')}
                </div>
                
                <div className="mt-1 space-y-1">
                  {briefsForDay.slice(0, 2).map(brief => (
                    <div
                      key={brief.id}
                      className={cn(
                        "px-2 py-1 rounded text-xs font-medium truncate",
                        brief.priority === 'critical' && "bg-red-500/20 text-red-500",
                        brief.priority === 'high' && "bg-orange-500/20 text-orange-500",
                        brief.priority === 'normal' && "bg-blue-500/20 text-blue-500",
                        brief.priority === 'low' && "bg-emerald-500/20 text-emerald-500"
                      )}
                    >
                      {brief.clients?.name}: {brief.title}
                    </div>
                  ))}
                  {briefsForDay.length > 2 && (
                    <div className="text-xs text-muted-foreground px-2">
                      +{briefsForDay.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Brief Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Brief</DialogTitle>
            <DialogDescription>
              {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client *</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Campaign Title *</Label>
              <Input 
                id="title" 
                placeholder="Enter campaign title" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="objective">Objective *</Label>
              <Textarea 
                id="objective" 
                placeholder="Describe the campaign objective"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as PriorityLevel)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget (₹)</Label>
                <Input 
                  id="budget" 
                  type="number" 
                  placeholder="0"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateBrief} disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Brief'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

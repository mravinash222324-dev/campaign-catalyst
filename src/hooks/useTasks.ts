import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { Database } from '@/integrations/supabase/types';

type Task = Database['public']['Tables']['tasks']['Row'];
type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
type TaskStatus = Database['public']['Enums']['task_status'];

export function useTasks() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          briefs (id, title, client_id, clients (id, name))
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    const channel = supabase
      .channel('tasks-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  const createTask = useMutation({
    mutationFn: async (task: TaskInsert) => {
      const { data, error } = await supabase.from('tasks').insert(task).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({ title: 'Task created' });
    },
    onError: (error) => { toast({ title: 'Error', description: error.message, variant: 'destructive' }); }
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Task>) => {
      const { data, error } = await supabase.from('tasks').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tasks'] }); },
    onError: (error) => { toast({ title: 'Error', description: error.message, variant: 'destructive' }); }
  });

  const updateTaskStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: TaskStatus }) => {
      const { data, error } = await supabase.from('tasks').update({ status }).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tasks'] }); },
    onError: (error) => { toast({ title: 'Error', description: error.message, variant: 'destructive' }); }
  });

  return { tasks, isLoading, error, createTask, updateTask, updateTaskStatus };
}

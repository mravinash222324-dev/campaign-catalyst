import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { Database } from '@/integrations/supabase/types';

type Brief = Database['public']['Tables']['briefs']['Row'];
type BriefInsert = Database['public']['Tables']['briefs']['Insert'];

export function useBriefs() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: briefs = [], isLoading, error } = useQuery({
    queryKey: ['briefs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('briefs')
        .select(`
          *,
          clients (id, name, industry)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('briefs-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'briefs' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['briefs'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const createBrief = useMutation({
    mutationFn: async (brief: Omit<BriefInsert, 'created_by'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('briefs')
        .insert({ ...brief, created_by: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['briefs'] });
      toast({ title: 'Brief created', description: 'New brief added successfully.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const updateBrief = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Brief>) => {
      const { data, error } = await supabase
        .from('briefs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['briefs'] });
      toast({ title: 'Brief updated', description: 'Brief details updated successfully.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  return { briefs, isLoading, error, createBrief, updateBrief };
}

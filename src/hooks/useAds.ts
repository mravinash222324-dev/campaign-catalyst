import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type Ad = Database['public']['Tables']['ads']['Row'];
type AdInsert = Database['public']['Tables']['ads']['Insert'];

export function useAds() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: ads = [], isLoading, error } = useQuery({
    queryKey: ['ads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ads')
        .select(`
          *,
          clients (id, name),
          briefs (id, title)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const createAd = useMutation({
    mutationFn: async (ad: AdInsert) => {
      const { data, error } = await supabase
        .from('ads')
        .insert(ad)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads'] });
      toast({ title: 'Ad created', description: 'New ad campaign added successfully.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const updateAd = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Ad>) => {
      const { data, error } = await supabase
        .from('ads')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads'] });
      toast({ title: 'Ad updated', description: 'Ad campaign updated successfully.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  return { ads, isLoading, error, createAd, updateAd };
}

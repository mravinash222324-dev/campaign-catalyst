import { useState } from 'react';
import { Search, Plus, Calendar, Wallet, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useClients } from '@/hooks/useClients';
import { useBriefs } from '@/hooks/useBriefs';
import { useAds } from '@/hooks/useAds';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function Clients() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { clients, isLoading, createClient } = useClients();
  const { briefs } = useBriefs();
  const { ads } = useAds();
  const { toast } = useToast();

  const getClientStats = (clientId: string) => {
    const clientBriefs = briefs.filter(b => b.client_id === clientId);
    const clientAds = ads.filter(a => a.client_id === clientId);
    const totalSpent = clientAds.reduce((sum, ad) => sum + Number(ad.spent || 0), 0);
    const totalLeads = clientAds.reduce((sum, ad) => sum + (ad.leads || 0), 0);
    
    return { briefs: clientBriefs.length, spent: totalSpent, leads: totalLeads };
  };

  const handleCreateClient = async () => {
    if (!name || !industry) {
      toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      await createClient.mutateAsync({
        name,
        industry,
        monthly_budget: monthlyBudget ? parseFloat(monthlyBudget) : 0,
      });
      
      setIsDialogOpen(false);
      setName('');
      setIndustry('');
      setMonthlyBudget('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredClients = searchQuery
    ? clients.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : clients;

  if (isLoading) {
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
          <h1 className="text-2xl font-bold text-foreground">Clients</h1>
          <p className="text-muted-foreground mt-1">Manage your client relationships</p>
        </div>
        <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Client
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search clients..." 
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Client Grid */}
      {filteredClients.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">No clients yet. Add your first client!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map(client => {
            const stats = getClientStats(client.id);
            
            return (
              <div 
                key={client.id}
                className="group rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:border-primary/30 hover:shadow-lg cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary text-xl font-bold group-hover:scale-110 transition-transform">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {client.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{client.industry}</p>
                    </div>
                  </div>
                  <Badge variant={client.is_active ? 'approved' : 'draft'}>
                    {client.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{stats.briefs}</p>
                    <p className="text-xs text-muted-foreground">Campaigns</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{stats.leads}</p>
                    <p className="text-xs text-muted-foreground">Leads</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">₹{(stats.spent / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-muted-foreground">Spent</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Wallet className="h-4 w-4" />
                    <span>₹{Number(client.monthly_budget).toLocaleString()}/mo</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Since {format(new Date(client.created_at), 'MMM yyyy')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Client Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Client Name *</Label>
              <Input 
                id="name" 
                placeholder="Enter client name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry *</Label>
              <Input 
                id="industry" 
                placeholder="e.g., Technology, Healthcare, Retail"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Monthly Budget (₹)</Label>
              <Input 
                id="budget" 
                type="number" 
                placeholder="0"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateClient} disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Add Client'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

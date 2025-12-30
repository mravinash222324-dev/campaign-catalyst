import { Search, Plus, Building2, Calendar, Wallet, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockClients, mockBriefs, mockAds } from '@/lib/mock-data';
import { format } from 'date-fns';

export default function Clients() {
  const getClientStats = (clientId: string) => {
    const briefs = mockBriefs.filter(b => b.clientId === clientId);
    const ads = mockAds.filter(a => a.clientId === clientId);
    const totalSpent = ads.reduce((sum, ad) => sum + ad.spent, 0);
    const totalLeads = ads.reduce((sum, ad) => sum + ad.leads, 0);
    
    return { briefs: briefs.length, spent: totalSpent, leads: totalLeads };
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clients</h1>
          <p className="text-muted-foreground mt-1">Manage your client relationships</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Client
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search clients..." className="pl-9" />
      </div>

      {/* Client Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockClients.map(client => {
          const stats = getClientStats(client.id);
          
          return (
            <div 
              key={client.id}
              className="group rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:border-primary/30 hover:shadow-lg cursor-pointer"
            >
              {/* Header */}
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
                <Badge variant="approved">Active</Badge>
              </div>

              {/* Stats */}
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

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Wallet className="h-4 w-4" />
                  <span>₹{client.monthlyBudget.toLocaleString()}/mo</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Since {format(client.createdAt, 'MMM yyyy')}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

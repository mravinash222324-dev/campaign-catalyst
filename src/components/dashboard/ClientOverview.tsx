import { TrendingUp, TrendingDown } from 'lucide-react';
import { mockClients, mockAds } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface ClientStats {
  id: string;
  name: string;
  budget: number;
  spent: number;
  leads: number;
  performance: number;
}

function getClientStats(): ClientStats[] {
  return mockClients.slice(0, 5).map(client => {
    const clientAds = mockAds.filter(ad => ad.clientId === client.id);
    const spent = clientAds.reduce((sum, ad) => sum + ad.spent, 0);
    const leads = clientAds.reduce((sum, ad) => sum + ad.leads, 0);
    const performance = Math.floor(Math.random() * 40) - 10; // Mock performance change
    
    return {
      id: client.id,
      name: client.name,
      budget: client.monthlyBudget,
      spent,
      leads,
      performance,
    };
  });
}

export function ClientOverview() {
  const clients = getClientStats();

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border p-4">
        <h3 className="font-semibold text-foreground">Client Overview</h3>
        <p className="text-sm text-muted-foreground mt-1">Budget utilization & performance</p>
      </div>
      
      <div className="divide-y divide-border">
        {clients.map((client) => {
          const utilization = Math.round((client.spent / client.budget) * 100);
          const isPositive = client.performance > 0;
          
          return (
            <div key={client.id} className="p-4 transition-colors hover:bg-muted/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary font-semibold">
                    {client.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{client.name}</p>
                    <p className="text-xs text-muted-foreground">{client.leads} leads</p>
                  </div>
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  isPositive ? "text-emerald-500" : "text-red-500"
                )}>
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {isPositive && '+'}{client.performance}%
                </div>
              </div>
              
              {/* Budget bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₹{client.spent.toLocaleString()} spent</span>
                  <span>₹{client.budget.toLocaleString()}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all",
                      utilization > 90 ? "bg-red-500" : utilization > 70 ? "bg-amber-500" : "bg-primary"
                    )}
                    style={{ width: `${Math.min(utilization, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

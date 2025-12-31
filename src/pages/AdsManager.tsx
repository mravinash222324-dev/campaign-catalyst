import { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users, Eye, MousePointer, AlertTriangle, Play, Pause, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KPICard } from '@/components/dashboard/KPICard';
import { useAds } from '@/hooks/useAds';
import { useClients } from '@/hooks/useClients';
import { cn } from '@/lib/utils';

const platformIcons: Record<string, string> = {
  facebook: '📘',
  instagram: '📸',
  linkedin: '💼',
  twitter: '🐦',
  google_ads: '🔍',
  youtube: '▶️',
};

export default function AdsManager() {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const { ads, isLoading: adsLoading, updateAd } = useAds();
  const { clients, isLoading: clientsLoading } = useClients();

  const isLoading = adsLoading || clientsLoading;

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredAds = selectedClient 
    ? ads.filter(ad => ad.client_id === selectedClient)
    : ads;

  const totalSpent = filteredAds.reduce((sum, ad) => sum + Number(ad.spent || 0), 0);
  const totalBudget = filteredAds.reduce((sum, ad) => sum + Number(ad.budget || 0), 0);
  const totalLeads = filteredAds.reduce((sum, ad) => sum + (ad.leads || 0), 0);
  const totalReach = filteredAds.reduce((sum, ad) => sum + (ad.reach || 0), 0);
  const avgCTR = filteredAds.length > 0 
    ? (filteredAds.reduce((sum, ad) => sum + Number(ad.ctr || 0), 0) / filteredAds.length).toFixed(2)
    : '0';

  const handleToggleStatus = async (adId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    await updateAd.mutateAsync({ id: adId, status: newStatus });
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ads Manager</h1>
          <p className="text-muted-foreground mt-1">Monitor and manage ad performance</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedClient || ''}
            onChange={(e) => setSelectedClient(e.target.value || null)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Clients</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
          <Button>Create Campaign</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <KPICard
          title="Total Spend"
          value={`₹${totalSpent.toLocaleString()}`}
          change={totalBudget > 0 ? -Math.round(((totalBudget - totalSpent) / totalBudget) * 100) : 0}
          changeLabel="under budget"
          icon={<DollarSign className="h-5 w-5" />}
        />
        <KPICard
          title="Remaining Budget"
          value={`₹${(totalBudget - totalSpent).toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5" />}
        />
        <KPICard
          title="Total Leads"
          value={totalLeads}
          change={24}
          changeLabel="vs last week"
          icon={<Users className="h-5 w-5" />}
        />
        <KPICard
          title="Total Reach"
          value={`${(totalReach / 1000).toFixed(0)}K`}
          change={18}
          icon={<Eye className="h-5 w-5" />}
        />
        <KPICard
          title="Avg CTR"
          value={`${avgCTR}%`}
          change={5}
          icon={<MousePointer className="h-5 w-5" />}
        />
      </div>

      {/* Budget Alert */}
      {filteredAds.some(ad => (Number(ad.spent) / Number(ad.budget)) > 0.9) && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <div className="flex-1">
            <p className="font-medium text-foreground">Budget Alert</p>
            <p className="text-sm text-muted-foreground">Some campaigns are nearing budget limit</p>
          </div>
          <Button variant="outline" size="sm">Review</Button>
        </div>
      )}

      {/* Ads Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="border-b border-border p-4">
          <h3 className="font-semibold text-foreground">Active Campaigns</h3>
        </div>
        
        {filteredAds.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No ad campaigns found. Create your first campaign!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Campaign</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Platform</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Type</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Budget</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Spent</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Leads</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Reach</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">CTR</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAds.map(ad => {
                  const client = clients.find(c => c.id === ad.client_id);
                  const utilization = Number(ad.budget) > 0 ? Math.round((Number(ad.spent) / Number(ad.budget)) * 100) : 0;
                  const ctr = Number(ad.ctr);
                  
                  return (
                    <tr key={ad.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                      <td className="p-4">
                        <p className="font-medium text-foreground">{client?.name || 'Unknown'}</p>
                        <p className="text-sm text-muted-foreground">{ad.briefs?.title || 'No brief'}</p>
                      </td>
                      <td className="p-4">
                        <span className="text-lg">{platformIcons[ad.platform] || '📱'}</span>
                        <span className="ml-2 text-sm capitalize">{ad.platform.replace('_', ' ')}</span>
                      </td>
                      <td className="p-4">
                        <Badge variant={ad.type === 'awareness' ? 'normal' : 'high'}>
                          {ad.type === 'awareness' ? 'Awareness' : 'Lead Gen'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <p className="font-medium">₹{Number(ad.budget).toLocaleString()}</p>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <p className="font-medium">₹{Number(ad.spent).toLocaleString()}</p>
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
                              <div 
                                className={cn(
                                  "h-full rounded-full",
                                  utilization > 90 ? "bg-red-500" : utilization > 70 ? "bg-amber-500" : "bg-primary"
                                )}
                                style={{ width: `${Math.min(utilization, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">{utilization}%</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-medium">{ad.leads}</p>
                        {ad.leads > 0 && (
                          <p className="text-xs text-muted-foreground">
                            ₹{Math.round(Number(ad.spent) / ad.leads)}/lead
                          </p>
                        )}
                      </td>
                      <td className="p-4">
                        <p className="font-medium">{((ad.reach || 0) / 1000).toFixed(1)}K</p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          {ctr > 3 ? (
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                          ) : ctr < 2 ? (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          ) : null}
                          <span className={cn(
                            "font-medium",
                            ctr > 3 && "text-emerald-500",
                            ctr < 2 && "text-red-500"
                          )}>
                            {ctr}%
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={ad.status === 'active' ? 'approved' : 'pending'}>
                          {ad.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleToggleStatus(ad.id, ad.status)}
                        >
                          {ad.status === 'active' ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

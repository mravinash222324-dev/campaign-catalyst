import { 
  LayoutDashboard, 
  Calendar, 
  CheckSquare, 
  Users, 
  TrendingUp, 
  Settings,
  LogOut,
  FileText,
  Megaphone,
  ClipboardCheck,
  MessageSquare,
  Target,
  PieChart,
  UserCircle
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { roleLabels } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types';

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', roles: ['admin', 'dm_manager', 'copywriter', 'copy_qc', 'designer', 'design_qc', 'client_coordinator', 'dm_team_lead'] },
  { label: 'Calendar', icon: Calendar, href: '/calendar', roles: ['admin', 'dm_manager'] },
  { label: 'Briefs', icon: FileText, href: '/briefs', roles: ['admin', 'dm_manager', 'copywriter', 'copy_qc', 'designer', 'design_qc'] },
  { label: 'Tasks', icon: CheckSquare, href: '/tasks', roles: ['admin', 'dm_manager', 'copywriter', 'copy_qc', 'designer', 'design_qc', 'client_coordinator'] },
  { label: 'QC Review', icon: ClipboardCheck, href: '/qc-review', roles: ['admin', 'copy_qc', 'design_qc'] },
  { label: 'Client Review', icon: MessageSquare, href: '/client-review', roles: ['admin', 'client_coordinator'] },
  { label: 'Ads Manager', icon: Megaphone, href: '/ads', roles: ['admin', 'dm_team_lead', 'dm_manager'] },
  { label: 'Campaigns', icon: Target, href: '/campaigns', roles: ['admin', 'dm_manager', 'dm_team_lead'] },
  { label: 'Analytics', icon: TrendingUp, href: '/analytics', roles: ['admin', 'dm_manager'] },
  { label: 'Performance', icon: PieChart, href: '/performance', roles: ['admin'] },
  { label: 'Clients', icon: Users, href: '/clients', roles: ['admin', 'dm_manager', 'client_coordinator'] },
  { label: 'Team', icon: UserCircle, href: '/team', roles: ['admin'] },
  { label: 'Settings', icon: Settings, href: '/settings', roles: ['admin', 'dm_manager'] },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const filteredNavItems = navItems.filter(item => item.roles.includes(user.role));

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Megaphone className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground">MarketFlow</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive && "text-primary")} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/50 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/60">{roleLabels[user.role]}</p>
            </div>
            <button
              onClick={logout}
              className="rounded-lg p-2 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Megaphone, ArrowRight, Shield, Zap, BarChart3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { roleLabels } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const roles: { role: UserRole; description: string }[] = [
  { role: 'admin', description: 'Full system access & analytics' },
  { role: 'dm_manager', description: 'Campaign planning & oversight' },
  { role: 'copywriter', description: 'Content creation tasks' },
  { role: 'copy_qc', description: 'Copy review & approval' },
  { role: 'designer', description: 'Visual design tasks' },
  { role: 'design_qc', description: 'Design review & approval' },
  { role: 'client_coordinator', description: 'Client communication' },
  { role: 'dm_team_lead', description: 'Ads & performance monitoring' },
];

const features = [
  { icon: Zap, title: 'Automated Workflows', description: 'Streamline your creative process' },
  { icon: Shield, title: 'Role-Based Access', description: 'Secure & organized team structure' },
  { icon: BarChart3, title: 'Real-time Analytics', description: 'Track performance at a glance' },
];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (selectedRole) {
      login(selectedRole);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }} />
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-purple-500/10" />
        
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Megaphone className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-sidebar-foreground">MarketFlow</span>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-sidebar-foreground leading-tight">
                Digital Marketing<br />
                <span className="gradient-text">Workflow Platform</span>
              </h1>
              <p className="mt-4 text-lg text-sidebar-foreground/70 max-w-md">
                Streamline your agency's creative process from brief to published campaign.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sidebar-foreground">{feature.title}</h3>
                    <p className="text-sm text-sidebar-foreground/60">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-sm text-sidebar-foreground/40">
            © 2024 MarketFlow. Enterprise Marketing Suite.
          </p>
        </div>
      </div>

      {/* Right Panel - Login */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Megaphone className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">MarketFlow</span>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-foreground">Select Your Role</h2>
            <p className="mt-2 text-muted-foreground">Choose a role to explore the dashboard</p>
          </div>

          {/* Role Selection */}
          <div className="grid gap-3">
            {roles.map(({ role, description }) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-200",
                  selectedRole === role
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border bg-card hover:border-primary/30 hover:bg-muted/30"
                )}
              >
                <div>
                  <p className="font-medium text-foreground">{roleLabels[role]}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
                </div>
                <div className={cn(
                  "h-5 w-5 rounded-full border-2 transition-all",
                  selectedRole === role
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/30"
                )}>
                  {selectedRole === role && (
                    <div className="h-full w-full flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={!selectedRole}
            className={cn(
              "w-full flex items-center justify-center gap-2 rounded-xl py-3.5 px-4 font-medium transition-all duration-200",
              selectedRole
                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            Continue to Dashboard
            <ArrowRight className="h-4 w-4" />
          </button>

          <p className="text-center text-xs text-muted-foreground">
            This is a demo. Select any role to explore the interface.
          </p>
        </div>
      </div>
    </div>
  );
}

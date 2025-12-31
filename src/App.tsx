import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import Tasks from "./pages/Tasks";
import AdsManager from "./pages/AdsManager";
import Clients from "./pages/Clients";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return null;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/calendar" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Calendar />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tasks" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Tasks />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/briefs" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Tasks />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/qc-review" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Tasks />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/client-review" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Tasks />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/ads" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <AdsManager />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/campaigns" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <AdsManager />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/analytics" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Analytics />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/performance" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Analytics />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/clients" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Clients />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/team" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Clients />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="dark">
            <AppRoutes />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

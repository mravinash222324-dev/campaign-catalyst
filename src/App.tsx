import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import Tasks from "./pages/Tasks";
import AdsManager from "./pages/AdsManager";
import Clients from "./pages/Clients";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
      />
      <Route 
        path="/dashboard" 
        element={
          <AppLayout>
            <Dashboard />
          </AppLayout>
        } 
      />
      <Route 
        path="/calendar" 
        element={
          <AppLayout>
            <Calendar />
          </AppLayout>
        } 
      />
      <Route 
        path="/tasks" 
        element={
          <AppLayout>
            <Tasks />
          </AppLayout>
        } 
      />
      <Route 
        path="/briefs" 
        element={
          <AppLayout>
            <Tasks />
          </AppLayout>
        } 
      />
      <Route 
        path="/qc-review" 
        element={
          <AppLayout>
            <Tasks />
          </AppLayout>
        } 
      />
      <Route 
        path="/client-review" 
        element={
          <AppLayout>
            <Tasks />
          </AppLayout>
        } 
      />
      <Route 
        path="/ads" 
        element={
          <AppLayout>
            <AdsManager />
          </AppLayout>
        } 
      />
      <Route 
        path="/campaigns" 
        element={
          <AppLayout>
            <AdsManager />
          </AppLayout>
        } 
      />
      <Route 
        path="/analytics" 
        element={
          <AppLayout>
            <Analytics />
          </AppLayout>
        } 
      />
      <Route 
        path="/performance" 
        element={
          <AppLayout>
            <Analytics />
          </AppLayout>
        } 
      />
      <Route 
        path="/clients" 
        element={
          <AppLayout>
            <Clients />
          </AppLayout>
        } 
      />
      <Route 
        path="/team" 
        element={
          <AppLayout>
            <Clients />
          </AppLayout>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <AppLayout>
            <Dashboard />
          </AppLayout>
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

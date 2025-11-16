import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminAuthProvider, useAdminAuth } from "@/contexts/AdminAuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import CreateAdmin from "./pages/admin/CreateAdmin";
import AffiliateTracking from "./pages/admin/AffiliateTracking";
import CouponManagement from "./pages/admin/CouponManagement";
import SubscriptionPlans from "./pages/admin/SubscriptionPlans";
import ThemeControl from "./pages/admin/ThemeControl";
import SystemLogs from "./pages/admin/SystemLogs";
import Recipes from "./pages/admin/Recipes";
import Billing from "./pages/admin/Billing";
import Customization from "./pages/admin/Customization";
import Notifications from "./pages/admin/Notifications";
import Settings from "./pages/admin/Settings";
import Support from "./pages/admin/Support";
import MealPlans from "./pages/admin/MealPlans";

import Reviews from "./pages/admin/Reviews";
import Analytics from "./pages/admin/Analytics";
import EmailTemplates from "./pages/admin/EmailTemplates";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAdminAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const SuperAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { admin, isAuthenticated, isLoading } = useAdminAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (admin?.role !== 'super_admin') {
    return <Navigate to="/admin" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AdminAuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="create-admin" element={<SuperAdminRoute><CreateAdmin /></SuperAdminRoute>} />
            <Route path="affiliate-tracking" element={<AffiliateTracking />} />
            <Route path="coupons" element={<CouponManagement />} />
            <Route path="subscription-plans" element={<SubscriptionPlans />} />
            <Route path="theme-control" element={<ThemeControl />} />
            <Route path="system-logs" element={<SuperAdminRoute><SystemLogs /></SuperAdminRoute>} />
            <Route path="recipes" element={<Recipes />} />
            <Route path="meal-plans" element={<MealPlans />} />

            <Route path="reviews" element={<Reviews />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="billing" element={<Billing />} />
            <Route path="email-templates" element={<EmailTemplates />} />
            <Route path="customization" element={<Customization />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
            <Route path="support" element={<Support />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </AdminAuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

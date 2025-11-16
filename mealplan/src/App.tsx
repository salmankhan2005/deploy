import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { SavedRecipesProvider } from "@/contexts/SavedRecipesContext";
import { ReviewsProvider } from "@/contexts/ReviewsContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { RecipeProvider } from "@/contexts/RecipeContext";
import { MealPlanProvider } from "@/contexts/MealPlanContext";
import { UserDataProvider } from "@/contexts/UserDataContext";
import { TourProvider } from "@/contexts/TourContext";
import { ThemeProvider } from "next-themes";

// Critical pages - loaded immediately
import { Splash } from "./pages/Splash";
import { Auth } from "./pages/Auth";
import { Home } from "./pages/Home";

// Lazy loaded pages
const Onboarding = lazy(() => import("./pages/Onboarding").then(m => ({ default: m.Onboarding })));
const Recipes = lazy(() => import("./pages/Recipes").then(m => ({ default: m.Recipes })));
const Discover = lazy(() => import("./pages/Discover").then(m => ({ default: m.Discover })));
const RecipeDetail = lazy(() => import("./pages/RecipeDetail").then(m => ({ default: m.RecipeDetail })));
const RecipeBuilder = lazy(() => import("./pages/RecipeBuilder").then(m => ({ default: m.RecipeBuilder })));
const Shopping = lazy(() => import("./pages/Shopping").then(m => ({ default: m.Shopping })));
const More = lazy(() => import("./pages/More").then(m => ({ default: m.More })));
const Profile = lazy(() => import("./pages/Profile").then(m => ({ default: m.Profile })));
const Settings = lazy(() => import("./pages/Settings").then(m => ({ default: m.Settings })));
const Premium = lazy(() => import("./pages/Premium").then(m => ({ default: m.Premium })));
const Notifications = lazy(() => import("./pages/Notifications").then(m => ({ default: m.Notifications })));
const Help = lazy(() => import("./pages/Help").then(m => ({ default: m.Help })));
const MealSharing = lazy(() => import("./pages/MealSharing").then(m => ({ default: m.MealSharing })));
const ClientView = lazy(() => import("./pages/ClientView").then(m => ({ default: m.ClientView })));
const Billing = lazy(() => import("./pages/Billing").then(m => ({ default: m.Billing })));
const Analytics = lazy(() => import("./pages/Analytics").then(m => ({ default: m.Analytics })));
const Support = lazy(() => import("./pages/Support").then(m => ({ default: m.Support })));
const Feedback = lazy(() => import("./pages/Feedback").then(m => ({ default: m.Feedback })));
const EmailSettings = lazy(() => import("./pages/EmailSettings").then(m => ({ default: m.EmailSettings })));
const AdminNotifications = lazy(() => import("./pages/AdminNotifications").then(m => ({ default: m.AdminNotifications })));
const MealPlanTemplates = lazy(() => import("./pages/MealPlanTemplates"));
const EditMeal = lazy(() => import("./pages/EditMeal").then(m => ({ default: m.EditMeal })));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
      refetchOnWindowFocus: false,
      retry: 1,
      refetchOnReconnect: false,
    },
  },
});

const LoadingSpinner = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isGuest, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!isAuthenticated && !isGuest) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/auth" element={<Auth />} />
      
      {/* Protected Routes with Suspense */}
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/onboarding" element={<Suspense fallback={<LoadingSpinner />}><Onboarding /></Suspense>} />
      <Route path="/recipes" element={<ProtectedRoute><Suspense fallback={<LoadingSpinner />}><Recipes /></Suspense></ProtectedRoute>} />
      <Route path="/discover" element={<ProtectedRoute><Suspense fallback={<LoadingSpinner />}><Discover /></Suspense></ProtectedRoute>} />
      <Route path="/recipe/:id" element={<ProtectedRoute><Suspense fallback={<LoadingSpinner />}><RecipeDetail /></Suspense></ProtectedRoute>} />
      <Route path="/recipe-builder" element={<ProtectedRoute><Suspense fallback={<LoadingSpinner />}><RecipeBuilder /></Suspense></ProtectedRoute>} />
      <Route path="/shopping" element={<ProtectedRoute><Suspense fallback={<LoadingSpinner />}><Shopping /></Suspense></ProtectedRoute>} />
      <Route path="/more" element={<ProtectedRoute><Suspense fallback={<LoadingSpinner />}><More /></Suspense></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Suspense fallback={<LoadingSpinner />}><Profile /></Suspense></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Suspense fallback={<LoadingSpinner />}><Settings /></Suspense></ProtectedRoute>} />
      <Route path="/premium" element={<ProtectedRoute><Suspense fallback={<LoadingSpinner />}><Premium /></Suspense></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Suspense fallback={<LoadingSpinner />}><Notifications /></Suspense></ProtectedRoute>} />
      <Route path="/help" element={<ProtectedRoute><Suspense fallback={<LoadingSpinner />}><Help /></Suspense></ProtectedRoute>} />
      <Route path="/feedback" element={<ProtectedRoute><Suspense fallback={<LoadingSpinner />}><Feedback /></Suspense></ProtectedRoute>} />
      <Route path="/support" element={<ProtectedRoute><Suspense fallback={<LoadingSpinner />}><Support /></Suspense></ProtectedRoute>} />
      <Route path="/billing" element={<ProtectedRoute><Suspense fallback={<LoadingSpinner />}><Billing /></Suspense></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Suspense fallback={<LoadingSpinner />}><Analytics /></Suspense></ProtectedRoute>} />
      <Route path="/email-settings" element={<ProtectedRoute><Suspense fallback={<LoadingSpinner />}><EmailSettings /></Suspense></ProtectedRoute>} />
      <Route path="/admin-notifications" element={<ProtectedRoute><Suspense fallback={<LoadingSpinner />}><AdminNotifications /></Suspense></ProtectedRoute>} />
      <Route path="/meal-sharing" element={<ProtectedRoute><Suspense fallback={<LoadingSpinner />}><MealSharing /></Suspense></ProtectedRoute>} />
      <Route path="/client-view" element={<ProtectedRoute><Suspense fallback={<LoadingSpinner />}><ClientView /></Suspense></ProtectedRoute>} />
      <Route path="/meal-plan-templates" element={<ProtectedRoute><Suspense fallback={<LoadingSpinner />}><MealPlanTemplates /></Suspense></ProtectedRoute>} />
      <Route path="/edit-meal" element={<ProtectedRoute><Suspense fallback={<LoadingSpinner />}><EditMeal /></Suspense></ProtectedRoute>} />

      
      <Route path="*" element={<Suspense fallback={<LoadingSpinner />}><NotFound /></Suspense>} />
    </Routes>
  );
};

const App = () => {
  // Set viewport meta tag for proper mobile rendering and handle back button
  React.useEffect(() => {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover';
      document.head.appendChild(meta);
    }

    // Web-only configuration - no Capacitor needed
  }, []);

  // Notification system for 2-hour inactivity
  React.useEffect(() => {
    let notificationTimeout: NodeJS.Timeout;
    let lastActivity = Date.now();

    const scheduleNotification = () => {
      clearTimeout(notificationTimeout);
      notificationTimeout = setTimeout(() => {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Meal Plan Reminder', {
            body: "Don't forget to plan your meals for next week!",
            icon: '/favicon.ico',
            badge: '/favicon.ico'
          });
        }
      }, 2 * 60 * 60 * 1000); // 2 hours
    };

    const resetTimer = () => {
      lastActivity = Date.now();
      scheduleNotification();
    };

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, resetTimer, true);
    });

    // Initial schedule
    scheduleNotification();

    return () => {
      clearTimeout(notificationTimeout);
      events.forEach(event => {
        document.removeEventListener(event, resetTimer, true);
      });
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider 
        attribute="class" 
        defaultTheme="light" 
        storageKey="meal-planner-theme"
        enableSystem={false}
        themes={[
          'light', 
          'dark', 
          'comic', 
          'comic-dark', 
          'clean-minimalist', 
          'clean-minimalist-dark',
          'cozy-rustic',
          'cozy-rustic-dark',
          'vibrant-healthy',
          'vibrant-healthy-dark',
          'gourmet-elegant',
          'gourmet-elegant-dark',
          'playful-fun',
          'playful-fun-dark',
          'morning-dew'
        ]}
      >
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <TourProvider>
                <UserDataProvider>
                  <RecipeProvider>
                    <SavedRecipesProvider>
                      <ReviewsProvider>
                        <NotificationProvider>
                          <MealPlanProvider>
                          <div className="min-h-screen bg-background text-foreground antialiased">
                            <div className="animate-fade-in">
                              <AppRoutes />
                            </div>
                          </div>
                          </MealPlanProvider>
                        </NotificationProvider>
                      </ReviewsProvider>
                    </SavedRecipesProvider>
                  </RecipeProvider>
                </UserDataProvider>
              </TourProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;

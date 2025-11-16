import { Outlet, useNavigate, NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ChefHat,
  CreditCard,
  Palette,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  Calendar,
  Tags,
  Star,
  Mail,
  BarChart3,
  UserPlus,
  TrendingUp,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: ChefHat, label: "Recipes", path: "/admin/recipes" },
  { icon: Calendar, label: "Meal Plans", path: "/admin/meal-plans" },

  { icon: Star, label: "Reviews", path: "/admin/reviews" },
  { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
  { icon: TrendingUp, label: "Coupons", path: "/admin/coupons" },
  { icon: UserPlus, label: "Affiliate Tracking", path: "/admin/affiliate-tracking" },
  { icon: Palette, label: "Theme Control", path: "/admin/theme-control" },
  { icon: UserPlus, label: "Create Admin", path: "/admin/create-admin", superAdminOnly: true },
  { icon: CreditCard, label: "Subscription Plans", path: "/admin/subscription-plans" },
  { icon: CreditCard, label: "Billing", path: "/admin/billing" },
  { icon: Mail, label: "Email Templates", path: "/admin/email-templates" },
  { icon: Palette, label: "Customization", path: "/admin/customization" },
  { icon: Bell, label: "Notifications", path: "/admin/notifications" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
  { icon: FileText, label: "System Logs", path: "/admin/system-logs", superAdminOnly: true },
  { icon: HelpCircle, label: "Support", path: "/admin/support" },
];

function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();
  const { admin } = useAdminAuth();

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated");
    navigate("/login");
  };

  // Filter menu items based on admin role
  const filteredMenuItems = menuItems.filter(item => {
    if (item.superAdminOnly) {
      return admin?.role === 'super_admin';
    }
    return true;
  });

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <ChefHat className="h-5 w-5 text-primary" />
          </div>
          {state === "expanded" && (
            <div className="flex flex-col">
              <span className="text-base font-heading font-bold leading-tight">Meal Planner</span>
              <span className="text-xs text-muted-foreground">Admin Panel</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => {
                const isActive = item.path === "/admin" 
                  ? location.pathname === "/admin"
                  : location.pathname.startsWith(item.path);
                
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                      <NavLink to={item.path} end={item.path === "/admin"}>
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

const AdminLayout = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <main className="flex-1 w-full overflow-x-hidden">
          {/* Mobile header with trigger */}
          <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:hidden">
            <SidebarTrigger />
            <h2 className="text-lg font-heading font-semibold truncate">Meal Planner</h2>
          </header>

          {/* Desktop trigger */}
          <div className="hidden lg:flex items-center h-14 border-b px-4 bg-background">
            <SidebarTrigger />
          </div>

          {/* Page content with responsive padding */}
          <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-[100vw]">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;

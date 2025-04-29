
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthGuard from "@/components/AuthGuard";

// Layouts
import AppLayout from "@/components/AppLayout";
import AuthLayout from "@/components/AuthLayout";

// Auth Pages
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

// App Pages
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import Unauthorized from "@/pages/Unauthorized";
import ComingSoon from "@/pages/ComingSoon";

// Product Management Pages
import Categories from "@/pages/product/Categories";
import Units from "@/pages/product/Units";
import Products from "@/pages/product/Products";
import POS from "@/pages/POS";

// Feature Pages
import LoyaltyProgram from "@/pages/LoyaltyProgram";
import Inventory from "@/pages/Inventory";
import Customers from "@/pages/Customers";
import Expenses from "@/pages/Expenses";
import Billing from "@/pages/Billing";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Redirect root to login page */}
            <Route path="/" element={<Navigate to="/auth/login" replace />} />

            {/* Auth routes */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              {/* Add other auth routes like forgot password, reset password, etc. */}
            </Route>

            {/* Protected app routes with authentication guard */}
            <Route element={<AuthGuard><AppLayout /></AuthGuard>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              
              {/* Product Management */}
              <Route path="/products/categories" element={<Categories />} />
              <Route path="/products/units" element={<Units />} />
              <Route path="/products" element={<Products />} />
              
              {/* Main features */}
              <Route path="/pos" element={<POS />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/loyalty" element={<LoyaltyProgram />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Utility routes */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

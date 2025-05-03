
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Products from "./pages/product/Products";
import Categories from "./pages/product/Categories";
import Units from "./pages/product/Units";
import AppLayout from "./components/AppLayout";
import AuthLayout from "./components/AuthLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Unauthorized from "./pages/Unauthorized";
import POS from "./pages/POS";
import Profile from "./pages/Profile";
import Inventory from "./pages/Inventory";
import Customers from "./pages/Customers";
import LoyaltyProgram from "./pages/LoyaltyProgram";
import Expenses from "./pages/Expenses";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Billing from "./pages/Billing";
import AuthGuard from "./components/AuthGuard";
import { Toaster } from "@/components/ui/sonner";
import ComingSoon from "./pages/ComingSoon";
import { AuthProvider } from "@/contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          
          {/* Auth routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="unauthorized" element={<Unauthorized />} />
          </Route>
          
          {/* Protected routes */}
          <Route element={<AuthGuard />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/categories" element={<Categories />} />
              <Route path="/products/units" element={<Units />} />
              <Route path="/pos" element={<POS />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/loyalty" element={<LoyaltyProgram />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/coming-soon" element={<ComingSoon />} />
            </Route>
          </Route>

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;

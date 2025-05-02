
import { useEffect } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface AuthGuardProps {
  children?: React.ReactNode;
  requiredRole?: "owner" | "warehouse_admin" | "cashier" | null;
}

const AuthGuard = ({ children, requiredRole = null }: AuthGuardProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      // If no user and not on public routes, redirect to login
      if (!user && !location.pathname.includes("/auth/")) {
        navigate("/auth/login", { state: { from: location.pathname } });
        return;
      }

      // If logged in user tries to access auth pages, redirect to dashboard
      if (user && location.pathname.includes("/auth/")) {
        navigate("/dashboard");
        return;
      }

      // Role-based access control
      if (
        user &&
        requiredRole &&
        user.role !== requiredRole &&
        user.role !== "owner"
      ) {
        // Owner has access to everything, otherwise check specific role
        navigate("/unauthorized");
        return;
      }
    }
  }, [user, isLoading, location.pathname, navigate, requiredRole]);

  // Show blank page while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-t-retailayu-purple rounded-full animate-spin"></div>
      </div>
    );
  }

  // Using Outlet to render child routes
  return children || <Outlet />;
};

export default AuthGuard;

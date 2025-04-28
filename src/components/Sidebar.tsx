
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  BarChart,
  ShoppingBag,
  Package,
  Users,
  FileInput,
  Receipt,
  CreditCard,
  ShoppingCart,
  Settings,
  ChartBarIcon,
  BadgePlus,
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarLink = ({
  to,
  icon: Icon,
  label,
  active,
  onClick,
}: SidebarLinkProps) => (
  <Link
    to={to}
    className={cn(
      "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors",
      active
        ? "bg-retailayu-soft-gray text-retailayu-purple"
        : "text-foreground/70 hover:bg-accent hover:text-foreground"
    )}
    onClick={onClick}
  >
    <Icon className="h-5 w-5 mr-3" />
    <span>{label}</span>
    {active && (
      <div className="ml-auto w-1.5 h-6 bg-retailayu-purple rounded-full"></div>
    )}
  </Link>
);

const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname.startsWith(path);

  // Close sidebar on mobile when clicking a link
  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setOpen(false);
    }
  };

  // Define which links are visible based on user role
  const canViewProducts = ["owner", "warehouse_admin", "cashier"].includes(
    user?.role || ""
  );
  const canViewPOS = ["owner", "cashier"].includes(user?.role || "");
  const canViewInventory = ["owner", "warehouse_admin"].includes(
    user?.role || ""
  );
  const canViewCustomers = ["owner", "cashier"].includes(user?.role || "");
  const canViewBilling = ["owner", "cashier"].includes(user?.role || "");
  const canViewExpenses = ["owner"].includes(user?.role || "");
  const canViewReports = ["owner"].includes(user?.role || "");
  const canViewLoyalty = ["owner", "cashier"].includes(user?.role || "");
  const canViewSettings = ["owner"].includes(user?.role || "");

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out lg:relative lg:z-0 lg:shadow-none",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-16 py-4 border-b">
          <Link
            to="/dashboard"
            className="flex items-center gap-2"
            onClick={handleLinkClick}
          >
            <h1 className="text-xl font-bold text-retailayu-purple">
              RetailAyu
            </h1>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            <SidebarLink
              to="/dashboard"
              icon={BarChart}
              label="Dashboard"
              active={isActive("/dashboard")}
              onClick={handleLinkClick}
            />

            {canViewProducts && (
              <SidebarLink
                to="/products"
                icon={ShoppingBag}
                label="Products"
                active={isActive("/products")}
                onClick={handleLinkClick}
              />
            )}

            {canViewPOS && (
              <SidebarLink
                to="/pos"
                icon={ShoppingCart}
                label="Point of Sale"
                active={isActive("/pos")}
                onClick={handleLinkClick}
              />
            )}

            {canViewInventory && (
              <SidebarLink
                to="/inventory"
                icon={Package}
                label="Inventory"
                active={isActive("/inventory")}
                onClick={handleLinkClick}
              />
            )}

            {canViewCustomers && (
              <SidebarLink
                to="/customers"
                icon={Users}
                label="Customers"
                active={isActive("/customers")}
                onClick={handleLinkClick}
              />
            )}

            {canViewBilling && (
              <SidebarLink
                to="/billing"
                icon={CreditCard}
                label="Billing"
                active={isActive("/billing")}
                onClick={handleLinkClick}
              />
            )}

            {canViewExpenses && (
              <SidebarLink
                to="/expenses"
                icon={FileInput}
                label="Expenses"
                active={isActive("/expenses")}
                onClick={handleLinkClick}
              />
            )}

            {canViewReports && (
              <SidebarLink
                to="/reports"
                icon={ChartBarIcon}
                label="Reports"
                active={isActive("/reports")}
                onClick={handleLinkClick}
              />
            )}

            {canViewLoyalty && (
              <SidebarLink
                to="/loyalty"
                icon={BadgePlus}
                label="Loyalty Program"
                active={isActive("/loyalty")}
                onClick={handleLinkClick}
              />
            )}

            {canViewSettings && (
              <SidebarLink
                to="/settings"
                icon={Settings}
                label="Settings"
                active={isActive("/settings")}
                onClick={handleLinkClick}
              />
            )}
          </div>
        </nav>

        {/* User info */}
        <div className="p-4 border-t">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-retailayu-purple text-white flex items-center justify-center">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.role.replace("_", " ")}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ShoppingCart, Package, Users, CreditCard, Truck, PieChart as PieChartIcon, Clipboard } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import MetricCard from "@/components/dashboard/MetricCard";
import HourlySalesChart from "@/components/dashboard/HourlySalesChart";
import UserCounter from "@/components/dashboard/UserCounter";
import CustomerChat from "@/components/dashboard/CustomerChat";

// Sample data
const recentSalesData = [
  { name: "Mon", sales: 4000 },
  { name: "Tue", sales: 3000 },
  { name: "Wed", sales: 5000 },
  { name: "Thu", sales: 2780 },
  { name: "Fri", sales: 1890 },
  { name: "Sat", sales: 6390 },
  { name: "Sun", sales: 3490 },
];

const inventoryStatusData = [
  { name: "In Stock", value: 240, color: "#7E69AB" },
  { name: "Low Stock", value: 35, color: "#F7B538" },
  { name: "Out of Stock", value: 15, color: "#EA384C" },
];

const salesByHourData = [
  { time: "8AM", sales: 1200 },
  { time: "10AM", sales: 1800 },
  { time: "12PM", sales: 2400 },
  { time: "2PM", sales: 1800 },
  { time: "4PM", sales: 2200 },
  { time: "6PM", sales: 2600 },
  { time: "8PM", sales: 1800 },
];

// Display a summary card for key metrics
const SummaryCard = ({
  title,
  value,
  icon: Icon,
  change,
  changeType,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  change: string;
  changeType: "increase" | "decrease" | "neutral";
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            changeType === "increase"
              ? "bg-green-100 text-green-600"
              : changeType === "decrease"
              ? "bg-red-100 text-red-600"
              : "bg-blue-100 text-blue-600"
          }`}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div
        className={`mt-4 text-sm ${
          changeType === "increase"
            ? "text-green-600"
            : changeType === "decrease"
            ? "text-red-600"
            : "text-blue-600"
        }`}
      >
        {change}
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { user } = useAuth();
  const userRole = user?.role || "cashier";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex space-x-2">
          <Button asChild>
            <Link to="/pos" className="retailayu-gradient">
              <ShoppingCart className="mr-2 h-4 w-4" />
              <span>POS</span>
            </Link>
          </Button>
          {userRole === "owner" && (
            <Button variant="outline">Generate Reports</Button>
          )}
        </div>
      </div>

      {/* Summary cards - now using MetricCard component for consistency */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          title="Total Sales"
          value="Rp 8,456,780"
          icon={<ShoppingCart className="h-6 w-6" />}
          change="+12.5% from last week"
          changeType="increase"
        />
        <MetricCard
          title="Inventory Items"
          value="290"
          icon={<Package className="h-6 w-6" />}
          change="15 items low on stock"
          changeType="neutral"
        />
        <MetricCard
          title="Customers"
          value="1,245"
          icon={<Users className="h-6 w-6" />}
          change="+8.2% from last month"
          changeType="increase"
        />
        <MetricCard
          title="This Month's Load"
          value="Rp 56,245,000"
          icon={<Truck className="h-6 w-6" />}
          change="+5.3% from last month"
          changeType="increase"
        />
        <MetricCard
          title="Products Ordered"
          value="547 units"
          icon={<Clipboard className="h-6 w-6" />}
          change="24 units today"
          changeType="neutral"
        />
      </div>

      {/* Online users counter */}
      <div className="grid gap-4 md:grid-cols-3">
        <UserCounter />
        {/* Other metrics could go here */}
        <div className="md:col-span-2">
          <CustomerChat />
        </div>
      </div>

      {/* Hourly sales chart with date selector */}
      <HourlySalesChart />

      {/* Recent sales chart */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={recentSalesData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`Rp ${value.toLocaleString()}`, "Sales"]}
                />
                <Bar
                  dataKey="sales"
                  fill="#9b87f5"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Inventory Status */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={inventoryStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {inventoryStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [value, "Items"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {userRole === "owner" || userRole === "warehouse_admin" ? (
              <div className="mt-4 text-center">
                <Button asChild variant="outline">
                  <Link to="/inventory">Manage Inventory</Link>
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Recent activities - simplified for this demo */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 rounded-lg border p-4">
                <div className="h-9 w-9 rounded-full bg-retailayu-soft-gray flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-retailayu-purple" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    New sale completed: Invoice #INV-2023042
                  </p>
                  <p className="text-sm text-muted-foreground">
                    15 minutes ago by Sarah Johnson
                  </p>
                </div>
                <div className="font-medium">Rp 245,000</div>
              </div>
              <div className="flex items-center space-x-4 rounded-lg border p-4">
                <div className="h-9 w-9 rounded-full bg-retailayu-soft-gray flex items-center justify-center">
                  <Package className="h-5 w-5 text-retailayu-purple" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Low stock alert: Organic Milk (5 remaining)
                  </p>
                  <p className="text-sm text-muted-foreground">45 minutes ago</p>
                </div>
                <Button size="sm" variant="outline">
                  Reorder
                </Button>
              </div>
              <div className="flex items-center space-x-4 rounded-lg border p-4">
                <div className="h-9 w-9 rounded-full bg-retailayu-soft-gray flex items-center justify-center">
                  <Users className="h-5 w-5 text-retailayu-purple" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    New customer registered: Maria Smith
                  </p>
                  <p className="text-sm text-muted-foreground">2 hours ago</p>
                </div>
                <Button size="sm" variant="outline">
                  View
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

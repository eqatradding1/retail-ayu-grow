import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  FileText, 
  Download, 
  BarChart as BarChartIcon, 
  PieChart as PieChartIcon, 
  TrendingUp,
  CreditCard,
  Users,
  Calendar,
} from "lucide-react";

import { calculateNetProfit, formatCurrency, getDateRange, formatDateRange, groupSalesByPaymentMethod } from "@/utils/reportUtils";

// Mock data for sales report
const monthlySalesData = [
  { month: "Jan", sales: 8500000, customers: 120, orders: 230 },
  { month: "Feb", sales: 7200000, customers: 110, orders: 200 },
  { month: "Mar", sales: 9100000, customers: 130, orders: 250 },
  { month: "Apr", sales: 10500000, customers: 150, orders: 280 },
  { month: "May", sales: 9800000, customers: 140, orders: 260 },
  { month: "Jun", sales: 11200000, customers: 160, orders: 300 },
  { month: "Jul", sales: 12500000, customers: 170, orders: 320 },
  { month: "Aug", sales: 13100000, customers: 180, orders: 340 },
  { month: "Sep", sales: 12800000, customers: 175, orders: 330 },
  { month: "Oct", sales: 14200000, customers: 190, orders: 360 },
  { month: "Nov", sales: 15000000, customers: 200, orders: 380 },
  { month: "Dec", sales: 16800000, customers: 220, orders: 410 }
];

// Mock data for product category sales
const categorySalesData = [
  { name: "Groceries", value: 35000000 },
  { name: "Beverages", value: 24000000 },
  { name: "Snacks", value: 18000000 },
  { name: "Household", value: 12000000 },
  { name: "Personal Care", value: 9000000 },
];

// Mock data for top selling products
const topProductsData = [
  { id: 1, name: "Rice", category: "Groceries", sales: 8500000, units: 950 },
  { id: 2, name: "Cooking Oil", category: "Groceries", sales: 6200000, units: 520 },
  { id: 3, name: "Sugar", category: "Groceries", sales: 4100000, units: 820 },
  { id: 4, name: "Mineral Water", category: "Beverages", sales: 3700000, units: 1200 },
  { id: 5, name: "Instant Noodles", category: "Groceries", sales: 3200000, units: 1350 },
  { id: 6, name: "Soda", category: "Beverages", sales: 2900000, units: 980 },
  { id: 7, name: "Chips", category: "Snacks", sales: 2500000, units: 830 },
  { id: 8, name: "Detergent", category: "Household", sales: 2200000, units: 350 },
  { id: 9, name: "Chocolate", category: "Snacks", sales: 1900000, units: 760 },
  { id: 10, name: "Soap", category: "Personal Care", sales: 1700000, units: 520 },
];

// Mock data for inventory value and status
const inventorySummaryData = [
  { category: "Groceries", totalItems: 85, value: 12500000, lowStock: 8 },
  { category: "Beverages", totalItems: 42, value: 8700000, lowStock: 5 },
  { category: "Snacks", totalItems: 37, value: 5400000, lowStock: 3 },
  { category: "Household", totalItems: 28, value: 7200000, lowStock: 6 },
  { category: "Personal Care", totalItems: 23, value: 4100000, lowStock: 2 },
];

// Mock data for expenses
const expensesData = [
  { month: "Jan", value: 2500000 },
  { month: "Feb", value: 2200000 },
  { month: "Mar", value: 2800000 },
  { month: "Apr", value: 3000000 },
  { month: "May", value: 2700000 },
  { month: "Jun", value: 3200000 },
  { month: "Jul", value: 3500000 },
  { month: "Aug", value: 3300000 },
  { month: "Sep", value: 3400000 },
  { month: "Oct", value: 3700000 },
  { month: "Nov", value: 3900000 },
  { month: "Dec", value: 4200000 },
];

// Mock data for payment methods
const paymentMethodsData = [
  { name: "Cash", value: 45000000 },
  { name: "Credit Card", value: 65000000 },
  { name: "Mobile Payment", value: 25000000 },
  { name: "Bank Transfer", value: 5800000 },
];

// Colors for the pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Reports() {
  const [periodFilter, setPeriodFilter] = useState<string>("year");
  const [yearFilter, setYearFilter] = useState<string>("2023");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  // Get date range based on selected period
  const dateRange = useMemo(() => {
    return getDateRange(
      periodFilter, 
      periodFilter === 'custom' ? startDate : undefined,
      periodFilter === 'custom' ? endDate : undefined
    );
  }, [periodFilter, startDate, endDate]);
  
  // Calculate net profit for each month
  const netProfitData = useMemo(() => {
    return monthlySalesData.map((item, index) => ({
      month: item.month,
      sales: item.sales,
      expenses: expensesData[index]?.value || 0,
      profit: item.sales - (expensesData[index]?.value || 0)
    }));
  }, []);
  
  // Format date range for display
  const displayDateRange = useMemo(() => {
    if (periodFilter === 'custom' && startDate && endDate) {
      return formatDateRange(startDate, endDate);
    }
    return formatDateRange(dateRange.startDate, dateRange.endDate);
  }, [periodFilter, startDate, endDate, dateRange]);

  // Total sales, expenses, and profit for the selected period
  const totals = useMemo(() => {
    const totalSales = monthlySalesData.reduce((sum, item) => sum + item.sales, 0);
    const totalExpenses = expensesData.reduce((sum, item) => sum + item.value, 0);
    return {
      sales: totalSales,
      expenses: totalExpenses,
      profit: totalSales - totalExpenses
    };
  }, []);

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          
          {periodFilter === 'custom' ? (
            <div className="flex flex-col sm:flex-row gap-2">
              <DatePicker
                selected={startDate}
                onSelect={(date) => setStartDate(date)}
                placeholder="Start date"
              />
              <DatePicker
                selected={endDate}
                onSelect={(date) => setEndDate(date)}
                placeholder="End date"
              />
            </div>
          ) : (
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className="text-sm text-muted-foreground mb-6">
        <Calendar className="inline-block mr-2 h-4 w-4" />
        Showing data for: <span className="font-medium">{displayDateRange}</span>
      </div>

      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="sales">
            <BarChartIcon className="mr-2 h-4 w-4" />
            Sales
          </TabsTrigger>
          <TabsTrigger value="products">
            <PieChartIcon className="mr-2 h-4 w-4" />
            Products
          </TabsTrigger>
          <TabsTrigger value="inventory">
            <TrendingUp className="mr-2 h-4 w-4" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="finance">
            <CreditCard className="mr-2 h-4 w-4" />
            Finance
          </TabsTrigger>
          <TabsTrigger value="customers">
            <Users className="mr-2 h-4 w-4" />
            Customers
          </TabsTrigger>
        </TabsList>
        
        {/* Sales Report Tab */}
        <TabsContent value="sales">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totals.sales)}</div>
                <p className="text-xs text-muted-foreground">
                  For {yearFilter}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Transaction Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42,500</div>
                <p className="text-xs text-muted-foreground">
                  1.5% increase from last year
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3,310</div>
                <p className="text-xs text-muted-foreground">
                  From 2,950 customers
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Monthly Sales Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Monthly Sales ({yearFilter})</CardTitle>
                    <CardDescription>
                      Monthly revenue across the year
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" /> Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlySalesData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis
                        tickFormatter={(value) => `${value / 1000000}M`}
                      />
                      <Tooltip formatter={(value: any) => `${parseInt(value).toLocaleString()}`} />
                      <Legend />
                      <Bar name="Revenue" dataKey="sales" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Sales by Category Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Sales by Category ({yearFilter})</CardTitle>
                    <CardDescription>
                      Revenue breakdown by product category
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" /> Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categorySalesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categorySalesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => `${parseInt(value).toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {categorySalesData.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center">
                      <div 
                        className="w-3 h-3 mr-1 rounded-sm" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-xs">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Payment Methods Chart - New */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Payment Methods ({yearFilter})</CardTitle>
                    <CardDescription>
                      Sales breakdown by payment type
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" /> Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentMethodsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {paymentMethodsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => `${parseInt(value).toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {paymentMethodsData.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center">
                      <div 
                        className="w-3 h-3 mr-1 rounded-sm" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-xs">{entry.name}: {formatCurrency(entry.value)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Customers vs Orders Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Customers vs Orders ({yearFilter})</CardTitle>
                    <CardDescription>
                      Monthly comparison between customers and orders
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" /> Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={monthlySalesData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value: any) => parseInt(value).toLocaleString()} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        name="Customers" 
                        dataKey="customers" 
                        stroke="#8884d8" 
                        activeDot={{ r: 8 }}
                      />
                      <Line 
                        type="monotone" 
                        name="Orders" 
                        dataKey="orders" 
                        stroke="#82ca9d"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Products Report Tab */}
        <TabsContent value="products">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Top Selling Products</CardTitle>
                  <CardDescription>
                    Best performing products by revenue and quantity
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" /> Full Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Units Sold</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProductsData.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.id}</TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.units.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{product.sales.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales by Product Category</CardTitle>
                <CardDescription>
                  Revenue distribution across product categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={categorySalesData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 50,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={(value) => `${value / 1000000}M`} />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip formatter={(value: any) => `${parseInt(value).toLocaleString()}`} />
                      <Bar dataKey="value" name="Revenue" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Performance Metrics</CardTitle>
                <CardDescription>
                  Key metrics per product category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categorySalesData.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{category.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {(category.value / 1000000).toFixed(1)}M revenue
                        </div>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary"
                          style={{ 
                            width: `${(category.value / 35000000) * 100}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Inventory Report Tab */}
        <TabsContent value="inventory">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">37,900,000</div>
                <p className="text-xs text-muted-foreground">
                  Across 215 products
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-500">24</div>
                <p className="text-xs text-muted-foreground">
                  Items below reorder level
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Stock Turnover Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2</div>
                <p className="text-xs text-muted-foreground">
                  Average turns per year
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Inventory Summary by Category</CardTitle>
                  <CardDescription>
                    Stock levels and value by product category
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" /> Full Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Total Items</TableHead>
                    <TableHead>Items Low on Stock</TableHead>
                    <TableHead className="text-right">Total Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventorySummaryData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.category}</TableCell>
                      <TableCell>{item.totalItems}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className={item.lowStock > 5 ? "text-red-500" : "text-amber-500"}>
                            {item.lowStock}
                          </span>
                          {item.lowStock > 5 && (
                            <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">
                              Action needed
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{item.value.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Value by Category</CardTitle>
                <CardDescription>
                  Distribution of stock value across categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={inventorySummaryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="category"
                      >
                        {inventorySummaryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => `${parseInt(value).toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Stock Movement Trend</CardTitle>
                <CardDescription>
                  Monthly stock movement throughout the year
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={monthlySalesData.map(item => ({
                        month: item.month,
                        // Creating mock data for stock movement based on sales data
                        inflow: Math.round(item.sales * 0.0001 * 1.2),
                        outflow: Math.round(item.sales * 0.0001)
                      }))}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="inflow" name="Stock In" stroke="#82ca9d" />
                      <Line type="monotone" dataKey="outflow" name="Stock Out" stroke="#ff7300" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Finance Report Tab - New */}
        <TabsContent value="finance">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totals.sales)}</div>
                <p className="text-xs text-muted-foreground">
                  For {yearFilter}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totals.expenses)}</div>
                <p className="text-xs text-muted-foreground">
                  For {yearFilter}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totals.profit)}</div>
                <p className="text-xs text-muted-foreground">
                  {((totals.profit / totals.sales) * 100).toFixed(1)}% profit margin
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Monthly Revenue vs Expenses</CardTitle>
                    <CardDescription>
                      Comparing sales revenue against expenses
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" /> Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={netProfitData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                      <Tooltip formatter={(value: any) => `${parseInt(value).toLocaleString()}`} />
                      <Legend />
                      <Bar name="Revenue" dataKey="sales" fill="#82ca9d" />
                      <Bar name="Expenses" dataKey="expenses" fill="#ff7300" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Net Profit Trend</CardTitle>
                    <CardDescription>
                      Monthly profit after expenses
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" /> Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={netProfitData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                      <Tooltip formatter={(value: any) => `${parseInt(value).toLocaleString()}`} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        name="Net Profit" 
                        dataKey="profit" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Monthly Expense Breakdown</CardTitle>
                  <CardDescription>
                    Expenses categorized by type
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" /> View Details
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Expenses</TableHead>
                    <TableHead className="text-right">Net Profit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {netProfitData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.month}</TableCell>
                      <TableCell>{formatCurrency(item.sales)}</TableCell>
                      <TableCell>{formatCurrency(item.expenses)}</TableCell>
                      <TableCell className="text-right font-medium">
                        <span className={item.profit > 0 ? "text-green-600" : "text-red-600"}>
                          {formatCurrency(item.profit)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Customers Report Tab - New */}
        <TabsContent value="customers">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,950</div>
                <p className="text-xs text-muted-foreground">
                  420 new this year
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Spending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(47500)}</div>
                <p className="text-xs text-muted-foreground">
                  Per customer per year
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Customer Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78.5%</div>
                <p className="text-xs text-muted-foreground">
                  3.2% increase from last year
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Top Customers by Purchase Value</CardTitle>
                  <CardDescription>
                    Customers who have spent the most
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" /> Full Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Total Purchases</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Last Purchase</TableHead>
                    <TableHead className="text-right">Loyalty Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { id: 1, name: "John Doe", purchases: 42, spent: 4850000, lastPurchase: "2023-04-12", loyaltyPoints: 485 },
                    { id: 2, name: "Jane Smith", purchases: 38, spent: 4250000, lastPurchase: "2023-04-15", loyaltyPoints: 425 },
                    { id: 3, name: "Robert Johnson", purchases: 35, spent: 3900000, lastPurchase: "2023-04-10", loyaltyPoints: 390 },
                    { id: 4, name: "Emily Williams", purchases: 32, spent: 3600000, lastPurchase: "2023-04-08", loyaltyPoints: 360 },
                    { id: 5, name: "Michael Brown", purchases: 30, spent: 3400000, lastPurchase: "2023-04-05", loyaltyPoints: 340 },
                    { id: 6, name: "Sarah Miller", purchases: 28, spent: 3200000, lastPurchase: "2023-04-02", loyaltyPoints: 320 },
                    { id: 7, name: "David Wilson", purchases: 26, spent: 3000000, lastPurchase: "2023-03-30", loyaltyPoints: 300 },
                    { id: 8, name: "Laura Taylor", purchases: 24, spent: 2800000, lastPurchase: "2023-03-28", loyaltyPoints: 280 },
                  ].map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.purchases}</TableCell>
                      <TableCell>{formatCurrency(customer.spent)}</TableCell>
                      <TableCell>{new Date(customer.lastPurchase).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">{customer.loyaltyPoints}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Demographics</CardTitle>
                <CardDescription>
                  Customer breakdown by age group
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Under 25", value: 450 },
                          { name: "25-34", value: 850 },
                          { name: "35-44", value: 750 },
                          { name: "45-54", value: 500 },
                          { name: "55+", value: 400 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[...Array(5)].map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Customer Growth</CardTitle>
                <CardDescription>
                  New customer acquisition trend
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: "Jan", customers: 35 },
                        { month: "Feb", customers: 32 },
                        { month: "Mar", customers: 38 },
                        { month: "Apr", customers: 42 },
                        { month: "May", customers: 40 },
                        { month: "Jun", customers: 45 },
                        { month: "Jul", customers: 48 },
                        { month: "Aug", customers: 50 },
                        { month: "Sep", customers: 46 },
                        { month: "Oct", customers: 44 },
                        { month: "Nov", customers: 38 },
                        { month: "Dec", customers: 42 },
                      ]}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        name="New Customers" 
                        dataKey="customers" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

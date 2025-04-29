
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentSales } from "@/components/dashboard/RecentSales";
import { Users, ShoppingCart, TrendingUp, Activity, BarChart } from "lucide-react";

// Mock data for quick stats
const mockStats = [
  {
    title: "Total Revenue",
    value: "Rp 15,850,000",
    change: "+12.5%",
    trend: "up",
    icon: <TrendingUp className="h-4 w-4 text-green-600" />,
  },
  {
    title: "Customers",
    value: "428",
    change: "+5.2%",
    trend: "up",
    icon: <Users className="h-4 w-4 text-blue-600" />,
  },
  {
    title: "Average Order",
    value: "Rp 125,000",
    change: "-2.1%",
    trend: "down",
    icon: <ShoppingCart className="h-4 w-4 text-amber-600" />,
  },
  {
    title: "Profit Margin",
    value: "24%",
    change: "+1.2%",
    trend: "up",
    icon: <BarChart className="h-4 w-4 text-purple-600" />,
  },
];

export default function Dashboard() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Quick stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {mockStats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p 
                className={`text-xs ${
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                } flex items-center`}
              >
                {stat.change}
                <span className="ml-1">from last month</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        {/* Analytics and charts would go here */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Monthly revenue for the current year</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-muted/10">
            <p className="text-muted-foreground">Sales chart placeholder</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Best performers this month</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-muted/10">
            <p className="text-muted-foreground">Products chart placeholder</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent sales section */}
      <RecentSales />
    </div>
  );
}

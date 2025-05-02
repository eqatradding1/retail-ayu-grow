
// Utility functions for report calculations and data formatting

import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";

// Calculate net profit after deducting expenses
export const calculateNetProfit = (sales: number, expenses: number): number => {
  return sales - expenses;
};

// Format currency values consistently
export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

// Get date range filters for different periods
export const getDateRange = (period: string, customStartDate?: Date, customEndDate?: Date): { startDate: Date, endDate: Date } => {
  const now = new Date();
  
  switch (period) {
    case "day":
      return { startDate: now, endDate: now };
    case "week":
      return { startDate: startOfWeek(now), endDate: endOfWeek(now) };
    case "month":
      return { startDate: startOfMonth(now), endDate: endOfMonth(now) };
    case "quarter":
      const currentMonth = now.getMonth();
      const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
      const quarterStart = new Date(now.getFullYear(), quarterStartMonth, 1);
      const quarterEnd = new Date(now.getFullYear(), quarterStartMonth + 3, 0);
      return { startDate: quarterStart, endDate: quarterEnd };
    case "year":
      return { startDate: startOfYear(now), endDate: endOfYear(now) };
    case "custom":
      if (customStartDate && customEndDate) {
        return { startDate: customStartDate, endDate: customEndDate };
      }
      return { startDate: now, endDate: now };
    default:
      return { startDate: now, endDate: now };
  }
};

// Format date ranges for display
export const formatDateRange = (startDate: Date, endDate: Date): string => {
  const start = format(startDate, "dd MMM yyyy");
  const end = format(endDate, "dd MMM yyyy");
  
  if (start === end) {
    return start;
  }
  
  return `${start} - ${end}`;
};

// Group sales data by payment method
export const groupSalesByPaymentMethod = (salesData: any[]): { name: string; value: number }[] => {
  const paymentMethods: Record<string, number> = {};
  
  salesData.forEach(sale => {
    const method = sale.paymentMethod || "Unknown";
    if (!paymentMethods[method]) {
      paymentMethods[method] = 0;
    }
    paymentMethods[method] += sale.totalAmount || 0;
  });
  
  return Object.entries(paymentMethods).map(([name, value]) => ({ name, value }));
};

// Check if a date falls within a specified range
export const isDateInRange = (date: Date, startDate: Date, endDate: Date): boolean => {
  const timestamp = date.getTime();
  return timestamp >= startDate.getTime() && timestamp <= endDate.getTime();
};

// Filter data based on date range
export const filterDataByDateRange = (data: any[], startDate: Date, endDate: Date, dateField: string = "date"): any[] => {
  return data.filter(item => {
    if (!item[dateField]) return false;
    const itemDate = new Date(item[dateField]);
    return isDateInRange(itemDate, startDate, endDate);
  });
};

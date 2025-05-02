
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";

// Generate hourly sales data
const generateHourlySalesData = (selectedDate: Date) => {
  const data = [];
  const baseDate = new Date(selectedDate);
  baseDate.setHours(8, 0, 0, 0); // Start at 8 AM
  
  for (let i = 0; i < 14; i++) { // 8 AM to 10 PM
    const hour = baseDate.getHours() + i;
    const time = `${hour % 12 === 0 ? 12 : hour % 12}${hour < 12 ? 'AM' : 'PM'}`;
    
    // Generate random sales with a pattern (busier at lunch and dinner times)
    let salesMultiplier = 1;
    if (hour === 12 || hour === 13) salesMultiplier = 1.8; // Lunch peak
    if (hour >= 18 && hour <= 20) salesMultiplier = 2; // Dinner peak
    
    const sales = Math.floor(Math.random() * 800 * salesMultiplier) + 200;
    
    data.push({ time, sales });
  }
  
  return data;
};

const HourlySalesChart = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [data, setData] = useState(() => generateHourlySalesData(today));
  
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setData(generateHourlySalesData(date));
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-0 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Hourly Sales</CardTitle>
          <div className="w-1/3">
            <DatePicker
              selected={selectedDate}
              onSelect={handleDateChange}
              allowManualEntry={true}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip
                formatter={(value) => [`Rp ${value.toLocaleString()}`, "Sales"]}
                labelFormatter={() => `${format(selectedDate, 'PP')}`}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#7E69AB"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default HourlySalesChart;

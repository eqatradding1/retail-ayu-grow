
import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: string;
  changeType?: "increase" | "decrease" | "neutral";
}

const MetricCard = ({
  title,
  value,
  icon,
  change,
  changeType = "neutral",
}: MetricCardProps) => {
  return (
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
            {icon}
          </div>
        </div>
        {change && (
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
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;

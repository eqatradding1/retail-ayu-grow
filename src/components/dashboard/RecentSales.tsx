
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface RecentSale {
  id: string;
  date: string;
  customer: string;
  amount: number;
  status: "completed" | "pending" | "cancelled";
  paymentMethod: string;
}

const mockRecentSales: RecentSale[] = [
  {
    id: "INV-001",
    date: "2023-04-28 14:30",
    customer: "John Doe",
    amount: 350000,
    status: "completed",
    paymentMethod: "Cash"
  },
  {
    id: "INV-002",
    date: "2023-04-28 10:15",
    customer: "Jane Smith",
    amount: 120000,
    status: "completed",
    paymentMethod: "Transfer"
  },
  {
    id: "INV-003",
    date: "2023-04-27 16:45",
    customer: "Robert Johnson",
    amount: 780000,
    status: "completed",
    paymentMethod: "Cash"
  },
  {
    id: "INV-004",
    date: "2023-04-27 09:20",
    customer: "Emily Wilson",
    amount: 450000,
    status: "completed",
    paymentMethod: "Transfer"
  },
  {
    id: "INV-005",
    date: "2023-04-26 13:40",
    customer: "David Brown",
    amount: 220000,
    status: "pending",
    paymentMethod: "Credit"
  }
];

export function RecentSales() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
        <CardDescription>
          Latest transactions from your point of sale
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockRecentSales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-medium">{sale.id}</TableCell>
                <TableCell>{sale.date}</TableCell>
                <TableCell>{sale.customer}</TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      sale.status === "completed" ? "default" :
                      sale.status === "cancelled" ? "destructive" : 
                      "outline"
                    }
                  >
                    {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {sale.amount.toLocaleString()}
                  <div className="text-xs text-muted-foreground">{sale.paymentMethod}</div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

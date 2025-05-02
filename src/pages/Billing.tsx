import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Printer, FileEdit, Check } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for credit records
const mockCreditRecords = [
  {
    id: "CR001",
    customerName: "John Doe",
    description: "Invoice for service",
    date: "2023-01-15",
    dueDate: "2023-02-15",
    amount: 500000,
    status: "paid",
  },
  {
    id: "CR002",
    customerName: "Jane Smith",
    description: "Purchase of goods",
    date: "2023-02-20",
    dueDate: "2023-03-20",
    amount: 750000,
    status: "pending",
  },
  {
    id: "CR003",
    customerName: "Alice Johnson",
    description: "Monthly subscription",
    date: "2023-03-01",
    dueDate: "2023-03-31",
    amount: 300000,
    status: "overdue",
  },
  {
    id: "CR004",
    customerName: "Bob Williams",
    description: "Consultation fee",
    date: "2023-03-10",
    dueDate: "2023-04-10",
    amount: 600000,
    status: "paid",
  },
  {
    id: "CR005",
    customerName: "Charlie Brown",
    description: "Software license",
    date: "2023-04-05",
    dueDate: "2023-05-05",
    amount: 1000000,
    status: "pending",
  },
];

const Billing = () => {
  const [credits, setCredits] = useState(mockCreditRecords);
  
  // Enhanced filter state
  const [filters, setFilters] = useState({
    customerName: "",
    dateRange: {
      from: undefined as Date | undefined,
      to: undefined as Date | undefined,
    },
    status: "all" as "all" | "pending" | "paid" | "overdue",
  });

  // Filter function
  const filteredCredits = useMemo(() => {
    return mockCreditRecords.filter((credit) => {
      // Filter by customer name
      if (filters.customerName && !credit.customerName.toLowerCase().includes(filters.customerName.toLowerCase())) {
        return false;
      }
      
      // Filter by date range
      if (filters.dateRange.from && new Date(credit.date) < filters.dateRange.from) {
        return false;
      }
      if (filters.dateRange.to && new Date(credit.date) > filters.dateRange.to) {
        return false;
      }
      
      // Filter by status
      if (filters.status !== "all" && credit.status !== filters.status) {
        return false;
      }
      
      return true;
    });
  }, [filters, mockCreditRecords]);
  
  // Handle print receipt
  const handlePrintReceipt = (id: string) => {
    const creditToPrint = mockCreditRecords.find((credit) => credit.id === id);
    if (!creditToPrint) return;
    
    // Create a new window for the receipt
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const formattedDate = new Date(creditToPrint.date).toLocaleDateString();
    const dueDate = new Date(creditToPrint.dueDate).toLocaleDateString();
    
    // Generate receipt HTML
    const receiptHTML = `
      <html>
      <head>
        <title>Credit Receipt</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
          }
          .receipt {
            max-width: 400px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
          }
          .row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
          }
          .total {
            font-weight: bold;
            margin-top: 15px;
            border-top: 1px solid #ddd;
            padding-top: 10px;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            margin-top: 30px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <h2>Credit Receipt</h2>
            <div>RetailAyu Store</div>
            <div>Receipt #${creditToPrint.id}</div>
          </div>
          
          <div class="row">
            <div>Customer:</div>
            <div>${creditToPrint.customerName}</div>
          </div>
          
          <div class="row">
            <div>Date:</div>
            <div>${formattedDate}</div>
          </div>
          
          <div class="row">
            <div>Due Date:</div>
            <div>${dueDate}</div>
          </div>
          
          <div class="row">
            <div>Description:</div>
            <div>${creditToPrint.description}</div>
          </div>
          
          <div class="row total">
            <div>Total Amount:</div>
            <div>Rp ${creditToPrint.amount.toLocaleString()}</div>
          </div>
          
          <div class="row">
            <div>Payment Status:</div>
            <div>${creditToPrint.status.toUpperCase()}</div>
          </div>
          
          <div class="footer">
            <p>Thank you for your business!</p>
            <p>This document is electronically generated and is valid without a signature.</p>
          </div>
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;
    
    printWindow.document.open();
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
  };

  return (
    <div className="container mx-auto py-4 space-y-6 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customer Credit</h1>
      </div>
      
      {/* Enhanced filter section */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="customerSearch">Customer Name</Label>
              <Input
                id="customerSearch"
                placeholder="Search by name..."
                value={filters.customerName}
                onChange={(e) => setFilters({ ...filters, customerName: e.target.value })}
              />
            </div>
            
            <div>
              <Label>From Date</Label>
              <DatePicker
                selected={filters.dateRange.from}
                onSelect={(date) => setFilters({
                  ...filters,
                  dateRange: { ...filters.dateRange, from: date }
                })}
                placeholder="Select start date"
                allowManualEntry={true}
              />
            </div>
            
            <div>
              <Label>To Date</Label>
              <DatePicker
                selected={filters.dateRange.to}
                onSelect={(date) => setFilters({
                  ...filters,
                  dateRange: { ...filters.dateRange, to: date }
                })}
                placeholder="Select end date"
                allowManualEntry={true}
              />
            </div>
            
            <div>
              <Label htmlFor="statusFilter">Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value: "all" | "pending" | "paid" | "overdue") => 
                  setFilters({ ...filters, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Credit records table */}
      <Card>
        <CardHeader>
          <CardTitle>Credit Records</CardTitle>
          <CardDescription>
            Showing {filteredCredits.length} of {mockCreditRecords.length} records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCredits.length > 0 ? (
                filteredCredits.map((credit) => (
                  <TableRow key={credit.id}>
                    <TableCell>{credit.id}</TableCell>
                    <TableCell>{credit.customerName}</TableCell>
                    <TableCell>{credit.description}</TableCell>
                    <TableCell>{new Date(credit.date).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(credit.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>Rp {credit.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={
                        credit.status === "paid" ? "success" :
                        credit.status === "overdue" ? "destructive" : "outline"
                      }>
                        {credit.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handlePrintReceipt(credit.id)}>
                            <Printer className="mr-2 h-4 w-4" />
                            Print
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileEdit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Check className="mr-2 h-4 w-4" />
                            Mark as Paid
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6">
                    No credit records found matching your filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Billing;

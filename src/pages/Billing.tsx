import { useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileText, Filter, Download, Printer } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Mock data for customer credits
const customerCredits = [
  {
    id: "1",
    customerId: "1",
    customerName: "John Doe",
    totalAmount: 250000,
    paidAmount: 150000,
    remainingAmount: 100000,
    dueDate: "2025-06-15",
    status: "partial",
    transactions: [
      {
        id: "tx-1",
        date: "2025-05-01",
        amount: 250000,
        description: "Purchase of grocery items",
        type: "debit",
      },
      {
        id: "tx-2",
        date: "2025-05-10",
        amount: 100000,
        description: "Partial payment",
        type: "credit",
      },
      {
        id: "tx-3",
        date: "2025-05-20",
        amount: 50000,
        description: "Partial payment",
        type: "credit",
      },
    ],
  },
  {
    id: "2",
    customerId: "2",
    customerName: "Alice Smith",
    totalAmount: 150000,
    paidAmount: 0,
    remainingAmount: 150000,
    dueDate: "2025-05-30",
    status: "unpaid",
    transactions: [
      {
        id: "tx-4",
        date: "2025-05-05",
        amount: 150000,
        description: "Purchase of electronics",
        type: "debit",
      },
    ],
  },
  {
    id: "3",
    customerId: "3",
    customerName: "Robert Johnson",
    totalAmount: 75000,
    paidAmount: 75000,
    remainingAmount: 0,
    dueDate: "2025-05-15",
    status: "paid",
    transactions: [
      {
        id: "tx-5",
        date: "2025-04-20",
        amount: 75000,
        description: "Purchase of kitchenware",
        type: "debit",
      },
      {
        id: "tx-6",
        date: "2025-05-01",
        amount: 75000,
        description: "Full payment",
        type: "credit",
      },
    ],
  },
];

export default function Billing() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCredit, setSelectedCredit] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500";
      case "partial":
        return "bg-yellow-500";
      case "unpaid":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Calculate the balance of transactions up to a certain index
  const calculateBalance = (transactions: any[], upToIndex: number) => {
    let balance = 0;
    for (let i = 0; i <= upToIndex; i++) {
      if (transactions[i].type === "debit") {
        balance += transactions[i].amount;
      } else {
        balance -= transactions[i].amount;
      }
    }
    return balance;
  };

  // Filter credits based on search term and active tab
  const filteredCredits = customerCredits.filter((credit) => {
    const matchesSearch = credit.customerName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && credit.status === activeTab;
  });

  // Handle printing the credit record
  const printCreditRecord = () => {
    if (!printRef.current) return;

    const printContent = printRef.current;
    const originalContents = document.body.innerHTML;
    const printStyles = `
      <style>
        @page { size: auto; margin: 20mm 10mm 20mm 10mm; }
        body { font-family: Arial, sans-serif; }
        .print-header { text-align: center; margin-bottom: 20px; }
        .print-title { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
        .print-subtitle { font-size: 14px; margin-bottom: 15px; }
        .print-info { margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
        .print-info-row { display: flex; margin-bottom: 5px; }
        .print-info-label { width: 150px; font-weight: bold; }
        .print-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .print-table th { border-bottom: 1px solid #000; padding: 8px; text-align: left; }
        .print-table td { border-bottom: 1px solid #ccc; padding: 8px; }
        .print-footer { margin-top: 20px; text-align: center; font-size: 12px; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
      </style>
    `;
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Unable to open print window. Please check your pop-up settings.");
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Credit Record - ${selectedCredit.customerName}</title>
          ${printStyles}
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load before printing
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  };

  // View credit details
  const viewCreditDetails = (credit: any) => {
    setSelectedCredit(credit);
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Customer Credit Management</h1>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <TabsList>
            <TabsTrigger value="all">All Credits</TabsTrigger>
            <TabsTrigger value="unpaid">Unpaid</TabsTrigger>
            <TabsTrigger value="partial">Partial</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search customers..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button>
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              New Credit
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Customer Credits</CardTitle>
              <CardDescription>
                View and manage customer credit accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead className="text-right">Paid Amount</TableHead>
                    <TableHead className="text-right">Remaining</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCredits.map((credit) => (
                    <TableRow key={credit.id}>
                      <TableCell className="font-medium">
                        {credit.customerName}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(credit.totalAmount)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(credit.paidAmount)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(credit.remainingAmount)}
                      </TableCell>
                      <TableCell>{new Date(credit.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="capitalize"
                        >
                          <span
                            className={`w-2 h-2 rounded-full mr-1 inline-block ${getStatusColor(
                              credit.status
                            )}`}
                          ></span>
                          {credit.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => viewCreditDetails(credit)}
                        >
                          <FileText className="h-4 w-4 mr-1" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredCredits.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        No credit records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="unpaid" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Unpaid Credits</CardTitle>
              <CardDescription>
                Credits that haven't been paid yet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead className="text-right">Paid Amount</TableHead>
                    <TableHead className="text-right">Remaining</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCredits
                    .filter((credit) => credit.status === "unpaid")
                    .map((credit) => (
                      <TableRow key={credit.id}>
                        <TableCell className="font-medium">
                          {credit.customerName}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(credit.totalAmount)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(credit.paidAmount)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(credit.remainingAmount)}
                        </TableCell>
                        <TableCell>
                          {new Date(credit.dueDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            <span
                              className={`w-2 h-2 rounded-full mr-1 inline-block ${getStatusColor(
                                credit.status
                              )}`}
                            ></span>
                            {credit.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => viewCreditDetails(credit)}
                          >
                            <FileText className="h-4 w-4 mr-1" /> View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  {filteredCredits.filter((credit) => credit.status === "unpaid").length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        No unpaid credit records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="partial" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Partially Paid Credits</CardTitle>
              <CardDescription>
                Credits that have been partially paid
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead className="text-right">Paid Amount</TableHead>
                    <TableHead className="text-right">Remaining</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCredits
                    .filter((credit) => credit.status === "partial")
                    .map((credit) => (
                      <TableRow key={credit.id}>
                        <TableCell className="font-medium">
                          {credit.customerName}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(credit.totalAmount)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(credit.paidAmount)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(credit.remainingAmount)}
                        </TableCell>
                        <TableCell>
                          {new Date(credit.dueDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            <span
                              className={`w-2 h-2 rounded-full mr-1 inline-block ${getStatusColor(
                                credit.status
                              )}`}
                            ></span>
                            {credit.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => viewCreditDetails(credit)}
                          >
                            <FileText className="h-4 w-4 mr-1" /> View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  {filteredCredits.filter((credit) => credit.status === "partial").length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        No partially paid credit records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="paid" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Paid Credits</CardTitle>
              <CardDescription>
                Credits that have been fully paid
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead className="text-right">Paid Amount</TableHead>
                    <TableHead className="text-right">Remaining</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCredits
                    .filter((credit) => credit.status === "paid")
                    .map((credit) => (
                      <TableRow key={credit.id}>
                        <TableCell className="font-medium">
                          {credit.customerName}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(credit.totalAmount)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(credit.paidAmount)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(credit.remainingAmount)}
                        </TableCell>
                        <TableCell>
                          {new Date(credit.dueDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            <span
                              className={`w-2 h-2 rounded-full mr-1 inline-block ${getStatusColor(
                                credit.status
                              )}`}
                            ></span>
                            {credit.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => viewCreditDetails(credit)}
                          >
                            <FileText className="h-4 w-4 mr-1" /> View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  {filteredCredits.filter((credit) => credit.status === "paid").length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        No paid credit records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Credit Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Credit Record Details</DialogTitle>
          </DialogHeader>
          
          {selectedCredit && (
            <>
              <div className="flex justify-end space-x-2 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={printCreditRecord}
                  className="gap-1"
                >
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
              
              {/* Printable area */}
              <div ref={printRef} className="space-y-6">
                <div className="print-header">
                  <h2 className="print-title text-xl font-bold">Credit Statement</h2>
                  <p className="print-subtitle text-sm text-muted-foreground">RetailAyu Store</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print-info">
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Customer Information</h3>
                    <div className="space-y-1 text-sm">
                      <div className="print-info-row">
                        <span className="print-info-label font-medium">Name:</span> 
                        <span>{selectedCredit.customerName}</span>
                      </div>
                      <div className="print-info-row">
                        <span className="print-info-label font-medium">Customer ID:</span> 
                        <span>{selectedCredit.customerId}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Credit Summary</h3>
                    <div className="space-y-1 text-sm">
                      <div className="print-info-row">
                        <span className="print-info-label font-medium">Credit ID:</span> 
                        <span>{selectedCredit.id}</span>
                      </div>
                      <div className="print-info-row">
                        <span className="print-info-label font-medium">Total Amount:</span> 
                        <span>{formatCurrency(selectedCredit.totalAmount)}</span>
                      </div>
                      <div className="print-info-row">
                        <span className="print-info-label font-medium">Amount Paid:</span> 
                        <span>{formatCurrency(selectedCredit.paidAmount)}</span>
                      </div>
                      <div className="print-info-row">
                        <span className="print-info-label font-medium">Outstanding Balance:</span> 
                        <span>{formatCurrency(selectedCredit.remainingAmount)}</span>
                      </div>
                      <div className="print-info-row">
                        <span className="print-info-label font-medium">Due Date:</span> 
                        <span>{new Date(selectedCredit.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="print-info-row">
                        <span className="print-info-label font-medium">Status:</span> 
                        <span className="capitalize">{selectedCredit.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold mb-2">Transaction History</h3>
                  <table className="w-full print-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th className="text-right">Debit</th>
                        <th className="text-right">Credit</th>
                        <th className="text-right">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCredit.transactions.map((transaction: any, index: number) => (
                        <tr key={transaction.id}>
                          <td>{new Date(transaction.date).toLocaleDateString()}</td>
                          <td>{transaction.description}</td>
                          <td className="text-right">
                            {transaction.type === "debit" ? formatCurrency(transaction.amount) : ""}
                          </td>
                          <td className="text-right">
                            {transaction.type === "credit" ? formatCurrency(transaction.amount) : ""}
                          </td>
                          <td className="text-right">
                            {formatCurrency(calculateBalance(selectedCredit.transactions, index))}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={4} className="text-right font-bold">
                          Current Balance:
                        </td>
                        <td className="text-right font-bold">
                          {formatCurrency(selectedCredit.remainingAmount)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="print-footer pt-6 text-center text-sm text-muted-foreground">
                  <p>Printed on {new Date().toLocaleString()}</p>
                  <p>RetailAyu Store - Customer Credit Management</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

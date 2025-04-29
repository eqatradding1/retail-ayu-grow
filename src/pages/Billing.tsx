
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { Search, Plus, FileText, Printer, ArrowUpDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define invoice types
interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  amountPaid: number;
  status: "draft" | "pending" | "paid" | "overdue" | "cancelled";
  notes?: string;
}

// Mock customer data for dropdowns
const customers = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Robert Johnson" },
  { id: "4", name: "Sarah Williams" },
  { id: "5", name: "Michael Brown" },
];

// Mock product data for dropdowns
const products = [
  { id: "1", name: "Rice", unitPrice: 18000 },
  { id: "2", name: "Sugar", unitPrice: 14000 },
  { id: "3", name: "Cooking Oil", unitPrice: 25000 },
  { id: "4", name: "Flour", unitPrice: 12000 },
  { id: "5", name: "Salt", unitPrice: 5000 },
];

// Mock invoice data
const initialInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2023-001",
    customerId: "1",
    customerName: "John Doe",
    date: "2023-04-01",
    dueDate: "2023-04-15",
    items: [
      { id: "1", name: "Rice", quantity: 5, unitPrice: 18000 },
      { id: "2", name: "Cooking Oil", quantity: 2, unitPrice: 25000 }
    ],
    subtotal: 140000,
    taxRate: 0.11,
    taxAmount: 15400,
    total: 155400,
    amountPaid: 155400,
    status: "paid",
    notes: "Paid on time"
  },
  {
    id: "2",
    invoiceNumber: "INV-2023-002",
    customerId: "2",
    customerName: "Jane Smith",
    date: "2023-04-05",
    dueDate: "2023-04-20",
    items: [
      { id: "1", name: "Sugar", quantity: 3, unitPrice: 14000 },
      { id: "2", name: "Flour", quantity: 4, unitPrice: 12000 }
    ],
    subtotal: 90000,
    taxRate: 0.11,
    taxAmount: 9900,
    total: 99900,
    amountPaid: 50000,
    status: "pending",
    notes: "Partial payment received"
  },
  {
    id: "3",
    invoiceNumber: "INV-2023-003",
    customerId: "3",
    customerName: "Robert Johnson",
    date: "2023-04-10",
    dueDate: "2023-04-25",
    items: [
      { id: "1", name: "Rice", quantity: 10, unitPrice: 18000 },
      { id: "2", name: "Sugar", quantity: 5, unitPrice: 14000 },
      { id: "3", name: "Salt", quantity: 3, unitPrice: 5000 }
    ],
    subtotal: 265000,
    taxRate: 0.11,
    taxAmount: 29150,
    total: 294150,
    amountPaid: 0,
    status: "overdue",
    notes: "Customer requested extension"
  },
  {
    id: "4",
    invoiceNumber: "INV-2023-004",
    customerId: "4",
    customerName: "Sarah Williams",
    date: "2023-04-15",
    dueDate: "2023-04-30",
    items: [
      { id: "1", name: "Cooking Oil", quantity: 3, unitPrice: 25000 },
      { id: "2", name: "Flour", quantity: 2, unitPrice: 12000 }
    ],
    subtotal: 99000,
    taxRate: 0.11,
    taxAmount: 10890,
    total: 109890,
    amountPaid: 0,
    status: "draft"
  }
];

export default function Billing() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // Dialog states
  const [isAddInvoiceDialogOpen, setIsAddInvoiceDialogOpen] = useState(false);
  const [isViewInvoiceDialogOpen, setIsViewInvoiceDialogOpen] = useState(false);
  const [isRecordPaymentDialogOpen, setIsRecordPaymentDialogOpen] = useState(false);
  
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [newPaymentAmount, setNewPaymentAmount] = useState<number>(0);
  
  // New invoice form state
  const [newInvoice, setNewInvoice] = useState<Partial<Invoice>>({
    customerId: "",
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    items: [],
    taxRate: 0.11,
    status: "draft",
    notes: ""
  });
  
  const [newInvoiceItem, setNewInvoiceItem] = useState<Partial<InvoiceItem>>({
    id: "",
    name: "",
    quantity: 1,
    unitPrice: 0
  });

  // Calculate invoice stats
  const totalOutstanding = invoices
    .filter(inv => inv.status !== "paid" && inv.status !== "cancelled")
    .reduce((sum, inv) => sum + (inv.total - inv.amountPaid), 0);
    
  const overdueTotalAmount = invoices
    .filter(inv => inv.status === "overdue")
    .reduce((sum, inv) => sum + (inv.total - inv.amountPaid), 0);
    
  const overdueCount = invoices.filter(inv => inv.status === "overdue").length;
  
  // Filter invoices based on active tab and search term
  const filteredInvoices = invoices
    .filter(invoice => {
      // Filter by tab
      if (activeTab !== "all" && invoice.status !== activeTab) {
        return false;
      }
      
      // Filter by search term
      if (searchTerm && !invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Handle sorting
      if (sortBy === "date") {
        return sortDirection === "asc" 
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === "dueDate") {
        return sortDirection === "asc" 
          ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      }
      if (sortBy === "amount") {
        return sortDirection === "asc" 
          ? a.total - b.total
          : b.total - a.total;
      }
      if (sortBy === "customer") {
        return sortDirection === "asc" 
          ? a.customerName.localeCompare(b.customerName)
          : b.customerName.localeCompare(a.customerName);
      }
      return 0;
    });

  // Toggle sort direction when clicking a column header
  const toggleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  // Calculate the next invoice number
  const getNextInvoiceNumber = () => {
    const maxNumber = invoices.reduce((max, inv) => {
      const num = parseInt(inv.invoiceNumber.replace("INV-2023-", ""));
      return Math.max(max, num);
    }, 0);
    return `INV-2023-${String(maxNumber + 1).padStart(3, '0')}`;
  };

  // Add product to new invoice
  const addProductToInvoice = () => {
    if (!newInvoiceItem.id || !newInvoiceItem.name || newInvoiceItem.quantity <= 0) return;
    
    setNewInvoice({
      ...newInvoice,
      items: [...(newInvoice.items || []), {
        id: Date.now().toString(),
        name: newInvoiceItem.name,
        quantity: newInvoiceItem.quantity || 1,
        unitPrice: newInvoiceItem.unitPrice || 0
      }]
    });
    
    setNewInvoiceItem({
      id: "",
      name: "",
      quantity: 1,
      unitPrice: 0
    });
  };

  // Remove product from new invoice
  const removeProductFromInvoice = (itemId: string) => {
    setNewInvoice({
      ...newInvoice,
      items: newInvoice.items?.filter(item => item.id !== itemId)
    });
  };

  // Calculate invoice totals
  const calculateInvoiceTotals = () => {
    if (!newInvoice.items || newInvoice.items.length === 0) return { subtotal: 0, taxAmount: 0, total: 0 };
    
    const subtotal = newInvoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxAmount = subtotal * (newInvoice.taxRate || 0.11);
    const total = subtotal + taxAmount;
    
    return { subtotal, taxAmount, total };
  };

  // Create new invoice
  const handleCreateInvoice = () => {
    if (!newInvoice.customerId || !newInvoice.items || newInvoice.items.length === 0) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const customer = customers.find(c => c.id === newInvoice.customerId);
    if (!customer) return;
    
    const { subtotal, taxAmount, total } = calculateInvoiceTotals();
    
    const invoice: Invoice = {
      id: Date.now().toString(),
      invoiceNumber: getNextInvoiceNumber(),
      customerId: newInvoice.customerId,
      customerName: customer.name,
      date: newInvoice.date || new Date().toISOString().split("T")[0],
      dueDate: newInvoice.dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      items: newInvoice.items,
      subtotal,
      taxRate: newInvoice.taxRate || 0.11,
      taxAmount,
      total,
      amountPaid: 0,
      status: newInvoice.status as "draft" | "pending" | "paid" | "overdue" | "cancelled",
      notes: newInvoice.notes
    };
    
    setInvoices([...invoices, invoice]);
    setIsAddInvoiceDialogOpen(false);
    toast.success("Invoice created successfully");
    
    // Reset new invoice form
    setNewInvoice({
      customerId: "",
      date: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      items: [],
      taxRate: 0.11,
      status: "draft",
      notes: ""
    });
  };

  // Record payment for an invoice
  const handleRecordPayment = () => {
    if (!currentInvoice || newPaymentAmount <= 0) return;
    
    const remainingAmount = currentInvoice.total - currentInvoice.amountPaid;
    if (newPaymentAmount > remainingAmount) {
      toast.error("Payment amount cannot exceed the remaining balance");
      return;
    }
    
    const updatedInvoice = {
      ...currentInvoice,
      amountPaid: currentInvoice.amountPaid + newPaymentAmount,
      status: currentInvoice.amountPaid + newPaymentAmount >= currentInvoice.total ? "paid" : "pending"
    };
    
    const updatedInvoices = invoices.map(inv =>
      inv.id === currentInvoice.id ? updatedInvoice : inv
    );
    
    setInvoices(updatedInvoices);
    setIsRecordPaymentDialogOpen(false);
    setNewPaymentAmount(0);
    toast.success("Payment recorded successfully");
  };

  // Helper function for status badge styling
  const getStatusBadgeVariant = (status: string) => {
    switch(status) {
      case "paid": return "success";
      case "pending": return "warning";
      case "overdue": return "destructive";
      case "draft": return "outline";
      case "cancelled": return "secondary";
      default: return "default";
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalOutstanding.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              From {invoices.length} invoices
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overdue Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {overdueTotalAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {overdueCount} overdue invoices
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {invoices
                .filter(inv => inv.amountPaid > 0)
                .reduce((sum, inv) => sum + inv.amountPaid, 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>
                Manage customer invoices and payments
              </CardDescription>
            </div>
            <Button onClick={() => setIsAddInvoiceDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create Invoice
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="draft">Draft</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="paid">Paid</TabsTrigger>
                <TabsTrigger value="overdue">Overdue</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="relative flex flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                type="search" 
                placeholder="Search invoices..." 
                className="pl-8 w-full" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("customer")}>
                  <div className="flex items-center">
                    Customer
                    {sortBy === "customer" && (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Invoice #</TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("date")}>
                  <div className="flex items-center">
                    Date
                    {sortBy === "date" && (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("dueDate")}>
                  <div className="flex items-center">
                    Due Date
                    {sortBy === "dueDate" && (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("amount")}>
                  <div className="flex items-center">
                    Amount
                    {sortBy === "amount" && (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                    No invoices found
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.customerName}</TableCell>
                    <TableCell>{invoice.invoiceNumber}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.dueDate}</TableCell>
                    <TableCell>{invoice.total.toLocaleString()}</TableCell>
                    <TableCell>{invoice.amountPaid.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(invoice.status) as any}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setCurrentInvoice(invoice);
                            setIsViewInvoiceDialogOpen(true);
                          }}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setCurrentInvoice(invoice);
                            setIsRecordPaymentDialogOpen(true);
                            setNewPaymentAmount(invoice.total - invoice.amountPaid);
                          }}
                          disabled={invoice.status === "paid" || invoice.status === "cancelled"}
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Invoice Dialog */}
      <Dialog open={isAddInvoiceDialogOpen} onOpenChange={setIsAddInvoiceDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Create New Invoice</DialogTitle>
            <DialogDescription>
              Create a new invoice for a customer.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="customer">Customer</Label>
                <Select
                  value={newInvoice.customerId}
                  onValueChange={(value) => setNewInvoice({...newInvoice, customerId: value})}
                >
                  <SelectTrigger id="customer">
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="invoice-status">Status</Label>
                <Select
                  value={newInvoice.status}
                  onValueChange={(value) => setNewInvoice({
                    ...newInvoice, 
                    status: value as "draft" | "pending" | "paid" | "overdue" | "cancelled"
                  })}
                >
                  <SelectTrigger id="invoice-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="invoice-date">Invoice Date</Label>
                <Input 
                  id="invoice-date" 
                  type="date"
                  value={newInvoice.date}
                  onChange={(e) => setNewInvoice({...newInvoice, date: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="due-date">Due Date</Label>
                <Input 
                  id="due-date" 
                  type="date"
                  value={newInvoice.dueDate}
                  onChange={(e) => setNewInvoice({...newInvoice, dueDate: e.target.value})}
                />
              </div>
            </div>

            {/* Invoice Items Section */}
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Invoice Items</h3>
              
              {/* Item Add Form */}
              <div className="grid grid-cols-12 gap-2 mb-4">
                <div className="col-span-5">
                  <Select
                    value={newInvoiceItem.id}
                    onValueChange={(value) => {
                      const product = products.find(p => p.id === value);
                      if (product) {
                        setNewInvoiceItem({
                          ...newInvoiceItem,
                          id: product.id,
                          name: product.name,
                          unitPrice: product.unitPrice
                        });
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={newInvoiceItem.quantity || ""}
                    onChange={(e) => setNewInvoiceItem({
                      ...newInvoiceItem,
                      quantity: parseInt(e.target.value)
                    })}
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    type="number"
                    placeholder="Unit Price"
                    value={newInvoiceItem.unitPrice || ""}
                    onChange={(e) => setNewInvoiceItem({
                      ...newInvoiceItem,
                      unitPrice: parseFloat(e.target.value)
                    })}
                  />
                </div>
                <div className="col-span-2">
                  <Button 
                    onClick={addProductToInvoice} 
                    className="w-full"
                    disabled={!newInvoiceItem.id || !newInvoiceItem.quantity}
                  >
                    Add
                  </Button>
                </div>
              </div>
              
              {/* Items Table */}
              {newInvoice.items && newInvoice.items.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {newInvoice.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.unitPrice.toLocaleString()}</TableCell>
                        <TableCell>{(item.quantity * item.unitPrice).toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeProductFromInvoice(item.id)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No items added yet
                </div>
              )}
              
              {/* Totals */}
              {newInvoice.items && newInvoice.items.length > 0 && (
                <div className="mt-4 border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{calculateInvoiceTotals().subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Tax ({(newInvoice.taxRate || 0.11) * 100}%)</span>
                    <span>{calculateInvoiceTotals().taxAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{calculateInvoiceTotals().total.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="invoice-notes">Notes (Optional)</Label>
              <Textarea 
                id="invoice-notes" 
                value={newInvoice.notes || ""}
                onChange={(e) => setNewInvoice({...newInvoice, notes: e.target.value})}
                placeholder="Additional notes for the customer"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddInvoiceDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateInvoice}>Create Invoice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Invoice Dialog */}
      <Dialog open={isViewInvoiceDialogOpen} onOpenChange={setIsViewInvoiceDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
            <DialogDescription>
              {currentInvoice?.invoiceNumber}
            </DialogDescription>
          </DialogHeader>
          {currentInvoice && (
            <div className="py-4">
              <div className="flex justify-between mb-6">
                <div>
                  <h3 className="font-bold">Invoice To:</h3>
                  <p>{currentInvoice.customerName}</p>
                </div>
                <div className="text-right">
                  <p><span className="font-medium">Invoice Number:</span> {currentInvoice.invoiceNumber}</p>
                  <p><span className="font-medium">Date:</span> {currentInvoice.date}</p>
                  <p><span className="font-medium">Due Date:</span> {currentInvoice.dueDate}</p>
                  <Badge variant={getStatusBadgeVariant(currentInvoice.status) as any} className="mt-2">
                    {currentInvoice.status.charAt(0).toUpperCase() + currentInvoice.status.slice(1)}
                  </Badge>
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentInvoice.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.unitPrice.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{(item.quantity * item.unitPrice).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="mt-6 space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{currentInvoice.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({(currentInvoice.taxRate * 100)}%)</span>
                  <span>{currentInvoice.taxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold border-t border-b py-2 my-2">
                  <span>Total</span>
                  <span>{currentInvoice.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount Paid</span>
                  <span>{currentInvoice.amountPaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Balance Due</span>
                  <span>{(currentInvoice.total - currentInvoice.amountPaid).toLocaleString()}</span>
                </div>
              </div>
              
              {currentInvoice.notes && (
                <div className="mt-6 border-t pt-4">
                  <h3 className="font-medium mb-2">Notes</h3>
                  <p className="text-sm">{currentInvoice.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewInvoiceDialogOpen(false)}>
              Close
            </Button>
            <Button>
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
            {currentInvoice && currentInvoice.status !== "paid" && currentInvoice.status !== "cancelled" && (
              <Button 
                onClick={() => {
                  setIsViewInvoiceDialogOpen(false);
                  setIsRecordPaymentDialogOpen(true);
                  setNewPaymentAmount(currentInvoice.total - currentInvoice.amountPaid);
                }}
                variant="secondary"
              >
                Record Payment
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Record Payment Dialog */}
      <Dialog open={isRecordPaymentDialogOpen} onOpenChange={setIsRecordPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Record a payment for invoice {currentInvoice?.invoiceNumber}
            </DialogDescription>
          </DialogHeader>
          {currentInvoice && (
            <div className="grid gap-4 py-4">
              <div>
                <div className="mb-4">
                  <p><span className="font-medium">Customer:</span> {currentInvoice.customerName}</p>
                  <p><span className="font-medium">Invoice Total:</span> {currentInvoice.total.toLocaleString()}</p>
                  <p><span className="font-medium">Already Paid:</span> {currentInvoice.amountPaid.toLocaleString()}</p>
                  <p className="font-medium mt-1">
                    Remaining: {(currentInvoice.total - currentInvoice.amountPaid).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="payment-amount">Payment Amount</Label>
                <Input 
                  id="payment-amount" 
                  type="number"
                  value={newPaymentAmount || ""}
                  onChange={(e) => setNewPaymentAmount(Number(e.target.value))}
                  min={1}
                  max={currentInvoice.total - currentInvoice.amountPaid}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="payment-method">Payment Method</Label>
                <Select defaultValue="cash">
                  <SelectTrigger id="payment-method">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="credit_card">Credit/Debit Card</SelectItem>
                    <SelectItem value="mobile_payment">Mobile Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="payment-date">Payment Date</Label>
                <Input 
                  id="payment-date" 
                  type="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="payment-notes">Notes (Optional)</Label>
                <Textarea 
                  id="payment-notes" 
                  placeholder="Additional payment notes"
                  rows={2}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRecordPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRecordPayment}>Record Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

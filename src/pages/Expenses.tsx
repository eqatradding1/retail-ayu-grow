
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  FileText,
  Receipt,
  Banknote 
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define expense types
interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
  paymentMethod: string;
  receiptUrl?: string;
  notes?: string;
}

// Mock expense categories
const expenseCategories = [
  "Rent",
  "Utilities",
  "Salaries",
  "Inventory Purchase",
  "Equipment",
  "Marketing",
  "Maintenance",
  "Insurance",
  "Taxes",
  "Transportation",
  "Office Supplies",
  "Miscellaneous"
];

// Mock payment methods
const paymentMethods = [
  "Cash",
  "Bank Transfer",
  "Credit Card",
  "Mobile Payment",
  "Check"
];

// Mock expense data
const initialExpenses: Expense[] = [
  {
    id: "1",
    date: "2023-04-01",
    category: "Rent",
    amount: 1500000,
    description: "Monthly store rent",
    paymentMethod: "Bank Transfer",
    notes: "Paid on time"
  },
  {
    id: "2",
    date: "2023-04-05",
    category: "Utilities",
    amount: 350000,
    description: "Electricity bill",
    paymentMethod: "Bank Transfer",
    receiptUrl: "/receipts/utility-2023-04.pdf"
  },
  {
    id: "3",
    date: "2023-04-10",
    category: "Salaries",
    amount: 3000000,
    description: "Staff salaries for April",
    paymentMethod: "Bank Transfer"
  },
  {
    id: "4",
    date: "2023-04-15",
    category: "Inventory Purchase",
    amount: 2500000,
    description: "Monthly inventory restock",
    paymentMethod: "Credit Card",
    receiptUrl: "/receipts/inventory-2023-04.pdf",
    notes: "Includes special order for customer #3"
  }
];

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  
  // Dialog states
  const [isAddExpenseDialogOpen, setIsAddExpenseDialogOpen] = useState(false);
  const [isEditExpenseDialogOpen, setIsEditExpenseDialogOpen] = useState(false);
  const [isDeleteExpenseDialogOpen, setIsDeleteExpenseDialogOpen] = useState(false);
  const [isViewReceiptDialogOpen, setIsViewReceiptDialogOpen] = useState(false);
  
  const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);
  const [newExpense, setNewExpense] = useState<Omit<Expense, "id">>({
    date: new Date().toISOString().split("T")[0],
    category: "",
    amount: 0,
    description: "",
    paymentMethod: "Cash",
    notes: ""
  });
  
  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Filter expenses based on search term and category filter
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = searchTerm === "" || 
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = categoryFilter === "" || expense.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Handle adding a new expense
  const handleAddExpense = () => {
    if (!newExpense.category || newExpense.amount <= 0 || !newExpense.description) {
      toast.error("Please fill all required fields");
      return;
    }
    
    const expense: Expense = {
      id: Date.now().toString(),
      ...newExpense
    };
    
    setExpenses([...expenses, expense]);
    setIsAddExpenseDialogOpen(false);
    setNewExpense({
      date: new Date().toISOString().split("T")[0],
      category: "",
      amount: 0,
      description: "",
      paymentMethod: "Cash",
      notes: ""
    });
    toast.success("Expense recorded successfully");
  };

  // Handle editing an expense
  const handleEditExpense = () => {
    if (!currentExpense) return;
    
    const updatedExpenses = expenses.map(expense =>
      expense.id === currentExpense.id ? currentExpense : expense
    );
    
    setExpenses(updatedExpenses);
    setIsEditExpenseDialogOpen(false);
    toast.success("Expense updated successfully");
  };

  // Handle deleting an expense
  const handleDeleteExpense = () => {
    if (!currentExpense) return;
    
    const updatedExpenses = expenses.filter(
      expense => expense.id !== currentExpense.id
    );
    
    setExpenses(updatedExpenses);
    setIsDeleteExpenseDialogOpen(false);
    toast.success("Expense deleted successfully");
  };

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across {expenses.length} expense records
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Largest Expense Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Inventory Purchase</div>
            <p className="text-xs text-muted-foreground">
              42% of total expenses
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Month-over-Month Change</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">-5.2%</div>
            <p className="text-xs text-muted-foreground">
              Compared to last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Expense Transactions</CardTitle>
              <CardDescription>
                Track and manage all your business expenses
              </CardDescription>
            </div>
            <Button onClick={() => setIsAddExpenseDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Expense
            </Button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="relative flex flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                type="search" 
                placeholder="Search expenses..." 
                className="pl-8 w-full" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {expenseCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {expense.paymentMethod === "Cash" && <Banknote className="h-4 w-4 mr-2 text-green-500" />}
                      {expense.paymentMethod === "Bank Transfer" && <FileText className="h-4 w-4 mr-2 text-blue-500" />}
                      {expense.paymentMethod === "Credit Card" && <Receipt className="h-4 w-4 mr-2 text-purple-500" />}
                      {expense.paymentMethod}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {expense.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    {expense.receiptUrl && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setCurrentExpense(expense);
                          setIsViewReceiptDialogOpen(true);
                        }}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setCurrentExpense(expense);
                        setIsEditExpenseDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setCurrentExpense(expense);
                        setIsDeleteExpenseDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Expense Dialog */}
      <Dialog open={isAddExpenseDialogOpen} onOpenChange={setIsAddExpenseDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>
              Record a new expense transaction.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="expense-date">Date</Label>
                <Input 
                  id="expense-date" 
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="expense-amount">Amount</Label>
                <Input 
                  id="expense-amount" 
                  type="number"
                  value={newExpense.amount || ""}
                  onChange={(e) => setNewExpense({...newExpense, amount: Number(e.target.value)})}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="expense-category">Category</Label>
              <Select 
                value={newExpense.category}
                onValueChange={(value) => setNewExpense({...newExpense, category: value})}
              >
                <SelectTrigger id="expense-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="expense-description">Description</Label>
              <Input 
                id="expense-description" 
                value={newExpense.description}
                onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                placeholder="Brief description of the expense"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="expense-payment">Payment Method</Label>
              <Select 
                value={newExpense.paymentMethod}
                onValueChange={(value) => setNewExpense({...newExpense, paymentMethod: value})}
              >
                <SelectTrigger id="expense-payment">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="expense-notes">Notes (Optional)</Label>
              <Textarea 
                id="expense-notes" 
                value={newExpense.notes}
                onChange={(e) => setNewExpense({...newExpense, notes: e.target.value})}
                placeholder="Any additional details"
                rows={2}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="expense-receipt">Receipt (Optional)</Label>
              <Input 
                id="expense-receipt" 
                type="file"
                accept="image/*,.pdf"
              />
              <p className="text-xs text-muted-foreground">
                Upload a photo or scan of the receipt (PDF, JPG, PNG)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddExpenseDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddExpense}>Add Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Expense Dialog - Similar structure to Add with prefilled values */}
      <Dialog open={isEditExpenseDialogOpen} onOpenChange={setIsEditExpenseDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
            <DialogDescription>
              Update expense information.
            </DialogDescription>
          </DialogHeader>
          {currentExpense && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-expense-date">Date</Label>
                  <Input 
                    id="edit-expense-date" 
                    type="date"
                    value={currentExpense.date}
                    onChange={(e) => setCurrentExpense({...currentExpense, date: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-expense-amount">Amount</Label>
                  <Input 
                    id="edit-expense-amount" 
                    type="number"
                    value={currentExpense.amount}
                    onChange={(e) => setCurrentExpense({...currentExpense, amount: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-expense-category">Category</Label>
                <Select 
                  value={currentExpense.category}
                  onValueChange={(value) => setCurrentExpense({...currentExpense, category: value})}
                >
                  <SelectTrigger id="edit-expense-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-expense-description">Description</Label>
                <Input 
                  id="edit-expense-description" 
                  value={currentExpense.description}
                  onChange={(e) => setCurrentExpense({...currentExpense, description: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-expense-payment">Payment Method</Label>
                <Select 
                  value={currentExpense.paymentMethod}
                  onValueChange={(value) => setCurrentExpense({...currentExpense, paymentMethod: value})}
                >
                  <SelectTrigger id="edit-expense-payment">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-expense-notes">Notes (Optional)</Label>
                <Textarea 
                  id="edit-expense-notes" 
                  value={currentExpense.notes || ""}
                  onChange={(e) => setCurrentExpense({...currentExpense, notes: e.target.value})}
                  rows={2}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-expense-receipt">Replace Receipt (Optional)</Label>
                <Input 
                  id="edit-expense-receipt" 
                  type="file"
                  accept="image/*,.pdf"
                />
                {currentExpense.receiptUrl && (
                  <div className="text-xs text-muted-foreground flex items-center">
                    <FileText className="h-3 w-3 mr-1" /> Current receipt: {currentExpense.receiptUrl.split('/').pop()}
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditExpenseDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditExpense}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Expense Dialog */}
      <Dialog open={isDeleteExpenseDialogOpen} onOpenChange={setIsDeleteExpenseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Expense</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this expense record?
            </DialogDescription>
          </DialogHeader>
          <p>
            This will permanently delete the expense record for "{currentExpense?.description}" 
            from {currentExpense?.date} with amount {currentExpense?.amount.toLocaleString()}.
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteExpenseDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteExpense}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Receipt Dialog - Simple mockup */}
      <Dialog open={isViewReceiptDialogOpen} onOpenChange={setIsViewReceiptDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Expense Receipt</DialogTitle>
            <DialogDescription>
              Receipt for {currentExpense?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <div className="bg-gray-100 p-10 text-center">
              <FileText className="h-20 w-20 mx-auto text-gray-400" />
              <p className="mt-4">Receipt preview would appear here</p>
              <p className="text-sm text-muted-foreground">{currentExpense?.receiptUrl}</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsViewReceiptDialogOpen(false)}>
              Close
            </Button>
            <Button variant="outline">
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

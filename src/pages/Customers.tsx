
import { useState, useEffect } from "react";
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
import { Search, Plus, Pencil, Trash2, BadgePlus, History } from "lucide-react";

// Define Customer type
interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  loyaltyPoints: number;
  registeredDate: string;
  totalSpent: number;
  lastPurchaseDate?: string;
  notes?: string;
}

// Mock customer data
const initialCustomers: Customer[] = [
  {
    id: "1",
    name: "John Doe",
    phone: "555-123-4567",
    email: "john.doe@email.com",
    address: "123 Main St, Cityville",
    loyaltyPoints: 150,
    registeredDate: "2023-01-15",
    totalSpent: 580000,
    lastPurchaseDate: "2023-04-20",
    notes: "Regular customer, prefers weekend visits"
  },
  {
    id: "2",
    name: "Jane Smith",
    phone: "555-987-6543",
    email: "jane.smith@email.com",
    address: "456 Park Ave, Townsville",
    loyaltyPoints: 75,
    registeredDate: "2023-02-22",
    totalSpent: 320000,
    lastPurchaseDate: "2023-04-15"
  },
  {
    id: "3",
    name: "Robert Johnson",
    phone: "555-456-7890",
    email: "robert.j@email.com",
    address: "789 Oak St, Villagetown",
    loyaltyPoints: 200,
    registeredDate: "2023-01-05",
    totalSpent: 890000,
    lastPurchaseDate: "2023-04-18",
    notes: "Has wholesale account"
  }
];

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Customer dialog states
  const [isAddCustomerDialogOpen, setIsAddCustomerDialogOpen] = useState(false);
  const [isEditCustomerDialogOpen, setIsEditCustomerDialogOpen] = useState(false);
  const [isDeleteCustomerDialogOpen, setIsDeleteCustomerDialogOpen] = useState(false);
  const [isViewHistoryDialogOpen, setIsViewHistoryDialogOpen] = useState(false);
  const [isAddPointsDialogOpen, setIsAddPointsDialogOpen] = useState(false);
  
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, "id" | "registeredDate" | "totalSpent" | "loyaltyPoints">>({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: ""
  });
  
  const [pointsToAdd, setPointsToAdd] = useState<number>(0);
  
  // Filter customers based on search term
  const filteredCustomers = searchTerm
    ? customers.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : customers;
    
  // Mock purchase history for demo
  const mockPurchaseHistory = [
    {
      id: "p1",
      date: "2023-04-20",
      amount: 125000,
      items: 4,
      invoice: "INV-20230420-001"
    },
    {
      id: "p2",
      date: "2023-03-15",
      amount: 85000,
      items: 2,
      invoice: "INV-20230315-003"
    },
    {
      id: "p3",
      date: "2023-02-28",
      amount: 210000,
      items: 6,
      invoice: "INV-20230228-007"
    }
  ];

  // Handle adding a new customer
  const handleAddCustomer = () => {
    const customer: Customer = {
      id: Date.now().toString(),
      ...newCustomer,
      loyaltyPoints: 0,
      registeredDate: new Date().toISOString().split("T")[0],
      totalSpent: 0
    };
    
    setCustomers([...customers, customer]);
    setIsAddCustomerDialogOpen(false);
    setNewCustomer({
      name: "",
      phone: "",
      email: "",
      address: "",
      notes: ""
    });
    toast.success("Customer added successfully");
  };

  // Handle editing a customer
  const handleEditCustomer = () => {
    if (!currentCustomer) return;
    
    const updatedCustomers = customers.map(customer =>
      customer.id === currentCustomer.id ? currentCustomer : customer
    );
    
    setCustomers(updatedCustomers);
    setIsEditCustomerDialogOpen(false);
    toast.success("Customer updated successfully");
  };

  // Handle deleting a customer
  const handleDeleteCustomer = () => {
    if (!currentCustomer) return;
    
    const updatedCustomers = customers.filter(
      customer => customer.id !== currentCustomer.id
    );
    
    setCustomers(updatedCustomers);
    setIsDeleteCustomerDialogOpen(false);
    toast.success("Customer deleted successfully");
  };

  // Handle adding loyalty points
  const handleAddPoints = () => {
    if (!currentCustomer || pointsToAdd <= 0) return;
    
    const updatedCustomers = customers.map(customer => {
      if (customer.id === currentCustomer.id) {
        return {
          ...customer,
          loyaltyPoints: customer.loyaltyPoints + pointsToAdd
        };
      }
      return customer;
    });
    
    setCustomers(updatedCustomers);
    setIsAddPointsDialogOpen(false);
    setPointsToAdd(0);
    toast.success(`${pointsToAdd} points added successfully`);
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Customers</CardTitle>
              <CardDescription>
                Manage your store customers and their loyalty points
              </CardDescription>
            </div>
            <Button onClick={() => setIsAddCustomerDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Customer
            </Button>
          </div>
          <div className="relative flex mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              type="search" 
              placeholder="Search customers..." 
              className="pl-8 w-full" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Loyalty Points</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Purchase</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>
                    <div>{customer.phone}</div>
                    <div className="text-xs text-muted-foreground">{customer.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <BadgePlus className="w-4 h-4 text-green-500 mr-1" />
                      <span>{customer.loyaltyPoints} points</span>
                    </div>
                  </TableCell>
                  <TableCell>{customer.totalSpent.toLocaleString()}</TableCell>
                  <TableCell>{customer.lastPurchaseDate || "N/A"}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setCurrentCustomer(customer);
                        setIsViewHistoryDialogOpen(true);
                      }}
                    >
                      <History className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setCurrentCustomer(customer);
                        setIsAddPointsDialogOpen(true);
                      }}
                    >
                      <BadgePlus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setCurrentCustomer(customer);
                        setIsEditCustomerDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setCurrentCustomer(customer);
                        setIsDeleteCustomerDialogOpen(true);
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

      {/* Add Customer Dialog */}
      <Dialog open={isAddCustomerDialogOpen} onOpenChange={setIsAddCustomerDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Add a new customer to your store database.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                placeholder="Customer name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone" 
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                placeholder="Phone number"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                placeholder="Email address"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Textarea 
                id="address" 
                value={newCustomer.address}
                onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                placeholder="Customer address"
                rows={2}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                value={newCustomer.notes}
                onChange={(e) => setNewCustomer({...newCustomer, notes: e.target.value})}
                placeholder="Additional notes"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCustomerDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCustomer}>Add Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={isEditCustomerDialogOpen} onOpenChange={setIsEditCustomerDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Update customer information.
            </DialogDescription>
          </DialogHeader>
          {currentCustomer && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input 
                  id="edit-name" 
                  value={currentCustomer.name}
                  onChange={(e) => setCurrentCustomer({...currentCustomer, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input 
                  id="edit-phone" 
                  value={currentCustomer.phone}
                  onChange={(e) => setCurrentCustomer({...currentCustomer, phone: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input 
                  id="edit-email" 
                  type="email"
                  value={currentCustomer.email}
                  onChange={(e) => setCurrentCustomer({...currentCustomer, email: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-address">Address</Label>
                <Textarea 
                  id="edit-address" 
                  value={currentCustomer.address}
                  onChange={(e) => setCurrentCustomer({...currentCustomer, address: e.target.value})}
                  rows={2}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea 
                  id="edit-notes" 
                  value={currentCustomer.notes || ""}
                  onChange={(e) => setCurrentCustomer({...currentCustomer, notes: e.target.value})}
                  rows={2}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCustomerDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCustomer}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Customer Dialog */}
      <Dialog open={isDeleteCustomerDialogOpen} onOpenChange={setIsDeleteCustomerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this customer?
            </DialogDescription>
          </DialogHeader>
          <p>
            This will permanently delete "{currentCustomer?.name}" from your customer database.
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteCustomerDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCustomer}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Customer History Dialog */}
      <Dialog open={isViewHistoryDialogOpen} onOpenChange={setIsViewHistoryDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Purchase History</DialogTitle>
            <DialogDescription>
              {currentCustomer?.name}'s purchase history
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPurchaseHistory.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell>{purchase.date}</TableCell>
                    <TableCell>{purchase.invoice}</TableCell>
                    <TableCell>{purchase.items} items</TableCell>
                    <TableCell className="text-right">{purchase.amount.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsViewHistoryDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Loyalty Points Dialog */}
      <Dialog open={isAddPointsDialogOpen} onOpenChange={setIsAddPointsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Loyalty Points</DialogTitle>
            <DialogDescription>
              Add points to {currentCustomer?.name}'s loyalty account
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Current Points: <span className="font-medium text-foreground">{currentCustomer?.loyaltyPoints || 0}</span>
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="points">Points to Add</Label>
              <Input 
                id="points" 
                type="number"
                min="1"
                value={pointsToAdd || ""}
                onChange={(e) => setPointsToAdd(Number(e.target.value))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPointsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddPoints}>Add Points</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

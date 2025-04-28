
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import { 
  Search, 
  Package, 
  ArrowDownCircle, 
  ArrowUpCircle,
  Users,
  Plus,
  Pencil,
  Trash2
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Product, StockTransaction, Supplier } from "@/types/product";

// Mock products data (we'd fetch from supabase in production)
const initialProducts: Product[] = [
  {
    id: "1",
    name: "Rice",
    barcode: "8992775210101",
    description: "Premium quality rice",
    categoryId: "5",
    unitId: "5",
    stockQuantity: 50,
    minStockLevel: 10,
    costPrice: 15000,
    retailPrice: 18000,
    priceLevels: [],
    loyaltyPoints: 18,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    name: "Sugar",
    barcode: "8992775210102",
    description: "White sugar",
    categoryId: "5",
    unitId: "1",
    stockQuantity: 40,
    minStockLevel: 8,
    costPrice: 12000,
    retailPrice: 14000,
    priceLevels: [],
    loyaltyPoints: 14,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Mock suppliers data
const initialSuppliers: Supplier[] = [
  {
    id: "1",
    name: "ABC Distributors",
    contactPerson: "John Smith",
    phone: "555-1234",
    email: "john@abcdist.com",
    address: "123 Main St, City"
  },
  {
    id: "2",
    name: "XYZ Suppliers",
    contactPerson: "Jane Doe",
    phone: "555-5678",
    email: "jane@xyzsuppliers.com",
    address: "456 Oak Ave, Town"
  }
];

// Mock stock transactions
const initialTransactions: StockTransaction[] = [
  {
    id: "1",
    productId: "1",
    type: "purchase",
    quantity: 10,
    unitPrice: 14000,
    supplierId: "1",
    invoiceNumber: "INV-001",
    date: new Date().toISOString(),
    notes: "Regular monthly order"
  },
  {
    id: "2",
    productId: "2",
    type: "sale",
    quantity: 5,
    unitPrice: 14000,
    date: new Date().toISOString(),
    notes: "Sold via POS"
  },
  {
    id: "3",
    productId: "1",
    type: "return",
    quantity: 2,
    unitPrice: 15000,
    supplierId: "1",
    invoiceNumber: "RET-001",
    date: new Date().toISOString(),
    notes: "Damaged packaging"
  }
];

export default function Inventory() {
  const [products] = useState<Product[]>(initialProducts);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [transactions, setTransactions] = useState<StockTransaction[]>(initialTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Supplier dialog states
  const [isAddSupplierDialogOpen, setIsAddSupplierDialogOpen] = useState(false);
  const [isEditSupplierDialogOpen, setIsEditSupplierDialogOpen] = useState(false);
  const [isDeleteSupplierDialogOpen, setIsDeleteSupplierDialogOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null);
  const [newSupplier, setNewSupplier] = useState<Omit<Supplier, "id">>({
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: ""
  });
  
  // Stock transaction dialog states
  const [isAddTransactionDialogOpen, setIsAddTransactionDialogOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState<Partial<StockTransaction>>({
    productId: "",
    type: "purchase",
    quantity: 1,
    unitPrice: 0,
    supplierId: "",
    invoiceNumber: "",
    date: new Date().toISOString(),
    notes: ""
  });

  // Filter suppliers based on search term
  const filteredSuppliers = searchTerm
    ? suppliers.filter(supplier => 
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : suppliers;

  // Filter transactions based on search term
  const filteredTransactions = searchTerm
    ? transactions.filter(transaction =>
        getProductName(transaction.productId).toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : transactions;

  // Helper function to get product name by ID
  const getProductName = (productId: string) => {
    return products.find(product => product.id === productId)?.name || "Unknown Product";
  };

  // Helper function to get supplier name by ID
  const getSupplierName = (supplierId?: string) => {
    if (!supplierId) return "N/A";
    return suppliers.find(supplier => supplier.id === supplierId)?.name || "Unknown Supplier";
  };

  // Handle adding a new supplier
  const handleAddSupplier = () => {
    const supplier: Supplier = {
      id: Date.now().toString(),
      ...newSupplier
    };
    
    setSuppliers([...suppliers, supplier]);
    setIsAddSupplierDialogOpen(false);
    setNewSupplier({
      name: "",
      contactPerson: "",
      phone: "",
      email: "",
      address: ""
    });
    toast.success("Supplier added successfully");
  };

  // Handle editing a supplier
  const handleEditSupplier = () => {
    if (!currentSupplier) return;
    
    const updatedSuppliers = suppliers.map(supplier =>
      supplier.id === currentSupplier.id ? currentSupplier : supplier
    );
    
    setSuppliers(updatedSuppliers);
    setIsEditSupplierDialogOpen(false);
    toast.success("Supplier updated successfully");
  };

  // Handle deleting a supplier
  const handleDeleteSupplier = () => {
    if (!currentSupplier) return;
    
    const updatedSuppliers = suppliers.filter(
      supplier => supplier.id !== currentSupplier.id
    );
    
    setSuppliers(updatedSuppliers);
    setIsDeleteSupplierDialogOpen(false);
    toast.success("Supplier deleted successfully");
  };

  // Handle adding a new stock transaction
  const handleAddTransaction = () => {
    const transaction: StockTransaction = {
      id: Date.now().toString(),
      productId: newTransaction.productId || "",
      type: newTransaction.type as "purchase" | "sale" | "return" | "adjustment",
      quantity: newTransaction.quantity || 0,
      unitPrice: newTransaction.unitPrice || 0,
      supplierId: newTransaction.supplierId,
      invoiceNumber: newTransaction.invoiceNumber,
      date: newTransaction.date || new Date().toISOString(),
      notes: newTransaction.notes
    };
    
    setTransactions([...transactions, transaction]);
    setIsAddTransactionDialogOpen(false);
    setNewTransaction({
      productId: "",
      type: "purchase",
      quantity: 1,
      unitPrice: 0,
      supplierId: "",
      invoiceNumber: "",
      date: new Date().toISOString(),
      notes: ""
    });
    toast.success("Stock transaction recorded successfully");
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
      </div>

      <Tabs defaultValue="stock" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="stock">
            <Package className="mr-2 h-4 w-4" />
            Stock Movements
          </TabsTrigger>
          <TabsTrigger value="suppliers">
            <Users className="mr-2 h-4 w-4" />
            Suppliers
          </TabsTrigger>
        </TabsList>

        {/* Stock Movements Tab */}
        <TabsContent value="stock">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Stock Movements</CardTitle>
                  <CardDescription>
                    Record stock purchases, sales, returns and adjustments
                  </CardDescription>
                </div>
                <Button onClick={() => setIsAddTransactionDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Record Movement
                </Button>
              </div>
              <div className="relative flex mt-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                  type="search" 
                  placeholder="Search transactions..." 
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
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Supplier/Invoice</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {new Date(transaction.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {transaction.type === "purchase" && (
                            <ArrowDownCircle className="mr-2 h-4 w-4 text-green-500" />
                          )}
                          {transaction.type === "sale" && (
                            <ArrowUpCircle className="mr-2 h-4 w-4 text-blue-500" />
                          )}
                          {transaction.type === "return" && (
                            <ArrowDownCircle className="mr-2 h-4 w-4 text-amber-500" />
                          )}
                          {transaction.type === "adjustment" && (
                            <Package className="mr-2 h-4 w-4 text-gray-500" />
                          )}
                          <span className="capitalize">{transaction.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getProductName(transaction.productId)}</TableCell>
                      <TableCell>{transaction.quantity}</TableCell>
                      <TableCell>{transaction.unitPrice.toLocaleString()}</TableCell>
                      <TableCell>{(transaction.quantity * transaction.unitPrice).toLocaleString()}</TableCell>
                      <TableCell>
                        {transaction.supplierId && (
                          <div>
                            <div>{getSupplierName(transaction.supplierId)}</div>
                            {transaction.invoiceNumber && (
                              <div className="text-xs text-muted-foreground">
                                {transaction.invoiceNumber}
                              </div>
                            )}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Suppliers Tab */}
        <TabsContent value="suppliers">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Suppliers</CardTitle>
                  <CardDescription>
                    Manage your product suppliers
                  </CardDescription>
                </div>
                <Button onClick={() => setIsAddSupplierDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Supplier
                </Button>
              </div>
              <div className="relative flex mt-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                  type="search" 
                  placeholder="Search suppliers..." 
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
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">{supplier.name}</TableCell>
                      <TableCell>{supplier.contactPerson || "-"}</TableCell>
                      <TableCell>{supplier.phone || "-"}</TableCell>
                      <TableCell>{supplier.email || "-"}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setCurrentSupplier(supplier);
                            setIsEditSupplierDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setCurrentSupplier(supplier);
                            setIsDeleteSupplierDialogOpen(true);
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
        </TabsContent>
      </Tabs>

      {/* Add Supplier Dialog */}
      <Dialog open={isAddSupplierDialogOpen} onOpenChange={setIsAddSupplierDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Supplier</DialogTitle>
            <DialogDescription>
              Add a new supplier to your inventory system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Supplier Name</Label>
              <Input 
                id="name" 
                value={newSupplier.name}
                onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                placeholder="e.g., ABC Distributors"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input 
                id="contactPerson" 
                value={newSupplier.contactPerson}
                onChange={(e) => setNewSupplier({...newSupplier, contactPerson: e.target.value})}
                placeholder="e.g., John Doe"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone" 
                value={newSupplier.phone}
                onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})}
                placeholder="e.g., 555-1234"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email"
                value={newSupplier.email}
                onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})}
                placeholder="e.g., contact@supplier.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Textarea 
                id="address" 
                value={newSupplier.address}
                onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})}
                placeholder="Supplier's address"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSupplierDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSupplier}>Add Supplier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Supplier Dialog */}
      <Dialog open={isEditSupplierDialogOpen} onOpenChange={setIsEditSupplierDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
            <DialogDescription>
              Update the supplier information.
            </DialogDescription>
          </DialogHeader>
          {currentSupplier && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Supplier Name</Label>
                <Input 
                  id="edit-name" 
                  value={currentSupplier.name}
                  onChange={(e) => setCurrentSupplier({...currentSupplier, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-contactPerson">Contact Person</Label>
                <Input 
                  id="edit-contactPerson" 
                  value={currentSupplier.contactPerson || ""}
                  onChange={(e) => setCurrentSupplier({...currentSupplier, contactPerson: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input 
                  id="edit-phone" 
                  value={currentSupplier.phone || ""}
                  onChange={(e) => setCurrentSupplier({...currentSupplier, phone: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input 
                  id="edit-email" 
                  type="email"
                  value={currentSupplier.email || ""}
                  onChange={(e) => setCurrentSupplier({...currentSupplier, email: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-address">Address</Label>
                <Textarea 
                  id="edit-address" 
                  value={currentSupplier.address || ""}
                  onChange={(e) => setCurrentSupplier({...currentSupplier, address: e.target.value})}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditSupplierDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSupplier}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Supplier Dialog */}
      <Dialog open={isDeleteSupplierDialogOpen} onOpenChange={setIsDeleteSupplierDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Supplier</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this supplier?
            </DialogDescription>
          </DialogHeader>
          <p>
            This will permanently delete the "{currentSupplier?.name}" supplier.
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteSupplierDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSupplier}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Stock Transaction Dialog */}
      <Dialog open={isAddTransactionDialogOpen} onOpenChange={setIsAddTransactionDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Record Stock Movement</DialogTitle>
            <DialogDescription>
              Record a purchase, sale, return or stock adjustment.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="transaction-type">Movement Type</Label>
              <Select 
                value={newTransaction.type}
                onValueChange={(value) => setNewTransaction({
                  ...newTransaction, 
                  type: value as "purchase" | "sale" | "return" | "adjustment"
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select transaction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="purchase">Purchase (Stock In)</SelectItem>
                  <SelectItem value="sale">Sale (Stock Out)</SelectItem>
                  <SelectItem value="return">Return (Stock In)</SelectItem>
                  <SelectItem value="adjustment">Stock Adjustment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="product">Product</Label>
              <Select 
                value={newTransaction.productId}
                onValueChange={(value) => setNewTransaction({...newTransaction, productId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map(product => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input 
                  id="quantity" 
                  type="number"
                  value={newTransaction.quantity || ""}
                  onChange={(e) => setNewTransaction({
                    ...newTransaction, 
                    quantity: Number(e.target.value)
                  })}
                  min={1}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="unitPrice">Unit Price</Label>
                <Input 
                  id="unitPrice" 
                  type="number"
                  value={newTransaction.unitPrice || ""}
                  onChange={(e) => setNewTransaction({
                    ...newTransaction, 
                    unitPrice: Number(e.target.value)
                  })}
                  min={0}
                />
              </div>
            </div>
            
            {(newTransaction.type === "purchase" || newTransaction.type === "return") && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Select 
                    value={newTransaction.supplierId || ""}
                    onValueChange={(value) => setNewTransaction({...newTransaction, supplierId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map(supplier => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="invoiceNumber">Invoice Number</Label>
                  <Input 
                    id="invoiceNumber" 
                    value={newTransaction.invoiceNumber || ""}
                    onChange={(e) => setNewTransaction({...newTransaction, invoiceNumber: e.target.value})}
                    placeholder="e.g., INV-001"
                  />
                </div>
              </>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date" 
                type="date"
                value={new Date(newTransaction.date || Date.now()).toISOString().split('T')[0]}
                onChange={(e) => setNewTransaction({
                  ...newTransaction, 
                  date: new Date(e.target.value).toISOString()
                })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                value={newTransaction.notes || ""}
                onChange={(e) => setNewTransaction({...newTransaction, notes: e.target.value})}
                placeholder="Additional details about this transaction"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTransactionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTransaction}>Record Movement</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

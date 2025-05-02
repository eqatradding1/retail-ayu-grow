
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
  Trash2,
  AlertTriangle,
  Calendar,
  Filter
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import EnhancedStockForm from "@/components/inventory/EnhancedStockForm";
import { Product, StockTransaction, Supplier, ProductVariant } from "@/types/product";
import { addDays, format, differenceInDays } from "date-fns";

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
    updatedAt: new Date().toISOString(),
    expiryDate: addDays(new Date(), 180).toISOString() // 6 months from now
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
    updatedAt: new Date().toISOString(),
    expiryDate: addDays(new Date(), 30).toISOString() // 30 days from now (soon to expire)
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
  const [products, setProducts] = useState<Product[]>(initialProducts);
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
  const [transactionType, setTransactionType] = useState<"purchase" | "sale" | "return" | "adjustment">("purchase");
  
  // Filter states
  const [typeFilter, setTypeFilter] = useState<string>("all"); 
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false);
  
  // Expiring products warning
  const [expiringProducts, setExpiringProducts] = useState<Product[]>([]);
  
  // Check for products approaching expiration
  useEffect(() => {
    const expiring = products.filter(product => {
      if (!product.expiryDate) return false;
      
      const daysUntilExpiry = differenceInDays(
        new Date(product.expiryDate),
        new Date()
      );
      
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    });
    
    setExpiringProducts(expiring);
  }, [products]);

  // Helper function to get product name by ID - Moved up before being used
  const getProductName = (productId: string) => {
    return products.find(product => product.id === productId)?.name || "Unknown Product";
  };

  // Helper function to get supplier name by ID - Moved up before being used
  const getSupplierName = (supplierId?: string) => {
    if (!supplierId) return "N/A";
    return suppliers.find(supplier => supplier.id === supplierId)?.name || "Unknown Supplier";
  };

  // Filter suppliers based on search term
  const filteredSuppliers = searchTerm
    ? suppliers.filter(supplier => 
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : suppliers;

  // Apply all filters to transactions
  const filteredTransactions = transactions.filter(transaction => {
    // Search filter
    const matchesSearch = searchTerm 
      ? getProductName(transaction.productId).toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.type.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    // Type filter
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    
    // Date filter
    let matchesDate = true;
    const transactionDate = new Date(transaction.date);
    const today = new Date();
    
    if (dateFilter === "today") {
      matchesDate = transactionDate.toDateString() === today.toDateString();
    } else if (dateFilter === "thisWeek") {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      matchesDate = transactionDate >= weekStart;
    } else if (dateFilter === "thisMonth") {
      matchesDate = 
        transactionDate.getMonth() === today.getMonth() && 
        transactionDate.getFullYear() === today.getFullYear();
    }
    
    return matchesSearch && matchesType && matchesDate;
  });

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
  const handleAddTransaction = (transaction: StockTransaction) => {
    // Process variant creation if present
    if (transaction.variantDetails) {
      // In a real app, we'd create the variant in the database
      console.log("Creating variant:", transaction.variantDetails);
      // For this demo, we don't need to do anything else
    }
    
    // Process product price updates if present
    if (transaction.productPriceUpdate) {
      const { productId, costPrice, retailPrice } = transaction.productPriceUpdate;
      // Update product prices
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === productId 
            ? { ...product, costPrice, retailPrice } 
            : product
        )
      );
    }
    
    // Add the transaction
    setTransactions([...transactions, transaction]);
    
    // Update product stock quantity
    const product = products.find(p => p.id === transaction.productId);
    if (product) {
      let newQuantity = product.stockQuantity;
      
      if (transaction.type === "purchase") {
        newQuantity += transaction.quantity;
      } else if (transaction.type === "sale") {
        newQuantity -= transaction.quantity;
      } else if (transaction.type === "return") {
        newQuantity += transaction.quantity;
      } else if (transaction.type === "adjustment") {
        // For adjustment, the quantity is the new value
        newQuantity = transaction.quantity;
      }
      
      // Update the product stock
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === product.id 
            ? { ...p, stockQuantity: newQuantity } 
            : p
        )
      );
    }
    
    setIsAddTransactionDialogOpen(false);
  };

  // Reset all filters
  const resetFilters = () => {
    setTypeFilter("all");
    setDateFilter("all");
    setSearchTerm("");
    setIsFilterPopoverOpen(false);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
      </div>

      {/* Expiring Products Warning */}
      {expiringProducts.length > 0 && (
        <div className="mb-6">
          <Card className="bg-amber-50 border-amber-300">
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                <CardTitle className="text-amber-800">Products Approaching Expiration</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {expiringProducts.map(product => {
                  const daysUntilExpiry = differenceInDays(
                    new Date(product.expiryDate!),
                    new Date()
                  );
                  
                  return (
                    <li key={product.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-amber-500 mr-2" />
                        <span className="font-medium">{product.name}</span>
                      </div>
                      <Badge variant={daysUntilExpiry <= 7 ? "destructive" : "outline"} className="ml-2">
                        {daysUntilExpiry} {daysUntilExpiry === 1 ? "day" : "days"} left
                      </Badge>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

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
                <div className="flex gap-2">
                  <Select 
                    value={transactionType}
                    onValueChange={(value: any) => setTransactionType(value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Transaction type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="purchase">Purchase</SelectItem>
                      <SelectItem value="sale">Sale</SelectItem>
                      <SelectItem value="return">Return</SelectItem>
                      <SelectItem value="adjustment">Adjustment</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={() => setIsAddTransactionDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Record Movement
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <div className="relative flex flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input 
                    type="search" 
                    placeholder="Search transactions..." 
                    className="pl-8 w-full" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Popover open={isFilterPopoverOpen} onOpenChange={setIsFilterPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="gap-1">
                      <Filter className="h-4 w-4" />
                      <span>Filter</span>
                      {(typeFilter !== "all" || dateFilter !== "all") && (
                        <Badge variant="secondary" className="ml-1 h-5 px-1 rounded-full">
                          {((typeFilter !== "all" ? 1 : 0) + (dateFilter !== "all" ? 1 : 0))}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <h4 className="font-medium">Filter Transactions</h4>
                      
                      <div className="space-y-2">
                        <Label htmlFor="type-filter">Transaction Type</Label>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                          <SelectTrigger id="type-filter">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="purchase">Purchase</SelectItem>
                            <SelectItem value="sale">Sale</SelectItem>
                            <SelectItem value="return">Return</SelectItem>
                            <SelectItem value="adjustment">Adjustment</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="date-filter">Date Range</Label>
                        <Select value={dateFilter} onValueChange={setDateFilter}>
                          <SelectTrigger id="date-filter">
                            <SelectValue placeholder="Select date range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Time</SelectItem>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="thisWeek">This Week</SelectItem>
                            <SelectItem value="thisMonth">This Month</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex justify-between pt-2">
                        <Button variant="outline" size="sm" onClick={resetFilters}>
                          Reset Filters
                        </Button>
                        <Button size="sm" onClick={() => setIsFilterPopoverOpen(false)}>
                          Apply
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
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
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => (
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
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                        No transactions found. Try adjusting your search or filters.
                      </TableCell>
                    </TableRow>
                  )}
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

      {/* Enhanced Stock Transaction Dialog */}
      <Dialog 
        open={isAddTransactionDialogOpen} 
        onOpenChange={setIsAddTransactionDialogOpen}
      >
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Record Stock {transactionType.charAt(0).toUpperCase() + transactionType.slice(1)}
            </DialogTitle>
            <DialogDescription>
              Add products to your {transactionType} record
            </DialogDescription>
          </DialogHeader>
          
          <EnhancedStockForm
            products={products}
            suppliers={suppliers}
            transactionType={transactionType}
            onSubmit={handleAddTransaction}
            onCancel={() => setIsAddTransactionDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

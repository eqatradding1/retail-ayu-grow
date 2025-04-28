
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import { Search, Barcode, ShoppingCart, X, Plus, Minus, CreditCard, Banknote, Tag } from "lucide-react";
import { Product, Category } from "@/types/product";

// Mock data for products - this would be fetched from Supabase in a real implementation
const initialProducts = [
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
    priceLevels: [
      { id: "1", minQuantity: 5, price: 17500 },
      { id: "2", minQuantity: 10, price: 17000 },
      { id: "3", minQuantity: 20, price: 16500 }
    ],
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
    priceLevels: [
      { id: "1", minQuantity: 5, price: 13500 },
      { id: "2", minQuantity: 10, price: 13000 }
    ],
    loyaltyPoints: 14,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
    name: "Coffee",
    barcode: "8992775210103",
    description: "Ground coffee beans",
    categoryId: "5",
    unitId: "1",
    stockQuantity: 25,
    minStockLevel: 5,
    costPrice: 25000,
    retailPrice: 30000,
    priceLevels: [
      { id: "1", minQuantity: 3, price: 28000 }
    ],
    loyaltyPoints: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
];

// Mock data for categories
const categories = [
  { id: "1", name: "Vegetables" },
  { id: "2", name: "Fruits" },
  { id: "3", name: "Dairy" },
  { id: "4", name: "Bakery" },
  { id: "5", name: "Groceries" },
];

// Mock data for customers
const customers = [
  { id: "1", name: "John Doe", phone: "081234567890", points: 120 },
  { id: "2", name: "Jane Smith", phone: "081234567891", points: 250 },
  { id: "3", name: "Bob Johnson", phone: "081234567892", points: 75 },
];

// Cart item type
interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unitName: string;
  loyaltyPoints: number;
}

const POS = () => {
  const [products] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "transfer" | "credit">("cash");
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<{ id: string; name: string; points: number } | null>(null);
  const [usePoints, setUsePoints] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [lastSaleId, setLastSaleId] = useState<string | null>(null);

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const pointsDiscount = usePoints && selectedCustomer ? Math.min(selectedCustomer.points, subtotal) : 0;
  const total = subtotal - pointsDiscount;
  const totalPoints = cart.reduce((sum, item) => sum + (item.loyaltyPoints * item.quantity), 0);

  // Filtered products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === "" || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.barcode && product.barcode.includes(searchTerm));
    
    const matchesCategory = currentCategory === null || product.categoryId === currentCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Handle barcode scan
  const handleBarcodeScanned = () => {
    // In a real app, this would connect to a barcode scanner device
    // For demo purposes, we'll just use a random product
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    addToCart(randomProduct);
    toast.success(`Scanned: ${randomProduct.name}`);
  };

  // Add product to cart
  const addToCart = (product: Product) => {
    const existingItemIndex = cart.findIndex(item => item.productId === product.id);
    
    if (existingItemIndex >= 0) {
      // Product already in cart, increase quantity
      const newCart = [...cart];
      newCart[existingItemIndex].quantity += 1;
      
      // Apply wholesale price level if applicable
      const newQuantity = newCart[existingItemIndex].quantity;
      const newPrice = getDiscountedPrice(product, newQuantity);
      
      // Update all items of this product with the new price
      newCart[existingItemIndex].price = newPrice;
      
      setCart(newCart);
    } else {
      // Add new product to cart
      const unitName = "pcs"; // In a real app, fetch this from units
      
      setCart([...cart, {
        productId: product.id,
        name: product.name,
        price: product.retailPrice,
        quantity: 1,
        unitName,
        loyaltyPoints: product.loyaltyPoints
      }]);
    }
  };

  // Get discounted price based on quantity
  const getDiscountedPrice = (product: Product, quantity: number): number => {
    // Sort price levels by minimum quantity in descending order
    const sortedLevels = [...product.priceLevels].sort((a, b) => b.minQuantity - a.minQuantity);
    
    // Find the first price level that applies (highest min quantity that is <= our quantity)
    for (const level of sortedLevels) {
      if (quantity >= level.minQuantity) {
        return level.price;
      }
    }
    
    // If no wholesale level applies, use retail price
    return product.retailPrice;
  };

  // Remove item from cart
  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  // Update item quantity
  const updateCartItemQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const newCart = [...cart];
    const item = newCart[index];
    
    // Find the original product to check price levels
    const product = products.find(p => p.id === item.productId);
    if (!product) return;
    
    // Update quantity
    newCart[index].quantity = newQuantity;
    
    // Update price based on the new quantity
    newCart[index].price = getDiscountedPrice(product, newQuantity);
    
    setCart(newCart);
  };

  // Complete the sale
  const completeSale = () => {
    // In a real app, this would save the sale to the database
    const saleId = `INV-${Date.now().toString().substring(6)}`;
    setLastSaleId(saleId);
    
    // Show receipt
    setIsPaymentDialogOpen(false);
    setReceiptDialogOpen(true);
    
    // Clear cart after printing receipt
    // In a real implementation, you might want to wait for confirmation
    // that the receipt was printed successfully
    setTimeout(() => {
      setCart([]);
      setSelectedCustomer(null);
      setUsePoints(false);
      toast.success("Sale completed successfully!");
    }, 500);
  };

  // Print receipt
  const printReceipt = () => {
    // In a real app, this would connect to a receipt printer
    toast.success("Receipt sent to printer");
    setReceiptDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Point of Sale</h1>
        
        {/* Customer selection */}
        <div className="flex items-center gap-2">
          <div className="text-sm">
            {selectedCustomer ? (
              <div className="bg-green-50 border border-green-200 rounded-md px-3 py-1">
                <div className="font-medium">{selectedCustomer.name}</div>
                <div className="text-xs">Points: {selectedCustomer.points}</div>
              </div>
            ) : (
              "No customer selected"
            )}
          </div>
          <Button variant="outline" onClick={() => setIsCustomerDialogOpen(true)}>
            {selectedCustomer ? "Change" : "Add Customer"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product selection area */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Products</CardTitle>
              <CardDescription>Find and add products to the cart</CardDescription>
              
              <div className="flex gap-2 mt-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" onClick={handleBarcodeScanned}>
                  <Barcode className="h-4 w-4 mr-2" />
                  Scan
                </Button>
              </div>
              
              {/* Categories filter */}
              <div className="flex gap-2 overflow-x-auto py-2">
                <Button
                  variant={currentCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentCategory(null)}
                >
                  All
                </Button>
                {categories.map(category => (
                  <Button
                    key={category.id}
                    variant={currentCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentCategory(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    className="border rounded-md p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => addToCart(product)}
                  >
                    <div className="font-medium truncate">{product.name}</div>
                    <div className="text-sm text-gray-500">
                      Stock: {product.stockQuantity}
                    </div>
                    <div className="mt-1 font-bold">
                      {product.retailPrice.toLocaleString()}
                    </div>
                  </div>
                ))}
                
                {filteredProducts.length === 0 && (
                  <div className="col-span-full text-center py-10 text-gray-500">
                    No products found. Try a different search term or category.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Shopping cart */}
        <div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart
              </CardTitle>
              <CardDescription>
                {cart.length} item{cart.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {cart.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  Cart is empty. Add products to get started.
                </div>
              ) : (
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-center">Qty</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cart.map((item, index) => (
                        <TableRow key={`${item.productId}-${index}`}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="text-right">
                            {item.price.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center items-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => updateCartItemQuantity(index, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => updateCartItemQuantity(index, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {(item.price * item.quantity).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => removeFromCart(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex-col">
              <div className="w-full border-t pt-4">
                <div className="flex justify-between mb-1">
                  <span>Subtotal</span>
                  <span>{subtotal.toLocaleString()}</span>
                </div>
                
                {selectedCustomer && (
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="use-points"
                        checked={usePoints}
                        onChange={(e) => setUsePoints(e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="use-points">
                        Use Points ({selectedCustomer.points})
                      </Label>
                    </div>
                    {usePoints && (
                      <span className="text-red-500">-{pointsDiscount.toLocaleString()}</span>
                    )}
                  </div>
                )}
                
                <div className="flex justify-between font-bold text-lg mt-2">
                  <span>Total</span>
                  <span>{total.toLocaleString()}</span>
                </div>
                
                <div className="text-sm text-gray-500 mt-1">
                  Points earned: {totalPoints}
                </div>
                
                <Button
                  className="w-full mt-4"
                  size="lg"
                  disabled={cart.length === 0}
                  onClick={() => setIsPaymentDialogOpen(true)}
                >
                  Pay Now
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Payment method dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment</DialogTitle>
            <DialogDescription>Select payment method</DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Label>Amount to be paid: {total.toLocaleString()}</Label>
            
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={paymentMethod === "cash" ? "default" : "outline"}
                className="flex-col py-4 h-auto"
                onClick={() => setPaymentMethod("cash")}
              >
                <Banknote className="h-6 w-6 mb-1" />
                <span>Cash</span>
              </Button>
              
              <Button
                variant={paymentMethod === "transfer" ? "default" : "outline"}
                className="flex-col py-4 h-auto"
                onClick={() => setPaymentMethod("transfer")}
              >
                <CreditCard className="h-6 w-6 mb-1" />
                <span>Transfer</span>
              </Button>
              
              <Button
                variant={paymentMethod === "credit" ? "default" : "outline"}
                className="flex-col py-4 h-auto"
                onClick={() => setPaymentMethod("credit")}
              >
                <Tag className="h-6 w-6 mb-1" />
                <span>Credit</span>
              </Button>
            </div>
            
            {paymentMethod === "cash" && (
              <div className="grid gap-2">
                <Label htmlFor="cashAmount">Cash Amount</Label>
                <Input id="cashAmount" type="number" placeholder="Enter amount" />
              </div>
            )}
            
            {paymentMethod === "transfer" && (
              <div className="grid gap-2">
                <Label htmlFor="referenceNumber">Reference Number</Label>
                <Input id="referenceNumber" placeholder="Enter reference number" />
              </div>
            )}
            
            {paymentMethod === "credit" && (
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" type="date" />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={completeSale}>Complete Sale</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Customer selection dialog */}
      <Dialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Customer</DialogTitle>
            <DialogDescription>Choose a customer for this transaction</DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search customers..."
                className="pl-8"
              />
            </div>
            
            <div className="max-h-60 overflow-y-auto">
              {customers.map(customer => (
                <div
                  key={customer.id}
                  className="flex justify-between items-center p-3 border-b cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setIsCustomerDialogOpen(false);
                  }}
                >
                  <div>
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-sm text-gray-500">{customer.phone}</div>
                  </div>
                  <div className="text-sm">
                    <div>Points: {customer.points}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full">
              Register New Customer
            </Button>
          </div>
          
          <DialogFooter>
            <Button variant="ghost" onClick={() => {
              setSelectedCustomer(null);
              setIsCustomerDialogOpen(false);
            }}>
              No Customer
            </Button>
            <Button variant="outline" onClick={() => setIsCustomerDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Receipt dialog */}
      <Dialog open={receiptDialogOpen} onOpenChange={setReceiptDialogOpen}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader className="text-center">
            <DialogTitle>Receipt</DialogTitle>
          </DialogHeader>
          
          <div className="border-t border-b py-2 mt-2">
            <div className="text-center font-bold text-lg">RetailAyu Store</div>
            <div className="text-center text-sm">123 Main Street</div>
            <div className="text-center text-sm">Phone: 123-456-789</div>
            <div className="text-center text-xs mt-2">
              {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
            </div>
            <div className="text-center text-xs mb-2">
              {lastSaleId}
            </div>
          </div>
          
          <div className="mt-4">
            {cart.map((item, index) => (
              <div key={`receipt-${index}`} className="flex justify-between text-sm mb-1">
                <div>
                  <div>{item.name} x {item.quantity}</div>
                  <div className="text-xs text-gray-500">
                    @ {item.price.toLocaleString()}
                  </div>
                </div>
                <div>{(item.price * item.quantity).toLocaleString()}</div>
              </div>
            ))}
            
            <div className="border-t my-2"></div>
            
            <div className="flex justify-between text-sm">
              <div>Subtotal</div>
              <div>{subtotal.toLocaleString()}</div>
            </div>
            
            {pointsDiscount > 0 && (
              <div className="flex justify-between text-sm">
                <div>Points Discount</div>
                <div>-{pointsDiscount.toLocaleString()}</div>
              </div>
            )}
            
            <div className="flex justify-between font-bold mt-2">
              <div>TOTAL</div>
              <div>{total.toLocaleString()}</div>
            </div>
            
            <div className="mt-2 text-sm">
              <div>Payment Method: {paymentMethod === "cash" ? "Cash" : paymentMethod === "transfer" ? "Transfer" : "Credit"}</div>
              {selectedCustomer && (
                <div className="mt-1">
                  <div>Customer: {selectedCustomer.name}</div>
                  <div>Points Earned: {totalPoints}</div>
                  {usePoints && (
                    <div>Points Used: {pointsDiscount}</div>
                  )}
                  <div>New Balance: {selectedCustomer.points - pointsDiscount + totalPoints}</div>
                </div>
              )}
            </div>
            
            <div className="border-t mt-4 pt-2 text-center text-sm">
              Thank you for shopping with us!
            </div>
          </div>
          
          <DialogFooter>
            <Button className="w-full" onClick={printReceipt}>
              Print Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default POS;

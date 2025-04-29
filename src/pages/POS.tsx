
import { useState, useEffect } from "react";
import { Product, Category } from "@/types/product";
import { toast } from "@/components/ui/sonner";
import { CustomerSelection } from "@/components/pos/CustomerSelection";
import { ProductsList } from "@/components/pos/ProductsList";
import { ShoppingCart } from "@/components/pos/ShoppingCart";
import { PaymentDialog } from "@/components/pos/PaymentDialog";
import { ReceiptDialog } from "@/components/pos/ReceiptDialog";

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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "transfer" | "credit">("cash");
  const [selectedCustomer, setSelectedCustomer] = useState<{ id: string; name: string; points: number } | null>(null);
  const [usePoints, setUsePoints] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [lastSaleId, setLastSaleId] = useState<string | null>(null);

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const pointsDiscount = usePoints && selectedCustomer ? Math.min(selectedCustomer.points, subtotal) : 0;
  const total = subtotal - pointsDiscount;
  const totalPoints = cart.reduce((sum, item) => sum + (item.loyaltyPoints * item.quantity), 0);

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

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Point of Sale</h1>
        
        {/* Customer selection */}
        <CustomerSelection
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
          customers={customers}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product selection area */}
        <div className="lg:col-span-2">
          <ProductsList
            products={products}
            categories={categories}
            onAddToCart={addToCart}
          />
        </div>
        
        {/* Shopping cart */}
        <div>
          <ShoppingCart
            cart={cart}
            selectedCustomer={selectedCustomer}
            removeFromCart={removeFromCart}
            updateCartItemQuantity={updateCartItemQuantity}
            onCheckout={() => setIsPaymentDialogOpen(true)}
            usePoints={usePoints}
            setUsePoints={setUsePoints}
          />
        </div>
      </div>
      
      {/* Payment method dialog */}
      <PaymentDialog 
        isOpen={isPaymentDialogOpen} 
        onOpenChange={setIsPaymentDialogOpen}
        total={total}
        onComplete={completeSale}
      />
      
      {/* Receipt dialog */}
      <ReceiptDialog 
        isOpen={receiptDialogOpen}
        onOpenChange={setReceiptDialogOpen}
        cart={cart}
        subtotal={subtotal}
        pointsDiscount={pointsDiscount}
        total={total}
        totalPoints={totalPoints}
        selectedCustomer={selectedCustomer}
        paymentMethod={paymentMethod}
        saleId={lastSaleId}
        usePoints={usePoints}
      />
    </div>
  );
};

export default POS;

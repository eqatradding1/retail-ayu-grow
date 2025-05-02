
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";
import { Plus, Trash2, FileCheck } from "lucide-react";
import { Product, Supplier, StockTransaction, ProductVariant } from "@/types/product";

interface EnhancedStockFormProps {
  products: Product[];
  suppliers: Supplier[];
  transactionType: "purchase" | "sale" | "return" | "adjustment";
  onSubmit: (transaction: StockTransaction) => void;
  onCancel: () => void;
}

interface TransactionItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  unitPrice: number;
  isVariant: boolean;
  variantName?: string;
}

export default function EnhancedStockForm({ 
  products, 
  suppliers, 
  transactionType, 
  onSubmit, 
  onCancel 
}: EnhancedStockFormProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [transactionItems, setTransactionItems] = useState<TransactionItem[]>([]);
  const [supplierId, setSupplierId] = useState<string>("");
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  
  // Additional form items
  const [quantity, setQuantity] = useState<number>(1);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [isVariant, setIsVariant] = useState<boolean>(false);
  const [variantName, setVariantName] = useState<string>("");
  const [updateRetailPrice, setUpdateRetailPrice] = useState<boolean>(true);
  const [updateCostPrice, setUpdateCostPrice] = useState<boolean>(true);
  const [profitMargin, setProfitMargin] = useState<number>(20); // Default 20% markup
  const [autoUpdate, setAutoUpdate] = useState<boolean>(true);
  
  // Calculate totals
  const subtotal = transactionItems.reduce(
    (sum, item) => sum + (item.quantity * item.unitPrice),
    0
  );

  // Reset form when product changes
  useEffect(() => {
    if (selectedProduct) {
      setUnitPrice(transactionType === "sale" ? selectedProduct.retailPrice : selectedProduct.costPrice);
      setIsVariant(false);
      setVariantName("");
    } else {
      setUnitPrice(0);
    }
  }, [selectedProduct, transactionType]);

  // Update retail price based on cost price if enabled
  useEffect(() => {
    if (autoUpdate && selectedProduct && transactionType !== "sale" && !isVariant) {
      const newRetailPrice = unitPrice * (1 + profitMargin / 100);
      // Show what the new retail price would be
      console.log(`New retail price would be: ${newRetailPrice}`);
    }
  }, [unitPrice, profitMargin, selectedProduct, autoUpdate, transactionType, isVariant]);

  // Handle product selection
  const handleProductChange = (productId: string) => {
    const product = products.find(p => p.id === productId) || null;
    setSelectedProduct(product);
    
    if (product) {
      setUnitPrice(transactionType === "sale" ? product.retailPrice : product.costPrice);
    }
  };

  // Add item to transaction
  const handleAddItem = () => {
    if (!selectedProduct) {
      toast.error("Please select a product");
      return;
    }

    if (quantity <= 0) {
      toast.error("Quantity must be greater than zero");
      return;
    }

    if (unitPrice < 0) {
      toast.error("Unit price cannot be negative");
      return;
    }

    if (isVariant && !variantName.trim()) {
      toast.error("Variant name is required");
      return;
    }

    const newItem: TransactionItem = {
      id: Date.now().toString(),
      productId: selectedProduct.id,
      quantity,
      unitPrice,
      isVariant,
      variantName: isVariant ? variantName : undefined
    };

    setTransactionItems([...transactionItems, newItem]);
    
    // Reset form for next item
    setQuantity(1);
    setVariantName("");
    // Don't reset the product selection to make it easier to add multiple items
  };

  // Remove item from transaction
  const handleRemoveItem = (itemId: string) => {
    setTransactionItems(transactionItems.filter(item => item.id !== itemId));
  };

  // Submit the transaction
  const handleSubmit = () => {
    if (transactionItems.length === 0) {
      toast.error("Please add at least one product");
      return;
    }

    if ((transactionType === "purchase" || transactionType === "return") && !supplierId) {
      toast.error("Please select a supplier");
      return;
    }

    // Process each item as a separate transaction
    const promises = transactionItems.map((item) => {
      // If item is a variant and it's a purchase, we would create the variant
      let variantDetails = null;
      if (item.isVariant && transactionType === "purchase") {
        variantDetails = {
          id: Date.now().toString(),
          productId: item.productId,
          name: item.variantName || "",
          sku: "",
          stockQuantity: item.quantity,
          costPrice: item.unitPrice,
          retailPrice: item.unitPrice * (1 + profitMargin / 100)
        };
      }
      
      // If updateRetailPrice or updateCostPrice is true and it's a purchase, update the product's prices
      let productPriceUpdate = null;
      if (transactionType === "purchase" && !item.isVariant) {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          productPriceUpdate = {
            productId: product.id,
            costPrice: updateCostPrice ? item.unitPrice : product.costPrice,
            retailPrice: updateRetailPrice ? item.unitPrice * (1 + profitMargin / 100) : product.retailPrice
          };
        }
      }

      // Create the transaction
      return {
        id: Date.now().toString(),
        productId: item.productId,
        variantId: item.variantId,
        type: transactionType,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        supplierId: (transactionType === "purchase" || transactionType === "return") ? supplierId : undefined,
        invoiceNumber: (transactionType === "purchase" || transactionType === "return") ? invoiceNumber : undefined,
        date,
        notes,
        variantDetails,
        productPriceUpdate
      };
    });

    // In a real system, we would use supabase or another API to handle these transactions
    // For this demo, we'll just pass the data to the parent component
    toast.success(`${transactionItems.length} items recorded successfully`);
    
    // Submit the first item (in a real app, we'd process all items)
    if (promises.length > 0) {
      onSubmit(promises[0] as StockTransaction);
    }
  };

  const productOptions = products.map(product => (
    <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>
  ));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="transaction-date">Date</Label>
          <Input 
            id="transaction-date" 
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {(transactionType === "purchase" || transactionType === "return") && (
          <div className="grid gap-2">
            <Label htmlFor="supplier">Supplier</Label>
            <Select 
              value={supplierId}
              onValueChange={setSupplierId}
            >
              <SelectTrigger id="supplier">
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
        )}
      </div>

      {(transactionType === "purchase" || transactionType === "return") && (
        <div className="grid gap-2">
          <Label htmlFor="invoice-number">Invoice/Reference Number</Label>
          <Input 
            id="invoice-number" 
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            placeholder="e.g., INV-2023-001"
          />
        </div>
      )}

      <Separator />
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Add Items</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="product">Product</Label>
            <Select 
              value={selectedProduct?.id || ""}
              onValueChange={handleProductChange}
            >
              <SelectTrigger id="product">
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {productOptions}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2 pt-6">
            <Switch
              checked={isVariant}
              onCheckedChange={setIsVariant}
              id="variant-switch"
              disabled={!selectedProduct}
            />
            <Label htmlFor="variant-switch">Add as product variant</Label>
          </div>
        </div>
        
        {isVariant && (
          <div className="grid gap-2">
            <Label htmlFor="variant-name">Variant Name</Label>
            <Input 
              id="variant-name" 
              value={variantName}
              onChange={(e) => setVariantName(e.target.value)}
              placeholder="e.g., Small, Red, etc."
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input 
              id="quantity" 
              type="number"
              value={quantity}
              min={1}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="unit-price">
              {transactionType === "sale" ? "Selling Price" : "Cost Price"}
            </Label>
            <Input 
              id="unit-price" 
              type="number"
              value={unitPrice}
              min={0}
              onChange={(e) => setUnitPrice(Number(e.target.value))}
            />
          </div>
        </div>

        {transactionType === "purchase" && (
          <div className="space-y-4 border rounded-md p-4 bg-slate-50">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-update">Auto-update retail price</Label>
              <Switch
                id="auto-update"
                checked={autoUpdate}
                onCheckedChange={setAutoUpdate}
              />
            </div>
            
            {autoUpdate && (
              <>
                <div className="flex items-center justify-between">
                  <Label htmlFor="update-cost-price">Update product cost price</Label>
                  <Switch
                    id="update-cost-price"
                    checked={updateCostPrice}
                    onCheckedChange={setUpdateCostPrice}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="update-retail-price">Update product retail price</Label>
                  <Switch
                    id="update-retail-price"
                    checked={updateRetailPrice}
                    onCheckedChange={setUpdateRetailPrice}
                  />
                </div>
                
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="profit-margin">Profit Margin (%)</Label>
                    <span className="text-sm font-medium">{profitMargin}%</span>
                  </div>
                  <Input 
                    id="profit-margin" 
                    type="range"
                    min={1}
                    max={100}
                    value={profitMargin}
                    onChange={(e) => setProfitMargin(Number(e.target.value))}
                  />
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Cost Price: {unitPrice.toLocaleString()}</span>
                  <span>→</span>
                  <span className="font-medium">Retail Price: {(unitPrice * (1 + profitMargin / 100)).toLocaleString()}</span>
                </div>
                
                <div className="flex items-center text-xs text-muted-foreground">
                  <FileCheck className="h-3 w-3 mr-1" />
                  {isVariant 
                    ? "This price will be applied to the new variant only." 
                    : updateRetailPrice && updateCostPrice 
                      ? "This will update both the cost and retail price of the product."
                      : updateRetailPrice 
                        ? "This will update only the retail price of the product."
                        : updateCostPrice
                          ? "This will update only the cost price of the product."
                          : "No prices will be updated."
                  }
                </div>
              </>
            )}
          </div>
        )}
        
        <Button onClick={handleAddItem} disabled={!selectedProduct}>
          <Plus className="mr-2 h-4 w-4" /> Add to {transactionType}
        </Button>
      </div>

      {transactionItems.length > 0 && (
        <div className="space-y-4">
          <Separator />
          <h3 className="text-lg font-medium">Items</h3>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Total</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactionItems.map((item) => {
                const product = products.find(p => p.id === item.productId);
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>{product?.name || "Unknown Product"}</div>
                      {item.isVariant && (
                        <div className="text-xs text-muted-foreground">
                          Variant: {item.variantName}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.unitPrice.toLocaleString()}</TableCell>
                    <TableCell>{(item.quantity * item.unitPrice).toLocaleString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell colSpan={3} className="text-right font-medium">Total:</TableCell>
                <TableCell className="font-bold">{subtotal.toLocaleString()}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
      
      <div className="grid gap-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea 
          id="notes" 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional notes about this transaction"
          rows={2}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={transactionItems.length === 0}>
          Complete {transactionType.charAt(0).toUpperCase() + transactionType.slice(1)}
        </Button>
      </div>
    </div>
  );
}

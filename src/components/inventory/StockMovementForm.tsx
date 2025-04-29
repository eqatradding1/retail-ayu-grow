
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductSearchDialog } from "@/components/inventory/ProductSearchDialog";
import { Product } from "@/types/product";
import { Search, Plus, Minus } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface StockMovementFormProps {
  products: Product[];
  onSave: (data: any) => void;
}

export function StockMovementForm({ products, onSave }: StockMovementFormProps) {
  const [isProductSearchDialogOpen, setIsProductSearchDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [movementType, setMovementType] = useState<"in" | "out">("in");
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [updateCostPrice, setUpdateCostPrice] = useState(false);
  const [newCostPrice, setNewCostPrice] = useState(0);
  
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setNewCostPrice(product.costPrice);
  };
  
  const handleSave = () => {
    if (!selectedProduct) {
      toast.error("Please select a product");
      return;
    }
    
    if (quantity <= 0) {
      toast.error("Quantity must be greater than 0");
      return;
    }
    
    // In a real app, this would send data to your backend
    const movementData = {
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      movementType,
      quantity,
      previousStock: selectedProduct.stockQuantity,
      newStock: movementType === "in" 
        ? selectedProduct.stockQuantity + quantity 
        : selectedProduct.stockQuantity - quantity,
      costPriceUpdated: updateCostPrice,
      previousCostPrice: selectedProduct.costPrice,
      newCostPrice: updateCostPrice ? newCostPrice : selectedProduct.costPrice,
      notes,
      date: new Date().toISOString(),
    };
    
    onSave(movementData);
    
    // Reset form after save
    setSelectedProduct(null);
    setMovementType("in");
    setQuantity(1);
    setNotes("");
    setUpdateCostPrice(false);
    setNewCostPrice(0);
    
    toast.success("Stock movement recorded successfully");
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Stock Movement</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Product selection */}
        <div className="space-y-2">
          <Label>Product</Label>
          {selectedProduct ? (
            <div className="flex items-center justify-between border rounded-md p-3">
              <div>
                <div className="font-medium">{selectedProduct.name}</div>
                <div className="text-sm text-muted-foreground">
                  Current stock: {selectedProduct.stockQuantity}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsProductSearchDialogOpen(true)}
              >
                Change
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full flex justify-between items-center"
              onClick={() => setIsProductSearchDialogOpen(true)}
            >
              <span>Search products</span>
              <Search className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* Movement type */}
        <div className="space-y-2">
          <Label>Movement Type</Label>
          <div className="flex gap-2">
            <Button
              variant={movementType === "in" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setMovementType("in")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Stock In
            </Button>
            <Button
              variant={movementType === "out" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setMovementType("out")}
            >
              <Minus className="mr-2 h-4 w-4" />
              Stock Out
            </Button>
          </div>
        </div>
        
        {/* Quantity */}
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
          />
        </div>
        
        {/* Cost price section */}
        {movementType === "in" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="update-cost-price">Update Cost Price</Label>
              <Switch
                id="update-cost-price"
                checked={updateCostPrice}
                onCheckedChange={setUpdateCostPrice}
              />
            </div>
            
            {updateCostPrice && selectedProduct && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current Cost Price:</span>
                  <span>{selectedProduct.costPrice.toLocaleString()}</span>
                </div>
                <div>
                  <Label htmlFor="new-cost-price">New Cost Price</Label>
                  <Input
                    id="new-cost-price"
                    type="number"
                    value={newCostPrice}
                    onChange={(e) => setNewCostPrice(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Add notes about this stock movement"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleSave}
          disabled={!selectedProduct || quantity <= 0}
        >
          Record Movement
        </Button>
      </CardFooter>
      
      <ProductSearchDialog
        isOpen={isProductSearchDialogOpen}
        onOpenChange={setIsProductSearchDialogOpen}
        products={products}
        onSelectProduct={handleProductSelect}
      />
    </Card>
  );
}

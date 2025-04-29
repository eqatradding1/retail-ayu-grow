
import { useState } from "react";
import { ShoppingCart as CartIcon, X, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unitName: string;
  loyaltyPoints: number;
}

interface ShoppingCartProps {
  cart: CartItem[];
  selectedCustomer: { id: string; name: string; points: number } | null;
  removeFromCart: (index: number) => void;
  updateCartItemQuantity: (index: number, newQuantity: number) => void;
  onCheckout: () => void;
  usePoints: boolean;
  setUsePoints: (value: boolean) => void;
}

export function ShoppingCart({ 
  cart, 
  selectedCustomer, 
  removeFromCart, 
  updateCartItemQuantity, 
  onCheckout,
  usePoints,
  setUsePoints
}: ShoppingCartProps) {
  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const pointsDiscount = usePoints && selectedCustomer ? Math.min(selectedCustomer.points, subtotal) : 0;
  const total = subtotal - pointsDiscount;
  const totalPoints = cart.reduce((sum, item) => sum + (item.loyaltyPoints * item.quantity), 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <CartIcon className="h-5 w-5 mr-2" />
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
            onClick={onCheckout}
          >
            Pay Now
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

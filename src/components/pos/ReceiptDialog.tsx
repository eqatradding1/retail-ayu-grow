
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unitName: string;
  loyaltyPoints: number;
}

interface ReceiptDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  subtotal: number;
  pointsDiscount: number;
  total: number;
  totalPoints: number;
  selectedCustomer: { id: string; name: string; points: number } | null;
  paymentMethod: string;
  saleId: string | null;
  usePoints: boolean;
}

export function ReceiptDialog({ 
  isOpen, 
  onOpenChange, 
  cart,
  subtotal,
  pointsDiscount,
  total,
  totalPoints,
  selectedCustomer,
  paymentMethod,
  saleId,
  usePoints
}: ReceiptDialogProps) {
  const handlePrint = () => {
    toast.success("Receipt sent to printer");
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
            {saleId}
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
          <Button className="w-full" onClick={handlePrint}>
            Print Receipt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Banknote, CreditCard, Tag } from "lucide-react";

interface PaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  total: number;
  onComplete: () => void;
}

export function PaymentDialog({ isOpen, onOpenChange, total, onComplete }: PaymentDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "transfer" | "credit">("cash");

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onComplete}>Complete Sale</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

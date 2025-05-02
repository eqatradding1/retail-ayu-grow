
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Plus, X, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Product {
  id: string;
  name: string;
  barcode?: string;
  stockQuantity: number;
}

interface Reward {
  id: string;
  name: string;
  pointsCost: number;
  description: string;
  productIds?: string[];
}

interface Redemption {
  id: string;
  customerId: string;
  customerName: string;
  rewardId: string;
  rewardName: string;
  pointsCost: number;
  date: string;
  status: "pending" | "completed" | "cancelled";
  notes?: string;
}

interface Customer {
  id: string;
  name: string;
  loyaltyPoints: number;
}

interface RedemptionFormProps {
  rewards: Reward[];
  customers: Customer[];
  products?: Product[];
  onAddRedemption: (redemption: Redemption) => void;
}

export const RedemptionForm = ({
  rewards,
  customers,
  products = [],
  onAddRedemption,
}: RedemptionFormProps) => {
  const [open, setOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [selectedReward, setSelectedReward] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  
  // Get the selected reward's products
  const selectedRewardProducts = selectedReward
    ? rewards.find(r => r.id === selectedReward)?.productIds || []
    : [];
  
  // Get product details for the selected reward
  const rewardProductDetails = products
    .filter(p => selectedRewardProducts.includes(p.id));

  const handleSubmit = () => {
    const customer = customers.find((c) => c.id === selectedCustomer);
    const reward = rewards.find((r) => r.id === selectedReward);

    if (!customer || !reward) {
      toast.error("Please select both a customer and a reward");
      return;
    }

    if (customer.loyaltyPoints < reward.pointsCost) {
      toast.error("Customer doesn't have enough points for this reward");
      return;
    }

    const newRedemption: Redemption = {
      id: Date.now().toString(),
      customerId: customer.id,
      customerName: customer.name,
      rewardId: reward.id,
      rewardName: reward.name,
      pointsCost: reward.pointsCost,
      date: new Date().toISOString().split("T")[0],
      status: "pending",
      notes: notes || undefined,
    };

    onAddRedemption(newRedemption);
    toast.success("Redemption added successfully");
    setOpen(false);
    setSelectedCustomer("");
    setSelectedReward("");
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Redemption
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Redemption</DialogTitle>
          <DialogDescription>
            Redeem loyalty points for a customer reward.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="customer">Customer</Label>
            <Select
              value={selectedCustomer}
              onValueChange={setSelectedCustomer}
            >
              <SelectTrigger id="customer">
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name} - {customer.loyaltyPoints} points
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="reward">Reward</Label>
            <Select value={selectedReward} onValueChange={setSelectedReward}>
              <SelectTrigger id="reward">
                <SelectValue placeholder="Select reward" />
              </SelectTrigger>
              <SelectContent>
                {rewards.map((reward) => (
                  <SelectItem key={reward.id} value={reward.id}>
                    {reward.name} ({reward.pointsCost} points)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedReward && (
            <div className="text-sm bg-muted p-3 rounded-md">
              <p className="font-medium">
                {rewards.find((r) => r.id === selectedReward)?.name}
              </p>
              <p className="text-muted-foreground mt-1">
                {rewards.find((r) => r.id === selectedReward)?.description}
              </p>
              <p className="text-muted-foreground mt-1 font-medium">
                Cost: {rewards.find((r) => r.id === selectedReward)?.pointsCost}{" "}
                points
              </p>
              
              {rewardProductDetails.length > 0 && (
                <div className="mt-3">
                  <p className="font-medium mb-1">Included Products:</p>
                  <div className="flex flex-wrap gap-1">
                    {rewardProductDetails.map(product => (
                      <Badge key={product.id} variant="outline" className="text-xs">
                        {product.name} {product.stockQuantity < 1 && <span className="text-red-500">(Out of stock)</span>}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this redemption"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Redemption</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RedemptionForm;

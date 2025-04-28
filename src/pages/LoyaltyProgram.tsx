
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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/sonner";
import { BadgePlus, Search, Users, Gift, Star, Award } from "lucide-react";
import { Product } from "@/types/product";

// Mock data for products that can be redeemed
const redeemableProducts: Product[] = [
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

// Mock data for loyalty rewards
interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  productId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const initialRewards: LoyaltyReward[] = [
  {
    id: "1",
    name: "Free Rice Pack",
    description: "Get a free pack of premium rice",
    pointsRequired: 2000,
    productId: "1",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    name: "50% Discount",
    description: "50% discount on your next purchase",
    pointsRequired: 3000,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Mock data for customer redemptions
interface CustomerRedemption {
  id: string;
  customerId: string;
  customerName: string;
  rewardId: string;
  rewardName: string;
  pointsUsed: number;
  redeemedAt: string;
}

const initialRedemptions: CustomerRedemption[] = [
  {
    id: "1",
    customerId: "101",
    customerName: "John Doe",
    rewardId: "1",
    rewardName: "Free Rice Pack",
    pointsUsed: 2000,
    redeemedAt: new Date().toISOString()
  },
  {
    id: "2",
    customerId: "102",
    customerName: "Jane Smith",
    rewardId: "2",
    rewardName: "50% Discount",
    pointsUsed: 3000,
    redeemedAt: new Date(Date.now() - 86400000).toISOString() // Yesterday
  }
];

export default function LoyaltyProgram() {
  const [rewards, setRewards] = useState<LoyaltyReward[]>(initialRewards);
  const [redemptions, setRedemptions] = useState<CustomerRedemption[]>(initialRedemptions);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentReward, setCurrentReward] = useState<LoyaltyReward | null>(null);
  
  const [newReward, setNewReward] = useState({
    name: "",
    description: "",
    pointsRequired: 1000,
    productId: "",
    isActive: true
  });

  // Filter rewards based on search term
  const filteredRewards = searchTerm
    ? rewards.filter(reward => 
        reward.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reward.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : rewards;

  // Filter redemptions based on search term
  const filteredRedemptions = searchTerm
    ? redemptions.filter(redemption =>
        redemption.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        redemption.rewardName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : redemptions;

  const handleAddReward = () => {
    const reward: LoyaltyReward = {
      id: Date.now().toString(),
      name: newReward.name,
      description: newReward.description,
      pointsRequired: newReward.pointsRequired,
      productId: newReward.productId || undefined,
      isActive: newReward.isActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setRewards([...rewards, reward]);
    setIsAddDialogOpen(false);
    setNewReward({
      name: "",
      description: "",
      pointsRequired: 1000,
      productId: "",
      isActive: true
    });
    toast.success("Reward added successfully");
  };

  const handleEditReward = () => {
    if (!currentReward) return;

    const updatedRewards = rewards.map(reward =>
      reward.id === currentReward.id ? {
        ...currentReward,
        updatedAt: new Date().toISOString()
      } : reward
    );

    setRewards(updatedRewards);
    setIsEditDialogOpen(false);
    toast.success("Reward updated successfully");
  };

  const toggleRewardStatus = (rewardId: string) => {
    const updatedRewards = rewards.map(reward =>
      reward.id === rewardId ? {
        ...reward,
        isActive: !reward.isActive,
        updatedAt: new Date().toISOString()
      } : reward
    );

    setRewards(updatedRewards);
    toast.success("Reward status updated");
  };

  const getProductName = (productId?: string) => {
    if (!productId) return "N/A";
    const product = redeemableProducts.find(p => p.id === productId);
    return product ? product.name : "Unknown Product";
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Loyalty Program</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <BadgePlus className="mr-2 h-4 w-4" /> Add Reward
        </Button>
      </div>

      <Tabs defaultValue="rewards" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="rewards">
            <Gift className="mr-2 h-4 w-4" />
            Rewards
          </TabsTrigger>
          <TabsTrigger value="redemptions">
            <Star className="mr-2 h-4 w-4" />
            Redemptions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rewards">
          <Card>
            <CardHeader>
              <CardTitle>Loyalty Rewards</CardTitle>
              <CardDescription>
                Manage your loyalty rewards program
              </CardDescription>
              <div className="relative flex mt-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                  type="search" 
                  placeholder="Search rewards..." 
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
                    <TableHead>Reward Name</TableHead>
                    <TableHead>Points Required</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRewards.map((reward) => (
                    <TableRow key={reward.id}>
                      <TableCell className="font-medium">
                        <div className="font-medium">{reward.name}</div>
                        <div className="text-sm text-muted-foreground">{reward.description}</div>
                      </TableCell>
                      <TableCell>{reward.pointsRequired.toLocaleString()}</TableCell>
                      <TableCell>{getProductName(reward.productId)}</TableCell>
                      <TableCell>
                        {reward.isActive ? (
                          <Badge variant="default" className="bg-green-500">Active</Badge>
                        ) : (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setCurrentReward(reward);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRewardStatus(reward.id)}
                        >
                          {reward.isActive ? "Deactivate" : "Activate"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="redemptions">
          <Card>
            <CardHeader>
              <CardTitle>Customer Redemptions</CardTitle>
              <CardDescription>
                History of reward redemptions by customers
              </CardDescription>
              <div className="relative flex mt-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                  type="search" 
                  placeholder="Search redemptions..." 
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
                    <TableHead>Customer</TableHead>
                    <TableHead>Reward</TableHead>
                    <TableHead>Points Used</TableHead>
                    <TableHead>Redemption Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRedemptions.map((redemption) => (
                    <TableRow key={redemption.id}>
                      <TableCell className="font-medium">{redemption.customerName}</TableCell>
                      <TableCell>{redemption.rewardName}</TableCell>
                      <TableCell>{redemption.pointsUsed.toLocaleString()}</TableCell>
                      <TableCell>{new Date(redemption.redeemedAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Reward Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Reward</DialogTitle>
            <DialogDescription>
              Create a new loyalty reward for your customers.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Reward Name</Label>
              <Input 
                id="name" 
                value={newReward.name}
                onChange={(e) => setNewReward({...newReward, name: e.target.value})}
                placeholder="e.g., Free Product"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description" 
                value={newReward.description}
                onChange={(e) => setNewReward({...newReward, description: e.target.value})}
                placeholder="Describe the reward"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pointsRequired">Points Required</Label>
              <Input 
                id="pointsRequired" 
                type="number"
                value={newReward.pointsRequired}
                onChange={(e) => setNewReward({...newReward, pointsRequired: Number(e.target.value)})}
                min={1}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="product">Associated Product (Optional)</Label>
              <select
                id="product"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newReward.productId}
                onChange={(e) => setNewReward({...newReward, productId: e.target.value})}
              >
                <option value="">-- Select Product --</option>
                {redeemableProducts.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="isActive" 
                checked={newReward.isActive}
                onCheckedChange={(checked) => 
                  setNewReward({...newReward, isActive: checked === true})
                }
              />
              <Label htmlFor="isActive">Active Reward</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddReward}>Add Reward</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Reward Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Reward</DialogTitle>
            <DialogDescription>
              Make changes to the loyalty reward.
            </DialogDescription>
          </DialogHeader>
          {currentReward && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Reward Name</Label>
                <Input 
                  id="edit-name" 
                  value={currentReward.name}
                  onChange={(e) => setCurrentReward({...currentReward, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input 
                  id="edit-description" 
                  value={currentReward.description}
                  onChange={(e) => setCurrentReward({...currentReward, description: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-pointsRequired">Points Required</Label>
                <Input 
                  id="edit-pointsRequired" 
                  type="number"
                  value={currentReward.pointsRequired}
                  onChange={(e) => setCurrentReward({...currentReward, pointsRequired: Number(e.target.value)})}
                  min={1}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-product">Associated Product (Optional)</Label>
                <select
                  id="edit-product"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={currentReward.productId || ""}
                  onChange={(e) => setCurrentReward({...currentReward, productId: e.target.value || undefined})}
                >
                  <option value="">-- Select Product --</option>
                  {redeemableProducts.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="edit-isActive" 
                  checked={currentReward.isActive}
                  onCheckedChange={(checked) => 
                    setCurrentReward({...currentReward, isActive: checked === true})
                  }
                />
                <Label htmlFor="edit-isActive">Active Reward</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditReward}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Plus, Edit, Trash, Check, X, Gift, Search } from "lucide-react";
import { RedemptionForm } from "@/components/loyalty/RedemptionForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

// Define types
interface Product {
  id: string;
  name: string;
  barcode?: string;
  stockQuantity: number;
  retailPrice: number;
}

interface Reward {
  id: string;
  name: string;
  pointsCost: number;
  description: string;
  isActive: boolean;
  productIds?: string[];
}

interface Rule {
  id: string;
  name: string;
  type: "purchase" | "referral" | "signup" | "review";
  pointsAwarded: number;
  condition?: string;
  isActive: boolean;
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

// Mock data
const initialRewards: Reward[] = [
  {
    id: "1",
    name: "Free Coffee",
    pointsCost: 100,
    description: "Enjoy a free coffee of your choice",
    isActive: true,
    productIds: ["101"]
  },
  {
    id: "2",
    name: "10% Off Next Purchase",
    pointsCost: 200,
    description: "Get 10% off on your next purchase",
    isActive: true,
  },
  {
    id: "3",
    name: "$25 Gift Card",
    pointsCost: 500,
    description: "Receive a $25 gift card",
    isActive: true,
  },
];

const initialRules: Rule[] = [
  {
    id: "1",
    name: "Purchase",
    type: "purchase",
    pointsAwarded: 1,
    condition: "Per 5,000 spent",
    isActive: true,
  },
  {
    id: "2",
    name: "Referral",
    type: "referral",
    pointsAwarded: 50,
    condition: "When a referred friend makes their first purchase",
    isActive: true,
  },
  {
    id: "3",
    name: "Sign Up",
    type: "signup",
    pointsAwarded: 20,
    condition: "When a new customer creates an account",
    isActive: true,
  },
];

// Mock products for reward selection
const mockProducts: Product[] = [
  { id: "101", name: "Arabica Coffee", stockQuantity: 25, retailPrice: 15000 },
  { id: "102", name: "Robusta Coffee", stockQuantity: 30, retailPrice: 12000 },
  { id: "103", name: "Cappuccino", stockQuantity: 0, retailPrice: 18000 },
  { id: "104", name: "Latte", stockQuantity: 15, retailPrice: 20000 },
  { id: "105", name: "Espresso", stockQuantity: 40, retailPrice: 14000 },
];

// Mock customers for redemption
const mockCustomers: Customer[] = [
  { id: "1", name: "John Doe", loyaltyPoints: 250 },
  { id: "2", name: "Jane Smith", loyaltyPoints: 175 },
  { id: "3", name: "Robert Johnson", loyaltyPoints: 540 },
];

const initialRedemptions: Redemption[] = [
  {
    id: "1",
    customerId: "1",
    customerName: "John Doe",
    rewardId: "1",
    rewardName: "Free Coffee",
    pointsCost: 100,
    date: "2023-04-15",
    status: "completed"
  },
  {
    id: "2",
    customerId: "3",
    customerName: "Robert Johnson",
    rewardId: "2",
    rewardName: "10% Off Next Purchase",
    pointsCost: 200,
    date: "2023-04-20",
    status: "pending"
  }
];

export default function LoyaltyProgram() {
  const [activeTab, setActiveTab] = useState("rewards");
  const [rewards, setRewards] = useState<Reward[]>(initialRewards);
  const [rules, setRules] = useState<Rule[]>(initialRules);
  const [redemptions, setRedemptions] = useState<Redemption[]>(initialRedemptions);
  const [products] = useState<Product[]>(mockProducts);
  
  // Search states
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  
  // Dialog states
  const [isAddRewardOpen, setIsAddRewardOpen] = useState(false);
  const [isEditRewardOpen, setIsEditRewardOpen] = useState(false);
  const [isDeleteRewardOpen, setIsDeleteRewardOpen] = useState(false);
  
  const [isAddRuleOpen, setIsAddRuleOpen] = useState(false);
  const [isEditRuleOpen, setIsEditRuleOpen] = useState(false);
  const [isDeleteRuleOpen, setIsDeleteRuleOpen] = useState(false);
  
  const [isUpdateRedemptionOpen, setIsUpdateRedemptionOpen] = useState(false);
  const [isDeleteRedemptionOpen, setIsDeleteRedemptionOpen] = useState(false);

  // Form states
  const [currentReward, setCurrentReward] = useState<Reward | null>(null);
  const [currentRule, setCurrentRule] = useState<Rule | null>(null);
  const [currentRedemption, setCurrentRedemption] = useState<Redemption | null>(null);
  
  const [newReward, setNewReward] = useState<Omit<Reward, "id" | "isActive">>({
    name: "",
    pointsCost: 0,
    description: "",
    productIds: [],
  });
  
  const [newRule, setNewRule] = useState<Omit<Rule, "id" | "isActive">>({
    name: "",
    type: "purchase",
    pointsAwarded: 0,
    condition: "",
  });

  // Filter products based on search term
  const filteredProducts = productSearchTerm
    ? products.filter(product => 
        product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
        (product.barcode && product.barcode.includes(productSearchTerm))
      )
    : products;

  // Toggle product selection
  const toggleProductSelection = (productId: string) => {
    if (isAddRewardOpen) {
      setNewReward(prev => {
        const currentIds = prev.productIds || [];
        return {
          ...prev,
          productIds: currentIds.includes(productId)
            ? currentIds.filter(id => id !== productId)
            : [...currentIds, productId]
        };
      });
    } else if (isEditRewardOpen && currentReward) {
      setCurrentReward(prev => {
        if (!prev) return prev;
        const currentIds = prev.productIds || [];
        return {
          ...prev,
          productIds: currentIds.includes(productId)
            ? currentIds.filter(id => id !== productId)
            : [...currentIds, productId]
        };
      });
    }
  };

  // Add new reward
  const handleAddReward = () => {
    if (!newReward.name || newReward.pointsCost <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const reward: Reward = {
      id: Date.now().toString(),
      ...newReward,
      isActive: true,
    };
    
    setRewards([...rewards, reward]);
    setIsAddRewardOpen(false);
    setNewReward({
      name: "",
      pointsCost: 0,
      description: "",
      productIds: [],
    });
    toast.success("Reward added successfully");
  };

  // Update reward
  const handleUpdateReward = () => {
    if (!currentReward) return;
    
    setRewards(rewards.map(reward => 
      reward.id === currentReward.id ? currentReward : reward
    ));
    
    setIsEditRewardOpen(false);
    toast.success("Reward updated successfully");
  };

  // Delete reward
  const handleDeleteReward = () => {
    if (!currentReward) return;
    
    setRewards(rewards.filter(reward => reward.id !== currentReward.id));
    setIsDeleteRewardOpen(false);
    toast.success("Reward deleted successfully");
  };

  // Add new rule
  const handleAddRule = () => {
    if (!newRule.name || newRule.pointsAwarded <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const rule: Rule = {
      id: Date.now().toString(),
      ...newRule,
      isActive: true,
    };
    
    setRules([...rules, rule]);
    setIsAddRuleOpen(false);
    setNewRule({
      name: "",
      type: "purchase",
      pointsAwarded: 0,
      condition: "",
    });
    toast.success("Rule added successfully");
  };

  // Update rule
  const handleUpdateRule = () => {
    if (!currentRule) return;
    
    setRules(rules.map(rule => 
      rule.id === currentRule.id ? currentRule : rule
    ));
    
    setIsEditRuleOpen(false);
    toast.success("Rule updated successfully");
  };

  // Delete rule
  const handleDeleteRule = () => {
    if (!currentRule) return;
    
    setRules(rules.filter(rule => rule.id !== currentRule.id));
    setIsDeleteRuleOpen(false);
    toast.success("Rule deleted successfully");
  };
  
  // Toggle rule/reward active status
  const toggleActiveStatus = (
    type: "rule" | "reward",
    id: string,
    currentStatus: boolean
  ) => {
    if (type === "rule") {
      setRules(
        rules.map((rule) =>
          rule.id === id ? { ...rule, isActive: !currentStatus } : rule
        )
      );
    } else {
      setRewards(
        rewards.map((reward) =>
          reward.id === id ? { ...reward, isActive: !currentStatus } : reward
        )
      );
    }
    toast.success(`${type} status updated successfully`);
  };

  // Add redemption
  const handleAddRedemption = (redemption: Redemption) => {
    setRedemptions([...redemptions, redemption]);
  };

  // Update redemption status
  const handleUpdateRedemptionStatus = (status: "completed" | "cancelled") => {
    if (!currentRedemption) return;
    
    setRedemptions(redemptions.map(redemption => 
      redemption.id === currentRedemption.id 
        ? { ...currentRedemption, status } 
        : redemption
    ));
    
    setIsUpdateRedemptionOpen(false);
    
    if (status === "completed") {
      toast.success("Redemption marked as completed");
    } else {
      toast.success("Redemption cancelled");
    }
  };
  
  // Delete redemption
  const handleDeleteRedemption = () => {
    if (!currentRedemption) return;
    
    setRedemptions(redemptions.filter(redemption => redemption.id !== currentRedemption.id));
    setIsDeleteRedemptionOpen(false);
    toast.success("Redemption deleted successfully");
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Loyalty Program</h1>
          <p className="text-muted-foreground">
            Manage your loyalty program rewards and rules
          </p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button variant="outline">View Program Statistics</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="redemptions">Redemptions</TabsTrigger>
        </TabsList>

        {/* Rewards Tab */}
        <TabsContent value="rewards" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Available Rewards</CardTitle>
                <CardDescription>
                  Rewards that customers can redeem with their points
                </CardDescription>
              </div>
              <Button onClick={() => setIsAddRewardOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Reward
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reward</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Points Cost</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rewards.map((reward) => (
                    <TableRow key={reward.id}>
                      <TableCell className="font-medium">{reward.name}</TableCell>
                      <TableCell>{reward.description}</TableCell>
                      <TableCell>{reward.pointsCost}</TableCell>
                      <TableCell>
                        {reward.productIds && reward.productIds.length > 0 ? (
                          <span>{reward.productIds.length} products</span>
                        ) : (
                          <span className="text-muted-foreground">None</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={reward.isActive ? "default" : "secondary"}>
                          {reward.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setCurrentReward(reward);
                            setIsEditRewardOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleActiveStatus("reward", reward.id, reward.isActive)}
                        >
                          {reward.isActive ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setCurrentReward(reward);
                            setIsDeleteRewardOpen(true);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rules Tab */}
        <TabsContent value="rules" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Point Earning Rules</CardTitle>
                <CardDescription>
                  Define how customers earn loyalty points
                </CardDescription>
              </div>
              <Button onClick={() => setIsAddRuleOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Rule
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Points Awarded</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.name}</TableCell>
                      <TableCell className="capitalize">{rule.type}</TableCell>
                      <TableCell>{rule.pointsAwarded}</TableCell>
                      <TableCell>{rule.condition}</TableCell>
                      <TableCell>
                        <Badge variant={rule.isActive ? "default" : "secondary"}>
                          {rule.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setCurrentRule(rule);
                            setIsEditRuleOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleActiveStatus("rule", rule.id, rule.isActive)}
                        >
                          {rule.isActive ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setCurrentRule(rule);
                            setIsDeleteRuleOpen(true);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Redemptions Tab */}
        <TabsContent value="redemptions" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Redemption History</CardTitle>
                <CardDescription>
                  Track customer reward redemptions
                </CardDescription>
              </div>
              <RedemptionForm 
                rewards={rewards.filter(r => r.isActive)} 
                customers={mockCustomers}
                products={products}
                onAddRedemption={handleAddRedemption}
              />
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Reward</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {redemptions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        No redemptions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    redemptions.map((redemption) => (
                      <TableRow key={redemption.id}>
                        <TableCell>{redemption.date}</TableCell>
                        <TableCell className="font-medium">{redemption.customerName}</TableCell>
                        <TableCell>{redemption.rewardName}</TableCell>
                        <TableCell>{redemption.pointsCost}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              redemption.status === "completed" ? "default" :
                              redemption.status === "cancelled" ? "destructive" : 
                              "outline"
                            }
                          >
                            {redemption.status.charAt(0).toUpperCase() + redemption.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">
                            {redemption.status === "pending" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setCurrentRedemption(redemption);
                                  setIsUpdateRedemptionOpen(true);
                                }}
                              >
                                <Gift className="h-4 w-4 mr-1" />
                                Process
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                setCurrentRedemption(redemption);
                                setIsDeleteRedemptionOpen(true);
                              }}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Reward Dialog */}
      <Dialog open={isAddRewardOpen} onOpenChange={setIsAddRewardOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Reward</DialogTitle>
            <DialogDescription>
              Create a new reward that customers can redeem with their points.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reward-name">Reward Name</Label>
              <Input
                id="reward-name"
                value={newReward.name}
                onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
                placeholder="e.g., Free Coffee"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="points-cost">Points Cost</Label>
              <Input
                id="points-cost"
                type="number"
                min="1"
                value={newReward.pointsCost || ""}
                onChange={(e) => setNewReward({ ...newReward, pointsCost: parseInt(e.target.value) })}
                placeholder="e.g., 100"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reward-description">Description</Label>
              <Textarea
                id="reward-description"
                value={newReward.description}
                onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
                placeholder="Describe this reward"
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Associated Products</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8 w-full"
                  value={productSearchTerm}
                  onChange={(e) => setProductSearchTerm(e.target.value)}
                />
              </div>
              
              <ScrollArea className="h-[200px] border rounded-md p-2">
                <div className="space-y-2">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md"
                    >
                      <Checkbox
                        id={`product-${product.id}`}
                        checked={(newReward.productIds || []).includes(product.id)}
                        onCheckedChange={() => toggleProductSelection(product.id)}
                      />
                      <Label
                        htmlFor={`product-${product.id}`}
                        className="flex-1 cursor-pointer text-sm"
                      >
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-muted-foreground flex justify-between">
                          <span>Stock: {product.stockQuantity}</span>
                          <span>Price: {product.retailPrice.toLocaleString()}</span>
                        </div>
                      </Label>
                    </div>
                  ))}
                  
                  {filteredProducts.length === 0 && (
                    <p className="text-sm text-muted-foreground p-2">No products found.</p>
                  )}
                </div>
              </ScrollArea>
              
              {(newReward.productIds || []).length > 0 && (
                <div className="mt-2 text-sm">
                  <span className="font-medium">{(newReward.productIds || []).length} product(s) selected</span>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddRewardOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddReward}>Add Reward</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Reward Dialog */}
      <Dialog open={isEditRewardOpen} onOpenChange={setIsEditRewardOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Reward</DialogTitle>
            <DialogDescription>
              Update the details of this reward.
            </DialogDescription>
          </DialogHeader>
          {currentReward && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-reward-name">Reward Name</Label>
                <Input
                  id="edit-reward-name"
                  value={currentReward.name}
                  onChange={(e) => setCurrentReward({ ...currentReward, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-points-cost">Points Cost</Label>
                <Input
                  id="edit-points-cost"
                  type="number"
                  min="1"
                  value={currentReward.pointsCost}
                  onChange={(e) => setCurrentReward({ ...currentReward, pointsCost: parseInt(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-reward-description">Description</Label>
                <Textarea
                  id="edit-reward-description"
                  value={currentReward.description}
                  onChange={(e) => setCurrentReward({ ...currentReward, description: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="grid gap-2">
                <Label>Associated Products</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-8 w-full"
                    value={productSearchTerm}
                    onChange={(e) => setProductSearchTerm(e.target.value)}
                  />
                </div>
                
                <ScrollArea className="h-[200px] border rounded-md p-2">
                  <div className="space-y-2">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md"
                      >
                        <Checkbox
                          id={`edit-product-${product.id}`}
                          checked={(currentReward.productIds || []).includes(product.id)}
                          onCheckedChange={() => toggleProductSelection(product.id)}
                        />
                        <Label
                          htmlFor={`edit-product-${product.id}`}
                          className="flex-1 cursor-pointer text-sm"
                        >
                          <div className="font-medium">{product.name}</div>
                          <div className="text-xs text-muted-foreground flex justify-between">
                            <span>Stock: {product.stockQuantity}</span>
                            <span>Price: {product.retailPrice.toLocaleString()}</span>
                          </div>
                        </Label>
                      </div>
                    ))}
                    
                    {filteredProducts.length === 0 && (
                      <p className="text-sm text-muted-foreground p-2">No products found.</p>
                    )}
                  </div>
                </ScrollArea>
                
                {(currentReward.productIds || []).length > 0 && (
                  <div className="mt-2 text-sm">
                    <span className="font-medium">{(currentReward.productIds || []).length} product(s) selected</span>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditRewardOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateReward}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Reward Dialog */}
      <Dialog open={isDeleteRewardOpen} onOpenChange={setIsDeleteRewardOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Reward</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this reward?
            </DialogDescription>
          </DialogHeader>
          <p>
            This will permanently delete the "{currentReward?.name}" reward.
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteRewardOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteReward}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Rule Dialog */}
      <Dialog open={isAddRuleOpen} onOpenChange={setIsAddRuleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Rule</DialogTitle>
            <DialogDescription>
              Create a new rule for earning loyalty points.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="rule-name">Rule Name</Label>
              <Input
                id="rule-name"
                value={newRule.name}
                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                placeholder="e.g., Purchase Points"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rule-type">Rule Type</Label>
              <Select
                value={newRule.type}
                onValueChange={(value) => setNewRule({ ...newRule, type: value as any })}
              >
                <SelectTrigger id="rule-type">
                  <SelectValue placeholder="Select rule type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="signup">Sign Up</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="points-awarded">Points Awarded</Label>
              <Input
                id="points-awarded"
                type="number"
                min="1"
                value={newRule.pointsAwarded || ""}
                onChange={(e) => setNewRule({ ...newRule, pointsAwarded: parseInt(e.target.value) })}
                placeholder="e.g., 10"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rule-condition">Condition (Optional)</Label>
              <Input
                id="rule-condition"
                value={newRule.condition || ""}
                onChange={(e) => setNewRule({ ...newRule, condition: e.target.value })}
                placeholder="e.g., Per 10,000 spent"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddRuleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRule}>Add Rule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Rule Dialog */}
      <Dialog open={isEditRuleOpen} onOpenChange={setIsEditRuleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Rule</DialogTitle>
            <DialogDescription>
              Update the details of this rule.
            </DialogDescription>
          </DialogHeader>
          {currentRule && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-rule-name">Rule Name</Label>
                <Input
                  id="edit-rule-name"
                  value={currentRule.name}
                  onChange={(e) => setCurrentRule({ ...currentRule, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-rule-type">Rule Type</Label>
                <Select
                  value={currentRule.type}
                  onValueChange={(value) => setCurrentRule({ ...currentRule, type: value as any })}
                >
                  <SelectTrigger id="edit-rule-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="purchase">Purchase</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="signup">Sign Up</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-points-awarded">Points Awarded</Label>
                <Input
                  id="edit-points-awarded"
                  type="number"
                  min="1"
                  value={currentRule.pointsAwarded}
                  onChange={(e) => setCurrentRule({ ...currentRule, pointsAwarded: parseInt(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-rule-condition">Condition (Optional)</Label>
                <Input
                  id="edit-rule-condition"
                  value={currentRule.condition || ""}
                  onChange={(e) => setCurrentRule({ ...currentRule, condition: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditRuleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRule}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Rule Dialog */}
      <Dialog open={isDeleteRuleOpen} onOpenChange={setIsDeleteRuleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Rule</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this rule?
            </DialogDescription>
          </DialogHeader>
          <p>
            This will permanently delete the "{currentRule?.name}" rule.
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteRuleOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteRule}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Redemption Status Dialog */}
      <Dialog open={isUpdateRedemptionOpen} onOpenChange={setIsUpdateRedemptionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Redemption</DialogTitle>
            <DialogDescription>
              Update the status of this redemption request.
            </DialogDescription>
          </DialogHeader>
          {currentRedemption && (
            <div className="py-4">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="font-medium">Customer:</span>
                  <span>{currentRedemption.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Reward:</span>
                  <span>{currentRedemption.rewardName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Points:</span>
                  <span>{currentRedemption.pointsCost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Date:</span>
                  <span>{currentRedemption.date}</span>
                </div>
                {currentRedemption.notes && (
                  <div className="pt-2">
                    <span className="font-medium">Notes:</span>
                    <p className="text-sm">{currentRedemption.notes}</p>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">
                  Mark this redemption as completed when the customer has received their reward,
                  or cancel if it cannot be fulfilled.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => handleUpdateRedemptionStatus("cancelled")}
            >
              Cancel Redemption
            </Button>
            <Button 
              onClick={() => handleUpdateRedemptionStatus("completed")}
              variant="default"
            >
              Mark as Completed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Redemption Dialog */}
      <Dialog open={isDeleteRedemptionOpen} onOpenChange={setIsDeleteRedemptionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Redemption</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this redemption record?
            </DialogDescription>
          </DialogHeader>
          {currentRedemption && (
            <p>
              This will permanently delete the redemption record for {currentRedemption.customerName} ({currentRedemption.rewardName}).
              This action cannot be undone.
            </p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteRedemptionOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteRedemption}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

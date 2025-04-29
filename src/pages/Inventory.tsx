
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StockMovementForm } from "@/components/inventory/StockMovementForm";

// Mock product data - this would be fetched from your database
const mockProducts = [
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

// Mock stock movements
const initialStockMovements = [
  {
    id: "sm1",
    productId: "1",
    productName: "Rice",
    movementType: "in",
    quantity: 20,
    previousStock: 30,
    newStock: 50,
    costPriceUpdated: true,
    previousCostPrice: 14500,
    newCostPrice: 15000,
    notes: "Monthly restock",
    date: "2023-04-20T10:30:00Z",
  },
  {
    id: "sm2",
    productId: "2",
    productName: "Sugar",
    movementType: "in",
    quantity: 15,
    previousStock: 25,
    newStock: 40,
    costPriceUpdated: false,
    previousCostPrice: 12000,
    newCostPrice: 12000,
    notes: "Regular supplier delivery",
    date: "2023-04-19T14:15:00Z",
  },
  {
    id: "sm3",
    productId: "3",
    productName: "Coffee",
    movementType: "out",
    quantity: 5,
    previousStock: 30,
    newStock: 25,
    costPriceUpdated: false,
    previousCostPrice: 25000,
    newCostPrice: 25000,
    notes: "Damaged inventory removal",
    date: "2023-04-18T09:45:00Z",
  },
];

export default function Inventory() {
  const [products, setProducts] = useState(mockProducts);
  const [stockMovements, setStockMovements] = useState(initialStockMovements);
  const [activeTab, setActiveTab] = useState("products");
  
  const handleStockMovementSave = (movementData: any) => {
    // Generate a unique ID for the new movement
    const newMovement = {
      id: `sm${Date.now()}`,
      ...movementData,
    };
    
    // Add the new movement to the list
    setStockMovements([newMovement, ...stockMovements]);
    
    // Update product stock (and cost price if applicable)
    setProducts(prevProducts => 
      prevProducts.map(product => {
        if (product.id === movementData.productId) {
          return {
            ...product,
            stockQuantity: movementData.newStock,
            costPrice: movementData.costPriceUpdated ? movementData.newCostPrice : product.costPrice
          };
        }
        return product;
      })
    );
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Inventory Management</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="movement">Stock Movement</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Product List</CardTitle>
                <CardDescription>
                  View and manage your product inventory
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Min Level</TableHead>
                      <TableHead>Cost Price</TableHead>
                      <TableHead>Retail Price</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map(product => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.stockQuantity}</TableCell>
                        <TableCell>{product.minStockLevel}</TableCell>
                        <TableCell>{product.costPrice.toLocaleString()}</TableCell>
                        <TableCell>{product.retailPrice.toLocaleString()}</TableCell>
                        <TableCell>
                          {product.stockQuantity <= product.minStockLevel ? (
                            <Badge variant="destructive">Low Stock</Badge>
                          ) : product.stockQuantity <= product.minStockLevel * 1.5 ? (
                            <Badge variant="outline">Restock Soon</Badge>
                          ) : (
                            <Badge variant="default">In Stock</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="movement">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stock movement form */}
              <div>
                <StockMovementForm 
                  products={products} 
                  onSave={handleStockMovementSave}
                />
              </div>
              
              {/* Stock movement history */}
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Stock Movement History</CardTitle>
                    <CardDescription>
                      Recent inventory changes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Cost Price</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stockMovements.map((movement) => (
                          <TableRow key={movement.id}>
                            <TableCell>{new Date(movement.date).toLocaleString()}</TableCell>
                            <TableCell className="font-medium">{movement.productName}</TableCell>
                            <TableCell>
                              <Badge variant={movement.movementType === "in" ? "default" : "outline"}>
                                {movement.movementType === "in" ? "Stock In" : "Stock Out"}
                              </Badge>
                            </TableCell>
                            <TableCell>{movement.quantity}</TableCell>
                            <TableCell>
                              {movement.costPriceUpdated ? (
                                <span className="text-amber-600">
                                  {movement.previousCostPrice.toLocaleString()} → {movement.newCostPrice.toLocaleString()}
                                </span>
                              ) : (
                                movement.newCostPrice.toLocaleString()
                              )}
                            </TableCell>
                            <TableCell>{movement.notes || "-"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Reports</CardTitle>
                <CardDescription>
                  Generate and view inventory reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-48 bg-muted/10">
                  <p className="text-muted-foreground">Report functionality coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

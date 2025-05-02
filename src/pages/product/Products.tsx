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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/sonner";
import { Pencil, Trash2, Plus, Barcode, Search, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product, PriceLevel, Category, Unit } from "@/types/product";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";

// Mock data for products - will be replaced with Supabase integration
const initialProducts: Product[] = [
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
    updatedAt: new Date().toISOString(),
    photoUrl: "https://source.unsplash.com/photo-1618160702438-9b02ab6515c9",
    expiryDate: "2025-12-31"
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
    updatedAt: new Date().toISOString(),
    photoUrl: "https://source.unsplash.com/photo-1465146344425-f00d5f5c8f07",
    expiryDate: "2025-10-15"
  }
];

// Mock data for categories and units - using what we've already defined in their pages
const initialCategories = [
  { id: "1", name: "Vegetables", description: "Fresh vegetables" },
  { id: "2", name: "Fruits", description: "Fresh fruits" },
  { id: "3", name: "Dairy", description: "Milk and dairy products" },
  { id: "4", name: "Bakery", description: "Breads and pastries" },
  { id: "5", name: "Groceries", description: "General groceries" }
];

const initialUnits = [
  { id: "1", name: "Kg", description: "Kilogram" },
  { id: "2", name: "g", description: "Gram" },
  { id: "3", name: "L", description: "Liter" },
  { id: "4", name: "ml", description: "Milliliter" },
  { id: "5", name: "pcs", description: "Pieces" }
];

export default function Products() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories] = useState<Category[]>(initialCategories);
  const [units] = useState<Unit[]>(initialUnits);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceLevels, setPriceLevels] = useState<PriceLevel[]>([
    { id: "temp1", minQuantity: 5, price: 0 },
    { id: "temp2", minQuantity: 10, price: 0 },
  ]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      barcode: "",
      description: "",
      categoryId: "",
      unitId: "",
      stockQuantity: 0,
      minStockLevel: 0,
      costPrice: 0,
      retailPrice: 0,
      loyaltyPoints: 0,
      photoUrl: "",
      expiryDate: ""
    },
  });

  const handleAddProduct = () => {
    // Form validation would go here
    const formValues = form.getValues();
    
    // Create a new product with form values
    const newProduct: Product = {
      id: Date.now().toString(),
      name: formValues.name,
      barcode: formValues.barcode,
      description: formValues.description,
      categoryId: formValues.categoryId,
      unitId: formValues.unitId,
      stockQuantity: formValues.stockQuantity,
      minStockLevel: formValues.minStockLevel,
      costPrice: formValues.costPrice,
      retailPrice: formValues.retailPrice,
      priceLevels: priceLevels,
      loyaltyPoints: formValues.loyaltyPoints,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      photoUrl: photoPreview || formValues.photoUrl,
      expiryDate: selectedDate ? selectedDate.toISOString().split('T')[0] : undefined
    };
    
    setProducts([...products, newProduct]);
    setIsAddDialogOpen(false);
    form.reset();
    setPriceLevels([
      { id: "temp1", minQuantity: 5, price: 0 },
      { id: "temp2", minQuantity: 10, price: 0 },
    ]);
    setPhotoPreview(null);
    setSelectedDate(undefined);
    toast.success("Product added successfully");
  };

  const handleEditProduct = () => {
    if (!currentProduct) return;
    
    const updatedProduct = {
      ...currentProduct,
      photoUrl: photoPreview || currentProduct.photoUrl,
      expiryDate: selectedDate ? selectedDate.toISOString().split('T')[0] : currentProduct.expiryDate,
      updatedAt: new Date().toISOString(),
    };
    
    const updatedProducts = products.map((product) =>
      product.id === currentProduct.id ? updatedProduct : product
    );
    
    setProducts(updatedProducts);
    setIsEditDialogOpen(false);
    setPhotoPreview(null);
    toast.success("Product updated successfully");
  };

  const handleDeleteProduct = () => {
    if (!currentProduct) return;
    
    const updatedProducts = products.filter(
      (product) => product.id !== currentProduct.id
    );
    
    setProducts(updatedProducts);
    setIsDeleteDialogOpen(false);
    toast.success("Product deleted successfully");
  };

  const openEditDialog = (product: Product) => {
    setCurrentProduct(product);
    setPriceLevels(product.priceLevels);
    setPhotoPreview(product.photoUrl || null);
    setSelectedDate(product.expiryDate ? new Date(product.expiryDate) : undefined);
    
    form.reset({
      name: product.name,
      barcode: product.barcode || "",
      description: product.description || "",
      categoryId: product.categoryId,
      unitId: product.unitId,
      stockQuantity: product.stockQuantity,
      minStockLevel: product.minStockLevel,
      costPrice: product.costPrice,
      retailPrice: product.retailPrice,
      loyaltyPoints: product.loyaltyPoints,
      photoUrl: product.photoUrl || "",
      expiryDate: product.expiryDate || ""
    });
    
    setIsEditDialogOpen(true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredProducts = searchTerm
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.barcode && product.barcode.includes(searchTerm))
      )
    : products;

  const handleScanBarcode = () => {
    // Mock barcode scanning - in a real app, this would integrate with a scanner
    const mockBarcode = "8992775210" + Math.floor(Math.random() * 1000);
    form.setValue("barcode", mockBarcode);
    toast.info(`Barcode scanned: ${mockBarcode}`);
  };

  const addPriceLevel = () => {
    const lastLevel = priceLevels[priceLevels.length - 1];
    const newMinQuantity = lastLevel ? lastLevel.minQuantity + 5 : 5;
    
    setPriceLevels([
      ...priceLevels, 
      { 
        id: `temp${Date.now()}`, 
        minQuantity: newMinQuantity, 
        price: 0 
      }
    ]);
  };

  const removePriceLevel = (index: number) => {
    if (priceLevels.length > 1) {
      const newLevels = [...priceLevels];
      newLevels.splice(index, 1);
      setPriceLevels(newLevels);
    }
  };

  const updatePriceLevel = (index: number, field: 'minQuantity' | 'price', value: number) => {
    const newLevels = [...priceLevels];
    newLevels[index][field] = value;
    setPriceLevels(newLevels);
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(category => category.id === categoryId)?.name || "Unknown";
  };

  const getUnitName = (unitId: string) => {
    return units.find(unit => unit.id === unitId)?.name || "Unknown";
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button
          onClick={() => {
            form.reset();
            setPriceLevels([
              { id: "temp1", minQuantity: 5, price: 0 },
              { id: "temp2", minQuantity: 10, price: 0 },
            ]);
            setPhotoPreview(null);
            setSelectedDate(undefined);
            setIsAddDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
          <CardDescription>
            Manage your products and inventory
          </CardDescription>
          <div className="flex mt-4 gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                type="search" 
                placeholder="Search products..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.photoUrl ? (
                      <img 
                        src={product.photoUrl} 
                        alt={product.name} 
                        className="h-10 w-10 rounded-md object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No img</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div>
                      {product.name}
                      {product.barcode && (
                        <div className="text-xs text-gray-500">
                          {product.barcode}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getCategoryName(product.categoryId)}</TableCell>
                  <TableCell>{getUnitName(product.unitId)}</TableCell>
                  <TableCell>
                    <div className={`${product.stockQuantity <= product.minStockLevel ? "text-red-500" : ""}`}>
                      {product.stockQuantity}
                      {product.stockQuantity <= product.minStockLevel && (
                        <div className="text-xs">Low stock</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.expiryDate ? (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                        <span>{product.expiryDate}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      {product.retailPrice.toLocaleString()}
                      {product.priceLevels.length > 0 && (
                        <div className="text-xs text-gray-500">
                          {product.priceLevels.length} price levels
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setCurrentProduct(product);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Add a new product to your inventory.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basics" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="basics">Basic Info</TabsTrigger>
              <TabsTrigger value="pricing">Pricing & Stock</TabsTrigger>
              <TabsTrigger value="additional">Additional Info</TabsTrigger>
            </TabsList>

            <TabsContent value="basics">
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Product Photo</Label>
                  <div className="flex items-center gap-4">
                    <div className="border rounded-md p-2 w-24 h-24 flex items-center justify-center">
                      {photoPreview ? (
                        <img 
                          src={photoPreview} 
                          alt="Product preview" 
                          className="max-h-20 max-w-20 object-contain"
                        />
                      ) : (
                        <span className="text-sm text-gray-400">No photo</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <Input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Upload a photo of your product. Recommended size: 500x500px.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="grid flex-1 gap-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      {...form.register("name")}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    onValueChange={(value) => form.setValue("categoryId", value)}
                    defaultValue={form.getValues("categoryId")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select 
                    onValueChange={(value) => form.setValue("unitId", value)}
                    defaultValue={form.getValues("unitId")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map(unit => (
                        <SelectItem key={unit.id} value={unit.id}>
                          {unit.name} ({unit.description})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...form.register("description")}
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pricing">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="costPrice">Cost Price</Label>
                    <Input
                      id="costPrice"
                      type="number"
                      {...form.register("costPrice", { valueAsNumber: true })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="retailPrice">Retail Price</Label>
                    <Input
                      id="retailPrice"
                      type="number"
                      {...form.register("retailPrice", { valueAsNumber: true })}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <div className="flex justify-between items-center">
                    <Label>Price Levels (Wholesale)</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addPriceLevel}>
                      Add Level
                    </Button>
                  </div>
                  
                  <div className="border rounded-md p-3">
                    {priceLevels.map((level, index) => (
                      <div key={level.id} className="flex gap-4 items-center mb-2">
                        <div className="grid gap-1 flex-1">
                          <Label className="text-xs">Min. Quantity</Label>
                          <Input
                            type="number"
                            value={level.minQuantity}
                            onChange={(e) => updatePriceLevel(index, 'minQuantity', Number(e.target.value))}
                          />
                        </div>
                        <div className="grid gap-1 flex-1">
                          <Label className="text-xs">Price</Label>
                          <Input
                            type="number"
                            value={level.price}
                            onChange={(e) => updatePriceLevel(index, 'price', Number(e.target.value))}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="mt-4"
                          onClick={() => removePriceLevel(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="stockQuantity">Stock Quantity</Label>
                    <Input
                      id="stockQuantity"
                      type="number"
                      {...form.register("stockQuantity", { valueAsNumber: true })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="minStockLevel">Min Stock Level</Label>
                    <Input
                      id="minStockLevel"
                      type="number"
                      {...form.register("minStockLevel", { valueAsNumber: true })}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="additional">
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="loyaltyPoints">Loyalty Points</Label>
                  <Input
                    id="loyaltyPoints"
                    type="number"
                    {...form.register("loyaltyPoints", { valueAsNumber: true })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="expiryDate">Expiration Date</Label>
                  <DatePicker
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    placeholder="Select expiry date"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProduct}>Add Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog - Similar to Add Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Make changes to the product information.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="basics" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="basics">Basic Info</TabsTrigger>
              <TabsTrigger value="pricing">Pricing & Stock</TabsTrigger>
              <TabsTrigger value="additional">Additional Info</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basics">
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Product Photo</Label>
                  <div className="flex items-center gap-4">
                    <div className="border rounded-md p-2 w-24 h-24 flex items-center justify-center">
                      {photoPreview ? (
                        <img 
                          src={photoPreview} 
                          alt="Product preview" 
                          className="max-h-20 max-w-20 object-contain"
                        />
                      ) : (
                        <span className="text-sm text-gray-400">No photo</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <Input
                        id="photo-upload-edit"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Upload a photo of your product. Recommended size: 500x500px.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="grid flex-1 gap-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      {...form.register("name")}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    onValueChange={(value) => form.setValue("categoryId", value)}
                    defaultValue={form.getValues("categoryId")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select 
                    onValueChange={(value) => form.setValue("unitId", value)}
                    defaultValue={form.getValues("unitId")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map(unit => (
                        <SelectItem key={unit.id} value={unit.id}>
                          {unit.name} ({unit.description})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...form.register("description")}
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="pricing">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="costPrice">Cost Price</Label>
                    <Input
                      id="costPrice"
                      type="number"
                      {...form.register("costPrice", { valueAsNumber: true })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="retailPrice">Retail Price</Label>
                    <Input
                      id="retailPrice"
                      type="number"
                      {...form.register("retailPrice", { valueAsNumber: true })}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <div className="flex justify-between items-center">
                    <Label>Price Levels (Wholesale)</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addPriceLevel}>
                      Add Level
                    </Button>
                  </div>
                  
                  <div className="border rounded-md p-3">
                    {priceLevels.map((level, index) => (
                      <div key={level.id} className="flex gap-4 items-center mb-2">
                        <div className="grid gap-1 flex-1">
                          <Label className="text-xs">Min. Quantity</Label>
                          <Input
                            type="number"
                            value={level.minQuantity}
                            onChange={(e) => updatePriceLevel(index, 'minQuantity', Number(e.target.value))}
                          />
                        </div>
                        <div className="grid gap-1 flex-1">
                          <Label className="text-xs">Price</Label>
                          <Input
                            type="number"
                            value={level.price}
                            onChange={(e) => updatePriceLevel(index, 'price', Number(e.target.value))}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="mt-4"
                          onClick={() => removePriceLevel(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="stockQuantity">Stock Quantity</Label>
                    <Input
                      id="stockQuantity"
                      type="number"
                      {...form.register("stockQuantity", { valueAsNumber: true })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="minStockLevel">Min Stock Level</Label>
                    <Input
                      id="minStockLevel"
                      type="number"
                      {...form.register("minStockLevel", { valueAsNumber: true })}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="additional">
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="loyaltyPoints">Loyalty Points</Label>
                  <Input
                    id="loyaltyPoints"
                    type="number"
                    {...form.register("loyaltyPoints", { valueAsNumber: true })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="expiryDate">Expiration Date</Label>
                  <DatePicker
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    placeholder="Select expiry date"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditProduct}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Product Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product?
            </DialogDescription>
          </DialogHeader>
          <p>
            This will permanently delete the "{currentProduct?.name}" product.
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

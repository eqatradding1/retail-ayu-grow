
import { useState } from "react";
import { Search, Barcode } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";

interface ProductsListProps {
  products: Product[];
  categories: { id: string; name: string }[];
  onAddToCart: (product: Product) => void;
}

export function ProductsList({ products, categories, onAddToCart }: ProductsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);

  // Filtered products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === "" || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.barcode && product.barcode.includes(searchTerm));
    
    const matchesCategory = currentCategory === null || product.categoryId === currentCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Handle barcode scan
  const handleBarcodeScanned = () => {
    // In a real app, this would connect to a barcode scanner device
    // For demo purposes, we'll just use a random product
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    onAddToCart(randomProduct);
    toast.success(`Scanned: ${randomProduct.name}`);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Products</CardTitle>
        <CardDescription>Find and add products to the cart</CardDescription>
        
        <div className="flex gap-2 mt-2">
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
          <Button variant="outline" onClick={handleBarcodeScanned}>
            <Barcode className="h-4 w-4 mr-2" />
            Scan
          </Button>
        </div>
        
        {/* Categories filter */}
        <div className="flex gap-2 overflow-x-auto py-2">
          <Button
            variant={currentCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentCategory(null)}
          >
            All
          </Button>
          {categories.map(category => (
            <Button
              key={category.id}
              variant={currentCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="border rounded-md overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors flex flex-col"
              onClick={() => onAddToCart(product)}
            >
              <div className="p-3 flex-1">
                <div className="font-medium truncate">{product.name}</div>
                <div className="text-sm text-gray-500">
                  Stock: {product.stockQuantity}
                </div>
                <div className="mt-1 font-bold">
                  {product.retailPrice.toLocaleString()}
                </div>
              </div>
              <div className="bg-gray-50 p-2 text-xs flex justify-between items-center">
                <span>SKU: {product.id}</span>
                {product.stockQuantity < product.minStockLevel && (
                  <span className="text-amber-600 font-medium">Low Stock</span>
                )}
              </div>
            </div>
          ))}
          
          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-500">
              No products found. Try a different search term or category.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

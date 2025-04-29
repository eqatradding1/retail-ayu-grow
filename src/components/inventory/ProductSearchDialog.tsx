
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { Product } from "@/types/product";

interface ProductSearchDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export function ProductSearchDialog({ isOpen, onOpenChange, products, onSelectProduct }: ProductSearchDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredProducts = searchTerm
    ? products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.barcode && product.barcode.includes(searchTerm))
      )
    : products;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Search Products</DialogTitle>
          <DialogDescription>
            Find a product to add to inventory movement
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative my-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search by name or barcode..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="max-h-[300px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Price</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map(product => (
                <TableRow key={product.id} className="cursor-pointer hover:bg-muted">
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.stockQuantity}</TableCell>
                  <TableCell>{product.retailPrice.toLocaleString()}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        onSelectProduct(product);
                        onOpenChange(false);
                      }}
                    >
                      Select
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

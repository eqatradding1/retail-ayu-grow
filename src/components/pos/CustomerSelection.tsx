
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";

interface Customer {
  id: string;
  name: string;
  phone: string;
  points: number;
}

interface CustomerSelectionProps {
  selectedCustomer: { id: string; name: string; points: number } | null;
  setSelectedCustomer: (customer: { id: string; name: string; points: number } | null) => void;
  customers: Customer[];
}

export function CustomerSelection({ selectedCustomer, setSelectedCustomer, customers }: CustomerSelectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredCustomers = searchTerm
    ? customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
      )
    : customers;

  const handleNewCustomer = () => {
    setIsDialogOpen(false);
    
    // Navigate to customer page with a query parameter to open the add dialog
    navigate("/customers?action=add");
    toast.info("Redirecting to the customers page to add a new customer");
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="text-sm">
          {selectedCustomer ? (
            <div className="bg-green-50 border border-green-200 rounded-md px-3 py-1">
              <div className="font-medium">{selectedCustomer.name}</div>
              <div className="text-xs">Points: {selectedCustomer.points}</div>
            </div>
          ) : (
            "No customer selected"
          )}
        </div>
        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
          {selectedCustomer ? "Change" : "Add Customer"}
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Customer</DialogTitle>
            <DialogDescription>Choose a customer for this transaction</DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search customers..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="max-h-60 overflow-y-auto">
              {filteredCustomers.map(customer => (
                <div
                  key={customer.id}
                  className="flex justify-between items-center p-3 border-b cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setIsDialogOpen(false);
                  }}
                >
                  <div>
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-sm text-gray-500">{customer.phone}</div>
                  </div>
                  <div className="text-sm">
                    <div>Points: {customer.points}</div>
                  </div>
                </div>
              ))}

              {filteredCustomers.length === 0 && (
                <div className="p-4 text-center text-muted-foreground">
                  No customers found. Try a different search or add a new customer.
                </div>
              )}
            </div>
            
            <Button variant="outline" className="w-full" onClick={handleNewCustomer}>
              Register New Customer
            </Button>
          </div>
          
          <DialogFooter>
            <Button variant="ghost" onClick={() => {
              setSelectedCustomer(null);
              setIsDialogOpen(false);
            }}>
              No Customer
            </Button>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

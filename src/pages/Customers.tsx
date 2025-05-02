
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { Search, Plus, Pencil, Trash2, History, QrCode, Cake, Calendar, Printer } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { format, differenceInYears, isToday, addDays } from "date-fns";

// Define Customer type
interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  loyaltyPoints: number;
  registeredDate: string;
  totalSpent: number;
  lastPurchaseDate?: string;
  notes?: string;
  qrCode?: string;
  birthDate?: string;
}

// Mock customer data
const initialCustomers: Customer[] = [
  {
    id: "1",
    name: "John Doe",
    phone: "555-123-4567",
    email: "john.doe@email.com",
    address: "123 Main St, Cityville",
    loyaltyPoints: 150,
    registeredDate: "2023-01-15",
    totalSpent: 580000,
    lastPurchaseDate: "2023-04-20",
    notes: "Regular customer, prefers weekend visits",
    birthDate: "1985-05-15"
  },
  {
    id: "2",
    name: "Jane Smith",
    phone: "555-987-6543",
    email: "jane.smith@email.com",
    address: "456 Park Ave, Townsville",
    loyaltyPoints: 75,
    registeredDate: "2023-02-22",
    totalSpent: 320000,
    lastPurchaseDate: "2023-04-15",
    birthDate: "1990-05-03" // Today's date for demo birthday
  },
  {
    id: "3",
    name: "Robert Johnson",
    phone: "555-456-7890",
    email: "robert.j@email.com",
    address: "789 Oak St, Villagetown",
    loyaltyPoints: 200,
    registeredDate: "2023-01-05",
    totalSpent: 890000,
    lastPurchaseDate: "2023-04-18",
    notes: "Has wholesale account",
    birthDate: "1978-10-22"
  }
];

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Customer dialog states
  const [isAddCustomerDialogOpen, setIsAddCustomerDialogOpen] = useState(false);
  const [isEditCustomerDialogOpen, setIsEditCustomerDialogOpen] = useState(false);
  const [isDeleteCustomerDialogOpen, setIsDeleteCustomerDialogOpen] = useState(false);
  const [isViewHistoryDialogOpen, setIsViewHistoryDialogOpen] = useState(false);
  const [isViewQRCodeDialogOpen, setIsViewQRCodeDialogOpen] = useState(false);
  const [isPrintMemberCardDialogOpen, setIsPrintMemberCardDialogOpen] = useState(false);
  
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [selectedBirthDate, setSelectedBirthDate] = useState<Date | undefined>(undefined);
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, "id" | "registeredDate" | "totalSpent" | "loyaltyPoints" | "qrCode">>({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
    birthDate: ""
  });
  
  // Ref for member card printing
  const memberCardRef = useRef<HTMLDivElement>(null);
  
  // Check for birthdays
  useEffect(() => {
    const today = new Date();
    const birthdayCustomers = customers.filter(customer => {
      if (!customer.birthDate) return false;
      const birthDate = new Date(customer.birthDate);
      return birthDate.getDate() === today.getDate() && birthDate.getMonth() === today.getMonth();
    });
    
    if (birthdayCustomers.length > 0) {
      birthdayCustomers.forEach(customer => {
        toast(`🎂 Today is ${customer.name}'s birthday!`, {
          description: `Send them birthday wishes!`,
          duration: 5000,
        });
      });
    }
  }, [customers]);
  
  // Filter customers based on search term
  const filteredCustomers = searchTerm
    ? customers.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : customers;
    
  // Mock purchase history for demo
  const mockPurchaseHistory = [
    {
      id: "p1",
      date: "2023-04-20",
      amount: 125000,
      items: 4,
      invoice: "INV-20230420-001"
    },
    {
      id: "p2",
      date: "2023-03-15",
      amount: 85000,
      items: 2,
      invoice: "INV-20230315-003"
    },
    {
      id: "p3",
      date: "2023-02-28",
      amount: 210000,
      items: 6,
      invoice: "INV-20230228-007"
    }
  ];

  // Generate QR Code - now with ID-Name format
  const generateQRCode = (customer: Customer) => {
    // This would normally call an API to generate a QR code
    // For demo purposes, we'll just return a placeholder URL with ID-Name
    const qrValue = `${customer.id}-${customer.name}`;
    // URL encode the value to handle special characters
    const encodedValue = encodeURIComponent(qrValue);
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedValue}`;
  };

  // Handle adding a new customer
  const handleAddCustomer = () => {
    const customerId = Date.now().toString();
    
    // Create the customer object
    const customer: Customer = {
      id: customerId,
      ...newCustomer,
      birthDate: selectedBirthDate ? selectedBirthDate.toISOString().split('T')[0] : undefined,
      loyaltyPoints: 0,
      registeredDate: new Date().toISOString().split("T")[0],
      totalSpent: 0
    };
    
    // Generate QR code with ID-Name format
    customer.qrCode = generateQRCode(customer);
    
    setCustomers([...customers, customer]);
    setIsAddCustomerDialogOpen(false);
    setSelectedBirthDate(undefined);
    setNewCustomer({
      name: "",
      phone: "",
      email: "",
      address: "",
      notes: "",
      birthDate: ""
    });
    toast.success("Customer added successfully");
  };

  // Handle editing a customer
  const handleEditCustomer = () => {
    if (!currentCustomer) return;
    
    // Update birth date if selected
    const updatedCustomer = {
      ...currentCustomer,
      birthDate: selectedBirthDate 
        ? selectedBirthDate.toISOString().split('T')[0] 
        : currentCustomer.birthDate
    };
    
    // Update QR code if name changed
    if (updatedCustomer.name !== currentCustomer.name) {
      updatedCustomer.qrCode = generateQRCode(updatedCustomer);
    }
    
    const updatedCustomers = customers.map(customer =>
      customer.id === currentCustomer.id ? updatedCustomer : customer
    );
    
    setCustomers(updatedCustomers);
    setIsEditCustomerDialogOpen(false);
    toast.success("Customer updated successfully");
  };

  // Handle deleting a customer
  const handleDeleteCustomer = () => {
    if (!currentCustomer) return;
    
    const updatedCustomers = customers.filter(
      customer => customer.id !== currentCustomer.id
    );
    
    setCustomers(updatedCustomers);
    setIsDeleteCustomerDialogOpen(false);
    toast.success("Customer deleted successfully");
  };

  // Download QR code image
  const handleDownloadQRCode = () => {
    if (!currentCustomer?.qrCode) return;
    
    // Create an anchor element and set attributes for download
    const link = document.createElement('a');
    link.href = currentCustomer.qrCode;
    link.download = `qrcode_${currentCustomer.id}_${currentCustomer.name.replace(/\s+/g, '_')}.png`;
    
    // Fetch the QR code image and convert to blob for download
    fetch(currentCustomer.qrCode)
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob);
        link.href = blobUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
        toast.success("QR Code downloaded successfully");
      })
      .catch(error => {
        console.error("Error downloading QR code:", error);
        toast.error("Failed to download QR code");
      });
  };
  
  // Print member card
  const handlePrintMemberCard = () => {
    if (!memberCardRef.current) return;
    
    const content = memberCardRef.current;
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Customer Membership Card</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
              .card-container { width: 85.6mm; height: 53.98mm; border: 1px solid #ccc; border-radius: 10px; padding: 10px; margin: 20px auto; box-sizing: border-box; }
              .store-name { font-size: 18px; font-weight: bold; text-align: center; margin-bottom: 5px; }
              .member-info { display: flex; }
              .qr-section { flex: 0 0 40%; }
              .info-section { flex: 1; padding-left: 10px; }
              .customer-name { font-size: 16px; font-weight: bold; margin-bottom: 5px; }
              .member-id { font-size: 12px; color: #666; margin-bottom: 10px; }
              .points { font-size: 14px; font-weight: bold; }
              .footer { font-size: 10px; text-align: center; margin-top: 10px; color: #999; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            ${content.innerHTML}
            <script>
              setTimeout(() => window.print(), 500);
              setTimeout(() => window.close(), 1000);
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      toast.error("Unable to open print window. Please check if popup blocker is enabled.");
    }
  };

  // Calculate age from birthdate
  const calculateAge = (birthDate: string): number => {
    return differenceInYears(new Date(), new Date(birthDate));
  };

  // Check if customer has birthday today or in next 7 days
  const getUpcomingBirthday = (birthDate?: string): { isToday: boolean, isUpcoming: boolean } => {
    if (!birthDate) return { isToday: false, isUpcoming: false };
    
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    const birthdayThisYear = new Date(today.getFullYear(), birthDateObj.getMonth(), birthDateObj.getDate());
    
    // Check if birthday is today
    if (isToday(birthdayThisYear)) {
      return { isToday: true, isUpcoming: false };
    }
    
    // Check if birthday is in the next 7 days
    const nextWeek = addDays(today, 7);
    const isUpcoming = birthdayThisYear >= today && birthdayThisYear <= nextWeek;
    
    return { isToday: false, isUpcoming };
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Customers</CardTitle>
              <CardDescription>
                Manage your store customers and their loyalty points
              </CardDescription>
            </div>
            <Button onClick={() => setIsAddCustomerDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Customer
            </Button>
          </div>
          <div className="relative flex mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              type="search" 
              placeholder="Search customers..." 
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
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Loyalty Points</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Birthday</TableHead>
                <TableHead>Last Purchase</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => {
                const { isToday: isBirthdayToday, isUpcoming: isUpcomingBirthday } = getUpcomingBirthday(customer.birthDate);
                
                return (
                  <TableRow key={customer.id} className={isBirthdayToday ? "bg-pink-50" : ""}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {isBirthdayToday && <Cake className="h-4 w-4 mr-2 text-pink-500" />}
                        {customer.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{customer.phone}</div>
                      <div className="text-xs text-muted-foreground">{customer.email}</div>
                    </TableCell>
                    <TableCell>{customer.loyaltyPoints} points</TableCell>
                    <TableCell>{customer.totalSpent.toLocaleString()}</TableCell>
                    <TableCell>
                      {customer.birthDate ? (
                        <div className="flex items-center">
                          <Calendar className={`h-4 w-4 mr-2 ${isBirthdayToday ? "text-pink-500" : isUpcomingBirthday ? "text-orange-400" : "text-gray-500"}`} />
                          <div>
                            <div>{format(new Date(customer.birthDate), "dd MMM yyyy")}</div>
                            <div className="text-xs text-muted-foreground">
                              {calculateAge(customer.birthDate)} years old
                              {isBirthdayToday && <span className="ml-1 text-pink-500 font-medium">Today! 🎉</span>}
                              {isUpcomingBirthday && !isBirthdayToday && <span className="ml-1 text-orange-400">Soon!</span>}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Not set</span>
                      )}
                    </TableCell>
                    <TableCell>{customer.lastPurchaseDate || "N/A"}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setCurrentCustomer(customer);
                          setIsViewHistoryDialogOpen(true);
                        }}
                      >
                        <History className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setCurrentCustomer(customer);
                          if (!customer.qrCode) {
                            const updatedCustomer = {
                              ...customer,
                              qrCode: generateQRCode(customer)
                            };
                            setCurrentCustomer(updatedCustomer);
                          }
                          setIsViewQRCodeDialogOpen(true);
                        }}
                      >
                        <QrCode className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setCurrentCustomer(customer);
                          if (!customer.qrCode) {
                            const updatedCustomer = {
                              ...customer,
                              qrCode: generateQRCode(customer)
                            };
                            setCurrentCustomer(updatedCustomer);
                          }
                          setIsPrintMemberCardDialogOpen(true);
                        }}
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setCurrentCustomer(customer);
                          setSelectedBirthDate(customer.birthDate ? new Date(customer.birthDate) : undefined);
                          setIsEditCustomerDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setCurrentCustomer(customer);
                          setIsDeleteCustomerDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Customer Dialog */}
      <Dialog open={isAddCustomerDialogOpen} onOpenChange={setIsAddCustomerDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Add a new customer to your store database.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                placeholder="Customer name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone" 
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                placeholder="Phone number"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                placeholder="Email address"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="birthDate">Birth Date</Label>
              <DatePicker
                selected={selectedBirthDate}
                onSelect={setSelectedBirthDate}
                placeholder="Select birth date"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Textarea 
                id="address" 
                value={newCustomer.address}
                onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                placeholder="Customer address"
                rows={2}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                value={newCustomer.notes}
                onChange={(e) => setNewCustomer({...newCustomer, notes: e.target.value})}
                placeholder="Additional notes"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCustomerDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCustomer}>Add Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={isEditCustomerDialogOpen} onOpenChange={setIsEditCustomerDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Update customer information.
            </DialogDescription>
          </DialogHeader>
          {currentCustomer && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input 
                  id="edit-name" 
                  value={currentCustomer.name}
                  onChange={(e) => setCurrentCustomer({...currentCustomer, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input 
                  id="edit-phone" 
                  value={currentCustomer.phone}
                  onChange={(e) => setCurrentCustomer({...currentCustomer, phone: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input 
                  id="edit-email" 
                  type="email"
                  value={currentCustomer.email}
                  onChange={(e) => setCurrentCustomer({...currentCustomer, email: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="birthDate">Birth Date</Label>
                <DatePicker
                  selected={selectedBirthDate}
                  onSelect={setSelectedBirthDate}
                  placeholder="Select birth date"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-address">Address</Label>
                <Textarea 
                  id="edit-address" 
                  value={currentCustomer.address}
                  onChange={(e) => setCurrentCustomer({...currentCustomer, address: e.target.value})}
                  rows={2}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea 
                  id="edit-notes" 
                  value={currentCustomer.notes || ""}
                  onChange={(e) => setCurrentCustomer({...currentCustomer, notes: e.target.value})}
                  rows={2}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCustomerDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCustomer}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Customer Dialog */}
      <Dialog open={isDeleteCustomerDialogOpen} onOpenChange={setIsDeleteCustomerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this customer?
            </DialogDescription>
          </DialogHeader>
          <p>
            This will permanently delete "{currentCustomer?.name}" from your customer database.
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteCustomerDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCustomer}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Customer History Dialog */}
      <Dialog open={isViewHistoryDialogOpen} onOpenChange={setIsViewHistoryDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Purchase History</DialogTitle>
            <DialogDescription>
              {currentCustomer?.name}'s purchase history
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPurchaseHistory.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell>{purchase.date}</TableCell>
                    <TableCell>{purchase.invoice}</TableCell>
                    <TableCell>{purchase.items} items</TableCell>
                    <TableCell className="text-right">{purchase.amount.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsViewHistoryDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View QR Code Dialog with improved download function */}
      <Dialog open={isViewQRCodeDialogOpen} onOpenChange={setIsViewQRCodeDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Customer QR Code</DialogTitle>
            <DialogDescription>
              QR Code for {currentCustomer?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-6">
            {currentCustomer?.qrCode && (
              <div className="border p-4 rounded-lg bg-white">
                <img
                  src={currentCustomer.qrCode}
                  alt="Customer QR Code"
                  className="w-48 h-48"
                />
              </div>
            )}
            <p className="text-center mt-4 text-sm text-muted-foreground">
              Customer ID: {currentCustomer?.id}
            </p>
            <p className="text-center mt-1 text-sm text-muted-foreground">
              QR Value: {currentCustomer?.id}-{currentCustomer?.name}
            </p>
            <p className="text-center mt-1 text-sm text-muted-foreground">
              Scan this code at checkout to quickly access customer information.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleDownloadQRCode}
            >
              Download
            </Button>
            <Button onClick={() => setIsViewQRCodeDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Print Member Card Dialog */}
      <Dialog open={isPrintMemberCardDialogOpen} onOpenChange={setIsPrintMemberCardDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Customer Membership Card</DialogTitle>
            <DialogDescription>
              Print membership card for {currentCustomer?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="p-4">
            <div ref={memberCardRef} className="border rounded-lg bg-white p-4 w-full max-w-[340px] mx-auto" style={{ aspectRatio: '85.6/53.98' }}>
              <div className="text-center font-bold text-lg mb-2 border-b pb-2">STORE MEMBERSHIP CARD</div>
              <div className="flex">
                <div className="flex-shrink-0 w-1/3">
                  {currentCustomer?.qrCode && (
                    <img
                      src={currentCustomer.qrCode}
                      alt="Customer QR Code"
                      className="w-full"
                    />
                  )}
                </div>
                <div className="pl-4 flex-1">
                  <div className="font-bold text-base">{currentCustomer?.name}</div>
                  <div className="text-xs text-gray-500 mb-2">ID: {currentCustomer?.id}</div>
                  <div className="text-sm mb-1">Points: <span className="font-medium">{currentCustomer?.loyaltyPoints} pts</span></div>
                  <div className="text-xs text-gray-500">Member since: {currentCustomer?.registeredDate}</div>
                </div>
              </div>
              <div className="text-xs text-center text-gray-400 mt-3">
                Present this card for discounts and to earn loyalty points
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPrintMemberCardDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePrintMemberCard}>
              <Printer className="mr-2 h-4 w-4" /> Print Card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

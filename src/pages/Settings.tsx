
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  User, 
  Building, 
  CreditCard, 
  Users, 
  Bell, 
  ShieldCheck, 
  Trash2, 
  Plus,
  Pencil 
} from "lucide-react";

// Define types for settings
interface StoreSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  taxId: string;
  currencyCode: string;
  logo?: string;
}

interface TaxSettings {
  enableTax: boolean;
  defaultTaxRate: number;
  taxName: string;
  taxNumber: string;
  includeTaxInPrice: boolean;
}

interface InvoiceSettings {
  prefix: string;
  nextNumber: number;
  termsAndConditions: string;
  showLogo: boolean;
  dueDays: number;
}

interface EmailSettings {
  enableEmails: boolean;
  senderName: string;
  senderEmail: string;
  sendOrderConfirmation: boolean;
  sendPaymentReceipt: boolean;
  sendLowStockAlert: boolean;
  emailSignature: string;
}

interface UserRole {
  id: string;
  name: string;
  permissions: {
    [key: string]: boolean;
  };
}

interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  lastLogin?: string;
}

export default function Settings() {
  // Store Settings State
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    name: "RetailAyu Store",
    address: "123 Commerce St, Jakarta",
    phone: "555-123-4567",
    email: "contact@retailayu.com",
    website: "www.retailayu.com",
    taxId: "12345-67890",
    currencyCode: "IDR"
  });

  // Tax Settings State
  const [taxSettings, setTaxSettings] = useState<TaxSettings>({
    enableTax: true,
    defaultTaxRate: 11,
    taxName: "PPN",
    taxNumber: "TAX-123456",
    includeTaxInPrice: false
  });
  
  // Invoice Settings State
  const [invoiceSettings, setInvoiceSettings] = useState<InvoiceSettings>({
    prefix: "INV",
    nextNumber: 1001,
    termsAndConditions: "Payment due within 14 days of invoice date. Late payments subject to a 2% monthly charge.",
    showLogo: true,
    dueDays: 14
  });
  
  // Email Settings State
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    enableEmails: true,
    senderName: "RetailAyu Store",
    senderEmail: "sales@retailayu.com",
    sendOrderConfirmation: true,
    sendPaymentReceipt: true,
    sendLowStockAlert: true,
    emailSignature: "Thank you for your business!\nRetailAyu Store Team"
  });
  
  // User Roles State
  const [roles, setRoles] = useState<UserRole[]>([
    {
      id: "1",
      name: "Owner",
      permissions: {
        viewDashboard: true,
        manageProducts: true,
        manageInventory: true,
        manageSales: true,
        manageCustomers: true,
        manageFinances: true,
        manageReports: true,
        manageSettings: true,
        manageUsers: true
      }
    },
    {
      id: "2",
      name: "Manager",
      permissions: {
        viewDashboard: true,
        manageProducts: true,
        manageInventory: true,
        manageSales: true,
        manageCustomers: true,
        manageFinances: false,
        manageReports: true,
        manageSettings: false,
        manageUsers: false
      }
    },
    {
      id: "3",
      name: "Cashier",
      permissions: {
        viewDashboard: true,
        manageProducts: false,
        manageInventory: false,
        manageSales: true,
        manageCustomers: true,
        manageFinances: false,
        manageReports: false,
        manageSettings: false,
        manageUsers: false
      }
    },
    {
      id: "4",
      name: "Inventory Clerk",
      permissions: {
        viewDashboard: true,
        manageProducts: true,
        manageInventory: true,
        manageSales: false,
        manageCustomers: false,
        manageFinances: false,
        manageReports: false,
        manageSettings: false,
        manageUsers: false
      }
    }
  ]);
  
  // User Accounts State
  const [users, setUsers] = useState<UserAccount[]>([
    {
      id: "1",
      name: "Admin User",
      email: "admin@retailayu.com",
      role: "Owner",
      active: true,
      lastLogin: "2023-04-25 09:45:12"
    },
    {
      id: "2",
      name: "Store Manager",
      email: "manager@retailayu.com",
      role: "Manager",
      active: true,
      lastLogin: "2023-04-24 16:30:05"
    },
    {
      id: "3",
      name: "Checkout Staff",
      email: "cashier@retailayu.com",
      role: "Cashier",
      active: true,
      lastLogin: "2023-04-25 08:15:43"
    },
    {
      id: "4",
      name: "Warehouse Staff",
      email: "inventory@retailayu.com",
      role: "Inventory Clerk",
      active: false,
      lastLogin: "2023-04-20 11:20:18"
    }
  ]);

  // Dialog states
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false);
  const [isEditRoleDialogOpen, setIsEditRoleDialogOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  
  const [newUser, setNewUser] = useState<Omit<UserAccount, "id">>({
    name: "",
    email: "",
    role: "Cashier",
    active: true
  });
  
  const [newRole, setNewRole] = useState<Omit<UserRole, "id">>({
    name: "",
    permissions: {
      viewDashboard: true,
      manageProducts: false,
      manageInventory: false,
      manageSales: false,
      manageCustomers: false,
      manageFinances: false,
      manageReports: false,
      manageSettings: false,
      manageUsers: false
    }
  });

  // Save Store Settings
  const saveStoreSettings = () => {
    // In a real app, this would be an API call
    toast.success("Store settings saved successfully");
  };
  
  // Save Tax Settings
  const saveTaxSettings = () => {
    toast.success("Tax settings saved successfully");
  };
  
  // Save Invoice Settings
  const saveInvoiceSettings = () => {
    toast.success("Invoice settings saved successfully");
  };
  
  // Save Email Settings
  const saveEmailSettings = () => {
    toast.success("Email settings saved successfully");
  };
  
  // Add User
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const user: UserAccount = {
      id: Date.now().toString(),
      ...newUser
    };
    
    setUsers([...users, user]);
    setIsAddUserDialogOpen(false);
    setNewUser({
      name: "",
      email: "",
      role: "Cashier",
      active: true
    });
    toast.success("User added successfully");
  };
  
  // Edit User
  const handleEditUser = () => {
    if (!currentUser) return;
    
    const updatedUsers = users.map(user =>
      user.id === currentUser.id ? currentUser : user
    );
    
    setUsers(updatedUsers);
    setIsEditUserDialogOpen(false);
    toast.success("User updated successfully");
  };
  
  // Delete User
  const handleDeleteUser = () => {
    if (!currentUser) return;
    
    const updatedUsers = users.filter(
      user => user.id !== currentUser.id
    );
    
    setUsers(updatedUsers);
    setIsDeleteUserDialogOpen(false);
    toast.success("User deleted successfully");
  };
  
  // Add Role
  const handleAddRole = () => {
    if (!newRole.name) {
      toast.error("Please provide a role name");
      return;
    }
    
    const role: UserRole = {
      id: Date.now().toString(),
      ...newRole
    };
    
    setRoles([...roles, role]);
    setIsAddRoleDialogOpen(false);
    setNewRole({
      name: "",
      permissions: {
        viewDashboard: true,
        manageProducts: false,
        manageInventory: false,
        manageSales: false,
        manageCustomers: false,
        manageFinances: false,
        manageReports: false,
        manageSettings: false,
        manageUsers: false
      }
    });
    toast.success("Role added successfully");
  };
  
  // Edit Role
  const handleEditRole = () => {
    if (!currentRole) return;
    
    const updatedRoles = roles.map(role =>
      role.id === currentRole.id ? currentRole : role
    );
    
    setRoles(updatedRoles);
    setIsEditRoleDialogOpen(false);
    toast.success("Role updated successfully");
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="store" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="store">
            <Building className="mr-2 h-4 w-4" />
            Store
          </TabsTrigger>
          <TabsTrigger value="tax">
            <CreditCard className="mr-2 h-4 w-4" />
            Tax
          </TabsTrigger>
          <TabsTrigger value="invoice">
            <CreditCard className="mr-2 h-4 w-4" />
            Invoice
          </TabsTrigger>
          <TabsTrigger value="email">
            <Bell className="mr-2 h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="roles">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Roles
          </TabsTrigger>
        </TabsList>
        
        {/* Store Settings Tab */}
        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>
                General information about your store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="store-name">Store Name</Label>
                  <Input 
                    id="store-name" 
                    value={storeSettings.name}
                    onChange={(e) => setStoreSettings({...storeSettings, name: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="store-email">Email</Label>
                  <Input 
                    id="store-email" 
                    type="email"
                    value={storeSettings.email}
                    onChange={(e) => setStoreSettings({...storeSettings, email: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="store-address">Address</Label>
                <Textarea 
                  id="store-address" 
                  value={storeSettings.address}
                  onChange={(e) => setStoreSettings({...storeSettings, address: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="store-phone">Phone</Label>
                  <Input 
                    id="store-phone" 
                    value={storeSettings.phone}
                    onChange={(e) => setStoreSettings({...storeSettings, phone: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="store-website">Website</Label>
                  <Input 
                    id="store-website" 
                    value={storeSettings.website}
                    onChange={(e) => setStoreSettings({...storeSettings, website: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="tax-id">Tax ID</Label>
                  <Input 
                    id="tax-id" 
                    value={storeSettings.taxId}
                    onChange={(e) => setStoreSettings({...storeSettings, taxId: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="currency-code">Currency</Label>
                  <Select 
                    value={storeSettings.currencyCode}
                    onValueChange={(value) => setStoreSettings({...storeSettings, currencyCode: value})}
                  >
                    <SelectTrigger id="currency-code">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IDR">Indonesian Rupiah (IDR)</SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="SGD">Singapore Dollar (SGD)</SelectItem>
                      <SelectItem value="MYR">Malaysian Ringgit (MYR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="store-logo">Store Logo</Label>
                <div className="flex items-center gap-4">
                  {storeSettings.logo ? (
                    <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                      <img 
                        src={storeSettings.logo} 
                        alt="Store logo" 
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center text-gray-500">
                      <Building className="h-10 w-10" />
                    </div>
                  )}
                  <div className="flex-1">
                    <Input 
                      id="store-logo" 
                      type="file"
                      accept="image/*"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Recommended: 512px × 512px, PNG or JPG format
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={saveStoreSettings}>Save Store Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Tax Settings Tab */}
        <TabsContent value="tax">
          <Card>
            <CardHeader>
              <CardTitle>Tax Configuration</CardTitle>
              <CardDescription>
                Configure how taxes are calculated and displayed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enable-tax">Enable Tax Calculation</Label>
                  <p className="text-sm text-muted-foreground">
                    Apply tax calculations to product prices
                  </p>
                </div>
                <Switch
                  id="enable-tax"
                  checked={taxSettings.enableTax}
                  onCheckedChange={(checked) => setTaxSettings({...taxSettings, enableTax: checked})}
                />
              </div>
              
              <div className="pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="tax-name">Tax Name</Label>
                    <Input 
                      id="tax-name" 
                      value={taxSettings.taxName}
                      onChange={(e) => setTaxSettings({...taxSettings, taxName: e.target.value})}
                      disabled={!taxSettings.enableTax}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tax-rate">Default Tax Rate (%)</Label>
                    <Input 
                      id="tax-rate" 
                      type="number"
                      value={taxSettings.defaultTaxRate}
                      onChange={(e) => setTaxSettings({...taxSettings, defaultTaxRate: parseFloat(e.target.value)})}
                      disabled={!taxSettings.enableTax}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="tax-number">Tax Registration Number</Label>
                  <Input 
                    id="tax-number" 
                    value={taxSettings.taxNumber}
                    onChange={(e) => setTaxSettings({...taxSettings, taxNumber: e.target.value})}
                    disabled={!taxSettings.enableTax}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="include-tax">Include Tax in Product Prices</Label>
                    <p className="text-sm text-muted-foreground">
                      Display prices with tax included
                    </p>
                  </div>
                  <Switch
                    id="include-tax"
                    checked={taxSettings.includeTaxInPrice}
                    onCheckedChange={(checked) => setTaxSettings({...taxSettings, includeTaxInPrice: checked})}
                    disabled={!taxSettings.enableTax}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={saveTaxSettings} disabled={!taxSettings.enableTax}>
                Save Tax Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Invoice Settings Tab */}
        <TabsContent value="invoice">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Settings</CardTitle>
              <CardDescription>
                Configure invoice numbering and default options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="invoice-prefix">Invoice Number Prefix</Label>
                  <Input 
                    id="invoice-prefix" 
                    value={invoiceSettings.prefix}
                    onChange={(e) => setInvoiceSettings({...invoiceSettings, prefix: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="next-number">Next Invoice Number</Label>
                  <Input 
                    id="next-number" 
                    type="number"
                    value={invoiceSettings.nextNumber}
                    onChange={(e) => setInvoiceSettings({...invoiceSettings, nextNumber: parseInt(e.target.value)})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="due-days">Payment Due Days</Label>
                  <Input 
                    id="due-days" 
                    type="number"
                    value={invoiceSettings.dueDays}
                    onChange={(e) => setInvoiceSettings({...invoiceSettings, dueDays: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Textarea 
                  id="terms" 
                  value={invoiceSettings.termsAndConditions}
                  onChange={(e) => setInvoiceSettings({...invoiceSettings, termsAndConditions: e.target.value})}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  These terms will appear at the bottom of each invoice
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-logo">Show Logo on Invoices</Label>
                  <p className="text-sm text-muted-foreground">
                    Display your store logo on printed invoices
                  </p>
                </div>
                <Switch
                  id="show-logo"
                  checked={invoiceSettings.showLogo}
                  onCheckedChange={(checked) => setInvoiceSettings({...invoiceSettings, showLogo: checked})}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={saveInvoiceSettings}>Save Invoice Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Email Settings Tab */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Configure email settings for automated notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enable-emails">Enable Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send automated emails for various events
                  </p>
                </div>
                <Switch
                  id="enable-emails"
                  checked={emailSettings.enableEmails}
                  onCheckedChange={(checked) => setEmailSettings({...emailSettings, enableEmails: checked})}
                />
              </div>
              
              <div className="pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="sender-name">Sender Name</Label>
                    <Input 
                      id="sender-name" 
                      value={emailSettings.senderName}
                      onChange={(e) => setEmailSettings({...emailSettings, senderName: e.target.value})}
                      disabled={!emailSettings.enableEmails}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sender-email">Sender Email</Label>
                    <Input 
                      id="sender-email" 
                      type="email"
                      value={emailSettings.senderEmail}
                      onChange={(e) => setEmailSettings({...emailSettings, senderEmail: e.target.value})}
                      disabled={!emailSettings.enableEmails}
                    />
                  </div>
                </div>
                
                <div className="space-y-3 pt-2">
                  <h3 className="text-sm font-medium">Email Notifications</h3>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="order-confirmation" className="flex-1">
                      Send order confirmation emails
                    </Label>
                    <Switch
                      id="order-confirmation"
                      checked={emailSettings.sendOrderConfirmation}
                      onCheckedChange={(checked) => setEmailSettings({...emailSettings, sendOrderConfirmation: checked})}
                      disabled={!emailSettings.enableEmails}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="payment-receipt" className="flex-1">
                      Send payment receipt emails
                    </Label>
                    <Switch
                      id="payment-receipt"
                      checked={emailSettings.sendPaymentReceipt}
                      onCheckedChange={(checked) => setEmailSettings({...emailSettings, sendPaymentReceipt: checked})}
                      disabled={!emailSettings.enableEmails}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="low-stock" className="flex-1">
                      Send low stock alerts
                    </Label>
                    <Switch
                      id="low-stock"
                      checked={emailSettings.sendLowStockAlert}
                      onCheckedChange={(checked) => setEmailSettings({...emailSettings, sendLowStockAlert: checked})}
                      disabled={!emailSettings.enableEmails}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email-signature">Email Signature</Label>
                  <Textarea 
                    id="email-signature" 
                    value={emailSettings.emailSignature}
                    onChange={(e) => setEmailSettings({...emailSettings, emailSignature: e.target.value})}
                    rows={3}
                    disabled={!emailSettings.enableEmails}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={saveEmailSettings} disabled={!emailSettings.enableEmails}>
                Save Email Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Accounts</CardTitle>
                  <CardDescription>
                    Manage user access to the system
                  </CardDescription>
                </div>
                <Button onClick={() => setIsAddUserDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.active ? 'Active' : 'Inactive'}
                        </div>
                      </TableCell>
                      <TableCell>{user.lastLogin || 'Never'}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setCurrentUser(user);
                            setIsEditUserDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setCurrentUser(user);
                            setIsDeleteUserDialogOpen(true);
                          }}
                          disabled={user.id === "1"} // Prevent deleting admin
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
        </TabsContent>
        
        {/* Roles Tab */}
        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Roles</CardTitle>
                  <CardDescription>
                    Configure role-based permissions
                  </CardDescription>
                </div>
                <Button onClick={() => setIsAddRoleDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Role
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role Name</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(role.permissions)
                            .filter(([_, value]) => value)
                            .map(([key, _], index) => (
                              <div 
                                key={index} 
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </div>
                            ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setCurrentRole(role);
                            setIsEditRoleDialogOpen(true);
                          }}
                          disabled={role.name === "Owner"} // Prevent editing owner role
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="user-name">Full Name</Label>
              <Input 
                id="user-name" 
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="user-email">Email Address</Label>
              <Input 
                id="user-email" 
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="user-role">Role</Label>
              <Select 
                value={newUser.role}
                onValueChange={(value) => setNewUser({...newUser, role: value})}
              >
                <SelectTrigger id="user-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="user-active"
                checked={newUser.active}
                onCheckedChange={(checked) => setNewUser({...newUser, active: checked})}
              />
              <Label htmlFor="user-active">Active Account</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user account information
            </DialogDescription>
          </DialogHeader>
          {currentUser && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-user-name">Full Name</Label>
                <Input 
                  id="edit-user-name" 
                  value={currentUser.name}
                  onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-user-email">Email Address</Label>
                <Input 
                  id="edit-user-email" 
                  type="email"
                  value={currentUser.email}
                  onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-user-role">Role</Label>
                <Select 
                  value={currentUser.role}
                  onValueChange={(value) => setCurrentUser({...currentUser, role: value})}
                  disabled={currentUser.id === "1"} // Prevent changing admin role
                >
                  <SelectTrigger id="edit-user-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.name}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-user-active"
                  checked={currentUser.active}
                  onCheckedChange={(checked) => setCurrentUser({...currentUser, active: checked})}
                  disabled={currentUser.id === "1"} // Prevent deactivating admin
                />
                <Label htmlFor="edit-user-active">Active Account</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteUserDialogOpen} onOpenChange={setIsDeleteUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user?
            </DialogDescription>
          </DialogHeader>
          <p>
            This will permanently delete the user account for "{currentUser?.name}".
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteUserDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Role Dialog */}
      <Dialog open={isAddRoleDialogOpen} onOpenChange={setIsAddRoleDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Role</DialogTitle>
            <DialogDescription>
              Create a new user role with specific permissions
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="role-name">Role Name</Label>
              <Input 
                id="role-name" 
                value={newRole.name}
                onChange={(e) => setNewRole({...newRole, name: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label>Permissions</Label>
              <div className="space-y-3 border rounded-md p-4">
                {Object.entries(newRole.permissions).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label htmlFor={`permission-${key}`} className="flex-1">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Label>
                    <Switch
                      id={`permission-${key}`}
                      checked={value}
                      onCheckedChange={(checked) => 
                        setNewRole({
                          ...newRole, 
                          permissions: {
                            ...newRole.permissions,
                            [key]: checked
                          }
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRole}>Add Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditRoleDialogOpen} onOpenChange={setIsEditRoleDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Update role permissions
            </DialogDescription>
          </DialogHeader>
          {currentRole && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-role-name">Role Name</Label>
                <Input 
                  id="edit-role-name" 
                  value={currentRole.name}
                  onChange={(e) => setCurrentRole({...currentRole, name: e.target.value})}
                  disabled={currentRole.name === "Owner"} // Prevent editing owner role name
                />
              </div>
              <div className="grid gap-2">
                <Label>Permissions</Label>
                <div className="space-y-3 border rounded-md p-4">
                  {Object.entries(currentRole.permissions).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label htmlFor={`edit-permission-${key}`} className="flex-1">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </Label>
                      <Switch
                        id={`edit-permission-${key}`}
                        checked={value}
                        onCheckedChange={(checked) => 
                          setCurrentRole({
                            ...currentRole, 
                            permissions: {
                              ...currentRole.permissions,
                              [key]: checked
                            }
                          })
                        }
                        disabled={currentRole.name === "Owner"} // Prevent editing owner permissions
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleEditRole}
              disabled={currentRole?.name === "Owner"} // Prevent saving owner role changes
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

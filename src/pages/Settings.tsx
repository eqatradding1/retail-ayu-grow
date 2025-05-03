
import { useState, useEffect } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  User, 
  Building, 
  CreditCard, 
  Users, 
  Bell, 
  ShieldCheck, 
  Trash2, 
  Plus,
  Pencil,
  Loader2 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { uploadFile } from "@/utils/storage";
import {
  StoreSettings,
  TaxSettings,
  InvoiceSettings,
  EmailSettings,
  UserRole
} from "@/types/product";

interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  lastLogin?: string;
}

export default function Settings() {
  const { user } = useAuth();
  
  // Loading states
  const [isLoading, setIsLoading] = useState({
    store: true,
    tax: true,
    invoice: true,
    email: true,
    roles: true,
    users: true
  });

  // Store Settings State
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    id: "",
    name: "RetailAyu Store",
    address: "123 Commerce St, Jakarta",
    phone: "555-123-4567",
    email: "contact@retailayu.com",
    website: "www.retailayu.com",
    tax_id: "12345-67890",
    currency_code: "IDR",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  // Tax Settings State
  const [taxSettings, setTaxSettings] = useState<TaxSettings>({
    id: "",
    enable_tax: true,
    default_tax_rate: 11,
    tax_name: "PPN",
    tax_number: "TAX-123456",
    include_tax_in_price: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  
  // Invoice Settings State
  const [invoiceSettings, setInvoiceSettings] = useState<InvoiceSettings>({
    id: "",
    prefix: "INV",
    next_number: 1001,
    terms_and_conditions: "Payment due within 14 days of invoice date. Late payments subject to a 2% monthly charge.",
    show_logo: true,
    due_days: 14,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  
  // Email Settings State
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    id: "",
    enable_emails: true,
    sender_name: "RetailAyu Store",
    sender_email: "sales@retailayu.com",
    send_order_confirmation: true,
    send_payment_receipt: true,
    send_low_stock_alert: true,
    email_signature: "Thank you for your business!\nRetailAyu Store Team",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  
  // User Roles State
  const [roles, setRoles] = useState<UserRole[]>([]);
  
  // User Accounts State
  const [users, setUsers] = useState<UserAccount[]>([]);

  // Dialog states
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false);
  const [isEditRoleDialogOpen, setIsEditRoleDialogOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  
  const [newUser, setNewUser] = useState<Omit<UserAccount, "id">>({
    name: "",
    email: "",
    role: "Cashier",
    active: true
  });
  
  const [newRole, setNewRole] = useState<Omit<UserRole, "id" | "created_at" | "updated_at">>({
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

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch store settings
        const { data: storeData, error: storeError } = await supabase
          .from('store_settings')
          .select('*')
          .limit(1)
          .single();
        
        if (storeError) throw storeError;
        if (storeData) setStoreSettings(storeData);
        setIsLoading(prev => ({ ...prev, store: false }));
        
        // Fetch tax settings
        const { data: taxData, error: taxError } = await supabase
          .from('tax_settings')
          .select('*')
          .limit(1)
          .single();
        
        if (taxError) throw taxError;
        if (taxData) setTaxSettings(taxData);
        setIsLoading(prev => ({ ...prev, tax: false }));
        
        // Fetch invoice settings
        const { data: invoiceData, error: invoiceError } = await supabase
          .from('invoice_settings')
          .select('*')
          .limit(1)
          .single();
        
        if (invoiceError) throw invoiceError;
        if (invoiceData) setInvoiceSettings(invoiceData);
        setIsLoading(prev => ({ ...prev, invoice: false }));
        
        // Fetch email settings
        const { data: emailData, error: emailError } = await supabase
          .from('email_settings')
          .select('*')
          .limit(1)
          .single();
        
        if (emailError) throw emailError;
        if (emailData) setEmailSettings(emailData);
        setIsLoading(prev => ({ ...prev, email: false }));
        
        // Fetch roles
        const { data: rolesData, error: rolesError } = await supabase
          .from('user_roles')
          .select('*')
          .order('name');
        
        if (rolesError) throw rolesError;
        if (rolesData) setRoles(rolesData);
        setIsLoading(prev => ({ ...prev, roles: false }));
        
        // Fetch users
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select(`
            id,
            first_name,
            last_name,
            avatar_url,
            role,
            updated_at
          `);
        
        if (profilesError) throw profilesError;
        
        if (profilesData) {
          const formattedUsers = profilesData.map(profile => ({
            id: profile.id,
            name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unnamed User',
            email: "", // We don't have this in profiles
            role: profile.role || "user",
            active: true,
            lastLogin: profile.updated_at
          }));
          
          setUsers(formattedUsers);
        }
        setIsLoading(prev => ({ ...prev, users: false }));
        
      } catch (error) {
        console.error("Error fetching settings data:", error);
        toast.error("Failed to load settings");
      }
    };

    fetchData();
  }, []);

  // Save Store Settings
  const saveStoreSettings = async () => {
    try {
      setIsLoading(prev => ({ ...prev, store: true }));
      
      // Upload logo if selected
      if (logoFile) {
        const logoUrl = await uploadFile(logoFile, 'product_images', 'logos');
        setStoreSettings(prev => ({ ...prev, logo_url: logoUrl }));
      }
      
      const { error } = await supabase
        .from('store_settings')
        .update({
          name: storeSettings.name,
          address: storeSettings.address,
          phone: storeSettings.phone,
          email: storeSettings.email,
          website: storeSettings.website,
          tax_id: storeSettings.tax_id,
          currency_code: storeSettings.currency_code,
          logo_url: storeSettings.logo_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', storeSettings.id);
      
      if (error) throw error;
      
      toast.success("Store settings saved successfully");
    } catch (error) {
      console.error("Error saving store settings:", error);
      toast.error("Failed to save store settings");
    } finally {
      setIsLoading(prev => ({ ...prev, store: false }));
    }
  };
  
  // Save Tax Settings
  const saveTaxSettings = async () => {
    try {
      setIsLoading(prev => ({ ...prev, tax: true }));
      
      const { error } = await supabase
        .from('tax_settings')
        .update({
          enable_tax: taxSettings.enable_tax,
          default_tax_rate: taxSettings.default_tax_rate,
          tax_name: taxSettings.tax_name,
          tax_number: taxSettings.tax_number,
          include_tax_in_price: taxSettings.include_tax_in_price,
          updated_at: new Date().toISOString()
        })
        .eq('id', taxSettings.id);
      
      if (error) throw error;
      
      toast.success("Tax settings saved successfully");
    } catch (error) {
      console.error("Error saving tax settings:", error);
      toast.error("Failed to save tax settings");
    } finally {
      setIsLoading(prev => ({ ...prev, tax: false }));
    }
  };
  
  // Save Invoice Settings
  const saveInvoiceSettings = async () => {
    try {
      setIsLoading(prev => ({ ...prev, invoice: true }));
      
      const { error } = await supabase
        .from('invoice_settings')
        .update({
          prefix: invoiceSettings.prefix,
          next_number: invoiceSettings.next_number,
          terms_and_conditions: invoiceSettings.terms_and_conditions,
          show_logo: invoiceSettings.show_logo,
          due_days: invoiceSettings.due_days,
          updated_at: new Date().toISOString()
        })
        .eq('id', invoiceSettings.id);
      
      if (error) throw error;
      
      toast.success("Invoice settings saved successfully");
    } catch (error) {
      console.error("Error saving invoice settings:", error);
      toast.error("Failed to save invoice settings");
    } finally {
      setIsLoading(prev => ({ ...prev, invoice: false }));
    }
  };
  
  // Save Email Settings
  const saveEmailSettings = async () => {
    try {
      setIsLoading(prev => ({ ...prev, email: true }));
      
      const { error } = await supabase
        .from('email_settings')
        .update({
          enable_emails: emailSettings.enable_emails,
          sender_name: emailSettings.sender_name,
          sender_email: emailSettings.sender_email,
          send_order_confirmation: emailSettings.send_order_confirmation,
          send_payment_receipt: emailSettings.send_payment_receipt,
          send_low_stock_alert: emailSettings.send_low_stock_alert,
          email_signature: emailSettings.email_signature,
          updated_at: new Date().toISOString()
        })
        .eq('id', emailSettings.id);
      
      if (error) throw error;
      
      toast.success("Email settings saved successfully");
    } catch (error) {
      console.error("Error saving email settings:", error);
      toast.error("Failed to save email settings");
    } finally {
      setIsLoading(prev => ({ ...prev, email: false }));
    }
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
  const handleAddRole = async () => {
    if (!newRole.name) {
      toast.error("Please provide a role name");
      return;
    }
    
    try {
      setIsLoading(prev => ({ ...prev, roles: true }));
      
      const { data: roleData, error } = await supabase
        .from('user_roles')
        .insert({
          name: newRole.name,
          permissions: newRole.permissions
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (roleData) {
        setRoles([...roles, roleData]);
      }
      
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
    } catch (error) {
      console.error("Error adding role:", error);
      toast.error("Failed to add role");
    } finally {
      setIsLoading(prev => ({ ...prev, roles: false }));
    }
  };
  
  // Edit Role
  const handleEditRole = async () => {
    if (!currentRole) return;
    
    try {
      setIsLoading(prev => ({ ...prev, roles: true }));
      
      const { error } = await supabase
        .from('user_roles')
        .update({
          name: currentRole.name,
          permissions: currentRole.permissions,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentRole.id);
      
      if (error) throw error;
      
      const updatedRoles = roles.map(role =>
        role.id === currentRole.id ? currentRole : role
      );
      
      setRoles(updatedRoles);
      setIsEditRoleDialogOpen(false);
      toast.success("Role updated successfully");
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role");
    } finally {
      setIsLoading(prev => ({ ...prev, roles: false }));
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLogoFile(e.target.files[0]);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6 text-purple-900">Settings</h1>

      <Tabs defaultValue="store" className="w-full">
        <TabsList className="mb-6 bg-purple-100 p-1">
          <TabsTrigger value="store" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
            <Building className="mr-2 h-4 w-4" />
            Store
          </TabsTrigger>
          <TabsTrigger value="tax" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
            <CreditCard className="mr-2 h-4 w-4" />
            Tax
          </TabsTrigger>
          <TabsTrigger value="invoice" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
            <CreditCard className="mr-2 h-4 w-4" />
            Invoice
          </TabsTrigger>
          <TabsTrigger value="email" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
            <Bell className="mr-2 h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
            <Users className="mr-2 h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="roles" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Roles
          </TabsTrigger>
        </TabsList>
        
        {/* Store Settings Tab */}
        <TabsContent value="store">
          <Card className="border-purple-200 shadow-lg hover:shadow-purple-100 transition-all">
            <CardHeader className="bg-gradient-to-r from-purple-100 to-purple-50">
              <CardTitle className="text-purple-900">Store Information</CardTitle>
              <CardDescription>
                General information about your store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {isLoading.store ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="store-name">Store Name</Label>
                      <Input 
                        id="store-name" 
                        value={storeSettings.name}
                        onChange={(e) => setStoreSettings({...storeSettings, name: e.target.value})}
                        className="focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="store-email">Email</Label>
                      <Input 
                        id="store-email" 
                        type="email"
                        value={storeSettings.email || ''}
                        onChange={(e) => setStoreSettings({...storeSettings, email: e.target.value})}
                        className="focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="store-address">Address</Label>
                    <Textarea 
                      id="store-address" 
                      value={storeSettings.address || ''}
                      onChange={(e) => setStoreSettings({...storeSettings, address: e.target.value})}
                      rows={3}
                      className="focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="store-phone">Phone</Label>
                      <Input 
                        id="store-phone" 
                        value={storeSettings.phone || ''}
                        onChange={(e) => setStoreSettings({...storeSettings, phone: e.target.value})}
                        className="focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="store-website">Website</Label>
                      <Input 
                        id="store-website" 
                        value={storeSettings.website || ''}
                        onChange={(e) => setStoreSettings({...storeSettings, website: e.target.value})}
                        className="focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="tax-id">Tax ID</Label>
                      <Input 
                        id="tax-id" 
                        value={storeSettings.tax_id || ''}
                        onChange={(e) => setStoreSettings({...storeSettings, tax_id: e.target.value})}
                        className="focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="currency-code">Currency</Label>
                      <Select 
                        value={storeSettings.currency_code}
                        onValueChange={(value) => setStoreSettings({...storeSettings, currency_code: value})}
                      >
                        <SelectTrigger id="currency-code" className="focus:ring-purple-500 focus:border-purple-500">
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
                      {storeSettings.logo_url ? (
                        <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                          <img 
                            src={storeSettings.logo_url} 
                            alt="Store logo" 
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 bg-purple-100 rounded-md flex items-center justify-center text-purple-500">
                          <Building className="h-10 w-10" />
                        </div>
                      )}
                      <div className="flex-1">
                        <Input 
                          id="store-logo" 
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="focus:ring-purple-500 focus:border-purple-500"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Recommended: 512px × 512px, PNG or JPG format
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-end bg-gradient-to-r from-purple-50 to-purple-100">
              <Button 
                onClick={saveStoreSettings} 
                disabled={isLoading.store}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isLoading.store ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : "Save Store Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Tax Settings Tab */}
        <TabsContent value="tax">
          <Card className="border-purple-200 shadow-lg hover:shadow-purple-100 transition-all">
            <CardHeader className="bg-gradient-to-r from-purple-100 to-purple-50">
              <CardTitle className="text-purple-900">Tax Configuration</CardTitle>
              <CardDescription>
                Configure how taxes are calculated and displayed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {isLoading.tax ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enable-tax">Enable Tax Calculation</Label>
                      <p className="text-sm text-muted-foreground">
                        Apply tax calculations to product prices
                      </p>
                    </div>
                    <Switch
                      id="enable-tax"
                      checked={taxSettings.enable_tax}
                      onCheckedChange={(checked) => setTaxSettings({...taxSettings, enable_tax: checked})}
                      className="data-[state=checked]:bg-purple-600"
                    />
                  </div>
                  
                  <div className="pt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="tax-name">Tax Name</Label>
                        <Input 
                          id="tax-name" 
                          value={taxSettings.tax_name}
                          onChange={(e) => setTaxSettings({...taxSettings, tax_name: e.target.value})}
                          disabled={!taxSettings.enable_tax}
                          className="focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="tax-rate">Default Tax Rate (%)</Label>
                        <Input 
                          id="tax-rate" 
                          type="number"
                          value={taxSettings.default_tax_rate}
                          onChange={(e) => setTaxSettings({...taxSettings, default_tax_rate: parseFloat(e.target.value)})}
                          disabled={!taxSettings.enable_tax}
                          className="focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="tax-number">Tax Registration Number</Label>
                      <Input 
                        id="tax-number" 
                        value={taxSettings.tax_number || ''}
                        onChange={(e) => setTaxSettings({...taxSettings, tax_number: e.target.value})}
                        disabled={!taxSettings.enable_tax}
                        className="focus:ring-purple-500 focus:border-purple-500"
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
                        checked={taxSettings.include_tax_in_price}
                        onCheckedChange={(checked) => setTaxSettings({...taxSettings, include_tax_in_price: checked})}
                        disabled={!taxSettings.enable_tax}
                        className="data-[state=checked]:bg-purple-600"
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-end bg-gradient-to-r from-purple-50 to-purple-100">
              <Button 
                onClick={saveTaxSettings} 
                disabled={!taxSettings.enable_tax || isLoading.tax}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isLoading.tax ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : "Save Tax Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Invoice Settings Tab */}
        <TabsContent value="invoice">
          <Card className="border-purple-200 shadow-lg hover:shadow-purple-100 transition-all">
            <CardHeader className="bg-gradient-to-r from-purple-100 to-purple-50">
              <CardTitle className="text-purple-900">Invoice Settings</CardTitle>
              <CardDescription>
                Configure invoice numbering and default options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {isLoading.invoice ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="invoice-prefix">Invoice Number Prefix</Label>
                      <Input 
                        id="invoice-prefix" 
                        value={invoiceSettings.prefix}
                        onChange={(e) => setInvoiceSettings({...invoiceSettings, prefix: e.target.value})}
                        className="focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="next-number">Next Invoice Number</Label>
                      <Input 
                        id="next-number" 
                        type="number"
                        value={invoiceSettings.next_number}
                        onChange={(e) => setInvoiceSettings({...invoiceSettings, next_number: parseInt(e.target.value)})}
                        className="focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="due-days">Payment Due Days</Label>
                      <Input 
                        id="due-days" 
                        type="number"
                        value={invoiceSettings.due_days}
                        onChange={(e) => setInvoiceSettings({...invoiceSettings, due_days: parseInt(e.target.value)})}
                        className="focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="terms">Terms & Conditions</Label>
                    <Textarea 
                      id="terms" 
                      value={invoiceSettings.terms_and_conditions || ''}
                      onChange={(e) => setInvoiceSettings({...invoiceSettings, terms_and_conditions: e.target.value})}
                      rows={4}
                      className="focus:ring-purple-500 focus:border-purple-500"
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
                      checked={invoiceSettings.show_logo}
                      onCheckedChange={(checked) => setInvoiceSettings({...invoiceSettings, show_logo: checked})}
                      className="data-[state=checked]:bg-purple-600"
                    />
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-end bg-gradient-to-r from-purple-50 to-purple-100">
              <Button 
                onClick={saveInvoiceSettings}
                disabled={isLoading.invoice}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isLoading.invoice ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : "Save Invoice Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Email Settings Tab */}
        <TabsContent value="email">
          <Card className="border-purple-200 shadow-lg hover:shadow-purple-100 transition-all">
            <CardHeader className="bg-gradient-to-r from-purple-100 to-purple-50">
              <CardTitle className="text-purple-900">Email Notifications</CardTitle>
              <CardDescription>
                Configure email settings for automated notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {isLoading.email ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enable-emails">Enable Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Send automated emails for various events
                      </p>
                    </div>
                    <Switch
                      id="enable-emails"
                      checked={emailSettings.enable_emails}
                      onCheckedChange={(checked) => setEmailSettings({...emailSettings, enable_emails: checked})}
                      className="data-[state=checked]:bg-purple-600"
                    />
                  </div>
                  
                  <div className="pt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="sender-name">Sender Name</Label>
                        <Input 
                          id="sender-name" 
                          value={emailSettings.sender_name}
                          onChange={(e) => setEmailSettings({...emailSettings, sender_name: e.target.value})}
                          disabled={!emailSettings.enable_emails}
                          className="focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="sender-email">Sender Email</Label>
                        <Input 
                          id="sender-email" 
                          type="email"
                          value={emailSettings.sender_email || ''}
                          onChange={(e) => setEmailSettings({...emailSettings, sender_email: e.target.value})}
                          disabled={!emailSettings.enable_emails}
                          className="focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3 pt-2">
                      <h3 className="text-sm font-medium text-purple-900">Email Notifications</h3>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="order-confirmation" className="flex-1">
                          Send order confirmation emails
                        </Label>
                        <Switch
                          id="order-confirmation"
                          checked={emailSettings.send_order_confirmation}
                          onCheckedChange={(checked) => setEmailSettings({...emailSettings, send_order_confirmation: checked})}
                          disabled={!emailSettings.enable_emails}
                          className="data-[state=checked]:bg-purple-600"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="payment-receipt" className="flex-1">
                          Send payment receipt emails
                        </Label>
                        <Switch
                          id="payment-receipt"
                          checked={emailSettings.send_payment_receipt}
                          onCheckedChange={(checked) => setEmailSettings({...emailSettings, send_payment_receipt: checked})}
                          disabled={!emailSettings.enable_emails}
                          className="data-[state=checked]:bg-purple-600"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="low-stock" className="flex-1">
                          Send low stock alerts
                        </Label>
                        <Switch
                          id="low-stock"
                          checked={emailSettings.send_low_stock_alert}
                          onCheckedChange={(checked) => setEmailSettings({...emailSettings, send_low_stock_alert: checked})}
                          disabled={!emailSettings.enable_emails}
                          className="data-[state=checked]:bg-purple-600"
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="email-signature">Email Signature</Label>
                      <Textarea 
                        id="email-signature" 
                        value={emailSettings.email_signature || ''}
                        onChange={(e) => setEmailSettings({...emailSettings, email_signature: e.target.value})}
                        rows={3}
                        disabled={!emailSettings.enable_emails}
                        className="focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-end bg-gradient-to-r from-purple-50 to-purple-100">
              <Button 
                onClick={saveEmailSettings} 
                disabled={!emailSettings.enable_emails || isLoading.email}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isLoading.email ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : "Save Email Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Users Tab */}
        <TabsContent value="users">
          <Card className="border-purple-200 shadow-lg hover:shadow-purple-100 transition-all">
            <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-purple-100 to-purple-50">
              <div>
                <CardTitle className="text-purple-900">User Management</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </div>
              <Button onClick={() => setIsAddUserDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="mr-2 h-4 w-4" /> Add User
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              {isLoading.users ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                </div>
              ) : (
                <Table className="border rounded-md">
                  <TableHeader className="bg-purple-50">
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map(user => (
                        <TableRow key={user.id} className="hover:bg-purple-50">
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell><span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">{user.role}</span></TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-2 ${user.active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                              {user.active ? "Active" : "Inactive"}
                            </div>
                          </TableCell>
                          <TableCell>{user.lastLogin || "Never"}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setCurrentUser(user);
                                setIsEditUserDialogOpen(true);
                              }}
                              className="hover:bg-purple-100 hover:text-purple-800"
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
                              className="hover:bg-red-100 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Roles Tab */}
        <TabsContent value="roles">
          <Card className="border-purple-200 shadow-lg hover:shadow-purple-100 transition-all">
            <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-purple-100 to-purple-50">
              <div>
                <CardTitle className="text-purple-900">Role Management</CardTitle>
                <CardDescription>Define user roles and permissions</CardDescription>
              </div>
              <Button onClick={() => setIsAddRoleDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="mr-2 h-4 w-4" /> Add Role
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              {isLoading.roles ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                </div>
              ) : (
                <Table className="border rounded-md">
                  <TableHeader className="bg-purple-50">
                    <TableRow>
                      <TableHead>Role Name</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                          No roles found
                        </TableCell>
                      </TableRow>
                    ) : (
                      roles.map(role => (
                        <TableRow key={role.id} className="hover:bg-purple-50">
                          <TableCell className="font-medium">{role.name}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(role.permissions)
                                .filter(([_, hasPermission]) => hasPermission)
                                .map(([perm, _], index) => (
                                  <span key={index} className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded">
                                    {perm.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                  </span>
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
                              className="hover:bg-purple-100 hover:text-purple-800"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-purple-900">Add New User</DialogTitle>
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
                className="focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="user-email">Email Address</Label>
              <Input 
                id="user-email" 
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                className="focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="user-role">Role</Label>
              <Select 
                value={newUser.role}
                onValueChange={(value) => setNewUser({...newUser, role: value})}
              >
                <SelectTrigger id="user-role" className="focus:ring-purple-500 focus:border-purple-500">
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
                className="data-[state=checked]:bg-purple-600"
              />
              <Label htmlFor="user-active">Active Account</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser} className="bg-purple-600 hover:bg-purple-700 text-white">Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-purple-900">Edit User</DialogTitle>
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
                  className="focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-user-email">Email Address</Label>
                <Input 
                  id="edit-user-email" 
                  type="email"
                  value={currentUser.email}
                  onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})}
                  className="focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-user-role">Role</Label>
                <Select 
                  value={currentUser.role}
                  onValueChange={(value) => setCurrentUser({...currentUser, role: value})}
                  disabled={currentUser.id === "1"} // Prevent changing admin role
                >
                  <SelectTrigger id="edit-user-role" className="focus:ring-purple-500 focus:border-purple-500">
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
                  className="data-[state=checked]:bg-purple-600"
                />
                <Label htmlFor="edit-user-active">Active Account</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditUser} className="bg-purple-600 hover:bg-purple-700 text-white">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteUserDialogOpen} onOpenChange={setIsDeleteUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-purple-900">Delete User</DialogTitle>
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
            <DialogTitle className="text-purple-900">Add New Role</DialogTitle>
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
                className="focus:ring-purple-500 focus:border-purple-500"
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
                      className="data-[state=checked]:bg-purple-600"
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
            <Button onClick={handleAddRole} className="bg-purple-600 hover:bg-purple-700 text-white">Add Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditRoleDialogOpen} onOpenChange={setIsEditRoleDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-purple-900">Edit Role</DialogTitle>
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
                  className="focus:ring-purple-500 focus:border-purple-500"
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
                        className="data-[state=checked]:bg-purple-600"
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
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

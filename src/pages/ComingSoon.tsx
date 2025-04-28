
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

const ComingSoon = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the current route to display in the message
  const currentSection = location.pathname.split("/").filter(Boolean)[0];
  const sectionName = currentSection.charAt(0).toUpperCase() + currentSection.slice(1);
  
  const handleNotify = () => {
    toast.success("We'll notify you when this feature is ready!");
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <div className="w-24 h-24 mb-8 bg-retailayu-soft-gray rounded-full flex items-center justify-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-12 w-12 text-retailayu-purple" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      </div>
      
      <h1 className="text-3xl font-bold mb-4">{sectionName} Coming Soon</h1>
      
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        We're working hard to bring you this feature. It will be available in the next update of RetailAyu.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={() => navigate("/dashboard")} variant="outline">
          Back to Dashboard
        </Button>
        <Button onClick={handleNotify} className="retailayu-gradient">
          Notify Me When Ready
        </Button>
      </div>
      
      <div className="mt-12 p-6 border rounded-lg bg-card max-w-lg">
        <h2 className="text-lg font-semibold mb-3">What to expect in the {sectionName} section:</h2>
        
        {currentSection === "products" && (
          <ul className="text-left space-y-2">
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-retailayu-purple/20 text-retailayu-purple flex items-center justify-center mr-2 mt-0.5">✓</div>
              <span>Barcode scanner integration for product entry</span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-retailayu-purple/20 text-retailayu-purple flex items-center justify-center mr-2 mt-0.5">✓</div>
              <span>Tiered pricing based on purchase volume</span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-retailayu-purple/20 text-retailayu-purple flex items-center justify-center mr-2 mt-0.5">✓</div>
              <span>Expiration date tracking and alerts</span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-retailayu-purple/20 text-retailayu-purple flex items-center justify-center mr-2 mt-0.5">✓</div>
              <span>Loyalty points assignment per product</span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-retailayu-purple/20 text-retailayu-purple flex items-center justify-center mr-2 mt-0.5">✓</div>
              <span>Excel/CSV import and export</span>
            </li>
          </ul>
        )}
        
        {currentSection === "pos" && (
          <ul className="text-left space-y-2">
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-retailayu-purple/20 text-retailayu-purple flex items-center justify-center mr-2 mt-0.5">✓</div>
              <span>Barcode scanner integration for fast checkout</span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-retailayu-purple/20 text-retailayu-purple flex items-center justify-center mr-2 mt-0.5">✓</div>
              <span>Automatic price adjustment based on quantity</span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-retailayu-purple/20 text-retailayu-purple flex items-center justify-center mr-2 mt-0.5">✓</div>
              <span>Multiple payment methods (cash/transfer/credit)</span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-retailayu-purple/20 text-retailayu-purple flex items-center justify-center mr-2 mt-0.5">✓</div>
              <span>Loyalty points redemption for discounts</span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-retailayu-purple/20 text-retailayu-purple flex items-center justify-center mr-2 mt-0.5">✓</div>
              <span>Thermal receipt printing</span>
            </li>
          </ul>
        )}
        
        {currentSection === "inventory" && (
          <ul className="text-left space-y-2">
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-retailayu-purple/20 text-retailayu-purple flex items-center justify-center mr-2 mt-0.5">✓</div>
              <span>Purchase and stock intake management</span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-retailayu-purple/20 text-retailayu-purple flex items-center justify-center mr-2 mt-0.5">✓</div>
              <span>Return processing and tracking</span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-retailayu-purple/20 text-retailayu-purple flex items-center justify-center mr-2 mt-0.5">✓</div>
              <span>Product variant management</span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-retailayu-purple/20 text-retailayu-purple flex items-center justify-center mr-2 mt-0.5">✓</div>
              <span>Supplier database with CRUD operations</span>
            </li>
          </ul>
        )}
        
        {currentSection === "customers" && (
          <ul className="text-left space-y-2">
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-retailayu-purple/20 text-retailayu-purple flex items-center justify-center mr-2 mt-0.5">✓</div>
              <span>Customer profile management</span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-retailayu-purple/20 text-retailayu-purple flex items-center justify-center mr-2 mt-0.5">✓</div>
              <span>Transaction history and loyalty points tracking</span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-retailayu-purple/20 text-retailayu-purple flex items-center justify-center mr-2 mt-0.5">✓</div>
              <span>QR code generation for customer identification</span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-retailayu-purple/20 text-retailayu-purple flex items-center justify-center mr-2 mt-0.5">✓</div>
              <span>Birthday tracking and automated promotions</span>
            </li>
          </ul>
        )}
        
        {currentSection === "billing" && (
          <ul className="text-left space-y-2">
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-retailayu-purple/20 text-retailayu-purple flex items-center justify-center mr-2 mt-0.5">✓</div>
              <span>Credit payment tracking and management</span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-retailayu-purple/20 text-retailayu-purple flex items-center justify-center mr-2 mt-0.5">✓</div>
              <span>Due date reminders and notifications</span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-retailayu-purple/20 text-retailayu-purple flex items-center justify-center mr-2 mt-0.5">✓</div>
              <span>Payment receipt generation</span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-retailayu-purple/20 text-retailayu-purple flex items-center justify-center mr-2 mt-0.5">✓</div>
              <span>Credit limit management per customer</span>
            </li>
          </ul>
        )}
        
        {currentSection === "expenses" && (
          <ul className="text-left space-y-2">
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-retailayu-purple/20 text-retailayu-purple flex items-center justify-center mr-2 mt-0.5">✓</div>
              <span>Expense categories and tracking</span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-retailayu-purple/20 text-retailayu-purple flex items-center justify-center mr-2 mt-0.5">✓</div>
              <span>Receipt and invoice attachment</span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-retailayu-purple/20 text-retailayu-purple flex items-center justify-center mr-2 mt-0.5">✓</div>
              <span>Expense approval workflows</span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-retailayu-purple/20 text-retailayu-purple flex items-center justify-center mr-2 mt-0.5">✓</div>
              <span>Expense reports and analysis</span>
            </li>
          </ul>
        )}
        
        {currentSection === "reports" && (
          <ul className="text-left space-y-2">
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-retailayu-purple/20 text-retailayu-purple flex items-center justify-center mr-2 mt-0.5">✓</div>
              <span>Sales reports (daily/weekly/monthly/annual)</span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-retailayu-purple/20 text-retailayu-purple flex items-center justify-center mr-2 mt-0.5">✓</div>
              <span>Inventory and stock level reports</span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-retailayu-purple/20 text-retailayu-purple flex items-center justify-center mr-2 mt-0.5">✓</div>
              <span>Customer demographics analysis</span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-retailayu-purple/20 text-retailayu-purple flex items-center justify-center mr-2 mt-0.5">✓</div>
              <span>Net profit calculation and reports</span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-retailayu-purple/20 text-retailayu-purple flex items-center justify-center mr-2 mt-0.5">✓</div>
              <span>Expense and disbursement reports</span>
            </li>
          </ul>
        )}
        
        {currentSection === "loyalty" && (
          <ul className="text-left space-y-2">
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-retailayu-purple/20 text-retailayu-purple flex items-center justify-center mr-2 mt-0.5">✓</div>
              <span>Loyalty point management and tracking</span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-retailayu-purple/20 text-retailayu-purple flex items-center justify-center mr-2 mt-0.5">✓</div>
              <span>Product exchange for loyalty points</span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-retailayu-purple/20 text-retailayu-purple flex items-center justify-center mr-2 mt-0.5">✓</div>
              <span>Loyalty tier configuration</span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-retailayu-purple/20 text-retailayu-purple flex items-center justify-center mr-2 mt-0.5">✓</div>
              <span>Special promotions and offers for loyal customers</span>
            </li>
          </ul>
        )}
        
        {currentSection === "settings" && (
          <ul className="text-left space-y-2">
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-retailayu-purple/20 text-retailayu-purple flex items-center justify-center mr-2 mt-0.5">✓</div>
              <span>User management with role-based access control</span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-retailayu-purple/20 text-retailayu-purple flex items-center justify-center mr-2 mt-0.5">✓</div>
              <span>System configuration and preferences</span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-retailayu-purple/20 text-retailayu-purple flex items-center justify-center mr-2 mt-0.5">✓</div>
              <span>Business information and branding settings</span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-retailayu-purple/20 text-retailayu-purple flex items-center justify-center mr-2 mt-0.5">✓</div>
              <span>Backup and data management</span>
            </li>
          </ul>
        )}
        
        {!["products", "pos", "inventory", "customers", "billing", "expenses", "reports", "loyalty", "settings"].includes(currentSection) && (
          <p className="text-muted-foreground">Details for this section will be available soon.</p>
        )}
      </div>
    </div>
  );
};

export default ComingSoon;

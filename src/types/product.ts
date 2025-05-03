
// Product types for inventory management with Supabase integration

export interface Product {
  id: string;
  name: string;
  barcode?: string;
  description?: string;
  category_id: string;
  unit_id: string;
  stock_quantity: number;
  min_stock_level: number;
  cost_price: number;
  retail_price: number;
  priceLevels: PriceLevel[];
  loyalty_points: number;
  created_at: string;
  updated_at: string;
  photo_url?: string;
  expiry_date?: string;
}

export interface PriceLevel {
  id: string;
  product_id: string;
  min_quantity: number;
  price: number;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Unit {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  sku: string;
  barcode?: string;
  cost_price: number;
  retail_price: number;
  stock_quantity: number;
}

export interface StockTransaction {
  id: string;
  product_id: string;
  type: 'purchase' | 'sale' | 'return' | 'adjustment';
  quantity: number;
  unit_price: number;
  supplier_id?: string;
  invoice_number?: string;
  date: string;
  notes?: string;
  variantDetails?: ProductVariant;
}

export interface Supplier {
  id: string;
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  loyalty_points: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  customer_id?: string;
  total_amount: number;
  discount_amount?: number;
  tax_amount?: number;
  payment_method?: string;
  payment_status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionItem {
  id: string;
  transaction_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: string;
}

// Settings interfaces
export interface StoreSettings {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  tax_id?: string;
  currency_code: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface TaxSettings {
  id: string;
  enable_tax: boolean;
  default_tax_rate: number;
  tax_name: string;
  tax_number?: string;
  include_tax_in_price: boolean;
  created_at: string;
  updated_at: string;
}

export interface InvoiceSettings {
  id: string;
  prefix: string;
  next_number: number;
  terms_and_conditions?: string;
  show_logo: boolean;
  due_days: number;
  created_at: string;
  updated_at: string;
}

export interface EmailSettings {
  id: string;
  enable_emails: boolean;
  sender_name: string;
  sender_email?: string;
  send_order_confirmation: boolean;
  send_payment_receipt: boolean;
  send_low_stock_alert: boolean;
  email_signature?: string;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  name: string;
  permissions: {
    [key: string]: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface CreditRecord {
  id: string;
  transaction_id?: string;
  customer_id?: string;
  initial_amount: number;
  remaining_amount: number;
  due_date: string;
  status: string;
  last_reminder_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  customer?: Customer;
}

export interface CreditPayment {
  id: string;
  credit_record_id?: string;
  amount: number;
  payment_method?: string;
  payment_date: string;
  notes?: string;
  receipt_url?: string;
}

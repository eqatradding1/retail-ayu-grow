
export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Unit {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PriceLevel {
  id: string;
  minQuantity: number;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  barcode?: string;
  description?: string;
  categoryId: string;
  unitId: string;
  stockQuantity: number;
  minStockLevel: number;
  costPrice: number;
  retailPrice: number;
  priceLevels: PriceLevel[];
  loyaltyPoints: number;
  imageUrl?: string;
  expirationDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  barcode?: string;
  stockQuantity: number;
  costPrice: number;
  retailPrice: number;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface StockTransaction {
  id: string;
  productId: string;
  variantId?: string;
  type: 'purchase' | 'sale' | 'return' | 'adjustment';
  quantity: number;
  unitPrice: number;
  supplierId?: string;
  invoiceNumber?: string;
  date: string;
  notes?: string;
  // These fields are for the enhanced inventory management
  variantDetails?: {
    id: string;
    productId: string;
    name: string;
    stockQuantity: number;
    costPrice: number;
    retailPrice: number;
  };
  productPriceUpdate?: {
    productId: string;
    costPrice: number;
    retailPrice: number;
  };
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  loyaltyPoints: number;
  totalSpent: number;
  lastPurchase?: string;
  notes?: string;
  customerCode?: string;
}

export interface PurchaseInvoice {
  id: string;
  invoiceNumber: string;
  supplierId: string;
  date: string;
  items: {
    productId: string;
    variantId?: string;
    quantity: number;
    unitPrice: number;
  }[];
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaleInvoice {
  id: string;
  invoiceNumber: string;
  customerId?: string;
  customerName?: string;
  date: string;
  items: {
    productId: string;
    productName: string;
    variantId?: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    subtotal: number;
  }[];
  subtotal: number;
  taxAmount: number;
  discount?: number;
  totalAmount: number;
  amountPaid: number;
  paymentMethod: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

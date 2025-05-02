// Product types for inventory management

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
  createdAt: string;
  updatedAt: string;
  photoUrl?: string; // New field for product photo
  expiryDate?: string; // New field for product expiration date
}

export interface PriceLevel {
  id: string;
  minQuantity: number;
  price: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Unit {
  id: string;
  name: string;
  description?: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  barcode?: string;
  costPrice: number;
  retailPrice: number;
  stockQuantity: number;
}

export interface StockTransaction {
  id: string;
  productId: string;
  type: 'purchase' | 'sale' | 'return' | 'adjustment';
  quantity: number;
  unitPrice: number;
  supplierId?: string;
  invoiceNumber?: string;
  date: string;
  notes?: string;
  variantDetails?: ProductVariant;
  productPriceUpdate?: {
    productId: string;
    costPrice: number;
    retailPrice: number;
  };
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
}

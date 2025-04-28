
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
  expiryDate?: string;
  loyaltyPoints: number;
  imageUrl?: string;
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
  type: 'purchase' | 'sale' | 'return' | 'adjustment';
  quantity: number;
  unitPrice: number;
  supplierId?: string;
  invoiceNumber?: string;
  date: string;
  notes?: string;
}

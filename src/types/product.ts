export interface ProductVariant {
  price: number;
  brand: string;
  seller: string;
  rating: number;
  stock?: number;
  discount?: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  image: string;
  images?: string[];
  description: string;
  features?: string[];
  variants: ProductVariant[];
  tags?: string[];
  isRecommended?: boolean;
  originalPrice?: number;
}

export interface CartItem {
  productId: string;
  product: Product;
  variantIndex: number;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, variantIndex: number, quantity?: number) => void;
  removeFromCart: (productId: string, variantIndex: number) => void;
  updateQuantity: (productId: string, variantIndex: number, quantity: number) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  clearCart: () => void;
}

export interface EmotionAnalysis {
  emotion: string;
  confidence: number;
  timestamp: number;
  productId?: string;
  pricePoint?: number;
}

export type Category = 
  | 'Electronics'
  | 'Cloths'
  | 'Grocery'
  | 'Beauty'
  | 'Home'
  | 'Toys'
  | 'Pharmacy'
  | 'Sports'
  | 'Automotive'
  | 'Books';
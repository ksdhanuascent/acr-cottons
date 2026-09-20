export type ProductCategory = 'bedspread-sets' | 'curated-boxes' | 'cushions' | 'pillowcases';

export interface ProductSize {
  id: string;
  name: string;
  dimensions: string;
  inStock: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  shortDescription: string;
  highlightedMaterial: string;
  weave: string;
  threadCount: number;
  setContents: string;
  image: string;
  thumbnail: string;
  images: string[];
  designNumber?: number;
  sizes: ProductSize[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  badge?: string;
  careInstructions: string[];
}

export interface CartItem {
  id: string; // unique cart item key (productId + size)
  product: Product;
  selectedSize: string;
  quantity: number;
}

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: 'COD' | 'RAZORPAY';
  paymentStatus: 'PENDING_ON_DELIVERY' | 'PAID';
  shippingAddress: Address;
  createdAt: string;
  status: 'CONFIRMED' | 'WEAVING_IN_PROGRESS' | 'DISPATCHED' | 'DELIVERED';
  notes?: string;
}

export interface CustomOrder {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  designImage?: string; // base64 data url or preview
  designFileName?: string;
  fabric: string;
  dimensions: string;
  quantity: number;
  notes: string;
  status: 'UNDER_REVIEW' | 'CONTACTED' | 'APPROVED' | 'IN_PRODUCTION';
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userCity: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

'use client';

import { useState, useEffect } from 'react';
import { Product, CartItem, User, Address, Order, CustomOrder, Review } from './types';
import { INITIAL_REVIEWS } from './reviews-data';

// Storage keys
const STORAGE_KEYS = {
  CART: 'acr_cart_v1',
  USER: 'acr_user_v1',
  ORDERS: 'acr_orders_v1',
  CUSTOM_ORDERS: 'acr_custom_orders_v1',
  REVIEWS: 'acr_reviews_v2',
};

// Demo user seed
export const DEMO_USER: User = {
  id: 'usr-demo-87788',
  name: 'A.C. Raj Kumar (Demo Connoisseur)',
  email: 'demo@acrcottons.com',
  phone: '8778824123',
  createdAt: '2026-09-01T08:00:00.000Z',
  addresses: [
    {
      id: 'addr-01',
      name: 'A.C. Raj Kumar',
      street: '2, Sathya Moorthy Street, Surampatti Valasu',
      city: 'Erode',
      state: 'Tamil Nadu',
      pincode: '638009',
      phone: '8778824123',
      isDefault: true,
    },
    {
      id: 'addr-02',
      name: 'A.C. Raj Kumar (Showroom Suite)',
      street: '42, Cauvery Road, Near Textile Market',
      city: 'Erode',
      state: 'Tamil Nadu',
      pincode: '638001',
      phone: '8778824123',
      isDefault: false,
    },
  ],
};

// Event bus for multi-component reactivity
type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((listener) => listener());
}

// In-memory state cache
const stateCache = {
  cart: [] as CartItem[],
  user: null as User | null,
  orders: [] as Order[],
  customOrders: [] as CustomOrder[],
  reviews: INITIAL_REVIEWS as Review[],
  isCartOpen: false,
  isAuthModalOpen: false,
  authModalRedirect: null as string | null,
  isCheckoutModalOpen: false,
  quickViewProduct: null as Product | null,
  hydrated: false,
};

// Hydrate from localStorage in browser
function hydrate() {
  if (typeof window === 'undefined' || stateCache.hydrated) return;
  try {
    const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
    if (savedCart) stateCache.cart = JSON.parse(savedCart);

    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (savedUser) stateCache.user = JSON.parse(savedUser);

    const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (savedOrders) stateCache.orders = JSON.parse(savedOrders);

    const savedCustom = localStorage.getItem(STORAGE_KEYS.CUSTOM_ORDERS);
    if (savedCustom) stateCache.customOrders = JSON.parse(savedCustom);

    const savedReviews = localStorage.getItem(STORAGE_KEYS.REVIEWS) || localStorage.getItem('acr_reviews_v1');
    if (savedReviews) {
      try {
        const parsed = JSON.parse(savedReviews) as Review[];
        const existingIds = new Set(parsed.map((r) => r.id));
        const missingInitial = INITIAL_REVIEWS.filter((r) => !existingIds.has(r.id));
        stateCache.reviews = [...parsed, ...missingInitial];
        localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(stateCache.reviews));
      } catch {
        stateCache.reviews = INITIAL_REVIEWS;
        localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
      }
    } else {
      stateCache.reviews = INITIAL_REVIEWS;
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
    }
  } catch (e) {
    console.error('Failed to parse persistent storage', e);
  } finally {
    stateCache.hydrated = true;
    notify();
  }
}

// Persist helpers
function persistCart() {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(stateCache.cart));
  }
  notify();
}

function persistUser() {
  if (typeof window !== 'undefined') {
    if (stateCache.user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(stateCache.user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }
  notify();
}

function persistOrders() {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(stateCache.orders));
  }
  notify();
}

function persistCustomOrders() {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_ORDERS, JSON.stringify(stateCache.customOrders));
  }
  notify();
}

function persistReviews() {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(stateCache.reviews));
  }
  notify();
}

// Global Store API
export const useStore = () => {
  const [, setTick] = useState(0);

  useEffect(() => {
    hydrate();
    const handleUpdate = () => setTick((t) => t + 1);
    listeners.add(handleUpdate);
    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  // Cart Calculations
  const subtotal = stateCache.cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const itemCount = stateCache.cart.reduce((sum, item) => sum + item.quantity, 0);

  // Delivery fee logic:
  // ₹50 for orders with 1 item and subtotal < ₹500
  // Free (₹0) for bulk orders (2+ items or subtotal >= ₹500)
  const isFreeShippingUnlocked = itemCount >= 2 || subtotal >= 500;
  const shippingFee = stateCache.cart.length === 0 ? 0 : isFreeShippingUnlocked ? 0 : 50;
  const grandTotal = subtotal + shippingFee;
  const amountNeededForFreeShipping = Math.max(0, 500 - subtotal);

  return {
    hydrated: stateCache.hydrated,

    // Cart
    cart: stateCache.cart,
    itemCount,
    subtotal,
    shippingFee,
    grandTotal,
    isFreeShippingUnlocked,
    amountNeededForFreeShipping,
    isCartOpen: stateCache.isCartOpen,
    setCartOpen: (open: boolean) => {
      stateCache.isCartOpen = open;
      notify();
    },

    addToCart: (product: Product, selectedSize: string, quantity = 1) => {
      const cartItemId = `${product.id}-${selectedSize}`;
      const existing = stateCache.cart.find((item) => item.id === cartItemId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        stateCache.cart.push({
          id: cartItemId,
          product,
          selectedSize,
          quantity,
        });
      }
      stateCache.isCartOpen = true;
      persistCart();
    },

    updateQuantity: (cartItemId: string, quantity: number) => {
      if (quantity <= 0) {
        stateCache.cart = stateCache.cart.filter((item) => item.id !== cartItemId);
      } else {
        const item = stateCache.cart.find((i) => i.id === cartItemId);
        if (item) item.quantity = quantity;
      }
      persistCart();
    },

    removeFromCart: (cartItemId: string) => {
      stateCache.cart = stateCache.cart.filter((item) => item.id !== cartItemId);
      persistCart();
    },

    clearCart: () => {
      stateCache.cart = [];
      persistCart();
    },

    // Auth & Profile
    user: stateCache.user,
    isLoggedIn: !!stateCache.user,
    isAuthModalOpen: stateCache.isAuthModalOpen,
    authModalRedirect: stateCache.authModalRedirect,
    setAuthModalOpen: (open: boolean, redirectAction: string | null = null) => {
      stateCache.isAuthModalOpen = open;
      stateCache.authModalRedirect = redirectAction;
      notify();
    },

    login: (email: string, _password?: string) => {
      if (email.toLowerCase().includes('demo') || email.toLowerCase().includes('rajkumar')) {
        stateCache.user = { ...DEMO_USER };
      } else {
        stateCache.user = {
          id: `usr-${Date.now()}`,
          name: email.split('@')[0].replace('.', ' ').toUpperCase(),
          email,
          phone: '8778824123',
          createdAt: new Date().toISOString(),
          addresses: [
            {
              id: `addr-${Date.now()}`,
              name: email.split('@')[0].toUpperCase(),
              street: '2, Sathya Moorthy Street, Surampatti Valasu',
              city: 'Erode',
              state: 'Tamil Nadu',
              pincode: '638009',
              phone: '8778824123',
              isDefault: true,
            },
          ],
        };
      }
      stateCache.isAuthModalOpen = false;
      persistUser();
      return stateCache.user;
    },

    loginDemoUser: () => {
      stateCache.user = { ...DEMO_USER };
      stateCache.isAuthModalOpen = false;
      persistUser();
      return stateCache.user;
    },

    signup: (name: string, email: string, phone: string, _password?: string) => {
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name,
        email,
        phone,
        createdAt: new Date().toISOString(),
        addresses: [
          {
            id: `addr-${Date.now()}`,
            name,
            street: '2, Sathya Moorthy Street, Surampatti Valasu',
            city: 'Erode',
            state: 'Tamil Nadu',
            pincode: '638009',
            phone,
            isDefault: true,
          },
        ],
      };
      stateCache.user = newUser;
      stateCache.isAuthModalOpen = false;
      persistUser();
      return newUser;
    },

    updateProfile: (name: string, phone: string) => {
      if (stateCache.user) {
        stateCache.user.name = name;
        stateCache.user.phone = phone;
        persistUser();
      }
    },

    addAddress: (address: Omit<Address, 'id'>) => {
      if (!stateCache.user) return;
      const newAddr: Address = {
        ...address,
        id: `addr-${Date.now()}`,
      };
      if (newAddr.isDefault) {
        stateCache.user.addresses.forEach((a) => (a.isDefault = false));
      }
      stateCache.user.addresses.push(newAddr);
      persistUser();
    },

    removeAddress: (addressId: string) => {
      if (!stateCache.user) return;
      stateCache.user.addresses = stateCache.user.addresses.filter((a) => a.id !== addressId);
      if (stateCache.user.addresses.length > 0 && !stateCache.user.addresses.some((a) => a.isDefault)) {
        stateCache.user.addresses[0].isDefault = true;
      }
      persistUser();
    },

    logout: () => {
      stateCache.user = null;
      persistUser();
    },

    deleteAccount: () => {
      stateCache.user = null;
      stateCache.cart = [];
      stateCache.orders = [];
      stateCache.customOrders = [];
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.CART);
        localStorage.removeItem(STORAGE_KEYS.ORDERS);
        localStorage.removeItem(STORAGE_KEYS.CUSTOM_ORDERS);
      }
      notify();
    },

    // Checkout Modal
    isCheckoutModalOpen: stateCache.isCheckoutModalOpen,
    setCheckoutModalOpen: (open: boolean) => {
      stateCache.isCheckoutModalOpen = open;
      notify();
    },

    // Orders
    orders: stateCache.orders,
    placeOrder: (
      address: Address,
      paymentMethod: 'COD' | 'RAZORPAY' = 'COD',
      notes = ''
    ): Order => {
      const orderNum = `ACR-${Date.now().toString().slice(-6)}`;
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: orderNum,
        userId: stateCache.user?.id || 'guest',
        userName: stateCache.user?.name || address.name,
        items: [...stateCache.cart],
        subtotal,
        shippingFee,
        total: grandTotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'PENDING_ON_DELIVERY' : 'PAID',
        shippingAddress: address,
        createdAt: new Date().toISOString(),
        status: 'CONFIRMED',
        notes,
      };

      stateCache.orders.unshift(newOrder);
      stateCache.cart = [];
      stateCache.isCheckoutModalOpen = false;
      stateCache.isCartOpen = false;
      persistCart();
      persistOrders();
      return newOrder;
    },

    // Custom Orders (Bespoke Atelier)
    customOrders: stateCache.customOrders,
    submitCustomOrder: (orderData: {
      fabric: string;
      dimensions: string;
      quantity: number;
      notes: string;
      designImage?: string;
      designFileName?: string;
    }): CustomOrder => {
      const newCustom: CustomOrder = {
        id: `bespoke-${Date.now()}`,
        userId: stateCache.user?.id || 'unknown',
        userName: stateCache.user?.name || 'Valued Patron',
        userEmail: stateCache.user?.email || '',
        userPhone: stateCache.user?.phone || '8778824123',
        fabric: orderData.fabric,
        dimensions: orderData.dimensions,
        quantity: orderData.quantity,
        notes: orderData.notes,
        designImage: orderData.designImage,
        designFileName: orderData.designFileName,
        status: 'UNDER_REVIEW',
        createdAt: new Date().toISOString(),
      };
      stateCache.customOrders.unshift(newCustom);
      persistCustomOrders();
      return newCustom;
    },
    deleteCustomOrder: (customOrderId: string): boolean => {
      const order = stateCache.customOrders.find((co) => co.id === customOrderId);
      if (order && order.status === 'UNDER_REVIEW') {
        stateCache.customOrders = stateCache.customOrders.filter((co) => co.id !== customOrderId);
        persistCustomOrders();
        return true;
      }
      return false;
    },

    // Quick View Modal
    quickViewProduct: stateCache.quickViewProduct,
    setQuickViewProduct: (product: Product | null) => {
      stateCache.quickViewProduct = product;
      notify();
    },

    // Reviews
    reviews: stateCache.reviews,
    getProductReviews: (productId: string) => {
      return stateCache.reviews.filter((r) => r.productId === productId);
    },
    addReview: (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
      const newReview: Review = {
        ...reviewData,
        id: `rev-${Date.now()}`,
        createdAt: new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }),
      };
      stateCache.reviews.unshift(newReview);
      persistReviews();
    },
  };
};

"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

interface Variant {
  id: number;
  name: string;
  value: string;
  priceModifier: number;
}

interface ProductVariant {
  id: number;
  sku: string;
  variants: Variant[];
  price: number;
  stock: number;
  imageUrl?: string;
}

interface Batch {
  id: number;
  batchNumber: string;
  quantity: number;
  receivedDate: string;
  expiryDate?: string;
  supplier?: string;
  costPrice: number;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  description: string;
  imageUrl: string;
  reviewsEnabled: boolean;
  batches: Batch[];
  sku?: string;
  reorderPoint?: number;
  hasVariants: boolean;
  productVariants: ProductVariant[];
  variantOptions: string[];
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  ordersCount: number;
  totalSpent: number;
  loyaltyPoints: number;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
  createdAt: string;
}

interface LoyaltyProgram {
  pointsPerRupee: number;
  tiers: {
    name: string;
    minPoints: number;
    discountPercentage: number;
  }[];
}

interface Review {
  id: number;
  productId: number;
  name: string;
  initials: string;
  rating: number;
  date: string;
  comment: string;
  status: "Approved" | "Pending" | "Rejected";
}

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image: string;
  readTime: string;
  body: {
    type: "p" | "h2";
    text: string;
  }[];
}

interface Coupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount: number;
  maxDiscount: number;
  validFrom: string;
  validTo: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

interface Collection {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  productIds: number[];
  isActive: boolean;
}

interface BrewingGuide {
  id: string;
  title: string;
  slug: string;
  teaType: string;
  description: string;
  waterTemp: string;
  steepingTime: string;
  leafQuantity: string;
  image: string;
  isActive: boolean;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  order: number;
}

interface AboutPage {
  heroTitle: string;
  heroSubtitle: string;
  missionTitle: string;
  missionText: string;
  storyTitle: string;
  storyText: string;
  values: {
    title: string;
    description: string;
    icon: string;
  }[];
}

interface OrderItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

interface InternalNote {
  id: string;
  text: string;
  adminId: string;
  adminName: string;
  timestamp: string;
}

interface Order {
  id: string;
  customerId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  tax: number;
  grandTotal: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Refunded";
  paymentStatus: "Paid" | "Unpaid" | "Refunded";
  orderDate: string;
  shippingAddress: string;
  trackingNumber?: string;
  courierPartner?: string;
  internalNotes: InternalNote[];
  refundReason?: string;
  refundAmount?: number;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  ordersCount: number;
  totalSpent: number;
}

interface InventoryTransaction {
  id: number;
  productId: number;
  productName: string;
  type: "in" | "out" | "adjustment";
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  referenceId?: string;
  timestamp: string;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  orderId: string;
  timestamp: string;
  read: boolean;
}

interface PurchaseOrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface PurchaseOrder {
  id: number;
  poNumber: string;
  supplier: string;
  items: PurchaseOrderItem[];
  total: number;
  status: "Draft" | "Sent" | "Received" | "Cancelled";
  orderDate: string;
  expectedDeliveryDate?: string;
  receivedDate?: string;
}

interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: "admin" | "superadmin";
  isActive: boolean;
  createdAt: string;
  passwordHash: string;
}

interface StoreContextType {
  adminUsers: AdminUser[];
  addAdminUser: (user: Omit<AdminUser, "id" | "createdAt" | "passwordHash"> & { password: string }) => void;
  updateAdminUser: (id: number, user: Partial<AdminUser> & { password?: string }) => void;
  deleteAdminUser: (id: number) => void;
  verifyAdminCredentials: (username: string, password: string) => Promise<AdminUser | null>;
  products: Product[];
  orders: Order[];
  customers: Customer[];
  notifications: Notification[];
  blogPosts: BlogPost[];
  reviews: Review[];
  coupons: Coupon[];
  collections: Collection[];
  brewingGuides: BrewingGuide[];
  faqs: FAQ[];
  aboutPage: AboutPage;
  inventoryTransactions: InventoryTransaction[];
  purchaseOrders: PurchaseOrder[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: number, product: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  addBatch: (productId: number, batch: Omit<Batch, "id">) => void;
  updateBatch: (productId: number, batchId: number, batch: Partial<Batch>) => void;
  deleteBatch: (productId: number, batchId: number) => void;
  addProductVariant: (productId: number, variant: Omit<ProductVariant, "id">) => void;
  updateProductVariant: (productId: number, variantId: number, variant: Partial<ProductVariant>) => void;
  deleteProductVariant: (productId: number, variantId: number) => void;
  addOrder: (order: Omit<Order, "id" | "orderDate" | "internalNotes">) => void;
  updateOrder: (id: string, order: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  refundOrder: (id: string, reason: string, amount?: number) => void;
  addInternalNote: (orderId: string, text: string, adminId: string, adminName: string) => void;
  updateTrackingInfo: (orderId: string, trackingNumber?: string, courierPartner?: string) => void;
  bulkUpdateOrderStatus: (orderIds: string[], status: Order["status"]) => void;
  addCustomer: (customer: Omit<Customer, "id" | "ordersCount" | "totalSpent" | "loyaltyPoints" | "tier" | "createdAt">) => void;
  updateCustomer: (id: number, customer: Partial<Customer>) => void;
  deleteCustomer: (id: number) => void;
  getCustomerOrders: (customerId: number) => Order[];
  addLoyaltyPoints: (customerId: number, points: number, reason: string) => void;
  redeemLoyaltyPoints: (customerId: number, points: number) => void;
  addPurchaseOrder: (po: Omit<PurchaseOrder, "id">) => void;
  updatePurchaseOrder: (id: number, po: Partial<PurchaseOrder>) => void;
  receivePurchaseOrder: (id: number) => void;
  deletePurchaseOrder: (id: number) => void;
  addBlogPost: (post: Omit<BlogPost, "id">) => void;
  updateBlogPost: (id: string, post: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;
  addReview: (review: Omit<Review, "id">) => void;
  updateReview: (id: number, review: Partial<Review>) => void;
  deleteReview: (id: number) => void;
  getProductReviews: (productId: number) => Review[];
  addCoupon: (coupon: Omit<Coupon, "id" | "usedCount">) => void;
  updateCoupon: (id: string, coupon: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  addCollection: (collection: Omit<Collection, "id">) => void;
  updateCollection: (id: string, collection: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;
  addBrewingGuide: (guide: Omit<BrewingGuide, "id">) => void;
  updateBrewingGuide: (id: string, guide: Partial<BrewingGuide>) => void;
  deleteBrewingGuide: (id: string) => void;
  addFAQ: (faq: Omit<FAQ, "id">) => void;
  updateFAQ: (id: string, faq: Partial<FAQ>) => void;
  deleteFAQ: (id: string) => void;
  updateAboutPage: (about: Partial<AboutPage>) => void;
  markNotificationRead: (id: number) => void;
  clearNotifications: () => void;
  adjustStock: (productId: number, quantity: number, reason: string, referenceId?: string) => void;
  getProductInventoryTransactions: (productId: number) => InventoryTransaction[];
  getInventoryValue: () => number;
  getLowStockProducts: () => Product[];
  getExpiringBatches: (days?: number) => { product: Product; batch: Batch }[];
  loyaltyProgram: LoyaltyProgram;
  settings: {
    taxRate: number;
    currency: string;
    storeName: string;
    storeEmail: string;
    storePhone: string;
    notificationsEnabled: boolean;
    lowStockThreshold: number;
    gstNumber?: string;
  };
  updateSettings: (settings: Partial<StoreContextType["settings"]>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const sampleProducts: Product[] = [
  { id: 1, name: "Premium Green Tea", category: "Green Tea", price: 249, stock: 145, status: "In Stock", description: "Fresh organic green tea from Assam", imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop", reviewsEnabled: true, sku: "HMT-GRN-001", reorderPoint: 50, hasVariants: true, variantOptions: ["Size", "Packaging"], productVariants: [
    { id: 101, sku: "HMT-GRN-001-100G", variants: [{ id: 1001, name: "Size", value: "100g", priceModifier: 0 }, { id: 1002, name: "Packaging", value: "Standard", priceModifier: 0 }], price: 249, stock: 50 },
    { id: 102, sku: "HMT-GRN-001-250G", variants: [{ id: 1003, name: "Size", value: "250g", priceModifier: 150 }, { id: 1004, name: "Packaging", value: "Premium", priceModifier: 50 }], price: 449, stock: 75 },
    { id: 103, sku: "HMT-GRN-001-500G", variants: [{ id: 1005, name: "Size", value: "500g", priceModifier: 350 }, { id: 1006, name: "Packaging", value: "Premium", priceModifier: 50 }], price: 649, stock: 20 },
  ], batches: [
    { id: 1, batchNumber: "BATCH-2024-001", quantity: 100, receivedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), supplier: "Assam Tea Estates", costPrice: 120 },
    { id: 2, batchNumber: "BATCH-2024-002", quantity: 45, receivedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), supplier: "Darjeeling Farms", costPrice: 115 },
  ] },
  { id: 2, name: "Classic Black Tea", category: "Black Tea", price: 229, stock: 234, status: "In Stock", description: "Traditional black tea blend", imageUrl: "https://images.unsplash.com/photo-1564890369478-c6b8b91994ed?w=400&h=300&fit=crop", reviewsEnabled: true, sku: "HMT-BLK-001", reorderPoint: 60, hasVariants: false, productVariants: [], variantOptions: [], batches: [
    { id: 3, batchNumber: "BATCH-2024-003", quantity: 150, receivedDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), expiryDate: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000).toISOString(), supplier: "Nilgiri Plantations", costPrice: 100 },
    { id: 4, batchNumber: "BATCH-2024-004", quantity: 84, receivedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), expiryDate: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000).toISOString(), supplier: "Nilgiri Plantations", costPrice: 100 },
  ] },
  { id: 3, name: "Herbal Collection", category: "Herbal", price: 199, stock: 25, status: "Low Stock", description: "Natural herbal tea mix", imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop", reviewsEnabled: true, sku: "HMT-HRB-001", reorderPoint: 40, hasVariants: false, productVariants: [], variantOptions: [], batches: [
    { id: 5, batchNumber: "BATCH-2024-005", quantity: 25, receivedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), supplier: "Ayurveda Farms", costPrice: 85 },
  ] },
  { id: 4, name: "Tea Ceremony Set", category: "Accessories", price: 899, stock: 12, status: "In Stock", description: "Complete tea ceremony kit", imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop", reviewsEnabled: false, sku: "HMT-ACC-001", reorderPoint: 10, hasVariants: false, productVariants: [], variantOptions: [], batches: [
    { id: 6, batchNumber: "BATCH-2024-006", quantity: 12, receivedDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), supplier: "Ceramic Crafts", costPrice: 450 },
  ] },
  { id: 5, name: "Masala Chai Mix", category: "Spiced", price: 299, stock: 56, status: "In Stock", description: "Authentic masala chai spice blend", imageUrl: "https://images.unsplash.com/photo-1586374820345-f6339ae67f71?w=400&h=300&fit=crop", reviewsEnabled: true, sku: "HMT-MSL-001", reorderPoint: 35, hasVariants: false, productVariants: [], variantOptions: [], batches: [
    { id: 7, batchNumber: "BATCH-2024-007", quantity: 56, receivedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), supplier: "Spice Traders Co", costPrice: 140 },
  ] },
];

const sampleCustomers: Customer[] = [
  { id: 1, name: "Sarah Johnson", email: "sarah@example.com", phone: "+91 9876543210", address: "123 Tea Street, Mumbai", ordersCount: 14, totalSpent: 5231, loyaltyPoints: 523, tier: "Silver", createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 2, name: "Michael Chen", email: "michael@example.com", phone: "+91 9876543211", address: "456 Herbal Lane, Delhi", ordersCount: 9, totalSpent: 3499, loyaltyPoints: 350, tier: "Bronze", createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 3, name: "Emma Williams", email: "emma@example.com", phone: "+91 9876543212", address: "789 Green Tea Road, Bangalore", ordersCount: 23, totalSpent: 8921, loyaltyPoints: 892, tier: "Gold", createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString() },
];

const sampleReviews: Review[] = [
  { id: 1, productId: 1, name: "Priya S.", initials: "PS", rating: 5, date: "June 2026", comment: "Absolutely exquisite. The aroma is unlike anything I've tasted before. Worth every rupee.", status: "Approved" },
  { id: 2, productId: 1, name: "David K.", initials: "DK", rating: 5, date: "May 2026", comment: "I order this every month. My morning ritual is incomplete without it. Top quality packaging too.", status: "Approved" },
  { id: 3, productId: 1, name: "Meera R.", initials: "MR", rating: 4, date: "April 2026", comment: "Lovely tea, smooth and fragrant. Delivery was fast. Will definitely order again!", status: "Pending" },
];

const sampleBlogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "1",
    title: "How to Brew the Perfect Cup",
    date: "June 15, 2026",
    category: "Brewing",
    excerpt: "Master water temperature, steeping time, and leaf ratio to unlock every tea's full potential.",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=400&fit=crop",
    readTime: "5 min read",
    body: [
      { type: "p", text: "Brewing tea is deceptively simple — hot water, dry leaves, a moment of patience. But mastering the craft opens a world of nuance that can elevate an ordinary cup into something transcendent." },
      { type: "h2", text: "Step 1: Start With Good Water" },
      { type: "p", text: "Tea is over 99% water. Filtered water at a neutral pH (around 7) brings out the cleanest, brightest flavours. Avoid distilled water, which tastes flat, and heavily chlorinated tap water, which can mask delicate aromas." },
      { type: "h2", text: "Step 2: Heat to the Right Temperature" },
      { type: "p", text: "Different teas need different temperatures. Green teas and white teas flourish between 70–80°C — boiling water will scorch the leaves and produce bitterness. Black teas and pu-erh welcome a full 95–100°C. Oolongs sit in between at 85–90°C." },
    ],
  },
  {
    id: "2",
    slug: "2",
    title: "Nepal's Tea Regions: Ilam vs Dhankuta",
    date: "June 8, 2026",
    category: "Origins",
    excerpt: "Explore the distinct terroir of Nepal's two premier tea-growing districts.",
    image: "https://images.unsplash.com/photo-1464890369478-c6b8b91994ed?w=600&h=400&fit=crop",
    readTime: "7 min read",
    body: [
      { type: "p", text: "Nepal has been growing tea for over 150 years, yet it remains one of the world's best-kept secrets. Two districts dominate production: Ilam in the east, and Dhankuta to the north." },
      { type: "h2", text: "Ilam: Nepal's First Tea Country" },
      { type: "p", text: "Tea cultivation in Nepal began in Ilam in the 1860s, introduced by the Rana rulers returning from Darjeeling. The climate here is temperate and humid, producing teas with floral character and a gentle body." },
    ],
  },
];

const sampleCoupons: Coupon[] = [
  {
    id: "1",
    code: "WELCOME10",
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 500,
    maxDiscount: 200,
    validFrom: "2026-06-01",
    validTo: "2026-12-31",
    usageLimit: 100,
    usedCount: 45,
    isActive: true,
  },
  {
    id: "2",
    code: "FLAT50",
    discountType: "fixed",
    discountValue: 50,
    minOrderAmount: 300,
    maxDiscount: 50,
    validFrom: "2026-06-15",
    validTo: "2026-07-15",
    usageLimit: 50,
    usedCount: 22,
    isActive: true,
  },
];

const sampleCollections: Collection[] = [
  {
    id: "1",
    title: "Best Sellers",
    slug: "best-sellers",
    description: "Our most-loved teas, handpicked by customers",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=400&fit=crop",
    productIds: [1, 2, 5],
    isActive: true,
  },
  {
    id: "2",
    title: "Wellness Blends",
    slug: "wellness-blends",
    description: "Natural teas for a healthier you",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=400&fit=crop",
    productIds: [3],
    isActive: true,
  },
];

const sampleBrewingGuides: BrewingGuide[] = [
  {
    id: "1",
    title: "Perfect Green Tea",
    slug: "perfect-green-tea",
    teaType: "Green Tea",
    description: "Brew delicate green tea without bitterness",
    waterTemp: "75-80°C",
    steepingTime: "2-3 minutes",
    leafQuantity: "1 tsp per cup",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=400&fit=crop",
    isActive: true,
  },
];

const sampleFAQs: FAQ[] = [
  {
    id: "1",
    question: "How long does shipping take?",
    answer: "We offer free shipping on orders over ₹500. For orders below ₹500, shipping charges are ₹50. Delivery takes 3-5 business days across India.",
    category: "Shipping",
    isActive: true,
    order: 1,
  },
  {
    id: "2",
    question: "What is your return policy?",
    answer: "We accept returns within 7 days of delivery if the product is unused and in its original packaging. Please contact our support team to initiate a return.",
    category: "Returns",
    isActive: true,
    order: 2,
  },
];

const defaultAboutPage: AboutPage = {
  heroTitle: "Our Story",
  heroSubtitle: "Brewing traditions since 1985",
  missionTitle: "Our Mission",
  missionText: "To bring the finest quality teas from Nepal's best gardens to tea lovers everywhere, while supporting sustainable farming practices and fair trade.",
  storyTitle: "How It All Began",
  storyText: "Himmat Tea was founded in 1985 with a simple mission: to share the authentic taste of Nepalese tea with the world. Our journey started in the rolling hills of Ilam, where our founder, Mr. Raj Kumar Sharma, discovered the perfect terroir for growing exceptional tea. Today, we work directly with over 500 small-scale farmers across Nepal to bring you teas that are as ethical as they are delicious.",
  values: [
    { title: "Quality First", description: "We never compromise on quality. Every tea is carefully selected and tested to ensure it meets our high standards.", icon: "🍵" },
    { title: "Sustainable", description: "We support organic farming practices and fair trade, ensuring our farmers get the recognition they deserve.", icon: "🌱" },
    { title: "Community Focused", description: "We believe in giving back. A portion of every sale goes towards supporting education and healthcare in tea-growing communities.", icon: "❤️" },
  ],
};



const sampleOrders: Order[] = [
  { 
    id: "#1234", 
    customerId: 1, 
    customerName: "Sarah Johnson", 
    customerEmail: "sarah@example.com", 
    customerPhone: "+91 9876543210", 
    items: [{ id: 1, productId: 1, name: "Premium Green Tea", price: 249, quantity: 1 }],
    total: 249, 
    tax: 24.9, 
    grandTotal: 273.9, 
    status: "Delivered", 
    paymentStatus: "Paid", 
    orderDate: new Date(Date.now() - 86400000).toISOString(),
    shippingAddress: "123 Tea Street, Mumbai",
    trackingNumber: "DEL123456789IN",
    courierPartner: "Delhivery",
    internalNotes: []
  },
  { 
    id: "#1233", 
    customerId: 2, 
    customerName: "Michael Chen", 
    customerEmail: "michael@example.com", 
    customerPhone: "+91 9876543211", 
    items: [{ id: 2, productId: 3, name: "Herbal Collection", price: 199, quantity: 1 }],
    total: 199, 
    tax: 19.9, 
    grandTotal: 218.9, 
    status: "Processing", 
    paymentStatus: "Paid", 
    orderDate: new Date(Date.now() - 172800000).toISOString(),
    shippingAddress: "456 Herbal Lane, Delhi",
    internalNotes: [
      {
        id: "note-1",
        text: "Customer called, requested to leave package at front desk",
        adminId: "1",
        adminName: "Admin",
        timestamp: new Date(Date.now() - 3600000).toISOString()
      }
    ]
  },
];

const defaultSettings = {
  taxRate: 18,
  currency: "₹",
  storeName: "Himmat Tea",
  storeEmail: "support@himmattea.com",
  storePhone: "+91 9876543210",
  notificationsEnabled: true,
  lowStockThreshold: 30,
  gstNumber: "27AABCU9603R1ZX",
};

const loyaltyProgramConfig: LoyaltyProgram = {
  pointsPerRupee: 1,
  tiers: [
    { name: "Bronze", minPoints: 0, discountPercentage: 2 },
    { name: "Silver", minPoints: 500, discountPercentage: 5 },
    { name: "Gold", minPoints: 1000, discountPercentage: 8 },
    { name: "Platinum", minPoints: 2000, discountPercentage: 12 },
  ],
};

const samplePurchaseOrders: PurchaseOrder[] = [
  {
    id: 1,
    poNumber: "PO-2024-001",
    supplier: "Assam Tea Estates",
    orderDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    expectedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Sent",
    items: [
      { id: 1001, productId: 1, productName: "Premium Green Tea", quantity: 100, unitPrice: 120, total: 12000 },
    ],
    total: 12000,
  },
  {
    id: 2,
    poNumber: "PO-2024-002",
    supplier: "Nilgiri Plantations",
    orderDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    receivedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Received",
    items: [
      { id: 1002, productId: 2, productName: "Classic Black Tea", quantity: 150, unitPrice: 100, total: 15000 },
    ],
    total: 15000,
  },
];

// Password hash for "admin123" using SHA-256 via crypto.subtle
// Note: This is a simplified approach for client-side storage
// Actual hash computed as:
// Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode("admin123"))))
//   .map(b => b.toString(16).padStart(2, "0")).join("")
const ADMIN_PASSWORD_HASH = "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9";

const sampleAdminUsers: AdminUser[] = [
  {
    id: 1,
    username: "admin",
    email: "admin@himmattea.com",
    role: "superadmin",
    isActive: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    passwordHash: ADMIN_PASSWORD_HASH,
  },
];

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [inventoryTransactions, setInventoryTransactions] = useState<InventoryTransaction[]>([]);
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [customers, setCustomers] = useState<Customer[]>(sampleCustomers);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(sampleBlogPosts);
  const [reviews, setReviews] = useState<Review[]>(sampleReviews);
  const [coupons, setCoupons] = useState<Coupon[]>(sampleCoupons);
  const [collections, setCollections] = useState<Collection[]>(sampleCollections);
  const [brewingGuides, setBrewingGuides] = useState<BrewingGuide[]>(sampleBrewingGuides);
  const [faqs, setFaqs] = useState<FAQ[]>(sampleFAQs);
  const [aboutPage, setAboutPage] = useState<AboutPage>(defaultAboutPage);
  const [settings, setSettings] = useState<StoreContextType["settings"]>(defaultSettings);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(samplePurchaseOrders);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(sampleAdminUsers);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Products
      const savedProducts = localStorage.getItem("himmat_products");
      if (savedProducts) {
        try {
          const parsed = JSON.parse(savedProducts);
          setProducts(parsed.map((product: any) => ({
            ...product,
            batches: product.batches || [],
            productVariants: product.productVariants || [],
            variantOptions: product.variantOptions || [],
          })));
        } catch (e) {}
      }

      // Inventory Transactions
      const savedInventory = localStorage.getItem("himmat_inventory_transactions");
      if (savedInventory) {
        try {
          setInventoryTransactions(JSON.parse(savedInventory));
        } catch (e) {}
      }

      // Orders
      const savedOrders = localStorage.getItem("himmat_orders");
      if (savedOrders) {
        try {
          const parsed = JSON.parse(savedOrders);
          setOrders(parsed.map((order: any) => ({
            ...order,
            internalNotes: order.internalNotes || [],
            trackingNumber: order.trackingNumber || undefined,
            courierPartner: order.courierPartner || undefined,
            refundReason: order.refundReason || undefined,
            refundAmount: order.refundAmount || undefined,
          })));
        } catch (e) {}
      }

      // Customers
      const savedCustomers = localStorage.getItem("himmat_customers");
      if (savedCustomers) {
        try {
          const parsed = JSON.parse(savedCustomers);
          setCustomers(parsed.map((customer: any) => ({
            ...customer,
            loyaltyPoints: customer.loyaltyPoints || 0,
            tier: customer.tier || "Bronze",
            createdAt: customer.createdAt || new Date().toISOString(),
          })));
        } catch (e) {}
      }

      // Notifications
      const savedNotifications = localStorage.getItem("himmat_notifications");
      if (savedNotifications) {
        try {
          setNotifications(JSON.parse(savedNotifications));
        } catch (e) {}
      }

      // Blog Posts
      const savedBlogPosts = localStorage.getItem("himmat_blog_posts");
      if (savedBlogPosts) {
        try {
          setBlogPosts(JSON.parse(savedBlogPosts));
        } catch (e) {}
      }

      // Reviews
      const savedReviews = localStorage.getItem("himmat_reviews");
      if (savedReviews) {
        try {
          setReviews(JSON.parse(savedReviews));
        } catch (e) {}
      }

      // Coupons
      const savedCoupons = localStorage.getItem("himmat_coupons");
      if (savedCoupons) {
        try {
          setCoupons(JSON.parse(savedCoupons));
        } catch (e) {}
      }

      // Collections
      const savedCollections = localStorage.getItem("himmat_collections");
      if (savedCollections) {
        try {
          setCollections(JSON.parse(savedCollections));
        } catch (e) {}
      }

      // Brewing Guides
      const savedBrewingGuides = localStorage.getItem("himmat_brewing_guides");
      if (savedBrewingGuides) {
        try {
          setBrewingGuides(JSON.parse(savedBrewingGuides));
        } catch (e) {}
      }

      // FAQs
      const savedFaqs = localStorage.getItem("himmat_faqs");
      if (savedFaqs) {
        try {
          setFaqs(JSON.parse(savedFaqs));
        } catch (e) {}
      }

      // About Page
      const savedAboutPage = localStorage.getItem("himmat_about_page");
      if (savedAboutPage) {
        try {
          setAboutPage(JSON.parse(savedAboutPage));
        } catch (e) {}
      }

      // Settings
      const savedSettings = localStorage.getItem("himmat_settings");
      if (savedSettings) {
        try {
          setSettings(JSON.parse(savedSettings));
        } catch (e) {}
      }

      // Purchase Orders
      const savedPurchaseOrders = localStorage.getItem("himmat_purchase_orders");
      if (savedPurchaseOrders) {
        try {
          setPurchaseOrders(JSON.parse(savedPurchaseOrders));
        } catch (e) {}
      }

      // Admin Users
      const savedAdminUsers = localStorage.getItem("himmat_admin_users");
      if (savedAdminUsers) {
        try {
          const parsed = JSON.parse(savedAdminUsers);
          const defaultAdmin = parsed.find((u: AdminUser) => u.username === "admin");
          if (defaultAdmin && defaultAdmin.passwordHash === ADMIN_PASSWORD_HASH) {
            setAdminUsers(parsed);
          }
        } catch (e) {}
      }

      setIsInitialized(true);
    }
  }, []);

  const loyaltyProgram = loyaltyProgramConfig;

  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem("himmat_products", JSON.stringify(products));
    }
  }, [products, isInitialized]);

  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem("himmat_inventory_transactions", JSON.stringify(inventoryTransactions));
    }
  }, [inventoryTransactions, isInitialized]);

  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem("himmat_orders", JSON.stringify(orders));
    }
  }, [orders, isInitialized]);

  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem("himmat_customers", JSON.stringify(customers));
    }
  }, [customers, isInitialized]);

  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem("himmat_notifications", JSON.stringify(notifications));
    }
  }, [notifications, isInitialized]);

  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem("himmat_blog_posts", JSON.stringify(blogPosts));
    }
  }, [blogPosts, isInitialized]);

  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem("himmat_reviews", JSON.stringify(reviews));
    }
  }, [reviews, isInitialized]);

  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem("himmat_coupons", JSON.stringify(coupons));
    }
  }, [coupons, isInitialized]);

  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem("himmat_collections", JSON.stringify(collections));
    }
  }, [collections, isInitialized]);

  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem("himmat_brewing_guides", JSON.stringify(brewingGuides));
    }
  }, [brewingGuides, isInitialized]);

  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem("himmat_faqs", JSON.stringify(faqs));
    }
  }, [faqs, isInitialized]);

  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem("himmat_about_page", JSON.stringify(aboutPage));
    }
  }, [aboutPage, isInitialized]);

  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem("himmat_settings", JSON.stringify(settings));
    }
  }, [settings, isInitialized]);

  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem("himmat_purchase_orders", JSON.stringify(purchaseOrders));
    }
  }, [purchaseOrders, isInitialized]);

  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem("himmat_admin_users", JSON.stringify(adminUsers));
    }
  }, [adminUsers, isInitialized]);

  // Helper function to hash passwords (simple SHA-256 for demo)
  const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  };

  // Calculate customer tier based on loyalty points
  const calculateCustomerTier = (points: number): "Bronze" | "Silver" | "Gold" | "Platinum" => {
    for (let i = loyaltyProgram.tiers.length - 1; i >= 0; i--) {
      if (points >= loyaltyProgram.tiers[i].minPoints) {
        return loyaltyProgram.tiers[i].name as any;
      }
    }
    return "Bronze";
  };

  // Product variant functions
  const addProductVariant = (productId: number, variant: Omit<ProductVariant, "id">) => {
    setProducts(prev => prev.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          productVariants: [...product.productVariants, { ...variant, id: Date.now() }],
        };
      }
      return product;
    }));
    toast.success("Product variant added!");
  };

  const updateProductVariant = (productId: number, variantId: number, variant: Partial<ProductVariant>) => {
    setProducts(prev => prev.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          productVariants: product.productVariants.map(v =>
            v.id === variantId ? { ...v, ...variant } : v
          ),
        };
      }
      return product;
    }));
    toast.success("Product variant updated!");
  };

  const deleteProductVariant = (productId: number, variantId: number) => {
    setProducts(prev => prev.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          productVariants: product.productVariants.filter(v => v.id !== variantId),
        };
      }
      return product;
    }));
    toast.success("Product variant deleted!");
  };

  // Loyalty program functions
  const addLoyaltyPoints = (customerId: number, points: number, reason: string) => {
    setCustomers(prev => prev.map(customer => {
      if (customer.id === customerId) {
        const newPoints = customer.loyaltyPoints + points;
        return {
          ...customer,
          loyaltyPoints: newPoints,
          tier: calculateCustomerTier(newPoints),
        };
      }
      return customer;
    }));
    toast.success(`${points} loyalty points added!`);
  };

  const redeemLoyaltyPoints = (customerId: number, points: number) => {
    setCustomers(prev => prev.map(customer => {
      if (customer.id === customerId) {
        const newPoints = customer.loyaltyPoints - points;
        return {
          ...customer,
          loyaltyPoints: newPoints,
          tier: calculateCustomerTier(newPoints),
        };
      }
      return customer;
    }));
    toast.success(`${points} loyalty points redeemed!`);
  };

  // Purchase order functions
  const addPurchaseOrder = (po: Omit<PurchaseOrder, "id">) => {
    const newPO: PurchaseOrder = {
      ...po,
      id: Date.now(),
    };
    setPurchaseOrders(prev => [...prev, newPO]);
    toast.success("Purchase order created!");
  };

  const updatePurchaseOrder = (id: number, po: Partial<PurchaseOrder>) => {
    setPurchaseOrders(prev => prev.map(order =>
      order.id === id ? { ...order, ...po } : order
    ));
    toast.success("Purchase order updated!");
  };

  const receivePurchaseOrder = (id: number) => {
    const po = purchaseOrders.find(order => order.id === id);
    if (!po) return;

    // Update stock for each item
    po.items.forEach(item => {
      adjustStock(item.productId, item.quantity, "Received from PO " + po.poNumber);
    });

    // Update PO status
    setPurchaseOrders(prev => prev.map(order =>
      order.id === id ? { ...order, status: "Received", receivedDate: new Date().toISOString() } : order
    ));

    toast.success("Purchase order received!");
  };

  const deletePurchaseOrder = (id: number) => {
    setPurchaseOrders(prev => prev.filter(order => order.id !== id));
    toast.error("Purchase order deleted!");
  };

  // Admin user functions
  const addAdminUser = async (user: Omit<AdminUser, "id" | "createdAt" | "passwordHash"> & { password: string }) => {
    const passwordHash = await hashPassword(user.password);
    const newUser: AdminUser = {
      id: Date.now(),
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: new Date().toISOString(),
      passwordHash,
    };
    setAdminUsers(prev => [...prev, newUser]);
    toast.success("Admin user added successfully!");
  };

  const updateAdminUser = async (id: number, updates: Partial<AdminUser> & { password?: string }) => {
    const { password, ...rest } = updates;
    let finalUpdates: Partial<AdminUser> = { ...rest };
    if (password) {
      const passwordHash = await hashPassword(password);
      finalUpdates = { ...rest, passwordHash };
    }
    setAdminUsers(prev => prev.map(user => {
      if (user.id === id) {
        return { ...user, ...finalUpdates };
      }
      return user;
    }));
    toast.success("Admin user updated!");
  };

  const deleteAdminUser = (id: number) => {
    // Don't allow deleting the last superadmin
    const userToDelete = adminUsers.find(u => u.id === id);
    if (userToDelete?.role === "superadmin") {
      const superadminCount = adminUsers.filter(u => u.role === "superadmin").length;
      if (superadminCount <= 1) {
        toast.error("Cannot delete the last superadmin!");
        return;
      }
    }
    setAdminUsers(prev => prev.filter(user => user.id !== id));
    toast.error("Admin user deleted!");
  };

  const verifyAdminCredentials = async (username: string, password: string): Promise<AdminUser | null> => {
    const user = adminUsers.find(u => u.username === username && u.isActive);
    if (!user) return null;

    const passwordHash = await hashPassword(password);
    if (passwordHash === user.passwordHash) {
      return user;
    }
    return null;
  };

  const addProduct = (product: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...product,
      id: Date.now(),
      hasVariants: product.hasVariants || false,
      productVariants: product.productVariants || [],
      variantOptions: product.variantOptions || [],
      batches: product.batches || [],
    };
    setProducts((prev) => [...prev, newProduct]);
    toast.success("Product added successfully!");
  };

  const updateProduct = (id: number, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, ...updates } : product
      )
    );
    toast.success("Product updated!");
  };

  const deleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
    toast.error("Product deleted!");
  };

  const addBatch = (productId: number, batch: Omit<Batch, "id">) => {
    setProducts((prev) => prev.map(product => {
      if (product.id === productId) {
        const newBatch: Batch = {
          ...batch,
          id: Date.now(),
        };
        const newStock = product.stock + batch.quantity;
        return {
          ...product,
          batches: [...product.batches, newBatch],
          stock: newStock,
          status: newStock === 0 ? "Out of Stock" : newStock <= settings.lowStockThreshold ? "Low Stock" : "In Stock",
        };
      }
      return product;
    }));
    toast.success("Batch added successfully!");
  };

  const updateBatch = (productId: number, batchId: number, batch: Partial<Batch>) => {
    setProducts((prev) => prev.map(product => {
      if (product.id === productId) {
        let totalStock = 0;
        const updatedBatches = product.batches.map(b => {
          if (b.id === batchId) {
            const updated = { ...b, ...batch };
            totalStock += updated.quantity;
            return updated;
          }
          totalStock += b.quantity;
          return b;
        });
        return {
          ...product,
          batches: updatedBatches,
          stock: totalStock,
          status: totalStock === 0 ? "Out of Stock" : totalStock <= settings.lowStockThreshold ? "Low Stock" : "In Stock",
        };
      }
      return product;
    }));
    toast.success("Batch updated successfully!");
  };

  const deleteBatch = (productId: number, batchId: number) => {
    setProducts((prev) => prev.map(product => {
      if (product.id === productId) {
        const batch = product.batches.find(b => b.id === batchId);
        const updatedBatches = product.batches.filter(b => b.id !== batchId);
        const newStock = product.stock - (batch?.quantity || 0);
        return {
          ...product,
          batches: updatedBatches,
          stock: Math.max(0, newStock),
          status: Math.max(0, newStock) === 0 ? "Out of Stock" : Math.max(0, newStock) <= settings.lowStockThreshold ? "Low Stock" : "In Stock",
        };
      }
      return product;
    }));
    toast.success("Batch deleted!");
  };

  const adjustStock = (productId: number, quantity: number, reason: string, referenceId?: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) {
      toast.error("Product not found!");
      return;
    }

    const previousStock = product.stock;
    const newStock = previousStock + quantity;
    if (newStock < 0) {
      toast.error("Insufficient stock!");
      return;
    }

    // FIFO: Adjust quantities from oldest batches first when deducting
    let updatedBatches = [...product.batches];
    if (quantity < 0) {
      let remaining = Math.abs(quantity);
      updatedBatches = product.batches
        .sort((a, b) => new Date(a.receivedDate).getTime() - new Date(b.receivedDate).getTime())
        .map(batch => {
          if (remaining > 0 && batch.quantity > 0) {
            const deduct = Math.min(batch.quantity, remaining);
            remaining -= deduct;
            return { ...batch, quantity: batch.quantity - deduct };
          }
          return batch;
        })
        .filter(batch => batch.quantity > 0);
    }

    // Update product stock and status
    const updatedProduct: Product = {
      ...product,
      batches: updatedBatches,
      stock: newStock,
      status: newStock === 0 ? "Out of Stock" : newStock <= settings.lowStockThreshold ? "Low Stock" : "In Stock",
    };

    setProducts((prev) => prev.map(p => p.id === productId ? updatedProduct : p));

    // Create inventory transaction
    const transactionType = quantity > 0 ? "in" : quantity < 0 ? "out" : "adjustment";
    const transaction: InventoryTransaction = {
      id: Date.now(),
      productId,
      productName: product.name,
      type: transactionType,
      quantity: Math.abs(quantity),
      previousStock,
      newStock,
      reason,
      referenceId,
      timestamp: new Date().toISOString(),
    };

    setInventoryTransactions((prev) => [transaction, ...prev]);
    toast.success("Stock updated successfully!");
  };

  const getExpiringBatches = (days: number = 30) => {
    const expiring: { product: Product; batch: Batch }[] = [];
    const now = new Date();
    const cutoff = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    products.forEach(product => {
      (product.batches || []).forEach(batch => {
        if (batch.expiryDate) {
          const expiryDate = new Date(batch.expiryDate);
          if (expiryDate <= cutoff && expiryDate >= now) {
            expiring.push({ product, batch });
          }
        }
      });
    });

    return expiring.sort((a, b) => 
      new Date(a.batch.expiryDate!).getTime() - new Date(b.batch.expiryDate!).getTime()
    );
  };

  const refundOrder = (id: string, reason: string, amount?: number) => {
    const order = orders.find(o => o.id === id);
    if (!order) {
      toast.error("Order not found!");
      return;
    }

    // Restore stock only for full refund or specific items (simplified for now)
    if (!amount || amount >= order.grandTotal) {
      order.items.forEach(item => {
        adjustStock(item.productId, item.quantity, "Stock restored from refund", id);
      });
    }

    // Update order status
    setOrders((prev) => prev.map(o => 
      o.id === id ? { 
        ...o, 
        status: "Refunded", 
        paymentStatus: "Refunded", 
        refundReason: reason, 
        refundAmount: amount || order.grandTotal 
      } : o
    ));

    // Create notification
    const newNotification: Notification = {
      id: Date.now(),
      title: "Order Refunded",
      message: `Order ${id} has been refunded: ${reason}`,
      orderId: id,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);

    toast.success(`Order ${id} refunded successfully!`);
  };

  const addInternalNote = (orderId: string, text: string, adminId: string, adminName: string) => {
    const newNote: InternalNote = {
      id: `note-${Date.now()}`,
      text,
      adminId,
      adminName,
      timestamp: new Date().toISOString(),
    };
    setOrders((prev) => prev.map(o => 
      o.id === orderId ? { ...o, internalNotes: [...o.internalNotes, newNote] } : o
    ));
    toast.success("Internal note added!");
  };

  const updateTrackingInfo = (orderId: string, trackingNumber?: string, courierPartner?: string) => {
    setOrders((prev) => prev.map(o => 
      o.id === orderId ? { ...o, trackingNumber, courierPartner } : o
    ));
    toast.success("Tracking info updated!");
  };

  const bulkUpdateOrderStatus = (orderIds: string[], status: Order["status"]) => {
    setOrders((prev) => prev.map(o => 
      orderIds.includes(o.id) ? { ...o, status } : o
    ));
    toast.success(`Updated ${orderIds.length} orders to ${status}!`);
  };

  const getProductInventoryTransactions = (productId: number) => {
    return inventoryTransactions.filter(t => t.productId === productId);
  };

  const getInventoryValue = () => {
    return products.reduce((sum, product) => sum + (product.price * product.stock), 0);
  };

  const getLowStockProducts = () => {
    return products.filter(product => product.stock > 0 && product.stock <= settings.lowStockThreshold);
  };

  const addOrder = (order: Omit<Order, "id" | "orderDate" | "internalNotes">) => {
    const newOrder: Order = {
      ...order,
      id: `#${Date.now().toString().slice(-6)}`,
      orderDate: new Date().toISOString(),
      internalNotes: [],
    };
    setOrders((prev) => [newOrder, ...prev]);
    
    // Deduct stock for each order item
    order.items.forEach(item => {
      adjustStock(item.productId, -item.quantity, "Order placed", newOrder.id);
    });

    // Update customer stats and loyalty points
    const pointsToAdd = Math.floor(order.total * loyaltyProgram.pointsPerRupee);
    setCustomers(prev => prev.map(customer => {
      if (customer.id === order.customerId) {
        const newPoints = customer.loyaltyPoints + pointsToAdd;
        return {
          ...customer,
          ordersCount: customer.ordersCount + 1,
          totalSpent: customer.totalSpent + order.grandTotal,
          loyaltyPoints: newPoints,
          tier: calculateCustomerTier(newPoints),
        };
      }
      return customer;
    }));

    // Add notification for new order
    const newNotification: Notification = {
      id: Date.now(),
      title: "New Order Received!",
      message: `${order.customerName} placed a new order`,
      orderId: newOrder.id,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
    
    toast.success(`New order ${newOrder.id} received! ${pointsToAdd} loyalty points awarded.`);
    if (settings.notificationsEnabled) {
      toast.info(`Order confirmation email sent to ${order.customerEmail} with order ID ${newOrder.id}`);
    }
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, ...updates } : order
      )
    );
    toast.success("Order updated!");
    if (settings.notificationsEnabled) {
      toast.info("Status update email would be sent to customer!");
    }
  };

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== id));
    toast.error("Order deleted!");
  };

  const addCustomer = (customer: Omit<Customer, "id" | "ordersCount" | "totalSpent" | "loyaltyPoints" | "tier" | "createdAt">) => {
    const newCustomer: Customer = {
      ...customer,
      id: Date.now(),
      ordersCount: 0,
      totalSpent: 0,
      loyaltyPoints: 0,
      tier: "Bronze",
      createdAt: new Date().toISOString(),
    };
    setCustomers((prev) => [...prev, newCustomer]);
    toast.success("Customer added successfully!");
  };

  const updateCustomer = (id: number, updates: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === id ? { ...customer, ...updates } : customer
      )
    );
    toast.success("Customer updated!");
  };

  const deleteCustomer = (id: number) => {
    setCustomers((prev) => prev.filter((customer) => customer.id !== id));
    toast.error("Customer deleted!");
  };

  const getCustomerOrders = (customerId: number) => {
    return orders.filter((order) => order.customerId === customerId);
  };

  const addBlogPost = (post: Omit<BlogPost, "id">) => {
    const newPost: BlogPost = {
      ...post,
      id: Date.now().toString(),
    };
    setBlogPosts((prev) => [newPost, ...prev]);
    toast.success("Blog post added successfully!");
  };

  const updateBlogPost = (id: string, updates: Partial<BlogPost>) => {
    setBlogPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, ...updates } : post
      )
    );
    toast.success("Blog post updated!");
  };

  const deleteBlogPost = (id: string) => {
    setBlogPosts((prev) => prev.filter((post) => post.id !== id));
    toast.error("Blog post deleted!");
  };

  const addReview = (review: Omit<Review, "id">) => {
    const newReview: Review = {
      ...review,
      id: Date.now(),
    };
    setReviews((prev) => [...prev, newReview]);
    toast.success("Review added successfully!");
  };

  const updateReview = (id: number, updates: Partial<Review>) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === id ? { ...review, ...updates } : review
      )
    );
    toast.success("Review updated!");
  };

  const deleteReview = (id: number) => {
    setReviews((prev) => prev.filter((review) => review.id !== id));
    toast.error("Review deleted!");
  };

  const getProductReviews = (productId: number) => {
    return reviews.filter((review) => review.productId === productId);
  };

  const addCoupon = (coupon: Omit<Coupon, "id" | "usedCount">) => {
    const newCoupon: Coupon = {
      ...coupon,
      id: Date.now().toString(),
      usedCount: 0,
    };
    setCoupons((prev) => [...prev, newCoupon]);
    toast.success("Coupon added successfully!");
  };

  const updateCoupon = (id: string, updates: Partial<Coupon>) => {
    setCoupons((prev) =>
      prev.map((coupon) =>
        coupon.id === id ? { ...coupon, ...updates } : coupon
      )
    );
    toast.success("Coupon updated!");
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((coupon) => coupon.id !== id));
    toast.error("Coupon deleted!");
  };

  const addCollection = (collection: Omit<Collection, "id">) => {
    const newCollection: Collection = {
      ...collection,
      id: Date.now().toString(),
    };
    setCollections((prev) => [...prev, newCollection]);
    toast.success("Collection added successfully!");
  };

  const updateCollection = (id: string, updates: Partial<Collection>) => {
    setCollections((prev) =>
      prev.map((collection) =>
        collection.id === id ? { ...collection, ...updates } : collection
      )
    );
    toast.success("Collection updated!");
  };

  const deleteCollection = (id: string) => {
    setCollections((prev) => prev.filter((collection) => collection.id !== id));
    toast.error("Collection deleted!");
  };

  const addBrewingGuide = (guide: Omit<BrewingGuide, "id">) => {
    const newGuide: BrewingGuide = {
      ...guide,
      id: Date.now().toString(),
    };
    setBrewingGuides((prev) => [...prev, newGuide]);
    toast.success("Brewing guide added successfully!");
  };

  const updateBrewingGuide = (id: string, updates: Partial<BrewingGuide>) => {
    setBrewingGuides((prev) =>
      prev.map((guide) =>
        guide.id === id ? { ...guide, ...updates } : guide
      )
    );
    toast.success("Brewing guide updated!");
  };

  const deleteBrewingGuide = (id: string) => {
    setBrewingGuides((prev) => prev.filter((guide) => guide.id !== id));
    toast.error("Brewing guide deleted!");
  };

  const addFAQ = (faq: Omit<FAQ, "id">) => {
    const newFAQ: FAQ = {
      ...faq,
      id: Date.now().toString(),
    };
    setFaqs((prev) => [...prev, newFAQ]);
    toast.success("FAQ added successfully!");
  };

  const updateFAQ = (id: string, updates: Partial<FAQ>) => {
    setFaqs((prev) =>
      prev.map((faq) =>
        faq.id === id ? { ...faq, ...updates } : faq
      )
    );
    toast.success("FAQ updated!");
  };

  const deleteFAQ = (id: string) => {
    setFaqs((prev) => prev.filter((faq) => faq.id !== id));
    toast.error("FAQ deleted!");
  };

  const updateAboutPage = (updates: Partial<AboutPage>) => {
    setAboutPage((prev) => ({ ...prev, ...updates }));
    toast.success("About page updated!");
  };

  const markNotificationRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const updateSettings = (newSettings: Partial<StoreContextType["settings"]>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    toast.success("Settings saved!");
  };

  return (
    <StoreContext.Provider
      value={{
        adminUsers,
        addAdminUser,
        updateAdminUser,
        deleteAdminUser,
        verifyAdminCredentials,
        products,
        orders,
        customers,
        notifications,
        blogPosts,
        reviews,
        coupons,
        collections,
        brewingGuides,
        faqs,
        aboutPage,
        inventoryTransactions,
        purchaseOrders,
        addProduct,
        updateProduct,
        deleteProduct,
        addBatch,
        updateBatch,
        deleteBatch,
        addProductVariant,
        updateProductVariant,
        deleteProductVariant,
        addOrder,
        updateOrder,
        deleteOrder,
        refundOrder,
        addInternalNote,
        updateTrackingInfo,
        bulkUpdateOrderStatus,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        getCustomerOrders,
        addLoyaltyPoints,
        redeemLoyaltyPoints,
        addPurchaseOrder,
        updatePurchaseOrder,
        receivePurchaseOrder,
        deletePurchaseOrder,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        addReview,
        updateReview,
        deleteReview,
        getProductReviews,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        addCollection,
        updateCollection,
        deleteCollection,
        addBrewingGuide,
        updateBrewingGuide,
        deleteBrewingGuide,
        addFAQ,
        updateFAQ,
        deleteFAQ,
        updateAboutPage,
        markNotificationRead,
        clearNotifications,
        adjustStock,
        getProductInventoryTransactions,
        getInventoryValue,
        getLowStockProducts,
        getExpiringBatches,
        loyaltyProgram,
        settings,
        updateSettings,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  material: string;
  frameMaterial: string;
  seatHeight: string;
  weightCapacity: string;
  armrest: string;
  headrest: string;
  recline: string;
  warranty: string;
  assemblyRequired: boolean;
  colors: string[];
  dimensions: string;
  weight: string;
  mrp: number;
  sellingPrice: number;
  gstPercent: number;
  stockQty: number;
  sku: string;
  images: string[];
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  productCount: number;
  image: string;
  status: number;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  reviewText: string;
  date: string;
  isVerified: boolean;
  helpful: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
}

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: CartItem[];
  total: number;
  address: Address;
  paymentMethod: string;
}

export type OrderStatus =
  | "Order Placed"
  | "Payment Confirmed"
  | "Processing"
  | "Packed"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled"
  | "Return Initiated"
  | "Refunded";

export interface Address {
  id: string;
  label: string;
  name: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface Coupon {
  code: string;
  type: "flat" | "percent";
  value: number;
  minOrderValue: number;
}

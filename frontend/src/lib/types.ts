export type Product = {
  id: string;
  slug: string;
  name: string;
  shade: string;
  shadeHex: string;
  shadeFamily: string;
  finish: string;
  price: number;
  compareAtPrice: number | null;
  volume: string;
  stock: number;
  featured: boolean;
  description: string;
  longDescription: string;
  ingredients: string;
  howToUse: string;
  images: string[];
};

export type StockStatus = 'in_stock' | 'limited_stock' | 'out_of_stock';

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  shade: string;
  shadeHex: string;
  image: string;
  price: number;
  compareAtPrice: number | null;
  qty: number;
  availableStock: number;
  stockStatus: StockStatus;
  lineTotal: number;
};

export type Cart = {
  items: CartItem[];
  subtotal: number;
  hasUnavailable?: boolean;
  hasLimitedStock?: boolean;
};

export type User = {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  createdAt: string;
};

export type ShippingAddress = {
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
};

export type Order = {
  id: string;
  userId: string;
  items: { productId: string; name: string; shade: string; price: number; qty: number }[];
  subtotal: number;
  shippingFee: number;
  total: number;
  shipping: ShippingAddress;
  status:
    | 'pending_payment'
    | 'paid'
    | 'fulfilment_initiated'
    | 'fulfilment_pending'
    | 'shipped'
    | 'delivered'
    | 'cancelled';
  razorpay: { orderId: string; paymentId?: string; signature?: string };
  shiprocket: null | { orderId?: number; shipmentId?: number; status?: string; error?: string };
  createdAt: string;
  paidAt?: string;
};

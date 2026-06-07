export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  series: string;
  isReady?: boolean;
  isNew?: boolean;
  isSale?: boolean;
  rating: number;
  sold: number;
  category: string;
  location: string;
  condition: 'New' | 'Used';
  shipping: string[];
  addedAt: string;
  weight: number;
  gallery: string[];
  description: string;
  stock: number;
}

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  isReady?: boolean;
  stock?: number;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  status: 'Processing' | 'Completed' | 'Cancelled' | 'Pending Payment';
  paymentMethod: string;
  shippingMethod: string;
  shippingFee: number;
  subtotal: number;
  total: number;
  statusNote: string;
  isPreOrder?: boolean;
}


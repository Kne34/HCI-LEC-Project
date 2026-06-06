import { createContext, useContext } from 'react';
import type { Product, Order } from '../types';

export interface CartItem extends Product {
  quantity: number;
}

export interface CartContextType {
  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  cartCount: number;
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'date' | 'status' | 'isPreOrder'>) => string;
  cancelOrder: (orderId: string) => void;
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};


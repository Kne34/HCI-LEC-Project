import React, { useState, useEffect, type ReactNode } from 'react';
import type { Product, Order } from '../types';
import { CartContext, type CartItem } from './CartState';
import { MOCK_PRODUCTS } from '../data/mockProducts';

const INITIAL_MOCK_ORDERS: Order[] = [
  {
    id: "KYOU-366215",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        id: 4,
        name: "Scale Figure 1/7 - Hoshino Ai (Oshi no Ko)",
        price: 1950000,
        image: "https://product.hstatic.net/200000462939/product/10010_b8f00b30e6c244e5a73b4b38210b18bd_master.jpg",
        quantity: 1,
        isReady: true
      }
    ],
    status: "Sedang Diproses",
    paymentMethod: "QRIS",
    shippingMethod: "Reguler",
    shippingFee: 10000,
    subtotal: 1950000,
    total: 1960000,
    statusNote: "Pembayaran Selesai! Packing List segera Team Kyou Print!",
    isPreOrder: false
  },
  {
    id: "KYOU-364021",
    date: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        id: 2,
        name: "Nendoroid - Furina (Genshin Impact)",
        price: 850000,
        image: "https://genshinfans.com/cdn/shop/files/ZT01_c02358e5-66ab-42ea-99ee-822358617b7e.jpg?v=1748420573",
        quantity: 1,
        isReady: false
      }
    ],
    status: "Dibatalkan",
    paymentMethod: "BCA Transfer",
    shippingMethod: "Reguler",
    shippingFee: 10000,
    subtotal: 850000,
    total: 860000,
    statusNote: "Pesanan dibatalkan oleh pembeli.",
    isPreOrder: true
  }
];

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('kyou_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse products", e);
      }
    }
    return MOCK_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('kyou_products', JSON.stringify(products));
  }, [products]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('kyou_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Order[];
        return parsed.map(order => {
          if (order.id === "KYOU-366215" && order.items[0]?.price === 29000) {
            return {
              ...order,
              items: [
                {
                  id: 4,
                  name: "Scale Figure 1/7 - Hoshino Ai (Oshi no Ko)",
                  price: 1950000,
                  image: "https://product.hstatic.net/200000462939/product/10010_b8f00b30e6c244e5a73b4b38210b18bd_master.jpg",
                  quantity: 1,
                  isReady: true
                }
              ],
              subtotal: 1950000,
              total: 1960000
            };
          }
          return order;
        });
      } catch (e) {
        console.error("Failed to parse orders", e);
      }
    }
    return INITIAL_MOCK_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('kyou_orders', JSON.stringify(orders));
  }, [orders]);

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('kyou_wishlist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse wishlist", e);
      }
    }
    return products.filter(p => p.id === 3 || p.id === 8);
  });

  useEffect(() => {
    localStorage.setItem('kyou_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: number) => {
    return wishlist.some(item => item.id === productId);
  };

  const addToCart = (product: Product) => {
    const currentProduct = products.find(p => p.id === product.id) || product;
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === currentProduct.id);
      if (existingItem) {
        const nextQty = existingItem.quantity + 1;
        if (currentProduct.isReady && currentProduct.stock !== undefined && nextQty > currentProduct.stock) {
          return prevCart;
        }
        return prevCart.map(item =>
          item.id === currentProduct.id ? { ...item, quantity: nextQty } : item
        );
      }
      return [...prevCart, { ...currentProduct, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'date' | 'status' | 'isPreOrder'>) => {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const orderId = `KYOU-${randomDigits}`;
    
    const hasPreOrder = orderData.items.some(item => item.isReady === false);

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      date: new Date().toISOString(),
      status: 'Sedang Diproses',
      isPreOrder: hasPreOrder
    };

    setProducts(prevProducts => {
      return prevProducts.map(p => {
        const orderedItem = orderData.items.find(item => item.id === p.id);
        if (orderedItem && p.isReady) {
          return {
            ...p,
            stock: Math.max(0, p.stock - orderedItem.quantity)
          };
        }
        return p;
      });
    });

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return orderId;
  };

  const cancelOrder = (orderId: string) => {
    const orderToCancel = orders.find(o => o.id === orderId);
    if (orderToCancel && orderToCancel.status !== 'Dibatalkan') {
      setProducts(prevProducts => {
        return prevProducts.map(p => {
          const orderedItem = orderToCancel.items.find(item => item.id === p.id);
          if (orderedItem && p.isReady) {
            return {
              ...p,
              stock: p.stock + orderedItem.quantity
            };
          }
          return p;
        });
      });
    }

    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: 'Dibatalkan', statusNote: 'Pesanan dibatalkan oleh pembeli.' } 
        : order
    ));
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ products, cart, addToCart, removeFromCart, clearCart, cartCount, orders, addOrder, cancelOrder, wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </CartContext.Provider>
  );
};


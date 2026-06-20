'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from './api';
import type { Cart } from './types';
import { useAuth } from './auth-context';

type CartState = {
  cart: Cart;
  loading: boolean;
  addItem: (productId: string, qty?: number) => Promise<void>;
  setQty: (productId: string, qty: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  refresh: () => Promise<void>;
  /** total quantity across all in-cart items — used by the navbar badge */
  count: number;
};

const EMPTY: Cart = { items: [], subtotal: 0 };
const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [cart, setCart] = useState<Cart>(EMPTY);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api<Cart>('/api/cart');
      setCart(data);
    } catch {
      setCart(EMPTY);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refetch whenever the user identity changes (login/logout) so the cart
  // always reflects what the server thinks the cart is.
  useEffect(() => {
    if (authLoading) return;
    refresh();
  }, [user?.id, authLoading, refresh]);

  const addItem = useCallback(async (productId: string, qty = 1) => {
    const data = await api<Cart>('/api/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, qty }),
    });
    setCart(data);
  }, []);

  const setQty = useCallback(async (productId: string, qty: number) => {
    const data = await api<Cart>(`/api/cart/items/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify({ qty }),
    });
    setCart(data);
  }, []);

  const removeItem = useCallback(async (productId: string) => {
    const data = await api<Cart>(`/api/cart/items/${productId}`, { method: 'DELETE' });
    setCart(data);
  }, []);

  const count = cart.items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, loading, addItem, setQty, removeItem, refresh, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}

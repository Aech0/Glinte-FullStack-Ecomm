'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, setToken, getToken } from './api';
import type { User } from './types';

type AuthState = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On first paint, if a token exists, ask the server who we are.
  // Token may have been revoked or expired — handle silently.
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    api<{ user: User }>('/api/auth/me')
      .then((d) => setUser(d.user))
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await api<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    // ORDER MATTERS:
    //   1. setToken so the next request has the JWT in Authorization header
    //   2. merge anon cart into user cart server-side
    //   3. setUser last — this triggers cart-context's effect to refetch
    //      /api/cart, which by now has the merged items. If we setUser
    //      before merging, the refetch races the merge and lands on the
    //      pre-merge user cart.
    setToken(data.token);
    await api('/api/cart/merge', { method: 'POST' }).catch(() => {});
    setUser(data.user);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const data = await api<{ token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    setToken(data.token);
    await api('/api/cart/merge', { method: 'POST' }).catch(() => {});
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

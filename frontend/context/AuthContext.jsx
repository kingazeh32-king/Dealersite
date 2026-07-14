'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

const TOKEN_KEY = 'dealer_admin_token';

function readStoredToken() {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
}

function writeStoredToken(token) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(TOKEN_KEY, token);
  localStorage.removeItem(TOKEN_KEY);
}

function clearStoredToken() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    clearStoredToken();
    setToken(null);
    setAdmin(null);
  }, []);

  useEffect(() => {
    const stored = readStoredToken();
    if (!stored) {
      setLoading(false);
      return;
    }

    api
      .getMe(stored)
      .then((data) => {
        setToken(stored);
        setAdmin(data.admin);
      })
      .catch(() => {
        clearStoredToken();
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const data = await api.login(email, password);
    writeStoredToken(data.token);
    setToken(data.token);
    setAdmin(data.admin);
    return data;
  }

  async function refreshAdmin() {
    const stored = readStoredToken();
    if (!stored) return null;

    try {
      const data = await api.getMe(stored);
      setToken(stored);
      setAdmin(data.admin);
      return data.admin;
    } catch {
      clearStoredToken();
      setToken(null);
      setAdmin(null);
      return null;
    }
  }

  return (
    <AuthContext.Provider value={{ token, admin, loading, login, logout, refreshAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function useAuthGuard() {
  const { token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !token) {
      router.replace('/admin/login');
    }
  }, [loading, token, router]);

  return { token, loading, isAuthed: !!token };
}

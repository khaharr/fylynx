'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  companyName: string | null;
  role: string;
  subscriptionStatus: string;
  storageLimit: number;
  storageUsed: number;
  isTrialActive?: boolean;
  trialDaysLeft?: number;
  brandingLogoUrl?: string | null;
  brandingAccentColor?: string | null;
  customWelcomeText?: string | null;
}

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  mounted: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  mounted: false,
  refreshUser: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);

  const refreshUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data?.user) {
          setUser(data.user);
          try {
            localStorage.setItem('fylynx_user', JSON.stringify(data.user));
          } catch (e) {}
          return;
        }
      }
      setUser(null);
      try {
        localStorage.removeItem('fylynx_user');
      } catch (e) {}
    } catch (error) {
      // Keep cached state if offline or network hiccup occurs
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    try {
      const cached = localStorage.getItem('fylynx_user');
      if (cached) {
        setUser(JSON.parse(cached));
      }
    } catch (e) {}

    refreshUser();
  }, []);

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    setUser(null);
    try {
      localStorage.removeItem('fylynx_user');
    } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{ user, loading, mounted, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth } from "./firebase";
import { getUserData, loginUser, logoutUser } from "./auth";
import type { AuthContextType, User } from "./types";

const StoreContext = createContext<AuthContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 0 });

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const profile = await getUserData(currentUser.uid);
        setUser(profile);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "فشل تحميل بيانات المستخدم.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const refreshUser = async () => {
    if (!auth?.currentUser) {
      setUser(null);
      return;
    }

    try {
      const profile = await getUserData(auth.currentUser.uid);
      setUser(profile);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "فشل تحديث بيانات المستخدم.");
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      await loginUser(email, password);
      await refreshUser();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "فشل تسجيل الدخول.");
      throw err;
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "فشل تسجيل الخروج.");
      throw err;
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      login: handleLogin,
      logout: handleLogout,
      refreshUser,
      searchQuery,
      setSearchQuery,
      isSearchOpen,
      setIsSearchOpen,
      activeCategory,
      setActiveCategory,
      ratingFilter,
      setRatingFilter,
      priceFilter,
      setPriceFilter,
    }),
    [user, loading, error, searchQuery, isSearchOpen, activeCategory, ratingFilter, priceFilter]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): AuthContextType {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return store;
}

"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import {
  clearUserCart,
  getUserCart,
  removeUserCartItem,
  updateUserCartItemQuantity,
} from "@/lib/storeService";
import { CartItem } from "@/lib/types";
import { User as FirebaseUser } from "firebase/auth";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) return;

    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      try {
        const items = await getUserCart(currentUser.uid);
        setCartItems(items);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "فشل تحميل السلة.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const totalPrice = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cartItems]
  );

  const handleRemove = async (productId: string) => {
    if (!user) return;
    try {
      const updated = await removeUserCartItem(user.uid, productId);
      setCartItems(updated);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "فشل إزالة المنتج.");
    }
  };

  const handleQuantity = async (productId: string, quantity: number) => {
    if (!user) return;
    try {
      const updated = await updateUserCartItemQuantity(user.uid, productId, quantity);
      setCartItems(updated);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "فشل تحديث الكمية.");
    }
  };

  const handleClear = async () => {
    if (!user) return;
    try {
      await clearUserCart(user.uid);
      setCartItems([]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "فشل تفريغ السلة.");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[32px] bg-white p-10 text-center shadow-sm">
          <p className="text-slate-600">جاري تحميل السلة...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[32px] bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">السلة</h1>
          <p className="mt-4 text-slate-600">يرجى تسجيل الدخول لعرض السلة الخاصة بك.</p>
          <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/login" className="rounded-full bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700">
              تسجيل الدخول
            </Link>
            <Link href="/register" className="rounded-full border border-slate-200 px-6 py-3 text-slate-900 transition hover:bg-slate-100">
              إنشاء حساب
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-[32px] bg-gradient-to-r from-violet-600 to-pink-600 p-8 text-white shadow-2xl">
          <h1 className="text-3xl font-bold">سلة التسوق</h1>
          <p className="mt-3 text-slate-100">راجع المنتجات المضافة، حدّث الكميات، وأكمل التسوق بسهولة.</p>
        </div>

        {error && <div className="rounded-[32px] bg-red-50 p-8 text-red-700 shadow-sm mb-6">{error}</div>}

        {cartItems.length === 0 ? (
          <div className="rounded-[32px] bg-white p-10 text-center shadow-sm">
            <p className="text-xl font-semibold text-slate-900">السلة فارغة</p>
            <p className="mt-3 text-slate-600">أضف منتجات من المتجر لتظهر هنا.</p>
            <Link href="/products" className="mt-6 inline-flex rounded-full bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700">
              تصفح المنتجات
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.product.id} className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <Image src={item.product.imageUrl} alt={item.product.name} width={112} height={112} className="h-28 w-28 rounded-3xl object-cover" unoptimized />
                      <div>
                        <h2 className="text-xl font-semibold text-slate-900">{item.product.name}</h2>
                        <p className="mt-2 text-sm text-slate-500">{item.product.category || "عام"}</p>
                      </div>
                    </div>
                    <div className="space-y-3 text-right">
                      <p className="text-lg font-bold text-slate-900">${(item.product.price * item.quantity).toFixed(2)}</p>
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => handleQuantity(item.product.id, item.quantity - 1)}
                          className="rounded-full bg-slate-100 px-3 py-2 text-slate-700 transition hover:bg-slate-200"
                        >
                          −
                        </button>
                        <span className="w-10 text-center text-sm font-semibold text-slate-900">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleQuantity(item.product.id, item.quantity + 1)}
                          className="rounded-full bg-slate-100 px-3 py-2 text-slate-700 transition hover:bg-slate-200"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemove(item.product.id)}
                        className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200"
                      >
                        إزالة
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="space-y-5">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">المجموع</p>
                  <p className="mt-3 text-4xl font-bold text-slate-900">${totalPrice.toFixed(2)}</p>
                </div>
                <button className="w-full rounded-full bg-blue-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-blue-700">
                  إتمام الطلب
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="w-full rounded-full border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  تفريغ السلة
                </button>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

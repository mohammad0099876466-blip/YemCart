"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { getUserFavorites, removeUserFavorite } from "@/lib/storeService";
import { Product } from "@/lib/types";
import { User as FirebaseUser } from "firebase/auth";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) return;

    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      try {
        const items = await getUserFavorites(currentUser.uid);
        setFavorites(items);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "فشل تحميل المفضلات.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleRemove = async (product: Product) => {
    if (!user) return;
    try {
      await removeUserFavorite(user.uid, product.id);
      setFavorites((prev) => prev.filter((item) => item.id !== product.id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "فشل حذف المنتج من المفضلات.");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[32px] bg-white p-10 text-center shadow-sm">
          <p className="text-slate-600">جاري تحميل المفضلات...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[32px] bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">المفضلات</h1>
          <p className="mt-4 text-slate-600">يرجى تسجيل الدخول لعرض منتجات المفضلة الخاصة بك.</p>
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
        <div className="mb-8 rounded-[32px] bg-pink-600 p-8 text-white shadow-2xl">
          <h1 className="text-3xl font-bold">المفضلات</h1>
          <p className="mt-3 text-slate-100">جميع المنتجات المحفوظة لحسابك.</p>
        </div>

        {error ? (
          <div className="rounded-[32px] bg-red-50 p-8 text-red-700 shadow-sm">{error}</div>
        ) : favorites.length === 0 ? (
          <div className="rounded-[32px] bg-white p-10 text-center shadow-sm">
            <p className="text-xl font-semibold text-slate-900">لم تضف أي منتج بعد</p>
            <p className="mt-3 text-slate-600">ابدأ بحفظ المنتجات لتظهر هنا.</p>
            <Link href="/products" className="mt-6 inline-flex rounded-full bg-pink-600 px-6 py-3 text-white transition hover:bg-pink-700">
              تصفح المنتجات
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {favorites.map((product) => (
              <div key={product.id} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="overflow-hidden bg-slate-100">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={450}
                    height={224}
                    className="h-56 w-full object-cover"
                    unoptimized
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{product.name}</h2>
                      <p className="mt-1 text-sm text-slate-500">${product.price.toFixed(2)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(product)}
                      className="rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                    >
                      إزالة
                    </button>
                  </div>
                  <p className="mt-4 text-slate-500 line-clamp-2">{product.description || "إضافة المنتج إلى السلة أو مشاهدة التفاصيل."}</p>
                  <div className="mt-6 flex items-center justify-between gap-3">
                    <Link
                      href={`/products/${product.id}`}
                      className="rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      عرض المنتج
                    </Link>
                    <Link
                      href="/cart"
                      className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                    >
                      السلة
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

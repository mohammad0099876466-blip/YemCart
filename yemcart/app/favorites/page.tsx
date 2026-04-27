"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { getFavorites, toggleFavorite } from "@/lib/storage";
import { Product } from "@/lib/types";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Product[]>(() => getFavorites());

  const handleRemove = (product: Product) => {
    const updated = toggleFavorite(product);
    setFavorites(updated);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-[32px] bg-pink-600 p-8 text-white shadow-2xl">
          <h1 className="text-3xl font-bold">المفضلات</h1>
          <p className="mt-3 text-slate-100">جميع المنتجات المحفوظة محلياً لتجربة تسوق سريعة.</p>
        </div>

        {favorites.length === 0 ? (
          <div className="rounded-[32px] bg-white p-10 text-center shadow-sm">
            <p className="text-xl font-semibold text-slate-900">قائمة المفضلات فارغة</p>
            <p className="mt-3 text-slate-600">قم بحفظ المنتجات لتظهر هنا لاحقاً.</p>
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

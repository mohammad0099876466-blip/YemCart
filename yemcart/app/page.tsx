"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getProducts } from "@/lib/productService";
import { Product } from "@/lib/types";

const filterOptions = [
  { key: "all", label: "الكل" },
  { key: "low", label: "أسعار منخفضة" },
  { key: "mid", label: "سعر متوسط" },
  { key: "high", label: "سعر مرتفع" },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bottomNav, setBottomNav] = useState("home");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const items = await getProducts();
        setProducts(items);
      } catch (err: any) {
        setError(err.message || "فشل تحميل المنتجات.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const queryLower = query.trim().toLowerCase();
    return products
      .filter((product) => {
        if (!queryLower) return true;
        return product.name.toLowerCase().includes(queryLower) ||
          product.description?.toLowerCase().includes(queryLower);
      })
      .filter((product) => {
        if (activeFilter === "low") return product.price < 100;
        if (activeFilter === "mid") return product.price >= 100 && product.price <= 500;
        if (activeFilter === "high") return product.price > 500;
        return true;
      });
  }, [products, query, activeFilter]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 rounded-[32px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">سوق اليمن</p>
              <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                أهلاً بك في أفضل منصة تسوق عربية
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                تصفح المنتجات مباشرة من Firestore، واختر ما يناسبك من عروض مميزة اليوم.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-3 sm:justify-end">
              <div className="flex-1 min-w-[180px]">
                <label className="sr-only">بحث</label>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="ابحث عن المنتج أو الوصف"
                  className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid grid-cols-3 gap-2 sm:grid-cols-3">
                <Link
                  href="/cart"
                  className="inline-flex items-center justify-center rounded-3xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  سلة
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  دخول
                </Link>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  المفضلات
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 rounded-[28px] bg-blue-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => setActiveFilter(filter.key)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    activeFilter === filter.key
                      ? "bg-blue-600 text-white"
                      : "bg-white text-slate-700 shadow-sm hover:bg-slate-100"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{filteredProducts.length}</span>
              منتج متاح
            </div>
          </div>
        </header>

        <section className="flex-1">
          {loading ? (
            <div className="rounded-[32px] border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-sm">
              جاري تحميل المنتجات...
            </div>
          ) : error ? (
            <div className="rounded-[32px] border border-red-200 bg-red-50 p-10 text-center text-red-700 shadow-sm">
              {error}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-[32px] border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-sm">
              لا يوجد منتجات مطابقة للبحث.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <article key={product.id} className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="overflow-hidden bg-slate-100">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-72 w-full object-cover transition duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="space-y-4 p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-semibold text-slate-900">{product.name}</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{product.description || "وصف مختصر للمنتج"}</p>
                      </div>
                      <span className="rounded-3xl bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <Link
                        href={`/products/${product.id}`}
                        className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        عرض التفاصيل
                      </Link>
                      <button
                        type="button"
                        className="rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        إضافة للسلة
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white px-4 py-3 shadow-xl shadow-slate-900/5 sm:hidden">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          {[
            { key: "home", label: "الرئيسية" },
            { key: "filter", label: "الفلاتر" },
            { key: "cart", label: "السلة" },
            { key: "user", label: "الحساب" },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setBottomNav(item.key)}
              className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition ${
                bottomNav === item.key ? "text-blue-600" : "text-slate-500"
              }`}
            >
              <span className="text-xl">{item.key === "home" ? "🏠" : item.key === "filter" ? "🔎" : item.key === "cart" ? "🛒" : "👤"}</span>
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </main>
  );
}

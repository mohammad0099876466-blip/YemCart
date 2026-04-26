"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProducts } from "@/lib/productService";
import { Product } from "@/lib/types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const items = await getProducts();
        setProducts(items);
      } catch (error: any) {
        setError(error.message || "فشل تحميل المنتجات.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="text-center mb-10">
          <p className="text-sm text-blue-600 font-semibold uppercase tracking-[0.3em]">
            سوق اليمن
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold text-slate-900">
            تصفح منتجاتنا المميزة
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-slate-600">
            جميع المنتجات تُحمّل مباشرة من قاعدة بيانات Firestore.
          </p>
        </section>

        {loading ? (
          <div className="rounded-3xl bg-white p-10 text-center text-slate-600 shadow-sm">
            جاري تحميل المنتجات...
          </div>
        ) : error ? (
          <div className="rounded-3xl bg-red-50 p-8 text-red-700 shadow-sm">{error}</div>
        ) : products.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center text-slate-600 shadow-sm">
            لا يوجد منتجات حالياً. حاول مرة أخرى لاحقاً.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.id}
                className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="mb-6 overflow-hidden rounded-3xl bg-slate-100">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-56 w-full object-cover"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-900">{product.name}</h2>
                    {product.description && (
                      <p className="mt-2 text-slate-500 text-sm leading-relaxed">
                        {product.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
                    <Link
                      href="/"
                      className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-blue-700"
                    >
                      عرض المنتج
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getProducts } from "@/lib/productService";
import { Product } from "@/lib/types";

const categories = [
  { label: "أزياء", icon: "👗" },
  { label: "جمال", icon: "💄" },
  { label: "إلكترونيات", icon: "📱" },
  { label: "ديكور", icon: "🛋️" },
  { label: "حقائب", icon: "👜" },
  { label: "أحذية", icon: "👟" },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [activeTab, setActiveTab] = useState("home");

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
    const input = search.trim().toLowerCase();
    return products.filter((product) => {
      return (
        !input ||
        product.name.toLowerCase().includes(input) ||
        product.description?.toLowerCase().includes(input)
      );
    });
  }, [products, search]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="mb-5 rounded-[32px] bg-gradient-to-br from-pink-500 via-fuchsia-500 to-violet-600 p-4 text-white shadow-2xl sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/80">تسوق الآن</p>
              <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">اكتشف عروضنا اليومية</h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-white/10 text-white transition hover:bg-white/20"
                aria-label="البحث"
              >
                🔎
              </button>
              <button
                type="button"
                className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-white/10 text-white transition hover:bg-white/20"
                aria-label="المفضلات"
              >
                ❤️
              </button>
              <button
                type="button"
                className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-white/10 text-white transition hover:bg-white/20"
                aria-label="السلة"
              >
                🛒
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_220px]">
            <div>
              <p className="text-sm text-white/90">تصفح أحدث موديلات الموضة، الأجهزة، الديكور، وأكثر.</p>
              <div className="mt-5 rounded-[32px] border border-white/20 bg-white/10 p-5 shadow-xl shadow-black/10">
                <p className="text-sm uppercase tracking-[0.25em] text-white/70">عروض الموسم</p>
                <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">خصومات حتى 70% اليوم</h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-white/80">
                  اشترِ الآن واستمتع بشحن سريع وخدمة عملاء مميزة. عروض حصرية لكل منتجاتنا.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                    تسوق الآن
                  </button>
                  <button className="rounded-full border border-white/30 px-5 py-3 text-sm text-white transition hover:bg-white/10">
                    اكتشف الأقسام
                  </button>
                </div>
              </div>
            </div>
            <div className="hidden rounded-[32px] bg-white/10 p-5 sm:block">
              <div className="flex h-full items-center justify-center rounded-[32px] border border-white/15 bg-white/10 p-8">
                <div className="space-y-4 text-right text-white">
                  <p className="text-sm uppercase tracking-[0.3em] text-white/75">اتجاهات الموضة</p>
                  <h3 className="text-2xl font-bold">أحدث التنسيقات</h3>
                  <p className="max-w-sm text-sm leading-6 text-white/80">
                    استبدل خزانة ملابسك بألوان الموسم وأسلوب SHEIN الأنيق والمتجدد.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="mb-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">التصنيفات</h2>
              <p className="text-sm text-slate-500">اختَر القسم المناسب لك بسهولة.</p>
            </div>
            <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50">
              عرض الكل
            </button>
          </div>

          <div className="mt-4 flex gap-4 overflow-x-auto pb-1">
            {categories.map((category) => (
              <button
                key={category.label}
                type="button"
                onClick={() => setActiveCategory(category.label)}
                className={`shrink-0 rounded-3xl border p-4 text-center transition ${
                  activeCategory === category.label
                    ? "border-pink-500 bg-pink-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl">
                  {category.icon}
                </div>
                <span className="block text-sm font-semibold text-slate-900">{category.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="mb-5 rounded-[32px] bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">منتجات مميزة</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">أفضل الصفقات لهذا الأسبوع</h2>
            </div>
            <div className="relative w-full sm:w-96">
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">🔎</span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث عن المنتج..."
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pr-12 pl-12 text-sm text-slate-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
              />
            </div>
          </div>
        </section>

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
              لا يوجد منتجات مطابقة.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <article key={product.id} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="overflow-hidden bg-slate-100">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-56 w-full object-cover transition duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="space-y-3 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold uppercase tracking-[0.22em] text-pink-600">عرض جديد</span>
                      <button
                        type="button"
                        className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        ❤️
                      </button>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{product.name}</h3>
                    <p className="text-sm leading-6 text-slate-600">{product.description || "وصف جذاب للمنتج"}</p>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xl font-bold text-slate-900">${product.price.toFixed(2)}</span>
                      <Link
                        href={`/products/${product.id}`}
                        className="rounded-full bg-pink-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-700"
                      >
                        تسوق الآن
                      </Link>
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
            { key: "search", label: "بحث" },
            { key: "cart", label: "السلة" },
            { key: "user", label: "الحساب" },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveTab(item.key)}
              className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition ${
                activeTab === item.key ? "text-pink-600" : "text-slate-500"
              }`}
            >
              <span className="text-xl">
                {item.key === "home" ? "🏠" : item.key === "search" ? "🔎" : item.key === "cart" ? "🛒" : "👤"}
              </span>
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </main>
  );
}

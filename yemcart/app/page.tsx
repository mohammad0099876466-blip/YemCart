"use client";

import { useEffect, useMemo, useState } from "react";
import { getActiveBanner, getCategories, getProducts } from "@/lib/productService";
import { Product, Category, Banner } from "@/lib/types";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import Sidebar from "@/components/Sidebar";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [items, categoryList, activeBanner] = await Promise.all([
          getProducts(),
          getCategories(),
          getActiveBanner(),
        ]);
        setProducts(items);
        setCategories(categoryList);
        setBanner(activeBanner);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "فشل تحميل البيانات من Firestore.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    const input = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = activeCategory === "الكل" || product.category === activeCategory;
      const matchesSearch =
        !input ||
        product.name.toLowerCase().includes(input) ||
        product.description?.toLowerCase().includes(input);
      return matchesCategory && matchesSearch;
    });
  }, [products, search, activeCategory]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Sidebar
        open={sidebarOpen}
        categories={categories}
        activeCategory={activeCategory}
        onClose={() => setSidebarOpen(false)}
        onSelectCategory={(category) => {
          setActiveCategory(category);
          setSidebarOpen(false);
        }}
      />

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <Header
          search={search}
          onSearchChange={setSearch}
          onOpenSidebar={() => setSidebarOpen(true)}
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          banner={banner}
        />

        <section className="mt-8 space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">منتجات مميزة</h2>
              <p className="mt-1 text-sm text-slate-500">تصفَّح منتجات جديدة ومُختارة خصيصاً لك.</p>
            </div>
            <div className="hidden sm:flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <span className="text-slate-400">Filter:</span>
              <button
                type="button"
                onClick={() => setActiveCategory("الكل")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeCategory === "الكل" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                الكل
              </button>
              {categories.slice(0, 3).map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.name)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    activeCategory === category.name
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {error ? (
            <div className="rounded-[32px] border border-red-200 bg-red-50 p-10 text-center text-red-700 shadow-sm">
              {error}
            </div>
          ) : loading ? (
            <div className="rounded-[32px] border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-sm">
              جاري تحميل المنتجات...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-[32px] border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-sm">
              لا يوجد منتجات مطابقة.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

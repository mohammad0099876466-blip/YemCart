"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { getUserProducts, deleteProduct } from "@/lib/productService";
import { Product } from "@/lib/types";
import { User as FirebaseUser } from "firebase/auth";

export default function ProductsListPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser: FirebaseUser | null) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }

      try {
        const items = await getUserProducts(currentUser.uid);
        setProducts(items);
      } catch (error: any) {
        setError(error.message || "فشل تحميل المنتجات.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleDelete = async (id: string, imagePath?: string) => {
    const confirmed = window.confirm("هل أنت متأكد أنك تريد حذف هذا المنتج؟");
    if (!confirmed) return;

    setDeleting(id);

    try {
      await deleteProduct(id, imagePath);
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (error: any) {
      setError(error.message || "حدث خطأ أثناء حذف المنتج.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">منتجاتي</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">المنتجات التي قمت بإنشائها</h2>
            <p className="mt-2 text-slate-600">هذه القائمة تحتوي على المنتجات الخاصة بك فقط.</p>
          </div>
          <Link
            href="/dashboard/add-product"
            className="inline-flex items-center justify-center rounded-3xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            إضافة منتج جديد
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-sm">
          جاري تحميل المنتجات...
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">{error}</div>
      ) : products.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-sm">
          لم تقم بإضافة أي منتجات بعد.
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {products.map((product) => (
            <div key={product.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{product.name}</h3>
                  <p className="mt-2 text-slate-500">{product.description}</p>
                </div>
                <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-[160px_minmax(0,1fr)]">
                <div className="overflow-hidden rounded-3xl bg-slate-100">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-56 w-full object-cover"
                  />
                </div>

                <div className="space-y-4">
                  <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
                    <p>
                      <span className="font-semibold">معرف المنتج:</span> {product.id}
                    </p>
                    <p className="mt-2">
                      <span className="font-semibold">أنشئ بتاريخ:</span>{" "}
                      {product.createdAt ? new Date(product.createdAt).toLocaleDateString("ar-EG") : "غير معروف"}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Link
                      href={`/dashboard/products/${product.id}`}
                      className="inline-flex flex-1 items-center justify-center rounded-3xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      تعديل
                    </Link>
                    <button
                      type="button"
                      disabled={deleting === product.id}
                      onClick={() => handleDelete(product.id, product.imagePath)}
                      className="inline-flex flex-1 items-center justify-center rounded-3xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                    >
                      {deleting === product.id ? "جاري الحذف..." : "حذف"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

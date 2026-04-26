"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProductById } from "@/lib/productService";
import { Product } from "@/lib/types";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const productId = params?.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return;

      try {
        const item = await getProductById(productId);
        if (!item) {
          setError("لم يتم العثور على المنتج.");
          return;
        }
        setProduct(item);
      } catch (err: any) {
        setError(err.message || "فشل تحميل المنتج.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <Link
          href="/products"
          className="text-blue-600 hover:text-blue-700 font-semibold mb-6 inline-block"
        >
          ← العودة للمنتجات
        </Link>

        {loading ? (
          <div className="rounded-3xl bg-slate-100 p-8 text-center text-slate-600">جاري تحميل المنتج...</div>
        ) : error ? (
          <div className="rounded-3xl bg-red-50 p-8 text-center text-red-700">{error}</div>
        ) : product ? (
          <>
            <div className="mb-6 overflow-hidden rounded-3xl bg-slate-100">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-96 w-full object-cover"
              />
            </div>

            <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
            <div className="mb-6">
              <span className="text-3xl font-bold text-green-600">${product.price.toFixed(2)}</span>
            </div>

            {product.description && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">الوصف</h2>
                <p className="text-gray-600 text-base leading-relaxed">{product.description}</p>
              </div>
            )}

            <div className="mb-6 bg-gray-100 p-4 rounded-lg">
              <p className="text-gray-700">
                <span className="font-semibold">معرّف المنتج:</span> {product.id}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors">
                🛒 إضافة للسلة
              </button>
              <button className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                ❤️ إضافة للمفضلة
              </button>
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
}

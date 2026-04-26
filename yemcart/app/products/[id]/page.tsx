"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { dummyProducts } from "@/lib/products";
import { notFound } from "next/navigation";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const productId = params?.id as string;

  const product = dummyProducts.find((p) => p.id === productId);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* Back Link */}
        <Link
          href="/products"
          className="text-blue-600 hover:text-blue-700 font-semibold mb-6 inline-block"
        >
          ← العودة للمنتجات
        </Link>

        {/* Product Image/Icon */}
        <div className="text-9xl text-center mb-8">{product.image}</div>

        {/* Product Title */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.title}</h1>

        {/* Price */}
        <div className="mb-6">
          <span className="text-3xl font-bold text-green-600">${product.price}</span>
        </div>

        {/* Product Description */}
        {product.description && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">الوصف</h2>
            <p className="text-gray-600 text-base leading-relaxed">
              {product.description}
            </p>
          </div>
        )}

        {/* Product ID */}
        <div className="mb-6 bg-gray-100 p-4 rounded-lg">
          <p className="text-gray-700">
            <span className="font-semibold">معرّف المنتج:</span> {product.id}
          </p>
          <p className="text-gray-700 mt-2">
            <span className="font-semibold">البائع:</span> {product.sellerId || "متجر اليمن"}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors">
            🛒 إضافة للسلة
          </button>
          <button className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
            ❤️ إضافة للمفضلة
          </button>
        </div>

        {/* Seller Info */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">معلومات البائع</h2>
          <p className="text-gray-700 mb-4">متجر موثوق منذ 2024</p>
          <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            تواصل مع البائع
          </button>
        </div>
      </div>
    </main>
  );
}

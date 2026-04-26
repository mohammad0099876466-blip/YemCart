"use client";

import Link from "next/link";
import { dummyProducts } from "@/lib/products";

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📦 المنتجات</h1>
          <p className="text-gray-600">تصفح جميع المنتجات المتاحة</p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {dummyProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 cursor-pointer"
            >
              {/* Product Image/Icon */}
              <div className="text-6xl text-center mb-4">{product.image}</div>

              {/* Product Title */}
              <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                {product.title}
              </h2>

              {/* Product Description */}
              {product.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
              )}

              {/* Price */}
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-green-600">
                  ${product.price}
                </span>
                <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  عرض التفاصيل
                </button>
              </div>
            </Link>
          ))}
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            ← العودة للرئيسية
          </Link>
        </div>
      </div>
    </main>
  );
}

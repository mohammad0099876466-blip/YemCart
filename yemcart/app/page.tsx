"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-600 to-blue-800 p-6">
      <div className="max-w-md w-full text-center text-white">
        {/* Logo / Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">🛒 سوق اليمن</h1>
          <p className="text-xl opacity-90">منصة لبيع وشراء المنتجات داخل اليمن</p>
        </div>

        {/* Description */}
        <div className="mb-12 bg-white/10 p-6 rounded-lg backdrop-blur-sm">
          <p className="text-lg leading-relaxed">
            ارحب بك في سوق اليمن - أكبر منصة للتجارة الإلكترونية في اليمن.
            تصفح آلاف المنتجات وابدأ البيع والشراء اليوم!
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-4 mb-8">
          <Link
            href="/products"
            className="block w-full bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
          >
            📦 تصفح المنتجات
          </Link>

          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/login"
              className="block bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-all shadow-lg hover:shadow-xl"
            >
              دخول
            </Link>

            <Link
              href="/register"
              className="block bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl"
            >
              تسجيل
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-sm opacity-75">
          <p>© 2024 سوق اليمن. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </main>
  );
}

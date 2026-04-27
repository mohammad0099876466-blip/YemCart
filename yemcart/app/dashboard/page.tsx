"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { logoutUser } from "@/lib/auth";
import { User as FirebaseUser } from "firebase/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser: FirebaseUser | null) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await logoutUser();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      setLogoutLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">لوحة التحكم</h1>
              <p className="text-gray-600">أهلاً وسهلاً بك في سوق اليمن</p>
            </div>
            <div className="text-4xl">👤</div>
          </div>

          {/* User Info */}
          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <p className="text-gray-700">
              <span className="font-semibold">البريد الإلكتروني:</span> {user?.email}
            </p>
            <p className="text-gray-700 mt-2">
              <span className="font-semibold">معرّف المستخدم:</span> {user?.uid.substring(0, 12)}...
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Link
              href="/products"
              className="block bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors text-center"
            >
              📦 تصفح المنتجات
            </Link>
            <Link
              href="/dashboard/add-product"
              className="block bg-orange-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors text-center"
            >
              📝 إضافة منتج
            </Link>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={logoutLoading}
            className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {logoutLoading ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
          </button>
        </div>

        {/* Coming Soon Features */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🚀 ميزات قادمة</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center gap-3">
              <span className="text-xl">✓</span> بيع المنتجات
            </li>
            <li className="flex items-center gap-3">
              <span className="text-xl">✓</span> إدارة الطلبات
            </li>
            <li className="flex items-center gap-3">
              <span className="text-xl">✓</span> تتبع الشحنات
            </li>
            <li className="flex items-center gap-3">
              <span className="text-xl">✓</span> المحفظة الرقمية
            </li>
          </ul>
        </div>

        {/* Home Link */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="text-white hover:text-gray-200 font-semibold"
          >
            ← العودة للرئيسية
          </Link>
        </div>
      </div>
    </main>
  );
}

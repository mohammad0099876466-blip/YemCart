"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/lib/firebase";
import { logoutUser } from "@/lib/auth";
import { User as FirebaseUser } from "firebase/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser: FirebaseUser | null) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUserEmail(currentUser.email);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await logoutUser();
      router.push("/login");
    } catch (error) {
      console.error(error);
    } finally {
      setLogoutLoading(false);
    }
  };

  const navItems = [
    { label: "اللوحة الرئيسية", href: "/dashboard" },
    { label: "إضافة منتج", href: "/dashboard/add-product" },
    { label: "قائمة المنتجات", href: "/dashboard/products" },
  ];

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">التحقق من الجلسة...</p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-[1500px] flex-col lg:flex-row">
        <aside className="w-full shrink-0 border-b border-slate-200 bg-white lg:w-80 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-5 lg:justify-center">
            <div>
              <p className="text-sm text-slate-500">مرحباً في</p>
              <h2 className="text-xl font-bold text-slate-900">لوحة تحكم اليمن</h2>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-600 lg:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="عرض التنقل"
            >
              ☰
            </button>
          </div>

          <div className={`${menuOpen ? "block" : "hidden"} lg:block`}>
            <div className="space-y-1 px-6 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    pathname === item.href
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="border-t border-slate-200 px-6 py-4">
              <p className="text-sm text-slate-500">المستخدم</p>
              <p className="mt-2 text-slate-900 break-all">{userEmail}</p>
              <button
                type="button"
                onClick={handleLogout}
                disabled={logoutLoading}
                className="mt-4 w-full rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {logoutLoading ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-6 lg:p-10">
          <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">لوحة الإدارة</p>
                <h1 className="mt-3 text-3xl font-bold text-slate-900">مرحباً بك في YemCart</h1>
                <p className="mt-2 text-slate-600">إدارة المنتجات والأوامر بشكل سريع وسلس.</p>
              </div>
              <div className="inline-flex items-center gap-3 rounded-3xl bg-slate-100 px-5 py-4">
                <span className="text-2xl">⚡</span>
                <div>
                  <p className="text-sm text-slate-500">موقع نشط</p>
                  <p className="text-lg font-semibold text-slate-900">{pathname}</p>
                </div>
              </div>
            </div>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}

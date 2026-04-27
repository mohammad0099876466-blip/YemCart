"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { addProductItem, getCategories } from "@/lib/productService";
import { getUserData } from "@/lib/auth";
import { User as FirebaseUser } from "firebase/auth";
import { Category } from "@/lib/types";

export default function AddProductPage() {
  const router = useRouter();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState<string>("أزياء");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = auth.onAuthStateChanged(async (currentUser: FirebaseUser | null) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }

      setUser(currentUser);
      const profile = await getUserData(currentUser.uid);
      setRole(profile?.role ?? null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const loadCategories = async () => {
      const list = await getCategories();
      setCategories(list);
      if (list.length > 0) {
        setCategory(list[0].name);
      }
    };

    loadCategories();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!user) {
      setError("يرجى تسجيل الدخول لإضافة المنتج.");
      return;
    }

    if (role !== "seller") {
      setError("يمكن فقط للحسابات من نوع بائع إضافة منتجات.");
      return;
    }

    if (!name.trim() || !price || !imageUrl.trim() || !category.trim()) {
      setError("جميع الحقول مطلوبة.");
      return;
    }

    setSaving(true);

    try {
      await addProductItem({
        name: name.trim(),
        price,
        imageUrl: imageUrl.trim(),
        userId: user.uid,
        description: description.trim(),
        category,
      });

      setName("");
      setPrice(0);
      setImageUrl("");
      setDescription("");
      setSuccess("تمت إضافة المنتج بنجاح.");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "فشل إضافة المنتج.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
        <div className="rounded-3xl bg-white p-10 shadow-sm text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 font-semibold">التحقق من الجلسة...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">إضافة منتج جديد</p>
            <h1 className="mt-4 text-4xl font-bold text-slate-900">أضف منتجك إلى المتجر</h1>
            <p className="mt-3 text-slate-600">أدرج منتجاً جديداً وسيظهر مباشرةً للمستخدمين بعد الحفظ.</p>
          </div>

          {role !== "seller" ? (
            <div className="rounded-3xl bg-yellow-50 p-6 text-sm text-yellow-900 shadow-sm">
              <p className="font-semibold">تنبيه:</p>
              <p className="mt-2">يمكن فقط للحسابات من نوع بائع إضافة منتجات. إذا كنت مشترياً، أنشئ حساب بائع أولاً.</p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-3xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  العودة إلى لوحة التحكم
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-3xl border border-blue-600 px-5 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                >
                  تسجيل حساب بائع جديد
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">اسم المنتج</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="مثال: هاتف ذكي"
                    disabled={saving}
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">السعر (USD)</span>
                  <input
                    type="number"
                    value={price || ""}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    min={0}
                    className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="مثال: 199"
                    disabled={saving}
                  />
                </label>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">القسم</span>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    disabled={saving}
                  >
                    {categories.map((item) => (
                      <option key={item.id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">رابط صورة المنتج</span>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="https://"
                    disabled={saving}
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">وصف المنتج</span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="اكتب وصفًا قصيرًا للمنتج"
                  disabled={saving}
                />
              </label>

              {imageUrl.trim() && (
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 p-4">
                  <p className="mb-2 text-sm font-semibold text-slate-700">معاينة الصورة</p>
                  <Image
                    src={imageUrl}
                    alt="معاينة المنتج"
                    width={900}
                    height={400}
                    className="h-64 w-full rounded-3xl object-cover"
                    unoptimized
                  />
                </div>
              )}

              {success && <div className="rounded-3xl bg-emerald-50 p-4 text-sm text-emerald-700">{success}</div>}
              {error && <div className="rounded-3xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}

              <div className="flex flex-col gap-4 sm:flex-row">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-3xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "جاري الإضافة..." : "إضافة المنتج"}
                </button>
                <Link
                  href="/dashboard/products"
                  className="flex-1 inline-flex items-center justify-center rounded-3xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  عرض منتجاتي
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { addProduct } from "@/lib/productService";

export default function AddProductPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setError(null);
    setImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (!name || !price || !description || !imageFile) {
      setError("يرجى ملء جميع الحقول وتحميل صورة المنتج.");
      return;
    }

    setLoading(true);

    try {
      await addProduct({
        name,
        price,
        description,
        imageFile,
      });

      setMessage("تم إضافة المنتج بنجاح.");
      setName("");
      setPrice(0);
      setDescription("");
      setImageFile(null);
      setPreview(null);
      router.push("/dashboard/products");
    } catch (error: any) {
      setError(error.message || "حدث خطأ أثناء حفظ المنتج.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">إضافة منتج جديد</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">أنشئ منتجك في السوق</h2>
          <p className="mt-2 text-slate-600">أضف بيانات المنتج وصورة جذابة ليشاهده العملاء.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">اسم المنتج</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="مثال: هاتف ذكي"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">السعر (USD)</span>
              <input
                type="number"
                value={price || ""}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="مثال: 199"
                min={0}
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">الوصف</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 h-32 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="اكتب وصفاً مختصراً وجذاباً للمنتج"
            />
          </label>

          <div className="grid gap-6 lg:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">صورة المنتج</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-2 w-full text-sm text-slate-700"
              />
            </label>

            {preview ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="mb-2 text-sm font-semibold text-slate-700">معاينة الصورة</p>
                <img
                  src={preview}
                  alt="معاينة المنتج"
                  className="h-48 w-full rounded-3xl object-cover"
                />
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
                اختر صورة للمعاينة بعد الرفع
              </div>
            )}
          </div>

          {error && <div className="rounded-3xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}
          {message && <div className="rounded-3xl bg-green-50 p-4 text-sm text-green-700">{message}</div>}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-3xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "جاري حفظ المنتج..." : "إضافة المنتج"}
            </button>
            <Link
              href="/dashboard/products"
              className="inline-flex items-center justify-center rounded-3xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              العودة إلى قائمة المنتجات
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

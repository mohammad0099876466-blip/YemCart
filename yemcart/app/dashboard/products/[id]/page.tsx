"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getProductById, updateProduct, deleteProduct } from "@/lib/productService";
import { Product } from "@/lib/types";

export default function EditProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const item = await getProductById(id);
        if (!item) {
          setError("لم يتم العثور على المنتج.");
          return;
        }
        setProduct(item);
        setName(item.name);
        setPrice(item.price);
        setDescription(item.description || "");
        setPreview(item.imageUrl);
      } catch (error: any) {
        setError(error.message || "حدث خطأ أثناء تحميل المنتج.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name || !price || !description) {
      setError("يرجى ملء جميع الحقول المطلوبة.");
      return;
    }

    setSaving(true);

    try {
      await updateProduct(id, {
        name,
        price,
        description,
        imageFile: imageFile ?? undefined,
        currentImagePath: product?.imagePath,
      });

      setSuccess("تم تحديث المنتج بنجاح.");
      router.push("/dashboard/products");
    } catch (error: any) {
      setError(error.message || "فشل تحديث المنتج.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    const confirmed = window.confirm("هل تريد حذف هذا المنتج بالفعل؟");
    if (!confirmed) return;

    setSaving(true);
    try {
      await deleteProduct(id, product.imagePath);
      router.push("/dashboard/products");
    } catch (error: any) {
      setError(error.message || "فشل حذف المنتج.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-sm">
        جاري تحميل بيانات المنتج...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-red-700 shadow-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">تعديل المنتج</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">{product?.name}</h2>
            <p className="mt-2 text-slate-600">قم بتحديث البيانات أو استبدال الصورة.</p>
          </div>
          <Link
            href="/dashboard/products"
            className="inline-flex items-center justify-center rounded-3xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            العودة إلى القائمة
          </Link>
        </div>

        <form onSubmit={handleSave} className="mt-8 space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">اسم المنتج</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">السعر (USD)</span>
              <input
                type="number"
                value={price || ""}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
            />
          </label>

          <div className="grid gap-6 lg:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">تغيير الصورة (اختياري)</span>
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
                لا توجد معاينة حالياً
              </div>
            )}
          </div>

          {success && <div className="rounded-3xl bg-green-50 p-4 text-sm text-green-700">{success}</div>}
          {error && <div className="rounded-3xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}

          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-3xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              className="flex-1 rounded-3xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
            >
              {saving ? "جاري الحذف..." : "حذف المنتج"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

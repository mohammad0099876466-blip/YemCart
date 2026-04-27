"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { getProductById } from "@/lib/productService";
import { getUserData } from "@/lib/auth";
import { addUserCartItem, isUserFavorite, toggleUserFavorite } from "@/lib/storeService";
import { Product } from "@/lib/types";
import { IconHeartFilled, IconHeartOutline } from "@/components/Icons";
import { User as FirebaseUser } from "firebase/auth";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const productId = params?.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [sellerEmail, setSellerEmail] = useState<string | null>(null);
  const [sellerRole, setSellerRole] = useState<string | null>(null);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [favorite, setFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = auth.onAuthStateChanged(async (currentUser: FirebaseUser | null) => {
      setUser(currentUser);
      if (currentUser && productId) {
        try {
          const isFav = await isUserFavorite(currentUser.uid, productId);
          setFavorite(isFav);
        } catch (error) {
          console.error("Favorite status failed:", error);
        }
      }
    });

    return () => unsubscribe();
  }, [productId]);

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

        if (item.userId) {
          const seller = await getUserData(item.userId);
          if (seller) {
            setSellerEmail(seller.email);
            setSellerRole(seller.role);
          }
        }
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : "فشل تحميل المنتج.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const handleBuy = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!product) return;

    try {
      await addUserCartItem(user.uid, product);
      router.push("/cart");
    } catch (error) {
      console.error("Add to cart failed:", error);
      setError(error instanceof Error ? error.message : "فشل إضافة المنتج إلى السلة.");
    }
  };

  const handleToggleFavorite = async () => {
    if (!user || !product) {
      router.push("/login");
      return;
    }

    try {
      const nextFavorite = await toggleUserFavorite(user.uid, product);
      setFavorite(nextFavorite);
    } catch (error) {
      console.error("Favorite toggle failed:", error);
      setError(error instanceof Error ? error.message : "فشل تحديث المفضلات.");
    }
  };

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
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={1200}
                height={450}
                className="h-96 w-full object-cover"
                unoptimized
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_240px]">
              <div>
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

                <div className="mb-6 rounded-3xl bg-gray-100 p-4">
                  <p className="text-gray-700">
                    <span className="font-semibold">معرّف المنتج:</span> {product.id}
                  </p>
                  {sellerEmail && (
                    <p className="mt-2 text-gray-700">
                      <span className="font-semibold">البائع:</span> {sellerEmail}
                    </p>
                  )}
                  {sellerRole && (
                    <p className="mt-2 text-gray-700">
                      <span className="font-semibold">دور البائع:</span> {sellerRole}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <button
                    onClick={handleBuy}
                    className="rounded-3xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                  >
                    {user ? "أضف إلى السلة" : "تسجيل الدخول للشراء"}
                  </button>
                  <button
                    onClick={handleToggleFavorite}
                    className="rounded-3xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 flex items-center justify-center gap-2"
                  >
                    {favorite ? <IconHeartFilled /> : <IconHeartOutline />}
                    {favorite ? "محفوظ" : "أضف للمفضلة"}
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
}

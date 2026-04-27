"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/types";
import { auth } from "@/lib/firebase";
import { User as FirebaseUser } from "firebase/auth";
import { addUserCartItem, isUserFavorite, toggleUserFavorite } from "@/lib/storeService";
import { IconHeartFilled, IconHeartOutline } from "@/components/Icons";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [favorite, setFavorite] = useState(false);
  const [adding, setAdding] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = auth.onAuthStateChanged(async (currentUser: FirebaseUser | null) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const isFav = await isUserFavorite(currentUser.uid, product.id);
          setFavorite(isFav);
        } catch (error) {
          console.error("Favorite status failed:", error);
          setFavorite(false);
        }
      }
    });
    return () => unsubscribe();
  }, [product.id]);

  const handleFavorite = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      const nextFavorite = await toggleUserFavorite(user.uid, product);
      setFavorite(nextFavorite);
    } catch (error) {
      console.error("Favorite update failed:", error);
      router.push("/login");
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    setAdding(true);
    try {
      await addUserCartItem(user.uid, product);
    } catch (error) {
      console.error("Add to cart failed:", error);
    } finally {
      setAdding(false);
    }
  };

  return (
    <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="overflow-hidden bg-slate-100">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={672}
          height={336}
          className="h-56 w-full object-cover transition duration-500 hover:scale-105"
          unoptimized
        />
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-500">{product.category || "عام"}</p>
            <h3 className="mt-2 text-lg font-bold text-slate-900">{product.name}</h3>
          </div>
          <button
            type="button"
            onClick={handleFavorite}
            className={`rounded-full p-3 text-xl transition ${
              favorite ? "bg-pink-100 text-pink-600" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
            aria-label={favorite ? "إزالة من المفضلات" : "إضافة إلى المفضلات"}
          >
            {favorite ? <IconHeartFilled /> : <IconHeartOutline />}
          </button>
        </div>

        <p className="text-slate-500 line-clamp-2">{product.description || "وصف مميز للمنتج سيجذب عملائك."}</p>

        <div className="flex items-center justify-between gap-3">
          <span className="text-2xl font-bold text-slate-900">${product.price.toFixed(2)}</span>
          <button
            type="button"
            onClick={handleAddToCart}
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            disabled={adding}
          >
            {adding ? "جارٍ الإضافة..." : "أضف إلى السلة"}
          </button>
        </div>
      </div>
    </article>
  );
}

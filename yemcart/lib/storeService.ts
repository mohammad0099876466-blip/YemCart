import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { CartItem, Product } from "./types";

function ensureDb() {
  if (!db) {
    throw new Error("Firestore is unavailable.");
  }
  return db;
}

function isFirebaseError(error: unknown): error is { code?: string; message?: string } {
  return typeof error === "object" && error !== null && "code" in error;
}

function getFirestoreErrorMessage(error: unknown): string {
  if (isFirebaseError(error)) {
    if (error.code === "permission-denied") {
      return "لا تملك صلاحية الوصول إلى Firestore. تحقق من قواعد الأمان.";
    }
    return error.message || "حدث خطأ أثناء الوصول إلى Firestore.";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "حدث خطأ أثناء الوصول إلى Firestore.";
}

function toProduct(data: DocumentData, id: string): Product {
  return {
    id,
    name: String(data.name || "منتج"),
    price: Number(data.price || 0),
    description: String(data.description || ""),
    imageUrl: String(data.imageUrl || ""),
    imagePath: String(data.imagePath || ""),
    userId: String(data.userId || ""),
    category: String(data.category || "عام"),
    featured: Boolean(data.featured),
    published: Boolean(data.published),
    createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : undefined,
  };
}

async function getUserFavorites(userId: string): Promise<Product[]> {
  try {
    const snapshot = await getDocs(collection(ensureDb(), "users", userId, "favorites"));
    return snapshot.docs.map((favoriteDoc) => toProduct(favoriteDoc.data() as DocumentData, favoriteDoc.id));
  } catch (error: unknown) {
    throw new Error(getFirestoreErrorMessage(error));
  }
}

async function isUserFavorite(userId: string, productId: string): Promise<boolean> {
  try {
    const favoriteRef = doc(ensureDb(), "users", userId, "favorites", productId);
    const favoriteDoc = await getDoc(favoriteRef);
    return favoriteDoc.exists();
  } catch (error: unknown) {
    throw new Error(getFirestoreErrorMessage(error));
  }
}

async function addUserFavorite(userId: string, product: Product): Promise<void> {
  try {
    const favoriteRef = doc(ensureDb(), "users", userId, "favorites", product.id);
    await setDoc(favoriteRef, {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description || "",
      imageUrl: product.imageUrl,
      imagePath: product.imagePath || "",
      userId: product.userId || "",
      category: product.category || "عام",
      createdAt: serverTimestamp(),
    });
  } catch (error: unknown) {
    throw new Error(getFirestoreErrorMessage(error));
  }
}

async function removeUserFavorite(userId: string, productId: string): Promise<void> {
  try {
    const favoriteRef = doc(ensureDb(), "users", userId, "favorites", productId);
    await deleteDoc(favoriteRef);
  } catch (error: unknown) {
    throw new Error(getFirestoreErrorMessage(error));
  }
}

async function toggleUserFavorite(userId: string, product: Product): Promise<boolean> {
  const favoriteRef = doc(ensureDb(), "users", userId, "favorites", product.id);
  try {
    const favoriteDoc = await getDoc(favoriteRef);
    if (favoriteDoc.exists()) {
      await deleteDoc(favoriteRef);
      return false;
    }
    await setDoc(favoriteRef, {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description || "",
      imageUrl: product.imageUrl,
      imagePath: product.imagePath || "",
      userId: product.userId || "",
      category: product.category || "عام",
      createdAt: serverTimestamp(),
    });
    return true;
  } catch (error: unknown) {
    throw new Error(getFirestoreErrorMessage(error));
  }
}

async function getUserCart(userId: string): Promise<CartItem[]> {
  try {
    const snapshot = await getDocs(collection(ensureDb(), "users", userId, "cart"));
    return snapshot.docs.map((cartDoc) => {
      const data = cartDoc.data() as DocumentData;
      return {
        product: toProduct(data, cartDoc.id),
        quantity: Number(data.quantity || 1),
      };
    });
  } catch (error: unknown) {
    throw new Error(getFirestoreErrorMessage(error));
  }
}

async function addUserCartItem(userId: string, product: Product): Promise<CartItem[]> {
  try {
    const cartRef = doc(ensureDb(), "users", userId, "cart", product.id);
    const currentCartItem = await getDoc(cartRef);
    const nextQuantity = currentCartItem.exists()
      ? Math.min(Number(currentCartItem.data().quantity || 1) + 1, 10)
      : 1;

    await setDoc(
      cartRef,
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        description: product.description || "",
        imageUrl: product.imageUrl,
        imagePath: product.imagePath || "",
        userId: product.userId || "",
        category: product.category || "عام",
        quantity: nextQuantity,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return getUserCart(userId);
  } catch (error: unknown) {
    throw new Error(getFirestoreErrorMessage(error));
  }
}

async function updateUserCartItemQuantity(userId: string, productId: string, quantity: number): Promise<CartItem[]> {
  try {
    const cartRef = doc(ensureDb(), "users", userId, "cart", productId);
    if (quantity <= 0) {
      await deleteDoc(cartRef);
    } else {
      await setDoc(
        cartRef,
        {
          quantity: Math.max(1, Math.min(quantity, 10)),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }
    return getUserCart(userId);
  } catch (error: unknown) {
    throw new Error(getFirestoreErrorMessage(error));
  }
}

async function removeUserCartItem(userId: string, productId: string): Promise<CartItem[]> {
  try {
    await deleteDoc(doc(ensureDb(), "users", userId, "cart", productId));
    return getUserCart(userId);
  } catch (error: unknown) {
    throw new Error(getFirestoreErrorMessage(error));
  }
}

async function clearUserCart(userId: string): Promise<void> {
  try {
    const snapshot = await getDocs(collection(ensureDb(), "users", userId, "cart"));
    await Promise.all(snapshot.docs.map((cartDoc) => deleteDoc(cartDoc.ref)));
  } catch (error: unknown) {
    throw new Error(getFirestoreErrorMessage(error));
  }
}

export {
  getUserFavorites,
  isUserFavorite,
  addUserFavorite,
  removeUserFavorite,
  toggleUserFavorite,
  getUserCart,
  addUserCartItem,
  updateUserCartItemQuantity,
  removeUserCartItem,
  clearUserCart,
};

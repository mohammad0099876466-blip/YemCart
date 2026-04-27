import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import { CartItem, Product, Review, OrderItem } from "./types";

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
    shippingPrice: Number(data.shippingPrice || 5),
    createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : undefined,
  };
}

function toReview(data: DocumentData, id: string): Review {
  return {
    id,
    productId: String(data.productId || ""),
    userId: String(data.userId || ""),
    userName: String(data.userName || "مجهول"),
    rating: Number(data.rating || 0),
    comment: String(data.comment || ""),
    createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now(),
  };
}

function favoritesCollection(userId: string) {
  return collection(ensureDb(), "favorites", userId, "items");
}

function cartCollection(userId: string) {
  return collection(ensureDb(), "cart", userId, "items");
}

function ordersCollection(userId: string) {
  return collection(ensureDb(), "orders", userId, "items");
}

function reviewsCollection(productId: string) {
  return collection(ensureDb(), "reviews", productId, "items");
}

async function getUserFavorites(userId: string): Promise<Product[]> {
  try {
    const snapshot = await getDocs(favoritesCollection(userId));
    return snapshot.docs.map((favoriteDoc) => toProduct(favoriteDoc.data() as DocumentData, favoriteDoc.id));
  } catch (error: unknown) {
    throw new Error(getFirestoreErrorMessage(error));
  }
}

async function isUserFavorite(userId: string, productId: string): Promise<boolean> {
  try {
    const favoriteRef = doc(favoritesCollection(userId), productId);
    const favoriteDoc = await getDoc(favoriteRef);
    return favoriteDoc.exists();
  } catch (error: unknown) {
    throw new Error(getFirestoreErrorMessage(error));
  }
}

async function toggleUserFavorite(userId: string, product: Product): Promise<boolean> {
  try {
    const favoriteRef = doc(favoritesCollection(userId), product.id);
    const favoriteDoc = await getDoc(favoriteRef);
    if (favoriteDoc.exists()) {
      await deleteDoc(favoriteRef);
      return false;
    }

    await setDoc(favoriteRef, {
      productId: product.id,
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
    const snapshot = await getDocs(cartCollection(userId));
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
    const cartRef = doc(cartCollection(userId), product.id);
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
        shippingPrice: product.shippingPrice ?? 5,
        createdAt: serverTimestamp(),
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
    const cartRef = doc(cartCollection(userId), productId);
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
    await deleteDoc(doc(cartCollection(userId), productId));
    return getUserCart(userId);
  } catch (error: unknown) {
    throw new Error(getFirestoreErrorMessage(error));
  }
}

async function clearUserCart(userId: string): Promise<void> {
  try {
    const snapshot = await getDocs(cartCollection(userId));
    const batch = writeBatch(ensureDb());
    snapshot.docs.forEach((docItem) => batch.delete(doc(cartCollection(userId), docItem.id)));
    await batch.commit();
  } catch (error: unknown) {
    throw new Error(getFirestoreErrorMessage(error));
  }
}

async function checkoutUserCart(userId: string): Promise<OrderItem[]> {
  try {
    const items = await getUserCart(userId);
    const batch = writeBatch(ensureDb());

    const createdAt = serverTimestamp();
    items.forEach((item) => {
      const orderRef = doc(ordersCollection(userId), item.product.id);
      batch.set(orderRef, {
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        imageUrl: item.product.imageUrl,
        category: item.product.category || "عام",
        totalPrice: item.product.price * item.quantity,
        createdAt,
      });
      batch.delete(doc(cartCollection(userId), item.product.id));
    });

    await batch.commit();
    return items.map((item) => ({
      id: item.product.id,
      product: item.product,
      quantity: item.quantity,
      totalPrice: item.quantity * item.product.price,
      createdAt: Date.now(),
    }));
  } catch (error: unknown) {
    throw new Error(getFirestoreErrorMessage(error));
  }
}

async function hasPurchasedProduct(userId: string, productId: string): Promise<boolean> {
  try {
    const orderRef = doc(ordersCollection(userId), productId);
    const orderDoc = await getDoc(orderRef);
    return orderDoc.exists();
  } catch (error: unknown) {
    throw new Error(getFirestoreErrorMessage(error));
  }
}

async function submitProductReview(userId: string, productId: string, userName: string, rating: number, comment: string): Promise<void> {
  try {
    const reviewRef = doc(reviewsCollection(productId), `${userId}-${Date.now()}`);
    await setDoc(reviewRef, {
      productId,
      userId,
      userName,
      rating,
      comment,
      createdAt: serverTimestamp(),
    });
  } catch (error: unknown) {
    throw new Error(getFirestoreErrorMessage(error));
  }
}

async function getProductReviews(productId: string): Promise<Review[]> {
  try {
    const snapshot = await getDocs(reviewsCollection(productId));
    return snapshot.docs.map((reviewDoc) => toReview(reviewDoc.data() as DocumentData, reviewDoc.id));
  } catch (error: unknown) {
    throw new Error(getFirestoreErrorMessage(error));
  }
}

async function getUserOrders(userId: string): Promise<OrderItem[]> {
  try {
    const snapshot = await getDocs(ordersCollection(userId));
    return snapshot.docs.map((orderDoc) => {
      const data = orderDoc.data() as DocumentData;
      return {
        id: orderDoc.id,
        product: toProduct(data, orderDoc.id),
        quantity: Number(data.quantity || 1),
        totalPrice: Number(data.totalPrice || 0),
        createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now(),
      };
    });
  } catch (error: unknown) {
    throw new Error(getFirestoreErrorMessage(error));
  }
}

export {
  getUserFavorites,
  isUserFavorite,
  toggleUserFavorite,
  getUserCart,
  addUserCartItem,
  updateUserCartItemQuantity,
  removeUserCartItem,
  clearUserCart,
  checkoutUserCart,
  hasPurchasedProduct,
  submitProductReview,
  getProductReviews,
  getUserOrders,
};

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { Product } from "./types";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

const isBrowser = typeof window !== "undefined";
const app = isBrowser && firebaseConfig.apiKey ? initializeApp(firebaseConfig) : undefined;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;

function ensureDb() {
  if (!db) {
    throw new Error("Firestore غير متاح.");
  }
  return db;
}

export const getUserFavorites = async (userId: string): Promise<Product[]> => {
  const snapshot = await getDocs(collection(ensureDb(), "favorites", userId, "items"));
  return snapshot.docs.map((favDoc) => {
    const data = favDoc.data() as Product;
    return {
      ...data,
      id: favDoc.id,
    };
  });
};

export const addUserFavorite = async (userId: string, product: any) => {
  const ref = doc(ensureDb(), "favorites", userId, "items", product.id);
  await setDoc(ref, product);
};

export const removeUserFavorite = async (userId: string, productId: string) => {
  const ref = doc(ensureDb(), "favorites", userId, "items", productId);
  await deleteDoc(ref);
};

export default app;

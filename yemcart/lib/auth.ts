"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, DocumentData, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { User } from "./types";

/**
 * Register a new user with email and password and save role to Firestore
 */
export async function registerUser(
  email: string,
  password: string,
  role: "buyer" | "seller" = "buyer"
): Promise<User> {
  if (!auth) {
    throw new Error("Firebase authentication is unavailable.");
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    const newUser: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || "",
      role,
      createdAt: new Date(),
      sellerVerified: role === "seller" ? false : undefined,
    };

    if (!db) {
      throw new Error("Firestore is unavailable.");
    }

    const userPayload = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      role,
      sellerVerified: role === "seller" ? false : undefined,
      createdAt: serverTimestamp(),
    };

    await Promise.all([
      setDoc(doc(db, "users_data", firebaseUser.uid), userPayload),
      setDoc(doc(db, "users", firebaseUser.uid), userPayload),
    ]);

    return newUser;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "خطأ أثناء التسجيل";
    console.error("Register error:", message);
    throw error;
  }
}

export async function getUserData(uid: string): Promise<User | null> {
  if (!db) {
    throw new Error("Firestore is unavailable.");
  }
  const docSnapshot = await getDoc(doc(db, "users_data", uid));
  let data: DocumentData | null = docSnapshot.exists() ? docSnapshot.data() : null;

  if (!data) {
    const fallbackSnapshot = await getDoc(doc(db, "users", uid));
    if (!fallbackSnapshot.exists()) {
      return null;
    }
    data = fallbackSnapshot.data();
  }

  return {
    uid: String(data.uid),
    email: String(data.email ?? ""),
    role: (data.role as User["role"]) || "buyer",
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
    displayName: data.displayName ? String(data.displayName) : undefined,
    sellerVerified: Boolean(data.sellerVerified),
    storeName: data.storeName ? String(data.storeName) : undefined,
    bankAccountName: data.bankAccountName ? String(data.bankAccountName) : undefined,
    storeLocation:
      data.storeLocation && typeof data.storeLocation === "object"
        ? {
            lat: Number(data.storeLocation.lat || 0),
            lng: Number(data.storeLocation.lng || 0),
          }
        : undefined,
  };
}

/**
 * Login user with email and password
 */
export async function loginUser(email: string, password: string): Promise<FirebaseUser> {
  if (!auth) {
    throw new Error("Firebase authentication is unavailable.");
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "خطأ أثناء تسجيل الدخول";
    console.error("Login error:", message);
    throw error;
  }
}

/**
 * Logout current user
 */
export async function logoutUser(): Promise<void> {
  if (!auth) {
    throw new Error("Firebase authentication is unavailable.");
  }

  try {
    await signOut(auth);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "خطأ أثناء تسجيل الخروج";
    console.error("Logout error:", message);
    throw error;
  }
}

/**
 * Get error message from Firebase error
 */
function isFirebaseError(error: unknown): error is { code?: string; message?: string } {
  return typeof error === "object" && error !== null && "code" in error;
}

export function getAuthErrorMessage(error: unknown): string {
  const errorCode = isFirebaseError(error) ? error.code ?? "" : "";
  const messages: Record<string, string> = {
    "auth/email-already-in-use": "البريد الإلكتروني مستخدم بالفعل",
    "auth/invalid-email": "البريد الإلكتروني غير صحيح",
    "auth/weak-password": "كلمة المرور ضعيفة جداً (يجب أن تكون 6 أحرف على الأقل)",
    "auth/user-not-found": "المستخدم غير موجود",
    "auth/wrong-password": "كلمة المرور غير صحيحة",
    "auth/operation-not-allowed": "يُحظر تسجيل المستخدمين حالياً",
    "auth/too-many-requests": "حاولت عدة مرات. حاول لاحقاً",
  };

  return messages[errorCode] || (isFirebaseError(error) ? error.message || "حدث خطأ ما" : "حدث خطأ ما");
}

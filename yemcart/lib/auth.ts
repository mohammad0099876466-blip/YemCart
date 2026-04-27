"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
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
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    const newUser: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || "",
      role,
      createdAt: new Date(),
    };

    await setDoc(doc(db, "users_data", firebaseUser.uid), {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      role,
      createdAt: serverTimestamp(),
    });

    return newUser;
  } catch (error: any) {
    console.error("Register error:", error.message);
    throw error;
  }
}

export async function getUserData(uid: string): Promise<User | null> {
  const docSnapshot = await getDoc(doc(db, "users_data", uid));
  let data = docSnapshot.exists() ? docSnapshot.data() as any : null;

  if (!data) {
    const fallbackSnapshot = await getDoc(doc(db, "users", uid));
    if (!fallbackSnapshot.exists()) {
      return null;
    }
    data = fallbackSnapshot.data() as any;
  }

  return {
    uid: data.uid,
    email: data.email,
    role: data.role || "buyer",
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
  };
}

/**
 * Login user with email and password
 */
export async function loginUser(email: string, password: string): Promise<FirebaseUser> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error("Login error:", error.message);
    throw error;
  }
}

/**
 * Logout current user
 */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error("Logout error:", error.message);
    throw error;
  }
}

/**
 * Get error message from Firebase error
 */
export function getAuthErrorMessage(error: any): string {
  const errorCode = error.code || "";
  const messages: Record<string, string> = {
    "auth/email-already-in-use": "البريد الإلكتروني مستخدم بالفعل",
    "auth/invalid-email": "البريد الإلكتروني غير صحيح",
    "auth/weak-password": "كلمة المرور ضعيفة جداً (يجب أن تكون 6 أحرف على الأقل)",
    "auth/user-not-found": "المستخدم غير موجود",
    "auth/wrong-password": "كلمة المرور غير صحيحة",
    "auth/operation-not-allowed": "يُحظر تسجيل المستخدمين حالياً",
    "auth/too-many-requests": "حاولت عدة مرات. حاول لاحقاً",
  };

  return messages[errorCode] || error.message || "حدث خطأ ما";
}

"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { User } from "./types";

/**
 * Register a new user with email and password
 */
export async function registerUser(email: string, password: string): Promise<User> {
  try {
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Save user to Firestore
    const newUser: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || "",
      role: "buyer",
      createdAt: new Date(),
    };

    await setDoc(doc(db, "users", firebaseUser.uid), {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      role: "buyer",
      createdAt: new Date().toISOString(),
    });

    return newUser;
  } catch (error: any) {
    console.error("Register error:", error.message);
    throw error;
  }
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

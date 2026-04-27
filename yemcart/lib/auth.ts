"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";
import {
  doc,
  DocumentData,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { User } from "./types";

export interface SellerRegistrationPayload {
  displayName: string;
  phoneNumber?: string;
  bankAccountName: string;
  idImageUrl: string;
  storeName: string;
  storeDescription?: string;
  storeLocation: {
    lat: number;
    lng: number;
  };
  profileImageUrl?: string;
  bannerImageUrl?: string;
  sampleProductImages: string[];
  bio?: string;
}

function isFirebaseError(error: unknown): error is { code?: string; message?: string } {
  return typeof error === "object" && error !== null && "code" in error;
}

function formatAuthErrorMessage(error: unknown): string {
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

export async function registerUser(
  email: string,
  password: string,
  role: "buyer" | "seller" = "buyer",
  profile?: Partial<SellerRegistrationPayload>
): Promise<User> {
  if (!auth) {
    throw new Error("Firebase authentication is unavailable.");
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    if (!db) {
      throw new Error("Firestore is unavailable.");
    }

    const basePayload = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      role,
      createdAt: serverTimestamp(),
      sellerVerified: role === "seller" ? false : false,
      displayName: profile?.displayName || "",
      phoneNumber: profile?.phoneNumber || "",
      bankAccountName: profile?.bankAccountName || "",
      idImageUrl: profile?.idImageUrl || "",
      storeName: profile?.storeName || "",
      storeDescription: profile?.storeDescription || "",
      storeLocation: profile?.storeLocation || null,
      profileImageUrl: profile?.profileImageUrl || "",
      bannerImageUrl: profile?.bannerImageUrl || "",
      sampleProductImages: profile?.sampleProductImages || [],
      bio: profile?.bio || "",
    };

    if (role === "seller") {
      if (!profile?.displayName || !profile?.bankAccountName || !profile?.idImageUrl || !profile?.storeLocation || !profile?.storeName || !profile?.sampleProductImages || profile.sampleProductImages.length < 3) {
        throw new Error("جميع بيانات البائع مطلوبة ويجب أن تتضمن 3 صور منتجات على الأقل.");
      }
    }

    await Promise.all([
      setDoc(doc(db, "users", firebaseUser.uid), basePayload),
      setDoc(doc(db, "users_data", firebaseUser.uid), basePayload),
    ]);

    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email || "",
      role,
      createdAt: new Date(),
      displayName: profile?.displayName || undefined,
      phoneNumber: profile?.phoneNumber,
      bankAccountName: profile?.bankAccountName,
      idImageUrl: profile?.idImageUrl,
      storeName: profile?.storeName,
      storeDescription: profile?.storeDescription,
      storeLocation: profile?.storeLocation,
      profileImageUrl: profile?.profileImageUrl,
      bannerImageUrl: profile?.bannerImageUrl,
      sampleProductImages: profile?.sampleProductImages,
      bio: profile?.bio,
      sellerVerified: role === "seller" ? false : undefined,
    };
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

  const docSnapshot = await getDoc(doc(db, "users", uid));
  if (!docSnapshot.exists()) {
    return null;
  }

  const data = docSnapshot.data() as DocumentData;

  return {
    uid: String(data.uid || uid),
    email: String(data.email ?? ""),
    role: (data.role as User["role"]) || "buyer",
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
    displayName: data.displayName ? String(data.displayName) : undefined,
    phoneNumber: data.phoneNumber ? String(data.phoneNumber) : undefined,
    bio: data.bio ? String(data.bio) : undefined,
    profileImageUrl: data.profileImageUrl ? String(data.profileImageUrl) : undefined,
    bannerImageUrl: data.bannerImageUrl ? String(data.bannerImageUrl) : undefined,
    bankAccountName: data.bankAccountName ? String(data.bankAccountName) : undefined,
    idImageUrl: data.idImageUrl ? String(data.idImageUrl) : undefined,
    storeName: data.storeName ? String(data.storeName) : undefined,
    storeDescription: data.storeDescription ? String(data.storeDescription) : undefined,
    storeLocation:
      data.storeLocation && typeof data.storeLocation === "object"
        ? {
            lat: Number(data.storeLocation.lat || 0),
            lng: Number(data.storeLocation.lng || 0),
          }
        : undefined,
    sampleProductImages: Array.isArray(data.sampleProductImages) ? data.sampleProductImages.map(String) : undefined,
    sellerVerified: Boolean(data.sellerVerified),
    followersCount: Number(data.followersCount || 0),
  };
}

export async function updateUserData(uid: string, updates: Partial<User>): Promise<void> {
  if (!db) {
    throw new Error("Firestore is unavailable.");
  }

  const userRef = doc(db, "users", uid);
  const userDataRef = doc(db, "users_data", uid);

  await Promise.all([updateDoc(userRef, updates), updateDoc(userDataRef, updates)]);
}

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

export function getAuthErrorMessage(error: unknown): string {
  return formatAuthErrorMessage(error);
}

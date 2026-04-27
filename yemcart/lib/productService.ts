import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Banner, Category, Product, User } from "@/lib/types";

const defaultCategories: Category[] = [
  { id: "fashion", name: "أزياء", icon: "أزياء" },
  { id: "beauty", name: "جمال", icon: "جمال" },
  { id: "electronics", name: "إلكترونيات", icon: "إلكترونيات" },
  { id: "home", name: "ديكور", icon: "ديكور" },
  { id: "bags", name: "حقائب", icon: "حقائب" },
  { id: "shoes", name: "أحذية", icon: "أحذية" },
];

const defaultBanner: Banner = {
  id: "hero-banner",
  title: "خصومات الموسم",
  subtitle: "احصلي على القطع المفضلة بأسعار مميزة الآن!",
  active: true,
  imageUrl: "",
};

export async function uploadProductImage(file: File) {
  if (!storage) {
    throw new Error("Firebase storage is unavailable.");
  }

  const imageRef = ref(storage, `images/${Date.now()}-${file.name}`);
  await uploadBytes(imageRef, file);
  const imageUrl = await getDownloadURL(imageRef);
  return {
    imageUrl,
    imagePath: imageRef.fullPath,
  };
}

export async function addProductItem(product: {
  name: string;
  price: number;
  imageUrl: string;
  userId: string;
  description?: string;
  category?: string;
  featured?: boolean;
  published?: boolean;
  shippingPrice?: number;
}) {
  if (!db) {
    throw new Error("Firestore is unavailable.");
  }

  await addDoc(collection(db, "products"), {
    name: product.name,
    price: product.price,
    description: product.description || "",
    category: product.category || "عام",
    imageUrl: product.imageUrl,
    imagePath: product.imageUrl,
    userId: product.userId,
    featured: product.featured ?? false,
    published: product.published ?? true,
    shippingPrice: product.shippingPrice ?? 5,
    createdAt: serverTimestamp(),
  });
}

export async function getCategories(): Promise<Category[]> {
  if (!db) {
    return defaultCategories;
  }

  try {
    const categoryQuery = query(collection(db, "categories"));
    const snapshot = await getDocs(categoryQuery);

    if (snapshot.empty) {
      return defaultCategories;
    }

    return snapshot.docs.map((doc) => {
      const data = doc.data() as DocumentData;
      return {
        id: doc.id,
        name: data.name || "عام",
        icon: data.icon || "🛍️",
      };
    });
  } catch {
    return defaultCategories;
  }
}

export async function getActiveBanner(): Promise<Banner | null> {
  if (!db) {
    return defaultBanner;
  }

  try {
    const bannerQuery = query(collection(db, "banners"), where("active", "==", true), orderBy("title"), limit(1));
    const snapshot = await getDocs(bannerQuery);
    if (snapshot.empty) {
      return defaultBanner;
    }
    const bannerDoc = snapshot.docs[0];
    const data = bannerDoc.data() as DocumentData;
    return {
      id: bannerDoc.id,
      title: data.title || defaultBanner.title,
      subtitle: data.subtitle || defaultBanner.subtitle,
      active: data.active ?? true,
      imageUrl: data.imageUrl || defaultBanner.imageUrl,
    };
  } catch {
    return defaultBanner;
  }
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
    updatedAt: data.updatedAt?.toMillis ? data.updatedAt.toMillis() : undefined,
  };
}

export async function getProducts(): Promise<Product[]> {
  if (!db) {
    throw new Error("Firestore is unavailable.");
  }

  const productsQuery = query(collection(db, "products"), where("published", "==", true), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(productsQuery);
  return snapshot.docs.map((doc) => toProduct(doc.data() as DocumentData, doc.id));
}

export async function searchProducts(
  searchText: string,
  category?: string,
  minPrice?: number,
  maxPrice?: number,
  minRating?: number
): Promise<Product[]> {
  const items = await getProducts();
  const term = searchText.trim().toLowerCase();

  return items.filter((product) => {
    const matchesText =
      !term ||
      product.name.toLowerCase().includes(term) ||
      product.description?.toLowerCase().includes(term) ||
      product.category?.toLowerCase().includes(term);

    const matchesCategory = !category || category === "الكل" || product.category === category;
    const matchesPrice =
      (minPrice === undefined || product.price >= minPrice) &&
      (maxPrice === undefined || product.price <= maxPrice);

    return matchesText && matchesCategory && matchesPrice;
  });
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!db) {
    throw new Error("Firestore is unavailable.");
  }

  const productDoc = await getDoc(doc(db, "products", id));
  if (!productDoc.exists()) {
    return null;
  }

  return toProduct(productDoc.data() as DocumentData, productDoc.id);
}

export async function getSellerById(id: string): Promise<User | null> {
  if (!db) {
    throw new Error("Firestore is unavailable.");
  }

  const sellerDoc = await getDoc(doc(db, "users", id));
  if (!sellerDoc.exists()) {
    return null;
  }

  const data = sellerDoc.data() as DocumentData;
  return {
    uid: String(data.uid || id),
    email: String(data.email || ""),
    role: (data.role as User["role"]) || "buyer",
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
    displayName: data.displayName ? String(data.displayName) : undefined,
    phoneNumber: data.phoneNumber ? String(data.phoneNumber) : undefined,
    bio: data.bio ? String(data.bio) : undefined,
    profileImageUrl: data.profileImageUrl ? String(data.profileImageUrl) : undefined,
    bannerImageUrl: data.bannerImageUrl ? String(data.bannerImageUrl) : undefined,
    bankAccountName: data.bankAccountName ? String(data.bankAccountName) : undefined,
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

export async function getSellerProducts(userId: string): Promise<Product[]> {
  if (!db) {
    throw new Error("Firestore is unavailable.");
  }

  const productsQuery = query(collection(db, "products"), where("userId", "==", userId), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(productsQuery);
  return snapshot.docs.map((doc) => toProduct(doc.data() as DocumentData, doc.id));
}

export const getUserProducts = getSellerProducts;

export async function getFeaturedProducts(): Promise<Product[]> {
  if (!db) {
    throw new Error("Firestore is unavailable.");
  }

  const productsQuery = query(collection(db, "products"), where("published", "==", true), where("featured", "==", true), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(productsQuery);
  return snapshot.docs.map((doc) => toProduct(doc.data() as DocumentData, doc.id));
}

export async function getTopSellers(): Promise<User[]> {
  if (!db) {
    throw new Error("Firestore is unavailable.");
  }

  const sellersQuery = query(collection(db, "users"), where("role", "==", "seller"));
  const snapshot = await getDocs(sellersQuery);
  return snapshot.docs.map((sellerDoc) => {
    const data = sellerDoc.data() as DocumentData;
    return {
      uid: sellerDoc.id,
      email: String(data.email ?? ""),
      role: "seller",
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
      displayName: data.displayName ? String(data.displayName) : undefined,
      profileImageUrl: data.profileImageUrl ? String(data.profileImageUrl) : undefined,
      bannerImageUrl: data.bannerImageUrl ? String(data.bannerImageUrl) : undefined,
      storeName: data.storeName ? String(data.storeName) : undefined,
      storeDescription: data.storeDescription ? String(data.storeDescription) : undefined,
      sellerVerified: Boolean(data.sellerVerified),
      followersCount: Number(data.followersCount || 0),
    };
  });
}

export async function updateProduct(
  id: string,
  values: {
    name: string;
    price: number;
    description: string;
    imageFile?: File;
    currentImagePath?: string;
  }
) {
  if (!db) {
    throw new Error("Firestore is unavailable.");
  }

  const productRef = doc(db, "products", id);
  const updateData: Record<string, unknown> = {
    name: values.name,
    price: values.price,
    description: values.description,
  };

  if (values.imageFile) {
    const { imageUrl, imagePath } = await uploadProductImage(values.imageFile);
    updateData.imageUrl = imageUrl;
    updateData.imagePath = imagePath;

    if (values.currentImagePath) {
      await deleteProductImage(values.currentImagePath);
    }
  }

  updateData.updatedAt = serverTimestamp();
  await updateDoc(productRef, updateData);
}

export async function deleteProduct(id: string, imagePath?: string) {
  if (!db) {
    throw new Error("Firestore is unavailable.");
  }

  if (imagePath) {
    await deleteProductImage(imagePath);
  }

  await deleteDoc(doc(db, "products", id));
}

export async function deleteProductImage(imagePath: string) {
  if (!storage) {
    throw new Error("Firebase storage is unavailable.");
  }

  try {
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "code" in error && (error as { code?: string }).code === "storage/object-not-found") {
      return;
    }
    throw error;
  }
}

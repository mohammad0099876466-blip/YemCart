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
import { Banner, Category, Product } from "@/lib/types";

const defaultCategories: Category[] = [
  { id: "fashion", name: "أزياء", icon: "👗" },
  { id: "beauty", name: "جمال", icon: "💄" },
  { id: "electronics", name: "إلكترونيات", icon: "📱" },
  { id: "home", name: "ديكور", icon: "🛋️" },
  { id: "bags", name: "حقائب", icon: "👜" },
  { id: "shoes", name: "أحذية", icon: "👟" },
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

  const imageRef = ref(storage, `products/${Date.now()}-${file.name}`);
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
    image: product.imageUrl,
    userId: product.userId,
    featured: product.featured ?? false,
    published: product.published ?? true,
    createdAt: serverTimestamp(),
  });
}

export async function getCategories(): Promise<Category[]> {
  try {
    if (!db) {
      throw new Error("Firestore is unavailable.");
    }

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
      } as Category;
    });
  } catch {
    return defaultCategories;
  }
}

export async function getActiveBanner(): Promise<Banner | null> {
  try {
    if (!db) {
      throw new Error("Firestore is unavailable.");
    }

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

export async function getProducts(): Promise<Product[]> {
  if (!db) {
    throw new Error("Firestore is unavailable.");
  }

  try {
    const productsQuery = query(
      collection(db, "products"),
      where("published", "==", true),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(productsQuery);
    return snapshot.docs.map((doc) => {
      const data = doc.data() as DocumentData;
      return {
        id: doc.id,
        name: data.name,
        price: data.price,
        description: data.description,
        imageUrl: data.imageUrl,
        imagePath: data.imagePath,
        userId: data.userId,
        category: data.category,
        featured: data.featured,
        published: data.published,
        createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : undefined,
      } as Product;
    });
  } catch {
    const fallbackQuery = query(collection(db, "products"), where("published", "==", true));
    const snapshot = await getDocs(fallbackQuery);
    return snapshot.docs.map((doc) => {
      const data = doc.data() as DocumentData;
      return {
        id: doc.id,
        name: data.name,
        price: data.price,
        description: data.description,
        imageUrl: data.imageUrl,
        imagePath: data.imagePath,
        userId: data.userId,
        category: data.category,
        featured: data.featured,
        published: data.published,
        createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : undefined,
      } as Product;
    });
  }
}

export async function getUserProducts(userId: string): Promise<Product[]> {
  if (!db) {
    throw new Error("Firestore is unavailable.");
  }

  const productsQuery = query(
    collection(db, "products"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(productsQuery);

  return snapshot.docs.map((doc) => {
    const data = doc.data() as DocumentData;
    return {
      id: doc.id,
      name: data.name,
      price: data.price,
      description: data.description,
      imageUrl: data.imageUrl,
      imagePath: data.imagePath,
      userId: data.userId,
      category: data.category,
      featured: data.featured,
      published: data.published,
      createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : undefined,
    } as Product;
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

  const data = productDoc.data() as DocumentData;

  return {
    id: productDoc.id,
    name: data.name,
    price: data.price,
    description: data.description,
    imageUrl: data.imageUrl,
    imagePath: data.imagePath,
    userId: data.userId,
    category: data.category,
    featured: data.featured,
    published: data.published,
    createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : undefined,
  };
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

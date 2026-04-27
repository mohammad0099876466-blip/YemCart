import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
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
import { Product } from "@/lib/types";

export async function uploadProductImage(file: File) {
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
  published?: boolean;
}) {
  await addDoc(collection(db, "products"), {
    name: product.name,
    price: product.price,
    description: product.description || "",
    imageUrl: product.imageUrl,
    image: product.imageUrl,
    userId: product.userId,
    published: product.published ?? true,
    createdAt: serverTimestamp(),
  });
}

export async function getProducts(): Promise<Product[]> {
  const productsQuery = query(
    collection(db, "products"),
    where("published", "==", true),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(productsQuery);

  return snapshot.docs.map((doc) => {
    const data = doc.data() as any;
    return {
      id: doc.id,
      name: data.name,
      price: data.price,
      description: data.description,
      imageUrl: data.imageUrl,
      imagePath: data.imagePath,
      userId: data.userId,
      published: data.published,
      createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : undefined,
    } as Product;
  });
}

export async function getUserProducts(userId: string): Promise<Product[]> {
  const productsQuery = query(
    collection(db, "products"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(productsQuery);

  return snapshot.docs.map((doc) => {
    const data = doc.data() as any;
    return {
      id: doc.id,
      name: data.name,
      price: data.price,
      description: data.description,
      imageUrl: data.imageUrl,
      imagePath: data.imagePath,
      userId: data.userId,
      published: data.published,
      createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : undefined,
    } as Product;
  });
}

export async function getProductById(id: string): Promise<Product | null> {
  const productDoc = await getDoc(doc(db, "products", id));

  if (!productDoc.exists()) {
    return null;
  }

  const data = productDoc.data() as any;

  return {
    id: productDoc.id,
    name: data.name,
    price: data.price,
    description: data.description,
    imageUrl: data.imageUrl,
    imagePath: data.imagePath,
    userId: data.userId,
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
  const productRef = doc(db, "products", id);
  const updateData: any = {
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
  if (imagePath) {
    await deleteProductImage(imagePath);
  }

  await deleteDoc(doc(db, "products", id));
}

export async function deleteProductImage(imagePath: string) {
  try {
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
  } catch (error: any) {
    if (error.code !== "storage/object-not-found") {
      throw error;
    }
  }
}

export interface User {
  uid: string;
  email: string;
  role: "buyer" | "seller" | "admin";
  createdAt: Date;
  displayName?: string;
  sellerVerified?: boolean;
  storeName?: string;
  storeLocation?: {
    lat: number;
    lng: number;
  };
  bankAccountName?: string;
}

export interface SellerInfo {
  email: string;
  role: "buyer" | "seller" | "admin";
}

export interface Product {
  id: string;
  name: string;
  title?: string;
  price: number;
  description?: string;
  imageUrl: string;
  image?: string;
  imagePath?: string;
  userId?: string;
  sellerId?: string;
  category?: string;
  featured?: boolean;
  published?: boolean;
  createdAt?: number;
  updatedAt?: number;
  sellerEmail?: string;
  sellerRole?: "buyer" | "seller" | "admin";
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  active: boolean;
  imageUrl?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  logout: () => Promise<void>;
}

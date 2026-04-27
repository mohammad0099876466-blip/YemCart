export interface User {
  uid: string;
  email: string;
  role: "buyer" | "seller" | "admin";
  createdAt: Date;
}

export interface SellerInfo {
  email: string;
  role: "buyer" | "seller" | "admin";
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl: string;
  title?: string;
  image?: string;
  imagePath?: string;
  userId?: string;
  sellerId?: string;
  published?: boolean;
  createdAt?: number;
  updatedAt?: number;
  sellerEmail?: string;
  sellerRole?: "buyer" | "seller" | "admin";
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  logout: () => Promise<void>;
}

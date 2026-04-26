export interface User {
  uid: string;
  email: string;
  role: "buyer" | "seller" | "admin";
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl: string;
  imagePath?: string;
  createdAt?: number;
  updatedAt?: number;
  title?: string;
  sellerId?: string;
  image?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  logout: () => Promise<void>;
}

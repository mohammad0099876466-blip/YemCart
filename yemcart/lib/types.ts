export interface User {
  uid: string;
  email: string;
  role: "buyer" | "seller";
  createdAt: Date;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  description?: string;
  sellerId?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  logout: () => Promise<void>;
}

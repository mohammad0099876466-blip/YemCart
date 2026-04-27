export interface User {
  uid: string;
  email: string;
  role: "buyer" | "seller" | "admin";
  createdAt: Date;
  displayName?: string;
  phoneNumber?: string;
  bio?: string;
  profileImageUrl?: string;
  bannerImageUrl?: string;
  bankAccountName?: string;
  idImageUrl?: string;
  storeName?: string;
  storeDescription?: string;
  storeLocation?: {
    lat: number;
    lng: number;
  };
  sampleProductImages?: string[];
  sellerVerified?: boolean;
  followersCount?: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl: string;
  imagePath?: string;
  userId?: string;
  category?: string;
  featured?: boolean;
  published?: boolean;
  shippingPrice?: number;
  createdAt?: number;
  updatedAt?: number;
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

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: number;
}

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  totalPrice: number;
  createdAt: number;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (value: boolean) => void;
  activeCategory: string;
  setActiveCategory: (value: string) => void;
  ratingFilter: number;
  setRatingFilter: (value: number) => void;
  priceFilter: { min: number; max: number };
  setPriceFilter: (value: { min: number; max: number }) => void;
}

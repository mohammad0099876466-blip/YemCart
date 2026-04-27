import { CartItem, Product } from "./types";

const FAVORITES_KEY = "yemcart_favorites";
const CART_KEY = "yemcart_cart";

function safeParse<T>(value: string | null, fallback: T): T {
  try {
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function getFavorites(): Product[] {
  if (typeof window === "undefined") return [];
  return safeParse<Product[]>(window.localStorage.getItem(FAVORITES_KEY), []);
}

export function saveFavorites(products: Product[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(products));
}

export function isFavorite(productId: string) {
  return getFavorites().some((item) => item.id === productId);
}

export function toggleFavorite(product: Product): Product[] {
  const current = getFavorites();
  const exists = current.some((item) => item.id === product.id);
  const updated = exists ? current.filter((item) => item.id !== product.id) : [...current, product];
  saveFavorites(updated);
  return updated;
}

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  return safeParse<CartItem[]>(window.localStorage.getItem(CART_KEY), []);
}

export function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(product: Product): CartItem[] {
  const current = getCart();
  const existing = current.find((item) => item.product.id === product.id);
  let updated: CartItem[];

  if (existing) {
    updated = current.map((item) =>
      item.product.id === product.id
        ? { ...item, quantity: Math.min(item.quantity + 1, 10) }
        : item
    );
  } else {
    updated = [...current, { product, quantity: 1 }];
  }

  saveCart(updated);
  return updated;
}

export function removeFromCart(productId: string): CartItem[] {
  const current = getCart();
  const updated = current.filter((item) => item.product.id !== productId);
  saveCart(updated);
  return updated;
}

export function updateCartQuantity(productId: string, quantity: number): CartItem[] {
  const current = getCart();
  const updated = current
    .map((item) =>
      item.product.id === productId
        ? { ...item, quantity: Math.max(1, Math.min(quantity, 10)) }
        : item
    )
    .filter((item) => item.quantity > 0);
  saveCart(updated);
  return updated;
}

export function clearCart(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CART_KEY);
}

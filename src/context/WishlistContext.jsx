/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/**
 * Favourites / wishlist state, persisted to localStorage.
 *
 * There are no customer accounts yet, so favourites live in the browser. The
 * shape mirrors a product so the cards can render straight from the store.
 */
const STORAGE_KEY = "happyshop.wishlist";

const WishlistContext = createContext(null);

function readStoredWishlist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function toWishlistItem(product) {
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    price: Number(product.price),
    old_price: product.old_price != null ? Number(product.old_price) : null,
    image: product.image,
    stock: Number.isFinite(Number(product.stock)) ? Number(product.stock) : 99,
    category: product.category ?? null,
    rating: product.rating ?? 0,
    review_count: product.review_count ?? 0,
    featured: Boolean(product.featured),
  };
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(readStoredWishlist);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable — ignore */
    }
  }, [items]);

  const has = useCallback(
    (id) => items.some((item) => item.id === id),
    [items]
  );

  /** Toggle a product; returns true when it was added, false when removed. */
  const toggle = useCallback(
    (product) => {
      const exists = items.some((item) => item.id === product.id);

      setItems((prev) =>
        prev.some((item) => item.id === product.id)
          ? prev.filter((item) => item.id !== product.id)
          : [...prev, toWishlistItem(product)]
      );

      return !exists;
    },
    [items]
  );

  const remove = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({ items, count: items.length, has, toggle, remove, clear }),
    [items, has, toggle, remove, clear]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used inside a <WishlistProvider>.");
  }
  return context;
}

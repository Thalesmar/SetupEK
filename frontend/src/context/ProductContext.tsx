/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext, useCallback, type ReactNode } from 'react';
import type { Product } from '../types';
import { API_BASE_URL } from '../config';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
}

export const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProductContext = (): ProductContextType => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProductContext must be used inside <ProductProvider>');
  return ctx;
};

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setProducts(data.products || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, [fetchProducts]);

  return (
    <ProductContext.Provider value={{ products, loading, error, refreshProducts: fetchProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

import { useState, useEffect } from 'react';
import { Product, ProductCategory } from '@/types';
import { ProductService } from '@/api/services';

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: Error | null;
}

/**
 * Hook para gerenciar produtos
 */
export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await ProductService.getAll();

        if (isMounted) {
          setProducts(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Erro ao carregar produtos'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return { products, loading, error };
};

/**
 * Hook para filtrar produtos
 */
export const useProductFilter = (category: ProductCategory, searchQuery: string) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const filterProducts = async () => {
      try {
        setLoading(true);
        const data = await ProductService.filter(category, searchQuery);

        if (isMounted) {
          setFilteredProducts(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Erro ao filtrar produtos'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    filterProducts();

    return () => {
      isMounted = false;
    };
  }, [category, searchQuery]);

  return { products: filteredProducts, loading, error };
};

/**
 * Hook para buscar produto por slug
 */
export const useProduct = (slug: string | undefined) => {
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await ProductService.getBySlug(slug);

        if (isMounted) {
          setProduct(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Erro ao carregar produto'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  return { product, loading, error };
};

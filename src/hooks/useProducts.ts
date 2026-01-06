import { useQuery } from '@tanstack/react-query';
import { ProductService } from '@/api/services/product.service';
import type { Product, ProductCategory } from '@/types';

/**
 * Hook para buscar todos os produtos
 */
export function useProducts() {
  const query = useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: () => ProductService.getAll(),
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
  });

  return {
    products: query.data || [],
    loading: query.isLoading,
    error: query.error,
    isError: query.isError,
    refetch: query.refetch,
  };
}

/**
 * Hook para buscar produto por slug
 */
export function useProduct(slug: string | undefined) {
  const query = useQuery<Product | undefined, Error>({
    queryKey: ['product', slug],
    queryFn: () => ProductService.getBySlug(slug!),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  return {
    product: query.data,
    loading: query.isLoading,
    error: query.error,
    isError: query.isError,
    refetch: query.refetch,
  };
}

/**
 * Hook para filtrar produtos
 */
export function useProductFilter(category: ProductCategory, searchQuery: string) {
  const query = useQuery<Product[], Error>({
    queryKey: ['products', 'filter', category, searchQuery],
    queryFn: () => ProductService.filter(category, searchQuery),
    staleTime: 1000 * 60 * 2, // 2 minutos para filtros
    gcTime: 1000 * 60 * 5,
  });

  return {
    products: query.data || [],
    loading: query.isLoading,
    error: query.error,
    isError: query.isError,
    refetch: query.refetch,
  };
}

/**
 * Hook para buscar produto por ID
 */
export function useProductById(id: string) {
  const query = useQuery<Product | undefined, Error>({
    queryKey: ['product', id],
    queryFn: () => ProductService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  return {
    product: query.data,
    loading: query.isLoading,
    error: query.error,
    isError: query.isError,
    refetch: query.refetch,
  };
}

/**
 * Hook para buscar produtos por categoria
 */
export function useProductsByCategory(category: ProductCategory) {
  const query = useQuery<Product[], Error>({
    queryKey: ['products', 'category', category],
    queryFn: () => ProductService.getByCategory(category),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  return {
    products: query.data || [],
    loading: query.isLoading,
    error: query.error,
    isError: query.isError,
    refetch: query.refetch,
  };
}

/**
 * Hook para buscar produtos relacionados
 */
export function useRelatedProducts(productId: string, limit: number = 4) {
  const query = useQuery<Product[], Error>({
    queryKey: ['products', 'related', productId, limit],
    queryFn: () => ProductService.getRelated(productId, limit),
    enabled: !!productId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  return {
    products: query.data || [],
    loading: query.isLoading,
    error: query.error,
    isError: query.isError,
    refetch: query.refetch,
  };
}

/**
 * Hook para buscar categorias
 */
export function useCategories() {
  const query = useQuery<string[], Error>({
    queryKey: ['categories'],
    queryFn: () => ProductService.getCategories(),
    staleTime: 1000 * 60 * 30, // 30 minutos
    gcTime: 1000 * 60 * 60, // 1 hora
  });

  return {
    categories: query.data || [],
    loading: query.isLoading,
    error: query.error,
    isError: query.isError,
    refetch: query.refetch,
  };
}

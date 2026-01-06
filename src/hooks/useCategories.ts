import { useQuery } from '@tanstack/react-query';
import { CategoryService, type Category } from '@/api/services/category.service';

/**
 * Hook para buscar todas as categorias ativas
 */
export function useCategories() {
  const query = useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: () => CategoryService.getAll(),
    staleTime: 1000 * 60 * 30, // 30 minutos (categorias mudam raramente)
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

/**
 * Hook para buscar categoria por slug
 */
export function useCategoryBySlug(slug: string) {
  const query = useQuery<Category | undefined, Error>({
    queryKey: ['category', slug],
    queryFn: () => CategoryService.getBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });

  return {
    category: query.data,
    loading: query.isLoading,
    error: query.error,
    isError: query.isError,
    refetch: query.refetch,
  };
}

/**
 * Hook para buscar categoria por ID
 */
export function useCategoryById(id: string) {
  const query = useQuery<Category | undefined, Error>({
    queryKey: ['category', id],
    queryFn: () => CategoryService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });

  return {
    category: query.data,
    loading: query.isLoading,
    error: query.error,
    isError: query.isError,
    refetch: query.refetch,
  };
}

import type { Product } from '@/types';
import type { Database } from '@/types/database.types';

type SupabaseProduct = Database['public']['Tables']['products']['Row'];

export interface ProductWithTags extends SupabaseProduct {
  tags?: string[];
}

/**
 * Converte produto do Supabase para o formato da aplicação
 */
export function adaptSupabaseProduct(
  supabaseProduct: SupabaseProduct | ProductWithTags,
  tags: string[] = []
): Product {
  // Se o produto já tem tags (vindo da query com JOIN), usa elas
  const productTags = 'tags' in supabaseProduct && supabaseProduct.tags
    ? supabaseProduct.tags
    : tags;

  return {
    id: supabaseProduct.id,
    slug: supabaseProduct.slug,
    name: supabaseProduct.name,
    category: supabaseProduct.category_slug, // Mapeia category_slug para category
    price: supabaseProduct.price,
    unit: supabaseProduct.unit,
    image: supabaseProduct.image,
    description: supabaseProduct.description,
    tags: productTags,
    available: supabaseProduct.available,
  };
}

/**
 * Converte array de produtos do Supabase
 */
export function adaptSupabaseProducts(supabaseProducts: (SupabaseProduct | ProductWithTags)[]): Product[] {
  return supabaseProducts.map(p => adaptSupabaseProduct(p));
}

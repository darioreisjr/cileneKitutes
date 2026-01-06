import { Product, ProductCategory } from '@/types';
import { supabase } from '@/lib/supabase';
import { adaptSupabaseProducts, adaptSupabaseProduct, type ProductWithTags } from '@/lib/product-adapter';

/**
 * Helper para buscar tags de produtos
 */
async function fetchProductTags(productIds: string[]): Promise<Map<string, string[]>> {
  if (productIds.length === 0) return new Map();

  const { data, error } = await supabase
    .from('product_tags')
    .select('product_id, tag_slug')
    .in('product_id', productIds);

  if (error) {
    console.error('Error fetching product tags:', error);
    return new Map();
  }

  const tagsMap = new Map<string, string[]>();
  data?.forEach((pt: any) => {
    const existing = tagsMap.get(pt.product_id) || [];
    existing.push(pt.tag_slug);
    tagsMap.set(pt.product_id, existing);
  });

  return tagsMap;
}

/**
 * Helper para adicionar tags aos produtos
 */
async function addTagsToProducts(products: any[]): Promise<ProductWithTags[]> {
  if (products.length === 0) return [];

  const productIds = products.map(p => p.id);
  const tagsMap = await fetchProductTags(productIds);

  return products.map(product => ({
    ...product,
    tags: tagsMap.get(product.id) || [],
  }));
}

/**
 * Serviço para gerenciar operações relacionadas a produtos
 */
export class ProductService {
  /**
   * Retorna todos os produtos disponíveis
   */
  static async getAll(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error('Erro ao carregar produtos do banco de dados');
      }

      if (!data || data.length === 0) {
        return [];
      }

      const productsWithTags = await addTagsToProducts(data);
      return adaptSupabaseProducts(productsWithTags);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Erro ao carregar produtos');
    }
  }

  /**
   * Busca um produto específico pelo slug
   */
  static async getBySlug(slug: string): Promise<Product | undefined> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Not found
          return undefined;
        }
        console.error('Supabase error:', error);
        throw new Error('Erro ao carregar produto');
      }

      if (!data) {
        return undefined;
      }

      // Buscar tags do produto
      const tagsMap = await fetchProductTags([(data as any).id]);
      const productWithTags: ProductWithTags = {
        ...(data as any),
        tags: tagsMap.get((data as any).id) || [],
      };

      return adaptSupabaseProduct(productWithTags);
    } catch (error) {
      console.error('Error fetching product by slug:', error);
      throw new Error('Erro ao carregar produto');
    }
  }

  /**
   * Busca um produto específico pelo ID
   */
  static async getById(id: string): Promise<Product | undefined> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Not found
          return undefined;
        }
        console.error('Supabase error:', error);
        throw new Error('Erro ao carregar produto');
      }

      if (!data) {
        return undefined;
      }

      // Buscar tags do produto
      const tagsMap = await fetchProductTags([(data as any).id]);
      const productWithTags: ProductWithTags = {
        ...(data as any),
        tags: tagsMap.get((data as any).id) || [],
      };

      return adaptSupabaseProduct(productWithTags);
    } catch (error) {
      console.error('Error fetching product by id:', error);
      throw new Error('Erro ao carregar produto');
    }
  }

  /**
   * Filtra produtos por categoria
   */
  static async getByCategory(category: ProductCategory): Promise<Product[]> {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('available', true)
        .order('created_at', { ascending: false });

      if (category !== 'todos') {
        query = query.eq('category_slug', category);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Supabase error:', error);
        throw new Error('Erro ao filtrar produtos');
      }

      const productsWithTags = await addTagsToProducts(data || []);
      return adaptSupabaseProducts(productsWithTags);
    } catch (error) {
      console.error('Error filtering products by category:', error);
      throw new Error('Erro ao filtrar produtos');
    }
  }

  /**
   * Busca produtos por termo de pesquisa
   */
  static async search(query: string): Promise<Product[]> {
    try {
      if (!query.trim()) {
        return this.getAll();
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('available', true)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error('Erro ao buscar produtos');
      }

      const productsWithTags = await addTagsToProducts(data || []);
      return adaptSupabaseProducts(productsWithTags);
    } catch (error) {
      console.error('Error searching products:', error);
      throw new Error('Erro ao buscar produtos');
    }
  }

  /**
   * Filtra produtos por categoria e termo de pesquisa
   */
  static async filter(category: ProductCategory, query: string): Promise<Product[]> {
    try {
      let supabaseQuery = supabase
        .from('products')
        .select('*')
        .eq('available', true)
        .order('created_at', { ascending: false });

      if (category !== 'todos') {
        supabaseQuery = supabaseQuery.eq('category_slug', category);
      }

      if (query.trim()) {
        supabaseQuery = supabaseQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
      }

      const { data, error } = await supabaseQuery;

      if (error) {
        console.error('Supabase error:', error);
        throw new Error('Erro ao filtrar produtos');
      }

      const productsWithTags = await addTagsToProducts(data || []);
      return adaptSupabaseProducts(productsWithTags);
    } catch (error) {
      console.error('Error filtering products:', error);
      throw new Error('Erro ao filtrar produtos');
    }
  }

  /**
   * Retorna todas as categorias únicas
   */
  static async getCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('category_slug');

      if (error) {
        console.error('Supabase error:', error);
        throw new Error('Erro ao carregar categorias');
      }

      const categories = new Set(
        (data as { category_slug: string }[])?.map(p => p.category_slug) || []
      );
      return Array.from(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Erro ao carregar categorias');
    }
  }

  /**
   * Retorna produtos relacionados (mesma categoria, excluindo o produto atual)
   */
  static async getRelated(productId: string, limit: number = 4): Promise<Product[]> {
    try {
      const product = await this.getById(productId);
      if (!product) return [];

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_slug', product.category)
        .eq('available', true)
        .neq('id', productId)
        .limit(limit);

      if (error) {
        console.error('Supabase error:', error);
        throw new Error('Erro ao carregar produtos relacionados');
      }

      const productsWithTags = await addTagsToProducts(data || []);
      return adaptSupabaseProducts(productsWithTags);
    } catch (error) {
      console.error('Error fetching related products:', error);
      throw new Error('Erro ao carregar produtos relacionados');
    }
  }
}

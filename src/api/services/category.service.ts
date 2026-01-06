import { supabase } from '@/lib/supabase';

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  active: boolean;
}

/**
 * Serviço para gerenciar operações relacionadas a categorias
 */
export class CategoryService {
  /**
   * Retorna todas as categorias ativas
   */
  static async getAll(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('active', true)
        .order('name', { ascending: true });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error('Erro ao carregar categorias do banco de dados');
      }

      return (data || []) as Category[];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Erro ao carregar categorias');
    }
  }

  /**
   * Busca uma categoria específica pelo slug
   */
  static async getBySlug(slug: string): Promise<Category | undefined> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .eq('active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Not found
          return undefined;
        }
        console.error('Supabase error:', error);
        throw new Error('Erro ao carregar categoria');
      }

      return data as Category;
    } catch (error) {
      console.error('Error fetching category by slug:', error);
      throw new Error('Erro ao carregar categoria');
    }
  }

  /**
   * Busca uma categoria específica pelo ID
   */
  static async getById(id: string): Promise<Category | undefined> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Not found
          return undefined;
        }
        console.error('Supabase error:', error);
        throw new Error('Erro ao carregar categoria');
      }

      return data as Category;
    } catch (error) {
      console.error('Error fetching category by id:', error);
      throw new Error('Erro ao carregar categoria');
    }
  }
}

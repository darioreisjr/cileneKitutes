import { Product, ProductCategory } from '@/types';
import productsData from '@/data/products.json';

/**
 * Serviço para gerenciar operações relacionadas a produtos
 */
export class ProductService {
  /**
   * Retorna todos os produtos disponíveis
   */
  static async getAll(): Promise<Product[]> {
    try {
      // Simula delay de API
      await new Promise(resolve => setTimeout(resolve, 100));
      return productsData as Product[];
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
      const products = await this.getAll();
      return products.find(p => p.slug === slug);
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
      const products = await this.getAll();
      return products.find(p => p.id === id);
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
      const products = await this.getAll();

      if (category === 'todos') {
        return products.filter(p => p.available);
      }

      return products.filter(p => p.category === category && p.available);
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

      const products = await this.getAll();
      const lowerQuery = query.toLowerCase();

      return products.filter(p =>
        p.available && (
          p.name.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery) ||
          p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        )
      );
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
      const products = await this.getAll();
      const lowerQuery = query.toLowerCase();

      return products.filter(p => {
        const matchesCategory = category === 'todos' || p.category === category;
        const matchesSearch = !query.trim() ||
          p.name.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery) ||
          p.tags.some(tag => tag.toLowerCase().includes(lowerQuery));

        return p.available && matchesCategory && matchesSearch;
      });
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
      const products = await this.getAll();
      const categories = new Set(products.map(p => p.category));
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

      const products = await this.getAll();

      return products
        .filter(p =>
          p.id !== productId &&
          p.category === product.category &&
          p.available
        )
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching related products:', error);
      throw new Error('Erro ao carregar produtos relacionados');
    }
  }
}

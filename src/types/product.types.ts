export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  image: string;
  description: string;
  tags: string[];
  available: boolean;
}

export type ProductCategory = 'todos' | 'doces' | 'bolos' | 'tortas' | 'salgados' | 'bebidas';

export interface ProductFilters {
  category: ProductCategory;
  searchQuery: string;
  priceRange?: {
    min: number;
    max: number;
  };
  tags?: string[];
}

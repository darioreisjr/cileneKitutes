import { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Header } from '@/components/Header';
import { CategoryChips } from '@/components/CategoryChips';
import { ProductCard } from '@/components/ProductCard';
import { ProductCardSkeleton } from '@/components/ProductCardSkeleton';
import { Footer } from '@/components/Footer';
import products from '@/data/products.json';
import { Product } from '@/contexts/CartContext';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    return (products as Product[]).filter((product) => {
      const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch && product.available;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <section className="mb-8 animate-fade-in" aria-label="Apresentação">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 via-card to-accent/10 border border-border/50 p-6 md:p-8">
              <div className="relative z-10">
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Bem-vindo à <span className="text-gradient">Sabor Fome</span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-md">
                  Delícias caseiras feitas com amor. Escolha seus favoritos e peça agora!
                </p>
              </div>
              {/* Decorative elements */}
              <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
              <div className="absolute -right-5 -bottom-10 w-32 h-32 rounded-full bg-accent/20 blur-2xl" aria-hidden="true" />
            </div>
          </section>

          {/* Mobile/Tablet Search Bar */}
          <section className="mb-4 lg:hidden animate-slide-up" aria-label="Busca de produtos">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
              <input
                type="search"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Buscar produtos"
                className="w-full pl-11 pr-4 py-3 bg-secondary rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
          </section>

          {/* Categories and Desktop Search */}
          <section className="mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }} aria-label="Filtros de categoria e busca">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex-1">
                <CategoryChips selected={selectedCategory} onSelect={setSelectedCategory} />
              </div>

              {/* Desktop Search Bar */}
              <div className="hidden lg:block lg:w-80">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                  <input
                    type="search"
                    placeholder="Buscar produtos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Buscar produtos"
                    className="w-full pl-10 pr-4 py-2.5 bg-secondary rounded-full text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Products Grid */}
          <section aria-label="Lista de produtos">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" role="list">
                {Array.from({ length: 8 }).map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" role="list">
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${0.05 * index}s` }}
                    role="listitem"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 animate-fade-in">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Search className="w-16 h-16 text-muted-foreground" aria-hidden="true" />
                </div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                  Nenhum produto encontrado
                </h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Não encontramos produtos que correspondam à sua busca. Tente ajustar os filtros ou ver todos os produtos.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('todos');
                    setSearchQuery('');
                  }}
                  className="px-6 py-3 gradient-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity shadow-glow"
                  aria-label="Limpar filtros e ver todos os produtos"
                >
                  Ver todos os produtos
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;

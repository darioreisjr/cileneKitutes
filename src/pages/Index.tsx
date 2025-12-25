import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { CategoryChips } from '@/components/CategoryChips';
import { ProductCard } from '@/components/ProductCard';
import { Footer } from '@/components/Footer';
import products from '@/data/products.json';
import { Product } from '@/contexts/CartContext';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');

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
      <Header onSearch={setSearchQuery} />
      
      <main className="flex-1 pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <section className="mb-8 animate-fade-in">
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
              <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute -right-5 -bottom-10 w-32 h-32 rounded-full bg-accent/20 blur-2xl" />
            </div>
          </section>

          {/* Categories */}
          <section className="mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CategoryChips selected={selectedCategory} onSelect={setSelectedCategory} />
          </section>

          {/* Products Grid */}
          <section>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product, index) => (
                  <div 
                    key={product.id} 
                    className="animate-slide-up"
                    style={{ animationDelay: `${0.05 * index}s` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground">
                  Nenhum produto encontrado
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('todos');
                    setSearchQuery('');
                  }}
                  className="mt-4 px-6 py-2 gradient-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity"
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

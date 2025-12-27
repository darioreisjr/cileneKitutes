import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingBag, Star } from 'lucide-react';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { Footer } from '@/components/Footer';
import { useCart, Product } from '@/contexts/CartContext';
import { formatCurrency } from '@/utils/whatsapp';
import products from '@/data/products.json';
import { toast } from 'sonner';

const ProductDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = useMemo(() => {
    return (products as Product[]).find((p) => p.slug === slug);
  }, [slug]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return (products as Product[])
      .filter((p) => p.category === product.category && p.id !== product.id && p.available)
      .slice(0, 4);
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 pt-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-display font-bold text-foreground mb-4">
              Produto não encontrado
            </h1>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 gradient-primary text-primary-foreground rounded-full font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao catálogo
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`${quantity}x ${product.name} adicionado!`, {
      description: 'Confira seu carrinho',
      action: {
        label: 'Ver carrinho',
        onClick: () => window.location.href = '/carrinho',
      },
    });
    setQuantity(1);
  };

  const totalPrice = product.price * quantity;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        {/* Back Button */}
        <div className="container mx-auto px-4 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Voltar para o catálogo"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Voltar
          </Link>
        </div>

        {/* Product Section */}
        <section className="container mx-auto px-4 pb-8" aria-label="Detalhes do produto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="animate-fade-in">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-card border border-border/50">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.tags.includes('mais_vendido') && (
                  <div className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1.5 bg-accent text-accent-foreground rounded-full text-sm font-semibold">
                    <Star className="w-4 h-4" />
                    Mais Vendido
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="animate-slide-up">
              <div className="sticky top-24">
                <span className="text-sm text-primary font-medium uppercase tracking-wider">
                  {product.category}
                </span>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
                  {product.name}
                </h1>
                <p className="text-muted-foreground text-lg mb-6">
                  {product.description}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-success text-4xl font-bold">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="text-muted-foreground">
                    /{product.unit}
                  </span>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-foreground font-medium" id="quantity-label">Quantidade:</span>
                  <div className="flex items-center gap-2 bg-secondary rounded-full p-1" role="group" aria-labelledby="quantity-label">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      aria-label="Diminuir quantidade"
                      className="w-10 h-10 rounded-full flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                    >
                      <Minus className="w-5 h-5" aria-hidden="true" />
                    </button>
                    <span className="w-12 text-center font-bold text-xl text-foreground" aria-live="polite" aria-atomic="true">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      aria-label="Aumentar quantidade"
                      className="w-10 h-10 rounded-full flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                    >
                      <Plus className="w-5 h-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* Total & Add Button */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 bg-secondary rounded-lg p-4 text-center" role="status" aria-live="polite">
                    <span className="text-sm text-muted-foreground block">Total</span>
                    <span className="text-2xl font-bold text-success">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    aria-label={`Adicionar ${quantity} ${quantity === 1 ? 'unidade' : 'unidades'} de ${product.name} ao carrinho`}
                    className="flex-1 sm:flex-[2] flex items-center justify-center gap-3 px-6 py-4 gradient-primary text-primary-foreground rounded-lg font-bold text-lg shadow-glow hover:opacity-90 transition-all active:scale-[0.98]"
                  >
                    <ShoppingBag className="w-5 h-5" aria-hidden="true" />
                    Adicionar ao Carrinho
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="container mx-auto px-4 py-8 border-t border-border" aria-label="Produtos relacionados">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">
              Você também pode gostar
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4" role="list">
              {relatedProducts.map((relatedProduct, index) => (
                <div
                  key={relatedProduct.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${0.1 * index}s` }}
                  role="listitem"
                >
                  <ProductCard product={relatedProduct} />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetails;

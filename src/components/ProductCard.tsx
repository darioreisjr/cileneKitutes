import { Link } from 'react-router-dom';
import { Plus, Star, Sparkles, Percent } from 'lucide-react';
import { Product } from '@/contexts/CartContext';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/utils/whatsapp';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

const tagConfig: Record<string, { icon: React.ReactNode; label: string; className: string }> = {
  mais_vendido: {
    icon: <Star className="w-3 h-3" />,
    label: 'Mais Vendido',
    className: 'bg-accent text-accent-foreground',
  },
  novo: {
    icon: <Sparkles className="w-3 h-3" />,
    label: 'Novo',
    className: 'bg-success text-success-foreground',
  },
  promo: {
    icon: <Percent className="w-3 h-3" />,
    label: 'Promoção',
    className: 'bg-destructive text-destructive-foreground',
  },
};

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    toast.success(`${product.name} adicionado!`, {
      description: 'Veja seu carrinho',
      duration: 2000,
    });
  };

  const mainTag = product.tags[0];
  const tagInfo = mainTag ? tagConfig[mainTag] : null;

  return (
    <Link
      to={`/produto/${product.slug}`}
      className="group block"
    >
      <div className="relative bg-card rounded-lg overflow-hidden hover-lift border border-border/50">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badge */}
          {tagInfo && (
            <div className={cn(
              'absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold animate-scale-in',
              tagInfo.className
            )}>
              {tagInfo.icon}
              {tagInfo.label}
            </div>
          )}

          {/* Quick Add Button */}
          <button
            onClick={handleQuickAdd}
            className="absolute bottom-2 right-2 w-10 h-10 gradient-primary rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <Plus className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="font-display font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
            {product.description}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-success font-bold text-lg">
              {formatCurrency(product.price)}
            </span>
            <span className="text-xs text-muted-foreground">
              /{product.unit}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

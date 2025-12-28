import { memo } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem } from '@/types';
import { useCartStore } from '@/stores';
import { formatCurrency } from '@/utils/whatsapp';

interface CartItemRowProps {
  item: CartItem;
}

export const CartItemRow = memo(function CartItemRow({ item }: CartItemRowProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const { product, quantity } = item;
  const itemTotal = product.price * quantity;

  return (
    <div className="flex gap-4 p-4 bg-card rounded-lg border border-border/50 animate-fade-in">
      {/* Image */}
      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display font-semibold text-foreground line-clamp-1">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {formatCurrency(product.price)} / {product.unit}
            </p>
          </div>
          <button
            onClick={() => removeItem(product.id)}
            aria-label={`Remover ${product.name} do carrinho`}
            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Quantity & Total */}
        <div className="flex items-center justify-between mt-3">
          {/* Quantity Controls */}
          <div className="flex items-center gap-1 bg-secondary rounded-full p-1" role="group" aria-label={`Quantidade de ${product.name}`}>
            <button
              onClick={() => updateQuantity(product.id, quantity - 1)}
              aria-label={`Diminuir quantidade de ${product.name}`}
              className="w-8 h-8 rounded-full flex items-center justify-center text-foreground hover:bg-muted transition-colors"
            >
              <Minus className="w-4 h-4" aria-hidden="true" />
            </button>
            <span className="w-8 text-center font-semibold text-foreground" aria-live="polite" aria-atomic="true">
              {quantity}
            </span>
            <button
              onClick={() => updateQuantity(product.id, quantity + 1)}
              aria-label={`Aumentar quantidade de ${product.name}`}
              className="w-8 h-8 rounded-full flex items-center justify-center text-foreground hover:bg-muted transition-colors"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {/* Item Total */}
          <span className="text-success font-bold text-lg" aria-label={`Total: ${formatCurrency(itemTotal)}`}>
            {formatCurrency(itemTotal)}
          </span>
        </div>
      </div>
    </div>
  );
});

import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem } from '@/contexts/CartContext';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/utils/whatsapp';

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCart();
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
            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Quantity & Total */}
        <div className="flex items-center justify-between mt-3">
          {/* Quantity Controls */}
          <div className="flex items-center gap-1 bg-secondary rounded-full p-1">
            <button
              onClick={() => updateQuantity(product.id, quantity - 1)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-foreground hover:bg-muted transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-semibold text-foreground">
              {quantity}
            </span>
            <button
              onClick={() => updateQuantity(product.id, quantity + 1)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-foreground hover:bg-muted transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Item Total */}
          <span className="text-success font-bold text-lg">
            {formatCurrency(itemTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}

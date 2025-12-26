import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export function Header() {
  const { totalItems } = useCart();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/Logo.png"
              alt="Sabor Fome"
              className="w-10 h-10 object-contain"
            />
            <span className="font-display font-bold text-xl text-foreground sm:block">
              Sabor Fome
            </span>
          </Link>

          {/* Cart */}
          <Link
            to="/carrinho"
            className="relative p-2.5 rounded-full bg-secondary hover:bg-muted transition-colors group"
          >
            <ShoppingBag className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 gradient-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground animate-scale-in">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

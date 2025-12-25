import { Heart, Phone, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-sm">S</span>
            </div>
            <span className="font-display font-bold text-foreground">
              Sabor Fome
            </span>
          </div>

          {/* Contact */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a
              href="https://wa.me/5511999588073"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4" />
              (11) 99958-8073
            </a>
            <a 
              href="#" 
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Instagram className="w-4 h-4" />
              @cilenedoces
            </a>
          </div>

          {/* Made with love */}
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            Feito com <Heart className="w-4 h-4 text-destructive fill-destructive" /> em São Paulo
          </p>
        </div>
      </div>
    </footer>
  );
}

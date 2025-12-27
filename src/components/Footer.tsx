import { memo } from 'react';
import { Phone, Instagram } from 'lucide-react';

export const Footer = memo(function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <img
              src="/Logo.png"
              alt="Sabor Fome"
              className="w-8 h-8 object-contain"
            />
            <span className="font-display font-bold text-foreground">
              Sabor Fome
            </span>
          </div>

          {/* Contact */}
          <nav className="flex items-center gap-6 text-sm text-muted-foreground" aria-label="Contatos e redes sociais">
            <a
              href="https://wa.me/5511999588073"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-primary transition-colors"
              aria-label="WhatsApp (11) 99958-8073"
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              (11) 99958-8073
            </a>
            <a
              href="#"
              className="flex items-center gap-2 hover:text-primary transition-colors"
              aria-label="Instagram @saborfome"
            >
              <Instagram className="w-4 h-4" aria-hidden="true" />
              @saborfome
            </a>
          </nav>

          {/* Copyright */}
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            Criado por <a href="https://darioreis.dev/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Dario Reis</a>
          </p>
        </div>
      </div>
    </footer>
  );
});

import { X, ShoppingBag, User, MapPin, Wallet, MessageSquare, MessageCircle } from 'lucide-react';
import { CartItem } from '@/contexts/CartContext';
import { formatCurrency } from '@/utils/whatsapp';

interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  items: CartItem[];
  total: number;
  customerName: string;
  paymentMethod: string;
  address: string;
  observations: string;
  needsChange: boolean;
  changeFor: string;
  cardType: string;
}

export function OrderConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  items,
  total,
  customerName,
  paymentMethod,
  address,
  observations,
  needsChange,
  changeFor,
  cardType,
}: OrderConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card rounded-2xl border border-border/50 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border/50 px-6 py-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-primary" />
            Confirmar Pedido
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] px-6 py-4">
          {/* Items */}
          <div className="mb-6">
            <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-primary" />
              Itens do pedido
            </h3>
            <div className="space-y-2">
              {items.map((item) => {
                const itemTotal = item.product.price * item.quantity;
                return (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {item.quantity}x {item.product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency(item.product.price)} cada
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-foreground">
                      {formatCurrency(itemTotal)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-6 space-y-3">
            <div className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
              <User className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Nome</p>
                <p className="text-sm font-medium text-foreground">{customerName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
              <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Endereço de entrega</p>
                <p className="text-sm font-medium text-foreground">{address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
              <Wallet className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Forma de pagamento</p>
                <p className="text-sm font-medium text-foreground">
                  {paymentMethod}
                  {paymentMethod === 'Cartão' && cardType && ` (${cardType})`}
                  {paymentMethod === 'Dinheiro' && needsChange && changeFor && (
                    <span className="text-muted-foreground"> - Troco para {changeFor}</span>
                  )}
                </p>
              </div>
            </div>

            {observations && (
              <div className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                <MessageSquare className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Observações</p>
                  <p className="text-sm font-medium text-foreground">{observations}</p>
                </div>
              </div>
            )}
          </div>

          {/* Total */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground font-medium">{formatCurrency(total)}</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground">Taxa de entrega</span>
              <span className="text-success font-medium">A combinar</span>
            </div>
            <div className="flex items-center justify-between text-xl font-bold">
              <span className="text-foreground">Total</span>
              <span className="text-success">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card/95 backdrop-blur-sm border-t border-border/50 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-muted transition-all"
          >
            Revisar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 gradient-primary text-primary-foreground rounded-lg font-bold shadow-glow hover:opacity-90 transition-all active:scale-[0.98]"
          >
            <MessageCircle className="w-5 h-5" />
            Enviar no WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, MessageCircle } from 'lucide-react';
import { Header } from '@/components/Header';
import { CartItemRow } from '@/components/CartItemRow';
import { OrderForm } from '@/components/OrderForm';
import { OrderConfirmationModal } from '@/components/OrderConfirmationModal';
import { Footer } from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency, openWhatsApp } from '@/utils/whatsapp';
import { toast } from 'sonner';

const Cart = () => {
  const { state, total, clearCart } = useCart();
  const { items, customerName, paymentMethod, observations, address, needsChange, changeFor, cardType, residenceType, apartmentNumber, streetNumber } = state;
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleFinalize = () => {
    if (!customerName.trim()) {
      toast.error('Por favor, informe seu nome');
      return;
    }

    if (!address.trim()) {
      toast.error('Por favor, informe seu endereço completo');
      return;
    }

    if (!streetNumber.trim()) {
      toast.error('Por favor, informe o número da residência');
      return;
    }

    if (residenceType === 'Apartamento' && !apartmentNumber.trim()) {
      toast.error('Por favor, informe o número do apartamento');
      return;
    }

    if (items.length === 0) {
      toast.error('Seu carrinho está vazio');
      return;
    }

    // Show confirmation modal instead of sending directly
    setShowConfirmationModal(true);
  };

  const handleConfirmOrder = () => {
    openWhatsApp(items, total, customerName, paymentMethod, observations, address, needsChange, changeFor, cardType);
    setShowConfirmationModal(false);
    clearCart();
    toast.success('Pedido enviado!', {
      description: 'Obrigada pela preferência!',
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        {/* Back Button */}
        <div className="container mx-auto px-4 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Voltar para continuar comprando"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Continuar comprando
          </Link>
        </div>

        <section className="container mx-auto px-4 pb-8" aria-label="Carrinho de compras">
          <h1 className="font-display text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-primary" aria-hidden="true" />
            Seu Carrinho
          </h1>

          {items.length > 0 ? (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4" role="list" aria-label="Itens no carrinho">
                {items.map((item) => (
                  <div key={item.product.id} role="listitem">
                    <CartItemRow item={item} />
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 bg-card rounded-xl border border-border/50 p-6">
                  <h2 className="font-display text-xl font-bold text-foreground mb-6">
                    Resumo do Pedido
                  </h2>

                  {/* Order Form */}
                  <OrderForm />

                  {/* Total */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground font-medium">
                        {formatCurrency(total)}
                      </span>
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

                  {/* Finalize Button */}
                  <button
                    onClick={handleFinalize}
                    disabled={items.length === 0}
                    aria-label="Finalizar pedido e enviar pelo WhatsApp"
                    className="w-full mt-6 flex items-center justify-center gap-3 px-6 py-4 gradient-primary text-primary-foreground rounded-lg font-bold text-lg shadow-glow hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MessageCircle className="w-5 h-5" aria-hidden="true" />
                    Finalizar no WhatsApp
                  </button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Ao finalizar, você será direcionado para o WhatsApp
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 animate-fade-in" role="status" aria-live="polite">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-muted-foreground" aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                Carrinho vazio
              </h2>
              <p className="text-muted-foreground mb-6">
                Adicione produtos deliciosos ao seu carrinho!
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 gradient-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity"
                aria-label="Ver catálogo de produtos"
              >
                Ver catálogo
              </Link>
            </div>
          )}
        </section>
      </main>

      <Footer />

      {/* Order Confirmation Modal */}
      <OrderConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        onConfirm={handleConfirmOrder}
        items={items}
        total={total}
        customerName={customerName}
        paymentMethod={paymentMethod}
        address={address}
        observations={observations}
        needsChange={needsChange}
        changeFor={changeFor}
        cardType={cardType}
      />
    </div>
  );
};

export default Cart;

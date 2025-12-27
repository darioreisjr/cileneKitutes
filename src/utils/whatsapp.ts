import { CartItem } from '@/contexts/CartContext';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function generateOrderId(): string {
  const now = new Date();
  const date = now.toISOString().split('T')[0].replace(/-/g, '');
  const time = now.toTimeString().split(' ')[0].replace(/:/g, '').slice(0, 4);
  return `PDV-${date}-${time}`;
}

export function buildWhatsAppMessage(
  items: CartItem[],
  total: number,
  customerName: string,
  paymentMethod: string,
  observations: string,
  address: string,
  needsChange: boolean = false,
  changeFor: string = '',
  cardType: string = ''
): string {
  const orderId = generateOrderId();
  
  let message = `🍫 *SABOR FOME*\n`;
  message += `━━━━━━━━━━━━━━━━━\n`;
  message += `📋 *Pedido:* ${orderId}\n\n`;
  message += `*Itens do Pedido:*\n`;
  
  items.forEach((item) => {
    const itemTotal = item.product.price * item.quantity;
    message += `• ${item.quantity}x ${item.product.name}\n`;
    message += `  (${formatCurrency(item.product.price)}) = ${formatCurrency(itemTotal)}\n`;
  });
  
  message += `\n━━━━━━━━━━━━━━━━━\n`;
  message += `💰 *Total: ${formatCurrency(total)}*\n`;
  message += `━━━━━━━━━━━━━━━━━\n\n`;
  
  if (customerName) {
    message += `👤 *Nome:* ${customerName}\n`;
  }

  message += `💳 *Pagamento:* ${paymentMethod}`;

  // Add card type if payment is card
  if (paymentMethod === 'Cartão' && cardType) {
    message += ` (${cardType})`;
  }

  message += `\n`;

  // Add change information if payment is cash and needs change
  if (paymentMethod === 'Dinheiro' && needsChange && changeFor) {
    message += `💵 *Troco para:* ${changeFor}\n`;
  }

  if (address) {
    message += `📍 *Endereço:* ${address}\n`;
  }

  if (observations) {
    message += `📝 *Obs:* ${observations}\n`;
  }
  
  message += `\n🙏 Obrigada pela preferência!`;
  
  return message;
}

export function openWhatsApp(
  items: CartItem[],
  total: number,
  customerName: string,
  paymentMethod: string,
  observations: string,
  address: string,
  needsChange: boolean = false,
  changeFor: string = '',
  cardType: string = ''
): void {
  const message = buildWhatsAppMessage(items, total, customerName, paymentMethod, observations, address, needsChange, changeFor, cardType);
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
  window.open(url, '_blank');
}

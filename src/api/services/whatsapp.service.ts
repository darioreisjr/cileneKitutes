import { CartItem } from '@/types';
import { env } from '@/config/env';

/**
 * Serviço para integração com WhatsApp
 */
export class WhatsAppService {
  private static readonly PHONE_NUMBER = env.WHATSAPP_NUMBER;

  /**
   * Formata valor monetário para exibição
   */
  static formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  /**
   * Monta mensagem do pedido formatada
   */
  private static buildOrderMessage(
    items: CartItem[],
    total: number,
    customerName: string,
    paymentMethod: string,
    observations: string,
    address: string,
    needsChange: boolean,
    changeFor: string,
    cardType: string
  ): string {
    let message = `*🛍️ NOVO PEDIDO - SABOR FOME*\n\n`;
    message += `*👤 Cliente:* ${customerName}\n\n`;

    message += `*📦 ITENS DO PEDIDO:*\n`;
    items.forEach((item, index) => {
      message += `${index + 1}. *${item.product.name}*\n`;
      message += `   • Quantidade: ${item.quantity} ${item.product.unit}\n`;
      message += `   • Preço unitário: ${this.formatCurrency(item.product.price)}\n`;
      message += `   • Subtotal: ${this.formatCurrency(item.product.price * item.quantity)}\n\n`;
    });

    message += `*💰 VALOR TOTAL:* ${this.formatCurrency(total)}\n\n`;

    message += `*💳 FORMA DE PAGAMENTO:* ${paymentMethod}\n`;

    if (paymentMethod.includes('Cartão') && cardType) {
      message += `*💳 Tipo de Cartão:* ${cardType}\n`;
    }

    if (needsChange && changeFor) {
      message += `*💵 Troco para:* ${this.formatCurrency(parseFloat(changeFor))}\n`;
    }

    message += `\n*📍 ENDEREÇO DE ENTREGA:*\n${address}\n`;

    if (observations) {
      message += `\n*📝 OBSERVAÇÕES:*\n${observations}\n`;
    }

    message += `\n_Pedido realizado através do site Sabor Fome_`;

    return message;
  }

  /**
   * Codifica mensagem para URL
   */
  private static encodeMessage(message: string): string {
    return encodeURIComponent(message);
  }

  /**
   * Abre WhatsApp com mensagem do pedido
   */
  static sendOrder(
    items: CartItem[],
    total: number,
    customerName: string,
    paymentMethod: string,
    observations: string,
    address: string,
    needsChange: boolean,
    changeFor: string,
    cardType: string
  ): void {
    const message = this.buildOrderMessage(
      items,
      total,
      customerName,
      paymentMethod,
      observations,
      address,
      needsChange,
      changeFor,
      cardType
    );

    const encodedMessage = this.encodeMessage(message);
    const whatsappUrl = `https://wa.me/${this.PHONE_NUMBER}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  }

  /**
   * Verifica se o número do WhatsApp está configurado
   */
  static isConfigured(): boolean {
    return !!this.PHONE_NUMBER && this.PHONE_NUMBER !== '5511999999999';
  }
}

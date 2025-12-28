export type PaymentMethod = 'Pix' | 'Dinheiro' | 'Cartão Débito' | 'Cartão Crédito';
export type ResidenceType = 'Casa' | 'Apartamento';
export type CardType = 'Débito' | 'Crédito';

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  residenceType: ResidenceType;
  apartmentNumber?: string;
}

export interface OrderData {
  customerName: string;
  paymentMethod: PaymentMethod;
  observations?: string;
  address: string; // Endereço completo em string
  needsChange: boolean;
  changeFor?: string;
  cardType?: CardType;
  residenceType: ResidenceType;
  apartmentNumber?: string;
  streetNumber: string;
}

export interface OrderState extends OrderData {
  // Estado completo do pedido pode conter campos adicionais
}

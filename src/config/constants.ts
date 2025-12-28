import { PaymentMethod, ResidenceType, CardType } from '@/types';

export const APP_CONFIG = {
  APP_NAME: 'Sabor Fome',
  APP_DESCRIPTION: 'Doceria e Restaurante com Delivery',

  // Storage
  STORAGE_KEYS: {
    CART: 'sabor-fome-cart',
    USER_PREFERENCES: 'sabor-fome-preferences',
    THEME: 'sabor-fome-theme',
  },

  // WhatsApp
  WHATSAPP: {
    NUMBER: '5511999999999', // Substituir pelo número real
    MESSAGE_PREFIX: 'Olá! Gostaria de fazer um pedido:',
  },

  // Categories
  CATEGORIES: [
    { id: 'todos', label: 'Todos' },
    { id: 'doces', label: 'Doces' },
    { id: 'bolos', label: 'Bolos' },
    { id: 'tortas', label: 'Tortas' },
    { id: 'salgados', label: 'Salgados' },
    { id: 'bebidas', label: 'Bebidas' },
  ] as const,

  // Payment Methods
  PAYMENT_METHODS: [
    'Pix',
    'Dinheiro',
    'Cartão Débito',
    'Cartão Crédito',
  ] as const satisfies readonly PaymentMethod[],

  // Residence Types
  RESIDENCE_TYPES: [
    'Casa',
    'Apartamento',
  ] as const satisfies readonly ResidenceType[],

  // Card Types
  CARD_TYPES: [
    'Débito',
    'Crédito',
  ] as const satisfies readonly CardType[],

  // Delivery
  DELIVERY: {
    MIN_ORDER_VALUE: 20,
    ESTIMATED_TIME: '45-60 minutos',
  },

  // UI
  UI: {
    PRODUCTS_PER_PAGE: 12,
    SKELETON_COUNT: 8,
    LOADING_DELAY: 500, // ms
  },
} as const;

export const ROUTES = {
  HOME: '/',
  PRODUCT_DETAILS: (slug: string) => `/produto/${slug}`,
  CART: '/carrinho',
  NOT_FOUND: '*',
} as const;

export const MESSAGES = {
  SUCCESS: {
    ITEM_ADDED: 'Item adicionado ao carrinho',
    ITEM_REMOVED: 'Item removido do carrinho',
    ORDER_SENT: 'Pedido enviado com sucesso!',
    ORDER_SENT_DESCRIPTION: 'Obrigada pela preferência!',
  },
  ERROR: {
    REQUIRED_NAME: 'Por favor, informe seu nome',
    REQUIRED_ADDRESS: 'Por favor, informe seu endereço completo',
    REQUIRED_STREET_NUMBER: 'Por favor, informe o número da residência',
    REQUIRED_APARTMENT_NUMBER: 'Por favor, informe o número do apartamento',
    EMPTY_CART: 'Seu carrinho está vazio',
    INVALID_CEP: 'CEP inválido ou não encontrado',
    GENERIC_ERROR: 'Ocorreu um erro. Tente novamente.',
  },
  INFO: {
    NO_PRODUCTS_FOUND: 'Nenhum produto encontrado',
    EMPTY_CART_DESCRIPTION: 'Adicione produtos deliciosos ao seu carrinho!',
  },
} as const;

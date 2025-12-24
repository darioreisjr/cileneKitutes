import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  image: string;
  description: string;
  tags: string[];
  available: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  customerName: string;
  paymentMethod: string;
  observations: string;
  address: string;
}

type CartAction =
  | { type: 'ADD_ITEM'; product: Product; quantity: number }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CUSTOMER_NAME'; name: string }
  | { type: 'SET_PAYMENT_METHOD'; method: string }
  | { type: 'SET_OBSERVATIONS'; observations: string }
  | { type: 'SET_ADDRESS'; address: string }
  | { type: 'LOAD_CART'; state: CartState };

const initialState: CartState = {
  items: [],
  customerName: '',
  paymentMethod: 'Pix',
  observations: '',
  address: '',
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.product.id === action.product.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.product.id === action.product.id
              ? { ...item, quantity: item.quantity + action.quantity }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { product: action.product, quantity: action.quantity }],
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.product.id !== action.productId),
      };
    case 'UPDATE_QUANTITY':
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.product.id !== action.productId),
        };
      }
      return {
        ...state,
        items: state.items.map(item =>
          item.product.id === action.productId
            ? { ...item, quantity: action.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return { ...initialState };
    case 'SET_CUSTOMER_NAME':
      return { ...state, customerName: action.name };
    case 'SET_PAYMENT_METHOD':
      return { ...state, paymentMethod: action.method };
    case 'SET_OBSERVATIONS':
      return { ...state, observations: action.observations };
    case 'SET_ADDRESS':
      return { ...state, address: action.address };
    case 'LOAD_CART':
      return action.state;
    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setCustomerName: (name: string) => void;
  setPaymentMethod: (method: string) => void;
  setObservations: (observations: string) => void;
  setAddress: (address: string) => void;
  totalItems: number;
  subtotal: number;
  total: number;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = 'cilene-doces-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(STORAGE_KEY);
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', state: parsed });
      } catch (e) {
        console.error('Failed to load cart from localStorage');
      }
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addItem = (product: Product, quantity: number) => {
    dispatch({ type: 'ADD_ITEM', product, quantity });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const setCustomerName = (name: string) => {
    dispatch({ type: 'SET_CUSTOMER_NAME', name });
  };

  const setPaymentMethod = (method: string) => {
    dispatch({ type: 'SET_PAYMENT_METHOD', method });
  };

  const setObservations = (observations: string) => {
    dispatch({ type: 'SET_OBSERVATIONS', observations });
  };

  const setAddress = (address: string) => {
    dispatch({ type: 'SET_ADDRESS', address });
  };

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = subtotal; // Could add delivery fee here

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        setCustomerName,
        setPaymentMethod,
        setObservations,
        setAddress,
        totalItems,
        subtotal,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

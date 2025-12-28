import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { APP_CONFIG } from '@/config';

interface OrderStore {
  customerName: string;
  paymentMethod: string;
  observations: string;
  address: string;
  needsChange: boolean;
  changeFor: string;
  cardType: string;
  residenceType: string;
  apartmentNumber: string;
  streetNumber: string;
  setCustomerName: (name: string) => void;
  setPaymentMethod: (method: string) => void;
  setObservations: (observations: string) => void;
  setAddress: (address: string) => void;
  setNeedsChange: (needsChange: boolean) => void;
  setChangeFor: (changeFor: string) => void;
  setCardType: (cardType: string) => void;
  setResidenceType: (residenceType: string) => void;
  setApartmentNumber: (apartmentNumber: string) => void;
  setStreetNumber: (streetNumber: string) => void;
  clearOrder: () => void;
}

const initialOrderState = {
  customerName: '',
  paymentMethod: 'Pix',
  observations: '',
  address: '',
  needsChange: false,
  changeFor: '',
  cardType: '',
  residenceType: 'Casa',
  apartmentNumber: '',
  streetNumber: '',
};

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      ...initialOrderState,

      setCustomerName: (name) => set({ customerName: name }),
      setPaymentMethod: (method) => set({ paymentMethod: method }),
      setObservations: (observations) => set({ observations }),
      setAddress: (address) => set({ address }),
      setNeedsChange: (needsChange) => set({ needsChange }),
      setChangeFor: (changeFor) => set({ changeFor }),
      setCardType: (cardType) => set({ cardType }),
      setResidenceType: (residenceType) => set({ residenceType }),
      setApartmentNumber: (apartmentNumber) => set({ apartmentNumber }),
      setStreetNumber: (streetNumber) => set({ streetNumber }),

      clearOrder: () => set(initialOrderState),
    }),
    {
      name: `${APP_CONFIG.STORAGE_KEYS.CART}-order`,
    }
  )
);

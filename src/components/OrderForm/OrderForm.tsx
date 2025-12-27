import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { fetchAddressByCep, formatCep } from '@/utils/cep';
import { toast } from 'sonner';
import { CustomerNameInput } from './CustomerNameInput';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { ChangeSection } from './ChangeSection';
import { CardTypeSelector } from './CardTypeSelector';
import { CepInput } from './CepInput';
import { AddressFields } from './AddressFields';
import { ManualAddressInput } from './ManualAddressInput';
import { ObservationsInput } from './ObservationsInput';

const STORAGE_KEY = 'sabor-fome-address-data';

interface AddressData {
  logradouro: string;
  bairro: string;
  cidade: string;
}

interface SavedData {
  cep?: string;
  numero?: string;
  addressData?: AddressData;
  residenceType?: string;
  apartmentNumber?: string;
}

export function OrderForm() {
  const {
    state,
    setCustomerName,
    setPaymentMethod,
    setObservations,
    setAddress,
    setNeedsChange,
    setChangeFor,
    setCardType,
    setResidenceType,
    setApartmentNumber,
    setStreetNumber,
  } = useCart();

  const loadSavedAddressData = (): SavedData | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  const savedData = loadSavedAddressData();

  const [cep, setCep] = useState(savedData?.cep || '');
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [cepFound, setCepFound] = useState(!!savedData?.addressData);
  const [addressData, setAddressData] = useState<AddressData | null>(
    savedData?.addressData || null
  );

  useEffect(() => {
    if (savedData?.residenceType) {
      setResidenceType(savedData.residenceType);
    }
    if (savedData?.apartmentNumber) {
      setApartmentNumber(savedData.apartmentNumber);
    }
    if (savedData?.numero) {
      setStreetNumber(savedData.numero);
    }
  }, [savedData, setResidenceType, setApartmentNumber, setStreetNumber]);

  useEffect(() => {
    const dataToSave = {
      cep,
      numero: state.streetNumber,
      addressData,
      residenceType: state.residenceType,
      apartmentNumber: state.apartmentNumber,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [cep, state.streetNumber, addressData, state.residenceType, state.apartmentNumber]);

  useEffect(() => {
    if (addressData) {
      const parts = [
        addressData.logradouro,
        state.streetNumber ? `nº ${state.streetNumber}` : '',
        state.residenceType === 'Apartamento' && state.apartmentNumber
          ? `Apto ${state.apartmentNumber}`
          : '',
        addressData.bairro,
        addressData.cidade,
      ].filter(Boolean);
      setAddress(parts.join(', '));
    }
  }, [addressData, state.streetNumber, state.residenceType, state.apartmentNumber, setAddress]);

  const handleCepChange = async (value: string) => {
    const formatted = formatCep(value);
    setCep(formatted);
    setCepFound(false);
    setAddressData(null);

    const cleanCep = value.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      setIsLoadingCep(true);
      const data = await fetchAddressByCep(cleanCep);
      setIsLoadingCep(false);

      if (data) {
        setCepFound(true);
        setAddressData({
          logradouro: data.logradouro,
          bairro: data.bairro,
          cidade: `${data.localidade} - ${data.uf}`,
        });
        toast.success('Endereço encontrado!');
      } else {
        toast.error('CEP não encontrado');
      }
    }
  };

  return (
    <div className="space-y-4">
      <CustomerNameInput value={state.customerName} onChange={setCustomerName} />

      <PaymentMethodSelector value={state.paymentMethod} onChange={setPaymentMethod} />

      {state.paymentMethod === 'Dinheiro' && (
        <ChangeSection
          needsChange={state.needsChange}
          changeFor={state.changeFor}
          onNeedsChangeToggle={setNeedsChange}
          onChangeForUpdate={setChangeFor}
        />
      )}

      {state.paymentMethod === 'Cartão' && (
        <CardTypeSelector value={state.cardType} onChange={setCardType} />
      )}

      <CepInput
        value={cep}
        isLoading={isLoadingCep}
        found={cepFound}
        onChange={handleCepChange}
      />

      {addressData && (
        <AddressFields
          addressData={addressData}
          streetNumber={state.streetNumber}
          residenceType={state.residenceType}
          apartmentNumber={state.apartmentNumber}
          onStreetNumberChange={setStreetNumber}
          onResidenceTypeChange={setResidenceType}
          onApartmentNumberChange={setApartmentNumber}
        />
      )}

      {!addressData && <ManualAddressInput value={state.address} onChange={setAddress} />}

      <ObservationsInput value={state.observations} onChange={setObservations} />
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useOrderStore } from '@/stores';
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
  const customerName = useOrderStore((state) => state.customerName);
  const paymentMethod = useOrderStore((state) => state.paymentMethod);
  const observations = useOrderStore((state) => state.observations);
  const address = useOrderStore((state) => state.address);
  const needsChange = useOrderStore((state) => state.needsChange);
  const changeFor = useOrderStore((state) => state.changeFor);
  const cardType = useOrderStore((state) => state.cardType);
  const residenceType = useOrderStore((state) => state.residenceType);
  const apartmentNumber = useOrderStore((state) => state.apartmentNumber);
  const streetNumber = useOrderStore((state) => state.streetNumber);

  const setCustomerName = useOrderStore((state) => state.setCustomerName);
  const setPaymentMethod = useOrderStore((state) => state.setPaymentMethod);
  const setObservations = useOrderStore((state) => state.setObservations);
  const setAddress = useOrderStore((state) => state.setAddress);
  const setNeedsChange = useOrderStore((state) => state.setNeedsChange);
  const setChangeFor = useOrderStore((state) => state.setChangeFor);
  const setCardType = useOrderStore((state) => state.setCardType);
  const setResidenceType = useOrderStore((state) => state.setResidenceType);
  const setApartmentNumber = useOrderStore((state) => state.setApartmentNumber);
  const setStreetNumber = useOrderStore((state) => state.setStreetNumber);

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
      numero: streetNumber,
      addressData,
      residenceType: residenceType,
      apartmentNumber: apartmentNumber,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [cep, streetNumber, addressData, residenceType, apartmentNumber]);

  useEffect(() => {
    if (addressData) {
      const parts = [
        addressData.logradouro,
        streetNumber ? `nº ${streetNumber}` : '',
        residenceType === 'Apartamento' && apartmentNumber
          ? `Apto ${apartmentNumber}`
          : '',
        addressData.bairro,
        addressData.cidade,
      ].filter(Boolean);
      setAddress(parts.join(', '));
    }
  }, [addressData, streetNumber, residenceType, apartmentNumber, setAddress]);

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
      <CustomerNameInput value={customerName} onChange={setCustomerName} />

      <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />

      {paymentMethod === 'Dinheiro' && (
        <ChangeSection
          needsChange={needsChange}
          changeFor={changeFor}
          onNeedsChangeToggle={setNeedsChange}
          onChangeForUpdate={setChangeFor}
        />
      )}

      {paymentMethod === 'Cartão' && (
        <CardTypeSelector value={cardType} onChange={setCardType} />
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
          streetNumber={streetNumber}
          residenceType={residenceType}
          apartmentNumber={apartmentNumber}
          onStreetNumberChange={setStreetNumber}
          onResidenceTypeChange={setResidenceType}
          onApartmentNumberChange={setApartmentNumber}
        />
      )}

      {!addressData && <ManualAddressInput value={address} onChange={setAddress} />}

      <ObservationsInput value={observations} onChange={setObservations} />
    </div>
  );
}
